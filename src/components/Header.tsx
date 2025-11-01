import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Phone, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="text-2xl font-bold bg-hero-gradient bg-clip-text text-transparent cursor-pointer font-display"
          onClick={() => scrollToSection('hero')}
        >
          Hamburger Paulinia
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('cardapio')}
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Cardápio
          </button>
          <button 
            onClick={() => scrollToSection('sobre')}
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Sobre Nós
          </button>
          <button 
            onClick={() => scrollToSection('contato')}
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Contato
          </button>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('tel:+5511999999999', '_blank')}
          >
            <Phone className="w-4 h-4 mr-2" />
            Ligar
          </Button>
          
          {/* Carrinho Button */}
          {totalItems > 0 && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate('/checkout')}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Carrinho
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                {totalItems}
              </Badge>
            </Button>
          )}
          
          <Button 
            size="sm"
            onClick={() => scrollToSection('cardapio')}
            className="shadow-warm"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Pedir Agora
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('cardapio')}
              className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium py-2"
            >
              Cardápio
            </button>
            <button 
              onClick={() => scrollToSection('sobre')}
              className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium py-2"
            >
              Sobre Nós
            </button>
            <button 
              onClick={() => scrollToSection('contato')}
              className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium py-2"
            >
              Contato
            </button>
            <div className="flex space-x-3 pt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('tel:+5511999999999', '_blank')}
                className="flex-1"
              >
                <Phone className="w-4 h-4 mr-2" />
                Ligar
              </Button>
              
              {/* Carrinho Button Mobile */}
              {totalItems > 0 && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/checkout')}
                  className="flex-1 relative"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Carrinho
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {totalItems}
                  </Badge>
                </Button>
              )}
              
              <Button 
                size="sm"
                onClick={() => scrollToSection('cardapio')}
                className="flex-1 shadow-warm"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Pedir
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;