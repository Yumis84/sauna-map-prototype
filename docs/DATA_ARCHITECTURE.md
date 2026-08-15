# Пар-Гид — централизованная база и безопасная миграция

## Принцип

Рабочий `main` и текущий `venues.js` остаются без изменений, пока новый контур не пройдет проверку.

Новый источник данных создан отдельно:

- Google Sheet: `Пар-Гид — база саун и бань`
- Spreadsheet ID: `1ZyPTzNz6CsqDBOdMllcTEJwyB44TSldrQDkXMVyfOaM`
- URL: https://docs.google.com/spreadsheets/d/1ZyPTzNz6CsqDBOdMllcTEJwyB44TSldrQDkXMVyfOaM/edit
- timezone: `Europe/Kaliningrad`

## Таблицы

### venues

- venue_id
- name
- type
- address
- latitude
- longitude
- phone
- website
- price_from
- price_to
- capacity
- rating
- amenities
- description
- source
- active
- updated_at

### rooms

- room_id
- venue_id
- name
- capacity
- price_per_hour
- price_to
- min_hours
- amenities
- active
- updated_at

### photos

- photo_id
- venue_id
- room_id
- url
- source
- sort_order
- active
- updated_at

### bookings

- booking_id
- venue_id
- room_id
- date
- start_time
- duration_hours
- guests
- client_name
- phone
- email
- amount
- status
- source
- comment
- created_at
- updated_at

## Удаление

Физическое удаление заведений из основной базы запрещено для обычной админской операции.

`Удалить/скрыть` = `active = FALSE`.

Восстановление = `active = TRUE`.

Это сохраняет старые бронирования и историю.

## Целевая архитектура

```text
Google Sheets
  ├─ venues
  ├─ rooms
  ├─ photos
  └─ bookings
       ↑
      n8n
   ┌───┼──────────────┐
   │   │              │
Catalog API      AI Agent       Admin API
   │   │              │
   └── Пар-Гид frontend ── Admin UI
```

## План миграции без простоя

### Этап 0 — текущее состояние

`main` продолжает читать `venues.js`. Ничего не переключаем.

### Этап 1 — база

1. Перенести текущие данные `venues.js` в лист `venues`.
2. Проверить количество и поля по каждой записи.
3. Перенести реальные фото в `photos`.
4. Если у объекта несколько залов — создать записи в `rooms`.

### Этап 2 — n8n API

Создать независимые endpoints/workflows:

- `GET catalog` — только `active=TRUE`;
- `GET venue/:id`;
- `POST booking`;
- защищенные admin endpoints для create/update/disable/restore;
- AI Agent читает те же `venues/rooms`.

### Этап 3 — shadow test

Рабочий frontend продолжает читать `venues.js`.

Одновременно тестовая ветка читает Catalog API. Сравнить:

- число заведений;
- названия;
- адреса;
- цены;
- фильтры;
- координаты;
- фото;
- карточки.

### Этап 4 — переключение

Только после успешного сравнения заменить источник каталога во frontend на n8n Catalog API.

На переходный период сохранить fallback на локальный `venues.js`, чтобы приложение не оставалось пустым при недоступности API.

### Этап 5 — админка

После включения API подключить отдельную админку. Она не должна иметь прямого доступа к Google credentials. Все записи выполняются через защищенный n8n Admin API.

## Правила безопасности

- не хранить Google/n8n credentials во frontend;
- административные endpoints защищать авторизацией;
- публичный Catalog API — только чтение;
- public booking endpoint валидирует входные данные;
- AI не должен подтверждать реальную доступность, если workflow ее фактически не проверил;
- при ошибке нового API рабочий каталог должен иметь fallback до завершения миграции.
