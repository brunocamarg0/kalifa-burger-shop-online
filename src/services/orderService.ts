import { Order, OrderStatus, CustomerInfo, PaymentInfo } from '@/types/order';
import { CartItem } from '@/contexts/CartContext';

// Simulação de API - em produção, isso seria uma API real
class OrderService {
  private readonly STORAGE_KEY = 'kalifa_orders';
  private readonly ADMIN_KEY = 'kalifa_admin_orders';

  // Salvar pedido
  async createOrder(
    items: CartItem[],
    customer: CustomerInfo,
    payment: PaymentInfo,
    notes?: string
  ): Promise<Order> {
    const order: Order = {
      id: this.generateOrderId(),
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        description: item.description
      })),
      customer,
      payment,
      status: 'pending',
      total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      deliveryFee: 5.00,
      finalTotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5.00,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000) // 45 minutos
    };

    // Salvar no localStorage (simulação de banco de dados)
    this.saveOrder(order);

    // Enviar notificação (simulação)
    await this.sendNotification(order);

    return order;
  }

  // Buscar todos os pedidos (admin)
  async getAllOrders(): Promise<Order[]> {
    console.log('🔍 Buscando pedidos no localStorage...');
    const orders = localStorage.getItem(this.ADMIN_KEY);
    console.log('📦 Dados brutos do localStorage:', orders);
    const parsedOrders = orders ? JSON.parse(orders) : [];
    console.log('📋 Pedidos encontrados:', parsedOrders.length);
    return parsedOrders;
  }

  // Buscar pedido por ID
  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = await this.getAllOrders();
    return orders.find(order => order.id === orderId) || null;
  }

  // Atualizar status do pedido
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const orders = await this.getAllOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Pedido não encontrado');
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();

    // Atualizar tempo estimado baseado no status
    if (status === 'preparing') {
      orders[orderIndex].estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000);
    } else if (status === 'ready') {
      orders[orderIndex].estimatedDeliveryTime = new Date(Date.now() + 15 * 60 * 1000);
    }

    localStorage.setItem(this.ADMIN_KEY, JSON.stringify(orders));
    
    // Enviar notificação de atualização
    await this.sendStatusUpdateNotification(orders[orderIndex]);

    return orders[orderIndex];
  }

  // Buscar pedidos por status
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const orders = await this.getAllOrders();
    return orders.filter(order => order.status === status);
  }

  // Buscar pedidos recentes (últimas 24h)
  async getRecentOrders(): Promise<Order[]> {
    const orders = await this.getAllOrders();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return orders.filter(order => new Date(order.createdAt) > yesterday);
  }

  // Estatísticas dos pedidos
  async getOrderStats() {
    const orders = await this.getAllOrders();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(order => 
      new Date(order.createdAt) >= today
    );

    const totalRevenue = orders.reduce((sum, order) => 
      order.status !== 'cancelled' ? sum + order.finalTotal : sum, 0
    );

    const todayRevenue = todayOrders.reduce((sum, order) => 
      order.status !== 'cancelled' ? sum + order.finalTotal : sum, 0
    );

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      totalRevenue,
      todayRevenue,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      preparingOrders: orders.filter(order => order.status === 'preparing').length,
      deliveringOrders: orders.filter(order => order.status === 'delivering').length
    };
  }

  // Gerar ID único para pedido
  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `KAL-${timestamp}-${random}`.toUpperCase();
  }

  // Salvar pedido no localStorage
  private saveOrder(order: Order) {
    console.log('💾 Salvando pedido:', order.id);
    const orders = this.getAllOrders();
    console.log('📋 Pedidos existentes:', orders.length);
    orders.push(order);
    localStorage.setItem(this.ADMIN_KEY, JSON.stringify(orders));
    console.log('✅ Pedido salvo com sucesso! Total de pedidos:', orders.length);
    
    // Verificar se foi salvo corretamente
    const savedOrders = localStorage.getItem(this.ADMIN_KEY);
    console.log('🔍 Verificação - Pedidos no localStorage:', savedOrders ? JSON.parse(savedOrders).length : 0);
  }

  // Simular envio de notificação
  private async sendNotification(order: Order) {
    console.log('📧 Notificação enviada:', {
      orderId: order.id,
      customer: order.customer.name,
      total: order.finalTotal,
      status: order.status
    });

    // Em produção, aqui você enviaria:
    // - Email para o cliente
    // - WhatsApp/SMS para o cliente
    // - Email/WhatsApp para o restaurante
    // - Notificação push
  }

  // Simular notificação de atualização de status
  private async sendStatusUpdateNotification(order: Order) {
    console.log('🔄 Status atualizado:', {
      orderId: order.id,
      status: order.status,
      customer: order.customer.name
    });

    // Em produção, aqui você enviaria notificação para o cliente
    // sobre a atualização do status do pedido
  }

  // Exportar dados dos pedidos (para backup)
  exportOrders(): string {
    const orders = localStorage.getItem(this.ADMIN_KEY);
    return orders || '[]';
  }

  // Importar dados dos pedidos (para backup)
  importOrders(data: string) {
    try {
      const orders = JSON.parse(data);
      localStorage.setItem(this.ADMIN_KEY, JSON.stringify(orders));
      return true;
    } catch (error) {
      console.error('Erro ao importar pedidos:', error);
      return false;
    }
  }
}

export const orderService = new OrderService(); 