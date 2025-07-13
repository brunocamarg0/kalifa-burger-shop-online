import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, CreditCard, ExternalLink, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { CartItem, CustomerData } from '../services/mercadopagoService';
import { mercadopagoService } from '../services/mercadopagoService';
import { orderService } from '../services/orderService';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface MercadoPagoButtonProps {
  items: CartItem[];
  orderId: string;
  total: number;
  customerData?: CustomerData;
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
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const realizarPagamento = async () => {
    if (!customerData) {
      toast({
        title: "Dados do cliente necessários",
        description: "Preencha todos os dados pessoais antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      console.log('💳 Iniciando pagamento real no Mercado Pago...');
      
      // Criar o pedido no banco de dados ANTES do pagamento
      console.log('📝 Criando pedido no banco de dados...');
      
      const order = await orderService.createOrder(
        items.map(item => ({
          id: item.id,
          name: item.title,
          price: item.unit_price,
          quantity: item.quantity,
          image: '', // Será preenchido pelo contexto do carrinho
          description: item.description || ''
        })),
        {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          zipCode: customerData.zipCode,
          neighborhood: customerData.neighborhood,
          complement: customerData.complement
        },
        {
          method: 'mercadopago',
          cardNumber: '',
          cardExpiry: '',
          cardCvv: '',
          cardName: ''
        },
        customerData.notes
      );
      
      console.log('✅ Pedido criado com sucesso! ID:', order.id);
      
      // Criar preferência de pagamento no Mercado Pago
      console.log('💳 Criando preferência de pagamento...');
      const paymentResponse = await mercadopagoService.createPaymentPreference(
        items,
        customerData,
        order.id
      );

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.error || 'Erro ao criar preferência de pagamento');
      }

      console.log('✅ Preferência criada! Redirecionando para pagamento...');
      
      // Salvar dados do cliente no localStorage antes de redirecionar
      localStorage.setItem('customerData', JSON.stringify(customerData));
      localStorage.setItem('orderId', order.id);
      localStorage.setItem('paymentId', paymentResponse.paymentId || '');

      // Redirecionar para o checkout do Mercado Pago
      const checkoutUrl = paymentResponse.sandboxInitPoint || paymentResponse.initPoint;
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('URL de checkout não disponível');
      }

    } catch (erro) {
      console.error("❌ Erro ao realizar pagamento:", erro);
      
      toast({
        title: "Erro no Pagamento",
        description: erro instanceof Error ? erro.message : "Erro ao processar pagamento. Tente novamente.",
        variant: "destructive",
      });
      onPaymentError?.(erro instanceof Error ? erro.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Verificar se o Mercado Pago está configurado
  const isConfigured = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;

  if (!isConfigured) {
    return (
      <div className="w-full space-y-3">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-yellow-800 mb-2">
            <AlertCircle className="w-4 h-4" />
            ⚠️ Mercado Pago não configurado
          </div>
          <p className="text-xs text-yellow-700">
            Configure a variável VITE_MERCADOPAGO_ACCESS_TOKEN para ativar pagamentos reais.
          </p>
        </div>
        
        <Button 
          onClick={realizarPagamento}
          disabled={true}
          className="w-full opacity-50"
          size="lg"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Pagamento Indisponível
        </Button>
      </div>
    );
  }

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
        Pagar com Mercado Pago
      </Button>
      
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>💳 Cartão de crédito, débito, PIX e boleto</p>
        <p>🔒 Pagamento 100% seguro</p>
        <p>⚡ Processamento instantâneo</p>
      </div>
    </div>
  );
};

export default MercadoPagoButton; 