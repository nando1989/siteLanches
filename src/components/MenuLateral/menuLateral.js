"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation"; // IMPORTANTE!
import "./styles.css";

const MenuLateral = () => {
  const [menuAberto, setMenuAberto] = useState(true);
  const pathname = usePathname();

  // Extrai o nome da lanchonete da URL
  const pathParts = pathname.split("/");
  const nomeLanchonete = pathParts[2] || "lanchonete-default"; // Ajusta conforme o path

  return (
    <div className={`menu-lateral ${menuAberto ? "aberto" : "fechado"}`}>
      <button className="botao-menu" onClick={() => setMenuAberto(!menuAberto)}>
        {menuAberto ? "◄" : "►"}
      </button>

      {menuAberto && (
        <div className="conteudo-menu">
          <h2>Menu</h2>
          <ul>
            <li>
              <Link href={`/admin/${nomeLanchonete}/pedidos`} style={{ textDecoration: "none", color: "inherit" }}>Pedidos</Link>
            </li>
            <li>
              <Link href={`/admin/${nomeLanchonete}/produtos`} style={{ textDecoration: "none", color: "inherit" }}>Produtos</Link>
            </li>
            <li>
              <Link href={`/admin/${nomeLanchonete}/config`} style={{ textDecoration: "none", color: "inherit" }}>Configurações</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default MenuLateral;
