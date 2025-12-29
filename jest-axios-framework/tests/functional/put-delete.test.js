const apiService = require('../../src/services/apiService');
const testData = require('../../src/data/testData');

/**
 * Functional Tests - PUT та DELETE методи
 * Перевірка функціональності оновлення та видалення ресурсів
 */
describe('Functional Tests - PUT and DELETE', () => {
  describe('PUT /posts/:id', () => {
    test('should update existing post', async () => {
      const postId = 1;
      const updatedData = testData.updatePost;
      
      const response = await apiService.updatePost(postId, updatedData);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(postId);
      expect(response.data.title).toBe(updatedData.title);
      expect(response.data.body).toBe(updatedData.body);
    });
    
    test('should replace all post fields', async () => {
      const postId = 1;
      const completeData = {
        title: 'Complete Post Title',
        body: 'Complete Post Body',
        userId: 2
      };
      
      const response = await apiService.updatePost(postId, completeData);
      
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(completeData);
    });
  });
  
  describe('PUT /users/:id', () => {
    test('should update existing user', async () => {
      const userId = 1;
      const updatedData = testData.updateUser;
      
      const response = await apiService.updateUser(userId, updatedData);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(userId);
      expect(response.data.name).toBe(updatedData.name);
      expect(response.data.email).toBe(updatedData.email);
    });
  });
  
  describe('DELETE /posts/:id', () => {
    test('should delete post', async () => {
      const postId = 1;
      const response = await apiService.deletePost(postId);
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('DELETE /users/:id', () => {
    test('should delete user', async () => {
      const userId = 1;
      const response = await apiService.deleteUser(userId);
      
      expect(response.status).toBe(200);
    });
  });
});

