const authController = require('../src/controllers/authController');
const authConfig = require('../src/config/auth');

/**
 * Login Tests (Тести для логіну та токену)
 * Перевірка отримання та збереження токену після аутентифікації
 */
describe('Login and Token Management Tests', () => {
  // Очищаємо токени перед кожним тестом
  beforeEach(() => {
    authController.clearAllTokens();
  });

  // Очищаємо токени після кожного тесту
  afterEach(() => {
    authController.clearAllTokens();
  });

  describe('Successful Login', () => {
    test('should login with valid credentials and return token', async () => {
      const response = await authController.loginWithValidCredentials();
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(typeof response.data.token).toBe('string');
      expect(response.data.token.length).toBeGreaterThan(0);
    });

    test('should store token after successful login', async () => {
      const response = await authController.loginWithValidCredentials();
      
      // Перевіряємо, що токен збережено
      const storedToken = authController.getToken('reqres');
      expect(storedToken).toBeTruthy();
      expect(storedToken).toBe(response.data.token);
    });

    test('should retrieve stored token', async () => {
      await authController.loginWithValidCredentials();
      
      const token = authController.getToken('reqres');
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    test('should verify token is valid after login', async () => {
      await authController.loginWithValidCredentials();
      
      const isValid = authController.isTokenValid('reqres');
      expect(isValid).toBe(true);
    });
  });

  describe('Token Storage and Retrieval', () => {
    test('should store token with correct key', async () => {
      await authController.loginWithValidCredentials();
      
      const token = authController.getToken('reqres');
      expect(token).toBeTruthy();
      
      // Перевіряємо, що токен не зберігається під іншим ключем
      const wrongToken = authController.getToken('wrong-key');
      expect(wrongToken).toBeNull();
    });

    test('should clear specific token', async () => {
      await authController.loginWithValidCredentials();
      
      // Перевіряємо, що токен збережено
      expect(authController.getToken('reqres')).toBeTruthy();
      
      // Очищаємо токен
      authController.clearToken('reqres');
      
      // Перевіряємо, що токен видалено
      expect(authController.getToken('reqres')).toBeNull();
      expect(authController.isTokenValid('reqres')).toBe(false);
    });

    test('should clear all tokens', async () => {
      await authController.loginWithValidCredentials();
      
      // Перевіряємо, що токен збережено
      expect(authController.getToken('reqres')).toBeTruthy();
      
      // Очищаємо всі токени
      authController.clearAllTokens();
      
      // Перевіряємо, що токен видалено
      expect(authController.getToken('reqres')).toBeNull();
    });
  });

  describe('Login with Custom Credentials', () => {
    test('should login with provided credentials', async () => {
      const credentials = {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      };
      
      const response = await authController.login(credentials);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      
      // Перевіряємо, що токен збережено
      const token = authController.getToken('reqres');
      expect(token).toBe(response.data.token);
    });
  });

  describe('Registration and Token', () => {
    test('should register user and store token if provided', async () => {
      const userData = {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      };
      
      const response = await authController.register(userData);
      
      expect(response.status).toBe(200);
      
      // ReqRes API може повертати токен при реєстрації
      if (response.data.token) {
        const token = authController.getToken('reqres');
        expect(token).toBe(response.data.token);
      }
    });
  });

  describe('Token Expiration', () => {
    test('should handle token expiration', async () => {
      await authController.loginWithValidCredentials();
      
      const token = authController.getToken('reqres');
      expect(token).toBeTruthy();
      
      // Симулюємо закінчення терміну дії токену
      // Встановлюємо токен з минулим терміном дії
      authConfig.tokenStorage.setToken('reqres', token, -1);
      
      // Перевіряємо, що токен більше не валідний
      const expiredToken = authController.getToken('reqres');
      expect(expiredToken).toBeNull();
      expect(authController.isTokenValid('reqres')).toBe(false);
    });
  });

  describe('Multiple Login Attempts', () => {
    test('should update token on subsequent login', async () => {
      // Перший логін
      const firstResponse = await authController.loginWithValidCredentials();
      const firstToken = authController.getToken('reqres');
      
      expect(firstToken).toBe(firstResponse.data.token);
      
      // Другий логін
      const secondResponse = await authController.loginWithValidCredentials();
      const secondToken = authController.getToken('reqres');
      
      expect(secondToken).toBe(secondResponse.data.token);
      // Токени можуть бути однакові або різні залежно від API
      expect(secondToken).toBeTruthy();
    });
  });

  describe('Token Usage in Subsequent Requests', () => {
    test('should automatically use token for ReqRes API requests after login', async () => {
      const apiService = require('../src/services/apiService');
      
      // Логінуємося та зберігаємо токен
      await authController.loginWithValidCredentials();
      const token = authController.getToken('reqres');
      expect(token).toBeTruthy();
      
      // Робимо запит до ReqRes API - токен має автоматично додатися
      // Примітка: ReqRes API може не вимагати токен для GET /users, 
      // але перевіряємо що токен доступний для використання
      const response = await apiService.getReqResUsers();
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
      expect(Array.isArray(response.data.data)).toBe(true);
      
      // Перевіряємо, що токен все ще збережений
      const storedToken = authController.getToken('reqres');
      expect(storedToken).toBe(token);
    });

    test('should use stored token for authenticated requests', async () => {
      const apiService = require('../src/services/apiService');
      
      // Логінуємося
      await authController.loginWithValidCredentials();
      const originalToken = authController.getToken('reqres');
      
      // Робимо кілька запитів - токен має використовуватися автоматично
      const usersResponse = await apiService.getReqResUsers();
      expect(usersResponse.status).toBe(200);
      
      // Перевіряємо, що токен не змінився
      const currentToken = authController.getToken('reqres');
      expect(currentToken).toBe(originalToken);
    });
  });
});
