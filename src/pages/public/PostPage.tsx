import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

// --- TIPAGEM para um Post Individual ---
type BlogPost = {
  title: string;
  content: string;
  featured_image_url: string | null;
  publish_date: string | null;
  users: { email: string } | null;
  blog_categories: { name: string } | null;
};

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/blog/${slug}`);
      if (!response.ok) {
        throw new Error("Artigo não encontrado ou não publicado.");
      }
      const data: BlogPost = await response.json();
      setPost(data);
    } catch (error) {
      const desc = error instanceof Error ? error.message : "Erro desconhecido.";
      toast({ title: "Erro", description: desc, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [slug, toast]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <Skeleton className="h-96 w-full mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold">Artigo não encontrado</h2>
        <p className="text-muted-foreground mt-2">O link que você seguiu pode estar quebrado ou o artigo foi removido.</p>
        <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">
          Voltar para o blog
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      {/* --- BOTÃO DE VOLTAR ADICIONADO --- */}
      <Link
        to="/blog"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para todos os artigos
      </Link>

      {post.featured_image_url && (
        <img
          src={post.featured_image_url}
          alt={`Imagem do post ${post.title}`}
          className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
        />
      )}
      
      {post.blog_categories?.name && (
        <Badge variant="outline" className="mb-4">{post.blog_categories.name}</Badge>
      )}

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
        {post.title}
      </h1>

      {post.publish_date && (
        <p className="text-muted-foreground mb-8">
          Publicado por {post.users?.email || 'Admin'} em {format(new Date(post.publish_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      )}

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
};

export default PostPage;