import PublicHeader from "@/components/layout/PublicHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Como Aumentar Suas Vendas Online em 30 Dias",
      excerpt: "Estratégias comprovadas para impulsionar seu e-commerce e gerar mais conversões. Descubra técnicas de marketing digital que realmente funcionam.",
      content: "...",
      author: "Maria Santos",
      date: "15 Jan 2024",
      readTime: "5 min",
      category: "Marketing Digital",
      featured: true
    },
    {
      id: 2,
      title: "Tendências de Design Web para 2024",
      excerpt: "Descubra as principais tendências que irão dominar o design de websites este ano. Do minimalismo ao design inclusivo.",
      content: "...",
      author: "João Silva",
      date: "12 Jan 2024",
      readTime: "7 min",
      category: "Design",
      featured: false
    },
    {
      id: 3,
      title: "SEO Local: Domine Sua Região",
      excerpt: "Como otimizar seu negócio para aparecer nas buscas locais do Google. Estratégias específicas para empresas regionais.",
      content: "...",
      author: "Ana Costa",
      date: "10 Jan 2024",
      readTime: "6 min",
      category: "SEO",
      featured: false
    },
    {
      id: 4,
      title: "Redes Sociais: Guia Completo para Pequenas Empresas",
      excerpt: "Tudo o que você precisa saber para criar uma presença forte nas redes sociais e engajar seu público-alvo.",
      content: "...",
      author: "Carlos Mendes",
      date: "8 Jan 2024",
      readTime: "8 min",
      category: "Social Media",
      featured: false
    },
    {
      id: 5,
      title: "E-commerce: Erros que Custam Vendas",
      excerpt: "Os principais erros que impedem conversões em lojas virtuais e como corrigi-los para aumentar suas vendas.",
      content: "...",
      author: "Fernanda Lima",
      date: "5 Jan 2024",
      readTime: "4 min",
      category: "E-commerce",
      featured: false
    },
    {
      id: 6,
      title: "Automação de Marketing: Por Onde Começar",
      excerpt: "Introdução prática à automação de marketing digital. Ferramentas e estratégias para iniciantes.",
      content: "...",
      author: "Roberto Dias",
      date: "3 Jan 2024",
      readTime: "9 min",
      category: "Automação",
      featured: false
    }
  ];

  const categories = ["Todos", "Marketing Digital", "Design", "SEO", "Social Media", "E-commerce", "Automação"];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-brand">Blog</span> Dominus Digital
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Insights, dicas e estratégias para acelerar o crescimento do seu negócio digital
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar artigos..." 
                className="pl-10 bg-background/80 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Todos" ? "default" : "outline"}
                className={category === "Todos" ? "btn-hero" : "btn-outline-brand"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Post */}
          {blogPosts.filter(post => post.featured).map((post) => (
            <Card key={post.id} className="card-elevated mb-12 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <Badge className="bg-secondary text-secondary-foreground mb-4">
                      Artigo em Destaque
                    </Badge>
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white font-bold text-2xl">D</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <Badge variant="outline">{post.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime} de leitura
                    </div>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground mb-6 text-lg">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Por {post.author}
                    </span>
                    <Button className="btn-hero">
                      Ler Artigo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Regular Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <Card key={post.id} className="card-elevated hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                  
                  <CardTitle className="group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {post.excerpt}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {post.author}
                    </span>
                    <Button size="sm" variant="outline" className="btn-outline-brand">
                      Ler Mais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" className="btn-outline-brand px-8">
              Carregar Mais Artigos
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Receba Conteúdo Exclusivo
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Assine nossa newsletter e seja o primeiro a receber nossas dicas, 
            estratégias e novidades do mundo digital.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Seu melhor e-mail"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button 
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              Assinar
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Simplified for blog page */}
      <footer className="bg-background border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-gradient-brand font-bold text-lg">Dominus Digital</span>
          </div>
          <p className="text-muted-foreground">
            &copy; 2024 Dominus Digital. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;