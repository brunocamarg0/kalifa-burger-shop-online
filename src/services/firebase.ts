import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase para Kalifa Burger Shop
const firebaseConfig = {
  apiKey: "AIzaSyAFBmMLgNnosvsHyCprMAv341jrAbluSkk",
  authDomain: "kalifa-burger-shop.firebaseapp.com",
  projectId: "kalifa-burger-shop",
  storageBucket: "kalifa-burger-shop.firebasestorage.app",
  messagingSenderId: "1085270577156",
  appId: "1:1085270577156:web:356fb4731d0fb2af49e551",
  measurementId: "G-59Y95TRLWJ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app; 