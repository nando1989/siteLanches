"use client"
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import CartModal from '../CartModal/cartModal'; // Importe o modal do carrinho
import './style.css';

const CartIcon = () => {
  const { cart } = useCart(); // Acesse o carrinho
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

  return (
    <>
      {/* Ícone do carrinho */}
      <div className="cart-icon" onClick={() => setIsModalOpen(true)}>
        <span className="img-cart" role="img" aria-label="Carrinho">🛒</span>
        {cart.length > 0 && (
          <span className="cart-count">{cart.length}</span>
        )}
      </div>

      {/* Modal do carrinho */}
      {isModalOpen && <CartModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default CartIcon;