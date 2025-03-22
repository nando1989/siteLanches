import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

const pedidosRef = collection(db, "pedidos");

// Criar um pedido
export const criarPedido = async (pedido) => {
  const novoPedido = await addDoc(pedidosRef, pedido);
  return novoPedido.id;
};

// Buscar pedidos
export const buscarPedidos = async () => {
  const snapshot = await getDocs(pedidosRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Atualizar pedido
export const atualizarPedido = async (id, status) => {
  const pedidoDoc = doc(db, "pedidos", id);
  await updateDoc(pedidoDoc, { status });
};

// Deletar pedido
export const deletarPedido = async (id) => {
  const pedidoDoc = doc(db, "pedidos", id);
  await deleteDoc(pedidoDoc);
};
