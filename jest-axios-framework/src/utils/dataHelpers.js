const fakerGenerator = require('../data/fakerGenerator');

/**
 * Data Helpers
 * Утиліти для роботи з тестовими даними та Faker
 */

/**
 * Очищення об'єкта від undefined значень
 * @param {object} obj - Об'єкт для очищення
 * @returns {object} Очищений об'єкт
 */
function cleanObject(obj) {
  const cleaned = {};
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && !(obj[key] instanceof Date)) {
        cleaned[key] = cleanObject(obj[key]);
      } else {
        cleaned[key] = obj[key];
      }
    }
  }
  return cleaned;
}

/**
 * Мердж об'єктів з глибоким копіюванням
 * @param {object} target - Цільовий об'єкт
 * @param {...object} sources - Джерела для мерджу
 * @returns {object} Об'єднаний об'єкт
 */
function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * Перевірка чи є значення об'єктом
 * @param {*} item - Значення для перевірки
 * @returns {boolean}
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Генерація тестових даних з можливістю перевизначення
 * @param {string} type - Тип даних (user, post, comment, etc.)
 * @param {object} overrides - Перевизначення полів
 * @returns {object} Згенеровані дані
 */
function generateTestData(type, overrides = {}) {
  const generators = {
    user: () => fakerGenerator.generateUser(overrides),
    post: () => fakerGenerator.generatePost(overrides),
    comment: () => fakerGenerator.generateComment(overrides),
    reqresUser: () => fakerGenerator.generateReqResUser(overrides),
    reqresLogin: () => fakerGenerator.generateReqResLogin(overrides),
    pet: () => fakerGenerator.generatePet(overrides),
    petstoreUser: () => fakerGenerator.generatePetstoreUser(overrides),
    order: () => fakerGenerator.generateOrder(overrides)
  };

  const generator = generators[type];
  if (!generator) {
    throw new Error(`Unknown data type: ${type}. Available types: ${Object.keys(generators).join(', ')}`);
  }

  return generator();
}

/**
 * Генерація масиву тестових даних
 * @param {string} type - Тип даних
 * @param {number} count - Кількість елементів
 * @param {object} overrides - Перевизначення полів (застосовується до всіх елементів)
 * @returns {Array} Масив згенерованих даних
 */
function generateTestDataArray(type, count = 5, overrides = {}) {
  return Array.from({ length: count }, () => generateTestData(type, overrides));
}

/**
 * Валідація обов'язкових полів
 * @param {object} data - Дані для валідації
 * @param {Array<string>} requiredFields - Масив обов'язкових полів
 * @returns {object} Результат валідації { valid: boolean, missing: Array<string> }
 */
function validateRequiredFields(data, requiredFields) {
  const missing = requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Генерація випадкового числа в діапазоні
 * @param {number} min - Мінімальне значення
 * @param {number} max - Максимальне значення
 * @returns {number} Випадкове число
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Генерація випадкового елемента з масиву
 * @param {Array} array - Масив для вибору
 * @returns {*} Випадковий елемент
 */
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Генерація унікального ID на основі timestamp
 * @returns {number} Унікальний ID
 */
function generateUniqueId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

module.exports = {
  cleanObject,
  deepMerge,
  isObject,
  generateTestData,
  generateTestDataArray,
  validateRequiredFields,
  randomInt,
  randomElement,
  generateUniqueId
};

