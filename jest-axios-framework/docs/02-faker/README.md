# Використання Faker для генерації динамічних даних

## Вступ

Faker - це потужна бібліотека для генерації реалістичних тестових даних. У нашому фреймворку ми використовуємо `@faker-js/faker` для створення динамічних даних для API тестів.

## Переваги використання Faker

- ✅ **Динамічні дані**: Кожен тест отримує унікальні дані
- ✅ **Реалістичність**: Дані виглядають як реальні
- ✅ **Відтворюваність**: Можливість використання seed для однакових результатів
- ✅ **Гнучкість**: Легко перевизначати окремі поля
- ✅ **Різноманітність**: Велика кількість типів даних

## Встановлення

Faker вже додано до залежностей проекту:

```bash
npm install
```

## Базове використання

### Імпорт генератора

```javascript
const fakerGenerator = require('../../src/data/fakerGenerator');
```

### Генерація користувача

```javascript
const user = fakerGenerator.generateUser();
// {
//   name: 'John Doe',
//   email: 'john.doe@example.com',
//   username: 'johndoe',
//   phone: '123-456-7890',
//   ...
// }
```

### Генерація поста

```javascript
const post = fakerGenerator.generatePost();
// {
//   title: 'Lorem ipsum dolor sit amet',
//   body: 'Consectetur adipiscing elit...',
//   userId: 5
// }
```

### Перевизначення полів

```javascript
const user = fakerGenerator.generateUser({
  email: 'custom@example.com',
  name: 'Custom Name'
});
// email та name будуть перевизначені, інші поля згенеруються автоматично
```

## Доступні генератори

### Користувачі

- `generateUser(overrides)` - Генерація даних користувача
- `generateReqResUser(overrides)` - Генерація користувача для ReqRes API
- `generatePetstoreUser(overrides)` - Генерація користувача для Petstore API

### Контент

- `generatePost(overrides)` - Генерація поста
- `generateComment(overrides)` - Генерація коментаря

### Інші

- `generatePet(overrides)` - Генерація тварини для Petstore
- `generateOrder(overrides)` - Генерація замовлення
- `generateReqResLogin(overrides)` - Генерація даних для логіну

## Генерація масивів

```javascript
// Генерація масиву з 5 користувачів
const users = fakerGenerator.generateArray(
  () => fakerGenerator.generateUser(),
  5
);
```

## Використання з Data Helpers

Для більш зручної роботи використовуйте утиліти:

```javascript
const { generateTestData, generateTestDataArray } = require('../../src/utils/dataHelpers');

// Генерація одного об'єкта
const user = generateTestData('user');

// Генерація масиву
const posts = generateTestDataArray('post', 10);
```

## Відтворюваність з Seed

Для відтворюваних результатів використовуйте seed:

```javascript
// Встановлення seed
fakerGenerator.setSeed(12345);

// Тепер всі згенеровані дані будуть однакові
const user1 = fakerGenerator.generateUser();
fakerGenerator.setSeed(12345);
const user2 = fakerGenerator.generateUser();
// user1 та user2 будуть ідентичні
```

## Унікальні дані

Для генерації унікальних даних з timestamp:

```javascript
const email = fakerGenerator.generateUniqueEmail();
// test-1234567890-1234@example.com

const username = fakerGenerator.generateUniqueUsername();
// user_1234567890_abcd
```

## Приклади використання в тестах

### Створення користувача з Faker даними

```javascript
test('should create user with faker data', async () => {
  const userData = fakerGenerator.generateUser();
  
  const response = await apiService.createUser(userData);
  
  expect(response.status).toBe(201);
  expect(response.data.name).toBe(userData.name);
});
```

### Створення множини постів

```javascript
test('should create multiple posts', async () => {
  const posts = fakerGenerator.generateArray(
    () => fakerGenerator.generatePost(),
    5
  );
  
  for (const postData of posts) {
    const response = await apiService.createPost(postData);
    expect(response.status).toBe(201);
  }
});
```

## Best Practices

1. **Використовуйте seed для дебагу**: Якщо тест падає, встановіть seed для відтворення
2. **Перевизначайте тільки необхідні поля**: Не перевизначайте всі поля, дозвольте Faker згенерувати решту
3. **Генеруйте унікальні дані для інтеграційних тестів**: Використовуйте `generateUniqueEmail()` для уникнення конфліктів
4. **Використовуйте Data Helpers**: Для більш чистої та читабельної кодової бази

## Додаткові ресурси

- [Офіційна документація Faker](https://fakerjs.dev/)
- [Приклади використання](./usage-examples.md)
- [Best Practices](./best-practices.md)

