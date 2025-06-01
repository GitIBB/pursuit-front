import { apiRequest } from "./auth";

/**
 * Uploads an image file to the backend and returns the image URL.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string|null>} - The URL of the uploaded image, or null if no file.
 * @throws {Error} - If the upload fails.
 */

export const uploadImage = async (file) => {
  if (!file) return null;
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiRequest('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Image upload failed');
  const data = await response.json();
  return data.url; // The backend should return { url: "..." }
};