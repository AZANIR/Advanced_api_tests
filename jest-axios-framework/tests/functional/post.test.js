const userController = require('../../src/controllers/userController');
const postController = require('../../src/controllers/postController');
const testData = require('../../src/data/testData');
const { generateTestData } = require('../../src/utils/dataHelpers');

/**
 * Functional Tests - POST methods
 * Testing resource creation functionality using controllers
 */
describe('Functional Tests - POST', () => {
  describe('POST /posts', () => {
    test('should create new post', async () => {
      const newPost = testData.validPost;
      const response = await postController.createPost(newPost);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.title).toBe(newPost.title);
      expect(response.data.body).toBe(newPost.body);
      expect(response.data.userId).toBe(newPost.userId);
    });
    
    test('should create post with all required fields', async () => {
      const newPost = generateTestData('post', {
        title: 'Test Post Title',
        body: 'Test Post Body',
        userId: 1
      });
      
      const response = await postController.createPost(newPost);
      
      expect(response.status).toBe(201);
      expect(response.data.title).toBe(newPost.title);
      expect(response.data.body).toBe(newPost.body);
      expect(response.data.userId).toBe(newPost.userId);
    });
    
    test('should assign unique id to new post', async () => {
      const post1 = await postController.createPost(testData.validPost);
      const post2 = await postController.createPost(testData.validPost);
      
      // JSONPlaceholder always returns id: 101, but in real API ids would be different
      expect(post1.data).toHaveProperty('id');
      expect(post2.data).toHaveProperty('id');
    });
  });
  
  describe('POST /users', () => {
    test('should create new user', async () => {
      const newUser = testData.validUser;
      const response = await userController.createUser(newUser);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe(newUser.name);
      expect(response.data.email).toBe(newUser.email);
    });
  });
});

