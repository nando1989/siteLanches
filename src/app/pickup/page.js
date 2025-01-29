"use client"

import Navbar from "@/components/navbar/Navbar";
import './styles.css';
import React, { useState } from "react";

export default function FormularioSerrafrete() {
  const [formData, setFormData] = useState({
    nome: "",
    enderecoRetirada: "",
    enderecoEntrega: "",
    tipoFrete: "",
    quantidadeMoveis: "",
    precisaAjudante: "",
    quantidadeAjudante: "",
    temParada: "",
    enderecoParada: "",
    data: "",
    horario: "",
    temEscada: "",
    mediaDegraus: "",
    precisaDesmontar: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      nome,
      enderecoRetirada,
      enderecoEntrega,
      tipoFrete,
      quantidadeMoveis,
      precisaAjudante,
      quantidadeAjudante,
      temParada,
      enderecoParada,
      data,
      horario,
      temEscada,
      mediaDegraus,
      precisaDesmontar,
    } = formData;


    const mensagem = `
    *Solicitação de Frete*
  
            *Pickup* 
  
    👤 *Nome:* _${nome}_  
    📍 *Retirada:* _${enderecoRetirada}_  
    📍 *Entrega:* _${enderecoEntrega}_ 
    ⛔ *Parada:* _${temParada}_ ${temParada === "sim" ? `(rua _${enderecoParada}_)` : ""}   
    🚚 *Tipo de Frete:* _${tipoFrete}_  
    📦 *Quantidade de Móveis:* _${quantidadeMoveis || "N/A"}_  
    🤝 *Ajudante:* _${precisaAjudante}_ ${precisaAjudante === "sim" ? `(_${quantidadeAjudante}_ ajudante)` : ""}  
    📅 *Dados:* _${data}_ ⏰ Horário: _${horario}_  
    🪜 *Escada:* _${temEscada}_ ${temEscada === "sim" ? `(Média de degraus: _${mediaDegraus}_)` : ""}  
    🔧 *Desmontar algo:* _${precisaDesmontar}_  
  `;

    const url = `https://wa.me/5521977142180?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  return (<>
    <Navbar />
    <div className="containerLargePage">
      <img
        src="/estrada.png"
        alt="Caminhão de frete"
        className="motoImg"
      />
      <form className="freteLargeForm" onSubmit={handleSubmit}>
        <h2>Solicite seu Frete</h2>

        <div className="containerInput">
          <p>Nome completo</p>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="👤Seu nome completo"
            value={formData.nome}
            onChange={handleInputChange}
          />
        </div>

        <div className="containerInput">
          <p>🚚Endereço de retirada</p>
          <input
            type="text"
            id="enderecoRetirada"
            name="enderecoRetirada"
            placeholder="📍Adicione o endereço"
            value={formData.enderecoRetirada}
            onChange={handleInputChange}
          />
        </div>

        <div className="containerInput">
          <p>🏁Endereço de entrega</p>
          <input
            type="text"
            id="enderecoEntrega"
            name="enderecoEntrega"
            placeholder="📍Adicione o endereço"
            value={formData.enderecoEntrega}
            onChange={handleInputChange}
          />
        </div>

        <div className="containerInput">
          <p>🚩Tem parada?</p>
          <select
            id="temParada"
            name="temParada"
            value={formData.temParada}
            onChange={handleInputChange}
          >
            <option value="nao">👎🏼Não</option>
            <option value="sim">👍🏼Sim</option>

          </select>
          {formData.temParada === "sim" && (
            <input
              type="text"
              id="enderecoParada"
              name="enderecoParada"
              placeholder="🚩Endereço da parada"
              value={formData.enderecoParada}
              onChange={handleInputChange}
            />
          )}
        </div>

        <div className="containerInput">
          <p>📦Tipo de frete</p>
          <select
            id="tipoFrete"
            name="tipoFrete"
            value={formData.tipoFrete}
            onChange={handleInputChange}
          >
            <option value="mudanca">🏠Mudança</option>
            <option value="Material de Construcao">🧱Material de Construção</option>
            <option value="moveis">🪑Móveis</option>
          </select>

          {formData.tipoFrete === "moveis" && (
            <input
              type="number"
              id="quantidadeMoveis"
              name="quantidadeMoveis"
              placeholder="Quantidade de móveis"
              value={formData.quantidadeMoveis}
              onChange={handleInputChange}
            />
          )}
        </div>

        <div className="containerInput">
          <p>👷Precisa de Ajudante?</p>
          <select
            id="precisaAjudante"
            name="precisaAjudante"
            value={formData.precisaAjudante}
            onChange={handleInputChange}
          >
            <option value="nao">👎🏼Não</option>
            <option value="sim">👍🏼Sim</option>

          </select>
          {formData.precisaAjudante === "sim" && (
            <select
              id="quantidadeAjudante"
              name="quantidadeAjudante"
              value={formData.quantidadeAjudante}
              onChange={handleInputChange}
            >
              <option value="">Quantidade de ajudantes</option>
              {[...Array(5)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="containerInput">
          <p>🪜Tem escada?</p>
          <select
            id="temEscada"
            name="temEscada"
            value={formData.temEscada}
            onChange={handleInputChange}
          >
            <option value="nao">👎🏼Não</option>
            <option value="sim">👍🏼Sim</option>

          </select>
          {formData.temEscada === "sim" && (
            <>
              <select id="mediaDegraus" name="mediaDegraus" value={formData.mediaDegraus} onChange={handleInputChange}>
                <option value="">📊 Média de degraus</option>
                <option value="-50">🔹 Menos de 50</option>
                <option value="+50">🔹 50 a 99</option>
                <option value="+100">🔹 100 a 149</option>
                <option value="+150">🔹 150 ou mais</option>
              </select>
              <p className="textDegraus">A partir de 50 degraus, serão adicionados +1 ajudante a cada 50.</p>
            </>
          )}
        </div>
        <div className="containerInput">
          <p>🧑‍🔧Precisa de montador?</p>
          <select
            id="precisaDesmontar"
            name="precisaDesmontar"
            value={formData.precisaDesmontar}
            onChange={handleInputChange}
          >
            <option value="nao">👎🏼Não</option>
            <option value="sim">👍🏼Sim</option>

          </select>
        </div>

        <div className="containerDateLarge">
          <div className="containerTitleDateLarge">
            <label>📅selecione data e hora</label>
          </div>
          <div className="containerDataHoraLarge">
            <input
              type="date"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              className="horaLarge"
            />
            <input
              type="time"
              id="horario"
              name="horario"
              value={formData.horario}
              onChange={handleInputChange}
              className="dataLarge"
            /></div>
        </div>



        <button type="submit">Enviar Solicitação</button>
      </form>
    </div></>
  )
}
