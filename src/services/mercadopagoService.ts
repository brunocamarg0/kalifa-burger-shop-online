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

// Interface para dados do cliente
export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  neighborhood: string;
  complement: string;
  notes: string;
}

// Interface para resposta de pagamento
export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  initPoint?: string;
  sandboxInitPoint?: string;
  error?: string;
}

// Serviço de pagamento do Mercado Pago
class MercadoPagoService {
  private readonly ACCESS_TOKEN = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
  private readonly BASE_URL = 'https://api.mercadopago.com';

  // Verificar se o token está configurado
  private isConfigured(): boolean {
    return !!this.ACCESS_TOKEN;
  }

  // Criar preferência de pagamento
  async createPaymentPreference(
    items: CartItem[],
    customerData: CustomerData,
    orderId: string
  ): Promise<PaymentResponse> {
    try {
      if (!this.isConfigured()) {
        throw new Error('Token do Mercado Pago não configurado');
      }

      console.log('💳 Criando preferência de pagamento no Mercado Pago...');
      console.log('📦 Itens:', items);
      console.log('👤 Cliente:', customerData.name);

      // Formatar itens para o Mercado Pago
      const mpItems = items.map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: 'BRL',
        description: item.description || ''
      }));

      // Calcular total
      const total = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
      // const deliveryFee = 5.00;
      // const finalTotal = total + deliveryFee;

      // NÃO adicionar taxa de entrega como item
      // mpItems.push({
      //   id: 'delivery_fee',
      //   title: 'Taxa de Entrega',
      //   quantity: 1,
      //   unit_price: deliveryFee,
      //   currency_id: 'BRL',
      //   description: 'Taxa de entrega'
      // });

      // URLs de retorno baseadas no ambiente
      const baseUrl = window.location.origin;
      const backUrls = {
        success: `${baseUrl}/payment/success`,
        failure: `${baseUrl}/payment/failure`,
        pending: `${baseUrl}/payment/pending`
      };

      // Dados da preferência
      const preferenceData = {
        items: mpItems,
        payer: {
          name: customerData.name,
          email: customerData.email,
          phone: {
            number: customerData.phone.replace(/\D/g, '')
          },
          address: {
            street_name: customerData.address,
            zip_code: customerData.zipCode,
            city: customerData.city,
            neighborhood: customerData.neighborhood
          }
        },
        back_urls: backUrls, // Corrigido aqui!
        auto_return: 'approved',
        external_reference: orderId,
        notification_url: `${baseUrl}/api/payment-webhook`,
        statement_descriptor: 'KALIFA BURGER',
        expires: true,
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
        payment_methods: {
          excluded_payment_types: [
            { id: 'ticket' } // Excluir boleto por enquanto
          ],
          installments: 12 // Permitir até 12x
        }
      };

      console.log('📋 Dados da preferência:', preferenceData);

      // Fazer requisição para o Mercado Pago
      const response = await fetch(`${this.BASE_URL}/checkout/preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferenceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erro do Mercado Pago:', errorData);
        throw new Error(errorData.message || 'Erro ao criar preferência de pagamento');
      }

      const preference = await response.json();
      
      console.log('✅ Preferência criada com sucesso!');
      console.log('🔗 Init Point:', preference.init_point);
      console.log('🔗 Sandbox Init Point:', preference.sandbox_init_point);

      return {
        success: true,
        paymentId: preference.id,
        initPoint: preference.init_point,
        sandboxInitPoint: preference.sandbox_init_point
      };

    } catch (error) {
      console.error('❌ Erro ao criar preferência de pagamento:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // Verificar status do pagamento
  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      if (!this.isConfigured()) {
        throw new Error('Token do Mercado Pago não configurado');
      }

      const response = await fetch(`${this.BASE_URL}/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao consultar pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao consultar pagamento:', error);
      throw error;
    }
  }

  // Processar webhook de pagamento
  async processWebhook(data: any): Promise<any> {
    try {
      console.log('📥 Webhook recebido:', data);
      
      // Verificar se é um pagamento
      if (data.type === 'payment') {
        const paymentId = data.data.id;
        const payment = await this.getPaymentStatus(paymentId);
        
        console.log('💳 Status do pagamento:', payment.status);
        
        return {
          paymentId,
          status: payment.status,
          externalReference: payment.external_reference,
          amount: payment.transaction_amount
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erro ao processar webhook:', error);
      throw error;
    }
  }

  // Gerar QR Code PIX
  async generatePixQRCode(
    amount: number,
    customerData: CustomerData,
    orderId: string
  ): Promise<any> {
    try {
      if (!this.isConfigured()) {
        throw new Error('Token do Mercado Pago não configurado');
      }

      console.log('📱 Gerando QR Code PIX...');

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

      const response = await fetch(`${this.BASE_URL}/v1/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao gerar PIX');
      }

      const payment = await response.json();
      
      console.log('✅ PIX gerado com sucesso!');
      console.log('📱 QR Code:', payment.point_of_interaction.transaction_data.qr_code);
      console.log('📱 QR Code Base64:', payment.point_of_interaction.transaction_data.qr_code_base64);

      return {
        success: true,
        paymentId: payment.id,
        qrCode: payment.point_of_interaction.transaction_data.qr_code,
        qrCodeBase64: payment.point_of_interaction.transaction_data.qr_code_base64,
        status: payment.status
      };

    } catch (error) {
      console.error('❌ Erro ao gerar PIX:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}

export const mercadopagoService = new MercadoPagoService(); 