import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Home, RefreshCw } from 'lucide-react';

const PaymentPending = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const orderIdParam = searchParams.get('order_id');
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-muted/20 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>
          
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-yellow-600">
                Pagamento em Processamento
              </CardTitle>
              <CardDescription>
                Seu pagamento está sendo analisado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderId && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Número do Pedido:</p>
                  <p className="font-mono font-bold text-lg">{orderId}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Seu pagamento está sendo processado pelo Mercado Pago.
                </p>
                <p className="text-sm text-muted-foreground">
                  Você receberá uma confirmação assim que for aprovado.
                </p>
                <p className="text-sm text-muted-foreground">
                  Em caso de dúvidas, entre em contato conosco.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  onClick={() => navigate('/')}
                  className="w-full shadow-warm hover:shadow-food-glow transition-all duration-300"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Cardápio
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Verificar Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending; 