import { Heart, Instagram, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-hero-gradient bg-clip-text text-transparent font-display">
              Hamburger Paulinia
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Os melhores hambúrgueres artesanais da cidade, feitos com ingredientes premium e muito amor.
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Heart className="w-4 h-4 mr-2 text-primary fill-primary" />
              Feito com amor desde 2021
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground font-display">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => scrollToSection('hero')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('cardapio')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cardápio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('sobre')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contato')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground font-display">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-primary" />
                <span className="text-muted-foreground">(11) 99999-9999</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-primary" />
                <span className="text-muted-foreground">Rua dos Sabores, 123<br />São Paulo - SP</span>
              </li>
              <li className="flex items-center">
                <Instagram className="w-4 h-4 mr-3 text-primary" />
                <a 
                  href="https://instagram.com/hamburgerpaulinia" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  @hamburgerpaulinia
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground font-display">Horários</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Seg - Qui:</span>
                <span>18:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sex - Sáb:</span>
                <span>18:00 - 00:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo:</span>
                <span>18:00 - 22:00</span>
              </li>
            </ul>
            <div className="bg-muted/20 rounded-lg p-3">
              <p className="text-xs text-center text-accent font-medium">
                🚚 Delivery disponível em todos os horários
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Hamburger Paulinia. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Desenvolvido com</span>
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span>para os amantes de hambúrguer</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;