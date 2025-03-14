import React from 'react';
import './styles.css'; // Importando o arquivo CSS

const Footer = () => {
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
          <h3 className="footer-title">Sobre a Super Lanches</h3>
          <p className="footer-text">
            A melhor lanchonete da região, com um atendimento super rápido e uma entrega masi rápida ainda..
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
            Email: <a href="mailto:contato@serrafrete.com" className="footer-link">superlanches@gmail.com</a>
          </p>
          <p className="footer-text">Telefone: (21)97714-2180</p>

        </div>
      </div>


      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} SuperLanches. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
