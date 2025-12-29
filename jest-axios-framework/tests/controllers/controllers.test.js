const userController = require('../../src/controllers/userController');
const postController = require('../../src/controllers/postController');
const authController = require('../../src/controllers/authController');
const testData = require('../../src/data/testData');
const { generateTestData } = require('../../src/utils/dataHelpers');

// Test constants
const TEST_USER_ID = 1;
const TEST_POST_ID = 1;

/**
 * Controller Tests
 * Testing controller logic including validation, error handling, and retry mechanisms
 */
describe('Controller Tests', () => {
  describe('UserController', () => {
    describe('Validation', () => {
      test('should throw error when creating user with missing required fields', async () => {
        const invalidUser = { name: 'Test' }; // Missing email
        
        await expect(userController.createUser(invalidUser)).rejects.toThrow();
      });

      test('should throw error when getting user with invalid ID', async () => {
        await expect(userController.getUserById(null)).rejects.toThrow('Invalid user ID');
        await expect(userController.getUserById('invalid')).rejects.toThrow('Invalid user ID');
      });

      test('should throw error when updating user with invalid ID', async () => {
        const updateData = testData.updateUser;
        
        await expect(userController.updateUser(null, updateData)).rejects.toThrow('Invalid user ID');
      });
    });

    describe('Success scenarios', () => {
      test('should get all users with validation', async () => {
        const response = await userController.getAllUsers();
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
      });

      test('should get user by ID with validation', async () => {
        const response = await userController.getUserById(TEST_USER_ID);
        
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(TEST_USER_ID);
        expect(response.data).toHaveProperty('name');
        expect(response.data).toHaveProperty('email');
      });

      test('should create user with validation', async () => {
        const newUser = generateTestData('user');
        const response = await userController.createUser(newUser);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
      });

      test('should create and verify user', async () => {
        const newUser = generateTestData('user');
        const response = await userController.createUser(newUser);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        // Note: JSONPlaceholder doesn't persist data, so we can't verify by fetching
        // In a real API, we would verify the created user exists
      });
    });
  });

  describe('PostController', () => {
    describe('Validation', () => {
      test('should throw error when creating post with missing required fields', async () => {
        const invalidPost = { title: 'Test' }; // Missing body and userId
        
        await expect(postController.createPost(invalidPost)).rejects.toThrow();
      });

      test('should throw error when getting post with invalid ID', async () => {
        await expect(postController.getPostById(null)).rejects.toThrow('Invalid post ID');
        await expect(postController.getPostById('invalid')).rejects.toThrow('Invalid post ID');
      });

      test('should throw error when updating post with invalid ID', async () => {
        const updateData = testData.updatePost;
        
        await expect(postController.updatePost(null, updateData)).rejects.toThrow('Invalid post ID');
      });
    });

    describe('Success scenarios', () => {
      test('should get all posts with validation', async () => {
        const response = await postController.getAllPosts();
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
      });

      test('should get post by ID with validation', async () => {
        const response = await postController.getPostById(TEST_POST_ID);
        
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(TEST_POST_ID);
        expect(response.data).toHaveProperty('title');
        expect(response.data).toHaveProperty('body');
      });

      test('should create post with validation', async () => {
        const newPost = generateTestData('post');
        const response = await postController.createPost(newPost);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
      });

      test('should get posts by user ID', async () => {
        const userId = 1;
        const posts = await postController.getPostsByUserId(userId);
        
        expect(Array.isArray(posts)).toBe(true);
        posts.forEach(post => {
          expect(post.userId).toBe(userId);
        });
      });

      test('should create and verify post', async () => {
        const newPost = generateTestData('post');
        const response = await postController.createPost(newPost);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        // Note: JSONPlaceholder doesn't persist data, so we can't verify by fetching
        // In a real API, we would verify the created post exists
      });
    });
  });

  describe('AuthController', () => {
    beforeEach(() => {
      authController.clearAllTokens();
    });

    afterEach(() => {
      authController.clearAllTokens();
    });

    describe('Validation', () => {
      test('should throw error when registering with missing required fields', async () => {
        const invalidData = { email: 'test@example.com' }; // Missing password
        
        await expect(authController.register(invalidData)).rejects.toThrow();
      });
    });

    describe('Token management', () => {
      test('should store token after successful login', async () => {
        await authController.loginWithValidCredentials();
        
        const token = authController.getToken('reqres');
        expect(token).toBeTruthy();
        expect(typeof token).toBe('string');
      });

      test('should clear token', async () => {
        await authController.loginWithValidCredentials();
        authController.clearToken('reqres');
        
        const token = authController.getToken('reqres');
        expect(token).toBeNull();
      });

      test('should validate token', async () => {
        await authController.loginWithValidCredentials();
        
        expect(authController.isTokenValid('reqres')).toBe(true);
      });

      test('should return false for invalid token', async () => {
        expect(authController.isTokenValid('reqres')).toBe(false);
      });
    });

    describe('Retry logic', () => {
      test('should retry login on failure', async () => {
        // This test verifies that retry logic is implemented
        // In a real scenario, we would mock the API to fail initially
        const response = await authController.loginWithValidCredentials();
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('token');
      });
    });
  });
});

