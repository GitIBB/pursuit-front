import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEditor from '../utils/textEditor'; // Import the standalone editor
import '../styles/ArticleCreate.css';
import '../styles/ArticlePreview.css';
import { apiRequest, isLoggedIn } from '../utils/auth';
import ImageUpload from './ImageUpload'; // Import the ImageUpload component
import { generateArticlePreview } from '../utils/generateArticlePreview';


const ArticleCreate = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [titleImage, setTitleImage] = useState(null);
  const [introToBodyImage, setIntroToBodyImage] = useState(null);
  const [bodyToConclusionImage, setBodyToConclusionImage] = useState(null);
  const textEditorRef = useRef(null);
  const [sectionHeaders, setSectionHeaders] = useState({
    introduction: 'Introduction',
    mainBody: 'Main Body',
    conclusion: 'Conclusion',
  });
  const [editorContent, setEditorContent] = useState({
    introduction: '',
    mainBody: '',
    conclusion: '',
  });
  const navigate = useNavigate();

  useEffect(() => {    // Check if the user is logged in before accessing article creation
    if (!isLoggedIn()) {
      navigate('/login'); // Redirect to login page if not logged in
    }
  }, [navigate]);

  const handleContentChange = () => {
    if (textEditorRef.current) {
      const updatedContent = textEditorRef.current.getContent();
      setEditorContent(updatedContent); // Dynamically update the editor content
    }
  };

  const handleHeaderChange = (section, value) => {
    setSectionHeaders((prevHeaders) => ({
      ...prevHeaders,
      [section]: value,
    }));
  };


  const handleSubmit = async (e) => { // Handle form submission
    e.preventDefault();
    setError('');
    setSuccess(false);

    try { // Check if the user is logged in before submitting the article
      if (!isLoggedIn()) {
        throw new Error('Not authenticated');
      }

      const editorContent = textEditorRef.current.getContent();

      const formData = new FormData();
      formData.append('title', title);
      formData.append('tags', tags.split(',').map((tag) => tag.trim()));
      formData.append('titleImage', titleImage);
      formData.append('introToBodyImage', introToBodyImage);
      formData.append('bodyToConclusionImage', bodyToConclusionImage);
      formData.append('body', JSON.stringify(editorContent)); // Add editor content as JSON

      const response = await apiRequest(`${import.meta.env.VITE_API_BASE_URL}/api/articles`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error('Failed to create article');
      }

      setSuccess(true);
      localStorage.removeItem('articleDraft'); // Clear local draft after successful submission
      navigate('/articles');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="article-page-container">
      <div className="article-create-container">
          <TextEditor ref={textEditorRef} onContentChange={handleContentChange} />

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Article Title"
              required
            />
          </div>

          <div className="section-headers-container">
            <label htmlFor="introduction-header">Introduction Header:</label>
            <input
              type="text"
              id="introduction-header"
              value={sectionHeaders.introduction}
              onChange={(e) => handleHeaderChange('introduction', e.target.value)}
              placeholder="Enter Introduction Header"
            />

            <label htmlFor="main-body-header">Main Body Header:</label>
            <input
              type="text"
              id="main-body-header"
              value={sectionHeaders.mainBody}
              onChange={(e) => handleHeaderChange('mainBody', e.target.value)}
              placeholder="Enter Main Body Header"
            />

            <label htmlFor="conclusion-header">Conclusion Header:</label>
            <input
              type="text"
              id="conclusion-header"
              value={sectionHeaders.conclusion}
              onChange={(e) => handleHeaderChange('conclusion', e.target.value)}
              placeholder="Enter Conclusion Header"
            />
          </div>

          <div className= "image-upload-container">
            <ImageUpload
              label="Image Between Title and Introduction:"
              onImageSelect={setTitleImage}
              previewAltText="Title Image Preview"
            />

            <ImageUpload
              label="Image Between Introduction and Main Body:"
              onImageSelect={setIntroToBodyImage}
              previewAltText="Intro to Body Image Preview"
            />

            <ImageUpload
              label="Image Between Main Body and Conclusion:"
              onImageSelect={setBodyToConclusionImage}
              previewAltText="Body to Conclusion Image Preview"
            />
          </div>




          <div>
            <label htmlFor="tags">Tags (comma-separated):</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <button type="submit">Create Article</button>
        </form>
        
      </div>

      <div className="article-preview-container">
        {generateArticlePreview({
          title,
          titleImage,
          introToBodyImage,
          bodyToConclusionImage,
          editorContent,
          sectionHeaders,
        })}
      </div>
    </div>
  );
};

export default ArticleCreate;