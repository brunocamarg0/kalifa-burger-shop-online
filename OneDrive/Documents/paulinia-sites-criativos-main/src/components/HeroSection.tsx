
const HeroSection = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-primary/5 via-white to-secondary/5 pt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
              Criamos sites modernos e 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> profissionais</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Para empresas de Paulínia e região que querem se destacar no digital. 
              Sites personalizados, responsivos e otimizados para resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToContact}
                className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-4 rounded-lg font-semibold hover:from-primary/90 hover:to-primary transition-all transform hover:scale-105 shadow-lg"
              >
                Solicite seu orçamento
              </button>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
              >
                Saiba mais
              </button>
            </div>
          </div>
          
          <div className="relative animate-bounce-light">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop" 
                alt="Desenvolvimento de sites profissionais" 
                className="w-full h-64 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
