import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import '../styles/ToolbarPlugin.css'; // Import your custom styles

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const applyFormat = (format) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
      }
    });
  };

  return (
    <div className="toolbar">
      <button type="button" onClick={() => applyFormat('bold')}><b>B</b></button>
      <button type="button" onClick={() => applyFormat('italic')}><i>I</i></button>
      <button type="button" onClick={() => applyFormat('underline')}><u>U</u></button>
    </div>
  );
};

export default ToolbarPlugin;