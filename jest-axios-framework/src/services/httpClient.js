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
    // Get full URL (handle both relative and absolute URLs)
    const requestUrl = request.url || '';
    const baseURL = request.baseURL || config.baseURL;
    const fullUrl = requestUrl.startsWith('http') ? requestUrl : `${baseURL}${requestUrl}`;
    
    // Ensure browser-like headers are always present (helps bypass Cloudflare)
    request.headers = request.headers || {};
    if (!request.headers['User-Agent']) {
      request.headers['User-Agent'] = config.defaultHeaders['User-Agent'];
    }
    if (!request.headers['Accept-Language']) {
      request.headers['Accept-Language'] = config.defaultHeaders['Accept-Language'];
    }
    
    // Automatic token injection for ReqRes API requests
    if (AuthService.isReqResRequest(fullUrl)) {
      let token = authConfig.tokenStorage.getToken('reqres');
      
      // If token is missing or expired - perform automatic login
      if (!token) {
        token = await AuthService.performAutoLogin();
      }
      
      if (token) {
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
      const baseURL = error.config?.baseURL || config.baseURL;
      const fullUrl = requestUrl.startsWith('http') ? requestUrl : `${baseURL}${requestUrl}`;
      const responseData = error.response.data;
      
      // Check if this is a Cloudflare challenge (403 with HTML response)
      // Cloudflare challenge typically returns HTML with "Just a moment..." message
      const isCloudflareChallenge = status === 403 && 
        typeof responseData === 'string' && 
        (responseData.includes('Just a moment') || 
         responseData.includes('cf-browser-verification') ||
         responseData.includes('challenge-platform'));
      
      if (isCloudflareChallenge) {
        logger.warn('Cloudflare challenge detected. This may indicate bot protection blocking the request.');
        logger.warn('Request URL:', requestUrl);
        
        // For ReqRes API, we can try to add a delay and retry with better headers
        if (AuthService.isReqResRequest(fullUrl) && !error.config._cloudflareRetry) {
          error.config._cloudflareRetry = true;
          
          // Add a delay before retry (Cloudflare may need time)
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Ensure browser-like headers are present
          error.config.headers = error.config.headers || {};
          error.config.headers['User-Agent'] = config.defaultHeaders['User-Agent'];
          error.config.headers['Accept-Language'] = config.defaultHeaders['Accept-Language'];
          error.config.headers['Accept-Encoding'] = config.defaultHeaders['Accept-Encoding'];
          
          logger.info('Retrying request with enhanced headers after Cloudflare challenge...');
          return httpClient.request(error.config);
        }
      }
      
      // If we received 401 (Unauthorized) for ReqRes API - try to refresh token
      if (status === 401 && AuthService.isReqResRequest(fullUrl) && !error.config._retry) {
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
      
      // Don't log full HTML response from Cloudflare (it's too verbose)
      if (isCloudflareChallenge) {
        logger.error(
          `Response error: ${status} ${error.response.statusText} (Cloudflare challenge detected)`
        );
      } else {
        logger.error(
          `Response error: ${status} ${error.response.statusText}`,
          errorData
        );
      }
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

