import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Flame, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { menuService, MenuItem } from '@/services/menuService';
import BurgerCustomizer from '@/components/BurgerCustomizer';
import { BurgerCustomization } from '@/types/burger';
import classicBurger from '@/assets/classic-burger.jpg';
import baconBurger from '@/assets/bacon-burger.jpg';
import bbqBurger from '@/assets/bbq-burger.jpg';

const Menu = () => {
  const navigate = useNavigate();
  const { addItem, state } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customizingProduct, setCustomizingProduct] = useState<MenuItem | null>(null);

  useEffect(() => {
    // Carregar produtos iniciais
    loadMenuItems();
    
    // Configurar listener em tempo real para atualizações automáticas
    const unsubscribe = menuService.subscribeToMenuItems((items) => {
      const itemsWithImages = items.map(item => {
        let image = item.image;
        // Se a imagem for placeholder, tentar mapear baseado no nome
        if (image === '/placeholder.svg' || !image) {
          const nameLower = item.name.toLowerCase();
          if (nameLower.includes('classic') || nameLower.includes('spicy') || nameLower.includes('santa clarita') || nameLower.includes('los angeles')) {
            image = classicBurger;
          } else if (nameLower.includes('bacon') || nameLower.includes('veggie') || nameLower.includes('kings') || nameLower.includes('beverly')) {
            image = baconBurger;
          } else if (nameLower.includes('bbq') || nameLower.includes('double') || nameLower.includes('san diego') || nameLower.includes('san francisco') || nameLower.includes('califórnia')) {
            image = bbqBurger;
          } else {
            image = classicBurger; // fallback
          }
        }
        return { ...item, image };
      });
      setMenuItems(itemsWithImages);
      setIsLoading(false);
    });

    // Limpar listener ao desmontar componente
    return () => {
      unsubscribe();
    };
  }, []);

  const loadMenuItems = async () => {
    try {
      const items = await menuService.getMenuItems();
      // Mapear imagens baseado no nome ou categoria
      const itemsWithImages = items.map(item => {
        let image = item.image;
        // Se a imagem for placeholder, tentar mapear baseado no nome
        if (image === '/placeholder.svg' || !image) {
          const nameLower = item.name.toLowerCase();
          if (nameLower.includes('classic') || nameLower.includes('spicy') || nameLower.includes('santa clarita') || nameLower.includes('los angeles')) {
            image = classicBurger;
          } else if (nameLower.includes('bacon') || nameLower.includes('veggie') || nameLower.includes('kings') || nameLower.includes('beverly')) {
            image = baconBurger;
          } else if (nameLower.includes('bbq') || nameLower.includes('double') || nameLower.includes('san diego') || nameLower.includes('san francisco') || nameLower.includes('califórnia')) {
            image = bbqBurger;
          } else {
            image = classicBurger; // fallback
          }
        }
        return { ...item, image };
      });
      setMenuItems(itemsWithImages);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro ao carregar cardápio",
        description: "Não foi possível carregar os produtos. Tente recarregar a página.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'Todos', count: menuItems.length },
    { id: 'classics', name: 'Clássicos', count: menuItems.filter(item => item.category === 'classics').length },
    { id: 'premium', name: 'Premium', count: menuItems.filter(item => item.category === 'premium').length },
    { id: 'specials', name: 'Especiais', count: menuItems.filter(item => item.category === 'specials').length },
    { id: 'veggie', name: 'Vegetarianos', count: menuItems.filter(item => item.category === 'veggie').length },
  ];

  const handleAddToCart = (item: MenuItem) => {
    // Se for um hambúrguer (categoria não é "specials" para porções), abrir customizador
    if (item.category !== 'specials') {
      setCustomizingProduct(item);
    } else {
      // Porções não precisam de customização
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        description: item.description
      });
      
      toast({
        title: "Item adicionado!",
        description: `${item.name} foi adicionado ao carrinho.`,
      });
    }
  };

  const handleCustomizationConfirm = (customization: BurgerCustomization, totalPrice: number) => {
    if (!customizingProduct) return;

    addItem({
      id: customizingProduct.id,
      name: customizingProduct.name,
      price: totalPrice,
      image: customizingProduct.image,
      description: customizingProduct.description,
      customization
    });

    toast({
      title: "Hambúrguer adicionado!",
      description: `${customizingProduct.name} foi adicionado ao carrinho com suas customizações.`,
    });

    setCustomizingProduct(null);
  };

  const handleCustomizationCancel = () => {
    setCustomizingProduct(null);
  };

  const handleOrder = (item: MenuItem) => {
    const message = `Olá! Gostaria de pedir:\n\n🍔 ${item.name}\n💰 R$ ${item.price.toFixed(2)}\n\n${item.description}`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <section id="cardapio" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando cardápio...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {customizingProduct && (
        <BurgerCustomizer
          productName={customizingProduct.name}
          basePrice={customizingProduct.price}
          onConfirm={handleCustomizationConfirm}
          onCancel={handleCustomizationCancel}
        />
      )}
      <section id="cardapio" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-display">
            Nosso 
            <span className="bg-hero-gradient bg-clip-text text-transparent"> Cardápio</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hambúrgueres artesanais feitos com ingredientes frescos e carnes selecionadas
          </p>
          
          {/* Carrinho Button */}
          {state.items.length > 0 && (
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/checkout')}
                className="shadow-warm hover:shadow-food-glow transition-all duration-300"
                size="lg"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ver Carrinho ({state.items.reduce((sum, item) => sum + item.quantity, 0)})
              </Button>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.name}
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-warm transition-all duration-300 group">
              {/* Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  {item.popular && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  )}
                  {item.spicy && (
                    <Badge variant="destructive">
                      <Flame className="w-3 h-3 mr-1 fill-current" />
                      Picante
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-display">{item.name}</CardTitle>
                    <div className="text-2xl font-bold text-primary mt-1">
                      R$ {item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 shadow-warm hover:shadow-food-glow transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleOrder(item)}
                    className="shadow-warm hover:shadow-food-glow transition-all duration-300"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-card rounded-2xl border">
          <h3 className="text-2xl font-bold mb-4 font-display">Não encontrou o que procura?</h3>
          <p className="text-muted-foreground mb-6">
            Entre em contato conosco e criaremos o hambúrguer perfeito para você!
          </p>
          <Button 
            size="lg"
            onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de saber sobre outros hambúrgueres disponíveis.', '_blank')}
          >
            Falar no WhatsApp
          </Button>
        </div>
      </div>
    </section>
    </>
  );
};

export default Menu;