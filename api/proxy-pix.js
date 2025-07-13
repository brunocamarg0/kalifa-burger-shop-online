// API function para proxy de geração de pagamento PIX Mercado Pago
// Deploy no Vercel como serverless function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  try {
    const { amount, customerData, orderId } = req.body;
    if (!amount || !customerData || !orderId) {
      return res.status(400).json({ success: false, error: 'Dados obrigatórios ausentes' });
    }

    // Token seguro do Mercado Pago (use variável de ambiente no Vercel)
    const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!ACCESS_TOKEN) {
      return res.status(500).json({ success: false, error: 'Token do Mercado Pago não configurado' });
    }

    const paymentData = {
      transaction_amount: amount,
      description: `Pedido #${orderId} - Kalifa Burger`,
      payment_method_id: 'pix',
      payer: {
        email: customerData.email,
        first_name: customerData.name.split(' ')[0],
        last_name: customerData.name.split(' ').slice(1).join(' ')
      },
      external_reference: orderId
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({ success: false, error: errorData.message || 'Erro ao gerar PIX' });
    }

    const payment = await response.json();
    return res.status(200).json({
      success: true,
      paymentId: payment.id,
      qrCode: payment.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: payment.point_of_interaction.transaction_data.qr_code_base64,
      status: payment.status
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Erro interno do servidor' });
  }
} 