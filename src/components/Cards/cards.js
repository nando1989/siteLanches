import { useState } from 'react';
import './style.css';
import { useCart } from '../../context/CartContext';
import { Modal } from '../Modal/modal';

const Card = ({ title, description, price, imageUrl, itens, hasCheckbox, checkboxLabels, limiteMaximo, composição, observation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addToCart } = useCart(); 
  const [selectedItem, setSelectedItem] = useState(null);  
  

  const handleClick = (item) => {
    setSelectedItem(item); 
    setIsOpen(true);  
  };

  const handleAddToCart = () => {
    if (itens && itens.length > 0) {
      const itensSelecionados = itens.filter((item) => quantidades[item] > 0).map((item) => ({
        item,
        quantidade: quantidades[item]
      }));
  
     
      addToCart(itensSelecionados);
      setIsOpen(false);
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
          handleAddToCart={handleAddToCart} 
          observation={observation}
          
        />
      </div>
    </>
  );
};

export default Card;
