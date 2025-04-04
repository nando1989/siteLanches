import { useState } from "react";
import { useCart } from '../../context/CartContext';
import './style.css';
import { FiX, FiTrash2 } from "react-icons/fi";
import { collection, addDoc } from "firebase/firestore";
import { database } from "../../../firebaseConfig"; // Importe o db do Firestore
import { ref, push } from "firebase/database"

const CartModal = ({ onClose }) => {
  const { cart, removeFromCart, setCart } = useCart();
  const totalCarrinho = cart.reduce((acc, item) => acc + (item.total || 0), 0);

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardBrand, setCardBrand] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [referencia, setReferencia] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState("Entrega");
  const [consumirNoLocal, setConsumirNoLocal] = useState(null);
  const [precisaDeTroco, setPrecisaDeTroco] = useState(null);
  const [trocoPara, setTrocoPara] = useState("00,00");

  const [error, setError] = useState("");

  const formatarTroco = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    const valorComZeros = apenasNumeros.padStart(2, "0");
    const parteInteira = valorComZeros.slice(0, -2) || "0";
    const centavos = valorComZeros.slice(-2);
    const parteInteiraFormatada = parteInteira.replace(/^0+/, "") || "0";
    const valorFormatado = `${parteInteiraFormatada},${centavos}`;
    return valorFormatado;
  };

  const validarCampos = () => {
    setError("");

    if (!nome) {
      setError("⚠️O nome é obrigatório!");
      return false;
    }

    if (!telefone) {
      setError("⚠️O telefone é obrigatório!");
      return false;
    }

    if (telefone.length !== 11 || !/^\d{11}$/.test(telefone)) {
      setError("⚠️Verifique se não está faltando número");
      return false;
    }

    if (tipoEntrega === "Entrega" && !endereco) {
      setError("⚠️Endereço é obrigatório para entrega");
      return false;
    }

    if (tipoEntrega === "Entrega" && !referencia) {
      setError("⚠️Referência é obrigatória para entrega");
      return false;
    }

    if (tipoEntrega === "Retirada" && !consumirNoLocal) {
      setError("⚠️Selecione se vai consumir no local ou não.");
      return false;
    }

    if (!paymentMethod) {
      setError("⚠️Escolha uma forma de pagamento.");
      return false;
    }

    if (paymentMethod === "Dinheiro" && precisaDeTroco === null) {
      setError("⚠️Selecione se precisa de troco.");
      return false;
    }

    if (paymentMethod === "Dinheiro" && precisaDeTroco === "Sim") {
      if (!trocoPara || trocoPara === "00,00") {
        setError("⚠️Informe o troco para quanto.");
        return false;
      }

      const valorTroco = parseFloat(trocoPara.replace(",", "."));
      if (isNaN(valorTroco) || valorTroco <= 0) {
        setError("⚠️O valor do troco deve ser maior que zero.");
        return false;
      }
    }

    return true;
  };

  const enviarParaRealtimeDatabase = async (pedido) => {
    try {
      const pedidosRef = ref(database, "pedidos"); // Referência para o nó "pedidos"
      await push(pedidosRef, pedido); // Adiciona o pedido ao Realtime Database
      console.log("Pedido enviado para o Realtime Database com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar pedido para o Realtime Database:", error);
    }
  };

  const gerarMensagemWhatsApp = () => {
    const itensCarrinho = cart
      .map((item) => {
        let itemText = `${item.name} - ${item.quantity}x - R$ ${item.total.toFixed(2)}`;
        if (item.observation) {
          itemText += `\n   _Observação: ${item.observation}_ 
          
          `;
        }
        return itemText;
      })
      .join("\n");

    const mensagem = `
  📋 *Pedido Realizado* 📋
  
  🛒 *Itens do Carrinho:*
  
  ${itensCarrinho}
  
  💰 *Total: R$ ${totalCarrinho.toFixed(2)}*
  
  👤 *Dados do Cliente:*
  - Nome: ${nome}
  - Telefone: ${telefone}
  ${tipoEntrega === "Entrega" ? `- Endereço: ${endereco}\n- Referência: ${referencia}` : ""}
  
  🚚 *Tipo de Entrega:* ${tipoEntrega}
  ${tipoEntrega === "Retirada" ? `- Consumir no Local: ${consumirNoLocal}` : ""}
  
  💳 *Forma de Pagamento:* ${paymentMethod}
  ${paymentMethod === "Crédito" ? `- Bandeira: ${cardBrand}` : ""}
  ${paymentMethod === "Dinheiro" && precisaDeTroco === "Sim" ? `- Troco para quanto: R$ ${trocoPara}` : ""}
  
  Quero fazer meu pedido! 🎉
    `;

    return encodeURIComponent(mensagem);
  };

  const finalizarPedido = async () => {
  if (!validarCampos()) return;

  const pedido = {
    nome,
    telefone,
    endereco: tipoEntrega === "Entrega" ? endereco : null,
    referencia: tipoEntrega === "Entrega" ? referencia : null,
    tipoEntrega,
    consumirNoLocal: tipoEntrega === "Retirada" ? consumirNoLocal : null,
    paymentMethod,
    cardBrand: paymentMethod === "Crédito" ? cardBrand : null,
    precisaDeTroco: paymentMethod === "Dinheiro" ? precisaDeTroco : null,
    trocoPara: paymentMethod === "Dinheiro" && precisaDeTroco === "Sim" ? trocoPara : null,
    itens: cart.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      total: item.total,
      observation: item.observation || null,
    })),
    total: totalCarrinho,
    data: new Date().toISOString(),
  };

    // Envia o pedido para o Firestore
    await enviarParaRealtimeDatabase(pedido);

    // Envia o pedido para o WhatsApp
    const mensagem = gerarMensagemWhatsApp();
    const url = `https://wa.me/5521977384132?text=${mensagem}`;
    window.open(url, "_blank");

    // Limpa o carrinho e os campos do formulário

    
  setNome("");
  setTelefone("");
  setEndereco("");
  setReferencia("");
  setTipoEntrega("Entrega");
  setConsumirNoLocal(null);
  setPaymentMethod(null);
  setCardBrand(null);
  setPrecisaDeTroco(null);
  setTrocoPara("00,00");
};
  return (
    <div className="modal-backdrop">
      <div className="modal-cart">
        <div className="modal-itens">
          <div className='modal-button-close'>
            <h2>Carrinho</h2>
            <button className="button-close" onClick={onClose}>
              <FiX size={20} />
            </button>
          </div>

          <div className="modal-itens-observation">
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <ul>
                {cart.map((item, index) => (
                  <li key={index}>
                    <div className="modal-observation-item-column">
                      {item.name} - {item.quantity}x - R$ {item.total.toFixed(2)}
                      {item.observation && <p>Observação: ${item.observation}</p>}
                    </div>
                    <button className="button-remove" onClick={() => removeFromCart(index)}>
                      <FiTrash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className='modal-total'>
            <h3>Total: R$ {totalCarrinho.toFixed(2)}</h3>
          </div>

          <div>
            <h2>Tipo de Entrega</h2>
            <div className="deliveryOptions">
              {["Entrega", "Retirada"].map((option) => (
                <label key={option} className="radioLabel">
                  <input
                    type="radio"
                    name="tipoEntrega"
                    value={option}
                    checked={tipoEntrega === option}
                    onChange={() => {
                      setTipoEntrega(option);
                      setConsumirNoLocal(null);
                    }}
                  />
                  <span className="radioCircle"></span>
                  {option}
                </label>
              ))}
            </div>
          </div>

          {tipoEntrega === "Retirada" && (
            <div>
              <h2>Consumir no Local?</h2>
              <div className="deliveryOptions">
                {["Sim", "Não"].map((option) => (
                  <label key={option} className="radioLabel">
                    <input
                      type="radio"
                      name="consumirNoLocal"
                      value={option}
                      checked={consumirNoLocal === option}
                      onChange={() => setConsumirNoLocal(option)}
                    />
                    <span className="radioCircle"></span>
                    {option}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className='modal-data'>
            <h2>Seus dados</h2>
            <label>Nome completo</label>
            <input
              type="text"
              placeholder='Digite seu nome'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <label>Telefone</label>
            <input
              type="text"
              placeholder='Digite seu telefone'
              value={telefone}
              maxLength={11}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setTelefone(onlyNumbers.slice(0, 11));
              }}
            />
            {tipoEntrega === "Entrega" && (
              <>
                <label>Endereço e numero</label>
                <input
                  type="text"
                  placeholder='Digite seu endereço com o numero'
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
                <label>Referência</label>
                <input
                  type="text"
                  placeholder='De alguma referência da sua casa'
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                />
              </>
            )}
          </div>

          <div>
            <h2>Forma de Pagamento</h2>
            <div className="paymentOptions">
              {["Dinheiro", "Pix", "Crédito", "Débito"].map((method) => (
                <label key={method} className="radioLabel">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => {
                      setPaymentMethod(method);
                      setCardBrand(null);
                      setPrecisaDeTroco(null);
                    }}
                  />
                  <span className="radioCircle"></span>
                  {method}
                </label>
              ))}
            </div>
            {paymentMethod === "Crédito" && (
              <div className="cardOptions">
                <h3>Bandeira</h3>
                <div className="paymentOptions">
                  {["Master", "Visa", "Cielo", "Outros"].map((brand) => (
                    <label key={brand} className="radioLabel">
                      <input
                        type="radio"
                        name="cardBrand"
                        value={brand}
                        checked={cardBrand === brand}
                        onChange={() => setCardBrand(brand)}
                      />
                      <span className="radioCircle"></span>
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {paymentMethod === "Dinheiro" && (
              <div>
                <h3>Precisa de troco?</h3>
                <div className="deliveryOptions">
                  {["Sim", "Não"].map((option) => (
                    <label key={option} className="radioLabel">
                      <input
                        type="radio"
                        name="precisaDeTroco"
                        value={option}
                        checked={precisaDeTroco === option}
                        onChange={() => {
                          setPrecisaDeTroco(option);
                          if (option === "Não") setTrocoPara("00,00");
                        }}
                      />
                      <span className="radioCircle"></span>
                      {option}
                    </label>
                  ))}
                </div>
                {precisaDeTroco === "Sim" && (
                  <div className="trocoPara">
                    <label>Troco para quanto?</label>
                    <input
                      type="text"
                      placeholder='Digite o valor do troco'
                      value={trocoPara}
                      onChange={(e) => setTrocoPara(formatarTroco(e.target.value))}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="container-error-message">
              <p className="error-message">{error}</p>
            </div>
          )}

          <div className='modal-button-buy'>
            <button className="button-finally" onClick={finalizarPedido}>
              Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;