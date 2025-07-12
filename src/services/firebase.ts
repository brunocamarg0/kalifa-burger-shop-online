import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase para Kalifa Burger Shop
const firebaseConfig = {
  apiKey: "AIzaSyDqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq",
  authDomain: "kalifa-burger-shop.firebaseapp.com",
  projectId: "kalifa-burger-shop",
  storageBucket: "kalifa-burger-shop.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app; 