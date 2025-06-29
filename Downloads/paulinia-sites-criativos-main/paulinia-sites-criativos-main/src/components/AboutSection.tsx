
const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Sobre <span className="text-primary">Nós</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Somos uma equipe especializada em desenvolvimento web para negócios locais. 
              Nosso foco é criar sites personalizados, com ótimo desempenho e fácil navegação 
              para seus clientes.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Atendemos empresas de Paulínia e região, oferecendo soluções digitais que 
              realmente fazem a diferença no seu negócio. Mesmo que você nunca tenha 
              tido um site antes, nós te acompanhamos em todo o processo.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-gray-600">Sites Criados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">100%</div>
                <div className="text-gray-600">Clientes Satisfeitos</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop" 
              alt="Equipe trabalhando em projetos web" 
              className="w-full h-80 object-cover rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-secondary to-secondary/80 text-white p-6 rounded-lg shadow-lg">
              <div className="text-2xl font-bold">3+ Anos</div>
              <div className="text-sm">de experiência</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
