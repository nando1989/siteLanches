"use client";

import { useState, useEffect } from "react";
import "./style.css";
import MenuLateral from "@/components/MenuLateral/menuLateral";
import { getDatabase, ref, onValue, set, get, remove } from "firebase/database";
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
    composition: "",
    section: "section1" // Novo campo para selecionar a seção
  });

  // Carrega os produtos do Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Carrega produtos de todas as seções
        const sections = ['section1', 'section2', 'section3'];
        let allProducts = [];

        for (const section of sections) {
          const sectionRef = ref(database, section);
          const snapshot = await get(sectionRef);

          if (snapshot.exists()) {
            const sectionProducts = Object.keys(snapshot.val()).map(key => ({
              id: key,
              section: section, // Adiciona a seção de origem
              ...snapshot.val()[key]
            }));
            allProducts = [...allProducts, ...sectionProducts];
          }
        }

        setProdutos(allProducts.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };

    loadProducts();
  }, []);

  // Função para gerar o próximo ID sequencial para uma seção
  const getNextId = async (section) => {
    try {
      const snapshot = await get(ref(database, section));

      if (!snapshot.exists()) return "01";

      const produtosData = snapshot.val();
      const ids = Object.keys(produtosData)
        .map(id => parseInt(id))
        .filter(id => !isNaN(id));

      if (ids.length === 0) return "01";

      const maxId = Math.max(...ids);
      const nextId = maxId + 1;

      return nextId.toString().padStart(2, '0');
    } catch (error) {
      console.error("Erro ao buscar próximo ID:", error);
      return "01";
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
      composition: "",
      section: "section1"
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

  // Excluir produto
  const excluirProduto = async () => {
    if (!produtoSelecionado || !window.confirm("Tem certeza que deseja excluir este produto?")) {
      return;
    }

    try {
      await remove(ref(database, `${produtoSelecionado.section}/${produtoSelecionado.id}`));
      fecharModal();
      // Atualiza a lista de produtos após exclusão
      setProdutos(produtos.filter(p => p.id !== produtoSelecionado.id));
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto");
    }
  };

  // Salvar edição de produto existente
  const salvarEdicao = async () => {
    if (!produtoSelecionado.name || !produtoSelecionado.description || !produtoSelecionado.price) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      await set(ref(database, `${produtoSelecionado.section}/${produtoSelecionado.id}`), {
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
      const novoId = await getNextId(novoProduto.section);

      await set(ref(database, `${novoProduto.section}/${novoId}`), {
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
          <div className="container-title-produtos">
            <h2>Lista de Produtos</h2>
          </div>
          <div className="container-btn-adicionar-produtos">
            <button className="btn-adicionar-produtos" onClick={abrirModalNovoProduto}>
            Adicionar Produto
          </button>
          </div>
        </div>

        {/* Tabela de produtos */}
        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Código</th>
              <th>Seção</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={`${produto.section}-${produto.id}`} onClick={() => abrirModal(produto)}>
                <td>{produto.id}</td>
                <td>{produto.section}</td>
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
                Seção:
                <select
                  name="section"
                  value={produtoSelecionado.section}
                  onChange={handleChange}
                  disabled // Não permitir mudar a seção de um produto existente
                >
                  <option value="section1">Sanduiches</option>
                  <option value="section2">HotDog</option>
                  <option value="section3">Bebidas</option>
                </select>
              </label>
              <label>
                Nome:
                <input
                  type="text"
                  name="name"
                  value={produtoSelecionado.name || ""}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Descrição:
                <input
                  type="text"
                  name="description"
                  value={produtoSelecionado.description || ""}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Preço:
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
                <button className="btn-excluir" onClick={excluirProduto}>
                  Excluir
                </button>
                <button className="btn-salvar" onClick={salvarEdicao}>Salvar</button>
                <button className="btn-cancelar" onClick={fecharModal}>Cancelar</button>
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
                Seção:
                <select
                  name="section"
                  value={novoProduto.section}
                  onChange={handleNovoProdutoChange}
                  required
                >
                  <option value="section1">Sanduiches</option>
                  <option value="section2">HotDog</option>
                  <option value="section3">Bebidas</option>
                </select>
              </label>
              <label>
                Nome:
                <input
                  type="text"
                  name="name"
                  value={novoProduto.name}
                  onChange={handleNovoProdutoChange}
                  required
                />
              </label>
              <label>
                Descrição:
                <input
                  type="text"
                  name="description"
                  value={novoProduto.description}
                  onChange={handleNovoProdutoChange}
                  required
                />
              </label>
              <label>
                Preço:
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
                <button className="btn-adicionar" onClick={adicionarNovoProduto}>Adicionar</button>
                <button className="btn-cancelar" onClick={fecharModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}