import React from 'react';
import './styles.css'; // Importando o arquivo CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        

        <div className="footer-section">
          
        <div className="containerImgFooter">
          <img
            src="/logo.png"
            alt="logo"
            className="motoImgFooter"
          />
        </div>
          <h3 className="footer-title">Sobre a Serrafrete</h3>
          <p className="footer-text">
            Conectamos você aos melhores motoristas para garantir fretes com compromisso, qualidade e confiança.
            Nossa missão é simplificar sua logística com excelência.
          </p>
        </div>


        <div className="footer-section">
          <h3 className="footer-title">Links Úteis</h3>
          <ul className="footer-links">
            <li>
              <a href="/sobre" className="footer-link">Sobre Nós</a>
            </li>
            <li>
              <a href="/servicos" className="footer-link">Nossos Serviços</a>
            </li>
            <li>
              <a href="/contato" className="footer-link">Fale Conosco</a>
            </li>
          </ul>
        </div>


        <div className="footer-section">
          <h3 className="footer-title">Contato</h3>
          <p className="footer-text">
            Email: <a href="mailto:contato@serrafrete.com" className="footer-link">serrafrete@gmail.com</a>
          </p>
          <p className="footer-text">Telefone: (21)97714-2180</p>

        </div>
      </div>


      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} Serrafrete. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
