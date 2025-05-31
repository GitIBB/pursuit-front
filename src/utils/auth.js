export const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/refresh`, {
      method: 'POST',
      credentials: 'include', // Include cookies in the request
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

export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    credentials: 'include', // Include cookies in the request
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const response = await fetch(url, mergedOptions);

  if (response.status === 401) {
    // If the session is invalid or expired, redirect to login
    window.location.href = '/login';
    return response;
  }

  return response;
};

export const isLoggedIn = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/me`, {
      method: 'GET',
    });

    return response.ok; // Return true if the session is valid
  } catch (err) {
    console.error(err.message);
    return false; // Return false if the session is invalid
  }
};