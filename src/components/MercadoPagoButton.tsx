import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, CreditCard, ExternalLink } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { CartItem } from '../services/mercadopagoService';

interface MercadoPagoButtonProps {
  items: CartItem[];
  orderId: string;
  total: number;
  customerData?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    neighborhood: string;
    complement: string;
    notes: string;
  };
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

const MercadoPagoButton = ({ 
  items, 
  orderId, 
  total, 
  customerData,
  onPaymentSuccess, 
  onPaymentError 
}: MercadoPagoButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const realizarPagamento = async () => {
    try {
      setLoading(true);
      
      // Salvar dados do cliente no localStorage antes de redirecionar
      if (customerData) {
        localStorage.setItem('customerData', JSON.stringify(customerData));
        localStorage.setItem('orderId', orderId);
      }

      // Preparar os itens para o Mercado Pago
      const mpItems = items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        currency_id: "BRL",
        unit_price: item.unit_price
      }));

      const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer APP_USR-c9a5ce0c-f2d3-4a46-b0a9-39c4a5135c86"
        },
        body: JSON.stringify({
          items: mpItems,
          external_reference: orderId,
          back_urls: {
            success: `${window.location.origin}/payment/success`,
            failure: `${window.location.origin}/payment/failure`,
            pending: `${window.location.origin}/payment/pending`
          },
          auto_return: "approved",
          notification_url: `${window.location.origin}/api/webhook/mercadopago`
        })
      });

      const data = await response.json();

      if (data.init_point) {
        // Abrir em nova aba
        window.open(data.init_point, '_blank');
        toast({
          title: "Redirecionando...",
          description: "Aguarde, você será redirecionado para o Mercado Pago.",
        });
      } else {
        console.error("Erro na resposta do Mercado Pago:", data);
        toast({
          title: "Erro",
          description: "Erro ao criar pagamento. Tente novamente.",
          variant: "destructive",
        });
        onPaymentError?.('Erro ao criar pagamento');
      }
    } catch (erro) {
      console.error("Erro ao realizar pagamento:", erro);
      toast({
        title: "Erro",
        description: "Erro ao conectar com o Mercado Pago. Tente novamente.",
        variant: "destructive",
      });
      onPaymentError?.('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Preparando pagamento...
      </Button>
    );
  }

  return (
    <div className="w-full space-y-3">
      <Button 
        onClick={realizarPagamento}
        className="w-full shadow-warm hover:shadow-food-glow transition-all duration-300"
        size="lg"
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        Pagar com Mercado Pago
      </Button>
      
      <div className="text-xs text-muted-foreground text-center">
        Pagamento seguro via Mercado Pago
      </div>
    </div>
  );
};

export default MercadoPagoButton; 