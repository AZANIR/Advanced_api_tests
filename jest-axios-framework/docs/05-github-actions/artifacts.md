# Робота з артефактами

## Опис

Артефакти дозволяють зберігати та завантажувати файли між джобами та workflow runs.

## Завантаження артефактів

```yaml
- name: Upload test results
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: |
      reports/html/**
      reports/junit/**
      reports/coverage/**
    retention-days: 30
```

## Завантаження артефактів

```yaml
- name: Download artifacts
  uses: actions/download-artifact@v4
  with:
    name: test-results
```

## Типи артефактів

### HTML Reports

```yaml
- name: Upload HTML report
  uses: actions/upload-artifact@v4
  with:
    name: html-report
    path: reports/html/**
```

### JUnit Reports

```yaml
- name: Upload JUnit report
  uses: actions/upload-artifact@v4
  with:
    name: junit-report
    path: reports/junit/**
```

### Coverage Reports

```yaml
- name: Upload coverage
  uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: reports/coverage/**
```

## Retention

Встановіть час збереження артефактів:

```yaml
retention-days: 30  # Зберігати 30 днів
```

## Перегляд артефактів

1. Перейдіть до workflow run
2. Прокрутіть до секції "Artifacts"
3. Завантажте потрібний артефакт

## Розмір артефактів

GitHub дозволяє:
- Максимальний розмір артефакту: 10 GB
- Максимальний розмір всіх артефактів: 10 GB

