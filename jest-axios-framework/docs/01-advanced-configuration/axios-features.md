# Фічі Axios

## Вступ

Axios надає багато потужних можливостей для роботи з HTTP запитами. У нашому фреймворку ми використовуємо кілька ключових фіч.

## Interceptors

### Request Interceptor

Логування вихідних запитів:

```javascript
httpClient.interceptors.request.use(
  (request) => {
    logger.request(request.method, request.url, request.data);
    return request;
  },
  (error) => {
    logger.error('Request error:', error);
    return Promise.reject(error);
  }
);
```

### Response Interceptor

Логування відповідей та обробка помилок:

```javascript
httpClient.interceptors.response.use(
  (response) => {
    logger.response(response.status, response.data);
    return response;
  },
  (error) => {
    // Обробка помилок
    if (error.response) {
      logger.error(`Response error: ${error.response.status}`);
    }
    return Promise.reject(error);
  }
);
```

## Timeout

Налаштування timeout для запитів:

```javascript
const httpClient = axios.create({
  timeout: 10000  // 10 секунд
});
```

## Error Handling

Axios надає структуровані помилки:

```javascript
try {
  await httpClient.get('/users');
} catch (error) {
  if (error.response) {
    // Сервер повернув помилку
    console.log(error.response.status);
    console.log(error.response.data);
  } else if (error.request) {
    // Запит був зроблений, але відповіді не отримано
    console.log('No response received');
  } else {
    // Помилка при налаштуванні запиту
    console.log('Request setup error');
  }
}
```

## Base URL

Встановлення базового URL:

```javascript
const httpClient = axios.create({
  baseURL: 'https://api.example.com'
});

// Запит буде до https://api.example.com/users
await httpClient.get('/users');
```

## Default Headers

Встановлення заголовків за замовчуванням:

```javascript
const httpClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  }
});
```

## Request/Response Transformers

Трансформація даних:

```javascript
httpClient.defaults.transformRequest = [(data) => {
  // Трансформація перед відправкою
  return JSON.stringify(data);
}];

httpClient.defaults.transformResponse = [(data) => {
  // Трансформація після отримання
  return JSON.parse(data);
}];
```

