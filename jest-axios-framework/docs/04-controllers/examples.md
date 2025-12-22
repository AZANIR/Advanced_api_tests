# Приклади використання контролерів

## UserController приклади

### Отримання користувачів

```javascript
const userController = require('../../src/controllers/userController');

// Всі користувачі
test('should get all users', async () => {
  const response = await userController.getAllUsers();
  
  expect(response.status).toBe(200);
  expect(Array.isArray(response.data)).toBe(true);
});

// Користувач по ID
test('should get user by id', async () => {
  const response = await userController.getUserById(1);
  
  expect(response.status).toBe(200);
  expect(response.data.id).toBe(1);
});
```

### Створення користувача

```javascript
test('should create user with validation', async () => {
  const userData = {
    name: 'John Doe',
    email: 'john@example.com'
  };
  
  const response = await userController.createUser(userData);
  
  expect(response.status).toBe(201);
  expect(response.data).toHaveProperty('id');
});

// З перевіркою
test('should create and verify user', async () => {
  const userData = {
    name: 'John Doe',
    email: 'john@example.com'
  };
  
  const response = await userController.createUser(userData, { verify: true });
  
  expect(response.status).toBe(201);
});
```

### Комплексна операція

```javascript
test('should create and verify in one call', async () => {
  const userData = {
    name: 'John Doe',
    email: 'john@example.com'
  };
  
  const result = await userController.createAndVerifyUser(userData);
  
  expect(result.created.id).toBe(result.verified.id);
});
```

## PostController приклади

### Робота з постами

```javascript
const postController = require('../../src/controllers/postController');

test('should get posts by user', async () => {
  const posts = await postController.getPostsByUserId(1);
  
  expect(posts.length).toBeGreaterThan(0);
  expect(posts.every(post => post.userId === 1)).toBe(true);
});
```

## AuthController приклади

### Логін

```javascript
const authController = require('../../src/controllers/authController');

test('should login with valid credentials', async () => {
  const response = await authController.loginWithValidCredentials();
  
  expect(response.status).toBe(200);
  expect(response.data).toHaveProperty('token');
});

test('should handle login retry', async () => {
  const response = await authController.login(credentials, { retry: 3 });
  
  expect(response.status).toBe(200);
});
```

### Робота з токенами

```javascript
test('should manage authentication tokens', async () => {
  // Логін
  await authController.login();
  
  // Перевірка токену
  expect(authController.isTokenValid('reqres')).toBe(true);
  
  // Отримання токену
  const token = authController.getToken('reqres');
  expect(token).toBeDefined();
  
  // Очищення
  authController.clearToken('reqres');
  expect(authController.isTokenValid('reqres')).toBe(false);
});
```

