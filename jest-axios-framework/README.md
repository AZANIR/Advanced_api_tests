# Jest + Axios API Automation Framework

Готовий фреймворк для автоматизації тестування API з використанням Jest та Axios.

## 📋 Опис

Цей фреймворк надає готову структуру та інструменти для написання API тестів. Він включає:

- ✅ HTTP клієнт на базі Axios з логуванням
- ✅ API сервіс з готовими методами
- ✅ Контролери з валідацією та retry логікою
- ✅ Faker для генерації динамічних тестових даних
- ✅ Покращені HTML репортери з метаданими
- ✅ Утиліти для валідації та логування
- ✅ Приклади різних типів тестів
- ✅ Конфігурація Jest з репортерами
- ✅ Генерація HTML та JUnit звітів
- ✅ Coverage звіти
- ✅ GitHub Actions workflows з різними підходами
- ✅ Автоматичний деплой звітів на GitHub Pages

## 🚀 Швидкий старт

### Встановлення

```bash
# Встановити залежності
npm install

# Запустити тести
npm test
```

### Перший тест

```javascript
const apiService = require('./src/services/apiService');

describe('My First Test', () => {
  test('should get users', async () => {
    const response = await apiService.getAllUsers();
    expect(response.status).toBe(200);
  });
});
```

## 📁 Структура проекту

```
jest-axios-framework/
├── src/
│   ├── services/          # HTTP клієнт та API сервіс
│   │   ├── httpClient.js
│   │   └── apiService.js
│   ├── controllers/       # Контролери з валідацією
│   │   ├── userController.js
│   │   ├── postController.js
│   │   └── authController.js
│   ├── config/            # Конфігурація
│   │   ├── config.js
│   │   ├── endpoints.js
│   │   └── auth.js        # Конфігурація аутентифікації
│   ├── utils/             # Утиліти
│   │   ├── logger.js
│   │   ├── validators.js
│   │   ├── dataHelpers.js # Утиліти для роботи з Faker
│   │   └── reportConfig.js # Конфігурація репортерів
│   └── data/              # Тестові дані
│       ├── testData.js
│       └── fakerGenerator.js # Генератор даних з Faker
├── tests/                 # Тести
│   ├── smoke/             # Димові тести
│   ├── functional/       # Функціональні тести
│   ├── negative/         # Негативні тести
│   ├── integration/      # Інтеграційні тести
│   ├── mocking/          # Тести з мокуванням
│   └── examples/         # Приклади використання
│       └── faker-examples.test.js
├── docs/                  # Документація
│   ├── 01-advanced-configuration/
│   ├── 02-faker/
│   ├── 03-html-reporters/
│   ├── 04-controllers/
│   └── 05-github-actions/
├── .github/
│   └── workflows/        # GitHub Actions workflows
│       ├── ci.yml
│       ├── matrix.yml
│       ├── scheduled.yml
│       ├── parallel.yml
│       ├── conditional.yml
│       ├── full-pipeline.yml
│       └── deploy-pages.yml
├── reports/               # Звіти (генеруються автоматично)
│   ├── coverage/         # Coverage звіти
│   ├── html/             # HTML звіти
│   └── junit/            # JUnit XML звіти
├── jest.config.js        # Конфігурація Jest
├── package.json          # Залежності
└── README.md            # Документація
```

## 🛠 Використання

### API Service

```javascript
const apiService = require('./src/services/apiService');

// GET запити
const users = await apiService.getAllUsers();
const user = await apiService.getUserById(1);

// POST запити
const newPost = await apiService.createPost({
  title: 'Test',
  body: 'Test body',
  userId: 1
});

// PUT запити
const updated = await apiService.updatePost(1, {
  title: 'Updated'
});

// DELETE запити
await apiService.deletePost(1);
```

### Контролери (Рекомендовано)

Контролери додають валідацію, обробку помилок та комплексні операції:

```javascript
const userController = require('./src/controllers/userController');

// Отримати користувача з валідацією
const user = await userController.getUserById(1);

// Створити користувача з перевіркою
const newUser = await userController.createUser(userData, { verify: true });

// Комплексна операція: створити та перевірити
const result = await userController.createAndVerifyUser(userData);
```

### Faker для генерації даних

```javascript
const fakerGenerator = require('./src/data/fakerGenerator');

// Генерація користувача
const user = fakerGenerator.generateUser();

// Генерація поста
const post = fakerGenerator.generatePost({ userId: 1 });

// Генерація масиву
const users = fakerGenerator.generateArray(
  () => fakerGenerator.generateUser(),
  5
);

// Використання з Data Helpers
const { generateTestData } = require('./src/utils/dataHelpers');
const user = generateTestData('user');
```

### Аутентифікація

```javascript
const authController = require('./src/controllers/authController');

// Логін з retry логікою
const response = await authController.login(credentials);

// Робота з токенами
const token = authController.getToken('reqres');
authController.clearToken('reqres');
```

### Валідатори

```javascript
const validators = require('./src/utils/validators');

// Перевірка статус-коду
validators.isSuccessStatus(200); // true

// Перевірка наявності полів
validators.hasRequiredFields(user, ['id', 'name']);

// Перевірка типу
validators.validateType(user.id, 'number');
```

### Логування

```javascript
const logger = require('./src/utils/logger');

logger.info('Test started');
logger.error('Error occurred', error);
logger.request('GET', '/users');
logger.response(200, data);
```

## 📝 Приклади тестів

### Smoke Test

```javascript
describe('Smoke Tests', () => {
  test('API should be accessible', async () => {
    const response = await apiService.getAllUsers();
    expect(response.status).toBe(200);
  });
});
```

### Mocked Test

```javascript
const axios = require('axios');
jest.mock('axios');

describe('Mocked Tests', () => {
  test('should return mocked data', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: { id: 1, name: 'Mocked User' }
    });
    
    const response = await axios.get('https://jsonplaceholder.typicode.com/users/1');
    expect(response.data.name).toBe('Mocked User');
  });
});
```

### Functional Test

```javascript
describe('Functional Tests', () => {
  test('should get user by id', async () => {
    const response = await apiService.getUserById(1);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(1);
  });
});
```

### Negative Test

```javascript
describe('Negative Tests', () => {
  test('should return 404 for non-existent user', async () => {
    try {
      await apiService.getUserById(99999);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});
```

## 🎯 Команди npm

```bash
# Запуск всіх тестів
npm test

# Запуск тестів у watch режимі
npm run test:watch

# Запуск тестів з покриттям та звітами
npm run test:coverage
# або
npm run test:report

# Запуск smoke тестів
npm run test:smoke

# Запуск functional тестів
npm run test:functional

# Запуск negative тестів
npm run test:negative

# Запуск integration тестів
npm run test:integration

# Запуск тестів з мокуванням
npm run test:mocking
```

## 📊 Звіти та покриття коду

Після запуску тестів з репортерами (`npm run test:coverage` або `npm run test:report`), звіти генеруються автоматично:

### HTML звіт
Відкрийте `reports/html/report.html` в браузері для перегляду детального HTML звіту з результатами тестів.

HTML звіти автоматично включають:
- Метадані про проект, версію, середовище
- Git commit та branch інформацію
- Детальну інформацію про помилки
- Автоматичне відкриття в локальному середовищі

**Детальніше:** [Документація HTML репортерів](./docs/03-html-reporters/README.md)

### Coverage звіт
Відкрийте `reports/coverage/index.html` в браузері для перегляду звіту про покриття коду.

### JUnit XML звіт
Файл `reports/junit/junit.xml` можна використовувати для інтеграції з CI/CD системами (Jenkins, GitHub Actions).

### GitHub Pages
Після налаштування GitHub Actions, звіти автоматично публікуються на GitHub Pages.

**Детальніше:** [Налаштування GitHub Pages](./docs/05-github-actions/github-pages.md)

## ⚙️ Конфігурація

### Environment Variables

Створіть файл `.env`:

```env
BASE_URL=https://jsonplaceholder.typicode.com
REQUEST_TIMEOUT=10000
```

### Jest Configuration

Налаштування в `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  testTimeout: 10000,
  verbose: true,
  
  // Coverage налаштування
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/index.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'reports/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Репортери (якщо встановлені jest-junit та jest-html-reporters)
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports/junit',
        outputName: 'junit.xml',
      },
    ],
    [
      'jest-html-reporters',
      {
        publicPath: 'reports/html',
        filename: 'report.html',
        expand: true,
        pageTitle: 'API Test Report (Jest)',
      },
    ],
  ],
};
```

**Примітка:** Репортери вже включені в залежності проекту.

Детальне налаштування репортерів описано в [документації](./docs/03-html-reporters/README.md).

## 📚 API для тестування

Фреймворк налаштований для роботи з:

- **JSONPlaceholder**: https://jsonplaceholder.typicode.com
- **Petstore Swagger**: https://petstore.swagger.io/v2
- **ReqRes**: https://reqres.in/api (опціонально)

## 🔧 Розширення фреймворку

### Додавання нових endpoints

Оновіть `src/config/endpoints.js`:

```javascript
const endpoints = {
  jsonplaceholder: {
    // ... існуючі endpoints
    comments: `${config.baseURL}/comments`
  }
};
```

### Додавання нових методів в API Service

Оновіть `src/services/apiService.js`:

```javascript
async getAllComments() {
  return this.get(endpoints.jsonplaceholder.comments);
}
```

### Створення нового контролера

Створіть новий контролер в `src/controllers/`:

```javascript
const apiService = require('../services/apiService');
const validators = require('../utils/validators');

class CommentController {
  async getCommentById(id) {
    // Валідація та обробка помилок
    if (!id || typeof id !== 'number') {
      throw new Error('Invalid comment ID');
    }
    return await apiService.getCommentById(id);
  }
}

module.exports = new CommentController();
```

### Додавання нових генераторів Faker

Розширте `src/data/fakerGenerator.js`:

```javascript
generateComment(overrides = {}) {
  return {
    postId: faker.number.int({ min: 1, max: 100 }),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    body: faker.lorem.paragraph(),
    ...overrides
  };
}
```

## 🎭 Мокування даних

Фреймворк підтримує мокування для тестування без залежності від реального API.

### Базовий приклад

```javascript
const axios = require('axios');
jest.mock('axios');

test('should use mocked data', async () => {
  axios.get.mockResolvedValue({
    status: 200,
    data: { id: 1, name: 'Mocked User' }
  });
  
  const response = await axios.get('/users/1');
  expect(response.data.name).toBe('Mocked User');
});
```

### Документація

- [Повна документація про мокування](../docs/04-mocking/README.md)
- [Практичні приклади](../examples/mocking-examples.md)
- [Приклади тестів](tests/mocking/mocking.test.js)

## 🚀 GitHub Actions

Фреймворк включає кілька готових GitHub Actions workflows:

- **CI - Basic Tests** - Базовий CI для запуску тестів
- **Matrix Builds** - Тестування на різних версіях Node.js
- **Scheduled Runs** - Автоматичні запуски за розкладом (cron)
- **Parallel Suites** - Паралельний запуск тестових сюїтів
- **Conditional Tests** - Умовний запуск на основі змінених файлів
- **Full Pipeline** - Повний pipeline з тестами та деплоєм
- **Deploy Pages** - Автоматичний деплой звітів на GitHub Pages

**Детальніше:** [Документація GitHub Actions](./docs/05-github-actions/README.md)

## 📖 Документація

### Основна документація
- [SETUP.md](./SETUP.md) - Покрокова інструкція встановлення
- [Документація проекту](./docs/README.md) - Повна документація

### Розширені можливості
- [Розширена конфігурація](./docs/01-advanced-configuration/README.md) - Axios features, конфігурація логіну
- [Faker](./docs/02-faker/README.md) - Генерація динамічних тестових даних
- [HTML Reporters](./docs/03-html-reporters/README.md) - Налаштування та кастомізація звітів
- [Контролери](./docs/04-controllers/README.md) - Дизайн та використання контролерів
- [GitHub Actions](./docs/05-github-actions/README.md) - Всі workflows та їх налаштування

## 🤝 Внесок

Якщо ви знайшли помилку або маєте пропозиції:

1. Створіть Issue
2. Або внесіть зміни через Pull Request

## 📄 Ліцензія

MIT License

---

**Приємного тестування! 🚀**

