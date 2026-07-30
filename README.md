# Play In Code

Единое Next.js-приложение для сайта школы и двуязычного теста профиля ребёнка.

## Маршруты

- `/` и `/en` — русский и английский лендинг;
- `/privacy-policy`, `/terms`, `/consent-to-data-processing` и их EN-версии;
- `/profile-test` — единый вход в тест по персональному коду;
- `/t/[token]` — прежняя персональная ссылка теста (сохранена для совместимости);
- `/school` — защищённая панель школы;
- `/api/test/access`, `/api/test/[token]`, `/api/school`, `/api/school/auth` — внутренние API.

Лендинг, тест, панель и API собираются одним Next.js-проектом. Внешних rewrites
и отдельного Cloudflare-приложения нет.

## Локальный запуск

Требуются Node.js 20.9+ и npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Сайт будет доступен на [http://localhost:3000](http://localhost:3000).
Для локальной разработки используется встроенная PostgreSQL-совместимая база
PGlite в `.data/`; production использует Neon.

## Переменные окружения

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=77029003890
NEXT_PUBLIC_WHATSAPP_DISPLAY=+7 702 900 3890
NEXT_PUBLIC_SITE_URL=https://school.playincode.com

NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_YANDEX_METRIKA_ID=
NEXT_PUBLIC_GSC_VERIFICATION=

# Vercel's Neon integration uses playincode_db_DATABASE_URL.
# DATABASE_URL remains supported for local development and other providers.
playincode_db_DATABASE_URL=postgresql://user:password@host/database?sslmode=require
APP_BASE_URL=https://school.playincode.com
ADMIN_PASSWORD=replace-with-a-strong-admin-password
SESSION_SECRET=replace-with-at-least-32-random-characters
LINK_ENCRYPTION_KEY=replace-with-a-different-random-secret
```

`SESSION_SECRET` и `LINK_ENCRYPTION_KEY` должны быть разными случайными
секретами. Их можно создать командой `openssl rand -base64 32`.

Для localhost вместо Neon используется:

```env
DATABASE_URL=file:.data/profile-test
APP_BASE_URL=http://localhost:3000
```

## База данных

Схема описана в `src/db/schema.ts`, а проверяемые SQL-миграции находятся в
`drizzle/`.

```bash
npm run db:generate
npm run db:migrate
```

`db:migrate` нужно выполнить после создания `.env.local` и до первого запуска
панели/теста. Для production значение `playincode_db_DATABASE_URL` выдаёт Neon
(также поддерживается стандартное `DATABASE_URL`). Таблицы во
время HTTP-запросов не создаются.

## Структура

- `src/app` — страницы и API Next.js;
- `src/features/profile-test` — контент RU/EN, клиенты теста и панели,
  scoring, шифрование и серверная авторизация;
- `src/db` — Neon/Drizzle;
- `src/components`, `src/content`, `src/lib` — лендинг;
- `drizzle` — PostgreSQL-миграции;
- `public` — статические файлы.

Стили теста изолированы от лендинга. Аналитика подключается только внутри
языкового layout лендинга и не запускается на `/profile-test`, `/t/...` или
`/school`.

## Проверки

```bash
npm run lint
npm run type-check
npm test -- --runInBand
npm run build
```

## Vercel

Проект рассчитан на один существующий Vercel project и домен
`school.playincode.com`.

Перед Preview deployment:

1. подключить Neon из Vercel Marketplace;
2. добавить серверные секреты и `APP_BASE_URL`;
3. применить `npm run db:migrate`;
4. проверить Preview;
5. только после проверки перевести production на новый deployment.

Старая D1-база не переносится. После запуска в `/school` создаётся новый пакет
ссылок.

## Безопасность теста

- открытый токен хранится только в AES-GCM-зашифрованном виде, отдельно хранится
  его SHA-256-хеш;
- ребёнок не получает A–D, профиль или рекомендации из API;
- панель использует HttpOnly cookie, проверку Origin и ограничение попыток входа;
- ФИО, телефоны, класс и IP ребёнка не сохраняются;
- персональные страницы и панель исключены из индексации;
- удаление записи сразу делает её ссылку недействительной.
- общий адрес `/profile-test` открывает нужный тест после проверки уникального
  кода; старые адреса `/t/[token]` продолжают работать;
- перебор кодов ограничен по IP, а после серии ошибок пользователь получает
  рекомендацию обратиться к менеджеру.
