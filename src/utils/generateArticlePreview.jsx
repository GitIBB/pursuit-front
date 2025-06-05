import extractPlainText from '../utils/extractPlainText';

export default function generateArticlePreview ({ title, titleImage, introToBodyImage, bodyToConclusionImage, editorContent, sectionHeaders }) {
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