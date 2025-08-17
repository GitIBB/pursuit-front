import { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import TextEditorArticles from '../utils/textEditorArticles';
import '../styles/ArticleCreate.css';
import '../styles/ArticlePreview.css';
import { apiRequest, isLoggedIn } from '../utils/auth';
import ImageUpload from './ImageUpload';
import { generateArticlePreview } from '../utils/generateArticlePreview';
import { uploadImage } from '../utils/uploadImage';


const ArticleCreate = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sectionHeaders, setSectionHeaders] = useState({
  introduction: 'Introduction',
  mainBody: 'Main Body',
  conclusion: 'Conclusion',
  });

  const [titleImage, setTitleImage] = useState(null);
  const [introToBodyImage, setIntroToBodyImage] = useState(null);
  const [bodyToConclusionImage, setBodyToConclusionImage] = useState(null);

  const textEditorRef = useRef(null);
  const [editorContent, setEditorContent] = useState({
    introduction: '',
    mainBody: '',
    conclusion: '',
  });
  
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {    
    isLoggedIn().then(result => {
      setLoggedIn(result);
      setAuthChecked(true);
    });
  }, []);

  useEffect(() => { // fetch categs
  apiRequest('/api/categories')
    .then(res => res.json())
    .then(data => setCategories(data))
    .catch(() => setCategories([]));
  }, []);

  if (!authChecked) return null;

  if (!loggedIn) return <Navigate to="/login" replace />;


  const handleContentChange = () => {
    if (textEditorRef.current) {
      const updatedContent = textEditorRef.current.getContent();
      setEditorContent(updatedContent); // dynamic update
    }
  };

  const handleHeaderChange = (section, value) => {
    setSectionHeaders((prevHeaders) => ({
      ...prevHeaders,
      [section]: value,
    }));
  };


  const handleSubmit = async (e) => { 
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      if (!await isLoggedIn()) {
        throw new Error('Not authenticated');
      }

      if (!selectedCategory) {
        throw new Error('Please select a category.');
      }

      // upload img / geturl (if file selected)
      const [titleImageUrl, introToBodyImageUrl, bodyToConclusionImageUrl] = await Promise.all([
        uploadImage(titleImage),
        uploadImage(introToBodyImage),
        uploadImage(bodyToConclusionImage),
      ]);

      const content = textEditorRef.current.getContent();
      const body = {
        headers: sectionHeaders,
        content: content,
        images: {
          titleImage: titleImageUrl,
          introToBodyImage: introToBodyImageUrl,
          bodyToConclusionImage: bodyToConclusionImageUrl,
        },
      };
      
      console.log('Selected category:', selectedCategory);
      
      const payload = {
        title,
        tags: tags.split(',').map((tag) => tag.trim()),
        article_body: body,
        image_url: titleImageUrl,
        category_id: selectedCategory,
      };

      const response = await apiRequest('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create article');
      }

    const data = await response.json();
    setSuccess(true);
    navigate(`/article/${data.id}`); // redirect
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="article-page-container">
      <div className="article-side-form-container">

        <form onSubmit={handleSubmit} className="article-side-form">
          <div className="form-group">
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

          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated):</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Article created successfully!</p>}

          <button type="submit">Create Article</button>

        </form>
        
      </div>

      <div className="article-main-editor">
        <TextEditorArticles ref={textEditorRef} onContentChange={handleContentChange}/>
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