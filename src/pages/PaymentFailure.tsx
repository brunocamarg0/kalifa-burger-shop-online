import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, Home, RefreshCw } from 'lucide-react';

const PaymentFailure = () => {
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
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-red-600">
                Pagamento Não Aprovado
              </CardTitle>
              <CardDescription>
                Houve um problema com o processamento do pagamento
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
                  Não se preocupe, seu pedido não foi processado.
                </p>
                <p className="text-sm text-muted-foreground">
                  Você pode tentar novamente ou escolher outro método de pagamento.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  onClick={() => navigate('/checkout')}
                  className="w-full shadow-warm hover:shadow-food-glow transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Cardápio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure; 