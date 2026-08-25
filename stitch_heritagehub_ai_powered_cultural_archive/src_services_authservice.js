/**
 * Authentication Service
 * Handles JWT authentication with the Django REST backend.
 */
import api from './api';

const authService = {
  /**
   * Logs in a user and stores tokens.
   * POST /api/accounts/login/
   */
  login: async (username, password) => {
    try {
      const response = await api.post('/accounts/login/', { username, password });
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Registers a new user.
   * POST /api/accounts/register/
   */
  register: async (userData) => {
    try {
      const response = await api.post('/accounts/register/', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Refreshes the access token using the refresh token.
   * POST /api/accounts/login/refresh/
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await api.post('/accounts/login/refresh/', { refresh: refreshToken });
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
      }
      return response.data;
    } catch (error) {
      authService.logout();
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  },

  getAccessToken: () => localStorage.getItem('access_token'),
};

export default authService;
