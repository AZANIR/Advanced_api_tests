# Кастомізація HTML звітів

## Додавання логотипу

```javascript
const { getHtmlReporterConfig } = require('./src/utils/reportConfig');

const config = getHtmlReporterConfig({
  logoImgPath: './assets/logo.png'
});
```

## Зміна заголовка

```javascript
const config = getHtmlReporterConfig({
  pageTitle: 'My Custom Test Report'
});
```

## Налаштування для різних середовищ

### Development

```javascript
const config = getHtmlReporterConfig({
  openReport: true,
  includeConsoleLog: true
});
```

### Production

```javascript
const config = getHtmlReporterConfig({
  openReport: false,
  includeConsoleLog: false,
  enableMergeData: true
});
```

## Кастомні метадані

```javascript
const { getHtmlReporterConfig } = require('./src/utils/reportConfig');

const config = getHtmlReporterConfig({
  metadata: {
    projectName: 'My Project',
    version: '2.0.0',
    team: 'QA Team',
    customField: 'Custom Value'
  }
});
```

## Збереження історії тестів

Для збереження історії встановіть:

```javascript
const config = getHtmlReporterConfig({
  enableMergeData: true,
  dataDirPath: 'reports/html/data'
});
```

Це дозволить зберігати дані з попередніх запусків та відстежувати зміни в часі.

