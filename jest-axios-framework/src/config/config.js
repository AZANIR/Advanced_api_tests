require('dotenv').config();

/**
 * Конфігурація проекту
 * Зберігає всі налаштування для роботи з API
 */
const config = {
  // Base URL для основного API
  baseURL: process.env.BASE_URL || 'https://jsonplaceholder.typicode.com',
  
  // Base URL для ReqRes API
  reqresBaseURL: process.env.REQRES_BASE_URL || 'https://reqres.in/api',
  
  // Base URL для Petstore Swagger API
  petstoreBaseURL: process.env.PETSTORE_BASE_URL || 'https://petstore.swagger.io/v2',
  
  // Timeout для HTTP запитів (в мілісекундах)
  timeout: parseInt(process.env.REQUEST_TIMEOUT) || 10000,
  
  // API Key (якщо потрібно)
  apiKey: process.env.API_KEY || '',
  
  // Environment (dev, staging, prod)
  environment: process.env.ENVIRONMENT || 'dev',
  
  // Заголовки за замовчуванням
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  }
};

// Додаємо API Key до заголовків, якщо він вказаний
if (config.apiKey) {
  config.defaultHeaders['Authorization'] = `Bearer ${config.apiKey}`;
}

module.exports = config;

