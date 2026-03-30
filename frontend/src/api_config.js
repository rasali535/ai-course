/**
 * Centralized API configuration
 * This ensures we only need to update the API base URL in one place
 */

export const API_BASE = (process.env.REACT_APP_API_URL || 
  (['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname) ? 'http://localhost:8082' : window.location.origin)).replace(/\/$/, '');

export default API_BASE;
