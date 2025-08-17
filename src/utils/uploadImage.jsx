import { apiRequest } from "./auth";

/**
 * uploads an image file to the backend and returns the image URL.
 * @param {File} file
 * @returns {Promise<string|null>} - the URL of the uploaded image, or null if no file.
 * @throws {Error} 
 */

export const uploadImage = async (file) => {
  if (!file) return null;
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiRequest('/api/uploads', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Image upload failed');
  const data = await response.json();
  return data.url;
};