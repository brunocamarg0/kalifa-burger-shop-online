import { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import { orderService } from '@/services/orderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface DeliveryStatusProps {
  order: Order;
  onOrderUpdate?: (order: Order) => void;
}

export const DeliveryStatus = ({ order, onOrderUpdate }: DeliveryStatusProps) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshStatus = async () => {
    if (!order.delivery?.deliveryId) return;
    
    setIsRefreshing(true);
    try {
      const updatedOrder = await orderService.refreshDeliveryStatus(order.id);
      onOrderUpdate?.(updatedOrder);
      
      toast({
        title: "Status atualizado! 🔄",
        description: `Status da entrega atualizado`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getDeliveryStatusLabel = (status?: string) => {
    const labels: Record<string, string> = {
      'accepted': 'Aceita',
      'rejected': 'Rejeitada',
      'pending': 'Pendente',
      'preparing': 'Preparando',
      'ready': 'Pronta',
      'picked_up': 'Retirada',
      'delivering': 'Entregando',
      'delivered': 'Entregue',
      'cancelled': 'Cancelada'
    };
    return labels[status || ''] || 'Desconhecido';
  };

  const getDeliveryStatusColor = (status?: string) => {
    const colors: Record<string, string> = {
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'preparing': 'bg-blue-100 text-blue-800',
      'ready': 'bg-purple-100 text-purple-800',
      'picked_up': 'bg-orange-100 text-orange-800',
      'delivering': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status || ''] || 'bg-gray-100 text-gray-800';
  };

  const getDeliveryStatusIcon = (status?: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'delivering':
        return <Truck className="w-4 h-4" />;
      case 'ready':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Não definido';
    return new Date(date).toLocaleString('pt-BR');
  };

  // Se não há entrega configurada
  if (!order.delivery) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Status da Entrega
          </CardTitle>
          <CardDescription>
            Aguardando configuração da entrega
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              A entrega será configurada pelo restaurante em breve.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se há entrega configurada
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Status da Entrega
        </CardTitle>
        <CardDescription>
          Acompanhe sua entrega em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status da entrega */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge className={getDeliveryStatusColor(order.delivery.status)}>
              <div className="flex items-center gap-1">
                {getDeliveryStatusIcon(order.delivery.status)}
                {getDeliveryStatusLabel(order.delivery.status)}
              </div>
            </Badge>
          </div>

          {/* Entregador */}
          {order.delivery.deliveryPartner && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Entregador:</h4>
              <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{order.delivery.deliveryPartner.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  {order.delivery.deliveryPartner.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="w-3 h-3" />
                  {order.delivery.deliveryPartner.vehicle}
                </div>
              </div>
            </div>
          )}

          {/* Localização atual */}
          {order.delivery.currentLocation && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Localização atual:</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {order.delivery.currentLocation.latitude.toFixed(6)}, {order.delivery.currentLocation.longitude.toFixed(6)}
              </div>
            </div>
          )}

          {/* Tempo estimado */}
          {order.delivery.estimatedDeliveryTime && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Entrega estimada:</span>
              <span className="text-sm text-muted-foreground">
                {formatDate(order.delivery.estimatedDeliveryTime)}
              </span>
            </div>
          )}

          {/* Links de tracking */}
          {order.delivery.trackingUrl && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Acompanhar entrega:</h4>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open(order.delivery.trackingUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir no iFood
              </Button>
            </div>
          )}

          {/* Botão de atualizar */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshStatus}
            disabled={isRefreshing}
            className="w-full"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar Status
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 