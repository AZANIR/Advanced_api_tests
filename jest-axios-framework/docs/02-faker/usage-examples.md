# Приклади використання Faker

## Базові приклади

### Генерація користувача

```javascript
const fakerGenerator = require('../../src/data/fakerGenerator');

// Проста генерація
const user = fakerGenerator.generateUser();
console.log(user);
// {
//   name: 'John Doe',
//   email: 'john.doe@example.com',
//   username: 'johndoe',
//   ...
// }
```

### Генерація з перевизначенням

```javascript
const user = fakerGenerator.generateUser({
  email: 'test@example.com',
  name: 'Test User'
});
// email та name будуть перевизначені
```

### Генерація масиву

```javascript
const users = fakerGenerator.generateArray(
  () => fakerGenerator.generateUser(),
  10
);
// Масив з 10 користувачів
```

## Приклади для різних API

### JSONPlaceholder API

```javascript
// Генерація поста
const post = fakerGenerator.generatePost({
  userId: 1
});

const response = await apiService.createPost(post);
```

### ReqRes API

```javascript
// Генерація користувача
const user = fakerGenerator.generateReqResUser();

// Створення користувача
const response = await apiService.createUser(user);
```

### Petstore API

```javascript
// Генерація тварини
const pet = fakerGenerator.generatePet({
  status: 'available'
});

// Створення тварини
const response = await apiService.createPet(pet);
```

## Сценарії тестування

### Тест створення користувача

```javascript
test('should create user with faker data', async () => {
  const userData = fakerGenerator.generateUser();
  
  const response = await apiService.createUser(userData);
  
  expect(response.status).toBe(201);
  expect(response.data.name).toBe(userData.name);
});
```

### Тест оновлення користувача

```javascript
test('should update user with new faker data', async () => {
  // Отримуємо існуючого користувача
  const getUserResponse = await apiService.getUserById(1);
  const existingUser = getUserResponse.data;
  
  // Генеруємо нові дані для оновлення
  const updateData = fakerGenerator.generateUser({
    id: existingUser.id // Зберігаємо ID
  });
  
  const response = await apiService.updateUser(1, updateData);
  expect(response.status).toBe(200);
});
```

### Тест створення множини ресурсів

```javascript
test('should create multiple posts', async () => {
  const posts = fakerGenerator.generateArray(
    () => fakerGenerator.generatePost({ userId: 1 }),
    5
  );
  
  const responses = await Promise.all(
    posts.map(post => apiService.createPost(post))
  );
  
  responses.forEach(response => {
    expect(response.status).toBe(201);
  });
});
```

### Тест з унікальними даними

```javascript
test('should create user with unique email', async () => {
  const user = fakerGenerator.generateUser({
    email: fakerGenerator.generateUniqueEmail()
  });
  
  const response = await apiService.createUser(user);
  expect(response.status).toBe(201);
});
```

## Використання з Data Helpers

### Проста генерація

```javascript
const { generateTestData } = require('../../src/utils/dataHelpers');

const user = generateTestData('user');
const post = generateTestData('post');
```

### Генерація масиву

```javascript
const { generateTestDataArray } = require('../../src/utils/dataHelpers');

const users = generateTestDataArray('user', 10);
const posts = generateTestDataArray('post', 5);
```

### Генерація з перевизначенням

```javascript
const user = generateTestData('user', {
  email: 'custom@example.com'
});
```

## Відтворюваність

### Використання seed

```javascript
// Встановлення seed перед тестом
beforeAll(() => {
  fakerGenerator.setSeed(12345);
});

test('should generate same data', () => {
  const user1 = fakerGenerator.generateUser();
  fakerGenerator.setSeed(12345);
  const user2 = fakerGenerator.generateUser();
  
  expect(user1.name).toBe(user2.name);
});
```

## Комплексні сценарії

### Створення користувача з постами

```javascript
test('should create user with posts', async () => {
  // Генеруємо користувача
  const user = fakerGenerator.generateUser();
  const createUserResponse = await apiService.createUser(user);
  const userId = createUserResponse.data.id;
  
  // Генеруємо пости для користувача
  const posts = fakerGenerator.generateArray(
    () => fakerGenerator.generatePost({ userId }),
    3
  );
  
  // Створюємо пости
  for (const post of posts) {
    await apiService.createPost(post);
  }
});
```

### Негативні тести з невалідними даними

```javascript
test('should reject invalid email', async () => {
  const user = fakerGenerator.generateUser({
    email: 'invalid-email' // Невалідний email
  });
  
  try {
    await apiService.createUser(user);
    fail('Should have thrown error');
  } catch (error) {
    expect(error.response.status).toBe(400);
  }
});
```

