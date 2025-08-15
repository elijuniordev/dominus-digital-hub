import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import DOMPurify from 'dompurify'; // Garanta que esta importação existe

type BlogPost = {
  title: string; content: string; meta_description: string | null; image_alt_text: string | null;
  featured_image_url: string | null; publish_date: string | null;
  users: { email: string } | null; blog_categories: { name: string } | null;
};

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/blog/${slug}`);
      if (response.status === 404) {
        toast({ title: "Artigo não encontrado", variant: "destructive" });
        navigate("/blog");
        return;
      }
      if (!response.ok) throw new Error("Não foi possível carregar o artigo.");
      const data: BlogPost = await response.json();
      setPost(data);
    } catch (error) {
      toast({ title: "Erro", description: error instanceof Error ? error.message : "Erro.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [slug, toast, navigate]);

  useEffect(() => { fetchPost(); }, [fetchPost]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl"><Skeleton className="h-6 w-40 mb-8" /><Skeleton className="h-96 w-full mb-8" /><Skeleton className="h-12 w-3/4 mb-4" /><Skeleton className="h-5 w-1/2 mb-8" /><Skeleton className="h-5 w-full mb-3" /><Skeleton className="h-5 w-full mb-3" /><Skeleton className="h-5 w-5/6" /></div></main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"><h2 className="text-2xl font-bold">Artigo não encontrado</h2><p className="text-muted-foreground mt-2">O link pode estar quebrado ou o artigo foi removido.</p><Button asChild className="mt-6"><Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" />Voltar para o blog</Link></Button></div></main>
      </div>
    );
  }
  const sanitizedContent = post ? DOMPurify.sanitize(post.content) : '';

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Helmet>
          <title>{`${post.title} - Dominus Digital`}</title>
          {post.meta_description && (<meta name="description" content={post.meta_description} />)}
        </Helmet>
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"><ArrowLeft className="mr-2 h-4 w-4" />Voltar para todos os artigos</Link>
          {post.featured_image_url && ( <img src={post.featured_image_url} alt={post.image_alt_text || post.title} className="w-full h-64 md:h-96 object-cover rounded-lg mb-8" /> )}
          {post.blog_categories?.name && ( <Badge variant="outline" className="mb-4">{post.blog_categories.name}</Badge> )}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">{post.title}</h1>
          {post.publish_date && ( <p className="text-muted-foreground mb-8">Publicado por {post.users?.email || 'Admin'} em {format(new Date(post.publish_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p> )}
          <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
        />
        </article>
      </main>
    </div>
  );
};

export default PostPage;