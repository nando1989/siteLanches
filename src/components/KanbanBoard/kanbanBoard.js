"use client";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import KanbanForm from "../KanbanForm/kanbanForm";
import KanbanColumn from "../KanbanColumn/kanbanColumn";
import { criarPedido, buscarPedidos, atualizarPedido } from "../../services/firestoreservice";
import "./style.css";

const KanbanBoard = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function carregarPedidos() {
      const pedidosFirestore = await buscarPedidos();
      setPedidos(pedidosFirestore);
    }
    carregarPedidos();
  }, []);

  const handleAddPedido = async (novoPedido) => {
    const id = await criarPedido({ ...novoPedido, status: "Novo" });
    setPedidos([...pedidos, { ...novoPedido, id, status: "Novo" }]);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    await atualizarPedido(draggableId, destination.droppableId);

    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === draggableId ? { ...pedido, status: destination.droppableId } : pedido
      )
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board">
        <KanbanForm onSubmit={handleAddPedido} />

        {["Novo", "Preparando", "Pronto", "Entregue"].map((status) => (
          <Droppable
            key={status}
            droppableId={status}
            isDropDisabled={false}
            isCombineEnabled={true}
            ignoreContainerClipping={true}

          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <KanbanColumn title={status} pedidos={pedidos.filter(p => p.status === status)} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
