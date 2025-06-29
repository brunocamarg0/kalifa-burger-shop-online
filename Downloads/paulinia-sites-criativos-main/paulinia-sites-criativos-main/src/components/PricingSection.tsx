
const PricingSection = () => {
  const plans = [
    {
      name: "Site Simples",
      price: "R$ 899",
      period: "projeto completo",
      description: "Ideal for pequenos negócios que estão começando",
      features: [
        "Até 5 páginas",
        "Design responsivo",
        "Formulário de contato",
        "Otimização básica SEO",
        "Suporte 30 dias"
      ],
      popular: false
    },
    {
      name: "Site Profissional",
      price: "R$ 1.499",
      period: "projeto completo",
      description: "Perfeito para empresas estabelecidas",
      features: [
        "Até 10 páginas",
        "Design personalizado",
        "Integração redes sociais",
        "SEO avançado",
        "Blog integrado",
        "Suporte 60 dias"
      ],
      popular: true
    },
    {
      name: "Loja Virtual",
      price: "R$ 2.499",
      period: "projeto completo",
      description: "Solução completa para e-commerce",
      features: [
        "Páginas ilimitadas",
        "Carrinho de compras",
        "Pagamento online",
        "Gestão de produtos",
        "Relatórios de vendas",
        "Suporte 90 dias"
      ],
      popular: false
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-accent to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Planos e <span className="text-primary">Preços</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para o seu negócio. Preços justos e transparentes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 ${plan.popular ? 'ring-2 ring-primary scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-primary mb-2">{plan.price}</div>
                <div className="text-gray-500 text-sm">{plan.period}</div>
                <p className="text-gray-600 mt-4">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={scrollToContact}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg' 
                    : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                }`}
              >
                Solicitar Orçamento
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
