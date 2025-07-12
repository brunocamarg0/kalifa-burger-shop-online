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

      // Simular delay do processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular sucesso do pagamento (para demonstração)
      const paymentId = `MP-${Date.now()}`;
      
      toast({
        title: "Pagamento simulado com sucesso! 🎉",
        description: `ID do pagamento: ${paymentId}`,
      });

      // Simular redirecionamento para página de sucesso
      setTimeout(() => {
        window.location.href = `/payment/success?payment_id=${paymentId}&order_id=${orderId}`;
      }, 1500);

      onPaymentSuccess?.(paymentId);

    } catch (erro) {
      console.error("Erro ao realizar pagamento:", erro);
      
      toast({
        title: "Erro no Pagamento",
        description: "Erro ao processar pagamento. Tente novamente.",
        variant: "destructive",
      });
      onPaymentError?.('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Processando pagamento...
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
        Pagar com Mercado Pago (Demo)
      </Button>
      
      <div className="text-xs text-muted-foreground text-center">
        Simulação de pagamento para demonstração
      </div>
    </div>
  );
};

export default MercadoPagoButton; 