const apiService = require('../../src/services/apiService');
const testData = require('../../src/data/testData');

/**
 * Integration Tests (Інтеграційні тести)
 * Перевірка взаємодії між різними частинами API
 */
describe('Integration Tests', () => {
  describe('User and Post Flow', () => {
    test('should create post successfully', async () => {
      // Створюємо пост
      const newPost = testData.validPost;
      const createResponse = await apiService.createPost(newPost);
      
      expect(createResponse.status).toBe(201);
      expect(createResponse.data).toHaveProperty('id');
      expect(createResponse.data.title).toBe(newPost.title);
      
      // Примітка: JSONPlaceholder не зберігає дані, тому GET після POST може повернути 404
      // Це нормальна поведінка для фейкового API
    });
    
    test('should create and update post', async () => {
      // Створюємо пост
      const newPost = testData.validPost;
      const createResponse = await apiService.createPost(newPost);
      expect(createResponse.status).toBe(201);
      const postId = createResponse.data.id;
      
      // Оновлюємо пост (використовуємо існуючий ID з JSONPlaceholder)
      const existingPostId = 1;
      const updatedData = testData.updatePost;
      const updateResponse = await apiService.updatePost(existingPostId, updatedData);
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.title).toBe(updatedData.title);
      
      // Видаляємо пост (використовуємо існуючий ID)
      const deleteResponse = await apiService.deletePost(existingPostId);
      expect(deleteResponse.status).toBe(200);
    });
  });
  
  describe('Multiple Users Flow', () => {
    test('should get multiple users and verify structure', async () => {
      const response = await apiService.getAllUsers();
      expect(response.status).toBe(200);
      
      const users = response.data;
      expect(users.length).toBeGreaterThan(0);
      
      // Перевіряємо структуру кожного користувача
      users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
      });
    });
  });
  
  describe('Petstore Swagger API Integration', () => {
    test('should get pets by status', async () => {
      // Отримуємо тварин зі статусом "available"
      const response = await apiService.getPetsByStatus('available');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Перевіряємо структуру першого елемента
      if (response.data.length > 0) {
        const pet = response.data[0];
        expect(pet).toHaveProperty('id');
        expect(pet).toHaveProperty('name');
        expect(pet).toHaveProperty('status');
      }
    });
    
    test('should get store inventory', async () => {
      // Отримуємо інвентар магазину
      const response = await apiService.getStoreInventory();
      expect(response.status).toBe(200);
      expect(typeof response.data).toBe('object');
    });
    
    test('should create and get pet', async () => {
      // Створюємо нову тварину
      const petData = testData.petstorePet;
      const createResponse = await apiService.createPet(petData);
      expect(createResponse.status).toBe(200);
      expect(createResponse.data).toHaveProperty('id');
      expect(createResponse.data.name).toBe(petData.name);
      
      const petId = createResponse.data.id;
      
      // Отримуємо створену тварину
      const getResponse = await apiService.getPetById(petId);
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.id).toBe(petId);
      expect(getResponse.data.name).toBe(petData.name);
    });
    
    test('should create and get order', async () => {
      // Створюємо нове замовлення
      const orderData = testData.petstoreOrder;
      const createResponse = await apiService.createOrder(orderData);
      expect(createResponse.status).toBe(200);
      expect(createResponse.data).toHaveProperty('id');
      expect(createResponse.data.status).toBe(orderData.status);
      
      const orderId = createResponse.data.id;
      
      // Отримуємо створене замовлення
      const getResponse = await apiService.getOrderById(orderId);
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.id).toBe(orderId);
    });
    
    test('should create and get user', async () => {
      // Створюємо нового користувача
      const userData = testData.petstoreUser;
      const createResponse = await apiService.createPetstoreUser(userData);
      expect(createResponse.status).toBe(200);
      
      // Отримуємо створеного користувача
      const getResponse = await apiService.getPetstoreUserByUsername(userData.username);
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.username).toBe(userData.username);
      expect(getResponse.data.email).toBe(userData.email);
    });
  });
});

