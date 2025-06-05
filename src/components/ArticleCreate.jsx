import { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import TextEditor from '../utils/textEditor'; // Import the standalone editor
import '../styles/ArticleCreate.css';
import '../styles/ArticlePreview.css';
import { apiRequest, isLoggedIn } from '../utils/auth';
import ImageUpload from './ImageUpload'; // Import the ImageUpload component
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

  useEffect(() => {    // Check if the user is logged in before accessing article creation
    isLoggedIn().then(result => {
      setLoggedIn(result);
      setAuthChecked(true);
    });
  }, []);

  useEffect(() => { // Fetch categories from the API when the component mounts
  apiRequest('/api/categories')
    .then(res => res.json())
    .then(data => setCategories(data))
    .catch(() => setCategories([]));
  }, []);

  if (!authChecked) return null; // Wait until authentication check is complete

  if (!loggedIn) return <Navigate to="/login" replace />; // Redirect to login if not authenticated


  const handleContentChange = () => { // This function will be called whenever the content in the text editor changes
    if (textEditorRef.current) {
      const updatedContent = textEditorRef.current.getContent();
      setEditorContent(updatedContent); // Dynamically update the editor content
    }
  };

  const handleHeaderChange = (section, value) => { // This function updates the section headers dynamically
    setSectionHeaders((prevHeaders) => ({
      ...prevHeaders,
      [section]: value,
    }));
  };


  const handleSubmit = async (e) => { // Handle the form submission for article creation
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


      // Upload images and get URLs (only if a file is selected)
      const [titleImageUrl, introToBodyImageUrl, bodyToConclusionImageUrl] = await Promise.all([
        uploadImage(titleImage),
        uploadImage(introToBodyImage),
        uploadImage(bodyToConclusionImage),
      ]);

      // Get content from editor
      const content = textEditorRef.current.getContent();

      // Build the body object
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
      
      // Build the payload
      const payload = {
        title,
        tags: tags.split(',').map((tag) => tag.trim()),
        article_body: body,
        image_url: titleImageUrl, // Use the title image URL as the main image
        category_id: selectedCategory,
      };

      const response = await apiRequest('/api/articles', { // Make the API request to create the article
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) { // Check if the response is OK
        throw new Error('Failed to create article');
      }

    const data = await response.json(); // Parse the response data
    setSuccess(true);
    localStorage.removeItem('articleDraft'); // Clear the draft from local storage
    navigate(`/article/${data.id}`); // Redirect to the newly created article page
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
        <TextEditor ref={textEditorRef} onContentChange={handleContentChange}/>
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