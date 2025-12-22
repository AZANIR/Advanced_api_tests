# Патерни використання контролерів

## 1. Валідація перед операцією

```javascript
test('should validate before creating', async () => {
  const invalidData = { name: '' }; // Відсутній email
  
  try {
    await userController.createUser(invalidData);
    fail('Should have thrown error');
  } catch (error) {
    expect(error.message).toContain('Missing required fields');
  }
});
```

## 2. Retry при невдачі

```javascript
test('should retry on failure', async () => {
  // AuthController автоматично повторює спроби
  const response = await authController.login(credentials, { retry: 3 });
  
  expect(response.status).toBe(200);
});
```

## 3. Комплексні операції

```javascript
test('should create and verify', async () => {
  const result = await userController.createAndVerifyUser(userData);
  
  // Створення та перевірка в одному виклику
  expect(result.created).toBeDefined();
  expect(result.verified).toBeDefined();
});
```

## 4. Робота з токенами

```javascript
test('should manage tokens', async () => {
  // Логін зберігає токен
  await authController.login();
  
  // Отримати токен
  const token = authController.getToken('reqres');
  expect(token).toBeDefined();
  
  // Очистити токен
  authController.clearToken('reqres');
  expect(authController.getToken('reqres')).toBeNull();
});
```

## 5. Фільтрація даних

```javascript
test('should filter posts by user', async () => {
  const userPosts = await postController.getPostsByUserId(1);
  
  expect(userPosts.every(post => post.userId === 1)).toBe(true);
});
```

