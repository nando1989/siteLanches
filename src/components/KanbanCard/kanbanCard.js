
import './style.css';


const KanbanCard = ({ pedido }) => {
  return (
    <div className="card">
      <h3>{pedido.lanche}</h3>
      <p><strong>Cliente:</strong> {pedido.nome}</p>
      <p><strong>Telefone:</strong> {pedido.telefone}</p>
      <p><strong>Endereço:</strong> {pedido.endereco}</p>
      <p><strong>Pagamento:</strong> {pedido.pagamento}</p>
    </div>
  );
};

export default KanbanCard;