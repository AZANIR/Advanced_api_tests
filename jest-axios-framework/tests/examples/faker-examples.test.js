const apiService = require('../../src/services/apiService');
const fakerGenerator = require('../../src/data/fakerGenerator');
const { generateTestData, generateTestDataArray } = require('../../src/utils/dataHelpers');

/**
 * Приклади використання Faker для генерації тестових даних
 */
describe('Faker Examples', () => {
  
  describe('User Data Generation', () => {
    test('should generate user data with Faker', () => {
      const user = fakerGenerator.generateUser();
      
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('phone');
      expect(user.email).toMatch(/@/);
    });

    test('should generate user with overrides', () => {
      const user = fakerGenerator.generateUser({
        email: 'custom@example.com',
        name: 'Custom Name'
      });
      
      expect(user.email).toBe('custom@example.com');
      expect(user.name).toBe('Custom Name');
    });

    test('should generate array of users', () => {
      const users = fakerGenerator.generateArray(
        () => fakerGenerator.generateUser(),
        5
      );
      
      expect(users).toHaveLength(5);
      expect(users[0]).toHaveProperty('email');
    });
  });

  describe('Post Data Generation', () => {
    test('should generate post data', () => {
      const post = fakerGenerator.generatePost();
      
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
      expect(post).toHaveProperty('userId');
      expect(typeof post.userId).toBe('number');
    });

    test('should create post with generated data', async () => {
      const postData = fakerGenerator.generatePost();
      
      const response = await apiService.createPost(postData);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.title).toBe(postData.title);
    });
  });

  describe('Using Data Helpers', () => {
    test('should generate test data using helper', () => {
      const user = generateTestData('user');
      
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
    });

    test('should generate test data array', () => {
      const posts = generateTestDataArray('post', 3);
      
      expect(posts).toHaveLength(3);
      expect(posts[0]).toHaveProperty('title');
    });

    test('should generate data with overrides using helper', () => {
      const post = generateTestData('post', {
        userId: 999,
        title: 'Custom Title'
      });
      
      expect(post.userId).toBe(999);
      expect(post.title).toBe('Custom Title');
    });
  });

  describe('Reproducible Data with Seed', () => {
    test('should generate same data with same seed', () => {
      // Перший генератор з seed
      fakerGenerator.setSeed(12345);
      const user1 = fakerGenerator.generateUser();
      
      // Другий генератор з тим самим seed
      fakerGenerator.setSeed(12345);
      const user2 = fakerGenerator.generateUser();
      
      expect(user1.name).toBe(user2.name);
      expect(user1.email).toBe(user2.email);
    });
  });

  describe('Integration with API Tests', () => {
    test('should create user with faker data', async () => {
      const userData = fakerGenerator.generateReqResUser();
      
      const response = await apiService.createUser(userData);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('name', userData.name);
      expect(response.data).toHaveProperty('job', userData.job);
    });

    test('should create multiple posts with different faker data', async () => {
      const posts = fakerGenerator.generateArray(
        () => fakerGenerator.generatePost(),
        3
      );
      
      for (const postData of posts) {
        const response = await apiService.createPost(postData);
        expect(response.status).toBe(201);
        expect(response.data.title).toBe(postData.title);
      }
    });
  });

  describe('Unique Data Generation', () => {
    test('should generate unique emails', () => {
      const email1 = fakerGenerator.generateUniqueEmail();
      const email2 = fakerGenerator.generateUniqueEmail();
      
      expect(email1).not.toBe(email2);
      expect(email1).toMatch(/@/);
      expect(email2).toMatch(/@/);
    });

    test('should generate unique usernames', () => {
      const username1 = fakerGenerator.generateUniqueUsername();
      const username2 = fakerGenerator.generateUniqueUsername();
      
      expect(username1).not.toBe(username2);
    });
  });

  describe('Petstore Data Generation', () => {
    test('should generate pet data', () => {
      const pet = fakerGenerator.generatePet();
      
      expect(pet).toHaveProperty('id');
      expect(pet).toHaveProperty('name');
      expect(pet).toHaveProperty('status');
      expect(['available', 'pending', 'sold']).toContain(pet.status);
    });

    test('should generate petstore user data', () => {
      const user = fakerGenerator.generatePetstoreUser();
      
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('firstName');
      expect(user).toHaveProperty('lastName');
    });
  });
});

