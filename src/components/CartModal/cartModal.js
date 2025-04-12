
"use client"

import { useState } from "react";
import { useCart } from '../../context/CartContext';
import './style.css';
import { FiX, FiTrash2 } from "react-icons/fi";
import { ref, push } from "firebase/database"
import { database } from "../../../firebaseConfig";
import { useRouter } from 'next/router';
import Cleave from "cleave.js/react";



const CartModal = ({ onClose, loja, value, onChange }) => {
  const { cart, removeFromCart, setCart } = useCart();
  const totalCarrinho = cart.reduce((acc, item) => acc + (item.total || 0), 0);



  const whatsAppsPorLoja = {
    'malibu-lanches': '5521999999999',
    'lanchonete-da-ana': '5521988888888',
    'ze-do-pastel': '5521977777777'
  };

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
    if (!nome) return setError("⚠️O nome é obrigatório!") && false;
    if (!telefone) return setError("⚠️O telefone é obrigatório!") && false;
    if (telefone.length !== 11 || !/^\d{11}$/.test(telefone)) return setError("⚠️Verifique se não está faltando número") && false;
    if (tipoEntrega === "Entrega" && !endereco) return setError("⚠️Endereço é obrigatório para entrega") && false;
    if (tipoEntrega === "Entrega" && !referencia) return setError("⚠️Referência é obrigatória para entrega") && false;
    if (tipoEntrega === "Retirada" && !consumirNoLocal) return setError("⚠️Selecione se vai consumir no local ou não.") && false;
    if (!paymentMethod) return setError("⚠️Escolha uma forma de pagamento.") && false;
    if (paymentMethod === "Dinheiro" && precisaDeTroco === null) return setError("⚠️Selecione se precisa de troco.") && false;
    if (paymentMethod === "Dinheiro" && precisaDeTroco === "Sim") {
      if (!trocoPara || trocoPara === "00,00") return setError("⚠️Informe o troco para quanto.") && false;
      const valorTroco = parseFloat(trocoPara.replace(",", "."));
      if (isNaN(valorTroco) || valorTroco <= 0) return setError("⚠️O valor do troco deve ser maior que zero.") && false;
    }
    return true;
  };

  const enviarParaRealtimeDatabase = async (pedido, loja) => {
    if (!loja) {
      console.error("⚠️ Loja não definida! Pedido NÃO enviado.");
      return;
    }

    try {
      const pedidosRef = ref(database, `${loja}/pedidos`);
      await push(pedidosRef, pedido);
      console.log(`✅ Pedido enviado para a loja "${loja}"`);
    } catch (error) {
      console.error("❌ Erro ao enviar pedido:", error);
    }
  };




  const gerarMensagemWhatsApp = () => {
    const itensCarrinho = cart.map((item) => {
      let itemText = `${item.name} - ${item.quantity}x - R$ ${item.total.toFixed(2)}`;
      if (item.observation) itemText += `\n   _Observação: ${item.observation}_ \n`;
      return itemText;
    }).join("\n");

    return encodeURIComponent(`📋 *Pedido Realizado* 📋\n\n🛒 *Itens do Carrinho:*\n\n${itensCarrinho}\n\n💰 *Total: R$ ${totalCarrinho.toFixed(2)}*\n\n👤 *Dados do Cliente:*\n- Nome: ${nome}\n- Telefone: ${telefone}\n${tipoEntrega === "Entrega" ? `- Endereço: ${endereco}\n- Referência: ${referencia}` : ""}\n\n🚚 *Tipo de Entrega:* ${tipoEntrega}\n${tipoEntrega === "Retirada" ? `- Consumir no Local: ${consumirNoLocal}` : ""}\n\n💳 *Forma de Pagamento:* ${paymentMethod}\n${paymentMethod === "Crédito" ? `- Bandeira: ${cardBrand}` : ""}\n${paymentMethod === "Dinheiro" && precisaDeTroco === "Sim" ? `- Troco para quanto: R$ ${trocoPara}` : ""}\n\nQuero fazer meu pedido! 🎉`);
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
      itens: cart.map((item) => ({ name: item.name, quantity: item.quantity, total: item.total, observation: item.observation || null })),
      total: totalCarrinho,
      data: new Date().toISOString(),
    };

    await enviarParaRealtimeDatabase(pedido, loja);

    const mensagem = gerarMensagemWhatsApp();
    const numeroWhatsApp = whatsAppsPorLoja[loja] || '5521977384132';
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    window.open(url, "_blank");

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
                      {item.observation && <p>Observação:<strong> {item.observation}</strong></p>}
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
            <Cleave
              className="border rounded p-2 w-full"
              placeholder="(21) 99999-9999"
              options={{
                delimiters: ['(', ') ', '-', ''],
                blocks: [0, 2, 5, 4],
                numericOnly: true
              }}
              value={value}
              onChange={onChange}
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