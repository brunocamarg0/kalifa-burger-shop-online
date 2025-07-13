// Webhook para receber atualizações do iFood
// Este endpoint recebe notificações quando o status da entrega muda

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  // Verificar se é uma requisição POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      deliveryId, 
      status, 
      estimatedDeliveryTime, 
      currentLocation, 
      deliveryPartner,
      orderId 
    } = req.body;

    console.log('📨 Webhook iFood recebido:', {
      deliveryId,
      status,
      orderId,
      timestamp: new Date().toISOString()
    });

    // Validar dados obrigatórios
    if (!deliveryId || !status) {
      console.error('❌ Dados obrigatórios ausentes no webhook');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Buscar pedido pelo ID da entrega
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('delivery.deliveryId', '==', deliveryId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error('❌ Pedido não encontrado para deliveryId:', deliveryId);
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderDoc = querySnapshot.docs[0];
    const orderData = orderDoc.data();

    // Mapear status do iFood para status interno
    const statusMap = {
      'preparing': 'preparing',
      'ready': 'ready',
      'picked_up': 'delivering',
      'delivering': 'delivering',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };

    const newOrderStatus = statusMap[status] || 'preparing';

    // Atualizar informações de entrega
    const updatedDelivery = {
      ...orderData.delivery,
      status,
      estimatedDeliveryTime: estimatedDeliveryTime ? new Date(estimatedDeliveryTime) : orderData.delivery?.estimatedDeliveryTime,
      currentLocation,
      deliveryPartner,
      updatedAt: new Date()
    };

    // Atualizar pedido no Firestore
    const orderRef = doc(db, 'orders', orderDoc.id);
    await updateDoc(orderRef, {
      delivery: updatedDelivery,
      status: newOrderStatus,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Pedido atualizado via webhook:', {
      orderId: orderDoc.id,
      oldStatus: orderData.status,
      newStatus: newOrderStatus,
      deliveryStatus: status
    });

    // Responder com sucesso
    res.status(200).json({ 
      success: true, 
      message: 'Order updated successfully',
      orderId: orderDoc.id,
      status: newOrderStatus
    });

  } catch (error) {
    console.error('❌ Erro no webhook iFood:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Configuração para Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}; 