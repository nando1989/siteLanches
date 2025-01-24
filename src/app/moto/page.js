"use client";

import Navbar from "@/components/navbar/Navbar";
import './styles.css';
import React, { useState } from "react";

export default function FormularioSerrafrete() {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    enderecoRetirada: "",
    enderecoEntrega: "",
    tipoMaterial: "",
    nomeItemOutro: "",
    adicionarParada: "",
    enderecoParada: "",
    data: "",
    hora: "",
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
      nomeCompleto,
      enderecoRetirada,
      enderecoEntrega,
      tipoMaterial,
      nomeItemOutro,
      adicionarParada,
      enderecoParada,
      data,
      hora,
    } = formData;

    const mensagem = `
*Solicitação de Frete*

            *MOTO*        

👤 *Nome Completo:* ${nomeCompleto}
📍 *Endereço de Retirada:* ${enderecoRetirada}
📍 *Endereço de Entrega:* ${enderecoEntrega}
📦 *Tipo de Material:* ${tipoMaterial}${tipoMaterial === "outros" ? ` (Item: ${nomeItemOutro})` : ""}
⛔ *Adicionar Parada:* ${adicionarParada}${adicionarParada === "sim" ? ` (Endereço: ${enderecoParada})` : ""}
📅 *Data:* ${data}
⏰ *Hora:* ${hora}
`;

    const url = `https://wa.me/5521977142180?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Navbar />
      <div className="containerMotoPage">
        <img
          src="/moto.png"
          alt="Caminhão de frete"
          className="motoImg"
        />
       <div className="containerFormPage"><form className="freteMotoForm" onSubmit={handleSubmit}>
          <h2>Solicite seu Frete</h2>

          <input
            type="text"
            id="nomeCompleto"
            name="nomeCompleto"
            placeholder="👤Seu nome completo"
            value={formData.nomeCompleto}
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
            id="adicionarParada"
            name="adicionarParada"
            value={formData.adicionarParada}
            onChange={handleInputChange}
          >
            <option value="">🚩Adicionar parada</option>
            <option value="sim">👍🏼Sim</option>
            <option value="nao">👍🏼Não</option>
          </select>

          {formData.adicionarParada === "sim" && (
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
            id="tipoMaterial"
            name="tipoMaterial"
            value={formData.tipoMaterial}
            onChange={handleInputChange}
          >
            <option value="">Selecione o tipo de material</option>
            <option value="documento">Documento</option>
            <option value="encomendaFragil">Encomenda Frágil</option>
            <option value="lanche">Lanche</option>
            <option value="outros">Outros</option>
          </select>

          {formData.tipoMaterial === "outros" && (
            <input
              type="text"
              id="nomeItemOutro"
              name="nomeItemOutro"
              placeholder="Descreva o item"
              value={formData.nomeItemOutro}
              onChange={handleInputChange}
            />
          )}
         
          <div className="containerDateHour">
            <div className="containerTitleDate">
              <label>Escolha a data e a hora</label>
            </div>
            <div className="containerDateMoto">
              <input
                type="date"
                id="data"
                name="data"
                value={formData.data}
                onChange={handleInputChange}
                className="data"
              />

              <input
                type="time"
                id="hora"
                name="hora"
                value={formData.hora}
                onChange={handleInputChange}
                className="hora"
              /></div>
          </div>

          <button type="submit">Enviar Solicitação</button>
        </form></div> 
      </div>
    </>
  );
}
