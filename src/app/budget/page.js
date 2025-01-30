"use client"

import React, { useState } from "react";
import "./styles.css";
import Navbar from "@/components/navbar/Navbar";
import html2canvas from "html2canvas";

export default function Budget() {
  const [formData, setFormData] = useState({
    nome: "",
    enderecoRetirada: "",
    enderecoEntrega: "",
    tipoVeiculo: "",
    opcionalMoto: "",
    tipoFrete: "",
    precisaAjudante: "",
    quantidadeAjudante: "",
    temParada: "",
    enderecoParada: "",
    data: "",
    horario: "",
    temEscada: "",
    quantidadeDegraus: "",
    precisaDesmontar: "",
    valor: "",
    observacaoMoto: "",
    quantidadeMoveis: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name === "tipoVeiculo" && value === "moto") {
        return {
          ...prevData,
          [name]: value,
          precisaAjudante: "",
          quantidadeAjudante: "",
          temEscada: "",
          quantidadeDegraus: "",
          precisaDesmontar: "",
          tipoFrete: "",
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const generateImage = () => {
    const element = document.getElementById("budget-summary");

    // Tornar visível antes da captura
    element.style.display = "block";

    setTimeout(() => {
      html2canvas(element, { useCORS: true, scale: 2 }).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png", 1.0); // Ajustando qualidade
        link.download = "orcamento.png";
        link.click();

        // Ocultar novamente após a captura
        // element.style.display = "none";
      });
    }, 500);
  };

  return (
    <div>
      <Navbar />
      <h2>Ordem de Serviço</h2>
      <form className="budget-form">

        <div className="containerInput">
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
              <option value="materialConstrucao">🧱Material de Construção</option>
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
          <input
            type="number"
            name="valor"
            placeholder="Valor"
            value={formData.valor}
            onChange={handleInputChange}
          />

          <button type="button" onClick={generateImage}>
            Gerar Orçamento
          </button>
        </div>
      </form>

      <div id="budget-summary" className="budget-summary">
        <div className="budget-title-h1">
          <h3 className="budget-title">Ordem de Serviço</h3>
        </div>
        <div className="customer-info">
          <h4>Dados do Cliente</h4>
          <p><strong>Nome:</strong> {formData.nome}</p>
          <p><strong>Endereço de Retirada:</strong> {formData.enderecoRetirada}</p>
          <p><strong>Endereço de Entrega:</strong> {formData.enderecoEntrega}</p>
        </div>

        <div className="transport-info">
          <h4>Detalhes do Transporte</h4>

          {formData.tipoVeiculo !== "moto" && (
            <>
              <p><strong>Precisa de Ajudante:</strong> {formData.precisaAjudante}</p>
              {formData.precisaAjudante === "sim" && (
                <p><strong>Quantidade de Ajudantes:</strong> {formData.quantidadeAjudante}</p>
              )}
              <p><strong>Tem Escada:</strong> {formData.temEscada}</p>
              {formData.temEscada === "sim" && (
                <p><strong>Quantidade de Degraus:</strong> {formData.mediaDegraus}</p>
              )}
            </>
          )}
        </div>

        <div className="schedule-info">
          <h4>Agendamento</h4>
          <p><strong>Data:</strong> {new Date(formData.data).toLocaleDateString()}</p>
          <p><strong>Horário:</strong> {formData.horario}</p>
        </div>

        <div className="cost-info">
          <h4>Detalhes do Valor</h4>
          <p><strong>Valor:</strong> R$ {parseFloat(formData.valor).toFixed(2)}</p>

        </div>
      </div>

    </div>
  );
}
