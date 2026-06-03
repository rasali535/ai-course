/**
 * Centralized API configuration
 * This ensures we only need to update the API base URL in one place
 */

export const API_BASE = (process.env.REACT_APP_API_URL || 
  (['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname) ? 'http://localhost:8000' : 'https://ai-course-e97p.onrender.com')).replace(/\/$/, '');

export default API_BASE;
