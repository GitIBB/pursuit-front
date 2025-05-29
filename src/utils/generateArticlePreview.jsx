const extractPlainText = (editorStateJSON) => {
  try {
    if (!editorStateJSON) {
      return ''; // Fallback for empty or undefined JSON
    }

    const editorState = JSON.parse(editorStateJSON);
    const root = editorState.root;

    // Traverse the root node and extract text from all child nodes
    const extractText = (node) => {
      if (node.type === 'text') {
        return node.text || '';
      }
      if (node.children) {
        return node.children.map(extractText).join(' ');
      }
      return '';
    };

    return extractText(root);
  } catch (error) {
    console.error('Failed to parse editor state:', error);
    return ''; // Fallback for invalid JSON
  }
};

const generateArticlePreview = ({ title, titleImage, introToBodyImage, bodyToConclusionImage, editorContent, sectionHeaders }) => {
  const introductionText = extractPlainText(editorContent.introduction);
  const mainBodyText = extractPlainText(editorContent.mainBody);
  const conclusionText = extractPlainText(editorContent.conclusion);

  return (
    <div className="article-preview">
      <h1>{title}</h1>
      {titleImage && <img src={URL.createObjectURL(titleImage)} alt="Title Image" className="preview-image" />}
      <h2>{sectionHeaders.introduction}</h2>
      <p>{introductionText}</p>
      {introToBodyImage && <img src={URL.createObjectURL(introToBodyImage)} alt="Intro to Body Image" className="preview-image" />}
      <h2>{sectionHeaders.mainBody}</h2>
      <p>{mainBodyText}</p>
      {bodyToConclusionImage && <img src={URL.createObjectURL(bodyToConclusionImage)} alt="Body to Conclusion Image" className="preview-image" />}
      <h2>{sectionHeaders.conclusion}</h2>
      <p>{conclusionText}</p>
    </div>
  );
};

export { generateArticlePreview };