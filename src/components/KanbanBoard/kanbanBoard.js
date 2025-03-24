"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { database } from "../../../firebaseConfig";
import { ref, onValue, update } from "firebase/database";
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

  // Função para atualizar o status do pedido ao soltar (memorizada com useCallback)
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const pedidoId = active.id;
      const novoStatus = over.id;

      // Atualiza o status no Firebase
      const pedidoRef = ref(database, `pedidos/${pedidoId}`);
      update(pedidoRef, { status: novoStatus });

      // Atualiza o estado local
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
        )
      );
    }
  }, []); // Array de dependências vazio para garantir que a função não seja recriada

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <button onClick={buscarPedidos} className="btn-buscar">
        🔄
      </button>
      <div className="kanban-board">
        {["Novo", "Preparando", "Pronto", "Na Rua"].map((status) => (
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
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : "",
      }}
    >
      <p>
        <strong>Nome:</strong> {pedido.nome || "N/A"}
      </p>
      <p>
        <strong>Telefone:</strong> {pedido.telefone || "N/A"}
      </p>
      <p>
        <strong>Pagamento:</strong> {pedido.paymentMethod || "N/A"}
      </p>
      <p>
        <strong>Entrega:</strong> {pedido.tipoEntrega || "N/A"}
      </p>
      <p>
        <strong>Total:</strong> R$ {pedido.total ? pedido.total.toFixed(2) : "0.00"}
      </p>
      <p>
        <strong>Itens:</strong>
      </p>
      <ul>
        {pedido.itens && pedido.itens.length > 0 ? (
          pedido.itens.map((item, index) => (
            <li key={index}>
              {item.name} - Quantidade: {item.quantity}  - Total: R$ {item.total.toFixed(2)}
            </li>
            <li key={index}>
               Observação: {item.observation}
            </li>
          ))
        ) : (
          <li>Nenhum item encontrado.</li>
        )}
      </ul>
    </div>
  );
};

export default KanbanBoard;
