export const refreshAccessToken = async () => {
  try {
    const response = await apiRequest('/api/refresh', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    return true; // Indicate that the token was successfully refreshed
  } catch (err) {
    console.error(err.message);
    return false; // Indicate that the token refresh failed
  }
};

export const isLoggedIn = async () => {
  try {
    const response = await apiRequest('/api/me', {
      method: 'GET',
    });

    return response.ok; // Return true if the session is valid
  } catch (err) {
    console.error(err.message);
    return false; // Return false if the session is invalid
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

  // Do NOT redirect here; let the caller handle 401s
  return response;
};