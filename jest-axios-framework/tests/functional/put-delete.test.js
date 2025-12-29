const userController = require('../../src/controllers/userController');
const postController = require('../../src/controllers/postController');
const testData = require('../../src/data/testData');

// Test constants
const TEST_USER_ID = 1;
const TEST_POST_ID = 1;

/**
 * Functional Tests - PUT and DELETE methods
 * Testing resource update and deletion functionality using controllers
 */
describe('Functional Tests - PUT and DELETE', () => {
  describe('PUT /posts/:id', () => {
    test('should update existing post', async () => {
      const updatedData = testData.updatePost;
      
      const response = await postController.updatePost(TEST_POST_ID, updatedData);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(TEST_POST_ID);
      expect(response.data.title).toBe(updatedData.title);
      expect(response.data.body).toBe(updatedData.body);
    });
    
    test('should replace all post fields', async () => {
      const completeData = {
        title: 'Complete Post Title',
        body: 'Complete Post Body',
        userId: 2
      };
      
      const response = await postController.updatePost(TEST_POST_ID, completeData);
      
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(completeData);
    });
  });
  
  describe('PUT /users/:id', () => {
    test('should update existing user', async () => {
      const updatedData = testData.updateUser;
      
      const response = await userController.updateUser(TEST_USER_ID, updatedData);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(TEST_USER_ID);
      expect(response.data.name).toBe(updatedData.name);
      expect(response.data.email).toBe(updatedData.email);
    });
  });
  
  describe('DELETE /posts/:id', () => {
    test('should delete post', async () => {
      const response = await postController.deletePost(TEST_POST_ID);
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('DELETE /users/:id', () => {
    test('should delete user', async () => {
      const response = await userController.deleteUser(TEST_USER_ID);
      
      expect(response.status).toBe(200);
    });
  });
});

