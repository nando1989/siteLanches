"use client"

import React from 'react';
import { useState, useEffect } from "react";
import './styles.css'; // Importando o arquivo CSS
import { getDatabase, ref, get } from "firebase/database";




const Footer = ({ nomeLanchonete }) => {
  const [info, setInfo] = useState({});

  const fetchInfo = async () => {
    try {
      const db = getDatabase();
      const infoRef = ref(db, `${nomeLanchonete}/info`);
      const snapshot = await get(infoRef);

      if (snapshot.exists()) {
        setInfo(snapshot.val());
      } else {
        console.log(`Nenhuma informação encontrada em '${nomeLanchonete}/info'`);
      }
    } catch (error) {
      console.error("Erro ao buscar info:", error);
    }
  };

  useEffect(() => {
    if (nomeLanchonete) fetchInfo();
  }, [nomeLanchonete]);




  return (
    <footer className="footer">
      <div className="footer-container">


        <div className="footer-section">

          <div className="containerImgFooter">
            <img
              src="/logoLanches.png"
              alt="logo"
              className="motoImgFooter"
            />
          </div>
          <h3 className="footer-title">Quem somos.</h3>
          <p className="footer-text">
            {info.apresentacaoTopoSite || "Sem apresentação"}
          </p>
        </div>


        <div className="footer-section">
          <h3 className="footer-title">Links Úteis</h3>
          <ul className="footer-links">
            <li>
              <a href="/sobre" className="footer-link">Sobre Nós</a>
            </li>
            <li>
              <a href="/" className="footer-link">Nossos Serviços</a>
            </li>
            <li>
              <a href="/contato" className="footer-link">Fale Conosco</a>
            </li>
          </ul>
        </div>


        <div className="footer-section">
          <h3 className="footer-title">Contato</h3>
          <p className="footer-text">
          {info.emailRodape || "Sem apresentação"}
          </p>
          <p className="footer-text">{info.telefoneRodape || "Sem apresentação"}</p>

        </div>
      </div>


      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} SuperLanches. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
