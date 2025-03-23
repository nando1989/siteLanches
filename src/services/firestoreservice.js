import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

const productsRef = collection(db, "products");



//buscar produtos
export const searchProducts = async () => {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Atualizar produtos
export const updateProducts = async (id, status) => {
  const productDoc = doc(db, "products", id);
  await updateDoc(productDoc, { status });
};

// Deletar produtos
export const deletarProducts = async (id) => {
  const productDoc = doc(db, "products", id);
  await deleteDoc(productDoc);
};

export const buscarPedidos = async () => {
  const querySnapshot = await getDocs(collection(db, "pedidos"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const atualizarPedido = async (id, novoStatus) => {
  await updateDoc(doc(db, "pedidos", id), { status: novoStatus });
};

export const criarPedido = async (pedido) => {
  const docRef = await addDoc(collection(db, "pedidos"), pedido);
  return docRef.id;
};
