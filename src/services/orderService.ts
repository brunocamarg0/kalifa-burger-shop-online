import { Order, OrderStatus, CustomerInfo, PaymentInfo } from '@/types/order';
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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Serviço de pedidos usando Firebase Firestore
class OrderService {
  private readonly COLLECTION_NAME = 'orders';

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
        description: item.description
      })),
      customer,
      payment,
      status: 'pending',
      total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      deliveryFee: 5.00,
      finalTotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5.00,
      notes,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000) // 45 minutos
    };

    try {
      console.log('💾 Salvando pedido no Firebase...');
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), orderData);
      console.log('✅ Pedido salvo com sucesso! ID:', docRef.id);
      
      // Retornar o pedido com o ID gerado
      const order: Order = {
        id: docRef.id,
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Enviar notificação (simulação)
      await this.sendNotification(order);

      return order;
    } catch (error) {
      console.error('❌ Erro ao salvar pedido:', error);
      throw error;
    }
  }

  // Buscar todos os pedidos (admin)
  async getAllOrders(): Promise<Order[]> {
    try {
      console.log('🔍 Buscando pedidos no Firebase...');
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
      
      console.log('📋 Pedidos encontrados:', orders.length);
      return orders;
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error);
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
      console.log('🔄 Atualizando status do pedido:', orderId, 'para:', status);
      
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

      console.log('✅ Status atualizado com sucesso!');
      
      // Enviar notificação de atualização
      await this.sendStatusUpdateNotification(updatedOrder);

      return updatedOrder;
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      throw error;
    }
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
      console.error('❌ Erro ao buscar pedidos por status:', error);
      return [];
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
      console.error('❌ Erro ao buscar pedidos recentes:', error);
      return [];
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