import { Order } from '@/types/order';

// Serviço de SMS para notificações de pedidos
class SMSService {
  private readonly API_URL = 'https://api.smsapi.com/sms.do'; // Exemplo de API
  private readonly API_TOKEN = process.env.VITE_SMS_API_TOKEN || 'demo_token';

  // Enviar SMS de confirmação de pedido
  async sendOrderConfirmation(order: Order): Promise<boolean> {
    try {
      const message = this.formatOrderConfirmationMessage(order);
      
      // Para demonstração, vamos simular o envio
      console.log('📱 Enviando SMS de confirmação...');
      console.log('📞 Para:', order.customer.phone);
      console.log('💬 Mensagem:', message);
      
      // Em produção, você usaria uma API real de SMS
      // const response = await fetch(this.API_URL, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.API_TOKEN}`
      //   },
      //   body: JSON.stringify({
      //     to: order.customer.phone,
      //     message: message,
      //     from: 'KalifaBurger'
      //   })
      // });
      
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ SMS enviado com sucesso!');
      return true;
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
      
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ SMS de status enviado com sucesso!');
      return true;
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