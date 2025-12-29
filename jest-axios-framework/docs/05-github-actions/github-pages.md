# Налаштування GitHub Pages

## Опис

Автоматичний деплой HTML звітів на GitHub Pages.

## Налаштування репозиторію

1. Перейдіть до Settings → Pages
2. Виберіть Source: "GitHub Actions"
3. Збережіть зміни

## Workflow для деплою

Використовується `deploy-pages.yml` workflow, який:
1. Завантажує HTML звіти з артефактів
2. Створює індексну сторінку
3. Деплоїть на GitHub Pages

## Permissions

Для деплою потрібні наступні permissions:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

## Структура сайту

```
_site/
├── index.html      # Індексна сторінка
└── report.html     # HTML звіт
```

## Доступ до звітів

Після деплою звіти доступні на:
```
https://<username>.github.io/<repository>/
```

## Автоматичний деплой

Workflow автоматично деплоїть звіти після:
- Успішного завершення `CI - Basic Tests`
- Успішного завершення `Full Pipeline - Tests + Deploy`

## Manual деплой

Для ручного деплою використовуйте `full-pipeline.yml` з `workflow_dispatch`.

## Troubleshooting

### Деплой не працює

1. Перевірте permissions в workflow
2. Переконайтеся, що Pages налаштовані на "GitHub Actions"
3. Перевірте логи workflow

### Звіти не відображаються

1. Перевірте, чи створюються HTML звіти
2. Перевірте шлях до файлів в workflow
3. Перевірте структуру `_site/` директорії

