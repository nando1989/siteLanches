import Link from "next/link";
import './styles.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">Início</Link>
        </li>

        <li>
          <Link href="/sobre">Sobre</Link>
        </li>

        <li>
          <Link href="/contato">Contato</Link>
        </li>

        <li>
          <Link href="/login">Admin</Link>
        </li>
        
        

      </ul>
    </nav>
  );
}
