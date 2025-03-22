import { Draggable } from "react-beautiful-dnd";
import KanbanCard from "../KanbanCard/kanbanCard";
import "./style.css";

const KanbanColumn = ({ title, pedidos }) => {
  return (
    <div className="column">
      <h2>{title}</h2>
      {pedidos.map((pedido, index) => (
        <Draggable key={pedido.id} draggableId={pedido.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <KanbanCard pedido={pedido} />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default KanbanColumn;
