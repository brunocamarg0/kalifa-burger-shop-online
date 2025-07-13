// API function para processar webhooks do Mercado Pago
// Deploy no Vercel como serverless function

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Inicializar Firebase Admin SDK (evitar inicialização duplicada)
if (!global._firebaseAdminInitialized) {
  initializeApp({
    credential: applicationDefault(),
  });
  global._firebaseAdminInitialized = true;
}
const db = getFirestore();

export default async function handler(req, res) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  try {
    const { type, data } = req.body;

    console.log('📥 Webhook recebido do Mercado Pago:', { type, data });

    // Verificar se é um webhook de pagamento
    if (type === 'payment') {
      const paymentId = data.id;
      
      console.log('💳 Processando pagamento:', paymentId);

      // Buscar detalhes do pagamento no Mercado Pago
      const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${mpToken}` }
      });
      const payment = await paymentRes.json();
      const status = payment.status;
      const orderId = payment.external_reference;
      console.log('🔎 Status do pagamento:', status, 'OrderId:', orderId);

      if (status === 'approved' && orderId) {
        // Atualizar status do pedido no Firestore
        const orderRef = db.collection('orders').doc(orderId);
        await orderRef.update({ status: 'confirmed' });
        console.log('✅ Pedido atualizado para confirmed:', orderId);
      }

      return res.status(200).json({
        success: true,
        message: 'Webhook processado e pedido atualizado',
        paymentId,
        status,
        orderId
      });
    }

    // Se não for um webhook de pagamento, ignorar
    console.log('⚠️ Webhook ignorado - tipo não suportado:', type);
    
    return res.status(200).json({
      success: true,
      message: 'Webhook ignorado'
    });

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
} 