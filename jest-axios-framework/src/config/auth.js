require('dotenv').config();
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

/**
 * Authentication Configuration
 * Окремий файл конфігурації для аутентифікації та авторизації
 * 
 * Токен зберігається у файлі tests/token-storage.json для простоти та наочності
 * Використовується окремий файл щоб уникнути конфліктів з іншими тестами
 */

// Шлях до файлу з токеном
const ENV_FILE_PATH = path.join(__dirname, '../../tests/token-storage.json');

// Функція для читання token-storage.json
function readEnvFile() {
  try {
    const data = fs.readFileSync(ENV_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { baseUrl: 'https://reqres.in/api', token: null };
  }
}

// Функція для запису в token-storage.json
function writeEnvFile(data) {
  try {
    // Використовуємо writeFileSync для синхронного запису (блокуючий запис)
    const jsonData = JSON.stringify(data, null, 4);
    fs.writeFileSync(ENV_FILE_PATH, jsonData, 'utf8');
    
    // Перевіряємо що файл дійсно записався та містить правильні дані
    if (!fs.existsSync(ENV_FILE_PATH)) {
      throw new Error('File was not created after write');
    }
    
    // Перевіряємо що дані записалися правильно (опціонально, може бути повільно)
    try {
      const verifyData = fs.readFileSync(ENV_FILE_PATH, 'utf8');
      if (verifyData !== jsonData) {
        logger.warn('File content mismatch after write, but continuing...');
      }
    } catch (verifyError) {
      // Ігноруємо помилки перевірки, щоб не ламати основний функціонал
      logger.warn('Could not verify file content after write:', verifyError.message);
    }
  } catch (error) {
    logger.error('Помилка запису токена у файл:', error.message);
    // Не прокідаємо помилку, щоб не ламати тести, але логуємо
  }
}

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

  // Token storage - зберігає токен у файлі tests/token-storage.json
  // Це дозволяє бачити токен та використовувати його між запусками тестів
  tokenStorage: {
    /**
     * Зберегти токен у файл token-storage.json
     * @param {string} key - Ключ токена (наприклад, 'reqres')
     * @param {string} token - Токен для збереження
     * @param {number} expiresIn - Час дії в секундах (за замовчуванням 3600)
     */
    setToken(key, token, expiresIn = 3600) {
      const envData = readEnvFile();
      
      // Зберігаємо токен у файл
      envData.token = token;
      envData.tokenExpiresAt = Date.now() + (expiresIn * 1000);
      
      writeEnvFile(envData);
      
      // Також зберігаємо в пам'яті для швидкого доступу
      this.tokens = this.tokens || {};
      this.tokens[key] = {
        token,
        expiresAt: Date.now() + (expiresIn * 1000)
      };
    },
    
    /**
     * Отримати токен з файлу token-storage.json
     * @param {string} key - Ключ токена (для ReqRes API використовується 'reqres')
     * @returns {string|null} Токен або null якщо не знайдено або прострочений
     */
    getToken(key) {
      // Для простоти, токен у файлі зберігається для ключа 'reqres'
      // Якщо запитується інший ключ - повертаємо null
      if (key !== 'reqres') {
        // Перевіряємо тільки пам'ять для інших ключів
        const tokenData = this.tokens && this.tokens[key];
        if (!tokenData) return null;
        
        if (Date.now() > tokenData.expiresAt) {
          delete this.tokens[key];
          return null;
        }
        
        return tokenData.token;
      }
      
      // Для ключа 'reqres' читаємо з файлу token-storage.json
      const envData = readEnvFile();
      
      if (envData.token) {
        // Перевіряємо термін дії
        if (envData.tokenExpiresAt && Date.now() > envData.tokenExpiresAt) {
          // Токен прострочений - не видаляємо з файлу, просто повертаємо null
          // Файл залишається для перевірки студентами
          return null;
        }
        
        // Оновлюємо в пам'яті
        this.tokens = this.tokens || {};
        this.tokens[key] = {
          token: envData.token,
          expiresAt: envData.tokenExpiresAt || Date.now() + 3600000
        };
        
        return envData.token;
      }
      
      // Якщо в файлі немає, перевіряємо пам'ять
      const tokenData = this.tokens && this.tokens[key];
      if (!tokenData) return null;
      
      if (Date.now() > tokenData.expiresAt) {
        delete this.tokens[key];
        return null;
      }
      
      return tokenData.token;
    },
    
    /**
     * Очистити токен з файлу та пам'яті
     * @param {string} key - Ключ токена
     */
    clearToken(key) {
      const envData = readEnvFile();
      envData.token = null;
      envData.tokenExpiresAt = null;
      writeEnvFile(envData);
      
      if (this.tokens) {
        delete this.tokens[key];
      }
    },
    
    /**
     * Очистити всі токени
     */
    clearAll() {
      const envData = readEnvFile();
      envData.token = null;
      envData.tokenExpiresAt = null;
      writeEnvFile(envData);
      
      this.tokens = {};
    }
  }
};

module.exports = authConfig;

