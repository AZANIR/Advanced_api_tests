const apiService = require('../../src/services/apiService');
const validators = require('../../src/utils/validators');

/**
 * Functional Tests - GET методи
 * Перевірка функціональності отримання даних
 */
describe('Functional Tests - GET', () => {
  describe('GET /users', () => {
    test('should return all users', async () => {
      const response = await apiService.getAllUsers();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
    
    test('should return users with correct structure', async () => {
      const response = await apiService.getAllUsers();
      const users = response.data;
      
      // Перевіряємо структуру першого користувача
      if (users.length > 0) {
        const user = users[0];
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('username');
      }
    });
  });
  
  describe('GET /users/:id', () => {
    test('should return user by id', async () => {
      const userId = 1;
      const response = await apiService.getUserById(userId);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(userId);
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('email');
    });
    
    test('should return user with all required fields', async () => {
      const userId = 1;
      const response = await apiService.getUserById(userId);
      const user = response.data;
      
      const requiredFields = ['id', 'name', 'email', 'username'];
      expect(validators.hasRequiredFields(user, requiredFields)).toBe(true);
    });
    
    test('should return correct data types', async () => {
      const userId = 1;
      const response = await apiService.getUserById(userId);
      const user = response.data;
      
      expect(validators.validateType(user.id, 'number')).toBe(true);
      expect(validators.validateType(user.name, 'string')).toBe(true);
      expect(validators.validateType(user.email, 'string')).toBe(true);
    });
  });
  
  describe('GET /posts', () => {
    test('should return all posts', async () => {
      const response = await apiService.getAllPosts();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
    
    test('should return posts with correct structure', async () => {
      const response = await apiService.getAllPosts();
      const posts = response.data;
      
      if (posts.length > 0) {
        const post = posts[0];
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('body');
        expect(post).toHaveProperty('userId');
      }
    });
  });
  
  describe('GET /posts/:id', () => {
    test('should return post by id', async () => {
      const postId = 1;
      const response = await apiService.getPostById(postId);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(postId);
      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('body');
    });
  });
});

