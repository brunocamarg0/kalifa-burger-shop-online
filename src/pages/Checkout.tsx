import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { orderService } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CreditCard, ShoppingCart, Trash2, Plus, Minus, CheckCircle, MapPin, Phone, Mail, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { state, removeItem, incrementItem, decrementItem, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    neighborhood: '',
    complement: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    if (state.items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar o pedido.",
        variant: "destructive"
      });
      return;
    }

    // Validação básica
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Criar pedido
      const order = await orderService.createOrder(
        state.items,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          neighborhood: formData.neighborhood,
          complement: formData.complement
        },
        {
          method: paymentMethod as any,
          cardNumber: formData.cardNumber,
          cardExpiry: formData.cardExpiry,
          cardCvv: formData.cardCvv,
          cardName: formData.cardName
        },
        formData.notes
      );

      setIsProcessing(false);
      
      toast({
        title: "Pedido realizado com sucesso! 🎉",
        description: `Pedido #${order.id} confirmado! Entraremos em contato em breve.`,
      });

      clearCart();
      navigate('/');
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Erro ao processar pedido",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive"
      });
    }
  };

  const totalItems = state.itemCount;
  const deliveryFee = state.total > 0 ? 5.00 : 0;
  const finalTotal = state.total + deliveryFee;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold font-display">Carrinho Vazio</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Adicione alguns itens deliciosos ao seu carrinho para continuar com o pedido.
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="shadow-warm hover:shadow-food-glow transition-all duration-300"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Cardápio
            </Button>
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
            Voltar ao Cardápio
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-center">
            Finalizar 
            <span className="bg-hero-gradient bg-clip-text text-transparent"> Pedido</span>
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Complete seus dados e escolha a forma de pagamento
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário de Pagamento */}
          <div className="space-y-6">
            {/* Dados Pessoais */}
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Dados Pessoais
                </CardTitle>
                <CardDescription>
                  Informações para entrega e contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Endereço de Entrega */}
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereço de Entrega
                </CardTitle>
                <CardDescription>
                  Onde você quer receber seu pedido
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="00000-000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Sua cidade"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Rua, número"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      placeholder="Seu bairro"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={formData.complement}
                      onChange={(e) => handleInputChange('complement', e.target.value)}
                      placeholder="Apto, bloco, etc."
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Método de Pagamento */}
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Método de Pagamento
                </CardTitle>
                <CardDescription>
                  Escolha como você quer pagar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o método de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX (Pagamento instantâneo)</SelectItem>
                    <SelectItem value="credit">Cartão de Crédito</SelectItem>
                    <SelectItem value="debit">Cartão de Débito</SelectItem>
                    <SelectItem value="cash">Dinheiro na entrega</SelectItem>
                  </SelectContent>
                </Select>

                {paymentMethod === 'credit' || paymentMethod === 'debit' ? (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <Label htmlFor="cardName">Nome no Cartão</Label>
                      <Input
                        id="cardName"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange('cardName', e.target.value)}
                        placeholder="Nome como está no cartão"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardExpiry">Validade</Label>
                        <Input
                          id="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                          placeholder="MM/AA"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          value={formData.cardCvv}
                          onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                          placeholder="123"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ) : paymentMethod === 'pix' ? (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      O QR Code do PIX será gerado após confirmar o pedido
                    </div>
                  </div>
                ) : paymentMethod === 'cash' ? (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      Pagamento em dinheiro no momento da entrega
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Observações */}
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle>Observações</CardTitle>
                <CardDescription>
                  Alguma instrução especial para o pedido?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Ex: Sem cebola, entrega no portão, etc."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="space-y-6">
            <Card className="shadow-warm sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Resumo do Pedido
                </CardTitle>
                <CardDescription>
                  {totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Itens do Carrinho */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.description}
                        </p>
                        <p className="text-sm font-medium text-primary">
                          R$ {item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => decrementItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => incrementItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totais */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>R$ {state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de entrega:</span>
                    <span>R$ {deliveryFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">R$ {finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botão de Finalizar */}
                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full shadow-warm hover:shadow-food-glow transition-all duration-300"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finalizar Pedido
                    </>
                  )}
                </Button>

                {paymentMethod === 'pix' && (
                  <p className="text-xs text-muted-foreground text-center">
                    Após confirmar, você receberá o QR Code do PIX para pagamento
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 