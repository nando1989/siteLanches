"use client";

import { useState } from "react";
import "./style.css";
import MenuLateral from "@/components/MenuLateral/menuLateral";

const produtosIniciais = [
  { codigo: 1, nome: "Hambúrguer", descricao: "Carne, queijo, pão", preco: 25.0 },
  { codigo: 2, nome: "Batata Frita", descricao: "Porção de batatas crocantes", preco: 15.0 },
  { codigo: 3, nome: "Refrigerante", descricao: "Lata 350ml", preco: 7.0 },
];

export default function Home() {
  const [produtos, setProdutos] = useState(produtosIniciais);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setProdutoSelecionado(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdutoSelecionado((prev) => ({ ...prev, [name]: value }));
  };

  const salvarEdicao = () => {
    setProdutos((prev) =>
      prev.map((p) => (p.codigo === produtoSelecionado.codigo ? produtoSelecionado : p))
    );
    fecharModal();
  };

  return (
    <div className="container-produtos">
      <MenuLateral />
      <div className="card-produtos">
        <h2>Lista de Produtos</h2>
        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.codigo} onClick={() => abrirModal(produto)}>
                <td>{produto.codigo}</td>
                <td>{produto.nome}</td>
                <td>{produto.descricao}</td>
                <td>R$ {produto.preco.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Produto</h3>
            <label>
              Nome:
              <input type="text" name="nome" value={produtoSelecionado.nome} onChange={handleChange} />
            </label>
            <label>
              Descrição:
              <input type="text" name="descricao" value={produtoSelecionado.descricao} onChange={handleChange} />
            </label>
            <label>
              Preço:
              <input type="number" name="preco" value={produtoSelecionado.preco} onChange={handleChange} />
            </label>
            <div className="modal-actions">
              <button onClick={salvarEdicao}>Salvar</button>
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
