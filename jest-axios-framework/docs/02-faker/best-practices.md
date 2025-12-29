# Best Practices для використання Faker

## 1. Використання Seed для відтворюваності

### ✅ DO: Використовуйте seed для дебагу

```javascript
describe('User Tests', () => {
  beforeAll(() => {
    fakerGenerator.setSeed(12345);
  });
  
  test('should create user', async () => {
    const user = fakerGenerator.generateUser();
    // Дані будуть однакові при кожному запуску
  });
});
```

### ❌ DON'T: Не використовуйте seed в продакшн тестах

```javascript
// Погано - дані завжди однакові
fakerGenerator.setSeed(12345);
const user = fakerGenerator.generateUser();
```

## 2. Генерація унікальних даних

### ✅ DO: Використовуйте унікальні дані для інтеграційних тестів

```javascript
test('should create unique user', async () => {
  const user = fakerGenerator.generateUser({
    email: fakerGenerator.generateUniqueEmail()
  });
  
  await apiService.createUser(user);
});
```

### ❌ DON'T: Не використовуйте однакові дані для множини тестів

```javascript
// Погано - можливі конфлікти
const user = fakerGenerator.generateUser();
await apiService.createUser(user);
await apiService.createUser(user); // Може упасти через дублікат
```

## 3. Перевизначення полів

### ✅ DO: Перевизначайте тільки необхідні поля

```javascript
const user = fakerGenerator.generateUser({
  email: 'required@example.com' // Тільки необхідне поле
});
// Решта полів згенеруються автоматично
```

### ❌ DON'T: Не перевизначайте всі поля

```javascript
// Погано - втрачаємо переваги Faker
const user = fakerGenerator.generateUser({
  name: 'John',
  email: 'john@example.com',
  username: 'john',
  phone: '123-456-7890',
  // ... всі поля
});
```

## 4. Використання Data Helpers

### ✅ DO: Використовуйте утиліти для чистоти коду

```javascript
const { generateTestData } = require('../../src/utils/dataHelpers');

const user = generateTestData('user');
```

### ❌ DON'T: Не дублюйте логіку генерації

```javascript
// Погано - дублювання коду
const user1 = fakerGenerator.generateUser();
const user2 = fakerGenerator.generateUser();
const user3 = fakerGenerator.generateUser();
```

## 5. Генерація масивів

### ✅ DO: Використовуйте generateArray для множини даних

```javascript
const users = fakerGenerator.generateArray(
  () => fakerGenerator.generateUser(),
  10
);
```

### ❌ DON'T: Не генеруйте масиви вручну

```javascript
// Погано - неефективно
const users = [];
for (let i = 0; i < 10; i++) {
  users.push(fakerGenerator.generateUser());
}
```

## 6. Очищення даних

### ✅ DO: Очищайте дані перед відправкою якщо потрібно

```javascript
const { cleanObject } = require('../../src/utils/dataHelpers');

const user = fakerGenerator.generateUser();
const cleanedUser = cleanObject(user);
```

## 7. Валідація обов'язкових полів

### ✅ DO: Перевіряйте обов'язкові поля

```javascript
const { validateRequiredFields } = require('../../src/utils/dataHelpers');

const user = fakerGenerator.generateUser();
const validation = validateRequiredFields(user, ['name', 'email']);

expect(validation.valid).toBe(true);
```

## 8. Тестування з різними даними

### ✅ DO: Генеруйте різні дані для кожного тесту

```javascript
test('should handle different user data', async () => {
  const users = fakerGenerator.generateArray(
    () => fakerGenerator.generateUser(),
    5
  );
  
  for (const user of users) {
    const response = await apiService.createUser(user);
    expect(response.status).toBe(201);
  }
});
```

## 9. Комбінація з реальними даними

### ✅ DO: Комбінуйте Faker з реальними даними коли потрібно

```javascript
test('should update existing user', async () => {
  // Отримуємо реального користувача
  const existingUser = await apiService.getUserById(1);
  
  // Генеруємо нові дані для оновлення
  const updateData = fakerGenerator.generateUser({
    id: existingUser.data.id
  });
  
  await apiService.updateUser(1, updateData);
});
```

## 10. Документування

### ✅ DO: Документуйте складні генерації

```javascript
/**
 * Генерує користувача з унікальним email для інтеграційних тестів
 */
function generateTestUser() {
  return fakerGenerator.generateUser({
    email: fakerGenerator.generateUniqueEmail()
  });
}
```

## Загальні рекомендації

1. **Використовуйте Faker для динамічних даних**: Не хардкодьте тестові дані
2. **Seed для дебагу**: Встановлюйте seed тільки для відтворення помилок
3. **Унікальність для інтеграцій**: Використовуйте унікальні дані для тестів, що взаємодіють з реальним API
4. **Чистота коду**: Використовуйте утиліти та helpers для чистоти
5. **Валідація**: Перевіряйте обов'язкові поля перед використанням

