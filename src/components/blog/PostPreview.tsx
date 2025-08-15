// src/components/blog/PostPreview.tsx
import DOMPurify from 'dompurify';

const PostPreview = ({ content }) => {
  // Sanitiza o conteúdo HTML para garantir que não há código malicioso
  const cleanHtml = DOMPurify.sanitize(content, {
    // Adicione opções de sanitização conforme a sua necessidade.
    // Por exemplo, para permitir tags como `<a>` e `<b>`.
    USE_PROFILES: { html: true } 
  });
  
  // Renderiza o HTML sanitizado de forma segura
  return (
    <div 
      className="post-content-preview"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default PostPreview;