# Окремий файл для логіну

## Вступ

Файл `src/config/auth.js` містить всю конфігурацію для аутентифікації та авторизації.

## Структура

```javascript
const authConfig = {
  reqres: {
    baseURL: 'https://reqres.in/api',
    validCredentials: { ... },
    invalidCredentials: { ... }
  },
  petstore: {
    baseURL: 'https://petstore.swagger.io/v2',
    apiKey: '',
    username: '',
    password: ''
  },
  timeout: 5000,
  retryAttempts: 3,
  retryDelay: 1000,
  tokenStorage: { ... }
};
```

## Credentials

### ReqRes API

```javascript
reqres: {
  validCredentials: {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
  },
  invalidCredentials: {
    email: 'invalid@reqres.in',
    password: 'invalid'
  }
}
```

### Petstore API

```javascript
petstore: {
  apiKey: process.env.PETSTORE_API_KEY || '',
  username: process.env.PETSTORE_USERNAME || '',
  password: process.env.PETSTORE_PASSWORD || ''
}
```

## Token Storage

Токени зберігаються у файлі та в пам'яті. Шлях до файлу визначається динамічно через змінну середовища `TOKEN_STORAGE_FILE` (за замовчуванням `token-storage.json`):

```javascript
tokenStorage: {
  setToken(key, token, expiresIn),  // Зберігає у файл та пам'ять
  getToken(key),                     // Читає з файлу (для 'reqres') або пам'яті
  clearToken(key),                   // Видаляє з файлу та пам'яті
  clearAll()                         // Очищає все
}
```

**Файли зберігання токенів:**
- `tests/token-storage.json` - основний файл для зберігання токенів (за замовчуванням)
- `tests/token-demo-storage.json` - окремий файл для демо тестів (використовується через `TOKEN_STORAGE_FILE`)

Файли використовуються для збереження токена між запусками тестів та для наочності (особливо для студентів-початківців).

**Динамічне визначення шляху:**
```javascript
// У тестах можна встановити окремий файл для ізоляції
process.env.TOKEN_STORAGE_FILE = 'token-demo-storage.json';
```

## Використання

```javascript
const authConfig = require('./src/config/auth');

// Отримати credentials
const credentials = authConfig.reqres.validCredentials;

// Робота з токенами
authConfig.tokenStorage.setToken('reqres', 'token123');
const token = authConfig.tokenStorage.getToken('reqres');
```

## Environment Variables

Додайте в `.env`:

```env
REQRES_EMAIL=eve.holt@reqres.in
REQRES_PASSWORD=cityslicka
PETSTORE_API_KEY=your-api-key
PETSTORE_USERNAME=your-username
PETSTORE_PASSWORD=your-password
```

