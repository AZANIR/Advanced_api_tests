# Розширена конфігурація API тестів

## Вступ

Цей розділ описує розширені можливості конфігурації API тестів у фреймворку.

## Основні теми

### Axios Features

Детальний опис можливостей Axios, які використовуються у фреймворку:
- Interceptors
- Request/Response трансформації
- Timeout налаштування
- Error handling

[Детальніше →](./axios-features.md)

### Login Configuration

Окремий файл конфігурації для аутентифікації:
- Зберігання credentials
- Керування токенами
- Retry логіка

[Детальніше →](./login-config.md)

## Структура конфігурації

```
src/config/
├── config.js      # Основна конфігурація
├── endpoints.js    # Endpoints для API
└── auth.js         # Конфігурація аутентифікації
```

## Environment Variables

Створіть `.env` файл для налаштування:

```env
BASE_URL=https://jsonplaceholder.typicode.com
REQRES_BASE_URL=https://reqres.in/api
PETSTORE_BASE_URL=https://petstore.swagger.io/v2
REQUEST_TIMEOUT=10000
ENVIRONMENT=development
```

## Додаткові ресурси

- [Axios Features](./axios-features.md)
- [Login Configuration](./login-config.md)

