import { useState, useRef } from 'react';
import '../styles/ImageUpload.css';

// functional component for image upload with preview and removal functionality
// this component allows users to upload an image, preview it, and remove it if needed.
// intended to be used in ArticleCreate, but will likely be reused in other components as well.
const ImageUpload = ({ label, onImageSelect, previewAltText = 'Image Preview', accept = 'image/*' }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageSelect(file); 
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelect(null); 
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <label>{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={handleImageChange}
        ref={fileInputRef}
      />
      {preview && (
        <div className="image-preview-container">
          <div className="image-preview-wrapper">
            <img src={preview} alt={previewAltText} className="image-preview" />
            <button type="button" className="remove-image-button" onClick={handleRemoveImage}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;