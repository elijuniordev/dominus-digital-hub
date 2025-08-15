import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CKEditorComponent } from "@/components/ui/CKEditorComponent"; // <-- Importando o NOVO editor
import { Loader2, UploadCloud } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { BlogPost } from "./PostsTable";

// Tipagem
type Author = { id: string; email: string; };
type Category = { id: string; name: string; };
type PostForm = {
  title: string; content: string; author_id: string; category_id: string; 
  featured_image_url: string; status: 'draft' | 'published';
  meta_description: string; keywords: string; image_alt_text: string;
};

interface PostFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isSaving: boolean;
  editingPost: BlogPost | null;
  formData: Partial<PostForm>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<PostForm>>>;
  authors: Author[];
  categories: Category[];
  onSave: (e: React.FormEvent) => void;
}

export const PostFormDialog = ({
  isOpen, setIsOpen, isSaving, editingPost, formData, setFormData, authors, categories, onSave
}: PostFormDialogProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (uploadedFilePath) {
      await supabase.storage.from('blog-images').remove([uploadedFilePath]);
    }

    setIsUploading(true);
    const fileName = `${uuidv4()}-${file.name}`;
    
    try {
      const { data, error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(fileName);
      setFormData({ ...formData, featured_image_url: publicUrl });
      setUploadedFilePath(fileName);
      toast({ title: "Sucesso!", description: "Imagem enviada." });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro desconhecido.";
      toast({ title: "Erro no Upload", description: msg, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseDialog = async () => {
    if (uploadedFilePath && !isSaving) {
      if (editingPost?.featured_image_url !== formData.featured_image_url) {
        await supabase.storage.from('blog-images').remove([uploadedFilePath]);
        toast({ title: "Aviso", description: "Upload da imagem cancelado." });
      }
    }
    setUploadedFilePath(null);
    setIsOpen(false);
  };
  
  useEffect(() => {
    if (isOpen) { setUploadedFilePath(null); }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-4xl">
        <form onSubmit={onSave}>
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Editar' : 'Criar'} Post</DialogTitle>
            <DialogDescription>{/* ... */}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              {/* --- SUBSTITUÍDO O EDITOR ANTIGO PELO NOVO CKEDITOR --- */}
              <CKEditorComponent
                  content={formData.content || ''}
                  onChange={(newContent) => setFormData({...formData, content: newContent})}
              />
            </div>
            {/* ... (Restante do formulário: Imagem, SEO, etc.) ... */}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
            <Button type="submit" disabled={isSaving}>{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};