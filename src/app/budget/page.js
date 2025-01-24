"use client"

import React, { useState } from "react";
import "./styles.css";
import Navbar from "@/components/navbar/Navbar";

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
    precisaDesmontar: "",
    valor: "",
    observacaoMoto: "",
    quantidadeMoveis: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      // Limpa campos desnecessários se "Moto" for selecionado
      if (name === "tipoVeiculo" && value === "moto") {
        return {
          ...prevData,
          [name]: value,
          precisaAjudante: "",
          quantidadeAjudante: "",
          temEscada: "",
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

  return (
    <div>
      <Navbar/>
      <h2>Montar Orçamento</h2>
      <form className="budget-form">
        {/* Nome Completo */}
        <input
          type="text"
          name="nome"
          placeholder="Nome Completo"
          value={formData.nome}
          onChange={handleInputChange}
        />

        {/* Endereço de Retirada */}
        <input
          type="text"
          name="enderecoRetirada"
          placeholder="Endereço de Retirada"
          value={formData.enderecoRetirada}
          onChange={handleInputChange}
        />

        {/* Endereço de Entrega */}
        <input
          type="text"
          name="enderecoEntrega"
          placeholder="Endereço de Entrega"
          value={formData.enderecoEntrega}
          onChange={handleInputChange}
        />

        {/* Tipo de Veículo */}
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

        {/* Tipo de Carga (Moto) */}
        {formData.tipoVeiculo === "moto" && (
          <>
            <select
              name="opcionalMoto"
              value={formData.opcionalMoto}
              onChange={handleInputChange}
            >
              <option value="">Selecione o tipo de carga</option>
              <option value="itenscilios">Utensílios</option>
              <option value="lanche">Lanche</option>
              <option value="documentos">Documentos</option>
              <option value="encomendas">Encomendas</option>
              <option value="outros">Outros</option>
            </select>

            {formData.opcionalMoto === "outros" && (
              <textarea
                name="observacaoMoto"
                placeholder="Detalhe o tipo de mercadoria"
                value={formData.observacaoMoto}
                onChange={handleInputChange}
              ></textarea>
            )}
          </>
        )}

        {/* Tipo de Frete */}
        <select
          name="tipoFrete"
          value={formData.tipoFrete}
          onChange={handleInputChange}
        >
          <option value="">Selecione o tipo de frete</option>
          <option value="mudanca">Mudança</option>
          <option value="materialConstrucao">Material de Construção</option>
          <option value="moveis">Móveis</option>
        </select>

        {formData.tipoFrete === "moveis" && (
          <input
            type="number"
            name="quantidadeMoveis"
            placeholder="Quantidade de móveis"
            value={formData.quantidadeMoveis}
            onChange={handleInputChange}
          />
        )}

        {/* Precisa de Ajudante */}
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
          </>
        )}

        {/* Tem Escada */}
        {formData.tipoVeiculo !== "moto" && (
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
        )}

        {/* Precisa Desmontar */}
        {formData.tipoVeiculo !== "moto" && (
          <label>
            Precisa desmontar algo?
            <select
              name="precisaDesmontar"
              value={formData.precisaDesmontar}
              onChange={handleInputChange}
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </label>
        )}

        {/* Data */}
        <input
          type="date"
          name="data"
          value={formData.data}
          onChange={handleInputChange}
        />

        {/* Horário */}
        <input
          type="time"
          name="horario"
          value={formData.horario}
          onChange={handleInputChange}
        />

        {/* Valor */}
        <input
          type="number"
          name="valor"
          placeholder="Valor"
          value={formData.valor}
          onChange={handleInputChange}
        />

        <button type="submit">Gerar Orçamento</button>
      </form>
    </div>
  );
}
