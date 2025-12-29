const userController = require('../../src/controllers/userController');
const postController = require('../../src/controllers/postController');
const validators = require('../../src/utils/validators');

// Test constants
const TEST_USER_ID = 1;
const TEST_POST_ID = 1;

/**
 * Functional Tests - GET methods
 * Testing data retrieval functionality using controllers
 */
describe('Functional Tests - GET', () => {
  describe('GET /users', () => {
    test('should return all users', async () => {
      const response = await userController.getAllUsers();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
    
    test('should return users with correct structure', async () => {
      const response = await userController.getAllUsers();
      const users = response.data;
      
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
      const response = await userController.getUserById(TEST_USER_ID);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(TEST_USER_ID);
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('email');
    });
    
    test('should return user with all required fields', async () => {
      const response = await userController.getUserById(TEST_USER_ID);
      const user = response.data;
      
      const requiredFields = ['id', 'name', 'email', 'username'];
      expect(validators.hasRequiredFields(user, requiredFields)).toBe(true);
    });
    
    test('should return correct data types', async () => {
      const response = await userController.getUserById(TEST_USER_ID);
      const user = response.data;
      
      expect(validators.validateType(user.id, 'number')).toBe(true);
      expect(validators.validateType(user.name, 'string')).toBe(true);
      expect(validators.validateType(user.email, 'string')).toBe(true);
    });
  });
  
  describe('GET /posts', () => {
    test('should return all posts', async () => {
      const response = await postController.getAllPosts();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
    
    test('should return posts with correct structure', async () => {
      const response = await postController.getAllPosts();
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
      const response = await postController.getPostById(TEST_POST_ID);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(TEST_POST_ID);
      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('body');
    });
  });
});

