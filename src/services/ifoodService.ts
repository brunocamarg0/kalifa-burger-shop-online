import { Order } from '@/types/order';

// Tipos para integração com iFood
export interface IFoodDeliveryRequest {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    reference?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  deliveryFee: number;
  notes?: string;
  estimatedPreparationTime: number; // em minutos
}

export interface IFoodDeliveryResponse {
  deliveryId: string;
  status: 'accepted' | 'rejected' | 'pending';
  estimatedDeliveryTime?: Date;
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  trackingUrl?: string;
  error?: string;
}

export interface IFoodDeliveryStatus {
  deliveryId: string;
  status: 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled';
  estimatedDeliveryTime?: Date;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  updatedAt: Date;
}

class IFoodService {
  private readonly API_BASE_URL = 'https://api.ifood.com.br';
  private readonly API_KEY = process.env.VITE_IFOOD_API_KEY || '';
  private readonly MERCHANT_ID = process.env.VITE_IFOOD_MERCHANT_ID || '';

  // Verificar se a integração está configurada
  isConfigured(): boolean {
    return !!(this.API_KEY && this.MERCHANT_ID);
  }

  // Solicitar entrega no iFood
  async requestDelivery(order: Order): Promise<IFoodDeliveryResponse> {
    if (!this.isConfigured()) {
      throw new Error('iFood não está configurado. Configure as variáveis de ambiente VITE_IFOOD_API_KEY e VITE_IFOOD_MERCHANT_ID');
    }

    try {
      const deliveryRequest: IFoodDeliveryRequest = {
        orderId: order.id,
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        customerAddress: {
          street: order.customer.address,
          number: '1', // Pode ser extraído do endereço se necessário
          complement: order.customer.complement,
          neighborhood: order.customer.neighborhood,
          city: order.customer.city,
          state: 'SP', // Pode ser configurável
          zipCode: order.customer.zipCode,
          reference: order.notes
        },
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity
        })),
        totalAmount: order.finalTotal,
        deliveryFee: order.deliveryFee || 0,
        notes: order.notes,
        estimatedPreparationTime: 30 // Configurável
      };

      const response = await fetch(`${this.API_BASE_URL}/v1/merchants/${this.MERCHANT_ID}/deliveries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
          'X-IFood-Client-Id': this.MERCHANT_ID
        },
        body: JSON.stringify(deliveryRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na API do iFood: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      
      return {
        deliveryId: data.deliveryId,
        status: data.status,
        estimatedDeliveryTime: data.estimatedDeliveryTime ? new Date(data.estimatedDeliveryTime) : undefined,
        deliveryPartner: data.deliveryPartner,
        trackingUrl: data.trackingUrl
      };

    } catch (error) {
      console.error('Erro ao solicitar entrega no iFood:', error);
      throw error;
    }
  }

  // Buscar status da entrega
  async getDeliveryStatus(deliveryId: string): Promise<IFoodDeliveryStatus> {
    if (!this.isConfigured()) {
      throw new Error('iFood não está configurado');
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/v1/deliveries/${deliveryId}`, {
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'X-IFood-Client-Id': this.MERCHANT_ID
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar status: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        deliveryId: data.deliveryId,
        status: data.status,
        estimatedDeliveryTime: data.estimatedDeliveryTime ? new Date(data.estimatedDeliveryTime) : undefined,
        currentLocation: data.currentLocation,
        deliveryPartner: data.deliveryPartner,
        updatedAt: new Date(data.updatedAt)
      };

    } catch (error) {
      console.error('Erro ao buscar status da entrega:', error);
      throw error;
    }
  }

  // Cancelar entrega
  async cancelDelivery(deliveryId: string, reason?: string): Promise<boolean> {
    if (!this.isConfigured()) {
      throw new Error('iFood não está configurado');
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/v1/deliveries/${deliveryId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
          'X-IFood-Client-Id': this.MERCHANT_ID
        },
        body: JSON.stringify({ reason: reason || 'Cancelado pelo restaurante' })
      });

      return response.ok;

    } catch (error) {
      console.error('Erro ao cancelar entrega:', error);
      throw error;
    }
  }

  // Simular entrega (para desenvolvimento/testes)
  async simulateDelivery(order: Order): Promise<IFoodDeliveryResponse> {
    console.log('🧪 Simulando entrega iFood para pedido:', order.id);
    
    // Simular delay de resposta
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      deliveryId: `ifood_${order.id}_${Date.now()}`,
      status: 'accepted',
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutos
      deliveryPartner: {
        name: 'João Silva',
        phone: '(11) 99999-9999',
        vehicle: 'Moto'
      },
      trackingUrl: `https://tracking.ifood.com.br/delivery/${order.id}`
    };
  }

  // Simular atualização de status (para desenvolvimento/testes)
  async simulateStatusUpdate(deliveryId: string): Promise<IFoodDeliveryStatus> {
    const statuses: Array<'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered'> = [
      'preparing', 'ready', 'picked_up', 'delivering', 'delivered'
    ];
    
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      deliveryId,
      status: randomStatus,
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
      currentLocation: randomStatus === 'delivering' ? {
        latitude: -23.5505,
        longitude: -46.6333
      } : undefined,
      deliveryPartner: {
        name: 'João Silva',
        phone: '(11) 99999-9999',
        vehicle: 'Moto'
      },
      updatedAt: new Date()
    };
  }

  // Mapear status do iFood para status interno
  mapIFoodStatusToOrderStatus(ifoodStatus: string): 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled' {
    const statusMap: Record<string, 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'> = {
      'preparing': 'preparing',
      'ready': 'ready',
      'picked_up': 'delivering',
      'delivering': 'delivering',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    
    return statusMap[ifoodStatus] || 'preparing';
  }
}

export const ifoodService = new IFoodService(); 