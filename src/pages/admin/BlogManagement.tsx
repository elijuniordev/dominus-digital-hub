import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PostsTable, type BlogPost } from "@/components/pages/blog-management/PostsTable";
import { PostFormDialog } from "@/components/pages/blog-management/PostFormDialog";

// Tipagem para os dados da página
type Author = { id: string; email: string; };
type Category = { id: string; name: string; };
type FullBlogPost = BlogPost & { content: string; author_id: string; category_id: string; featured_image_url: string; };
type PostForm = { title: string; content: string; author_id: string; category_id: string; featured_image_url: string; status: 'draft' | 'published'; };
const emptyForm: PostForm = { title: '', content: '', author_id: '', category_id: '', featured_image_url: '', status: 'draft' };

const BlogManagement = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<PostForm>>(emptyForm);
  const API_BASE_URL = "/api/admin";

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [postsRes, authorsRes, categoriesRes] = await Promise.all([ fetch(`${API_BASE_URL}/blog`), fetch(`${API_BASE_URL}/helpers/users`), fetch(`${API_BASE_URL}/helpers/blog-categories`), ]);
      if (!postsRes.ok || !authorsRes.ok || !categoriesRes.ok) throw new Error("Falha ao buscar dados.");
      setPosts(await postsRes.json()); setAuthors(await authorsRes.json()); setCategories(await categoriesRes.json());
    } catch (error) { toast({ title: "Erro ao Carregar", description: error instanceof Error ? error.message : "Erro.", variant: "destructive" });
    } finally { setIsLoading(false); }
    // CORREÇÃO: Removida a dependência 'toast' que era desnecessária
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // As outras funções (handleOpenNewDialog, handleOpenEditDialog, handleSave, handleDelete) continuam as mesmas
  const handleOpenNewDialog = () => { setEditingPost(null); setFormData(emptyForm); setIsDialogOpen(true); };
  const handleOpenEditDialog = async (post: BlogPost) => {
    setEditingPost(post);
    try {
      const response = await fetch(`${API_BASE_URL}/blog/${post.slug}`);
      if (!response.ok) throw new Error("Não foi possível carregar os dados do post para edição.");
      const fullPostData: FullBlogPost = await response.json();
      setFormData({
        title: fullPostData.title, content: fullPostData.content, author_id: fullPostData.author_id,
        category_id: fullPostData.category_id, featured_image_url: fullPostData.featured_image_url, status: fullPostData.status,
      });
      setIsDialogOpen(true);
    } catch (error) { toast({ title: "Erro", description: error instanceof Error ? error.message : "Erro.", variant: "destructive" }); }
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const isEditing = editingPost !== null;
    const url = isEditing ? `${API_BASE_URL}/blog/${editingPost.id}` : `${API_BASE_URL}/blog`;
    const method = isEditing ? "PUT" : "POST";
    try {
      const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!response.ok) throw new Error((await response.json()).error);
      toast({ title: "Sucesso!", description: `Post ${isEditing ? 'atualizado' : 'criado'} com sucesso.` });
      setIsDialogOpen(false); await fetchData();
    } catch (error) { toast({ title: "Erro ao Salvar", description: error instanceof Error ? error.message : "Erro.", variant: "destructive" });
    } finally { setIsSaving(false); }
  };
  const handleDelete = async (postId: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blog/${postId}`, { method: 'DELETE' });
        if (response.status !== 204) throw new Error('Falha ao deletar post.');
        toast({ title: "Sucesso!", description: "Post excluído." });
        await fetchData();
    } catch (error) { toast({ title: "Erro ao Excluir", description: error instanceof Error ? error.message : "Erro.", variant: "destructive" }); }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Blog</h1>
          <p className="text-muted-foreground">Crie, edite e publique artigos para seu site.</p>
        </div>
        <Button className="btn-hero" onClick={handleOpenNewDialog}><Plus className="h-4 w-4 mr-2" />Novo Post</Button>
      </div>
      
      <PostsTable
        posts={posts}
        isLoading={isLoading}
        onEdit={handleOpenEditDialog}
        onDelete={handleDelete}
      />
      
      <PostFormDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        isSaving={isSaving}
        editingPost={editingPost}
        formData={formData}
        setFormData={setFormData}
        authors={authors}
        categories={categories}
        onSave={handleSave}
      />
    </div>
  );
};

export default BlogManagement;