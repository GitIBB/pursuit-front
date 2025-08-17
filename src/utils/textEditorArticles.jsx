import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import '../styles/TextEditor.css'; 

const INITIAL_EDITOR_STATES = {
  Introduction: JSON.stringify({
    root: {
      children: [
        {
          type: 'paragraph',
          children: [{ text: 'Introductory text', type: 'text' }],
        },
      ],
      type: 'root',
    },
  }),
  'Main Body': JSON.stringify({
    root: {
      children: [
        {
          type: 'paragraph',
          children: [{ text: 'Main Section', type: 'text' }],
        },
      ],
      type: 'root',
    },
  }),
  Conclusion: JSON.stringify({
    root: {
      children: [
        {
          type: 'paragraph',
          children: [{ text: 'End Section', type: 'text' }],
        },
      ],
      type: 'root',
    },
  }),
};

const TextEditorArticles = forwardRef(({ onContentChange }, ref) => {
  const [activeTab, setActiveTab] = useState('Introduction');
  const [tabStates, setTabStates] = useState(INITIAL_EDITOR_STATES);
  const editorRef = useRef(null);

  const editorConfig = {
    namespace: 'TextEditor',
    onError: (error) => {
      console.error('Lexical Error:', error);
    },
  };

  // restore content when the active tab changes
  useEffect(() => {
    if (editorRef.current) {
      const content = tabStates[activeTab];
      if (content) {
        try {
          const parsedState = editorRef.current.parseEditorState(JSON.parse(content));
          editorRef.current.setEditorState(parsedState);
        } catch (err) {
          console.error(`Failed to restore content for: ${activeTab}`, err);
        }
      }
    }
  }, [activeTab]);

  const handleTabChange = (newTab) => {
    if (editorRef.current) {
      const currentEditorState = editorRef.current.getEditorState();
      currentEditorState.read(() => {
        const json = currentEditorState.toJSON();
        setTabStates((prevStates) => ({
          ...prevStates,
          [activeTab]: JSON.stringify(json),
        }));
        if (onContentChange) {
          onContentChange({
            ...tabStates,
            [activeTab]: JSON.stringify(json),
          });
        }
      });
    }
    setActiveTab(newTab);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const currentEditorState = editorRef.current.getEditorState();
      currentEditorState.read(() => {
        const json = currentEditorState.toJSON();
        setTabStates((prevStates) => ({
          ...prevStates,
          [activeTab]: JSON.stringify(json),
        }));
        if (onContentChange) {
          onContentChange({
            ...tabStates,
            [activeTab]: JSON.stringify(json),
          });
        }
      });
    }
  };

  const EditorContent = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      editorRef.current = editor;
    }, [editor]);

    return null;
  };

  useImperativeHandle(ref, () => ({
    getContent: () => ({
      introduction: tabStates.Introduction || JSON.stringify({ root: { children: [], type: 'root' } }),
      mainBody: tabStates['Main Body'] || JSON.stringify({ root: { children: [], type: 'root' } }),
      conclusion: tabStates.Conclusion || JSON.stringify({ root: { children: [], type: 'root' } }),
    }),
  }));

  return (
    <div>
      <div className="tabs">
        <button
          className={activeTab === 'Introduction' ? 'active-tab' : ''}
          onClick={() => handleTabChange('Introduction')}
        >
          Introduction
        </button>
        <button
          className={activeTab === 'Main Body' ? 'active-tab' : ''}
          onClick={() => handleTabChange('Main Body')}
        >
          Main Body
        </button>
        <button
          className={activeTab === 'Conclusion' ? 'active-tab' : ''}
          onClick={() => handleTabChange('Conclusion')}
        >
          Conclusion
        </button>
      </div>

      <div className="tab-content">
        <LexicalComposer initialConfig={editorConfig}>
          <EditorContent />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                onInput={handleInput}
              />
            }
            placeholder={
              <div className="editor-placeholder">
                {`Write the ${activeTab.toLowerCase()}...`}
              </div>
            }
          />
          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const json = editorState.toJSON();
                setTabStates((prevStates) => ({
                  ...prevStates,
                  [activeTab]: JSON.stringify(json),
                }));
              });
            }}
          />
          <HistoryPlugin />
        </LexicalComposer>
      </div>
    </div>
  );
});

export default TextEditorArticles;