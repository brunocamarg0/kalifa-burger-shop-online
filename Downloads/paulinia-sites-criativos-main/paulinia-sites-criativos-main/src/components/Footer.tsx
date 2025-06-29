
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
              <h3 className="text-xl font-bold">WebPaulínia</h3>
            </div>
            <p className="text-gray-400">
              Criamos sites modernos e profissionais para empresas de Paulínia e região.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors">
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nós
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white transition-colors">
                  Serviços
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('portfolio')} className="text-gray-400 hover:text-white transition-colors">
                  Portfólio
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Site Institucional</li>
              <li>Portfólio Profissional</li>
              <li>Landing Pages</li>
              <li>Loja Virtual</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📍 Paulínia - SP</li>
              <li>📞 (19) 99999-9999</li>
              <li>✉️ contato@webpaulinia.com.br</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} WebPaulínia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
