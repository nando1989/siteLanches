import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Importe o Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyAfmYjAHJ7pnA1Q40x_-UzbfWkI5d104JM",
  authDomain: "site-mestre.firebaseapp.com",
  databaseURL: "https://site-mestre-default-rtdb.firebaseio.com", // URL do Realtime Database
  projectId: "site-mestre",
  storageBucket: "site-mestre.appspot.com",
  messagingSenderId: "956735080791",
  appId: "1:956735080791:web:5812d3bde4773c82d25612",
  measurementId: "G-HFMZQR75DZ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Inicialize o Realtime Database

export { database };