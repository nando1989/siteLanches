import Link from "next/link";
import './styles.css';
import Image from 'next/image';

export default function GridMenu() {
  return (
    <div className="grid-container">
      <Link href="/moto" className="no-underline">
        <div className="grid-item">
          <div className="grid-img">
            < img
              src="/moto.png"
              alt="caminhao pequeno"
              className="imgMedium"
            />
          </div>
          <div className="textGrid">
            <h2>Moto</h2>
            <p>ideal para pequenos trajetos, onde há nescessidade de uma entrega mais rápida.</p>
            <button>Solicitar</button>
          </div>
        </div>
      </Link>

      <Link href="/pickup" className="no-underline">
        <div className="grid-item">
          <div className="grid-img">
            < img
              src="/estrada.png"
              alt="caminhao pequeno"
              className="imgMedium"
            />
          </div>
          <div className="textGrid">
            <h2>Pickup</h2>
            <p>Ideal para transportar móveis como cama, sofá, rack, mesas, cadeiras e outros...</p>
            <button>Solicitar</button>
          </div>
        </div>
      </Link>

      <Link href="/medium" className="no-underline">
        <div className="grid-item">
          <div className="grid-img">
            < img
              src="/caminhaop.png"
              alt="caminhao pequeno"
              className="imgMedium"
            />
          </div>
          <div className="textGrid">
            <h2>Caminhão P</h2>
            <p>Ideal para pequenas mudanças, onde a quantidade de móveis é pequena.</p>
            <button>Solicitar</button>
          </div>
        </div>
      </Link>

      <Link href="/large" className="no-underline" >
        <div className="grid-item">
          <div className="grid-img">
            < img
              src="/caminhaog.png"
              alt="caminhao pequeno"
              className="imgMedium"
            /></div>
          <div className="textGrid">
            <div>
              <h2>Caminhão G</h2>
            </div>
            <div>
              <p>o Caminhão grande é ideal para mudanças de grande porte e para trajetos curtos ou longos.</p>
            </div>
            <button>Solicitar</button>
          </div>
        </div>
      </Link>
    </div>
  );
}
