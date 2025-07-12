import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { createPaymentPreference, CartItem } from '../services/mercadopagoService';
import { Button } from './ui/button';
import { Loader2, CreditCard } from 'lucide-react';
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
        const preferenceId = await createPaymentPreference(items, orderId);
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
    <div className="w-full">
      <Wallet 
        initialization={{ preferenceId }}
        customization={{ texts: { valueProp: 'smart_option' } }}
      />
    </div>
  );
};

export default MercadoPagoButton; 