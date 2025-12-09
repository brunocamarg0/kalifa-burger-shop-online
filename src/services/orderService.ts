import { Order, OrderStatus, CustomerInfo, PaymentInfo, DeliveryInfo } from '@/types/order';
import { CartItem } from '@/contexts/CartContext';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { ifoodService, IFoodDeliveryResponse } from './ifoodService';

// Serviço de pedidos usando Firebase Firestore com fallback para localStorage
class OrderService {
  private readonly COLLECTION_NAME = 'orders';
  private readonly FALLBACK_KEY = 'hamburger_paulinia_orders_fallback';

  // Salvar pedido
  async createOrder(
    items: CartItem[],
    customer: CustomerInfo,
    payment: PaymentInfo,
    notes?: string
  ): Promise<Order> {
    const orderData = {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        description: item.description,
        customization: item.customization
      })),
      customer,
      payment,
      status: 'pending',
      total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      finalTotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      notes,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000) // 45 minutos
    };

    try {
      console.log('💾 Tentando salvar pedido no Firebase...');
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), orderData);
      console.log('✅ Pedido salvo no Firebase com sucesso! ID:', docRef.id);
      
      // Retornar o pedido com o ID gerado
      const order: Order = {
        id: docRef.id,
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Notificação de pedido criado
      console.log('✅ Pedido criado com sucesso! ID:', order.id);

      return order;
    } catch (error) {
      console.error('❌ Erro ao salvar no Firebase, usando fallback localStorage:', error);
      
      // Fallback para localStorage
      return this.createOrderFallback(items, customer, payment, notes);
    }
  }

  // Fallback para localStorage
  private createOrderFallback(
    items: CartItem[],
    customer: CustomerInfo,
    payment: PaymentInfo,
    notes?: string
  ): Order {
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
      finalTotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000)
    };

    console.log('💾 Salvando pedido no localStorage (fallback)...');
    this.saveOrderFallback(order);
    console.log('✅ Pedido salvo no localStorage com sucesso! ID:', order.id);

    return order;
  }

  // Buscar todos os pedidos (admin)
  async getAllOrders(): Promise<Order[]> {
    try {
      console.log('🔍 Tentando buscar pedidos no Firebase...');
      const querySnapshot = await getDocs(
        query(
          collection(db, this.COLLECTION_NAME),
          orderBy('createdAt', 'desc')
        )
      );
      
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Order);
      });
      
      console.log('📋 Pedidos encontrados no Firebase:', orders.length);
      
      // Se não há pedidos no Firebase, tentar localStorage
      if (orders.length === 0) {
        console.log('🔍 Nenhum pedido no Firebase, buscando no localStorage...');
        const fallbackOrders = this.getAllOrdersFallback();
        console.log('📋 Pedidos encontrados no localStorage:', fallbackOrders.length);
        return fallbackOrders;
      }
      
      return orders;
    } catch (error) {
      console.error('❌ Erro ao buscar no Firebase, usando fallback localStorage:', error);
      return this.getAllOrdersFallback();
    }
  }

  // Fallback para buscar pedidos no localStorage
  private getAllOrdersFallback(): Order[] {
    try {
      const orders = localStorage.getItem(this.FALLBACK_KEY);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('❌ Erro ao buscar no localStorage:', error);
      return [];
    }
  }

  // Buscar pedido por ID
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orders = await this.getAllOrders();
      return orders.find(order => order.id === orderId) || null;
    } catch (error) {
      console.error('❌ Erro ao buscar pedido por ID:', error);
      return null;
    }
  }

  // Atualizar status do pedido
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      console.log('🔄 Tentando atualizar status no Firebase:', orderId, 'para:', status);
      
      const orderRef = doc(db, this.COLLECTION_NAME, orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp()
      });

      // Buscar o pedido atualizado
      const updatedOrder = await this.getOrderById(orderId);
      if (!updatedOrder) {
        throw new Error('Pedido não encontrado após atualização');
      }

      console.log('✅ Status atualizado no Firebase com sucesso!');
      
      // Notificação de status atualizado
      console.log('🔄 Status do pedido atualizado:', updatedOrder.id, 'para:', updatedOrder.status);

      return updatedOrder;
    } catch (error) {
      console.error('❌ Erro ao atualizar no Firebase, usando fallback localStorage:', error);
      return this.updateOrderStatusFallback(orderId, status);
    }
  }

  // Solicitar entrega no iFood
  async requestIFoodDelivery(orderId: string): Promise<Order> {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      console.log('🚚 Solicitando entrega iFood para pedido:', orderId);

      let deliveryResponse: IFoodDeliveryResponse;

      // Verificar se o iFood está configurado
      if (ifoodService.isConfigured()) {
        deliveryResponse = await ifoodService.requestDelivery(order);
      } else {
        // Usar simulação para desenvolvimento
        deliveryResponse = await ifoodService.simulateDelivery(order);
      }

      // Criar informações de entrega
      const deliveryInfo: DeliveryInfo = {
        provider: 'ifood',
        deliveryId: deliveryResponse.deliveryId,
        deliveryPartner: deliveryResponse.deliveryPartner,
        trackingUrl: deliveryResponse.trackingUrl,
        estimatedDeliveryTime: deliveryResponse.estimatedDeliveryTime,
        status: deliveryResponse.status
      };

      // Atualizar pedido com informações de entrega
      const orderRef = doc(db, this.COLLECTION_NAME, orderId);
      await updateDoc(orderRef, {
        delivery: deliveryInfo,
        status: 'preparing',
        updatedAt: serverTimestamp()
      });

      console.log('✅ Entrega iFood solicitada com sucesso!');

      // Buscar pedido atualizado
      const updatedOrder = await this.getOrderById(orderId);
      if (!updatedOrder) {
        throw new Error('Pedido não encontrado após atualização');
      }

      return updatedOrder;

    } catch (error) {
      console.error('❌ Erro ao solicitar entrega iFood:', error);
      throw error;
    }
  }

  // Atualizar status da entrega
  async updateDeliveryStatus(orderId: string, deliveryStatus: string): Promise<Order> {
    try {
      const order = await this.getOrderById(orderId);
      if (!order || !order.delivery) {
        throw new Error('Pedido ou entrega não encontrada');
      }

      console.log('🔄 Atualizando status da entrega:', orderId, 'para:', deliveryStatus);

      // Mapear status do iFood para status interno
      const orderStatus = ifoodService.mapIFoodStatusToOrderStatus(deliveryStatus);

      // Atualizar informações de entrega
      const updatedDelivery: DeliveryInfo = {
        ...order.delivery,
        status: deliveryStatus as any
      };

      const orderRef = doc(db, this.COLLECTION_NAME, orderId);
      await updateDoc(orderRef, {
        delivery: updatedDelivery,
        status: orderStatus,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Status da entrega atualizado com sucesso!');

      // Buscar pedido atualizado
      const updatedOrder = await this.getOrderById(orderId);
      if (!updatedOrder) {
        throw new Error('Pedido não encontrado após atualização');
      }

      return updatedOrder;

    } catch (error) {
      console.error('❌ Erro ao atualizar status da entrega:', error);
      throw error;
    }
  }

  // Buscar status da entrega no iFood
  async refreshDeliveryStatus(orderId: string): Promise<Order> {
    try {
      const order = await this.getOrderById(orderId);
      if (!order || !order.delivery?.deliveryId) {
        throw new Error('Pedido ou ID de entrega não encontrado');
      }

      console.log('🔄 Buscando status da entrega no iFood:', order.delivery.deliveryId);

      let deliveryStatus;

      // Verificar se o iFood está configurado
      if (ifoodService.isConfigured()) {
        deliveryStatus = await ifoodService.getDeliveryStatus(order.delivery.deliveryId);
      } else {
        // Usar simulação para desenvolvimento
        deliveryStatus = await ifoodService.simulateStatusUpdate(order.delivery.deliveryId);
      }

      // Atualizar pedido com novo status
      return await this.updateDeliveryStatus(orderId, deliveryStatus.status);

    } catch (error) {
      console.error('❌ Erro ao buscar status da entrega:', error);
      throw error;
    }
  }

  // Cancelar entrega
  async cancelDelivery(orderId: string, reason?: string): Promise<Order> {
    try {
      const order = await this.getOrderById(orderId);
      if (!order || !order.delivery?.deliveryId) {
        throw new Error('Pedido ou ID de entrega não encontrado');
      }

      console.log('❌ Cancelando entrega:', order.delivery.deliveryId);

      let success = false;

      // Verificar se o iFood está configurado
      if (ifoodService.isConfigured()) {
        success = await ifoodService.cancelDelivery(order.delivery.deliveryId, reason);
      } else {
        // Simular cancelamento
        success = true;
        console.log('🧪 Simulando cancelamento de entrega');
      }

      if (success) {
        // Atualizar pedido como cancelado
        return await this.updateOrderStatus(orderId, 'cancelled');
      } else {
        throw new Error('Falha ao cancelar entrega');
      }

    } catch (error) {
      console.error('❌ Erro ao cancelar entrega:', error);
      throw error;
    }
  }

  // Fallback para atualizar status no localStorage
  private updateOrderStatusFallback(orderId: string, status: OrderStatus): Order {
    const orders = this.getAllOrdersFallback();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Pedido não encontrado');
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();

    localStorage.setItem(this.FALLBACK_KEY, JSON.stringify(orders));
    console.log('✅ Status atualizado no localStorage com sucesso!');

    return orders[orderIndex];
  }

  // Buscar pedidos por status
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, this.COLLECTION_NAME),
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        )
      );
      
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Order);
      });
      
      return orders;
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos por status no Firebase:', error);
      const allOrders = this.getAllOrdersFallback();
      return allOrders.filter(order => order.status === status);
    }
  }

  // Buscar pedidos recentes (últimas 24h)
  async getRecentOrders(): Promise<Order[]> {
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const querySnapshot = await getDocs(
        query(
          collection(db, this.COLLECTION_NAME),
          where('createdAt', '>', yesterday),
          orderBy('createdAt', 'desc')
        )
      );
      
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Order);
      });
      
      return orders;
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos recentes no Firebase:', error);
      const allOrders = this.getAllOrdersFallback();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return allOrders.filter(order => new Date(order.createdAt) > yesterday);
    }
  }

  // Estatísticas dos pedidos
  async getOrderStats() {
    try {
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
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return {
        totalOrders: 0,
        todayOrders: 0,
        totalRevenue: 0,
        todayRevenue: 0,
        pendingOrders: 0,
        preparingOrders: 0,
        deliveringOrders: 0
      };
    }
  }

  // Gerar ID único para pedido (fallback)
  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `KAL-${timestamp}-${random}`.toUpperCase();
  }

  // Salvar pedido no localStorage (fallback)
  private saveOrderFallback(order: Order) {
    const orders = this.getAllOrdersFallback();
    orders.push(order);
    localStorage.setItem(this.FALLBACK_KEY, JSON.stringify(orders));
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

  // Escutar status do pedido em tempo real
  onOrderStatusChange(orderId: string, callback: (order: Order | null) => void) {
    const orderRef = doc(db, this.COLLECTION_NAME, orderId);
    return onSnapshot(orderRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as Order);
      } else {
        callback(null);
      }
    });
  }


  // Exportar dados dos pedidos (para backup)
  async exportOrders(): Promise<string> {
    try {
      const orders = await this.getAllOrders();
      return JSON.stringify(orders, null, 2);
    } catch (error) {
      console.error('❌ Erro ao exportar pedidos:', error);
      return '[]';
    }
  }

  // Importar dados dos pedidos (para backup)
  async importOrders(data: string) {
    try {
      const orders = JSON.parse(data);
      for (const order of orders) {
        await addDoc(collection(db, this.COLLECTION_NAME), order);
      }
      return true;
    } catch (error) {
      console.error('❌ Erro ao importar pedidos:', error);
      return false;
    }
  }
}

export const orderService = new OrderService(); 