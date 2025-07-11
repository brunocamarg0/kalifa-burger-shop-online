import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Flame } from 'lucide-react';
import classicBurger from '@/assets/classic-burger.jpg';
import baconBurger from '@/assets/bacon-burger.jpg';
import bbqBurger from '@/assets/bbq-burger.jpg';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  spicy?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Kalifa Classic",
    description: "Hambúrguer artesanal 180g, queijo cheddar, alface, tomate, cebola e molho especial",
    price: 24.90,
    image: classicBurger,
    category: "classics",
    popular: true,
  },
  {
    id: 2,
    name: "Bacon Supreme",
    description: "Hambúrguer 200g, bacon crocante, queijo cheddar duplo, cebola caramelizada",
    price: 29.90,
    image: baconBurger,
    category: "premium",
    popular: true,
  },
  {
    id: 3,
    name: "BBQ Monster",
    description: "Hambúrguer 250g, molho barbecue artesanal, onion rings, queijo provolone",
    price: 32.90,
    image: bbqBurger,
    category: "premium",
  },
  {
    id: 4,
    name: "Spicy Fire",
    description: "Hambúrguer 180g, pimenta jalapeño, queijo pepper jack, molho picante da casa",
    price: 27.90,
    image: classicBurger,
    category: "specials",
    spicy: true,
  },
  {
    id: 5,
    name: "Veggie Deluxe",
    description: "Hambúrguer vegano de grão-de-bico, queijo vegano, rúcula, tomate seco",
    price: 26.90,
    image: baconBurger,
    category: "veggie",
  },
  {
    id: 6,
    name: "Double Trouble",
    description: "Dois hambúrgueres 150g, queijo cheddar duplo, bacon, molho mil-ilhas",
    price: 35.90,
    image: bbqBurger,
    category: "premium",
    popular: true,
  },
];

const categories = [
  { id: 'all', name: 'Todos', count: menuItems.length },
  { id: 'classics', name: 'Clássicos', count: menuItems.filter(item => item.category === 'classics').length },
  { id: 'premium', name: 'Premium', count: menuItems.filter(item => item.category === 'premium').length },
  { id: 'specials', name: 'Especiais', count: menuItems.filter(item => item.category === 'specials').length },
  { id: 'veggie', name: 'Vegetarianos', count: menuItems.filter(item => item.category === 'veggie').length },
];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleOrder = (item: MenuItem) => {
    const message = `Olá! Gostaria de pedir:\n\n🍔 ${item.name}\n💰 R$ ${item.price.toFixed(2)}\n\n${item.description}`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
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
                <Button 
                  onClick={() => handleOrder(item)}
                  className="w-full shadow-warm hover:shadow-food-glow transition-all duration-300"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Pedir Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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
  );
};

export default Menu;