import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock, Instagram, MessageCircle } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      info: "(11) 99999-9999",
      action: () => window.open('tel:+5511999999999', '_blank'),
      description: "Ligue para fazer seu pedido"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      info: "(11) 99999-9999",
      action: () => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de fazer um pedido.', '_blank'),
      description: "Peça pelo WhatsApp"
    },
    {
      icon: Instagram,
      title: "Instagram",
      info: "@kalifaburgueroficial",
      action: () => window.open('https://instagram.com/kalifaburgueroficial', '_blank'),
      description: "Siga-nos no Instagram"
    },
    {
      icon: MapPin,
      title: "Endereço",
      info: "Rua dos Sabores, 123",
      action: () => window.open('https://maps.google.com/?q=Rua+dos+Sabores+123', '_blank'),
      description: "São Paulo - SP"
    }
  ];

  const openingHours = [
    { day: "Segunda a Quinta", hours: "18:00 - 23:00" },
    { day: "Sexta e Sábado", hours: "18:00 - 00:00" },
    { day: "Domingo", hours: "18:00 - 22:00" }
  ];

  return (
    <section id="contato" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-display">
            Entre em 
            <span className="bg-hero-gradient bg-clip-text text-transparent"> Contato</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos prontos para atender você! Entre em contato e faça seu pedido.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {contactInfo.map((contact, index) => (
              <Card key={index} className="hover:shadow-warm transition-all duration-300 cursor-pointer group" onClick={contact.action}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <contact.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-display">{contact.title}</CardTitle>
                  <CardDescription>{contact.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="font-semibold text-lg text-primary">{contact.info}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Opening Hours */}
          <Card className="h-fit">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="font-display">Horário de Funcionamento</CardTitle>
              <CardDescription>Confira nossos horários</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {openingHours.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm font-medium">{schedule.day}</span>
                  <span className="text-sm text-primary font-semibold">{schedule.hours}</span>
                </div>
              ))}
              
              <div className="pt-4">
                <div className="bg-accent/10 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-accent">
                    🚚 Delivery disponível em todo horário de funcionamento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-card rounded-2xl p-8 text-center border">
          <h3 className="text-2xl font-bold mb-4 font-display">Pronto para fazer seu pedido?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Entre em contato conosco agora mesmo e experimente os melhores hambúrgueres artesanais da cidade. 
            Atendimento rápido e entrega garantida!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de fazer um pedido.', '_blank')}
              className="shadow-food-glow hover:shadow-warm transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Pedir pelo WhatsApp
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open('tel:+5511999999999', '_blank')}
            >
              <Phone className="w-5 h-5 mr-2" />
              Ligar Agora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;