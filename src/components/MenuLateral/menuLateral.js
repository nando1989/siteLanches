import React, { useState } from 'react';
import Link from "next/link"; 
import "./styles.css";

const MenuLateral = () => {
  const [menuAberto, setMenuAberto] = useState(true); // Estado para controlar o menu

  return (
    <div className={`menu-lateral ${menuAberto ? "aberto" : "fechado"}`}>
      <button
        className="botao-menu"
        onClick={() => setMenuAberto(!menuAberto)}
      >
        {menuAberto ? "◄" : "►"}
      </button>

      {menuAberto && (
        <div className="conteudo-menu">
          <h2>Menu</h2>
          <ul>
            <li>
            <Link href="/admin/pedidos" style={{ textDecoration: "none", color: "inherit" }}> Pedidos  </Link>
            </li>
            <li>
              <Link href="/admin/produtos" style={{ textDecoration: "none", color: "inherit" }}>Produtos</Link>
            </li>
            <li>
              <Link href="/admin/configuracoes" style={{ textDecoration: "none", color: "inherit" }}>Configurações</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default MenuLateral;