/**
 * Тестові дані
 * Централізоване зберігання тестових даних для використання в тестах
 */

const testData = {
  // Валідні дані для створення користувача
  validUser: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    phone: '123-456-7890',
    website: 'johndoe.com'
  },
  
  // Невалідні дані для негативних тестів
  invalidUser: {
    name: '', // порожнє ім'я
    email: 'invalid-email', // невалідний email
    username: null // null значення
  },
  
  // Дані для оновлення користувача
  updateUser: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    username: 'janedoe'
  },
  
  // Валідні дані для створення поста
  validPost: {
    title: 'Test Post Title',
    body: 'This is a test post body content',
    userId: 1
  },
  
  // Невалідні дані для поста
  invalidPost: {
    title: '', // порожній заголовок
    body: 'Test body',
    userId: 'not-a-number' // невалідний тип
  },
  
  // Дані для оновлення поста
  updatePost: {
    title: 'Updated Post Title',
    body: 'Updated post body content'
  },
  
  // Дані для ReqRes API
  reqresUser: {
    name: 'Test User',
    job: 'QA Engineer'
  },
  
  reqresLogin: {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
  },
  
  reqresRegister: {
    email: 'eve.holt@reqres.in',
    password: 'pistol'
  },
  
  // Дані для Petstore Swagger API
  petstorePet: {
    id: Math.floor(Math.random() * 1000000),
    category: {
      id: 1,
      name: 'Dogs'
    },
    name: 'Test Dog',
    photoUrls: ['https://example.com/dog.jpg'],
    tags: [
      {
        id: 1,
        name: 'friendly'
      }
    ],
    status: 'available'
  },
  
  petstoreUser: {
    id: Math.floor(Math.random() * 1000000),
    username: `testuser${Date.now()}`,
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'test123',
    phone: '123-456-7890',
    userStatus: 0
  },
  
  petstoreOrder: {
    id: Math.floor(Math.random() * 1000000),
    petId: 1,
    quantity: 1,
    shipDate: new Date().toISOString(),
    status: 'placed',
    complete: false
  },
  
  // Функція для генерації унікального email
  generateUniqueEmail: () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `test-${timestamp}-${random}@example.com`;
  },
  
  // Функція для генерації унікального імені
  generateUniqueName: () => {
    const timestamp = Date.now();
    return `Test User ${timestamp}`;
  }
};

module.exports = testData;

