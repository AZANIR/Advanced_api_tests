require('dotenv').config();

/**
 * Authentication Configuration
 * Окремий файл конфігурації для аутентифікації та авторизації
 */

const authConfig = {
  // ReqRes API credentials
  reqres: {
    baseURL: process.env.REQRES_BASE_URL || 'https://reqres.in/api',
    validCredentials: {
      email: process.env.REQRES_EMAIL || 'eve.holt@reqres.in',
      password: process.env.REQRES_PASSWORD || 'cityslicka'
    },
    invalidCredentials: {
      email: 'invalid@reqres.in',
      password: 'invalid'
    }
  },

  // Petstore API credentials
  petstore: {
    baseURL: process.env.PETSTORE_BASE_URL || 'https://petstore.swagger.io/v2',
    apiKey: process.env.PETSTORE_API_KEY || '',
    username: process.env.PETSTORE_USERNAME || 'testuser',
    password: process.env.PETSTORE_PASSWORD || 'testpass'
  },

  // Generic auth settings
  timeout: parseInt(process.env.AUTH_TIMEOUT) || 5000,
  retryAttempts: parseInt(process.env.AUTH_RETRY_ATTEMPTS) || 3,
  retryDelay: parseInt(process.env.AUTH_RETRY_DELAY) || 1000,

  // Token storage (in-memory, для тестів)
  tokenStorage: {
    tokens: {},
    
    setToken(key, token, expiresIn = 3600) {
      this.tokens[key] = {
        token,
        expiresAt: Date.now() + (expiresIn * 1000)
      };
    },
    
    getToken(key) {
      const tokenData = this.tokens[key];
      if (!tokenData) return null;
      
      if (Date.now() > tokenData.expiresAt) {
        delete this.tokens[key];
        return null;
      }
      
      return tokenData.token;
    },
    
    clearToken(key) {
      delete this.tokens[key];
    },
    
    clearAll() {
      this.tokens = {};
    }
  }
};

module.exports = authConfig;

