import { useCart } from '../../context/CartContext';
import { useState } from "react";

const ProductCard = ({ id, title, price }) => {
  const { addToCart } = useCart();
  const [checked, setChecked] = useState(false);

  const handleAddToCart = () => {
    addToCart({ id, title, price, hasCheckbox: checked });
  };

  return (
    <div className="border p-4 rounded">
      <h2>{title}</h2>
      <p>Preço: R$ {price.toFixed(2)}</p>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />{" "}
        Incluir extra
      </label>
      <button className="bg-blue-500 text-white px-4 py-2 mt-2" onClick={handleAddToCart}>
        Avançar
      </button>
    </div>
  );
};

export default ProductCard;
