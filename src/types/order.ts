import { BurgerCustomization } from './burger';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  customization?: BurgerCustomization;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  neighborhood: string;
  complement?: string;
}

export interface PaymentInfo {
  method: 'pix' | 'credit' | 'debit' | 'cash';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
}

export interface DeliveryInfo {
  provider: 'ifood' | 'internal' | 'manual';
  deliveryId?: string;
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  trackingUrl?: string;
  estimatedDeliveryTime?: Date;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  status?: 'accepted' | 'rejected' | 'pending' | 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled';
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: CustomerInfo;
  payment: PaymentInfo;
  status: OrderStatus;
  total: number;
  deliveryFee: number;
  finalTotal: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: Date;
  delivery?: DeliveryInfo;
}

export type OrderStatus = 
  | 'pending'      // Pedido recebido
  | 'confirmed'    // Pedido confirmado
  | 'preparing'    // Em preparação
  | 'ready'        // Pronto para entrega
  | 'delivering'   // Em entrega
  | 'delivered'    // Entregue
  | 'cancelled';   // Cancelado

export interface OrderNotification {
  orderId: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  timestamp: Date;
} 