export const refreshAccessToken = async () => {
  try {
    const response = await apiRequest('/api/refresh', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    return true;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

export const isLoggedIn = async () => {
  try {
    const response = await apiRequest('/api/me', {
      method: 'GET',
    });

    return response.ok;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
  };

  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  const mergedOptions = { ...defaultOptions, ...options };
  const response = await fetch(fullUrl, mergedOptions);

  // do NOT redirect here; let the caller handle 401s
  return response;
};