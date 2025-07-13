import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Copy, QrCode, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { orderService } from '../services/orderService';
import { mercadopagoService, CustomerData } from '../services/mercadopagoService';
import { useCart } from '../contexts/CartContext';

interface PixPaymentProps {
  amount: number;
  orderId: string;
  customerName: string;
  customerData?: CustomerData;
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
  const [pixData, setPixData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [realOrderId, setRealOrderId] = useState<string | null>(null);
  const { toast } = useToast();
  const { state } = useCart();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const generatePix = async () => {
    if (!customerData) {
      toast({
        title: "Dados do cliente necessários",
        description: "Preencha todos os dados pessoais antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('📱 Gerando PIX real no Mercado Pago...');
      
      // Criar o pedido no banco de dados
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
      setRealOrderId(order.id);
      
      console.log('✅ Pedido criado com sucesso! ID:', order.id);
      setOrderCreated(true);
      
      // Salvar dados do cliente no localStorage
      localStorage.setItem('customerData', JSON.stringify(customerData));
      localStorage.setItem('orderId', order.id);
      
      // Gerar PIX real no Mercado Pago
      console.log('📱 Gerando QR Code PIX...');
      const pixResponse = await mercadopagoService.generatePixQRCode(
        amount,
        customerData,
        order.id
      );

      if (!pixResponse.success) {
        throw new Error(pixResponse.error || 'Erro ao gerar PIX');
      }

      setPixData(pixResponse);
      
      toast({
        title: "PIX gerado com sucesso!",
        description: "Escaneie o QR Code ou copie o código PIX para pagar.",
      });
    } catch (error) {
      console.error('❌ Erro ao gerar PIX:', error);
      toast({
        title: "Erro ao gerar PIX",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
      onPaymentError?.(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!pixData?.qrCode) return;
    
    try {
      await navigator.clipboard.writeText(pixData.qrCode);
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

  // Função para checar status do pedido
  const checkOrderStatus = async (orderId: string) => {
    try {
      const order = await orderService.getOrderById(orderId);
      if (order && order.status === 'confirmed') {
        toast({
          title: 'Pagamento realizado com sucesso! 🎉',
          description: 'Seu pagamento PIX foi aprovado.',
        });
        if (pollingRef.current) clearInterval(pollingRef.current);
        onPaymentSuccess?.();
      }
    } catch (error) {
      // Ignorar erros de polling
    }
  };

  useEffect(() => {
    if (amount > 0 && !orderCreated && customerData) {
      generatePix();
    }
  }, [amount, orderCreated, customerData]);

  useEffect(() => {
    if (realOrderId) {
      const unsubscribe = orderService.onOrderStatusChange(realOrderId, (order) => {
        if (order && order.status === 'confirmed') {
          toast({
            title: 'Pagamento realizado com sucesso! 🎉',
            description: 'Seu pagamento PIX foi aprovado.',
          });
          onPaymentSuccess?.();
        }
      });
      return () => unsubscribe();
    }
  }, [realOrderId]);

  // Verificar se o Mercado Pago está configurado
  const isConfigured = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;

  if (!isConfigured) {
    return (
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Pagamento PIX
          </CardTitle>
          <CardDescription>
            PIX indisponível - Mercado Pago não configurado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-yellow-800 mb-2">
              <AlertCircle className="w-4 h-4" />
              ⚠️ PIX não configurado
            </div>
            <p className="text-xs text-yellow-700">
              Configure a variável VITE_MERCADOPAGO_ACCESS_TOKEN para ativar PIX real.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="shadow-warm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Gerando PIX real...</span>
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
          Pague com PIX - instantâneo e seguro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pixData ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Código PIX</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pixData.qrCode}
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

            {pixData.qrCodeBase64 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">QR Code</label>
                <div className="flex justify-center">
                  <img
                    src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="border rounded-lg"
                    style={{ maxWidth: '200px', height: 'auto' }}
                  />
                </div>
              </div>
            )}

            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Valor:</span>
                <span className="font-medium">R$ {amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pedido:</span>
                <span className="font-medium">{realOrderId || orderId}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Status:</span>
                <span className="font-medium">PIX gerado ✓</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Abra o app do seu banco</p>
              <p>• Escolha a opção PIX</p>
              <p>• Escaneie o QR Code ou cole o código</p>
              <p>• Confirme o pagamento</p>
              <p>• O pagamento será confirmado automaticamente</p>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted-foreground">Aguardando geração do PIX...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PixPayment; 