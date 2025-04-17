"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import "./style.css";
import MenuLateral from "@/components/MenuLateral/menuLateral";
import { getDatabase, ref, onValue, set, get, remove, push } from "firebase/database";
import { database, storage, app } from "../../../../../firebaseConfig"; // Adicione storage aqui
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { usePathname } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {

  const pathname = usePathname();
  const storage = getStorage(app);
  const params = useParams();
  const empresa = params.empresa;


  const nomeLanchonete = useMemo(() => {
    const parts = pathname.split("/");
    return parts[2] || "default";
  }, [pathname]);

  const [produtos, setProdutos] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [modalNovoProduto, setModalNovoProduto] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);


  // No estado do produtoSelecionado e novoProduto, adicione:
  const [produtoSelecionado, setProdutoSelecionado] = useState({
    name: "",
    description: "",
    price: "",
    composition: "",
    options: "",
    upsell: "",
    opcionais: "",
    adicionais: "",
    section: "section1",
    imageUrl: "",
    temMetade: false,
    tamanhos: [],
    tamanhoLabel: "Tamanho",
    fatiasLabel: "Fatias"
  });

  const [novoProduto, setNovoProduto] = useState({
    name: "",
    description: "",
    price: "",
    composition: "",
    options: "",
    upsell: "",
    opcionais: "",
    adicionais: "",
    section: "section1",
    imageUrl: "",
    temMetade: false,
    tamanhos: [],
    tamanhoLabel: "Tamanho",
    fatiasLabel: "Fatias"
  });

  // Adicione estas funções no seu componente
  const adicionarTamanho = () => {
    // Verifica se os campos estão preenchidos
    if (!novoTamanho?.nome?.trim() || isNaN(parseFloat(novoTamanho.preco))) {
      alert('Preencha nome e preço válidos para o tamanho');
      return;
    }

    const novoTamanhoObj = {
      nome: novoTamanho.nome.trim(),
      preco: parseFloat(novoTamanho.preco)
    };

    if (modalAberto) {
      setProdutoSelecionado(prev => ({
        ...prev,
        tamanhos: [...(prev.tamanhos || []), novoTamanhoObj]
      }));
    } else {
      setNovoProduto(prev => ({
        ...prev,
        tamanhos: [...(prev.tamanhos || []), novoTamanhoObj]
      }));
    }

    setNovoTamanho({ nome: "", preco: "" });
  };
  const removerTamanho = (index) => {
    if (modalAberto) {
      setProdutoSelecionado(prev => {
        const novosTamanhos = [...(prev.tamanhos || [])];
        novosTamanhos.splice(index, 1);
        return { ...prev, tamanhos: novosTamanhos };
      });
    } else {
      setNovoProduto(prev => {
        const novosTamanhos = [...(prev.tamanhos || [])];
        novosTamanhos.splice(index, 1);
        return { ...prev, tamanhos: novosTamanhos };
      });
    }
  };

  // Adicione também um estado para gerenciar os tamanhos temporários
  const [novoTamanho, setNovoTamanho] = useState({
    nome: "",
    preco: ""
  });

  // Estados para criação de nova seção
  const [showNovaSecao, setShowNovaSecao] = useState(false);
  const [novaSecaoNome, setNovaSecaoNome] = useState("");
  const [sections, setSections] = useState({
  });

  // Função para fazer upload da imagem
  const handleImageUpload = async (file, nomeLanchonete) => {
    if (!file || !nomeLanchonete) return null;

    try {
      const fileRef = ref(storage, `${nomeLanchonete}/produtos/${uuidv4()}-${file.name}`);

      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return null;
    }
  };


  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);

  };

  // Função para obter o próximo ID de produto
  const getNextId = async (section) => {
    try {
      const sectionRef = ref(database, `${nomeLanchonete}/categories/${section}`);
      const snapshot = await get(sectionRef);

      if (!snapshot.exists()) return "01";

      const produtosData = snapshot.val();
      const ids = Object.keys(produtosData)
        .filter(key => key !== 'name') // Ignora o campo 'name' da seção
        .map(id => parseInt(id))
        .filter(id => !isNaN(id));

      if (ids.length === 0) return "01";

      const maxId = Math.max(...ids);
      const nextId = maxId + 1;
      return nextId.toString().padStart(2, '0'); // Formata com 2 dígitos (01, 02, etc.)
    } catch (error) {
      console.error("Erro ao buscar próximo ID:", error);
      return "01"; // Retorna '01' como fallback
    }
  };


  // Função para obter o próximo ID de seção disponível
  const getNextSectionId = async () => {
    try {
      const categoriesRef = ref(database, `${nomeLanchonete}/categories`);
      const snapshot = await get(categoriesRef);

      if (!snapshot.exists()) return "section1";

      const sectionsData = snapshot.val();
      const sectionNumbers = Object.keys(sectionsData)
        .filter(key => key.startsWith('section'))
        .map(key => parseInt(key.replace('section', '')))
        .filter(num => !isNaN(num));

      if (sectionNumbers.length === 0) return "section1";

      const maxNumber = Math.max(...sectionNumbers);
      return `section${maxNumber + 1}`;
    } catch (error) {
      console.error("Erro ao buscar seções:", error);
      return "section1";
    }
  };


  useEffect(() => {
    const loadProductsAndSections = async () => {
      try {
        const categoriesRef = ref(database, `${nomeLanchonete}/categories`);
        const snapshot = await get(categoriesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const loadedSections = {};
          const allProducts = [];

          Object.keys(data).forEach(sectionKey => {
            if (sectionKey.startsWith('section')) {
              loadedSections[sectionKey] = {
                name: data[sectionKey]?.name || sectionKey
              };

              const sectionData = data[sectionKey];
              if (sectionData && typeof sectionData === 'object') {
                Object.keys(sectionData).forEach(prodId => {
                  if (prodId !== 'name') {
                    const produto = sectionData[prodId];
                    allProducts.push({
                      id: prodId,
                      section: sectionKey,
                      name: produto?.name || '',
                      description: produto?.description || '',
                      price: produto?.price || 0,
                      composition: produto?.composition || '',
                      options: produto?.options || '',
                      upsell: produto?.upsell || '',
                      opcionais: produto?.opcionais || '',
                      adicionais: produto?.adicionais || '',
                      imageUrl: produto?.imageUrl || '',
                      temMetade: produto?.temMetade || false,
                      tamanhos: Array.isArray(produto?.tamanhos) ? produto.tamanhos : [],
                      tamanhoLabel: produto?.tamanhoLabel || 'Tamanho',
                      fatiasLabel: produto?.fatiasLabel || 'Fatias'
                    });
                  }
                });
              }
            }
          });

          setSections(loadedSections);
          setProdutos(allProducts.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadProductsAndSections();
  }, [nomeLanchonete]);

  const abrirModal = (produto) => {
    setProdutoSelecionado({
      name: produto?.name || "",
      description: produto?.description || "",
      price: produto?.price || "",
      composition: produto?.composition || "",
      options: produto?.options || "",
      upsell: produto?.upsell || "",
      opcionais: produto?.opcionais || "",
      adicionais: produto?.adicionais || "",
      section: produto?.section || "section1",
      imageUrl: produto?.imageUrl || "",
      temMetade: produto?.temMetade || false,
      tamanhos: Array.isArray(produto?.tamanhos) ? produto.tamanhos : [],
      tamanhoLabel: produto?.tamanhoLabel || "Tamanho",
      fatiasLabel: produto?.fatiasLabel || "Fatias"
    });
    setModalAberto(true);
  };

  const abrirModalNovoProduto = () => {
    setModalNovoProduto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setModalNovoProduto(false);
    setShowNovaSecao(false);
    setProdutoSelecionado(null);
    setNovoProduto({
      name: "",
      description: "",
      price: "",
      composition: "",
      options: "",
      section: "section1"
    });
    setNovaSecaoNome("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdutoSelecionado(prev => ({ ...prev, [name]: value }));
  };

  const handleNovoProdutoChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const excluirProduto = async () => {
    if (!produtoSelecionado) {
      alert("Nenhum produto selecionado.");
      return;
    }

    
  
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    
  
    // Debug: checar valores
    console.log("Tentando excluir produto:", produtoSelecionado);
  
    const path = `${nomeLanchonete}/categories/${produtoSelecionado.section}/${produtoSelecionado.id}`;

    console.log("DEBUG >>", {
      nomeLanchonete,
      section: produtoSelecionado.section,
      id: produtoSelecionado.id
    });

    
  
    if (!produtoSelecionado.id) {
      alert("Produto sem ID, não pode ser excluído.");
      console.log("Produto selecionado:", produtoSelecionado);
      return;
    }
  
    try {
      await remove(ref(database, path));
      console.log("Produto excluído com sucesso!");
  
      setProdutos(produtos.filter(p => p.id !== produtoSelecionado.id));
      fecharModal();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto");
    }
  };
  


  // Corrigindo a função adicionarNovoProduto
  const salvarEdicao = async () => {
    if (!produtoSelecionado?.name || !produtoSelecionado?.description || !produtoSelecionado?.price) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      let imageUrl = produtoSelecionado.imageUrl;

      // Se uma nova imagem foi selecionada, faz o upload
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile, nomeLanchonete);
      }

      // Salva no Realtime Database
      await set(
        ref(database, `${nomeLanchonete}/categories/${produtoSelecionado.section}/${produtoSelecionado.id}`),
        {
          name: produtoSelecionado.name,
          description: produtoSelecionado.description,
          price: parseFloat(produtoSelecionado.price),
          composition: produtoSelecionado.composition || "",
          options: produtoSelecionado.options || "",
          opcionais: produtoSelecionado.opcionais || "",
          adicionais: produtoSelecionado.adicionais || "",
          upsell: produtoSelecionado.upsell || "",
          imageUrl: imageUrl || "",
          temMetade: produtoSelecionado.temMetade || false,
          tamanhos: produtoSelecionado.tamanhos || [],
          tamanhoLabel: produtoSelecionado.tamanhoLabel || "Tamanho",
          fatiasLabel: produtoSelecionado.fatiasLabel || "Fatias"
        }
      );

      // Atualiza a lista local
      setProdutos(produtos.map(p =>
        p.id === produtoSelecionado.id && p.section === produtoSelecionado.section
          ? { ...p, ...produtoSelecionado, imageUrl }
          : p
      ));

      // Limpa imagem temporária e fecha modal
      setImageFile(null);
      setImagePreview("");
      fecharModal();

    } catch (error) {
      console.error("Erro ao editar produto:", error);
      alert("Erro ao salvar edição");
    }
  };

  const adicionarNovoProduto = async () => {
    console.log("Função adicionarNovoProduto foi chamada!");
  
    if (!novoProduto.name || !novoProduto.description || !novoProduto.price) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
  
    console.log("Dados válidos:", novoProduto);
  
    try {
      let imageUrl = "";
  
      if (imageFile) {
        console.log("Fazendo upload da imagem...");
        imageUrl = await handleImageUpload(imageFile, nomeLanchonete);
        console.log("Imagem enviada. URL:", imageUrl);
      }
  
      const novoId = await getNextId(novoProduto.section);
      console.log("Novo ID gerado:", novoId);
  
      await set(ref(database, `${nomeLanchonete}/categories/${novoProduto.section}/${novoId}`), {
        name: novoProduto.name,
        description: novoProduto.description,
        price: parseFloat(novoProduto.price),
        composition: novoProduto.composition || "",
        options: novoProduto.options || "",
        opcionais: novoProduto.opcionais || "",
        adicionais: novoProduto.adicionais || "",
        upsell: novoProduto.upsell || "",
        imageUrl,
        temMetade: novoProduto.temMetade || false,
        tamanhos: novoProduto.tamanhos || [],
        tamanhoLabel: novoProduto.tamanhoLabel || "Tamanho",
        fatiasLabel: novoProduto.fatiasLabel || "Fatias"
      });
  
      console.log("Produto salvo no banco!");
  
      setProdutos([...produtos, {
        id: novoId,
        section: novoProduto.section,
        name: novoProduto.name,
        description: novoProduto.description,
        price: parseFloat(novoProduto.price),
        composition: novoProduto.composition || "",
        options: novoProduto.options || "",
        opcionais: novoProduto.opcionais || "",
        adicionais: novoProduto.adicionais || "",
        upsell: novoProduto.upsell || "",
        imageUrl
      }]);
  
      setImageFile(null);
      setImagePreview("");
      fecharModal();
      console.log("Produto adicionado com sucesso!");
  
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro ao adicionar produto. Verifique o console.");
    }
  };
  

  const criarNovaSecao = async () => {
    if (!novaSecaoNome) {
      alert("Digite o nome da seção!");
      return;
    }

    try {
      // Obtém o próximo ID disponível
      const novoSectionId = await getNextSectionId();

      // Verifica se a seção já existe (por segurança)
      const secaoRef = ref(database, `${nomeLanchonete}/categories/${novoSectionId}`);
      const snapshot = await get(secaoRef);

      if (snapshot.exists()) {
        alert("Erro ao gerar ID automático. Tente novamente.");
        return;
      }

      // Cria a nova seção com o nome fornecido
      await set(secaoRef, { name: novaSecaoNome });

      // Atualiza o estado local
      setSections(prev => ({
        ...prev,
        [novoSectionId]: { name: novaSecaoNome }
      }));

      // Atualiza o novo produto para usar a nova seção
      setNovoProduto(prev => ({
        ...prev,
        section: novoSectionId
      }));

      // Limpa e fecha o formulário
      setNovaSecaoNome("");
      setShowNovaSecao(false);

      alert(`Seção "${novaSecaoNome}" criada com sucesso como ${novoSectionId}!`);
    } catch (error) {
      console.error("Erro ao criar seção:", error);
      alert("Erro ao criar seção!");
    }
  };

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
              <th>Id</th>
              <th>Seção</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={`${produto.section}-${produto.id}`} onClick={() => abrirModal(produto)}>
                <td>{produto.id}</td>
                <td>{sections[produto.section]?.name || produto.section}</td>
                <td>{produto.name}</td>
                <td>{produto.description}</td>
                <td>R$ {produto.price ? parseFloat(produto.price).toFixed(2) : "0.00"}</td>
                <td>{produto.options}</td>
              </tr>
            ))}
          </tbody>
        </table>


        {/* Modal de Edição */}
        {modalAberto && produtoSelecionado && (
          <div className="modal">
            <div className="modal-content">
              <h3>Editar Produto</h3>

              {/* Seção de imagem */}
              <div className="image-upload-section">
                <label className="image-upload-label">
                  Imagem do Produto (quadrada)
                  <div className="image-preview-container">
                    {/* Exibe a imagem de preview ou a imagem já salva */}
                    {imagePreview || produtoSelecionado.imageUrl ? (
                      <img
                        src={imagePreview || produtoSelecionado.imageUrl}
                        alt="Preview"
                        className="image-preview"
                      />
                    ) : (
                      <div className="image-placeholder">Sem imagem</div>
                    )}

                    {/* Input de arquivo escondido */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="image-upload-input"
                      style={{ display: "none" }}
                      id="input-imagem-produto"
                    />

                    {/* Label que vai disparar o input */}
                    <label htmlFor="input-imagem-produto" className="btn-upload-image">
                      {imagePreview || produtoSelecionado.imageUrl ? "Alterar Imagem" : "Adicionar Imagem"}
                    </label>
                  </div>
                </label>
              </div>



              <div className="form-grid">
                <div className="form-column">
                  <label>
                    Seção:
                    <select
                      name="section"
                      value={produtoSelecionado.section}
                      onChange={handleChange}
                      disabled
                    >
                      {Object.keys(sections).map((sectionKey) => (
                        <option key={sectionKey} value={sectionKey}>
                          {sections[sectionKey].name}
                        </option>
                      ))}
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
                    Descrição:
                    <textarea
                      name="description"
                      value={produtoSelecionado.description || ""}
                      onChange={handleChange}
                      required
                      rows="3"
                    />
                  </label>
                </div>

                <div className="form-column">
                  <label>
                    Composição:
                    <textarea
                      name="composition"
                      value={produtoSelecionado.composition || ""}
                      onChange={handleChange}
                      rows="3"
                    />
                  </label>
                  <label>
                    Opcionais (separados por vírgula):
                    <input
                      type="text"
                      name="opcionais"
                      value={produtoSelecionado.opcionais || ""}
                      onChange={handleChange}
                      placeholder="Ex: Sem cebola, Sem tomate"
                    />
                  </label>
                  <label>
                    Adicionais (separados por vírgula):
                    <input
                      type="text"
                      name="adicionais"
                      value={produtoSelecionado.adicionais || ""}
                      onChange={handleChange}
                      placeholder="Ex: Bacon extra, Queijo extra"
                    />
                  </label>
                  <label>
                    Upsell (ID do produto relacionado):
                    <input
                      type="text"
                      name="upsell"
                      value={produtoSelecionado.upsell || ""}
                      onChange={handleChange}
                      placeholder="Ex: 05 (ID do produto)"
                    />
                  </label>
                </div>
              </div>

              {/* Adicione isso no modal de edição e no modal de novo produto, antes dos botões de ação */}

              <div className="tamanhos-section">
                <h4>Configurações de Tamanhos</h4>

                <label>
                  <input
                    type="checkbox"
                    name="temMetade"
                    checked={modalAberto ? produtoSelecionado.temMetade : novoProduto.temMetade}
                    onChange={(e) => modalAberto ?
                      setProdutoSelecionado({ ...produtoSelecionado, temMetade: e.target.checked }) :
                      setNovoProduto({ ...novoProduto, temMetade: e.target.checked })
                    }
                  />
                  Oferecer opção de metade sabor?
                </label>

                <div className="tamanhos-labels">
                  <label>
                    Label para Tamanhos:
                    <input
                      type="text"
                      value={modalAberto ? produtoSelecionado.tamanhoLabel : novoProduto.tamanhoLabel}
                      onChange={(e) => modalAberto ?
                        setProdutoSelecionado({ ...produtoSelecionado, tamanhoLabel: e.target.value }) :
                        setNovoProduto({ ...novoProduto, tamanhoLabel: e.target.value })
                      }
                      placeholder="Ex: Tamanho da Pizza"
                    />
                  </label>

                  <label>
                    Label para Fatias:
                    <input
                      type="text"
                      value={modalAberto ? produtoSelecionado.fatiasLabel : novoProduto.fatiasLabel}
                      onChange={(e) => modalAberto ?
                        setProdutoSelecionado({ ...produtoSelecionado, fatiasLabel: e.target.value }) :
                        setNovoProduto({ ...novoProduto, fatiasLabel: e.target.value })
                      }
                      placeholder="Ex: Quantidade de Fatias"
                    />
                  </label>
                </div>

                <div className="tamanhos-form">
                  <h5>Adicionar Tamanhos</h5>
                  <div className="tamanho-inputs">
                    <input
                      type="text"
                      placeholder="Nome (ex: P, M, G)"
                      value={novoTamanho.nome}
                      onChange={(e) => setNovoTamanho({ ...novoTamanho, nome: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Preço"
                      step="0.01"
                      min="0"
                      value={novoTamanho.preco}
                      onChange={(e) => setNovoTamanho({ ...novoTamanho, preco: e.target.value })}
                    />
                    <button type="button" onClick={adicionarTamanho}>
                      Adicionar
                    </button>
                  </div>

                  <div className="tamanhos-list">
                    {((modalAberto
                      ? produtoSelecionado?.tamanhos
                      : novoProduto?.tamanhos) || []).map((tamanho, index) => (
                        <div key={index} className="tamanho-item">
                          <span>{tamanho?.nome || 'Tamanho'} - R$ {parseFloat(tamanho?.preco || 0).toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => removerTamanho(index)}
                            aria-label="Remover tamanho"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

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

              {/* Seção de imagem */}
              <div className="image-upload-section">
                <label className="image-upload-label">
                  Imagem do Produto (200px X 200px)
                  <div className="image-preview-container">
                    {/* Exibe a imagem de preview ou a imagem já salva */}
                    {imagePreview || produtoSelecionado.imageUrl ? (
                      <img
                        src={imagePreview || produtoSelecionado.imageUrl}
                        alt="Preview"
                        className="image-preview"
                      />
                    ) : (
                      <div className="image-placeholder">Sem imagem</div>
                    )}

                    {/* Input de arquivo escondido */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="image-upload-input"
                      style={{ display: "none" }}
                      id="input-imagem-produto"
                    />

                    <label htmlFor="input-imagem-produto" className="btn-upload-image">
                      {imagePreview || produtoSelecionado.imageUrl ? "Alterar Imagem" : "Adicionar Imagem"}
                    </label>
                  </div>
                </label>
              </div>





              {/* Seletor de seção com opção de criar nova */}
              <div className="section-creator">
                <label>
                  Seção:
                  <select
                    name="section"
                    value={novoProduto.section}
                    onChange={handleNovoProdutoChange}
                    required
                  >
                    {Object.keys(sections).map((sectionKey) => (
                      <option key={sectionKey} value={sectionKey}>
                        {sections[sectionKey].name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="btn-nova-secao"
                  onClick={() => setShowNovaSecao(!showNovaSecao)}
                >
                  + Nova Seção
                </button>
              </div>

              {/* Formulário para nova seção */}
              {showNovaSecao && (
                <div className="nova-secao-form">
                  <h4>Criar Nova Seção</h4>
                  <label>
                    Nome da Seção:
                    <input
                      type="text"
                      value={novaSecaoNome}
                      onChange={(e) => setNovaSecaoNome(e.target.value)}
                      placeholder="Ex: Combos"
                      required
                    />
                  </label>
                  <div className="modal-actions">
                    <button className="btn-adicionar" onClick={criarNovaSecao}>
                      Criar Seção
                    </button>
                    <button
                      className="btn-cancelar"
                      onClick={() => setShowNovaSecao(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="form-grid">
                <div className="form-column">
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
                    Descrição:
                    <textarea
                      name="description"
                      value={novoProduto.description}
                      onChange={handleNovoProdutoChange}
                      required
                      rows="3"
                    />
                  </label>
                </div>

                <div className="form-column">
                  <label>
                    Composição:
                    <textarea
                      name="composition"
                      value={novoProduto.composition}
                      onChange={handleNovoProdutoChange}
                      rows="3"
                    />
                  </label>
                  <label>
                    Opcionais (separados por vírgula):
                    <input
                      type="text"
                      name="opcionais"
                      value={novoProduto.opcionais}
                      onChange={handleNovoProdutoChange}
                      placeholder="Ex: Sem cebola, Sem tomate"
                    />
                  </label>
                  <label>
                    Adicionais (separados por vírgula):
                    <input
                      type="text"
                      name="adicionais"
                      value={novoProduto.adicionais}
                      onChange={handleNovoProdutoChange}
                      placeholder="Ex: Bacon extra, Queijo extra"
                    />
                  </label>
                  <label>
                    Upsell (ID do produto relacionado):
                    <input
                      type="text"
                      name="upsell"
                      value={novoProduto.upsell}
                      onChange={handleNovoProdutoChange}
                      placeholder="Ex: 05 (ID do produto)"
                    />
                  </label>
                </div>
              </div>

              {/* Adicione isso no modal de edição e no modal de novo produto, antes dos botões de ação */}

              <div className="tamanhos-section">
                <h4>Configurações de Tamanhos</h4>

                <label>
                  <input
                    type="checkbox"
                    name="temMetade"
                    checked={modalAberto ? produtoSelecionado.temMetade : novoProduto.temMetade}
                    onChange={(e) => modalAberto ?
                      setProdutoSelecionado({ ...produtoSelecionado, temMetade: e.target.checked }) :
                      setNovoProduto({ ...novoProduto, temMetade: e.target.checked })
                    }
                  />
                  Oferecer opção de metade sabor?
                </label>

                <div className="tamanhos-labels">
                  <label>
                    Label para Tamanhos:
                    <input
                      type="text"
                      value={modalAberto ? produtoSelecionado.tamanhoLabel : novoProduto.tamanhoLabel}
                      onChange={(e) => modalAberto ?
                        setProdutoSelecionado({ ...produtoSelecionado, tamanhoLabel: e.target.value }) :
                        setNovoProduto({ ...novoProduto, tamanhoLabel: e.target.value })
                      }
                      placeholder="Ex: Tamanho da Pizza"
                    />
                  </label>

                  <label>
                    Label para Fatias:
                    <input
                      type="text"
                      value={modalAberto ? produtoSelecionado.fatiasLabel : novoProduto.fatiasLabel}
                      onChange={(e) => modalAberto ?
                        setProdutoSelecionado({ ...produtoSelecionado, fatiasLabel: e.target.value }) :
                        setNovoProduto({ ...novoProduto, fatiasLabel: e.target.value })
                      }
                      placeholder="Ex: Quantidade de Fatias"
                    />
                  </label>
                </div>

                <div className="tamanhos-form">
                  <h5>Adicionar Tamanhos</h5>
                  <div className="tamanho-inputs">
                    <input
                      type="text"
                      placeholder="Nome (ex: P, M, G)"
                      value={novoTamanho.nome}
                      onChange={(e) => setNovoTamanho({ ...novoTamanho, nome: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Preço"
                      step="0.01"
                      min="0"
                      value={novoTamanho.preco}
                      onChange={(e) => setNovoTamanho({ ...novoTamanho, preco: e.target.value })}
                    />
                    <button type="button" onClick={adicionarTamanho}>
                      Adicionar
                    </button>
                  </div>

                  <div className="tamanhos-list">
                    {(modalAberto
                      ? (produtoSelecionado.tamanhos || [])
                      : (novoProduto.tamanhos || [])
                    ).map((tamanho, index) => (
                      <div key={index} className="tamanho-item">
                        <span>{tamanho.nome} - R$ {parseFloat(tamanho.preco || 0).toFixed(2)}</span>
                        <button type="button" onClick={() => removerTamanho(index)}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-adicionar" onClick={adicionarNovoProduto}>
                  Adicionar Produto
                </button>
                <button className="btn-cancelar" onClick={fecharModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}