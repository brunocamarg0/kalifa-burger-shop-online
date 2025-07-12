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