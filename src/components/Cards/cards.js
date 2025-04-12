import { useState } from 'react';
import './style.css';
import { useCart } from '../../context/CartContext';
import { Modal } from '../Modal/modal';

const Card = ({ title, description, price, imageUrl, itens, id,  hasCheckbox, checkboxLabels, limiteMaximo, composition, observation }) => {
  const formattedPrice = price ? parseFloat(price).toFixed(2) : "0.00";
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
      <div onClick={() => handleClick({ title, description, price, imageUrl, itens, hasCheckbox, checkboxLabels, limiteMaximo, composition })} className="card">

        <div className="card-image">
          <img src={imageUrl} alt={title} className="card-image" />
        </div>
        <div className="card-content">
          <h2 className="card-title">{title}</h2>
          <p className="card-description">{description}</p>

          <div className="container-card-price">
            <p>Preço: R$ {formattedPrice}</p> 
            <button className="card-button">Pedir</button>

          </div>
        </div>


        <Modal
          id={id}
          isOpen={isOpen}
          formattedPrice={formattedPrice} 
          onClose={() => setIsOpen(false)}
          imageUrl={imageUrl}
          composition={composition}
          titulo={title}
          description={description}
          itens={itens || []}
          checkboxLabels={checkboxLabels}
          hasCheckbox={true} // ← Isso precisa ser true para mostrar os sabores
          limiteMaximo={limiteMaximo}
          handleAddToCart={handleAddToCart}
          observation={observation}

        />
      </div>
    </>
  );
};

export default Card;
