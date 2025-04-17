import Head from "next/head";
import Image from "next/image";
import "./page.css";

export default function Login() {
  return (
    <>
      <Head>
        <title>Login | zaPPI</title>
      </Head>
      <div className="login-container">
        <div className="login-box">
          <div className="logo-area">
            <Image src="/logo-black.png" alt="Logo zaPPI" width={200} height={200} />
            <h1>Entrar no zaPPI</h1>
          </div>
          <form className="login-form">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="seu@email.com" />

            <label htmlFor="password">Senha</label>
            <input type="password" id="password" placeholder="********" />

            <button type="submit">Entrar</button>
            <a href="#" className="forgot">Esqueceu a senha?</a>
          </form>
        </div>
        <div className="login-bg">
          <div className="img-logo-cap">
          <Image
              src="/logo-cap-black.webp"
              alt="Mockup zaPPI"
              width={60}
              height={50}
              margin-botton={50}
              className="heroImage"
            />
          </div>
          <div className="title-img">
            <h2>Acompanhe e gerencie seus pedidos</h2>
            <p>com um serviço, rápido, prático e digital</p>
          </div>
          <div className="img-box">
            <Image
              src="/img-land.webp"
              alt="Mockup zaPPI"
              width={900}
              height={650}
              margin-botton={50}
              className="heroImage"
            />
          </div>
        </div>
      </div>
    </>
  );
}
