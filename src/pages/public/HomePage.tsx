import PublicHeader from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, Zap, Shield, Globe, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const services = [
    {
      title: "Presença Digital",
      description: "Sites profissionais e landing pages otimizadas para conversão",
      icon: Globe,
      badge: "Mais Popular"
    },
    {
      title: "Marketing Digital",
      description: "Gestão completa de redes sociais e campanhas publicitárias",
      icon: Zap,
      badge: null
    },
    {
      title: "Aplicativos Mobile",
      description: "Apps nativos para iOS e Android com design moderno",
      icon: Smartphone,
      badge: "Novo"
    },
    {
      title: "Consultoria Digital",
      description: "Estratégias personalizadas para crescimento online",
      icon: Users,
      badge: null
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      company: "Estética Bella",
      content: "A Dominus Digital transformou completamente minha presença online. Triplicamos nossos agendamentos!",
      rating: 5
    },
    {
      name: "João Santos",
      company: "Auto Peças JR",
      content: "Excelente suporte e resultados incríveis. Recomendo para qualquer empresa que quer crescer digitalmente.",
      rating: 5
    },
    {
      name: "Ana Oliveira",
      company: "Advocacia & Consultoria",
      content: "Profissionais extremamente competentes. Nosso site ficou lindo e funcional.",
      rating: 5
    }
  ];

  const blogPosts = [
    {
      title: "Como Aumentar Suas Vendas Online em 30 Dias",
      excerpt: "Estratégias comprovadas para impulsionar seu e-commerce e gerar mais conversões.",
      date: "15 Jan 2024",
      readTime: "5 min"
    },
    {
      title: "Tendências de Design Web para 2024",
      excerpt: "Descubra as principais tendências que irão dominar o design de websites este ano.",
      date: "12 Jan 2024",
      readTime: "7 min"
    },
    {
      title: "SEO Local: Domine Sua Região",
      excerpt: "Como otimizar seu negócio para aparecer nas buscas locais do Google.",
      date: "10 Jan 2024",
      readTime: "6 min"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforme Seu Negócio com
              <span className="text-gradient-brand block">Soluções Digitais</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Criamos presença digital impactante que gera resultados reais para sua empresa. 
              Do planejamento à execução, somos seu parceiro completo no mundo digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-hero px-8 py-3 text-lg">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="btn-outline-brand px-8 py-3 text-lg">
                Ver Nossos Trabalhos
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-primary/20 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oferecemos soluções completas para estabelecer e fortalecer sua presença digital
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="card-elevated hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  {service.badge && (
                    <Badge className="mb-2 bg-secondary text-secondary-foreground w-fit mx-auto">
                      {service.badge}
                    </Badge>
                  )}
                  <service.icon className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Depoimentos reais de empresas que transformaram seus resultados conosco
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-brand p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-secondary fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Blog & Insights</h2>
              <p className="text-xl text-muted-foreground">
                Dicas e estratégias para turbinar seu negócio digital
              </p>
            </div>
            <Link to="/blog">
              <Button variant="outline" className="btn-outline-brand">
                Ver Todos os Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="card-elevated hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                    <span>{post.date}</span>
                    <span>{post.readTime} de leitura</span>
                  </div>
                  <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Transformar Seu Negócio?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Entre em contato conosco e descubra como podemos ajudar sua empresa 
            a alcançar resultados extraordinários no mundo digital.
          </p>
          <Button 
            variant="secondary" 
            className="bg-white text-primary hover:bg-white/90 px-8 py-3 text-lg font-semibold"
          >
            Solicitar Consultoria Gratuita
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">D</span>
                </div>
                <span className="text-gradient-brand font-bold text-lg">Dominus Digital</span>
              </div>
              <p className="text-muted-foreground">
                Transformando negócios através de soluções digitais inovadoras.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Serviços</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Presença Digital</li>
                <li>Marketing Digital</li>
                <li>Aplicativos Mobile</li>
                <li>Consultoria Digital</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li>Sobre Nós</li>
                <li>Contato</li>
                <li>Carreiras</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Portal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/portal/login" className="hover:text-primary transition-colors">Login Cliente</Link></li>
                <li>Suporte</li>
                <li>Documentação</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Dominus Digital. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;