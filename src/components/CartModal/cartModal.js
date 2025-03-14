import { useState } from "react";
import { useCart } from '../../context/CartContext';
import './style.css';
import { FiX, FiTrash2 } from "react-icons/fi";

const CartModal = ({ onClose }) => {
  const { cart, removeFromCart } = useCart();
  const totalCarrinho = cart.reduce((acc, item) => acc + (item.total || 0), 0);

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardBrand, setCardBrand] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [referencia, setReferencia] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState("Entrega");

  const [error, setError] = useState("");

  const validarCampos = () => {
    if (!nome) {
      setError("⚠️O nome é obrigatórios!");
      return false;
    }

    if (!telefone) {
      setError("⚠️O telefone é obrigatórios!");
      return false;
    }

    if (telefone.length !== 11 || !/^\d{11}$/.test(telefone)) {
      setError("⚠️Verifique se não está faltando numero");
      return false;
    }

    if (tipoEntrega === "Entrega" && (!endereco)) {
      setError("⚠️Endereço é obrigatório para entrega");
      return false;
    }

    if (tipoEntrega === "Entrega" && (!referencia)) {
      setError("⚠️Referência é obrigatórios para entrega");
      return false;
    }

    if (!paymentMethod) {
      setError("Escolha uma forma de pagamento.");
      return false;
    }

    return true;
  };

  const gerarMensagemWhatsApp = () => {
    const itensCarrinho = cart
      .map((item) => `${item.name} - ${item.quantity}x - R$ ${item.total.toFixed(2)}`)
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

💳 *Forma de Pagamento:* ${paymentMethod}
${paymentMethod === "Crédito" ? `- Bandeira: ${cardBrand}` : ""}

Obrigado pela preferência! 🎉
    `;

    return encodeURIComponent(mensagem);
  };

  const enviarWhatsApp = () => {
    if (!validarCampos()) return;

    const mensagem = gerarMensagemWhatsApp();
    const url = `https://wa.me/5521977384132?text=${mensagem}`;
    window.open(url, "_blank");
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

          {cart.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <ul>
              {cart.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.quantity}x - R$ {item.total.toFixed(2)}
                  <button className="button-remove" onClick={() => removeFromCart(index)}>
                    <FiTrash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
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
                    onChange={() => setTipoEntrega(option)}
                  />
                  <span className="radioCircle"></span>
                  {option}
                </label>
              ))}
            </div>
          </div>

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
      

            {error && <div className="container-error-message"><p className="error-message">{error}</p></div>}
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
          </div>

          
          <div className='modal-button-buy'>
            <button className="button-finally" onClick={enviarWhatsApp}>
              Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
