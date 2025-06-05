import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

export default function LexicalViewer({ initialJson }) {
  const initialConfig = {
    editorState: typeof initialJson === "string" ? initialJson : JSON.stringify(initialJson),
    editable: false,
    theme: {},
    onError: (error) => { throw error; },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className="lexical-viewer" />}
        placeholder={null}
      />
    </LexicalComposer>
  );
}