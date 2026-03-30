/**
 * LearnFlow Authentication Helper
 * Handles login, signup, token management, and authenticated requests.
 */

const API_BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost:8080/api'
    : '/api';

const auth = {
    /**
     * Store authentication token
     * @param {string} token 
     */
    setToken(token) {
        localStorage.setItem('auth_token', token);
    },

    /**
     * Get stored authentication token
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('auth_token');
    },

    /**
     * Clear authentication token
     */
    logout() {
        localStorage.removeItem('auth_token');
        window.location.href = 'login.html';
    },

    /**
     * Sign up a new user
     * @param {string} fullName 
     * @param {string} email 
     * @param {string} password 
     */
    async signup(fullName, email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: fullName,
                    email: email,
                    password: password
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Signup failed');
            }

            return await response.json();
        } catch (err) {
            console.error('Signup Error:', err);
            throw err;
        }
    },

    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     */
    async login(email, password) {
        try {
            // OAuth2 expects form data for tokens
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch(`${API_BASE_URL}/auth/token`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            const data = await response.json();
            this.setToken(data.access_token);
            return data;
        } catch (err) {
            console.error('Login Error:', err);
            throw err;
        }
    },

    /**
     * Get current user profile
     */
    async getMe() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                this.logout();
                return null;
            }

            return await response.json();
        } catch (err) {
            console.error('Get User Error:', err);
            return null;
        }
    },

    /**
     * Helper for authenticated requests
     */
    async fetchWithAuth(endpoint, options = {}) {
        const token = this.getToken();
        const headers = {
            ...options.headers,
            'Authorization': token ? `Bearer ${token}` : ''
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401) {
            this.logout();
        }

        return response;
    }
};

window.auth = auth;
