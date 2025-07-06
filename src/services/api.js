const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://memory-game-mo1k.onrender.com/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token in localStorage
  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token from localStorage
  removeToken() {
    localStorage.removeItem('authToken');
  }

  // Get headers with auth token
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response.data;
  }

  async register(email, password) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response.data;
  }

  async getCurrentUser() {
    const response = await this.request('/auth/me');
    return response.data.user;
  }

  logout() {
    this.removeToken();
  }

  // Score methods
  async saveScore(score, level, moves, misses) {
    const response = await this.request('/scores', {
      method: 'POST',
      body: JSON.stringify({ score, level, moves, misses }),
    });
    return response.data;
  }

  async getLeaderboard(level = 'all', limit = 50) {
    const response = await this.request(`/scores/leaderboard?level=${level}&limit=${limit}`);
    return response.data;
  }

  async getUserScores() {
    const response = await this.request('/scores/user');
    return response.data;
  }

  async getUserBestScores() {
    const response = await this.request('/scores/user/best');
    return response.data;
  }

  // Health check
  async healthCheck() {
    return await this.request('/health');
  }
}

export default new ApiService(); 