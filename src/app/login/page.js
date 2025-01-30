"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Atualizado para App Router
import './styles.css';
import Navbar from "@/components/navbar/Navbar";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === "serrafrete" && password === "3641") {
      alert("Login bem-sucedido!");
      router.push("/budget");
    } else {
      alert("Credenciais inválidas!");
    }
  };

  return (<>
  <Navbar/>
    <div className="login-container">
    <img
        src="/logo.png"
        alt="Caminhão de frete"
        className="motoImg"
      />
      <h1>Administração</h1>
      <form onSubmit={handleLogin}>
        
        <input
          type="text"
          id="username"
          placeholder="Login"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <input
          type="password"
          id="password"
           placeholder="senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div></>
  );
}
