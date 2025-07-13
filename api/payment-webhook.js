// API function para processar webhooks do Mercado Pago
// Deploy no Vercel como serverless function

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

      // Aqui você pode implementar a lógica para:
      // 1. Verificar o status do pagamento
      // 2. Atualizar o pedido no banco de dados
      // 3. Enviar notificações
      // 4. Processar o pedido

      // Por enquanto, vamos apenas logar
      console.log('✅ Webhook processado com sucesso');
      
      return res.status(200).json({
        success: true,
        message: 'Webhook processado com sucesso',
        paymentId
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