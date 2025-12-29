// Мокуємо axios модуль перед імпортом
const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(() => mockAxios),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
};

jest.mock('axios', () => mockAxios);

const axios = require('axios');

/**
 * Приклади мокування для API тестів
 * Демонструє різні способи мокування HTTP запитів
 */
describe('Mocking Examples', () => {
  beforeEach(() => {
    // Очищаємо моки перед кожним тестом
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Скидаємо моки після кожного тесту
    jest.resetAllMocks();
  });
  
  describe('Successful Responses', () => {
    test('should mock GET request successfully', async () => {
      const mockedUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
      ];
      
      // Налаштовуємо мок
      axios.get.mockResolvedValue({
        status: 200,
        data: mockedUsers
      });
      
      // Виконуємо запит
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      
      // Перевіряємо результат
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockedUsers);
      expect(response.data).toHaveLength(2);
      
      // Перевіряємо, що метод був викликаний
      expect(axios.get).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
    
    test('should mock POST request successfully', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com'
      };
      
      const createdUser = {
        id: 101,
        ...newUser,
        createdAt: '2024-01-01T00:00:00.000Z'
      };
      
      // Налаштовуємо мок
      axios.post.mockResolvedValue({
        status: 201,
        data: createdUser
      });
      
      // Виконуємо запит
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/users',
        newUser
      );
      
      // Перевіряємо результат
      expect(response.status).toBe(201);
      expect(response.data.id).toBe(101);
      expect(response.data.name).toBe(newUser.name);
      expect(response.data.email).toBe(newUser.email);
      
      // Перевіряємо виклик
      expect(axios.post).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/users',
        newUser
      );
    });
    
    test('should mock PUT request successfully', async () => {
      const updatedUser = {
        id: 1,
        name: 'Updated User',
        email: 'updated@example.com'
      };
      
      axios.put.mockResolvedValue({
        status: 200,
        data: updatedUser
      });
      
      const response = await axios.put(
        'https://jsonplaceholder.typicode.com/users/1',
        updatedUser
      );
      
      expect(response.status).toBe(200);
      expect(response.data.name).toBe('Updated User');
    });
    
    test('should mock DELETE request successfully', async () => {
      axios.delete.mockResolvedValue({
        status: 200,
        data: {}
      });
      
      const response = await axios.delete('https://jsonplaceholder.typicode.com/users/1');
      
      expect(response.status).toBe(200);
      expect(axios.delete).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1');
    });
  });
  
  describe('Error Responses', () => {
    test('should mock 404 error', async () => {
      // Налаштовуємо мок для помилки
      axios.get.mockRejectedValue({
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { error: 'User not found' }
        }
      });
      
      try {
        await axios.get('https://jsonplaceholder.typicode.com/users/999');
      } catch (error) {
        // Перевіряємо помилку
        expect(error.response.status).toBe(404);
        expect(error.response.statusText).toBe('Not Found');
        expect(error.response.data.error).toBe('User not found');
      }
      
      expect(axios.get).toHaveBeenCalled();
    });
    
    test('should mock 500 error', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: { error: 'Internal server error' }
        }
      });
      
      try {
        await axios.get('https://jsonplaceholder.typicode.com/users/1');
      } catch (error) {
        expect(error.response.status).toBe(500);
        expect(error.response.data.error).toBe('Internal server error');
      }
    });
    
    test('should mock 400 error', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 400,
          statusText: 'Bad Request',
          data: { error: 'Invalid data' }
        }
      });
      
      try {
        await axios.post('https://jsonplaceholder.typicode.com/users', {});
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe('Invalid data');
      }
    });
    
    test('should mock timeout error', async () => {
      axios.get.mockRejectedValue({
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
        config: {
          url: 'https://jsonplaceholder.typicode.com/users'
        }
      });
      
      try {
        await axios.get('https://jsonplaceholder.typicode.com/users');
      } catch (error) {
        expect(error.code).toBe('ECONNABORTED');
        expect(error.message).toContain('timeout');
      }
    });
    
    test('should mock network error', async () => {
      axios.get.mockRejectedValue({
        message: 'Network Error',
        code: 'ERR_NETWORK'
      });
      
      try {
        await axios.get('https://jsonplaceholder.typicode.com/users');
      } catch (error) {
        expect(error.message).toBe('Network Error');
        expect(error.code).toBe('ERR_NETWORK');
      }
    });
  });
  
  describe('Multiple Calls', () => {
    test('should mock multiple calls', async () => {
      // Перший виклик
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: { id: 1, name: 'User 1' }
      });
      
      // Другий виклик
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: { id: 2, name: 'User 2' }
      });
      
      const response1 = await axios.get('https://jsonplaceholder.typicode.com/users/1');
      const response2 = await axios.get('https://jsonplaceholder.typicode.com/users/2');
      
      expect(response1.data.name).toBe('User 1');
      expect(response2.data.name).toBe('User 2');
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });
  
  describe('Call Verification', () => {
    test('should verify mock was called with correct parameters', async () => {
      axios.get.mockResolvedValue({ status: 200, data: {} });
      
      await axios.get('https://jsonplaceholder.typicode.com/users', {
        params: { page: 1, limit: 10 }
      });
      
      // Перевірка виклику з параметрами
      expect(axios.get).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/users',
        { params: { page: 1, limit: 10 } }
      );
      
      // Перевірка кількості викликів
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });
});

