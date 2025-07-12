// Configuração do Mercado Pago
export const MERCADO_PAGO_CONFIG = {
  PUBLIC_KEY: 'APP_USR-c9a5ce0c-f2d3-4a46-b0a9-39c4a5135c86',
  ACCESS_TOKEN: 'APP_USR-8451194223154404-071216-60028bb6c6e5a1270b84bddd9bf088f0-2556596208'
};

// Interface para item do carrinho
export interface CartItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
  description?: string;
}

// Interface para preferência de pagamento
export interface PaymentPreference {
  items: CartItem[];
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: string;
  external_reference?: string;
  notification_url?: string;
}

// Função para criar preferência de pagamento
export const createPaymentPreference = async (items: CartItem[], orderId: string) => {
  try {
    // Detectar o ambiente (desenvolvimento vs produção)
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://kalifa-burger-shop-online.vercel.app'
      : window.location.origin;

    const preference: PaymentPreference = {
      items: items.map(item => ({
        ...item,
        currency_id: 'BRL'
      })),
      back_urls: {
        success: `${baseUrl}/payment/success?order_id=${orderId}`,
        failure: `${baseUrl}/payment/failure?order_id=${orderId}`,
        pending: `${baseUrl}/payment/pending?order_id=${orderId}`
      },
      auto_return: 'approved',
      external_reference: orderId
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Resposta da API:', errorData);
      throw new Error(`Erro ao criar preferência de pagamento: ${response.status}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    throw error;
  }
};

// Função para obter informações do pagamento
export const getPaymentInfo = async (paymentId: string) => {
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao obter informações do pagamento');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao obter pagamento:', error);
    throw error;
  }
}; 