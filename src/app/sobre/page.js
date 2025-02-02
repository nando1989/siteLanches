"use client"

import Navbar from "@/components/navbar/Navbar";
import './styles.css';

export default function FormularioSerrafrete() {
  

  return (<>
    <Navbar />
    <div className="containerMotoPage">

      <img
        src="/sobre.png"
        alt="Caminhão de frete"
        className="motoImg"
      />
      <h1>Compromisso e Qualidade em Cada Frete.</h1>
      <p> Serrafrete nasceu de um sonho que começou em um balcão 
        de vendas. Foi ali, ouvindo histórias e desafios de cada 
        cliente, que percebemos uma necessidade real: encontrar 
        fretes confiáveis, feitos com cuidado e compromisso. 
        Inspirados por essas conversas e pela vontade de fazer a 
        diferença, decidimos criar mais do que uma solução de 
        transporte. Criamos uma ponte entre quem precisa e quem 
        entrega, com a certeza de que cada frete carrega não só 
        cargas, mas também confiança e dedicação. Aqui, cada 
        quilômetro percorrido tem um propósito: superar 
        expectativas e levar qualidade aonde for preciso.</p>
      
     
     
    </div></>
  )
}
