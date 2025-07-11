import { Button } from '@/components/ui/button';
import { ArrowDown, Star } from 'lucide-react';
import heroBurger from '@/assets/hero-burger.jpg';

const Hero = () => {
  const scrollToCardapio = () => {
    const element = document.getElementById('cardapio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroBurger})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/70" />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10 pt-16">
        {/* Content */}
        <div className="text-center lg:text-left space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-sm font-medium">
            <Star className="w-4 h-4 mr-2 text-accent fill-accent" />
            Hambúrgueres Artesanais Premium
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-tight">
              O Melhor
              <span className="bg-hero-gradient bg-clip-text text-transparent block">
                Hambúrguer
              </span>
              da Cidade
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-lg">
              Ingredientes frescos, carnes premium e sabores únicos que vão conquistar seu paladar.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              onClick={scrollToCardapio}
              className="text-lg px-8 py-6 shadow-food-glow hover:shadow-warm transition-all duration-300"
            >
              Ver Cardápio
              <ArrowDown className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de fazer um pedido.', '_blank')}
              className="text-lg px-8 py-6"
            >
              Pedir pelo WhatsApp
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Pedidos/Mês</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.9</div>
              <div className="text-sm text-muted-foreground">Avaliação</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">30min</div>
              <div className="text-sm text-muted-foreground">Entrega</div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <div className="relative z-10">
            <img 
              src={heroBurger} 
              alt="Hambúrguer Artesanal Premium"
              className="w-full h-auto rounded-2xl shadow-food-glow"
            />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default Hero;