import { Calendar, CreditCard, Users, BarChart3, Bell, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "Agendamento Online",
    description: "Sistema intuitivo de agendamentos que seus clientes vão adorar. Confirmações automáticas e lembretes.",
  },
  {
    icon: CreditCard,
    title: "Pagamentos Integrados",
    description: "Aceite pagamentos online e presenciais. Controle financeiro completo e automático.",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Cadastro completo de clientes, histórico de serviços e preferências personalizadas.",
  },
  {
    icon: BarChart3,
    title: "Relatórios Detalhados",
    description: "Análise de desempenho, faturamento e insights para crescer seu negócio.",
  },
  {
    icon: Bell,
    title: "Notificações Automáticas",
    description: "SMS e WhatsApp automatizados para lembretes e confirmações de agendamentos.",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Seus dados e dos seus clientes protegidos com criptografia de ponta.",
  },
];

const Features = () => {
  return (
    <section id="funcionalidades" className="py-24 bg-background">
      <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 uppercase">
            Tudo que você precisa em{" "}
            <span className="text-primary drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">um só lugar</span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium">
            Ferramentas modernas para barbeiros modernos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-card border-2 border-border hover:border-primary transition-all duration-200 hover:shadow-primary group"
            >
              <CardHeader>
                <div className="bg-primary/10 w-fit p-3 mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-foreground font-black uppercase text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground font-medium">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
