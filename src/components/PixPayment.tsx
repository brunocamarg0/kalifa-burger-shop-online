import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Copy, QrCode, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { orderService } from '../services/orderService';
import { useCart } from '../contexts/CartContext';

interface PixPaymentProps {
  amount: number;
  orderId: string;
  customerName: string;
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
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

const PixPayment = ({ 
  amount, 
  orderId, 
  customerName, 
  customerData,
  onPaymentSuccess, 
  onPaymentError 
}: PixPaymentProps) => {
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const { toast } = useToast();
  const { state } = useCart();

  const generatePix = async () => {
    setLoading(true);
    try {
      console.log('💳 Gerando PIX e criando pedido...');
      
      // Criar o pedido no banco de dados
      if (customerData && state.items.length > 0) {
        console.log('📝 Criando pedido no banco de dados...');
        
        const order = await orderService.createOrder(
          state.items,
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
            method: 'pix',
            cardNumber: '',
            cardExpiry: '',
            cardCvv: '',
            cardName: ''
          },
          customerData.notes
        );
        
        console.log('✅ Pedido criado com sucesso! ID:', order.id);
        setOrderCreated(true);
        
        // Salvar dados do cliente no localStorage
        localStorage.setItem('customerData', JSON.stringify(customerData));
        localStorage.setItem('orderId', order.id);
      }
      
      // Simular geração do PIX
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPixCode('00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5913Kalifa Burger6009Sao Paulo62070503***6304E2CA');
      
      toast({
        title: "PIX gerado com sucesso!",
        description: "Copie o código PIX para pagar.",
      });
    } catch (error) {
      console.error('❌ Erro ao gerar PIX:', error);
      toast({
        title: "Erro ao gerar PIX",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast({
        title: "Código PIX copiado!",
        description: "Cole no seu app de pagamento.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Copie manualmente o código.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (amount > 0 && !orderCreated) {
      generatePix();
    }
  }, [amount, orderCreated]);

  if (loading) {
    return (
      <Card className="shadow-warm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Gerando PIX e criando pedido...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Pagamento PIX
        </CardTitle>
        <CardDescription>
          Copie o código PIX para pagar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Código PIX</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pixCode}
              readOnly
              className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm font-mono"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Valor:</span>
            <span className="font-medium">R$ {amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Pedido:</span>
            <span className="font-medium">{orderId}</span>
          </div>
          {orderCreated && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Status:</span>
              <span className="font-medium">Pedido criado ✓</span>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Abra o app do seu banco</p>
          <p>• Escolha a opção PIX</p>
          <p>• Cole o código copiado</p>
          <p>• Confirme o pagamento</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PixPayment; 