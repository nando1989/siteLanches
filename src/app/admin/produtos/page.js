"use client";

import { useState, useEffect } from "react";
import "./style.css";
import MenuLateral from "@/components/MenuLateral/menuLateral";
import { getDatabase, ref, onValue, set, get } from "firebase/database";
import { database } from "../../../../firebaseConfig";

export default function Home() {
  // Estados do componente
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalNovoProduto, setModalNovoProduto] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    name: "",
    description: "",
    price: "",
    composition: ""
  });

  // Carrega os produtos do Firebase
  useEffect(() => {
    const produtosRef = ref(database, "products");
    const unsubscribe = onValue(produtosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const produtosArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => parseInt(a.id) - parseInt(b.id));
        setProdutos(produtosArray);
      }
    });
    return () => unsubscribe();
  }, []);

  // Função para gerar o próximo ID sequencial
  const getNextId = async () => {
    try {
      const snapshot = await get(ref(database, 'products'));
      
      // Se não existir produtos, começa com 01
      if (!snapshot.exists()) return "01";
      
      const produtosData = snapshot.val();
      const ids = Object.keys(produtosData)
        .map(id => parseInt(id))
        .filter(id => !isNaN(id));
      
      // Se não houver IDs numéricos válidos, começa com 01
      if (ids.length === 0) return "01";
      
      // Encontra o maior ID e incrementa
      const maxId = Math.max(...ids);
      const nextId = maxId + 1;
      
      // Formata com 2 dígitos
      return nextId.toString().padStart(2, '0');
    } catch (error) {
      console.error("Erro ao buscar próximo ID:", error);
      return "01"; // Fallback seguro
    }
  };

  // Funções para abrir/fechar modais
  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setModalAberto(true);
  };

  const abrirModalNovoProduto = () => {
    setModalNovoProduto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setModalNovoProduto(false);
    setProdutoSelecionado(null);
    setNovoProduto({
      name: "",
      description: "",
      price: "",
      composition: ""
    });
  };

  // Manipuladores de formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdutoSelecionado(prev => ({ ...prev, [name]: value }));
  };

  const handleNovoProdutoChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto(prev => ({ 
      ...prev, 
      [name]: name === "price" ? value : value 
    }));
  };

  // Salvar edição de produto existente
  const salvarEdicao = async () => {
    if (!produtoSelecionado.name || !produtoSelecionado.description || !produtoSelecionado.price) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      await set(ref(database, `products/${produtoSelecionado.id}`), {
        name: produtoSelecionado.name,
        description: produtoSelecionado.description,
        price: parseFloat(produtoSelecionado.price),
        composition: produtoSelecionado.composition || ""
      });
      fecharModal();
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      alert("Erro ao salvar edição");
    }
  };

  // Adicionar novo produto
  const adicionarNovoProduto = async () => {
    if (!novoProduto.name || !novoProduto.description || !novoProduto.price) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const novoId = await getNextId();
      console.log("Novo ID gerado:", novoId);
      
      await set(ref(database, `products/${novoId}`), {
        name: novoProduto.name,
        description: novoProduto.description,
        price: parseFloat(novoProduto.price),
        composition: novoProduto.composition || ""
      });

      fecharModal();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro ao adicionar produto. Verifique o console.");
    }
  };

  // Renderização do componente
  return (
    <div className="container-produtos">
      <MenuLateral />
      <div className="card-produtos">
        <div className="header-tabela">
          <h2>Lista de Produtos</h2>
          <button className="btn-adicionar" onClick={abrirModalNovoProduto}>
            Adicionar Produto
          </button>
        </div>
        
        {/* Tabela de produtos */}
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
              <tr key={produto.id} onClick={() => abrirModal(produto)}>
                <td>{produto.id}</td>
                <td>{produto.name}</td>
                <td>{produto.description}</td>
                <td>R$ {produto.price ? produto.price.toFixed(2) : "0.00"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal de Edição */}
        {modalAberto && produtoSelecionado && (
          <div className="modal">
            <div className="modal-content">
              <h3>Editar Produto</h3>
              <label>
                Nome: *
                <input
                  type="text"
                  name="name"
                  value={produtoSelecionado.name || ""}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Descrição: *
                <input
                  type="text"
                  name="description"
                  value={produtoSelecionado.description || ""}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Preço: *
                <input
                  type="number"
                  name="price"
                  value={produtoSelecionado.price || ""}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </label>
              <label>
                Composição:
                <input
                  type="text"
                  name="composition"
                  value={produtoSelecionado.composition || ""}
                  onChange={handleChange}
                />
              </label>
              <div className="modal-actions">
                <button onClick={salvarEdicao}>Salvar</button>
                <button onClick={fecharModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Novo Produto */}
        {modalNovoProduto && (
          <div className="modal">
            <div className="modal-content">
              <h3>Adicionar Novo Produto</h3>
              <label>
                Nome: *
                <input
                  type="text"
                  name="name"
                  value={novoProduto.name}
                  onChange={handleNovoProdutoChange}
                  required
                />
              </label>
              <label>
                Descrição: *
                <input
                  type="text"
                  name="description"
                  value={novoProduto.description}
                  onChange={handleNovoProdutoChange}
                  required
                />
              </label>
              <label>
                Preço: *
                <input
                  type="number"
                  name="price"
                  value={novoProduto.price}
                  onChange={handleNovoProdutoChange}
                  step="0.01"
                  min="0"
                  required
                />
              </label>
              <label>
                Composição:
                <input
                  type="text"
                  name="composition"
                  value={novoProduto.composition}
                  onChange={handleNovoProdutoChange}
                />
              </label>
              <div className="modal-actions">
                <button onClick={adicionarNovoProduto}>Adicionar</button>
                <button onClick={fecharModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}