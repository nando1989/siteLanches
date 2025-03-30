"use client"

import KanbanBoard from "@/components/KanbanBoard/kanbanBoard";
import './style.css';
import MenuLateral from "@/components/MenuLateral/menuLateral";

export default function Home() {
  return (
    <div className="container-pedidos">
      <MenuLateral/>
      <div className="card-kanban">
      <KanbanBoard />
      </div>
    </div>
  );
}