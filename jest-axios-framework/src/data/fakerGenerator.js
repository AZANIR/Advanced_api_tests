const { faker } = require('@faker-js/faker');

/**
 * Faker Data Generator
 * Генератор динамічних тестових даних за допомогою Faker
 * Підтримує seed для відтворюваності результатів
 */

class FakerGenerator {
  constructor(seed = null) {
    if (seed !== null) {
      faker.seed(seed);
    }
  }

  /**
   * Генерація даних користувача
   * @param {object} overrides - Перевизначення полів
   * @returns {object} Об'єкт з даними користувача
   */
  generateUser(overrides = {}) {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      phone: faker.phone.number(),
      website: faker.internet.url(),
      address: {
        street: faker.location.streetAddress(),
        suite: faker.location.secondaryAddress(),
        city: faker.location.city(),
        zipcode: faker.location.zipCode(),
        geo: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude()
        }
      },
      company: {
        name: faker.company.name(),
        catchPhrase: faker.company.catchPhrase(),
        bs: faker.company.buzzPhrase()
      },
      ...overrides
    };
  }

  /**
   * Генерація даних поста
   * @param {object} overrides - Перевизначення полів
   * @returns {object} Об'єкт з даними поста
   */
  generatePost(overrides = {}) {
    return {
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(3),
      userId: faker.number.int({ min: 1, max: 10 }),
      ...overrides
    };
  }

  /**
   * Генерація даних коментаря
   * @param {object} overrides - Перевизначення полів
   * @returns {object} Об'єкт з даними коментаря
   */
  generateComment(overrides = {}) {
    return {
      postId: faker.number.int({ min: 1, max: 100 }),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      body: faker.lorem.paragraph(),
      ...overrides
    };
  }

  /**
   * Генерація даних для ReqRes API
   * @param {object} overrides - Перевизначення полів
   * @returns {object} Об'єкт з даними користувача ReqRes
   */
  generateReqResUser(overrides = {}) {
    return {
      name: faker.person.firstName(),
      job: faker.person.jobTitle(),
      ...overrides
    };
  }

  /**
   * Генерація даних для логіну ReqRes
   * @param {object} overrides - Перевизначення полів
   * @returns {object} Об'єкт з даними логіну
   */
  generateReqResLogin(overrides = {}) {
    return {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
      ...overrides
    };
  }

  /**
   * Генерація даних для Petstore Pet
   * @param {object} overrides - Перевизначення полів
   * @returns {object} Об'єкт з даними тварини
   */
  generatePet(overrides = {}) {
    const statuses = ['available', 'pending', 'sold'];
    return {
      id: faker.number.int({ min: 1, max: 1000000 }),
      category: {
        id: faker.number.int({ min: 1, max: 10 }),
        name: faker.animal.type()
      },
      name: faker.animal.dog(),
      photoUrls: [
        faker.image.url(),
        faker.image.url()
      ],
      tags: [
        {
          id: faker.number.int({ min: 1, max: 10 }),
          name: faker.word.adjective()
        }
      ],
      status: faker.helpers.arrayElement(statuses),
      ...overrides
    };
  }

  /**
   * Генерація даних для Petstore User
   * @param {object} overrides - Перевизначення полів
   * @returns {object} Об'єкт з даними користувача Petstore
   */
  generatePetstoreUser(overrides = {}) {
    return {
      id: faker.number.int({ min: 1, max: 1000000 }),
      username: faker.internet.userName(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
      phone: faker.phone.number(),
      userStatus: faker.number.int({ min: 0, max: 1 }),
      ...overrides
    };
  }

  /**
   * Генерація даних для замовлення Petstore
   * @param {object} overrides - Перевизначення полів
   * @returns {object} Об'єкт з даними замовлення
   */
  generateOrder(overrides = {}) {
    return {
      id: faker.number.int({ min: 1, max: 1000000 }),
      petId: faker.number.int({ min: 1, max: 100 }),
      quantity: faker.number.int({ min: 1, max: 10 }),
      shipDate: faker.date.future().toISOString(),
      status: faker.helpers.arrayElement(['placed', 'approved', 'delivered']),
      complete: faker.datatype.boolean(),
      ...overrides
    };
  }

  /**
   * Генерація масиву даних
   * @param {Function} generator - Функція генерації одного елемента
   * @param {number} count - Кількість елементів
   * @returns {Array} Масив згенерованих даних
   */
  generateArray(generator, count = 5) {
    return Array.from({ length: count }, () => generator());
  }

  /**
   * Встановлення seed для відтворюваності
   * @param {number} seed - Значення seed
   */
  setSeed(seed) {
    faker.seed(seed);
  }

  /**
   * Генерація унікального email з timestamp
   * @returns {string} Унікальний email
   */
  generateUniqueEmail() {
    const timestamp = Date.now();
    const random = faker.number.int({ min: 1000, max: 9999 });
    return `test-${timestamp}-${random}@${faker.internet.domainName()}`;
  }

  /**
   * Генерація унікального username
   * @returns {string} Унікальний username
   */
  generateUniqueUsername() {
    const timestamp = Date.now();
    const random = faker.string.alphanumeric(4);
    return `user_${timestamp}_${random}`;
  }
}

// Експортуємо singleton instance
module.exports = new FakerGenerator();

// Також експортуємо клас для можливості створення нових інстансів
module.exports.FakerGenerator = FakerGenerator;

