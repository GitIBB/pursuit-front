import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import '../styles/TextEditor.css';

const INITIAL_EDITOR_STATE = JSON.stringify({
  root: {
    children: [
      {
        type: 'paragraph',
        children: [{ text: '', type: 'text' }],
      },
    ],
    type: 'root',
  },
});

const CommentEditor = forwardRef(({ onContentChange }, ref) => {
  const editorRef = useRef(null);
  const [editorState, setEditorState] = React.useState(INITIAL_EDITOR_STATE);

  const editorConfig = {
    namespace: 'SimpleTextEditor',
    onError: (error) => {
      console.error('Lexical Error:', error);
    },
  };

  useImperativeHandle(ref, () => ({
    getContent: () => editorState,
  }));

  const EditorContent = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      editorRef.current = editor;
    }, [editor]);

    return null;
  };

  return (
    <div>
      <LexicalComposer initialConfig={editorConfig}>
        <EditorContent />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="editor-input"
            />
          }
          placeholder={
            <div className="editor-placeholder">
              Write your comment...
            </div>
          }
        />
        <OnChangePlugin
          onChange={(editorStateObj) => {
            editorStateObj.read(() => {
              const json = editorStateObj.toJSON();
              const jsonString = JSON.stringify(json);
              setEditorState(jsonString);
              if (onContentChange) {
                onContentChange(jsonString);
              }
            });
          }}
        />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
});

export default CommentEditor;