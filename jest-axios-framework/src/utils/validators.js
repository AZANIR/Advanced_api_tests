/**
 * Утиліти для валідації
 * Забезпечує перевірку статус-кодів та структури даних
 */

const validators = {
  /**
   * Перевірка статус-коду
   * @param {number} actualStatus - Фактичний статус-код
   * @param {number} expectedStatus - Очікуваний статус-код
   * @returns {boolean} - true якщо статус-коди співпадають
   */
  validateStatus: (actualStatus, expectedStatus) => {
    return actualStatus === expectedStatus;
  },
  
  /**
   * Перевірка, що статус-код успішний (2xx)
   * @param {number} status - Статус-код
   * @returns {boolean} - true якщо статус-код успішний
   */
  isSuccessStatus: (status) => {
    return status >= 200 && status < 300;
  },
  
  /**
   * Перевірка, що статус-код помилка клієнта (4xx)
   * @param {number} status - Статус-код
   * @returns {boolean} - true якщо статус-код помилка клієнта
   */
  isClientError: (status) => {
    return status >= 400 && status < 500;
  },
  
  /**
   * Перевірка, що статус-код помилка сервера (5xx)
   * @param {number} status - Статус-код
   * @returns {boolean} - true якщо статус-код помилка сервера
   */
  isServerError: (status) => {
    return status >= 500 && status < 600;
  },
  
  /**
   * Перевірка наявності обов'язкових полів в об'єкті
   * @param {object} obj - Об'єкт для перевірки
   * @param {string[]} requiredFields - Масив обов'язкових полів
   * @returns {boolean} - true якщо всі поля присутні
   */
  hasRequiredFields: (obj, requiredFields) => {
    return requiredFields.every(field => obj.hasOwnProperty(field));
  },
  
  /**
   * Перевірка типу поля
   * @param {*} value - Значення для перевірки
   * @param {string} expectedType - Очікуваний тип ('string', 'number', 'object', 'array')
   * @returns {boolean} - true якщо тип співпадає
   */
  validateType: (value, expectedType) => {
    if (expectedType === 'array') {
      return Array.isArray(value);
    }
    return typeof value === expectedType;
  },
  
  /**
   * Перевірка формату email
   * @param {string} email - Email для перевірки
   * @returns {boolean} - true якщо email валідний
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  /**
   * Перевірка, що масив не порожній
   * @param {Array} array - Масив для перевірки
   * @returns {boolean} - true якщо масив не порожній
   */
  isNonEmptyArray: (array) => {
    return Array.isArray(array) && array.length > 0;
  },
  
  /**
   * Перевірка, що об'єкт не порожній
   * @param {object} obj - Об'єкт для перевірки
   * @returns {boolean} - true якщо об'єкт не порожній
   */
  isNonEmptyObject: (obj) => {
    return typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0;
  }
};

module.exports = validators;

