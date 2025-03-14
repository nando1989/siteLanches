import { useCart } from "@/context/CartContext";

const CartPage = () => {
  const { cart } = useCart();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Carrinho</h1>
      {cart.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        cart.map((item, index) => (
          <div key={index} className="border p-2 my-2">
            <h2>{item.title}</h2>
            <p>Preço: R$ {item.price.toFixed(2)}</p>
            <p>Extra: {item.hasCheckbox ? "Sim" : "Não"}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CartPage;
