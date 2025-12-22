# Налаштування jest-html-reporters

## Вступ

`jest-html-reporters` - це потужний репортер для Jest, який генерує красиві HTML звіти з результатами тестів. У нашому фреймворку ми використовуємо розширену конфігурацію для максимальної гнучкості.

## Основні можливості

- ✅ Генерація HTML звітів з детальною інформацією
- ✅ Підтримка метаданих (версія, середовище, git commit)
- ✅ Автоматична конфігурація для CI/CD та локального середовища
- ✅ Кастомізація звітів
- ✅ Збереження історії тестів

## Базове використання

### Автоматична конфігурація

Фреймворк автоматично визначає середовище (CI або локальне) та застосовує відповідну конфігурацію:

```javascript
// jest.config.js
const reportConfig = require('./src/utils/reportConfig');

module.exports = {
  reporters: [
    'default',
    ['jest-html-reporters', reportConfig.getReporterConfig()],
  ],
};
```

### Локальне середовище

При запуску тестів локально:
- Звіт автоматично відкривається в браузері
- Генерується файл `reports/html/report.html`
- Включаються метадані про локальне середовище

### CI/CD середовище

При запуску в CI/CD:
- Генерується унікальний файл з timestamp
- Включаються додаткові метадані (build number, workflow)
- Звіт зберігається як артефакт

## Метадані звіту

Звіт автоматично включає наступні метадані:

```javascript
{
  projectName: 'jest-axios-framework',
  version: '1.0.0',
  environment: 'development',
  nodeVersion: 'v18.17.0',
  timestamp: '2024-01-15T10:30:00.000Z',
  gitCommit: 'abc123...',
  gitBranch: 'main'
}
```

## Конфігурація

### Базові опції

```javascript
{
  publicPath: 'reports/html',      // Шлях для збереження звітів
  filename: 'report.html',         // Ім'я файлу звіту
  expand: true,                     // Розгорнути всі тести за замовчуванням
  pageTitle: 'API Test Report',     // Заголовок сторінки
  hideIcon: false,                 // Показати іконки
  pageSize: 'A4',                   // Розмір сторінки для друку
  openReport: false,                // Автоматично відкривати звіт
  includeFailureMsg: true,          // Включити повідомлення про помилки
  includeSuiteFailure: true,        // Включити помилки сюїтів
  includeConsoleLog: false          // Включити console.log
}
```

### Розширені опції

```javascript
{
  enableMergeData: true,            // Об'єднати дані з попередніх запусків
  dataDirPath: 'reports/html/data', // Шлях для збереження даних
  inlineSource: false,              // Вбудовані стилі та скрипти
  logoImgPath: 'path/to/logo.png',  // Шлях до логотипу
  testCommand: 'npm test'           // Команда для запуску тестів
}
```

## Кастомізація

### Власна конфігурація

Ви можете створити власну конфігурацію:

```javascript
const { getHtmlReporterConfig } = require('./src/utils/reportConfig');

const customConfig = getHtmlReporterConfig({
  pageTitle: 'My Custom Report',
  logoImgPath: './assets/logo.png',
  openReport: true
});
```

### Конфігурація для CI

```javascript
const { getCiReporterConfig } = require('./src/utils/reportConfig');

// Використовується автоматично в CI середовищі
const ciConfig = getCiReporterConfig();
```

### Конфігурація для локального середовища

```javascript
const { getLocalReporterConfig } = require('./src/utils/reportConfig');

// Використовується автоматично локально
const localConfig = getLocalReporterConfig();
```

## Перегляд звітів

### Локально

Після запуску тестів:

```bash
npm test
```

Звіт автоматично відкриється в браузері або ви можете відкрити:
```
reports/html/report.html
```

### В CI/CD

Звіти зберігаються як артефакти та можуть бути завантажені з GitHub Actions або опубліковані на GitHub Pages.

## Додаткові ресурси

- [Детальна конфігурація](./configuration.md)
- [Кастомізація звітів](./customization.md)
- [Офіційна документація jest-html-reporters](https://github.com/Hargne/jest-html-reporters)

