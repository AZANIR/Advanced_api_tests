/**
 * Утиліта для логування
 * Забезпечує структуроване логування для тестів та HTTP запитів
 */

const logger = {
  /**
   * Логування інформації
   * @param {string} message - Повідомлення
   * @param {object} data - Додаткові дані (опціонально)
   */
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] [${timestamp}] ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  },
  
  /**
   * Логування помилок
   * @param {string} message - Повідомлення про помилку
   * @param {Error|object} error - Об'єкт помилки або дані (опціонально)
   */
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] [${timestamp}] ${message}`);
    if (error) {
      // Якщо це Error об'єкт
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        if (error.stack) {
          console.error('Stack trace:', error.stack);
        }
      } else if (typeof error === 'object') {
        // Якщо це об'єкт (наприклад, { stack: '...' })
        try {
          // Спробуємо серіалізувати як JSON, але обмежуємо глибину
          const safeError = JSON.stringify(error, (key, value) => {
            // Пропускаємо circular references
            if (key === 'req' || key === 'res' || key === 'config' || key === 'request' || key === 'response') {
              return '[Circular]';
            }
            return value;
          }, 2);
          console.error('Error data:', safeError);
        } catch (e) {
          // Якщо не вдається серіалізувати (circular reference або інша помилка)
          console.error('Error data (cannot serialize):', 'Complex object with circular references');
        }
      } else if (typeof error === 'string') {
        // Якщо це рядок
        const truncated = error.length > 500 ? error.substring(0, 500) + '...' : error;
        console.error('Error data (string):', truncated);
      }
    }
  },
  
  /**
   * Логування HTTP запитів
   * @param {string} method - HTTP метод
   * @param {string} url - URL запиту
   * @param {object} data - Дані запиту (опціонально)
   */
  request: (method, url, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[REQUEST] [${timestamp}] ${method.toUpperCase()} ${url}`);
    if (data) {
      console.log('Request data:', JSON.stringify(data, null, 2));
    }
  },
  
  /**
   * Логування HTTP відповідей
   * @param {number} status - Статус код
   * @param {object} data - Дані відповіді (опціонально)
   */
  response: (status, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[RESPONSE] [${timestamp}] Status: ${status}`);
    if (data) {
      console.log('Response data:', JSON.stringify(data, null, 2));
    }
  },
  
  /**
   * Логування попереджень
   * @param {string} message - Повідомлення
   */
  warn: (message) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] [${timestamp}] ${message}`);
  }
};

module.exports = logger;

