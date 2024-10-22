import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markdown'; // Ensure markdown language support
import 'prismjs/themes/prism-tomorrow.css'; // You can choose different themes

interface MarkdownEditorProps {
  pageContent: string;
  setPageContent: (content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ pageContent, setPageContent }) => {
 

  return (
    <div className="w-full h-fit max-h-screen overflow-y-auto border bg-background">
      <Editor
        value={pageContent}
        onValueChange={(code) => setPageContent(code)}
        highlight={(code) => highlight(code, languages.markdown, 'markdown')}
        padding={10}
        className="w-full h-full text-left focus-visible:outline-none focus:outline-2 outline-cyan-700 "
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
