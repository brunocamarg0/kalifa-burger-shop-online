import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { ifoodService, IFoodDeliveryResponse, IFoodDeliveryStatus } from '@/services/ifoodService';
import { Order } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Truck, 
  RefreshCw, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Play,
  Settings,
  TestTube,
  Zap,
  Clock,
  MapPin,
  Phone,
  User,
  Package,
  ExternalLink,
  Copy,
  Download,
  Upload
} from 'lucide-react';

const IFoodTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [deliveryResponse, setDeliveryResponse] = useState<IFoodDeliveryResponse | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<IFoodDeliveryStatus | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    loadOrders();
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    const configured = ifoodService.isConfigured();
    setIsConfigured(configured);
    
    if (!configured) {
      toast({
        title: "iFood não configurado",
        description: "Usando modo de simulação para testes",
        variant: "destructive"
      });
    }
  };

  const loadOrders = async () => {
    try {
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  };

  const addTestResult = (test: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    const result = {
      id: Date.now(),
      test,
      status,
      message,
      data,
      timestamp: new Date()
    };
    setTestResults(prev => [result, ...prev]);
  };

  // Teste 1: Verificar configuração
  const testConfiguration = () => {
    addTestResult(
      'Verificar Configuração',
      isConfigured ? 'success' : 'info',
      isConfigured ? 'iFood configurado corretamente' : 'iFood não configurado - usando simulação',
      { configured: isConfigured }
    );
  };

  // Teste 2: Solicitar entrega
  const testRequestDelivery = async (order: Order) => {
    setIsLoading(true);
    try {
      addTestResult('Solicitar Entrega', 'info', `Iniciando solicitação para pedido #${order.id}`, { orderId: order.id });
      
      const response = await ifoodService.requestDelivery(order);
      setDeliveryResponse(response);
      
      addTestResult(
        'Solicitar Entrega',
        'success',
        `Entrega solicitada com sucesso! ID: ${response.deliveryId}`,
        response
      );

      toast({
        title: "Entrega solicitada! 🚚",
        description: `ID: ${response.deliveryId}`,
      });

    } catch (error: any) {
      addTestResult(
        'Solicitar Entrega',
        'error',
        `Erro ao solicitar entrega: ${error.message}`,
        { error: error.message }
      );

      toast({
        title: "Erro ao solicitar entrega",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Teste 3: Buscar status da entrega
  const testGetDeliveryStatus = async (deliveryId: string) => {
    setIsLoading(true);
    try {
      addTestResult('Buscar Status', 'info', `Buscando status para entrega ${deliveryId}`, { deliveryId });
      
      const status = await ifoodService.getDeliveryStatus(deliveryId);
      setDeliveryStatus(status);
      
      addTestResult(
        'Buscar Status',
        'success',
        `Status atualizado: ${status.status}`,
        status
      );

      toast({
        title: "Status atualizado! 🔄",
        description: `Status: ${status.status}`,
      });

    } catch (error: any) {
      addTestResult(
        'Buscar Status',
        'error',
        `Erro ao buscar status: ${error.message}`,
        { error: error.message }
      );

      toast({
        title: "Erro ao buscar status",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Teste 4: Cancelar entrega
  const testCancelDelivery = async (deliveryId: string, reason?: string) => {
    setIsLoading(true);
    try {
      addTestResult('Cancelar Entrega', 'info', `Cancelando entrega ${deliveryId}`, { deliveryId, reason });
      
      const success = await ifoodService.cancelDelivery(deliveryId, reason);
      
      if (success) {
        addTestResult(
          'Cancelar Entrega',
          'success',
          `Entrega cancelada com sucesso`,
          { deliveryId, success }
        );

        toast({
          title: "Entrega cancelada! ❌",
          description: `Entrega ${deliveryId} foi cancelada`,
        });
      } else {
        addTestResult(
          'Cancelar Entrega',
          'error',
          `Falha ao cancelar entrega`,
          { deliveryId, success }
        );
      }

    } catch (error: any) {
      addTestResult(
        'Cancelar Entrega',
        'error',
        `Erro ao cancelar entrega: ${error.message}`,
        { error: error.message }
      );

      toast({
        title: "Erro ao cancelar entrega",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Teste 5: Simular entrega
  const testSimulateDelivery = async (order: Order) => {
    setIsLoading(true);
    try {
      addTestResult('Simular Entrega', 'info', `Simulando entrega para pedido #${order.id}`, { orderId: order.id });
      
      const response = await ifoodService.simulateDelivery(order);
      setDeliveryResponse(response);
      
      addTestResult(
        'Simular Entrega',
        'success',
        `Simulação realizada com sucesso! ID: ${response.deliveryId}`,
        response
      );

      toast({
        title: "Simulação realizada! 🧪",
        description: `ID: ${response.deliveryId}`,
      });

    } catch (error: any) {
      addTestResult(
        'Simular Entrega',
        'error',
        `Erro na simulação: ${error.message}`,
        { error: error.message }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Teste 6: Simular atualização de status
  const testSimulateStatusUpdate = async (deliveryId: string) => {
    setIsLoading(true);
    try {
      addTestResult('Simular Status', 'info', `Simulando atualização para entrega ${deliveryId}`, { deliveryId });
      
      const status = await ifoodService.simulateStatusUpdate(deliveryId);
      setDeliveryStatus(status);
      
      addTestResult(
        'Simular Status',
        'success',
        `Status simulado: ${status.status}`,
        status
      );

      toast({
        title: "Status simulado! 🎲",
        description: `Novo status: ${status.status}`,
      });

    } catch (error: any) {
      addTestResult(
        'Simular Status',
        'error',
        `Erro na simulação: ${error.message}`,
        { error: error.message }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Teste 7: Executar todos os testes
  const runAllTests = async () => {
    if (!selectedOrder) {
      toast({
        title: "Selecione um pedido",
        description: "Escolha um pedido para executar os testes",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Limpar resultados anteriores
    setTestResults([]);
    
    // Teste 1: Configuração
    testConfiguration();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Teste 2: Solicitar entrega
    await testRequestDelivery(selectedOrder);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Teste 3: Buscar status (se houver deliveryId)
    if (deliveryResponse?.deliveryId) {
      await testGetDeliveryStatus(deliveryResponse.deliveryId);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Teste 4: Simular atualização de status
    if (deliveryResponse?.deliveryId) {
      await testSimulateStatusUpdate(deliveryResponse.deliveryId);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Teste 5: Cancelar entrega (se houver deliveryId)
    if (deliveryResponse?.deliveryId) {
      await testCancelDelivery(deliveryResponse.deliveryId, 'Teste automatizado');
    }
    
    setIsLoading(false);
    
    toast({
      title: "Testes concluídos! ✅",
      description: `${testResults.length} testes executados`,
    });
  };

  const clearTestResults = () => {
    setTestResults([]);
    setDeliveryResponse(null);
    setDeliveryStatus(null);
  };

  const exportTestResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      configuration: { isConfigured },
      testResults,
      deliveryResponse,
      deliveryStatus
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ifood-test-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <X className="w-4 h-4" />;
      case 'info': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <TestTube className="w-8 h-8 text-orange-600" />
                Testes iFood API
              </h1>
              <p className="text-gray-600">Teste todas as funcionalidades da API de entrega do iFood</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isConfigured ? "default" : "secondary"}>
              {isConfigured ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Configurado
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Modo Simulação
                </>
              )}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tests">Testes</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="docs">Documentação</TabsTrigger>
          </TabsList>

          {/* Aba de Testes */}
          <TabsContent value="tests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Seleção de Pedido */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Selecionar Pedido
                  </CardTitle>
                  <CardDescription>
                    Escolha um pedido para testar a API do iFood
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Pedidos Disponíveis</Label>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedOrder?.id === order.id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">#{order.id}</p>
                              <p className="text-sm text-gray-600">{order.customer.name}</p>
                              <p className="text-sm text-gray-500">R$ {order.finalTotal.toFixed(2)}</p>
                            </div>
                            <Badge variant="outline">{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedOrder && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Pedido Selecionado</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>ID:</strong> {selectedOrder.id}</p>
                        <p><strong>Cliente:</strong> {selectedOrder.customer.name}</p>
                        <p><strong>Endereço:</strong> {selectedOrder.customer.address}</p>
                        <p><strong>Total:</strong> R$ {selectedOrder.finalTotal.toFixed(2)}</p>
                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Testes Disponíveis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Testes Disponíveis
                  </CardTitle>
                  <CardDescription>
                    Execute testes individuais ou todos de uma vez
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      onClick={testConfiguration}
                      variant="outline"
                      className="justify-start"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Verificar Configuração
                    </Button>

                    <Button
                      onClick={() => selectedOrder && testRequestDelivery(selectedOrder)}
                      disabled={!selectedOrder || isLoading}
                      variant="outline"
                      className="justify-start"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Solicitar Entrega
                    </Button>

                    <Button
                      onClick={() => deliveryResponse?.deliveryId && testGetDeliveryStatus(deliveryResponse.deliveryId)}
                      disabled={!deliveryResponse?.deliveryId || isLoading}
                      variant="outline"
                      className="justify-start"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Buscar Status
                    </Button>

                    <Button
                      onClick={() => selectedOrder && testSimulateDelivery(selectedOrder)}
                      disabled={!selectedOrder || isLoading}
                      variant="outline"
                      className="justify-start"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Simular Entrega
                    </Button>

                    <Button
                      onClick={() => deliveryResponse?.deliveryId && testSimulateStatusUpdate(deliveryResponse.deliveryId)}
                      disabled={!deliveryResponse?.deliveryId || isLoading}
                      variant="outline"
                      className="justify-start"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Simular Status
                    </Button>

                    <Button
                      onClick={() => deliveryResponse?.deliveryId && testCancelDelivery(deliveryResponse.deliveryId)}
                      disabled={!deliveryResponse?.deliveryId || isLoading}
                      variant="outline"
                      className="justify-start"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar Entrega
                    </Button>
                  </div>

                  <Separator />

                  <Button
                    onClick={runAllTests}
                    disabled={!selectedOrder || isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Executando Testes...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Executar Todos os Testes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba de Resultados */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TestTube className="w-5 h-5" />
                      Resultados dos Testes
                    </CardTitle>
                    <CardDescription>
                      Histórico de todos os testes executados
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={clearTestResults} variant="outline" size="sm">
                      Limpar
                    </Button>
                    <Button onClick={exportTestResults} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8">
                    <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum teste executado ainda</p>
                    <p className="text-sm text-gray-400">Execute alguns testes para ver os resultados</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((result) => (
                      <div key={result.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.status)}
                            <span className="font-medium">{result.test}</span>
                            <Badge className={getStatusColor(result.status)}>
                              {result.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">
                            {result.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                        {result.data && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                              Ver dados
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Respostas da API */}
            {(deliveryResponse || deliveryStatus) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {deliveryResponse && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        Resposta da Entrega
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">ID da Entrega:</span>
                          <span className="font-mono">{deliveryResponse.deliveryId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Status:</span>
                          <Badge variant="outline">{deliveryResponse.status}</Badge>
                        </div>
                        {deliveryResponse.estimatedDeliveryTime && (
                          <div className="flex justify-between">
                            <span className="font-medium">Entrega Estimada:</span>
                            <span>{new Date(deliveryResponse.estimatedDeliveryTime).toLocaleString()}</span>
                          </div>
                        )}
                        {deliveryResponse.deliveryPartner && (
                          <div className="mt-3 p-3 bg-blue-50 rounded">
                            <h4 className="font-medium mb-2">Entregador</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Nome:</strong> {deliveryResponse.deliveryPartner.name}</p>
                              <p><strong>Telefone:</strong> {deliveryResponse.deliveryPartner.phone}</p>
                              <p><strong>Veículo:</strong> {deliveryResponse.deliveryPartner.vehicle}</p>
                            </div>
                          </div>
                        )}
                        {deliveryResponse.trackingUrl && (
                          <div className="mt-3">
                            <Button asChild variant="outline" size="sm" className="w-full">
                              <a href={deliveryResponse.trackingUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Abrir Tracking
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {deliveryStatus && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5" />
                        Status da Entrega
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">ID da Entrega:</span>
                          <span className="font-mono">{deliveryStatus.deliveryId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Status:</span>
                          <Badge variant="outline">{deliveryStatus.status}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Atualizado:</span>
                          <span>{deliveryStatus.updatedAt.toLocaleString()}</span>
                        </div>
                        {deliveryStatus.estimatedDeliveryTime && (
                          <div className="flex justify-between">
                            <span className="font-medium">Entrega Estimada:</span>
                            <span>{deliveryStatus.estimatedDeliveryTime.toLocaleString()}</span>
                          </div>
                        )}
                        {deliveryStatus.currentLocation && (
                          <div className="mt-3 p-3 bg-green-50 rounded">
                            <h4 className="font-medium mb-2">Localização Atual</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Latitude:</strong> {deliveryStatus.currentLocation.latitude}</p>
                              <p><strong>Longitude:</strong> {deliveryStatus.currentLocation.longitude}</p>
                            </div>
                          </div>
                        )}
                        {deliveryStatus.deliveryPartner && (
                          <div className="mt-3 p-3 bg-blue-50 rounded">
                            <h4 className="font-medium mb-2">Entregador</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Nome:</strong> {deliveryStatus.deliveryPartner.name}</p>
                              <p><strong>Telefone:</strong> {deliveryStatus.deliveryPartner.phone}</p>
                              <p><strong>Veículo:</strong> {deliveryStatus.deliveryPartner.vehicle}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Aba de Documentação */}
          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuração da API iFood
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Variáveis de Ambiente</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-mono">VITE_IFOOD_API_KEY=sua_chave_api_aqui</p>
                      <p className="text-sm font-mono">VITE_IFOOD_MERCHANT_ID=seu_merchant_id_aqui</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Status da Configuração</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={isConfigured ? "default" : "secondary"}>
                        {isConfigured ? "Configurado" : "Não Configurado"}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {isConfigured 
                          ? "API do iFood está configurada e funcionando"
                          : "Usando modo de simulação para testes"
                        }
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Endpoints da API</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base URL:</span>
                        <span className="font-mono">https://api.ifood.com.br</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Solicitar Entrega:</span>
                        <span className="font-mono">POST /v1/merchants/{'{merchant_id}'}/deliveries</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Buscar Status:</span>
                        <span className="font-mono">GET /v1/deliveries/{'{delivery_id}'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cancelar Entrega:</span>
                        <span className="font-mono">POST /v1/deliveries/{'{delivery_id}'}/cancel</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Webhook</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-mono">POST /api/ifood-webhook</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Endpoint para receber atualizações de status do iFood
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IFoodTest; 