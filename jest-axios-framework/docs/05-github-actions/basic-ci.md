# Базовий CI Workflow

## Опис

Базовий CI workflow для автоматичного запуску тестів при push та pull request.

## Файл

`.github/workflows/ci.yml`

## Тригери

```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

## Кроки

1. **Checkout code** - Отримує код з репозиторію
2. **Setup Node.js** - Встановлює Node.js 18 з кешуванням npm
3. **Install dependencies** - Встановлює залежності через `npm ci`
4. **Run tests** - Запускає тести через `npm test`
5. **Upload test results** - Завантажує звіти як артефакти

## Артефакти

Після завершення workflow доступні наступні артефакти:
- HTML звіти (`reports/html/`)
- JUnit XML звіти (`reports/junit/`)
- Coverage звіти (`reports/coverage/`)

## Використання

Workflow запускається автоматично при:
- Push до гілок `main` або `develop`
- Створенні pull request до `main` або `develop`

## Перегляд результатів

1. Перейдіть до вкладки "Actions" в GitHub
2. Виберіть "CI - Basic Tests"
3. Виберіть потрібний run
4. Перегляньте логи та завантажте артефакти

