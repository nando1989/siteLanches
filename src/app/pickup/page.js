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
      precisaDesmontar,

    } = formData;

    const mensagem = `
  *Solicitação de Frete*
       
         *Carro pequeno*

  👤 *Nome:* _${nome}_  
  📍 *Retirada:* _${enderecoRetirada}_  
  📍 *Entrega:* _${enderecoEntrega}_  
  🚚 *Tipo de Frete:* _${tipoFrete}_  
  📦 *Quantidade de Móveis:* _${quantidadeMoveis || "N/A"}_  
  🤝 *Ajudante:* _${precisaAjudante}_ ${precisaAjudante === "sim" ? `(_${quantidadeAjudante}_ ajudante)` : ""}  
  ⛔ *Parada:* _${temParada}_ ${temParada === "sim" ? `(rua _${enderecoParada}_)` : ""}  
  📅 *Dados:* _${data}_ ⏰ Horário: _${horario}_  
  🪜 *Escada:* _${temEscada}_  
  🔧 *Desmontar algo:* _${precisaDesmontar}_  
`;



    const url = `https://wa.me/5521977142180?text==${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  return (<>
    <Navbar />
    <div className="containerPickupPage">

      <img
        src="/estrada.png"
        alt="Caminhão de frete"
        className="motoImg"
      />
      <form className="fretepickupForm" onSubmit={handleSubmit}>
        <h2>Solicite seu Frete</h2>


        <input
          type="text"
          id="nome"
          name="nome"
          placeholder="👤Seu nome completo"
          value={formData.nome}
          onChange={handleInputChange}
        />


        <input
          type="text"
          id="enderecoRetirada"
          name="enderecoRetirada"
          placeholder="📍Endereço de retirada"
          value={formData.enderecoRetirada}
          onChange={handleInputChange}
        />

        <input
          type="text"
          id="enderecoEntrega"
          name="enderecoEntrega"
          placeholder="📍Endereço de entrega"
          value={formData.enderecoEntrega}
          onChange={handleInputChange}
        />

        <select
          id="temParada"
          name="temParada"
          value={formData.temParada}
          onChange={handleInputChange}
        >
          <option value="">🚩Adicionar parada?</option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>

        {formData.temParada === "sim" && (
          <input
            type="text"
            id="enderecoParada"
            name="enderecoParada"
            placeholder="Endereço da parada"
            value={formData.enderecoParada}
            onChange={handleInputChange}
          />
        )}

        <select
          id="tipoFrete"
          name="tipoFrete"
          value={formData.tipoFrete}
          onChange={handleInputChange}
        >
          <option value="">📦Selecione o tipo de frete</option>
          <option value="mudanca">Mudança</option>
          <option value="materialConstrucao">Material de Construção</option>
          <option value="moveis">Móveis</option>
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


        <select
          id="precisaAjudante"
          name="precisaAjudante"
          value={formData.precisaAjudante}
          onChange={handleInputChange}
        >
          <option value="">👷precisa de ajudante</option>
          <option value="sim">👍🏼Sim</option>
          <option value="nao">👎🏼Não</option>
        </select>

        {formData.precisaAjudante === "sim" && (
          <select
            id="quantidadeAjudante"
            name="quantidadeAjudante"
            value={formData.quantidadeAjudante}
            onChange={handleInputChange}
          >
            <option value="">👷Quantidade de ajudantes</option>
            {[...Array(5)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        )}

        <select
          id="temEscada"
          name="temEscada"
          value={formData.temEscada}
          onChange={handleInputChange}
        >
          <option value="">🪜Tem escada?</option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>


        <select
          id="precisaDesmontar"
          name="precisaDesmontar"
          value={formData.precisaDesmontar}
          onChange={handleInputChange}
        >
          <option value="">🧑‍🔧Precisa de montador?</option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>



        <div className="containerDateHourMedium">
          <div className="containerPickupDate">
            <label>Escolha a data e a hora</label>
          </div>
          <div className="containerPickupDateHora">
            <input
              type="date"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
            />


            <input
              type="time"
              id="horario"
              name="horario"
              value={formData.horario}
              onChange={handleInputChange}
            />
          </div>
        </div>



        <button type="submit">Enviar Solicitação</button>
      </form>
    </div></>
  )
}
