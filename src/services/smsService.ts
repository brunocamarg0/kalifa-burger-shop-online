import { Order } from '@/types/order';

// Serviço de SMS para notificações de pedidos usando Twilio
class SMSService {
  private readonly TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  private readonly TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
  private readonly TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER;
  
  // Verificar se o Twilio está configurado
  private isTwilioConfigured(): boolean {
    return !!(this.TWILIO_ACCOUNT_SID && this.TWILIO_AUTH_TOKEN && this.TWILIO_PHONE_NUMBER);
  }

  // Enviar SMS de confirmação de pedido
  async sendOrderConfirmation(order: Order): Promise<boolean> {
    try {
      const message = this.formatOrderConfirmationMessage(order);
      
      console.log('📱 Enviando SMS de confirmação...');
      console.log('📞 Para:', order.customer.phone);
      console.log('💬 Mensagem:', message);
      
      // Verificar se o Twilio está configurado
      if (!this.isTwilioConfigured()) {
        console.log('⚠️ Twilio não configurado, simulando envio...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ SMS simulado enviado com sucesso!');
        return true;
      }
      
      // Enviar SMS real via Twilio
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: order.customer.phone,
          message: message,
          type: 'confirmation'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ SMS real enviado com sucesso! SID:', result.sid);
        return true;
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar SMS:', error);
      return false;
    }
  }

  // Enviar SMS de atualização de status
  async sendStatusUpdate(order: Order): Promise<boolean> {
    try {
      const message = this.formatStatusUpdateMessage(order);
      
      console.log('📱 Enviando SMS de atualização de status...');
      console.log('📞 Para:', order.customer.phone);
      console.log('💬 Mensagem:', message);
      
      // Verificar se o Twilio está configurado
      if (!this.isTwilioConfigured()) {
        console.log('⚠️ Twilio não configurado, simulando envio...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ SMS de status simulado enviado com sucesso!');
        return true;
      }
      
      // Enviar SMS real via Twilio
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: order.customer.phone,
          message: message,
          type: 'status_update'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ SMS de status real enviado com sucesso! SID:', result.sid);
        return true;
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar SMS de status:', error);
      return false;
    }
  }

  // Formatar mensagem de confirmação de pedido
  private formatOrderConfirmationMessage(order: Order): string {
    const itemsList = order.items.map(item => 
      `${item.quantity}x ${item.name}`
    ).join(', ');
    
    const deliveryTime = order.estimatedDeliveryTime.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `🍔 Kalifa Burger - Pedido Confirmado!

Pedido #${order.id}
Itens: ${itemsList}
Total: R$ ${order.finalTotal.toFixed(2)}
Entrega estimada: ${deliveryTime}

Acompanhe seu pedido em tempo real!
Obrigado por escolher a Kalifa Burger! 🎉`;
  }

  // Formatar mensagem de atualização de status
  private formatStatusUpdateMessage(order: Order): string {
    const statusMessages = {
      'preparing': '🍳 Seu pedido está sendo preparado!',
      'ready': '✅ Seu pedido está pronto!',
      'delivering': '🚚 Seu pedido está a caminho!',
      'delivered': '🎉 Pedido entregue! Aproveite!',
      'cancelled': '❌ Pedido cancelado. Entre em contato conosco.'
    };

    const statusMessage = statusMessages[order.status] || 'Status atualizado';
    
    return `🍔 Kalifa Burger - ${statusMessage}

Pedido #${order.id}
Status: ${this.getStatusDisplayName(order.status)}

Acompanhe seu pedido em tempo real!`;
  }

  // Obter nome de exibição do status
  private getStatusDisplayName(status: string): string {
    const statusNames = {
      'pending': 'Pendente',
      'preparing': 'Preparando',
      'ready': 'Pronto',
      'delivering': 'Entregando',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };
    
    return statusNames[status] || status;
  }

  // Validar número de telefone
  validatePhoneNumber(phone: string): boolean {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verifica se tem entre 10 e 11 dígitos (com DDD)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }

  // Formatar número de telefone
  formatPhoneNumber(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 11) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
    } else if (cleanPhone.length === 10) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
    }
    
    return phone;
  }
}

export const smsService = new SMSService(); 