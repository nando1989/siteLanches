import KanbanBoard from "@/components/KanbanBoard/kanbanBoard";


export default function Home() {
  return (
    <div className="dashBoard">
      <div className="card-kanban">
      <KanbanBoard />
      </div>
    </div>
  );
}
