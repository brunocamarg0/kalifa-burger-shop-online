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

      // Access Token real do Mercado Pago fornecido pelo usuário
      const ACCESS_TOKEN = "APP_USR-8451194223154404-071216-60028bb6c6e5a1270b84bddd9bf088f0-2556596208";

      const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
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

      if (!response.ok) {
        console.error("Erro na resposta do Mercado Pago:", data);
        throw new Error(data.message || `Erro ${response.status}: ${response.statusText}`);
      }

      if (data.init_point) {
        // Abrir em nova aba
        window.open(data.init_point, '_blank');
        toast({
          title: "Redirecionando...",
          description: "Aguarde, você será redirecionado para o Mercado Pago.",
        });
      } else {
        console.error("Resposta do Mercado Pago sem init_point:", data);
        throw new Error("Resposta inválida do Mercado Pago");
      }
    } catch (erro) {
      console.error("Erro ao realizar pagamento:", erro);
      
      let errorMessage = "Erro ao conectar com o Mercado Pago. Tente novamente.";
      
      if (erro instanceof Error) {
        if (erro.message.includes("401")) {
          errorMessage = "Token de acesso inválido. Entre em contato com o suporte.";
        } else if (erro.message.includes("400")) {
          errorMessage = "Dados inválidos. Verifique os itens do pedido.";
        } else if (erro.message.includes("403")) {
          errorMessage = "Acesso negado. Verifique as permissões da conta.";
        } else {
          errorMessage = erro.message;
        }
      }

      toast({
        title: "Erro no Pagamento",
        description: errorMessage,
        variant: "destructive",
      });
      onPaymentError?.(errorMessage);
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