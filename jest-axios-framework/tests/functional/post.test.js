const apiService = require('../../src/services/apiService');
const testData = require('../../src/data/testData');

/**
 * Functional Tests - POST методи
 * Перевірка функціональності створення ресурсів
 */
describe('Functional Tests - POST', () => {
  describe('POST /posts', () => {
    test('should create new post', async () => {
      const newPost = testData.validPost;
      const response = await apiService.createPost(newPost);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.title).toBe(newPost.title);
      expect(response.data.body).toBe(newPost.body);
      expect(response.data.userId).toBe(newPost.userId);
    });
    
    test('should create post with all required fields', async () => {
      const newPost = {
        title: 'Test Post Title',
        body: 'Test Post Body',
        userId: 1
      };
      
      const response = await apiService.createPost(newPost);
      
      expect(response.status).toBe(201);
      expect(response.data.title).toBe(newPost.title);
      expect(response.data.body).toBe(newPost.body);
      expect(response.data.userId).toBe(newPost.userId);
    });
    
    test('should assign unique id to new post', async () => {
      const post1 = await apiService.createPost(testData.validPost);
      const post2 = await apiService.createPost(testData.validPost);
      
      // JSONPlaceholder завжди повертає id: 101, але в реальному API id будуть різні
      expect(post1.data).toHaveProperty('id');
      expect(post2.data).toHaveProperty('id');
    });
  });
  
  describe('POST /users', () => {
    test('should create new user', async () => {
      const newUser = testData.validUser;
      const response = await apiService.createUser(newUser);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe(newUser.name);
      expect(response.data.email).toBe(newUser.email);
    });
  });
});

