import { useState } from 'react';
import './style.css';
import { useCart } from '../../context/CartContext';
import { Modal } from '../Modal/modal';

const Card = ({ title, description, price, imageUrl, itens, hasCheckbox, checkboxLabels, limiteMaximo, composição }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addToCart } = useCart();  // Acessando a função para adicionar ao carrinho
  const [selectedItem, setSelectedItem] = useState(null);  // Estado para armazenar o item selecionado
  

  const handleClick = (item) => {
    setSelectedItem(item);  // Armazenando o item selecionado no estado
    setIsOpen(true);  
  };

  const handleAddToCart = () => {
    if (itens && itens.length > 0) {
      const itensSelecionados = itens.filter((item) => quantidades[item] > 0).map((item) => ({
        item,
        quantidade: quantidades[item]
      }));
  
      // Passando para o carrinho
      addToCart(itensSelecionados);
      setIsOpen(false); // Fechando o modal após adicionar os itens ao carrinho
    }
  };

  return (
    <>
      <div onClick={() => handleClick({ title, description, price, imageUrl, itens, hasCheckbox, checkboxLabels, limiteMaximo, composição })} className="card">
        
          <div className="card-image">
            <img src={imageUrl} alt={title} className="card-image" />
          </div>
          <div className="card-content">
            <h2 className="card-title">{title}</h2>
            <p className="card-description">{description}</p>
            
            <div className="container-card-price">
              <p className="card-price">{price}</p>
              <button className="card-button">Pedir</button>
            </div>
          </div>
       

        <Modal
          isOpen={isOpen}
          price={price}
          onClose={() => setIsOpen(false)}
          imageUrl={imageUrl}
          composição={composição}
          titulo={title}
          description={description}
          itens={itens || []}
          hasCheckbox={hasCheckbox}
          checkboxLabels={checkboxLabels}
          limiteMaximo={limiteMaximo}
          handleAddToCart={handleAddToCart}  // Passando a função de adicionar ao carrinho para o modal
          
        />
      </div>
    </>
  );
};

export default Card;
