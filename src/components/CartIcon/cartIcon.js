"use client";
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import CartModal from '../CartModal/cartModal'; 
import './style.css';

const CartIcon = ({ loja }) => {
  const { cart } = useCart(); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="cart-icon" onClick={() => setIsModalOpen(true)}>
        <span className="img-cart" role="img" aria-label="Carrinho">🛒</span>
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </div>

      {isModalOpen && <CartModal onClose={() => setIsModalOpen(false)} loja={loja} />}
    </>
  );
};

export default CartIcon;
