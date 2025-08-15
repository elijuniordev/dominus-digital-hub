import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash, Newspaper } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// --- CORREÇÃO: Adicionando a palavra 'export' para tornar o tipo utilizável em outros arquivos ---
export type BlogPost = {
  id: string;
  title: string;
  status: 'draft' | 'published';
  publish_date: string | null;
  slug: string;
  featured_image_url: string | null;
  users: { email: string } | null;
  blog_categories: { name: string } | null;
};

// Props que o componente receberá
interface PostsTableProps {
  posts: BlogPost[];
  isLoading: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
}

const TableSkeleton = () => (
  Array.from({ length: 3 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-9 w-24 ml-auto" /></TableCell>
    </TableRow>
  ))
);

export const PostsTable = ({ posts, isLoading, onEdit, onDelete }: PostsTableProps) => {
  return (
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
                  <Button variant="outline" size="icon" onClick={() => onEdit(post)}><Edit className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash className="h-4 w-4" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Esta ação é irreversível.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(post.id)}>Excluir</AlertDialogAction></AlertDialogFooter>
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
  );
};