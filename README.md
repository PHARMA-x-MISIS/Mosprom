### Промсеть — внутренняя соцсеть для предприятий и молодёжи

Промсеть — внутренняя соцсеть для связи предприятий Москвы со школьниками, студентами и молодыми специалистами. Платформа объединяет сообщества по направлениям, реальные мини-кейсы, наставников и офлайн-мероприятия, превращая интерес в проверяемый опыт и портфолио.

- **Участники**: умная лента по интересам, Q&A с быстрыми ответами, офлайн-туры и мастер-классы, портфолио с «proof-of-work».
- **Предприятия**: собственные сообщества, объявление кейсов и событий, поиск талантов по навыкам и выполненным заданиям.

Используемые технологии: FastAPI, React Native (Expo), PostgreSQL, Docker, ML-шлюз (эмбеддинги/рекомендации), OAuth VK.

Уникальность: профессиональные клубы с прозрачными правилами и «доступом по достижению», портфолио с проверяемыми результатами, ML‑триаж вопросов к наставникам и рекомендации кейсов «под силу», геймификация с баллами сообществ и призами за реальную активность.


### Архитектура

Сервисно-модульная архитектура с отдельными контейнерами:

- **Backend API (FastAPI)**: аутентификация (JWT, OAuth VK), сообщества, посты, комментарии, лайки, загрузка медиа, статичная раздача `uploads/`.
- **ML‑сервис**: классификация/теги и рекомендации сообществ/постов по навыкам и простому косинусному сходству, кеширование справочников.
- **Tech Support бот**: шлюз к GigaChat для справки/подсказок внутри приложения (безопасные подсказки, санитайзинг HTML).
- **Frontend (Expo/React Native)**: мобильный клиент с умной лентой, профилем, сообществами и созданием постов.
- **PostgreSQL**: основное хранилище данных.

Схема взаимодействий (упрощённо):

```
[Mobile App (Expo RN)] ──▶ [Backend API (FastAPI)] ──▶ [PostgreSQL]
         │                        │
         │                        └──▶ [Uploads (/uploads)]
         ├──────────────▶ [Tech Support (GigaChat)]
         └──────────────▶ [ML Service (predict/reco)] ──▶ [Backend API] (каталоги)
```


### Директории

- `api/` — Backend API (FastAPI): модели, схемы, CRUD, роуты, OAuth VK, загрузка файлов.
- `ml/` — ML‑сервис: артефакты, API `/predict`, `/predict_communities`, `/predict_posts`.
- `tech_support/` — сервис техподдержки (GigaChat): эндпоинты `/chat`, `/health`, `/selftest`.
- `frontend/` — мобильный клиент (Expo Router, React Native, TypeScript, NativeWind, Zod, Axios).
- `docker-compose.dev.yaml`, `docker-compose.prod.yaml` — оркестрация окружений.


### Backend API (FastAPI)

- Точки входа: `api/app.py` (FastAPI приложение), `api/main.py` (uvicorn dev‑запуск).
- БД: `sqlalchemy.ext.asyncio` + `asyncpg`; инициализация при старте (`Base.metadata.create_all`).
- Безопасность: `bcrypt` для паролей, JWT (`HS256`) с `ACCESS_TOKEN_EXPIRE_MINUTES`.
- OAuth VK: выдача state, обмен `code`→`access_token`, подтяжка профиля, линковка/создание пользователя.
- Загрузка файлов: `api/core/file_upload.py` с валидацией типов/размера, сохранение в `UPLOAD_DIR`, доступ через `/uploads`.
- CORS: сейчас `allow_origins=["*"]` (ограничьте в проде).
- Основные роуты:
  - `GET /health` — проверка живости
  - `POST /users/register`, `POST /users/login`, `GET/PUT/DELETE /users/me`, `POST /users/me/change-password`
  - `GET /users/me/skills`, `POST /users/me/skills`, `DELETE /users/me/skills/{name}`, `GET /users/skills/all`
  - `GET /users/auth/vk`, `GET /users/auth/vk/url`, `GET /users/auth/vk/callback`, `POST /users/auth/vk`
  - `POST/GET/PUT/DELETE /communities`, участники/модераторы, аватары, `join/leave`
  - `POST/GET/PUT/DELETE /posts`, лайки `like/unlike`, фото к постам
  - `POST/GET/PUT/DELETE /comments`, реплаи

Порты/пути:
- Dev: `http://localhost:8000` (uvicorn), статика `/uploads/*`.
- Prod (compose): публикация на `8001`.

Примеры переменные окружения backend хранятся в .example.env 


### ML‑сервис

- Приложение: `ml/server.py` (FastAPI), запуск на `API_PORT` (по умолчанию 8100).
- Артефакты: `ml/artifacts/tfidf_logreg_ovr.joblib`, `ml/artifacts/labels.json` (опц. `thresholds.npy`).
- Классификация: `POST /predict` → `List[str]` меток.
- Рекомендации:
  - `POST /predict_communities` → список `{id, score}` (по навыкам пользователя)
  - `POST /predict_posts` → аналогично по постам
- Источник каталога для рекомендаций: `MP_API_BASE` (по умолчанию указывает на Backend API), кеш TTL `MP_API_CACHE_TTL`.


### Tech Support (GigaChat)

- Приложение: `tech_support/main.py` (FastAPI), эндпоинты: `GET /health`, `GET /selftest`, `POST /chat`.
- Поддержка: аккуратный system‑prompt (RU), преобразование HTML/escape, ретраи, кеш токена.
- SSL: можно указать CA либо (на свой риск) отключить проверку `INSECURE_SSL=true`.


### Frontend (Expo/React Native)

- Стэк: Expo Router, React Native 0.81, React 19, NativeWind (Tailwind), Zod, Axios.
- Структура экранов: `frontend/app/(auth|main|post)/*`, контексты в `src/lib/contexts/*`.
- API‑клиент: `frontend/api/api.ts` (Axios) — сейчас `baseURL='https://mosprom.misis-team.ru'`. Для локалки поменяйте на Backend URL (`http://localhost:8000`).



### Docker Compose

### Локальный запуск через Docker (dev)

Репозиторий: [PHARMA-x-MISIS/Mosprom](https://github.com/PHARMA-x-MISIS/Mosprom.git)

1. Клонируйте и перейдите в папку проекта:
```
git clone https://github.com/PHARMA-x-MISIS/Mosprom.git
cd Mosprom
```
2. Создайте `.env` в корне (на основе `.example.env`).
3. Запустите сервисы (БД, Backend, ML, Tech Support):
```
docker compose -f docker-compose.dev.yaml up --build
```
4. Порты:
- Backend: http://localhost:8000
- ML: http://localhost:8100
- Tech Support: http://localhost:8200
- Postgres: localhost:5433

5. Фронтенд запускается отдельно:
   - установите `baseURL` в `frontend/api/api.ts` на `http://localhost:8000`
```

npm start

6. Далее отсканируйте QR-код телефоном, на котором предварительно установлено приложение "Expo Go". Готово!
```

Dev окружение:
```
docker compose -f docker-compose.dev.yaml up --build
```
- Postgres: 5433→5432
- Backend: 8000
- ML: 8100
- Tech Support: 8200

Prod окружение:
```
docker compose -f docker-compose.prod.yaml up --build -d
```
- Backend публикуется на 8001, ML на 8100, Tech Support на 8200.

Тома:
- `postgres-data` — данные БД
- `./uploads` — пользовательские файлы (раздаются через `/uploads`)




### Health‑проверки и пример запросов

Проверки:
- `GET http://localhost:8000/health`
- `GET http://localhost:8100/` → `{ "status": "ok" }`
- `GET http://localhost:8200/health`


### Безопасность и прод

- Задайте надёжный `SECRET_KEY`, ограничьте CORS, храните секреты вне репозитория.
- Включите резервное копирование томов БД и `uploads/`.
- Для OAuth VK используйте корректный `VK_REDIRECT_URI` для мобайла/SPA.