
import './styles.css';

export default function WhatsApp() {
  return (
      <a
        href="https://wa.me/5521977142180?text=_*Ola%20vim%20pelo%20site!*_"  
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
      >
        <img  className="whatsapp-button-img" src="/whatsapp-icon.png" alt="WhatsApp" />
      </a>

  )
}