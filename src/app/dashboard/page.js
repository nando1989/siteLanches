import KanbanBoard from "@/components/KanbanBoard/kanbanBoard";
import './style.css';

export default function Home() {
  return (
    <div className="dashBoard">
      <h1>Kanban de Pedidos</h1>
      <KanbanBoard />
    </div>
  );
}