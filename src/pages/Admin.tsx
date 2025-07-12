import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { Order, OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  Truck, 
  X, 
  RefreshCw, 
  Download, 
  Upload,
  DollarSign,
  Users,
  Package,
  AlertCircle
} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadOrders();
    loadStats();
  }, []);

  const loadOrders = async () => {
    try {
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const orderStats = await orderService.getOrderStats();
      setStats(orderStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      await loadOrders();
      await loadStats();
      
      toast({
        title: "Status atualizado",
        description: `Pedido #${orderId} atualizado para ${getStatusLabel(status)}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Pronto',
      delivering: 'Entregando',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return labels[status];
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      preparing: 'bg-orange-500',
      ready: 'bg-green-500',
      delivering: 'bg-purple-500',
      delivered: 'bg-green-600',
      cancelled: 'bg-red-500'
    };
    return colors[status];
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      preparing: RefreshCw,
      ready: Package,
      delivering: Truck,
      delivered: CheckCircle,
      cancelled: X
    };
    return icons[status];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const exportOrders = () => {
    const data = orderService.exportOrders();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedidos-kalifa-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-4 hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Site
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold font-display">
            Painel 
            <span className="bg-hero-gradient bg-clip-text text-transparent"> Administrativo</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie pedidos e acompanhe o desempenho do seu negócio
          </p>
        </div>

        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-warm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pedidos Hoje</p>
                    <p className="text-2xl font-bold">{stats.todayOrders}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-warm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Receita Hoje</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.todayRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-warm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Em Preparação</p>
                    <p className="text-2xl font-bold">{stats.preparingOrders}</p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-warm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Em Entrega</p>
                    <p className="text-2xl font-bold">{stats.deliveringOrders}</p>
                  </div>
                  <Truck className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={loadOrders} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={exportOrders} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Pedidos
          </Button>
        </div>

        {/* Tabs de Pedidos */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="all">Todos ({orders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pendentes ({orders.filter(o => o.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmados ({orders.filter(o => o.status === 'confirmed').length})</TabsTrigger>
            <TabsTrigger value="preparing">Preparando ({orders.filter(o => o.status === 'preparing').length})</TabsTrigger>
            <TabsTrigger value="ready">Prontos ({orders.filter(o => o.status === 'ready').length})</TabsTrigger>
            <TabsTrigger value="delivering">Entregando ({orders.filter(o => o.status === 'delivering').length})</TabsTrigger>
            <TabsTrigger value="delivered">Entregues ({orders.filter(o => o.status === 'delivered').length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados ({orders.filter(o => o.status === 'cancelled').length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <Card key={order.id} className="shadow-warm hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold">#{order.id}</h3>
                              <Badge className={getStatusColor(order.status)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {getStatusLabel(order.status)}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(order.createdAt)}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="font-medium mb-2">Cliente</h4>
                                <p className="text-sm">{order.customer.name}</p>
                                <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Endereço</h4>
                                <p className="text-sm">{order.customer.address}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.customer.neighborhood}, {order.customer.city}
                                </p>
                              </div>
                            </div>

                            <div className="mb-4">
                              <h4 className="font-medium mb-2">Itens ({order.items.length})</h4>
                              <div className="space-y-1">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>{formatCurrency(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                              <Separator className="my-2" />
                              <div className="flex justify-between font-medium">
                                <span>Total</span>
                                <span>{formatCurrency(order.finalTotal)}</span>
                              </div>
                            </div>

                            {order.notes && (
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Observações</h4>
                                <p className="text-sm text-muted-foreground">{order.notes}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            {order.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                >
                                  Confirmar
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                >
                                  Cancelar
                                </Button>
                              </>
                            )}

                            {order.status === 'confirmed' && (
                              <Button 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                              >
                                Iniciar Preparo
                              </Button>
                            )}

                            {order.status === 'preparing' && (
                              <Button 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                              >
                                Pronto
                              </Button>
                            )}

                            {order.status === 'ready' && (
                              <Button 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'delivering')}
                              >
                                Iniciar Entrega
                              </Button>
                            )}

                            {order.status === 'delivering' && (
                              <Button 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                              >
                                Entregue
                              </Button>
                            )}

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  Detalhes
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
                                  <DialogDescription>
                                    Informações completas do pedido
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Cliente</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p><strong>Nome:</strong> {order.customer.name}</p>
                                        <p><strong>Email:</strong> {order.customer.email}</p>
                                        <p><strong>Telefone:</strong> {order.customer.phone}</p>
                                      </div>
                                      <div>
                                        <p><strong>Endereço:</strong> {order.customer.address}</p>
                                        <p><strong>Bairro:</strong> {order.customer.neighborhood}</p>
                                        <p><strong>Cidade:</strong> {order.customer.city}</p>
                                        <p><strong>CEP:</strong> {order.customer.zipCode}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Pagamento</h4>
                                    <p className="text-sm">
                                      <strong>Método:</strong> {order.payment.method.toUpperCase()}
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Itens</h4>
                                    <div className="space-y-2">
                                      {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                          <span>{item.quantity}x {item.name}</span>
                                          <span>{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between font-medium">
                                      <span>Subtotal:</span>
                                      <span>{formatCurrency(order.total)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Taxa de entrega:</span>
                                      <span>{formatCurrency(order.deliveryFee)}</span>
                                    </div>
                                    <div className="flex justify-between font-medium text-lg">
                                      <span>Total:</span>
                                      <span>{formatCurrency(order.finalTotal)}</span>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Timeline</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><strong>Criado:</strong> {formatDate(order.createdAt)}</p>
                                      <p><strong>Atualizado:</strong> {formatDate(order.updatedAt)}</p>
                                      {order.estimatedDeliveryTime && (
                                        <p><strong>Entrega estimada:</strong> {formatDate(order.estimatedDeliveryTime)}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin; 