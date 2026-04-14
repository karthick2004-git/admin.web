const ApiClientPrivate = async (url, options = {}) => {
  const token = localStorage.getItem('admin_token');
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_logged_in');
      window.location.reload();
      throw new Error('Session expired. Please login again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`Private API Error (${url}):`, error.message);
    throw error;
  }
};

export default ApiClientPrivate;
