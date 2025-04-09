"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { database } from "../../../firebaseConfig";
import { ref, onValue, update } from "firebase/database";
import "./style.css";

// Adicione props como parâmetro da função
const KanbanBoard = ({ nomeLanchonete = "default" }) => {
  const [pedidos, setPedidos] = useState([]);

  const buscarPedidos = () => {
    // Corrigindo o nome da variável para manter consistência
    const pedidosRef = ref(database, `${nomeLanchonete}/pedidos`);

    onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Dados recebidos:", data); // 👈 Adiciona isso aqui
      if (data) {
        const pedidosArray = Object.keys(data).map((key) => ({
          id: key,
          status: "novo",
          ...data[key],
        }));
        console.log("Array formatado:", pedidosArray);
        
        setPedidos(pedidosArray);
      }
    });

  };

  
  // Carrega os pedidos automaticamente ao iniciar
  useEffect(() => {
    buscarPedidos();
  }, []);

  // Função para atualizar o status do pedido ao soltar
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const pedidoId = active.id;
      const novoStatus = over.id;

      // Atualiza o status no Firebase
      // Atualiza o status no Firebase - Versão corrigida
      const pedidoRef = ref(database, `${nomeLanchonete}/pedidos/${pedidoId}`);
      update(pedidoRef, { status: novoStatus });

      // Atualiza o estado local
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
        )
      );
    }
  }, []);

  

  return (
    <div className="app-container">
      <div className="container-title-pedidos">
        <h2>Lista de Produtos</h2>
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {["novo", "preparando", "pronto", "na rua"].map((status) => (
            <Column key={status} status={status} pedidos={pedidos} />
            
          ))}

        </div>
      </DndContext>
    </div>
    
  );
};

// Os componentes Column e Card permanecem iguais
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

const handleExcluirPedido = async () => {
  try {
    if (window.confirm(`Tem certeza que deseja excluir o pedido de ${pedido.nome}?`)) {
      const pedidoRef = ref(database, `pedidos/${pedido.id}`);
      await remove(pedidoRef);

      // Chama a função de callback para notificar o componente pai
      if (onDelete) onDelete(pedido.id);
    }
  } catch (error) {
    console.error("Erro ao excluir pedido:", error);
    alert("Ocorreu um erro ao excluir o pedido");
  }
};

const Card = ({ pedido }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: pedido.id,
  });


  console.log("PEDIDOS FORMATADOS:", pedido);

  return (

    <>
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
        <div className="container-info-client">
          <p><strong>Nome:</strong> {pedido.nome || "N/A"}</p>
          <p><strong>Telefone:</strong> {pedido.telefone || "N/A"}</p>
          <p><strong>Pagamento:</strong> {pedido.paymentMethod || "N/A"}</p>
          <p><strong>Tipo de pedido:</strong> {pedido.tipoEntrega || "N/A"}</p>
          <p><strong>Endereço</strong> {pedido.endereco || ""}</p>
          <p><strong>Referência</strong> {pedido.referencia || ""}</p>
          <p><strong>Total:</strong> R$ {pedido.total ? pedido.total.toFixed(2) : "0.00"}</p>
        </div>
        <ul>
          {pedido.itens && pedido.itens.length > 0 ? (
            pedido.itens.map((item, index) => (
              <li key={index}>
                <strong>{item.name}: </strong>{item.quantity}<br></br>
                {item.observation && `Observação: ${item.observation}`}
              </li>
            ))
          ) : (
            <li>Nenhum item encontrado.</li>
          )}
        </ul>
        <div className="container-total">
          <p><strong>Total:</strong> R$ {pedido.total ? pedido.total.toFixed(2) : "0.00"}</p>
        </div>
      </div></>
  );
};

export default KanbanBoard;