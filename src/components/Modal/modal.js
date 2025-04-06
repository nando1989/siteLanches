import React, { useState, useEffect } from 'react';
import './style.css';
import { useCart } from '../../context/CartContext';

export const Modal = ({ isOpen, onClose, titulo, composiçao, imageUrl, observation, formattedPrice, itens = [], hasCheckbox = false, checkboxLabels = {}, limiteMaximo = 30 }) => {
  
  
  
  const [quantidades, setQuantidades] = useState({});
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [localObservation, setLocalObservation] = useState(observation || "");
  const { addToCart } = useCart();

 useEffect(() => {
  if (Array.isArray(itens) && itens.length > 0 && Object.keys(quantidades).length === 0) {
    const quantidadesIniciais = itens.reduce((acc, item) => ({ ...acc, [item]: 0 }), {});
    setQuantidades(quantidadesIniciais);
  }
}, [itens]);

  const totalSelecionado = Object.values(quantidades).reduce((acc, val) => acc + val, 0);

  const aumentar = (item) => {
    setQuantidades((prev) => {
      const novoTotal = totalSelecionado + 1;
      if (novoTotal > limiteMaximo) return prev;
      return { ...prev, [item]: (prev[item] || 0) + 1 };
    });
  };

  const diminuir = (item) => {
    setQuantidades((prev) => ({
      ...prev,
      [item]: Math.max(0, (prev[item] || 0) - 1),
    }));
  };

  const alterarQuantidade = (item, valor) => {
    const numero = parseInt(valor, 10);

    if (isNaN(numero) || numero < 0) return;

    const novoTotal = totalSelecionado - (quantidades[item] || 0) + numero;

    if (novoTotal <= limiteMaximo) {
      setQuantidades((prev) => ({ ...prev, [item]: numero }));
    }
  };

  const handleAddToCart = () => {
    const itensSelecionados = Object.entries(quantidades)
      .filter(([_, quantidade]) => quantidade > 0);

    if (itensSelecionados.length === 0) {
      setMostrarAviso(true);
      return;
    }

    setMostrarAviso(false);

    const itensParaCarrinho = itensSelecionados.map(([item, quantidade]) => {
      const precoNumerico = parseFloat(formattedPrice );
      const quantidadeNumerica = parseInt(quantidade) || 0;

      return {
        name: titulo,
        quantity: quantidadeNumerica,
        price: precoNumerico,
        total: precoNumerico * quantidadeNumerica,
        observation: localObservation, 
      };
    });

    itensParaCarrinho.forEach((item) => addToCart(item));

    setTimeout(() => {
      onClose();
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className='modal-all'>
        <div className="modal-content">
          <button className="modal-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            ✖
          </button>
          <div className="modal-image">
            {imageUrl && <img src={imageUrl} alt={titulo} className='img-modal' />}
          </div>
          {mostrarAviso && (
            <p style={{ borderRadius: '5px', color: 'white', background: 'red', textAlign: 'center', marginTop: '10px' }}>
              A quantidade é obrigatória
            </p>
          )}
          <div className="modal-text">
            <h2>{titulo}</h2>
            <h3 className="vermelho">R$ {formattedPrice}</h3>
            <p >{composiçao}</p>
            <textarea
              className="area-observation"
              placeholder="Ex. tirar cebola, ovo, etc."
              value={localObservation}
              onChange={(e) => setLocalObservation(e.target.value)}
            />
          </div>

          {itens.length > 0 ? (
            itens.map((item) => (
              <div key={item} className="area-item-all">
                <div className="cont-item-all">
                  <div className="name-item">
                    <p>{titulo}</p>
                  </div>
                  <div className="cont-item">
                    <button onClick={() => diminuir(item)}>-</button>
                    <input
                      type="number"
                      value={quantidades[item] ?? 0}
                      onChange={(e) => alterarQuantidade(item, e.target.value)}
                      onFocus={(e) => {
                        if (e.target.value === "0") {
                          e.target.value = "";
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          alterarQuantidade(item, "0");
                        }
                      }}
                    />
                    <button onClick={() => aumentar(item)}>+</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum item disponível.</p>
          )}
        </div>

        <div className='container-button-avançar'>
          <button className="modal-button" onClick={handleAddToCart}>
            Adicionar ao carrinho 
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
