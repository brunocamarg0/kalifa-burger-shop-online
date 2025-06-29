
const ServicesSection = () => {
  const services = [
    {
      title: "Site Institucional",
      description: "Site profissional para apresentar sua empresa, serviços e estabelecer credibilidade online.",
      features: ["Design responsivo", "Otimização SEO", "Formulário de contato", "Integração redes sociais"]
    },
    {
      title: "Portfólio Profissional",
      description: "Showcase perfeito para profissionais liberais e prestadores de serviços.",
      features: ["Galeria de trabalhos", "Sobre profissional", "Depoimentos", "Área de contato"]
    },
    {
      title: "Landing Pages",
      description: "Páginas focadas em conversão para campanhas específicas e captação de leads.",
      features: ["Alta conversão", "Carregamento rápido", "Formulários otimizados", "Analytics integrado"]
    },
    {
      title: "Loja Virtual",
      description: "E-commerce completo para vender seus produtos online com segurança.",
      features: ["Carrinho de compras", "Pagamento seguro", "Gestão de produtos", "Relatórios de vendas"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-accent to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Serviços <span className="text-primary">Oferecidos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Desenvolvemos soluções digitais personalizadas para cada tipo de negócio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">{index + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-sm text-gray-500 flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
