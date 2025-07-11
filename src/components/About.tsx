import { Card, CardContent } from '@/components/ui/card';
import { Award, Clock, Heart, Users } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Heart,
      title: "Feito com Amor",
      description: "Cada hambúrguer é preparado com carinho e dedicação por nossa equipe especializada."
    },
    {
      icon: Award,
      title: "Ingredientes Premium",
      description: "Utilizamos apenas os melhores ingredientes, carnes selecionadas e produtos frescos."
    },
    {
      icon: Clock,
      title: "Entrega Rápida",
      description: "Seu pedido fica pronto em até 30 minutos, garantindo frescor e qualidade."
    },
    {
      icon: Users,
      title: "Família Kalifa",
      description: "Mais de 1000 clientes satisfeitos fazem parte da nossa família gastronômica."
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold font-display">
                Nossa 
                <span className="bg-hero-gradient bg-clip-text text-transparent"> História</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A Kalifa Burguer nasceu da paixão por criar os melhores hambúrgueres artesanais da cidade. 
                Com receitas exclusivas e ingredientes selecionados, transformamos cada refeição em uma 
                experiência única e memorável.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-semibold mb-2 font-display">Nossa Missão</h3>
                <p className="text-muted-foreground">
                  Proporcionar momentos especiais através de hambúrgueres artesanais excepcionais, 
                  combinando sabor, qualidade e um atendimento caloroso.
                </p>
              </div>

              <div className="border-l-4 border-accent pl-6">
                <h3 className="text-xl font-semibold mb-2 font-display">Nossos Valores</h3>
                <p className="text-muted-foreground">
                  Qualidade acima de tudo, ingredientes frescos, sustentabilidade e o compromisso 
                  de superar as expectativas de cada cliente que nos escolhe.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-3xl font-bold text-primary">3+</div>
                <div className="text-sm text-muted-foreground">Anos de Experiência</div>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-3xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Receitas Exclusivas</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/20 transition-colors duration-300 group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold font-display">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Message */}
        <div className="mt-16 text-center bg-gradient-to-r from-muted/20 to-muted/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4 font-display">
            Venha Conhecer Nossa Equipe!
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Nossa equipe está sempre pronta para recebê-lo com um sorriso e preparar 
            o hambúrguer perfeito para o seu dia. Venha nos visitar e fazer parte da família Kalifa!
          </p>
          <div className="flex justify-center items-center space-x-2 text-sm text-muted-foreground">
            <span>👨‍🍳</span>
            <span>Equipe especializada em hambúrgueres artesanais</span>
            <span>🏆</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;