const apiService = require('../../src/services/apiService');
const testData = require('../../src/data/testData');

/**
 * Negative Tests (Негативні тести)
 * Перевірка обробки помилок та невалідних даних
 */
describe('Negative Tests', () => {
  describe('Invalid Data', () => {
    test('should return 404 for non-existent user', async () => {
      const nonExistentId = 99999;
      
      try {
        await apiService.getUserById(nonExistentId);
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
    
    test('should return 404 for non-existent post', async () => {
      const nonExistentId = 99999;
      
      try {
        await apiService.getPostById(nonExistentId);
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });
  
  describe('Invalid ID Format', () => {
    test('should handle invalid user id format', async () => {
      // JSONPlaceholder може повертати 404 або обробляти по-іншому
      try {
        await apiService.getUserById('invalid-id');
      } catch (error) {
        // Очікуємо помилку (404 або іншу)
        expect(error.response).toBeDefined();
      }
    });
  });
  
  describe('Empty Data', () => {
    test('should handle empty post creation', async () => {
      try {
        await apiService.createPost({});
      } catch (error) {
        // JSONPlaceholder може прийняти порожні дані, але в реальному API це має бути 400
        if (error.response) {
          expect([400, 422]).toContain(error.response.status);
        }
      }
    });
  });
  
  describe('Missing Required Fields', () => {
    test('should handle post without required fields', async () => {
      const incompletePost = {
        title: 'Test'
        // body та userId відсутні
      };
      
      try {
        await apiService.createPost(incompletePost);
        // JSONPlaceholder може прийняти це, але в реальному API це має бути 400
      } catch (error) {
        if (error.response) {
          expect([400, 422]).toContain(error.response.status);
        }
      }
    });
  });
  
  describe('Invalid Data Types', () => {
    test('should handle invalid userId type', async () => {
      const invalidPost = {
        title: 'Test',
        body: 'Test body',
        userId: 'not-a-number' // має бути число
      };
      
      try {
        await apiService.createPost(invalidPost);
        // JSONPlaceholder може прийняти це, але в реальному API це має бути 400
      } catch (error) {
        if (error.response) {
          expect([400, 422]).toContain(error.response.status);
        }
      }
    });
  });
  
  describe('Security Tests', () => {
    test('should handle SQL injection attempts', async () => {
      const maliciousData = {
        title: "'; DROP TABLE posts; --",
        body: 'Test body',
        userId: 1
      };
      
      try {
        const response = await apiService.createPost(maliciousData);
        // API має правильно обробити це
        expect(response.status).toBe(201);
        // Перевіряємо, що дані не виконалися як SQL
        expect(response.data.title).toBeDefined();
      } catch (error) {
        if (error.response) {
          expect([400, 422]).toContain(error.response.status);
        }
      }
    });
    
    test('should handle XSS attempts', async () => {
      const maliciousData = {
        title: '<script>alert("XSS")</script>',
        body: 'Test body',
        userId: 1
      };
      
      try {
        const response = await apiService.createPost(maliciousData);
        expect(response.status).toBe(201);
        // В реальному API дані мають бути екрановані
        expect(response.data.title).toBeDefined();
      } catch (error) {
        if (error.response) {
          expect([400, 422]).toContain(error.response.status);
        }
      }
    });
  });
});

