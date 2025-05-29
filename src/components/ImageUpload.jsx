import React, { useState, useRef } from 'react';
import '../styles/ImageUpload.css';

const ImageUpload = ({ label, onImageSelect, previewAltText = 'Image Preview', accept = 'image/*' }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Generate a preview URL
      onImageSelect(file); // Pass the selected file to the parent component
    }
  };

  const handleRemoveImage = () => {
    setPreview(null); // Clear the preview
    onImageSelect(null); // Reset the selected file in the parent component
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input field
    }
  };

  return (
    <div className="image-upload-container">
      <label>{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={handleImageChange}
        ref={fileInputRef} // Attach the ref to the file input
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