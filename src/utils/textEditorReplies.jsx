import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import '../styles/TextEditorReplies.css';

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

const TextEditorReplies = forwardRef(({ onContentChange, onClose, onSubmit }, ref) => {
  const [showDiscardWarning, setShowDiscardWarning] = React.useState(false);
  const editorRef = useRef(null);
  const [editorState, setEditorState] = React.useState(INITIAL_EDITOR_STATE);

  const editorConfig = {
    namespace: 'ReplyEditor',
    onError: (error) => {
      console.error('Lexical Error:', error);
    },
  };

  const EditorContent = () => {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
      editorRef.current = editor;
    }, [editor]);
    return null;
  };

  // expand imperative handle later by adding some insertQuote method for adding quotes from other posts to user's own post
  useImperativeHandle(ref, () => ({
    getContent: () =>
      editorState || JSON.stringify({ root: { children: [], type: 'root' } }),
  }));

  // check editor content state
  const isEditorEmpty = () => {
    try {
      const json = JSON.parse(editorState);
      if (!json.root || !json.root.children) return true;
      return json.root.children.every(
        node =>
          !node.children ||
          node.children.every(child => !child.text || child.text.trim() === '')
      );
    } catch {
      return true;
    }
  };

  const handleClose = () => {
    if (!isEditorEmpty()) {
      setShowDiscardWarning(true);
      return;
    }
    onClose();
  };

  const handleDiscardConfirm = () => {
    setShowDiscardWarning(false);
    onClose();
  };

  const handleDiscardCancel = () => {
    setShowDiscardWarning(false);
  };

  const handleSubmit = () => {
    if (ref.current) {
      const content = ref.current.getContent();
      onSubmit(content);
    }
  };

  return (
    <div className="reply-editor-window">
      <LexicalComposer initialConfig={editorConfig}>
        <EditorContent />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="reply-editor-input"
              onInput={() => {}} // optionally add live update logic
            />
          }
        />
        <button className="submit-reply-btn" onClick={handleSubmit}>Submit Reply</button>
        <button className="close-reply-window-btn"onClick={handleClose}>Close</button>
        {showDiscardWarning && (
        <div className="discard-modal-overlay">
          <div className="discard-modal">
            <p>Close reply window? All changes will be discarded.</p>
            <button onClick={handleDiscardConfirm}>Discard</button>
            <button onClick={handleDiscardCancel}>Cancel</button>
          </div>
        </div>
        )}
        <OnChangePlugin
          onChange={(editorStateObj) => {
            editorStateObj.read(() => {
              const json = editorStateObj.toJSON();
              setEditorState(JSON.stringify(json));
              if (onContentChange) {
                onContentChange(JSON.stringify(json));
              }
            });
          }}
        />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
});

export default TextEditorReplies;