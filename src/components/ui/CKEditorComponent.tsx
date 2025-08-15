import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorProps {
  content: string;
  onChange: (data: string) => void;
}

export const CKEditorComponent = ({ content, onChange }: CKEditorProps) => {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <CKEditor
        editor={ClassicEditor}
        data={content}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
            // Você pode adicionar configurações aqui, como a língua
            language: 'pt-br',
        }}
      />
    </div>
  );
};