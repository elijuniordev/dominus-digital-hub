import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import DOMPurify from 'dompurify';
import apiClient from "@/api/apiClient";

// --- TIPAGEM para os Posts do Blog ---
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  status: 'draft' | 'published';
  featured_image_url: string | null;
  publish_date: string | null;
  blog_categories: { name: string } | null;
};

// CORRIGIDO: Função de resumo segura que remove tags HTML antes de cortar
const createExcerpt = (text: string | null | undefined, maxLength: number = 120) => {
  if (!text) return '';
  // 1. Sanitiza o conteúdo removendo todas as tags HTML
  const sanitizedText = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  
  if (sanitizedText.length <= maxLength) return sanitizedText.trim();
  // Garante que o corte não quebre palavras
  const trimmedText = sanitizedText.slice(0, maxLength);
  return trimmedText.slice(0, trimmedText.lastIndexOf(' ')) + '...';
};

const BlogPage = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/blog');
      if (!response.ok) {
        throw new Error("Não foi possível carregar os artigos do blog.");
      }
      const allPosts: BlogPost[] = await response.json();
      const publishedPosts = allPosts.filter(post => post.status === 'published' && post.publish_date);
      setPosts(publishedPosts);
    } catch (error) {
      const desc = error instanceof Error ? error.message : "Erro desconhecido.";
      toast({ title: "Erro", description: desc, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // CORREÇÃO: A chamada deve ser para a rota pública.
        const response = await apiClient.get('/api/public/blog'); 
        setPosts(response.data);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const PostSkeleton = () => (
    <Card className="overflow-hidden flex flex-col md:flex-row">
      <Skeleton className="h-48 w-full md:w-1/3" />
      <div className="p-6 flex-1">
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-7 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        <div className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-4xl mx-auto">
              {/* --- BOTÃO DE VOLTAR ADICIONADO --- */}
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para a Home
              </Link>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-gradient-brand">
                  Nosso Blog
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                  Fique por dentro das últimas tendências em tecnologia e marketing digital.
                </p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {isLoading ? (
                <> <PostSkeleton /> <PostSkeleton /> <PostSkeleton /> </>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <Link to={`/blog/${post.slug}`} key={post.id} className="group block">
                    <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-lg flex flex-col md:flex-row">
                      {/* CORREÇÃO: Garante que a imagem seja renderizada corretamente */}
                      <img
                        src={post.featured_image_url || 'https://via.placeholder.com/400x300'}
                        alt={`Imagem do post ${post.title}`}
                        className="h-48 w-full md:h-auto md:w-1/3 object-cover"
                      />
                      <div className="p-6 flex-1 flex flex-col justify-center">
                        <p className="text-sm text-primary font-semibold">
                          {post.blog_categories?.name || 'Geral'}
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold leading-tight group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="mt-3 text-base text-muted-foreground">
                          {createExcerpt(post.content)}
                        </p>
                        {post.publish_date && (
                          <p className="mt-4 text-xs text-muted-foreground">
                            Publicado em {format(new Date(post.publish_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">Nenhum artigo publicado ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPage;