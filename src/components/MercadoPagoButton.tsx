import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { createPaymentPreference, CartItem } from '../services/mercadopagoService';
import { Button } from './ui/button';
import { Loader2, CreditCard, ExternalLink } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

// Inicializar Mercado Pago
initMercadoPago('APP_USR-c9a5ce0c-f2d3-4a46-b0a9-39c4a5135c86');

interface MercadoPagoButtonProps {
  items: CartItem[];
  orderId: string;
  total: number;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

const MercadoPagoButton = ({ 
  items, 
  orderId, 
  total, 
  onPaymentSuccess, 
  onPaymentError 
}: MercadoPagoButtonProps) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const createPreference = async () => {
      try {
        setLoading(true);
        console.log('Criando preferência para:', items);
        const preferenceId = await createPaymentPreference(items, orderId);
        console.log('Preferência criada:', preferenceId);
        setPreferenceId(preferenceId);
      } catch (error) {
        console.error('Erro ao criar preferência:', error);
        toast({
          title: "Erro",
          description: "Não foi possível inicializar o pagamento. Tente novamente.",
          variant: "destructive",
        });
        onPaymentError?.('Erro ao criar preferência de pagamento');
      } finally {
        setLoading(false);
      }
    };

    if (items.length > 0) {
      createPreference();
    }
  }, [items, orderId, toast, onPaymentError]);

  const handleDirectPayment = () => {
    if (preferenceId) {
      window.open(`https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`, '_blank');
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

  if (!preferenceId) {
    return (
      <Button disabled className="w-full">
        <CreditCard className="mr-2 h-4 w-4" />
        Pagamento indisponível
      </Button>
    );
  }

  return (
    <div className="w-full space-y-3">
      <Button 
        onClick={handleDirectPayment}
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