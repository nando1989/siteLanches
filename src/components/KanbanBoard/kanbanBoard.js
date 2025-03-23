"use client";

import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { database } from "../../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import "./style.css";

const KanbanBoard = () => {
  const [pedidos, setPedidos] = useState([]);

  // Função para buscar pedidos
  const buscarPedidos = () => {
    const pedidosRef = ref(database, "pedidos");

    onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const pedidosArray = Object.keys(data).map((key) => ({
          id: key,
          status: data[key].status || "Novo",
          ...data[key],
        }));
        setPedidos(pedidosArray);
      }
    });
  };

  // Carrega os pedidos automaticamente ao iniciar
  useEffect(() => {
    buscarPedidos();
  }, []);

  return (
    <DndContext><button onClick={buscarPedidos} className="btn-buscar">🔄 </button>
      <div className="kanban-board">
        
        
        {["Novo", "Preparando", "Pronto"].map((status) => (
          <Column key={status} status={status} pedidos={pedidos} />
        ))}
      </div>
    </DndContext>
  );
};

const Column = ({ status, pedidos }) => {
  const { setNodeRef } = useDroppable({ id: status });

  const pedidosNaColuna = pedidos.filter((pedido) => pedido.status === status);

  return (
    <div ref={setNodeRef} className="kanban-column">
      <h2>{status}</h2>
      {pedidosNaColuna.length > 0 ? (
        pedidosNaColuna.map((pedido) => <Card key={pedido.id} pedido={pedido} />)
      ) : (
        <p>Sem pedidos</p>
      )}
    </div>
  );
};

const Card = ({ pedido }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: pedido.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="pedido-card"
      style={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : "",
      }}
    >
    
      <p><strong>Nome:</strong> {pedido.nome}</p>
      <p><strong>Telefone:</strong> {pedido.telefone}</p>
      <p><strong>Pagamento:</strong> {pedido.paymentMethod}</p>
      <p><strong>Entrega:</strong> {pedido.tipoEntrega}</p>
      <p><strong>Total:</strong> R$ {pedido.total.toFixed(2)}</p>
      <p><strong>Itens:</strong> {pedido.itens.length} produto(s)</p>
    </div>
  );
};

export default KanbanBoard;
