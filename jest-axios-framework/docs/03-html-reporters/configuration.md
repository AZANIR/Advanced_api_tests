# Детальна конфігурація jest-html-reporters

## Всі доступні опції

### Базові опції

| Опція | Тип | За замовчуванням | Опис |
|-------|-----|------------------|------|
| `publicPath` | string | `'reports/html'` | Шлях для збереження HTML звітів |
| `filename` | string | `'report.html'` | Ім'я файлу звіту |
| `expand` | boolean | `true` | Розгорнути всі тести за замовчуванням |
| `pageTitle` | string | `'API Test Report'` | Заголовок HTML сторінки |
| `hideIcon` | boolean | `false` | Приховати іконки в звіті |
| `pageSize` | string | `'A4'` | Розмір сторінки для друку (A4, Letter, etc.) |
| `openReport` | boolean | `false` | Автоматично відкривати звіт після генерації |

### Опції для помилок

| Опція | Тип | За замовчуванням | Опис |
|-------|-----|------------------|------|
| `includeFailureMsg` | boolean | `true` | Включити повідомлення про помилки |
| `includeSuiteFailure` | boolean | `true` | Включити помилки тестових сюїтів |
| `includeConsoleLog` | boolean | `false` | Включити console.log в звіт |

### Розширені опції

| Опція | Тип | За замовчуванням | Опис |
|-------|-----|------------------|------|
| `enableMergeData` | boolean | `true` | Об'єднати дані з попередніх запусків |
| `dataDirPath` | string | `'reports/html/data'` | Шлях для збереження даних |
| `inlineSource` | boolean | `false` | Вбудовані стилі та скрипти в HTML |
| `logoImgPath` | string | `undefined` | Шлях до логотипу для звіту |
| `testCommand` | string | `'npm test'` | Команда для запуску тестів |

### Метадані

| Опція | Тип | Опис |
|-------|-----|------|
| `metadata` | object | Метадані про проект, версію, середовище |

## Приклади конфігурації

### Мінімальна конфігурація

```javascript
{
  publicPath: 'reports/html',
  filename: 'report.html'
}
```

### Повна конфігурація

```javascript
{
  publicPath: 'reports/html',
  filename: 'report.html',
  expand: true,
  pageTitle: 'API Test Report',
  hideIcon: false,
  pageSize: 'A4',
  openReport: false,
  includeFailureMsg: true,
  includeSuiteFailure: true,
  includeConsoleLog: false,
  enableMergeData: true,
  dataDirPath: 'reports/html/data',
  inlineSource: false,
  logoImgPath: './assets/logo.png',
  testCommand: 'npm test',
  metadata: {
    projectName: 'jest-axios-framework',
    version: '1.0.0',
    environment: 'development'
  }
}
```

### Конфігурація для CI

```javascript
{
  publicPath: 'reports/html',
  filename: `report-${Date.now()}.html`,
  openReport: false,
  includeConsoleLog: true,
  metadata: {
    ci: true,
    buildNumber: process.env.GITHUB_RUN_NUMBER,
    workflow: process.env.GITHUB_WORKFLOW
  }
}
```

### Конфігурація для локального середовища

```javascript
{
  publicPath: 'reports/html',
  filename: 'report.html',
  openReport: true,
  includeConsoleLog: false,
  metadata: {
    ci: false
  }
}
```

## Використання в jest.config.js

### Базове використання

```javascript
const reportConfig = require('./src/utils/reportConfig');

module.exports = {
  reporters: [
    'default',
    ['jest-html-reporters', reportConfig.getReporterConfig()],
  ],
};
```

### Кастомна конфігурація

```javascript
const { getHtmlReporterConfig } = require('./src/utils/reportConfig');

module.exports = {
  reporters: [
    'default',
    [
      'jest-html-reporters',
      getHtmlReporterConfig({
        pageTitle: 'My Custom Report',
        openReport: true
      })
    ],
  ],
};
```

## Метадані

Метадані автоматично додаються до звіту:

```javascript
{
  projectName: 'jest-axios-framework',
  version: '1.0.0',
  environment: 'development',
  nodeVersion: 'v18.17.0',
  timestamp: '2024-01-15T10:30:00.000Z',
  gitCommit: 'abc123...',
  gitBranch: 'main',
  ci: false, // або true в CI
  buildNumber: '123', // тільки в CI
  workflow: 'CI' // тільки в CI
}
```

## Troubleshooting

### Звіт не генерується

Перевірте:
1. Чи встановлено `jest-html-reporters`: `npm install --save-dev jest-html-reporters`
2. Чи правильно налаштований шлях `publicPath`
3. Чи є права на запис у директорію

### Звіт не відкривається автоматично

Встановіть `openReport: true` в конфігурації або відкрийте вручну:
```bash
open reports/html/report.html
```

### Помилки з метаданими

Переконайтеся, що `package.json` містить `name` та `version`.

