const axios = require('axios');
const config = require('../config/config');
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

// Request interceptor - логування вихідних запитів
httpClient.interceptors.request.use(
  (request) => {
    logger.request(request.method, request.url, request.data);
    return request;
  },
  (error) => {
    logger.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - логування відповідей
httpClient.interceptors.response.use(
  (response) => {
    logger.response(response.status, response.data);
    return response;
  },
  (error) => {
    // Логування помилок відповіді
    if (error.response) {
      // Сервер повернув помилку
      const errorData = error.response.data || {};
      logger.error(
        `Response error: ${error.response.status} ${error.response.statusText}`,
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

