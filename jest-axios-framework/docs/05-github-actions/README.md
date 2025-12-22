# GitHub Actions для API тестів

## Вступ

GitHub Actions дозволяє автоматизувати запуск тестів, генерацію звітів та деплой на GitHub Pages. У нашому фреймворку налаштовано кілька різних workflow для різних сценаріїв.

## Доступні Workflows

### 1. CI - Basic Tests (`ci.yml`)

Базовий CI workflow для запуску тестів на push та pull request.

**Тригери:**
- Push до `main` або `develop`
- Pull request до `main` або `develop`

**Що робить:**
- Встановлює Node.js 18
- Встановлює залежності
- Запускає тести
- Завантажує звіти як артефакти

### 2. CI - Matrix Builds (`matrix.yml`)

Тестування на різних версіях Node.js та тестових сюїтах.

**Тригери:**
- Push до `main` або `develop`
- Pull request до `main` або `develop`

**Matrix стратегія:**
- Node.js версії: 16, 18, 20
- Тестові сюїти: smoke, functional, negative

### 3. Scheduled Tests (`scheduled.yml`)

Автоматичний запуск тестів за розкладом (cron).

**Тригери:**
- Cron: щодня о 2:00 UTC
- Manual dispatch (запуск вручну)

**Що робить:**
- Запускає всі тести
- Генерує coverage звіти
- Зберігає артефакти на 30 днів

### 4. CI - Parallel Test Suites (`parallel.yml`)

Паралельний запуск різних тестових сюїтів.

**Тригери:**
- Push до `main` або `develop`
- Pull request до `main` або `develop`

**Паралельні джоби:**
- Smoke tests
- Functional tests
- Negative tests
- Integration tests

### 5. CI - Conditional Tests (`conditional.yml`)

Умовний запуск тестів на основі змінених файлів.

**Тригери:**
- Push до `main` або `develop`
- Pull request до `main` або `develop`

**Умови:**
- Запускає тести тільки якщо змінені:
  - Файли в `tests/`
  - Файли в `src/`
  - `jest.config.js` або `package.json`

### 6. Full Pipeline (`full-pipeline.yml`)

Повний pipeline з тестами, звітами та деплоєм.

**Тригери:**
- Push до `main`
- Pull request до `main`
- Manual dispatch

**Що робить:**
- Запускає всі тести з coverage
- Завантажує HTML, JUnit та coverage звіти
- Публікує результати тестів
- Деплоїть на GitHub Pages (тільки для main branch)

### 7. Deploy Reports (`deploy-pages.yml`)

Автоматичний деплой звітів на GitHub Pages після успішного завершення інших workflows.

**Тригери:**
- Після завершення `CI - Basic Tests`
- Після завершення `Full Pipeline - Tests + Deploy`

## Використання

### Активація workflows

Workflows активуються автоматично при push або pull request. Для ручного запуску:

1. Перейдіть до вкладки "Actions" в GitHub
2. Виберіть потрібний workflow
3. Натисніть "Run workflow"

### Перегляд результатів

1. Перейдіть до вкладки "Actions"
2. Виберіть потрібний workflow run
3. Перегляньте логи та завантажте артефакти

### GitHub Pages

Після успішного деплою звіти будуть доступні на:
```
https://<username>.github.io/<repository>/
```

## Налаштування

### Environment Variables

Додайте змінні середовища в Settings → Secrets and variables → Actions:

- `REQRES_EMAIL` - Email для ReqRes API
- `REQRES_PASSWORD` - Пароль для ReqRes API
- Інші необхідні credentials

### Permissions

Для GitHub Pages потрібні наступні permissions:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

## Додаткові ресурси

- [Базовий CI](./basic-ci.md)
- [Matrix builds](./matrix-builds.md)
- [Scheduled runs](./scheduled-runs.md)
- [Паралельні тести](./parallel-suites.md)
- [Умовні запуски](./conditional-runs.md)
- [Артефакти](./artifacts.md)
- [GitHub Pages](./github-pages.md)

