const apiService = require('../../src/services/apiService');
const config = require('../../src/config/config');

/**
 * Smoke Tests (Димові тести)
 * Швидкі тести для перевірки базової працездатності API
 */
describe('Smoke Tests', () => {
  // Перевірка доступності API
  test('API should be accessible', async () => {
    const response = await apiService.getAllUsers();
    expect(response.status).toBe(200);
  }, 5000);
  
  // Перевірка GET endpoints
  describe('GET Endpoints', () => {
    test('GET /users should return 200', async () => {
      const response = await apiService.getAllUsers();
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
    
    test('GET /users/:id should return user', async () => {
      const userId = 1;
      const response = await apiService.getUserById(userId);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('name');
    });
    
    test('GET /posts should return 200', async () => {
      const response = await apiService.getAllPosts();
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });
  
  // Перевірка POST endpoint
  describe('POST Endpoint', () => {
    test('POST /posts should create post', async () => {
      const newPost = {
        title: 'Test Post',
        body: 'Test Body',
        userId: 1
      };
      
      const response = await apiService.createPost(newPost);
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
    });
  });
});

