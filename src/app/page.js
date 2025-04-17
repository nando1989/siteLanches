import Image from "next/image";
import Link from "next/link";
import "./page.css";

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <div className="logo">zaPPI</div>
        <nav className="nav">
          <Link href="#">Funcionalidades</Link>
          <Link href="#">Preços</Link>
          <Link href="#">Sobre</Link>
          <button className="loginButton">Entrar</button>
        </nav>
      </header>

      <main className="main">
        <h1 className="title">Seu delivery organizado, automático e sem complicação</h1>
        <p className="subtitle">
          zaPPI centraliza pedidos, agiliza entregas e turbina suas vendas com inteligência
        </p>
        <button className="ctaButton">Quero testar grátis</button>
        <Image
          src="/img-landinpage1.png"
          alt="Mockup zaPPI"
          width={360}
          height={600}
          className="heroImage"
        />
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} zaPPI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
