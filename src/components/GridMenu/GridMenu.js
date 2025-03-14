import Link from "next/link";
import './styles.css';

export default function GridMenu() {
  return (
    <div className="grid-container">
      <Link href="/moto" className="no-underline">
        <div className="grid-item">
          <div className="grid-img">
            < img
              
              alt="caminhao pequeno"
              className="imgMedium"
            />
          </div>

          <div className="textGrid">
            <h2>Hamburguer tradicional</h2>
            <p>O queridinho da casa</p>
            <button>Solicitar</button>
          </div>
        </div>
      </Link>
    </div>
  );
}
