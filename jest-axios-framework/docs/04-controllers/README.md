# Дизайн контролерів для взаємодії з API

## Вступ

Контролери в нашому фреймворку - це шар абстракції над API Service, який додає:
- ✅ Валідацію вхідних та вихідних даних
- ✅ Обробку помилок
- ✅ Retry логіку
- ✅ Комплексні операції (create + verify, update + validate)
- ✅ Логування операцій

## Архітектура

```
┌─────────────┐
│   Tests     │
└──────┬──────┘
       │
┌──────▼──────────┐
│  Controllers    │  ← Валідація, retry, комплексні операції
│  (BaseController│  ← Спільна логіка для всіх контролерів
│   inheritance)  │
└──────┬──────────┘
       │
┌──────▼──────────┐
│  API Service    │  ← Базові HTTP методи
└──────┬──────────┘
       │
┌──────▼──────────┐
│  HTTP Client    │  ← Axios з interceptors
└─────────────────┘
```

## BaseController

Всі контролери (`UserController`, `PostController`) наслідуються від `BaseController`, який надає спільну функціональність:

- ✅ Валідація ID, статусів, обов'язкових полів
- ✅ Стандартизована обробка помилок
- ✅ Логування операцій
- ✅ Методи для verify операцій

Це дозволяє уникнути дублювання коду та забезпечити консистентність між контролерами.

## Доступні контролери

### BaseController

Базовий контролер зі спільною логікою. Всі інші контролери наслідуються від нього:

```javascript
const BaseController = require('../../src/controllers/baseController');

// Методи BaseController:
// - validateId(id, entityName)
// - validateStatus(status)
// - validateRequiredFields(data, fields)
// - validateArrayResponse(response)
// - validateResponseFields(response, fields)
// - executeWithErrorHandling(operation, operationName)
// - logSuccess(operationName, data)
// - handleVerify(entity, verifyFunction)
// - handleUpdateVerify(id, updateData, getFunction)
// - handleDeleteVerify(id, getFunction)
```

### UserController

Контролер для роботи з користувачами:

```javascript
const userController = require('../../src/controllers/userController');

// Отримати всіх користувачів
const users = await userController.getAllUsers();

// Отримати користувача по ID
const user = await userController.getUserById(1);

// Створити користувача з перевіркою
const newUser = await userController.createUser(userData, { verify: true });

// Оновити користувача
const updated = await userController.updateUser(1, updateData);

// Видалити користувача
await userController.deleteUser(1);

// Комплексна операція
const result = await userController.createAndVerifyUser(userData);
```

### PostController

Контролер для роботи з постами:

```javascript
const postController = require('../../src/controllers/postController');

// Отримати всі пости
const posts = await postController.getAllPosts();

// Отримати пост по ID
const post = await postController.getPostById(1);

// Створити пост
const newPost = await postController.createPost(postData);

// Отримати пости користувача
const userPosts = await postController.getPostsByUserId(1);

// Комплексна операція
const result = await postController.createAndVerifyPost(postData);
```

### AuthController

Контролер для аутентифікації:

```javascript
const authController = require('../../src/controllers/authController');

// Логін з retry логікою
const loginResponse = await authController.login(credentials);

// Логін з валідними credentials
await authController.loginWithValidCredentials();

// Реєстрація
await authController.register(userData);

// Робота з токенами
const token = authController.getToken('reqres');
authController.clearToken('reqres');
```

## Переваги використання контролерів

### 1. Валідація

Контролери автоматично валідують вхідні та вихідні дані:

```javascript
// Автоматична валідація
const user = await userController.getUserById(1);
// Перевіряє: статус, наявність обов'язкових полів
```

### 2. Обробка помилок

Контролери надають детальне логування помилок:

```javascript
try {
  await userController.getUserById(999);
} catch (error) {
  // Детальне логування вже виконано контролером
  console.error(error.message);
}
```

### 3. Retry логіка

AuthController автоматично повторює невдалі спроби:

```javascript
// Автоматичний retry при невдачі
await authController.login(credentials, { retry: 3 });
```

### 4. Комплексні операції

Контролери надають готові комплексні операції:

```javascript
// Створити та перевірити в одному виклику
const result = await userController.createAndVerifyUser(userData);
```

## Конфігурація аутентифікації

Окремий файл `src/config/auth.js` містить:

- Credentials для різних API
- Налаштування retry
- Керування токенами (in-memory та file-based)
- Timeout налаштування
- Динамічне визначення шляху до файлу зберігання токенів

```javascript
const authConfig = require('../../src/config/auth');

// Використання конфігурації
const credentials = authConfig.reqres.validCredentials;

// Робота з токенами
authConfig.tokenStorage.setToken('reqres', token);
const token = authConfig.tokenStorage.getToken('reqres');
```

### AuthService

Окремий сервіс `src/services/authService.js` для автоматичного логіну та оновлення токенів:

- Використовується в HTTP interceptors для автоматичного оновлення токенів
- Розв'язує проблему циклічних залежностей
- Обробляє автоматичний логін при 401 помилках

## Приклади використання

### Базовий приклад

```javascript
const userController = require('../../src/controllers/userController');

test('should get user with validation', async () => {
  const response = await userController.getUserById(1);
  
  expect(response.status).toBe(200);
  expect(response.data).toHaveProperty('id');
  expect(response.data).toHaveProperty('name');
});
```

### З перевіркою

```javascript
test('should create and verify user', async () => {
  const userData = { name: 'Test', email: 'test@example.com' };
  
  const response = await userController.createUser(userData, { verify: true });
  
  expect(response.status).toBe(201);
  expect(response.data.id).toBeDefined();
});
```

### Комплексна операція

```javascript
test('should create and verify user in one call', async () => {
  const userData = { name: 'Test', email: 'test@example.com' };
  
  const result = await userController.createAndVerifyUser(userData);
  
  expect(result.created).toBeDefined();
  expect(result.verified).toBeDefined();
  expect(result.created.id).toBe(result.verified.id);
});
```

## Додаткові ресурси

- [Патерни використання](./controller-patterns.md)
- [Приклади контролерів](./examples.md)

