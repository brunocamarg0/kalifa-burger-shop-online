
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Dr. Carlos Silva",
      business: "Consultório Odontológico",
      text: "Conseguimos mais clientes depois que nosso site entrou no ar! O atendimento foi excepcional e o resultado superou nossas expectativas.",
      rating: 5
    },
    {
      name: "Ana Paula Santos",
      business: "Escritório de Advocacia",
      text: "Profissionais competentes e atenciosos. Nosso site ficou moderno e profissional, exatamente como queríamos.",
      rating: 5
    },
    {
      name: "João Ferreira",
      business: "Loja de Materiais",
      text: "A loja virtual aumentou nossas vendas em 300%! Recomendo para qualquer empresa que quer crescer no digital.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            O que nossos <span className="text-primary">clientes dizem</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Depoimentos reais de empresas que transformaram seus negócios conosco
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-accent to-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <div key={i} className="w-5 h-5 text-secondary">★</div>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
              <div className="border-t pt-4">
                <div className="font-semibold text-gray-800">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.business}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
