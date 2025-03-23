import KanbanBoard from "@/components/KanbanBoard/kanbanBoard";
import './style.css';

export default function Home() {
  return (
    <div className="dashBoard">
      <div className="card-kanban">
      <h1>pedidos</h1>
      <KanbanBoard />
      </div>
    </div>
  );
}