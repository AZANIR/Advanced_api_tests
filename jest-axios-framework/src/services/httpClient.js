const axios = require('axios');
const config = require('../config/config');
const authConfig = require('../config/auth');
const logger = require('../utils/logger');

/**
 * HTTP клієнт на базі Axios
 * Надає налаштований Axios instance з interceptors для логування та обробки помилок
 */
const httpClient = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: config.defaultHeaders
});

// Request interceptor - логування вихідних запитів та автоматичне додавання токена
httpClient.interceptors.request.use(
  async (request) => {
    // Автоматичне додавання токена для ReqRes API запитів
    const requestUrl = request.url || '';
    const isReqResRequest = requestUrl.includes(config.reqresBaseURL) || 
                           requestUrl.includes('reqres.in');
    
    if (isReqResRequest) {
      let token = authConfig.tokenStorage.getToken('reqres');
      
      // Якщо токен відсутній або прострочений - автоматично логінуємося
      if (!token) {
        logger.info('Token not found or expired, attempting automatic login...');
        try {
          // Використовуємо apiService напряму щоб уникнути circular dependency
          const credentials = authConfig.reqres.validCredentials;
          const loginResponse = await axios.post(
            `${config.reqresBaseURL}/login`,
            credentials,
            { timeout: authConfig.timeout }
          );
          
          if (loginResponse.data && loginResponse.data.token) {
            authConfig.tokenStorage.setToken('reqres', loginResponse.data.token);
            token = loginResponse.data.token;
            logger.info('Automatic login successful, token refreshed');
          }
        } catch (error) {
          logger.warn('Automatic login failed:', error.message);
          // Продовжуємо без токена - можливо запит не потребує авторизації
        }
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

// Response interceptor - логування відповідей та автоматичне оновлення токена при 401
httpClient.interceptors.response.use(
  (response) => {
    logger.response(response.status, response.data);
    return response;
  },
  async (error) => {
    // Логування помилок відповіді
    if (error.response) {
      const status = error.response.status;
      const requestUrl = error.config?.url || '';
      const isReqResRequest = requestUrl.includes(config.reqresBaseURL) || 
                             requestUrl.includes('reqres.in');
      
      // Якщо отримали 401 (Unauthorized) для ReqRes API - спробуємо оновити токен
      if (status === 401 && isReqResRequest && !error.config._retry) {
        logger.warn('Received 401 Unauthorized, attempting to refresh token...');
        
        try {
          // Позначаємо що вже намагалися оновити токен (щоб уникнути циклу)
          error.config._retry = true;
          
          // Виконуємо автоматичний логін напряму через axios
          const credentials = authConfig.reqres.validCredentials;
          const loginResponse = await axios.post(
            `${config.reqresBaseURL}/login`,
            credentials,
            { timeout: authConfig.timeout }
          );
          
          if (loginResponse.data && loginResponse.data.token) {
            authConfig.tokenStorage.setToken('reqres', loginResponse.data.token);
            const newToken = loginResponse.data.token;
            
            logger.info('Token refreshed successfully, retrying request...');
            
            // Оновлюємо заголовок з новим токеном
            error.config.headers = error.config.headers || {};
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
            
            // Повторюємо оригінальний запит з новим токеном
            return httpClient.request(error.config);
          }
        } catch (loginError) {
          logger.error('Failed to refresh token:', loginError.message);
        }
      }
      
      // Сервер повернув помилку
      const errorData = error.response.data || {};
      logger.error(
        `Response error: ${status} ${error.response.statusText}`,
        errorData
      );
    } else if (error.request) {
      // Запит був зроблений, але відповіді не отримано
      logger.error('No response received:', error.message || 'Network error');
    } else {
      // Помилка при налаштуванні запиту
      logger.error('Request setup error:', error.message || 'Unknown error');
    }
    return Promise.reject(error);
  }
);

module.exports = httpClient;

