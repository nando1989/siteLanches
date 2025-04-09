// import { database } from "../../../firebaseConfig";
// import { ref, remove } from "firebase/database";
// import './style.css';

// const KanbanCard = ({ pedido, onDelete }) => {
//   const handleExcluirPedido = async () => {
//     try {
//       if (window.confirm(`Tem certeza que deseja excluir o pedido de ${pedido.nome}?`)) {
//         const pedidoRef = ref(database, `pedidos/${pedido.id}`);
//         await remove(pedidoRef);
        
//         // Chama a função de callback para notificar o componente pai
//         if (onDelete) onDelete(pedido.id);
//       }
//     } catch (error) {
//       console.error("Erro ao excluir pedido:", error);
//       alert("Ocorreu um erro ao excluir o pedido");
//     }
//   };

//   return (
//     <div className="card">
//       <button 
//         className="btn-excluir"
//         onClick={handleExcluirPedido}
//         title="Excluir pedido"
//       >
//         ×
//       </button>
      
     
//       <p><strong>Cliente:</strong> </p>
//       <p><strong>Telefone:</strong> </p>
//       <p><strong>Endereço:</strong> </p>
//       <p><strong>Pagamento:</strong> </p>
//     </div>
//   );
// };

// export default KanbanCard;