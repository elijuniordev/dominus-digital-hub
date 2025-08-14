import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash, Loader2, Newspaper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// --- TIPAGEM ---
type Author = { id: string; email: string; role: string };
type Category = { id: number; name: string };

type BlogPost = {
  id: number;
  title: string;
  status: 'draft' | 'published';
  publish_date: string | null;
  users: { email: string } | null;
  blog_categories: { name: string } | null;
  // Adicione outros campos que você busca na lista
};

type PostForm = {
  title: string;
  content: string;
  author_id: string;
  category_id: number;
  featured_image_url: string;
  status: 'draft' | 'published';
};

const emptyForm: PostForm = {
  title: '',
  content: '',
  author_id: '',
  category_id: 0,
  featured_image_url: '',
  status: 'draft',
};

// --- COMPONENTE ---
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
      const [postsRes, authorsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/blog`),
        fetch(`${API_BASE_URL}/helpers/users`),
        fetch(`${API_BASE_URL}/helpers/blog-categories`),
      ]);

      if (!postsRes.ok) throw new Error((await postsRes.json()).error || "Falha ao buscar posts.");
      if (!authorsRes.ok) throw new Error((await authorsRes.json()).error || "Falha ao buscar autores.");
      if (!categoriesRes.ok) throw new Error((await categoriesRes.json()).error || "Falha ao buscar categorias.");

      const postsData: BlogPost[] = await postsRes.json();
      const authorsData: Author[] = await authorsRes.json();
      const categoriesData: Category[] = await categoriesRes.json();
      
      setPosts(postsData);
      setAuthors(authorsData);
      setCategories(categoriesData);

    } catch (error) {
      const desc = error instanceof Error ? error.message : "Erro desconhecido.";
      toast({ title: "Erro ao Carregar", description: desc, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenNewDialog = () => {
    setEditingPost(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (post: BlogPost) => {
    // NOTA: A edição completa (com conteúdo) requer um endpoint GET /api/admin/blog/:id.
    // Por enquanto, a edição se concentrará nos campos já disponíveis na lista.
    setEditingPost(post);
    setFormData({
      title: post.title,
      status: post.status,
      // outros campos viriam de uma chamada GET por ID
    });
    setIsDialogOpen(true);
    toast({
      title: "Modo de Edição Simplificado",
      description: "Para editar o conteúdo, é necessário criar um endpoint que busca o post completo por ID."
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const isEditing = editingPost !== null;
    const url = isEditing ? `${API_BASE_URL}/blog/${editingPost.id}` : `${API_BASE_URL}/blog`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      toast({ title: "Sucesso!", description: `Post ${isEditing ? 'atualizado' : 'criado'} com sucesso.` });
      setIsDialogOpen(false);
      await fetchData();
    } catch (error) {
      const desc = error instanceof Error ? error.message : "Erro desconhecido.";
      toast({ title: "Erro ao Salvar", description: desc, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async (postId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blog/${postId}`, { method: 'DELETE' });
        if (response.status !== 204) {
            throw new Error('Falha ao deletar post.');
        }
        toast({ title: "Sucesso!", description: "Post excluído." });
        await fetchData();
    } catch (error) {
        const desc = error instanceof Error ? error.message : "Erro desconhecido.";
        toast({ title: "Erro ao Excluir", description: desc, variant: "destructive" });
    }
  };

  const TableSkeleton = () => (
    Array.from({ length: 3 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
      </TableRow>
    ))
  );
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Blog</h1>
          <p className="text-muted-foreground">Crie, edite e publique artigos para seu site.</p>
        </div>
        <Button className="btn-hero" onClick={handleOpenNewDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Post
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? <TableSkeleton /> : posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.users?.email || 'N/A'}</TableCell>
                  <TableCell>{post.blog_categories?.name || 'N/A'}</TableCell>
                  <TableCell><Badge variant={post.status === 'published' ? 'default' : 'outline'}>{post.status === 'published' ? 'Publicado' : 'Rascunho'}</Badge></TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenEditDialog(post)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Esta ação é irreversível.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(post.id)}>Excluir</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="h-24 text-center"><Newspaper className="mx-auto h-8 w-8 text-muted-foreground mb-2" />Nenhum post encontrado.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Editar' : 'Criar'} Post</DialogTitle>
              <DialogDescription>
                {editingPost ? 'Altere os detalhes do post abaixo.' : 'Preencha os campos para criar um novo artigo.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" value={formData.title || ''} onChange={(e) => setFormData(p => ({...p, title: e.target.value}))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo (Markdown suportado)</Label>
                <Textarea id="content" value={formData.content || ''} onChange={(e) => setFormData(p => ({...p, content: e.target.value}))} rows={15} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="featured_image_url">URL da Imagem de Destaque</Label>
                <Input id="featured_image_url" value={formData.featured_image_url || ''} onChange={(e) => setFormData(p => ({...p, featured_image_url: e.target.value}))} placeholder="https://exemplo.com/imagem.jpg"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Autor</Label>
                  <Select value={formData.author_id} onValueChange={(v) => setFormData(p => ({...p, author_id: v}))} required>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>{authors.map(a => <SelectItem key={a.id} value={a.id}>{a.email}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={String(formData.category_id)} onValueChange={(v) => setFormData(p => ({...p, category_id: Number(v)}))} required>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData(p => ({...p, status: v as PostForm['status']}))} required>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" disabled={isSaving}>Cancelar</Button></DialogClose>
              <Button type="submit" className="btn-hero" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;