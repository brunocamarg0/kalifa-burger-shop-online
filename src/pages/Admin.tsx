import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { menuService, MenuItem } from '@/services/menuService';
import { Order, OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DeliveryManager } from '@/components/DeliveryManager';
import EditOrderItemCustomization from '@/components/EditOrderItemCustomization';
import { OrderItem } from '@/types/order';
import { MEAT_DONENESS_OPTIONS } from '@/types/burger';
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
  AlertCircle,
  LogOut,
  Search,
  Filter,
  Bell,
  Calendar,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  TestTube,
  Edit,
  Save,
  UtensilsCrossed,
  Plus
} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [valueFilter, setValueFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  
  // Estados para gerenciamento de produtos
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'classics',
    image: '/placeholder.svg',
    popular: false,
    spicy: false,
  });
  
  // Estados para edição de itens do pedido
  const [editingOrderItem, setEditingOrderItem] = useState<{
    orderId: string;
    itemIndex: number;
    item: OrderItem;
    basePrice: number;
  } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/painel-da-dona');
  };

  useEffect(() => {
    loadOrders();
    loadStats();
    loadMenuItems();
    
    // Configurar atualização automática a cada 30 segundos
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        loadOrders();
        loadStats();
      }, 30000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh]);

  // Verificar novos pedidos e tocar notificação
  useEffect(() => {
    if (orders.length > lastOrderCount && lastOrderCount > 0) {
      playNotificationSound();
      toast({
        title: "Novo pedido recebido! 🎉",
        description: `Pedido #${orders[0].id} acabou de chegar`,
      });
    }
    setLastOrderCount(orders.length);
  }, [orders.length]);

  // Filtrar pedidos baseado nos filtros
  useEffect(() => {
    let filtered = orders;

    // Filtro por aba
    if (activeTab !== 'all') {
      filtered = filtered.filter(order => order.status === activeTab);
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por data
    if (dateFilter !== 'all') {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => new Date(order.createdAt) >= startOfDay);
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => new Date(order.createdAt) >= weekAgo);
          break;
        case 'month':
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          filtered = filtered.filter(order => new Date(order.createdAt) >= monthAgo);
          break;
      }
    }

    // Filtro por valor
    if (valueFilter !== 'all') {
      switch (valueFilter) {
        case 'low':
          filtered = filtered.filter(order => order.finalTotal <= 30);
          break;
        case 'medium':
          filtered = filtered.filter(order => order.finalTotal > 30 && order.finalTotal <= 60);
          break;
        case 'high':
          filtered = filtered.filter(order => order.finalTotal > 60);
          break;
      }
    }

    setFilteredOrders(filtered);
  }, [orders, activeTab, searchTerm, dateFilter, valueFilter]);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignorar erro se o áudio não puder ser reproduzido
      });
    }
  };

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

  const loadMenuItems = async () => {
    setIsLoadingProducts(true);
    try {
      const items = await menuService.getMenuItems();
      setMenuItems(items);
      
      // Se não houver produtos, tentar inicializar
      if (items.length === 0) {
        toast({
          title: "Inicializando produtos",
          description: "Os produtos padrão estão sendo criados no Firebase...",
        });
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos do menu. Verifique a conexão com o Firebase.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleEditPrice = (product: MenuItem) => {
    setEditingProduct(product.id);
    setEditPrice(product.price.toString());
  };

  const handleSavePrice = async (productId: number) => {
    const price = parseFloat(editPrice.replace(',', '.'));
    
    if (isNaN(price) || price < 0) {
      toast({
        title: "Preço inválido",
        description: "Digite um preço válido",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoadingProducts(true);
      await menuService.updateProductPrice(productId, price);
      await loadMenuItems();
      setEditingProduct(null);
      setEditPrice('');
      
      toast({
        title: "Preço atualizado!",
        description: "O preço foi atualizado com sucesso e já está visível no site",
      });
    } catch (error: any) {
      console.error('Erro ao salvar preço:', error);
      toast({
        title: "Erro ao atualizar preço",
        description: error.message || "Tente novamente. Se o problema persistir, verifique a conexão com o Firebase.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditPrice('');
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price || newProduct.price <= 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, descrição e preço válido",
        variant: "destructive"
      });
      return;
    }

    try {
      await menuService.createProduct({
        name: newProduct.name!,
        description: newProduct.description!,
        price: newProduct.price!,
        category: newProduct.category || 'classics',
        image: newProduct.image || '/placeholder.svg',
        popular: newProduct.popular || false,
        spicy: newProduct.spicy || false,
      });
      
      await loadMenuItems();
      setIsCreateDialogOpen(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: 'classics',
        image: '/placeholder.svg',
        popular: false,
        spicy: false,
      });
      
      toast({
        title: "Produto criado!",
        description: "O produto foi adicionado ao cardápio",
      });
    } catch (error) {
      toast({
        title: "Erro ao criar produto",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${productName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await menuService.deleteProduct(productId);
      await loadMenuItems();
      
      toast({
        title: "Produto deletado!",
        description: `"${productName}" foi removido do cardápio`,
      });
    } catch (error) {
      toast({
        title: "Erro ao deletar produto",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  const handleSaveOrderItem = async (updatedItem: OrderItem, newPrice: number) => {
    if (!editingOrderItem) return;

    try {
      await orderService.updateOrderItem(
        editingOrderItem.orderId,
        editingOrderItem.itemIndex,
        updatedItem
      );
      
      await loadOrders();
      await loadStats();
      setEditingOrderItem(null);
      
      toast({
        title: "Item atualizado!",
        description: "As customizações do item foram atualizadas com sucesso",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar item:', error);
      toast({
        title: "Erro ao atualizar item",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      classics: 'Clássicos',
      premium: 'Premium',
      specials: 'Especiais',
      veggie: 'Vegetarianos'
    };
    return labels[category] || category;
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
    a.download = `pedidos-hamburger-paulinia-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('all');
    setValueFilter('all');
    setActiveTab('all');
  };

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
      {/* Áudio para notificações */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:bg-muted/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Site
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 ${autoRefresh ? 'bg-green-50 text-green-600' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto ON' : 'Auto OFF'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display">
            Painel 
            <span className="bg-hero-gradient bg-clip-text text-transparent"> Administrativo</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie pedidos e acompanhe o desempenho do seu negócio
          </p>
        </div>

        {/* Estatísticas Melhoradas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-warm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pedidos Hoje</p>
                    <p className="text-2xl font-bold">{stats.todayOrders}</p>
                    <p className="text-xs text-green-600">+{stats.todayOrders > 0 ? Math.round((stats.todayOrders / Math.max(stats.totalOrders, 1)) * 100) : 0}% do total</p>
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
                    <p className="text-xs text-green-600">Média: {formatCurrency(stats.todayOrders > 0 ? stats.todayRevenue / stats.todayOrders : 0)}</p>
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
                    <p className="text-xs text-orange-600">Aguardando finalização</p>
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
                    <p className="text-xs text-purple-600">A caminho do cliente</p>
                  </div>
                  <Truck className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros e Busca */}
        <Card className="mb-8 shadow-warm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, telefone, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as datas</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                </SelectContent>
              </Select>

              <Select value={valueFilter} onValueChange={setValueFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por valor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os valores</SelectItem>
                  <SelectItem value="low">Até R$ 30</SelectItem>
                  <SelectItem value="medium">R$ 30 - R$ 60</SelectItem>
                  <SelectItem value="high">Acima de R$ 60</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={clearFilters} variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

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
          <Button 
            onClick={() => navigate('/ifood-test')} 
            variant="outline"
            className="bg-orange-50 text-orange-700 hover:bg-orange-100"
          >
            <TestTube className="w-4 h-4 mr-2" />
            Testes iFood
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="w-4 h-4" />
            Notificações {autoRefresh ? 'ativadas' : 'desativadas'}
          </div>
        </div>

        {/* Tabs de Pedidos e Produtos */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="all">Todos ({filteredOrders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pendentes ({orders.filter(o => o.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmados ({orders.filter(o => o.status === 'confirmed').length})</TabsTrigger>
            <TabsTrigger value="preparing">Preparando ({orders.filter(o => o.status === 'preparing').length})</TabsTrigger>
            <TabsTrigger value="ready">Prontos ({orders.filter(o => o.status === 'ready').length})</TabsTrigger>
            <TabsTrigger value="delivering">Entregando ({orders.filter(o => o.status === 'delivering').length})</TabsTrigger>
            <TabsTrigger value="delivered">Entregues ({orders.filter(o => o.status === 'delivered').length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados ({orders.filter(o => o.status === 'cancelled').length})</TabsTrigger>
            <TabsTrigger value="delivery">Entregas ({orders.filter(o => o.delivery).length})</TabsTrigger>
            <TabsTrigger value="products">
              <UtensilsCrossed className="w-4 h-4 mr-1" />
              Produtos ({menuItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                  {(searchTerm || dateFilter !== 'all' || valueFilter !== 'all') && (
                    <Button onClick={clearFilters} variant="outline" className="mt-4">
                      Limpar filtros
                    </Button>
                  )}
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
                              <Badge variant="outline" className="ml-auto">
                                {formatCurrency(order.finalTotal)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  Cliente
                                </h4>
                                <p className="text-sm font-medium">{order.customer.name}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="w-3 h-3" />
                                  {order.customer.phone}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="w-3 h-3" />
                                  {order.customer.email}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Endereço
                                </h4>
                                <p className="text-sm">{order.customer.address}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.customer.neighborhood}, {order.customer.city}
                                </p>
                                {order.customer.complement && (
                                  <p className="text-sm text-muted-foreground">
                                    {order.customer.complement}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="mb-4">
                              <h4 className="font-medium mb-2">Itens ({order.items.length})</h4>
                              <div className="space-y-2">
                                {order.items.map((item, index) => {
                                  // Calcular preço base (sem customizações)
                                  const basePrice = item.customization 
                                    ? item.price - 
                                      (item.customization.addons.reduce((sum, a) => sum + a.price, 0) +
                                       item.customization.extraSauces.reduce((sum, s) => sum + s.price, 0))
                                    : item.price;
                                  
                                  return (
                                    <div key={index} className="p-2 bg-muted/30 rounded-lg">
                                      <div className="flex justify-between items-start mb-1">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">
                                              {item.quantity}x {item.name}
                                            </span>
                                            {item.customization && (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setEditingOrderItem({
                                                  orderId: order.id,
                                                  itemIndex: index,
                                                  item,
                                                  basePrice
                                                })}
                                                className="h-6 text-xs"
                                              >
                                                <Edit className="w-3 h-3 mr-1" />
                                                Editar
                                              </Button>
                                            )}
                                          </div>
                                          
                                          {/* Mostrar customizações */}
                                          {item.customization && (
                                            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                              {item.customization.meatDoneness && (
                                                <div>
                                                  <strong>Ponto:</strong> {
                                                    MEAT_DONENESS_OPTIONS.find(o => o.value === item.customization?.meatDoneness)?.label
                                                  }
                                                </div>
                                              )}
                                              {item.customization.addons.length > 0 && (
                                                <div>
                                                  <strong>Extras:</strong> {item.customization.addons.map(a => a.name).join(', ')}
                                                  {item.customization.addons.reduce((sum, a) => sum + a.price, 0) > 0 && (
                                                    <span className="ml-1">
                                                      (+R$ {item.customization.addons.reduce((sum, a) => sum + a.price, 0).toFixed(2)})
                                                    </span>
                                                  )}
                                                </div>
                                              )}
                                              {item.customization.extraSauces.length > 0 && (
                                                <div>
                                                  <strong>Molhos:</strong> {item.customization.extraSauces.map(s => s.name).join(', ')}
                                                  {item.customization.extraSauces.reduce((sum, s) => sum + s.price, 0) > 0 && (
                                                    <span className="ml-1">
                                                      (+R$ {item.customization.extraSauces.reduce((sum, s) => sum + s.price, 0).toFixed(2)})
                                                    </span>
                                                  )}
                                                </div>
                                              )}
                                              {item.customization.sachets.length > 0 && (
                                                <div>
                                                  <strong>Saches:</strong> {item.customization.sachets.map(s => s.name).join(', ')}
                                                </div>
                                              )}
                                              {item.customization.observations && (
                                                <div className="italic">
                                                  <strong>Obs:</strong> {item.customization.observations}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        <span className="font-medium text-sm">
                                          {formatCurrency(item.price * item.quantity)}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
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
                                <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                                  {order.notes}
                                </p>
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

          {/* Aba de Entregas */}
          <TabsContent value="delivery" className="space-y-4">
            {orders.filter(o => o.delivery).length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma entrega configurada</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Configure entregas para pedidos prontos para entrega
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders
                  .filter(o => o.delivery)
                  .map((order) => (
                    <Card key={order.id} className="shadow-warm hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold">#{order.id}</h3>
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{getStatusLabel(order.status)}</span>
                              </Badge>
                              <Badge variant="outline" className="ml-auto">
                                {formatCurrency(order.finalTotal)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  Cliente
                                </h4>
                                <p className="text-sm font-medium">{order.customer.name}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="w-3 h-3" />
                                  {order.customer.phone}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="w-3 h-3" />
                                  {order.customer.email}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Endereço
                                </h4>
                                <p className="text-sm">{order.customer.address}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.customer.neighborhood}, {order.customer.city}
                                </p>
                                {order.customer.complement && (
                                  <p className="text-sm text-muted-foreground">
                                    {order.customer.complement}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Informações de Entrega */}
                            {order.delivery && (
                              <div className="mb-4">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Truck className="w-4 h-4" />
                                  Entrega iFood
                                </h4>
                                <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">ID da Entrega:</span>
                                    <span className="text-sm text-muted-foreground">{order.delivery.deliveryId}</span>
                                  </div>
                                  {order.delivery.deliveryPartner && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">Entregador:</span>
                                      <span className="text-sm text-muted-foreground">{order.delivery.deliveryPartner.name}</span>
                                    </div>
                                  )}
                                  {order.delivery.estimatedDeliveryTime && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">Entrega estimada:</span>
                                      <span className="text-sm text-muted-foreground">
                                        {formatDate(order.delivery.estimatedDeliveryTime)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  Gerenciar Entrega
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Gerenciar Entrega - Pedido #{order.id}</DialogTitle>
                                  <DialogDescription>
                                    Configure e acompanhe a entrega deste pedido
                                  </DialogDescription>
                                </DialogHeader>
                                <DeliveryManager 
                                  order={order} 
                                  onOrderUpdate={(updatedOrder) => {
                                    // Atualizar a lista de pedidos
                                    setOrders(prev => 
                                      prev.map(o => o.id === updatedOrder.id ? updatedOrder : o)
                                    );
                                  }} 
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          {/* Aba de Produtos */}
          <TabsContent value="products" className="space-y-4">
            <Card className="shadow-warm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <UtensilsCrossed className="w-5 h-5" />
                      Gerenciamento de Produtos
                    </CardTitle>
                    <CardDescription>
                      Gerencie os preços e informações dos produtos do cardápio
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Novo Produto
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Adicionar Novo Produto</DialogTitle>
                          <DialogDescription>
                            Preencha as informações do novo produto do cardápio
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="new-name">Nome do Produto *</Label>
                            <Input
                              id="new-name"
                              value={newProduct.name || ''}
                              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                              placeholder="Ex: Hamburger Kalifa Classic"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-description">Descrição *</Label>
                            <Input
                              id="new-description"
                              value={newProduct.description || ''}
                              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                              placeholder="Descrição detalhada do produto"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="new-price">Preço (R$) *</Label>
                              <Input
                                id="new-price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={newProduct.price || ''}
                                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-category">Categoria *</Label>
                              <Select
                                value={newProduct.category || 'classics'}
                                onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="classics">Clássicos</SelectItem>
                                  <SelectItem value="premium">Premium</SelectItem>
                                  <SelectItem value="specials">Especiais</SelectItem>
                                  <SelectItem value="veggie">Vegetarianos</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="new-image">URL da Imagem</Label>
                            <Input
                              id="new-image"
                              value={newProduct.image || ''}
                              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                              placeholder="/placeholder.svg ou URL da imagem"
                            />
                          </div>
                          <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="new-popular"
                                checked={newProduct.popular || false}
                                onChange={(e) => setNewProduct({ ...newProduct, popular: e.target.checked })}
                                className="rounded"
                              />
                              <Label htmlFor="new-popular">Produto Popular</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="new-spicy"
                                checked={newProduct.spicy || false}
                                onChange={(e) => setNewProduct({ ...newProduct, spicy: e.target.checked })}
                                className="rounded"
                              />
                              <Label htmlFor="new-spicy">Produto Picante</Label>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleCreateProduct}>
                              <Save className="w-4 h-4 mr-2" />
                              Criar Produto
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button onClick={loadMenuItems} variant="outline" disabled={isLoadingProducts}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                      Atualizar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingProducts ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum produto encontrado</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {menuItems.map((product) => (
                      <Card key={product.id} className="shadow-warm hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <Badge variant="outline">{getCategoryLabel(product.category)}</Badge>
                                {product.popular && (
                                  <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                                )}
                                {product.spicy && (
                                  <Badge variant="destructive">Picante</Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                              
                              <div className="flex items-center gap-4">
                                {editingProduct === product.id ? (
                                  <div className="flex items-center gap-2">
                                    <Label htmlFor={`price-${product.id}`} className="font-medium">
                                      Preço:
                                    </Label>
                                    <Input
                                      id={`price-${product.id}`}
                                      type="text"
                                      value={editPrice}
                                      onChange={(e) => setEditPrice(e.target.value)}
                                      placeholder="0.00"
                                      className="w-32"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => handleSavePrice(product.id)}
                                      className="flex items-center gap-1"
                                    >
                                      <Save className="w-4 h-4" />
                                      Salvar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={handleCancelEdit}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">Preço:</span>
                                    <span className="text-2xl font-bold text-primary">
                                      {formatCurrency(product.price)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {editingProduct !== product.id && (
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditPrice(product)}
                                  className="flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Editar Preço
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                  Deletar
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      {/* Dialog de edição de item do pedido */}
      {editingOrderItem && (
        <EditOrderItemCustomization
          item={editingOrderItem.item}
          basePrice={editingOrderItem.basePrice}
          onSave={handleSaveOrderItem}
          onCancel={() => setEditingOrderItem(null)}
        />
      )}
    </div>
  );
};

export default Admin; 