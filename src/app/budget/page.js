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
        element.style.display = "none";
      });
    }, 500); // Pequeno atraso para renderizar corretamente
  };
  
  return (
    <div>
      <Navbar />
      <h2>Montar Orçamento</h2>
      <form className="budget-form">
        <input
          type="text"
          name="nome"
          placeholder="Nome Completo"
          value={formData.nome}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="enderecoRetirada"
          placeholder="Endereço de Retirada"
          value={formData.enderecoRetirada}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="enderecoEntrega"
          placeholder="Endereço de Entrega"
          value={formData.enderecoEntrega}
          onChange={handleInputChange}
        />
        <select
          name="tipoVeiculo"
          value={formData.tipoVeiculo}
          onChange={handleInputChange}
        >
          <option value="">Selecione o tipo de veículo</option>
          <option value="moto">Moto</option>
          <option value="pickup">Pickup</option>
          <option value="caminhaoPequeno">Caminhão Pequeno</option>
          <option value="caminhaoGrande">Caminhão Grande</option>
        </select>

        {formData.tipoVeiculo !== "moto" && (
          <>
            <label>
              Precisa de ajudante?
              <select
                name="precisaAjudante"
                value={formData.precisaAjudante}
                onChange={handleInputChange}
              >
                <option value="">Selecione</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </label>

            {formData.precisaAjudante === "sim" && (
              <select
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

            <label>
              Tem escada?
              <select
                name="temEscada"
                value={formData.temEscada}
                onChange={handleInputChange}
              >
                <option value="">Selecione</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </label>

            {formData.temEscada === "sim" && (
              <>
                <select
                  name="quantidadeDegraus"
                  value={formData.quantidadeDegraus}
                  onChange={handleInputChange}
                >
                  <option value="">Quantidade de degraus</option>
                  <option value="até 50">Até 50</option>
                  <option value="+50">Mais de 50</option>
                  <option value="+100">Mais de 100</option>
                  <option value="+150">Mais de 150</option>
                  <option value="+200">Mais de 200</option>
                </select>

                {formData.quantidadeDegraus === "+50" && (
                  <p style={{ color: "red" }}>
                    AVISO! A CADA 50 DEGRAUS, É NECESSÁRIO ACRESCENTAR +1 AJUDANTE!
                  </p>
                )}
              </>
            )}
          </>
        )}

        <input
          type="date"
          name="data"
          value={formData.data}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="horario"
          value={formData.horario}
          onChange={handleInputChange}
        />
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
      </form>

      <div id="budget-summary" className="orçamento" >
        <h3>Orçamento</h3>
        <p><strong>Nome:</strong> {formData.nome}</p>
        <p><strong>Endereço de Retirada:</strong> {formData.enderecoRetirada}</p>
        <p><strong>Endereço de Entrega:</strong> {formData.enderecoEntrega}</p>
        <p><strong>Tipo de Veículo:</strong> {formData.tipoVeiculo}</p>
        {formData.tipoVeiculo !== "moto" && (
          <>
            <p><strong>Precisa de Ajudante:</strong> {formData.precisaAjudante}</p>
            {formData.precisaAjudante === "sim" && (
              <p><strong>Quantidade de Ajudantes:</strong> {formData.quantidadeAjudante}</p>
            )}
            <p><strong>Tem Escada:</strong> {formData.temEscada}</p>
            {formData.temEscada === "sim" && (
              <p><strong>Quantidade de Degraus:</strong> {formData.quantidadeDegraus}</p>
            )}
          </>
        )}
        <p><strong>Data:</strong> {formData.data}</p>
        <p><strong>Horário:</strong> {formData.horario}</p>
        <p><strong>Valor:</strong> R$ {formData.valor}</p>
      </div>
    </div>
  );
}
