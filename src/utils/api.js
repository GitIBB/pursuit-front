import { apiRequest } from './auth.js';

export const fetchArticle = async (id) => {
  if (!id) throw new Error('Article ID is required');
  const response = await apiRequest(`/api/articles/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }
  return await response.json();
};

export const fetchArticles = async (limit = 12, offset = 0) => {
  const response = await apiRequest(`/api/articles?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error('Failed to fetch articles');
  const data = await response.json();
  return data.articles;
};

export async function fetchCategories() {
  const response = await apiRequest('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};
