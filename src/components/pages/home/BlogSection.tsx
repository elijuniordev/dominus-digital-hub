import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import DOMPurify from 'dompurify';
// A importação agora usa chaves {}.
import apiClient from '@/api/apiClient';

type BlogPost = { 
  id: string; 
  title: string; 
  slug: string; 
  content: string; 
  featured_image_url: string | null; 
  publish_date: string | null; 
};

const createExcerpt = (text: string | null | undefined, maxLength: number = 80) => {
  if (!text) return '';
  const sanitizedText = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  if (sanitizedText.length <= maxLength) return sanitizedText.trim();
  const trimmedText = sanitizedText.slice(0, maxLength);
  return trimmedText.slice(0, trimmedText.lastIndexOf(' ')) + '...';
};

export const BlogSection = () => {
  const { toast } = useToast();
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchLatestPosts = useCallback(async () => { 
    setIsLoading(true); 
    try { 
      const response = await apiClient.get('/api/public/blog'); 
      setLatestPosts(response.data.slice(0, 3)); 
    } catch (error) { 
      const desc = error instanceof Error ? error.message : "Erro desconhecido.";
      toast({ title: "Erro", description: desc, variant: "destructive" }); 
    } finally { 
      setIsLoading(false); 
    } 
  }, [toast]);
  
  useEffect(() => { 
    fetchLatestPosts(); 
  }, [fetchLatestPosts]);

  return (
    <section className="py-20 bg-muted/30">
        {/* O JSX aqui não precisa de alterações */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Blog & Insights</h2>
                    <p className="text-xl text-muted-foreground">Dicas e estratégias para turbinar seu negócio digital</p>
                </div>
                <Link to="/blog">
                    <Button variant="outline" className="btn-outline-brand">
                        Ver Todos os Posts<ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <Skeleton className="h-4 w-1/2 mb-4"/>
                                <Skeleton className="h-6 w-full"/>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-full mt-2"/>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    latestPosts.map((post) => (
                        <Link to={`/blog/${post.slug}`} key={post.id} className="block group">
                            <Card className="card-elevated h-full hover:shadow-xl transition-all duration-300">
                                <img src={post.featured_image_url || 'https://via.placeholder.com/400x250'} alt={`Imagem do post ${post.title}`} className="h-40 w-full object-cover" />
                                <CardHeader>
                                    {post.publish_date && <div className="flex justify-between items-center text-sm text-muted-foreground mb-2"><span>{format(new Date(post.publish_date), "dd MMM yyyy", { locale: ptBR })}</span></div>}
                                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{post.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="line-clamp-3">{createExcerpt(post.content)}</CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    </section>
  );
};