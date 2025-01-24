"use client"

import Navbar from "@/components/navbar/Navbar";
import './styles.css';

export default function FormularioSerrafrete() {
  

  return (<>
    <Navbar />
    <div className="containerMotoPage">

      <img
        src="/logo.png"
        alt="Caminhão de frete"
        className="motoImg"
      />
      <h1>CONTATO</h1>
      <p><strong>WhatsApp: </strong> 21977384132</p>
      <p><strong>Instagram: </strong>  @serrafrete</p>
      <p><strong>Fã Page: </strong> Serra Frete</p>
      <p><strong>Email: </strong>serrafrete@gmail.com</p>
      <p><strong>Localização: </strong>São pedro, Teresópolis, Rj</p>
     
     
    </div></>
  )
}
