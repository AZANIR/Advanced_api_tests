# Matrix Builds

## Опис

Matrix workflow для тестування на різних версіях Node.js та тестових сюїтах.

## Файл

`.github/workflows/matrix.yml`

## Matrix стратегія

```yaml
strategy:
  matrix:
    node-version: ['16', '18', '20']
    test-suite: ['smoke', 'functional', 'negative']
```

Це створює 9 джобів (3 версії Node.js × 3 тестові сюїти).

## Переваги

- ✅ Перевірка сумісності з різними версіями Node.js
- ✅ Паралельне виконання тестів
- ✅ Детальні звіти для кожної комбінації

## Артефакти

Кожен джоб генерує окремі артефакти:
- `test-results-node-16-smoke`
- `test-results-node-18-functional`
- І т.д.

## Використання

Додайте нові версії Node.js або тестові сюїти до matrix:

```yaml
matrix:
  node-version: ['16', '18', '20', '21']
  test-suite: ['smoke', 'functional', 'negative', 'integration']
```

