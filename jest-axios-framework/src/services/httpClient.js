const axios = require('axios');
const config = require('../config/config');
const authConfig = require('../config/auth');
const logger = require('../utils/logger');
const AuthService = require('./authService');

/**
 * HTTP Client based on Axios
 * Provides configured Axios instance with interceptors for logging and error handling
 */
const httpClient = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: config.defaultHeaders
});

// Request interceptor - logging outgoing requests and automatic token injection
httpClient.interceptors.request.use(
  async (request) => {
    const requestUrl = request.url || '';
    
    // Automatic token injection for ReqRes API requests
    if (AuthService.isReqResRequest(requestUrl)) {
      let token = authConfig.tokenStorage.getToken('reqres');
      
      // If token is missing or expired - perform automatic login
      if (!token) {
        token = await AuthService.performAutoLogin();
      }
      
      if (token) {
        request.headers = request.headers || {};
        request.headers['Authorization'] = `Bearer ${token}`;
        logger.info(`Token automatically added to request: ${requestUrl}`);
      }
    }
    
    logger.request(request.method, request.url, request.data);
    return request;
  },
  (error) => {
    logger.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - logging responses and automatic token refresh on 401
httpClient.interceptors.response.use(
  (response) => {
    logger.response(response.status, response.data);
    return response;
  },
  async (error) => {
    // Logging response errors
    if (error.response) {
      const status = error.response.status;
      const requestUrl = error.config?.url || '';
      
      // If we received 401 (Unauthorized) for ReqRes API - try to refresh token
      if (status === 401 && AuthService.isReqResRequest(requestUrl) && !error.config._retry) {
        logger.warn('Received 401 Unauthorized, attempting to refresh token...');
        
        // Mark that we already tried to refresh token (to avoid infinite loop)
        error.config._retry = true;
        
        // Perform automatic login to get new token
        const newToken = await AuthService.performAutoLogin();
        
        if (newToken) {
          logger.info('Token refreshed successfully, retrying request...');
          
          // Update header with new token
          error.config.headers = error.config.headers || {};
          error.config.headers['Authorization'] = `Bearer ${newToken}`;
          
          // Retry original request with new token
          return httpClient.request(error.config);
        }
      }
      
      // Server returned error
      const errorData = error.response.data || {};
      logger.error(
        `Response error: ${status} ${error.response.statusText}`,
        errorData
      );
    } else if (error.request) {
      // Request was made but no response received
      logger.error('No response received:', error.message || 'Network error');
    } else {
      // Error setting up request
      logger.error('Request setup error:', error.message || 'Unknown error');
    }
    return Promise.reject(error);
  }
);

module.exports = httpClient;

