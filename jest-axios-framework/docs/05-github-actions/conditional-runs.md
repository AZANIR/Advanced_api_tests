# Умовні запуски

## Опис

Запуск тестів тільки при зміні певних файлів.

## Файл

`.github/workflows/conditional.yml`

## Детекція змін

Використовує `dorny/paths-filter@v2` для визначення змінених файлів:

```yaml
filters: |
  tests:
    - 'tests/**'
  src:
    - 'src/**'
  config:
    - 'jest.config.js'
    - 'package.json'
```

## Умови запуску

Тести запускаються тільки якщо:
- Змінені файли в `tests/` АБО
- Змінені файли в `src/` АБО
- Змінені `jest.config.js` або `package.json`

## Переваги

- ✅ Економія часу CI/CD
- ✅ Запуск тільки коли потрібно
- ✅ Можливість пропустити тести при зміні документації

## Додавання нових фільтрів

```yaml
filters: |
  tests:
    - 'tests/**'
  src:
    - 'src/**'
  docs:
    - 'docs/**'
  config:
    - 'jest.config.js'
    - 'package.json'
```

## Skip Notification

Якщо тести пропущені, створюється notification в summary.

