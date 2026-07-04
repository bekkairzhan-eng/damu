# Техническое задание — Бэкенд BI Damu

**Версия:** 1.0  
**Проект:** BI Damu — платформа карьерного развития ИТР-сотрудников BI Group  
**Аудитория:** Backend-разработчики  
**Фронтенд:** React-прототип готов, все экраны реализованы. Задача бэкенда — заменить хардкод на реальные данные. API-контракты выведены из структуры прототипа.

---

## 1. Контекст и философия

**BI Damu** — инструмент карьерного развития для ~4000 ИТР-сотрудников. Сотрудник видит свой профиль, карьерный план, навыки и трек. Никакой операционной логики (апрувы, задачи, эскалации) в Damu нет — всё через UnityBPM.

### Разделение ответственности

| Система | Что делает |
|---------|-----------|
| **Damu** | Витрина + хранилище данных развития. Профиль, планы, навыки, треки, рейтинг |
| **UnityBPM** | Вся операционка: задачи, апрувы навыков, аттестация, эскалации, почта |
| **HRMS** | Источник правды: профиль сотрудника, орг. структура, корп. активность, зарплатные вилки |
| **LMS** | Собственный продукт. Публикует события о завершении курсов в Kafka |
| **Keycloak** | Авторизация и роли |
| **SuperApp** | Заглушка на MVP. В будущем — источник одного компонента рейтинга |
| **BI Life** | Мобильное приложение BI Group. Встраивает Damu через WebView (та же схема, что уже работает для 2 других систем) |

---

## 2. Стек

| Компонент | Технология | Назначение |
|-----------|-----------|-----------|
| Язык / фреймворк | .NET 8/9 + ASP.NET Core | Бэкенд API |
| ORM | Entity Framework Core | Работа с БД |
| БД | PostgreSQL | Основное хранилище |
| Кэш | Redis | Справочники (навыки, должности, граф) |
| Очередь | Kafka | События от LMS, уведомления |
| Файлы | S3 | Аватары, сертификаты |
| Auth | Keycloak | JWT-токены, роли |
| BPM | UnityBPM | Webhook in/out |
| Фронтенд | React 19 + Vite | Прототип готов |
| Деплой | Kubernetes | Все окружения (dev / staging / prod) |
| API | REST (JSON) | — |

---

## 2.1 Структура проекта (.NET)

```
BiDamu.sln
├── src/
│   ├── BiDamu.Api/               # ASP.NET Core — контроллеры, middleware, Program.cs
│   ├── BiDamu.Application/       # Use cases, сервисы, интерфейсы
│   ├── BiDamu.Domain/            # Entities, enums, domain events
│   ├── BiDamu.Infrastructure/    # EF Core, Redis, Kafka, HRMS-клиент, S3
│   └── BiDamu.Contracts/         # DTO запросов/ответов (record-типы)
└── tests/
    └── BiDamu.Tests/
```

---

## 2.2 NuGet-пакеты

```xml
<!-- ASP.NET Core / Auth -->
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.*" />

<!-- EF Core + PostgreSQL -->
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.*" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.*" />

<!-- Redis -->
<PackageReference Include="StackExchange.Redis" Version="2.*" />
<PackageReference Include="Microsoft.Extensions.Caching.StackExchangeRedis" Version="8.*" />

<!-- Kafka -->
<PackageReference Include="Confluent.Kafka" Version="2.*" />

<!-- S3 -->
<PackageReference Include="AWSSDK.S3" Version="3.*" />

<!-- Keycloak JWT (JWKS auto-discovery) -->
<PackageReference Include="Microsoft.IdentityModel.Protocols.OpenIdConnect" Version="7.*" />

<!-- Планировщик батча -->
<PackageReference Include="Hangfire.AspNetCore" Version="1.*" />
<PackageReference Include="Hangfire.PostgreSql" Version="1.*" />

<!-- Утилиты -->
<PackageReference Include="Mapster" Version="7.*" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.*" />
<PackageReference Include="Serilog.AspNetCore" Version="8.*" />
```

---

## 3. Авторизация

### Схема

Все запросы содержат `Authorization: Bearer <token>`. Токен — JWT, выданный Keycloak.

Бэкенд **обязан** валидировать токен на каждом запросе и извлекать из него:
- `sub` — идентификатор сотрудника (совпадает с `employee.id`)
- `realm_roles` — список ролей (`employee`, `hr`, `admin`)

> **Важно:** `RoleGuard` на фронтенде — это только UX (скрыть меню). Серверная проверка роли обязательна на каждом эндпоинте независимо от клиента.

### Настройка Keycloak JWT в Program.cs

```csharp
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Keycloak автоматически отдаст публичные ключи через JWKS
        options.Authority = builder.Configuration["Keycloak:Authority"];
        // например: https://keycloak.bi.group/realms/bidamu

        options.Audience = builder.Configuration["Keycloak:Audience"];
        // например: bidamu-api

        options.RequireHttpsMetadata = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            RoleClaimType = "realm_roles" // роли из Keycloak
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("EmployeeOnly", p => p.RequireRole("employee"));
    options.AddPolicy("HrOnly",       p => p.RequireRole("hr"));
    options.AddPolicy("AdminOnly",    p => p.RequireRole("admin"));
});
```

### Получение employeeId из токена

```csharp
// Расширение — использовать во всех контроллерах
public static class ClaimsPrincipalExtensions
{
    public static Guid GetEmployeeId(this ClaimsPrincipal user)
        => Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException());
}

// В контроллере
[HttpGet("me")]
[Authorize(Policy = "EmployeeOnly")]
public async Task<IActionResult> GetMe()
{
    var employeeId = User.GetEmployeeId(); // из токена, не из запроса
    var profile = await _profileService.GetAsync(employeeId);
    return Ok(profile);
}
```

### Защита Webhook-эндпоинтов

```csharp
// Middleware для /webhooks/* — проверяет X-BPM-Secret
public class BpmWebhookAuthMiddleware(RequestDelegate next, IConfiguration config)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/webhooks"))
        {
            var secret = context.Request.Headers["X-BPM-Secret"].FirstOrDefault();
            if (secret != config["UnityBpm:WebhookSecret"])
            {
                context.Response.StatusCode = 401;
                return;
            }
        }
        await next(context);
    }
}
```

### Матрица доступа к эндпоинтам

| Префикс | Роль | Описание |
|---------|------|---------|
| `/api/me/*` | `employee` | Собственные данные |
| `/api/career-graph` | `employee` | Чтение карьерного графа |
| `/api/positions` | `employee` | Чтение должностей |
| `/api/skills` | `employee` | Чтение каталога навыков |
| `/api/hr/*` | `hr` | Панель HR |
| `/api/admin/*` | `admin` | Панель администратора |
| `/webhooks/*` | без токена (секрет в заголовке) | Входящие события от UnityBPM |

---

## 4. Модель данных

### Мультиязычность

На старте только русский язык. Все текстовые поля (`name`, `description`, `comment`) хранить с поддержкой переводов. Рекомендуемый подход: JSONB-поле `{"ru": "...", "kz": "...", "en": "..."}`. Планируемые языки: RU, KZ, EN, UZ, UA, AZ.

**Реализация JSONB в EF Core (.NET):**

```csharp
// Тип для мультиязычного поля
public class LocalizedString : Dictionary<string, string>
{
    public string Ru => TryGetValue("ru", out var v) ? v : string.Empty;
}

// Entity
public class Skill
{
    public Guid Id { get; set; }
    public LocalizedString Name { get; set; } = new();
    public LocalizedString Category { get; set; } = new();
    public LocalizedString Description { get; set; } = new();
}

// EF Core конфигурация — в OnModelCreating или отдельном IEntityTypeConfiguration
modelBuilder.Entity<Skill>(b =>
{
    b.Property(s => s.Name)
     .HasColumnType("jsonb")
     .HasConversion(
         v => JsonSerializer.Serialize(v, default(JsonSerializerOptions)),
         v => JsonSerializer.Deserialize<LocalizedString>(v, default(JsonSerializerOptions))!);

    // То же для Category и Description
});
```

---

### `clusters`

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `name` | jsonb | `{"ru": "К1 — Инфраструктура"}` |
| `code` | varchar | `K1`, `K2-North`, `K2-South`, `K2-International` |

Данные фиксированные на MVP, но хранить в базе (настраивается Админом в будущем).

---

### `positions`

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `name` | jsonb | `{"ru": "Foreman B"}` |
| `grade` | varchar | Грейд из 1С |
| `description` | jsonb | Текстовое описание должности |
| `salary_min` | numeric | Из HRMS, только чтение |
| `salary_max` | numeric | Из HRMS, только чтение |
| `created_at` | timestamptz | — |

MVP-должности: Foreman A, Foreman B, Foreman C, Foreman D, Site Manager.

---

### `career_graph_edges`

Хранит допустимые карьерные переходы. Настраивается Админом отдельно для каждого кластера.

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `cluster_id` | uuid FK → clusters | — |
| `from_position_id` | uuid FK → positions | Откуда |
| `to_position_id` | uuid FK → positions | Куда |

> Порядок уровней Foreman: D (junior) → C → B → A (senior). Как школьные оценки — A лучше D.

---

### `skills`

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `name` | jsonb | — |
| `category` | jsonb | Категория навыка |
| `description` | jsonb | Описание навыка |
| `created_at` | timestamptz | — |
| `created_by` | uuid FK → employees | Кто создал (Админ) |

Каталог навыков единый для всех кластеров. Различается только требуемый уровень (см. `requirements`).

---

### `requirements`

Матрица: `должность × кластер × навык → требуемый уровень`.

| Поле | Тип | Описание |
|------|-----|---------|
| `position_id` | uuid FK → positions | — |
| `cluster_id` | uuid FK → clusters | — |
| `skill_id` | uuid FK → skills | — |
| `required_level` | smallint | 0 = не требуется, 1–4 = уровень |

PK: `(position_id, cluster_id, skill_id)`.

Пример: "Работа с госдокументацией" — К1 требует уровень 3, К2 — уровень 1.

---

### `employees`

Данные из HRMS. Только чтение в Damu — не редактируется через наш API.

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | Совпадает с Keycloak `sub` |
| `full_name` | varchar | ФИО |
| `photo_url` | varchar | Ссылка на S3 или HRMS |
| `position_id` | uuid FK → positions | Текущая должность |
| `cluster_id` | uuid FK → clusters | Кластер |
| `company_id` | uuid | Компания холдинга |
| `division` | varchar | Дивизион |
| `organization` | varchar | Организация |
| `project_hrms` | varchar | Основной проект из HRMS (только чтение) |
| `tenure_years` | numeric | Стаж |
| `synced_at` | timestamptz | Последняя синхронизация с HRMS |

---

### `employee_skills`

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `employee_id` | uuid FK → employees | — |
| `skill_id` | uuid FK → skills | — |
| `current_level` | smallint | 1–4 — уровень выставленный сотрудником |
| `status` | enum | `self` / `pending` / `confirmed` / `rejected` |
| `confirmed_by` | varchar | Имя апрувера (из BPM-webhook) |
| `confirmed_at` | timestamptz | — |
| `updated_at` | timestamptz | — |

Уникальный: `(employee_id, skill_id)`.

---

### `skill_approval_history`

История всех попыток подтверждения навыка. Хранится в Damu.

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `employee_id` | uuid FK → employees | — |
| `skill_id` | uuid FK → skills | — |
| `level` | smallint | Уровень на который запрашивался апрув |
| `bpm_task_id` | varchar | ID задачи в UnityBPM |
| `decision` | enum | `approved` / `rejected` |
| `approver_name` | varchar | Из BPM-webhook |
| `comment` | text | Комментарий апрувера |
| `decided_at` | timestamptz | — |
| `requested_at` | timestamptz | — |

---

### `career_plans`

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `employee_id` | uuid FK → employees | — |
| `target_position_id` | uuid FK → positions | Целевая должность |
| `status` | enum | `active` / `completed` / `replaced` |
| `created_at` | timestamptz | — |
| `replaced_at` | timestamptz | Когда заменён (если `replaced`) |

У сотрудника всегда один план со статусом `active`. Предыдущие — `replaced` или `completed`.

---

### `plan_learning_items`

Пункты плана обучения (курсы, сертификаты, рекомендации).

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `plan_id` | uuid FK → career_plans | — |
| `title` | jsonb | Название курса / сертификата |
| `category` | enum | `Обязательные курсы` / `Рекомендуемые курсы` / `Сертификаты для повышения` |
| `status` | enum | `not-started` / `in-progress` / `done` |
| `source` | enum | `lms` / `manual` |
| `lms_course_id` | varchar | ID курса в LMS (если `source = lms`) |
| `completed_at` | timestamptz | Дата завершения |

---

### `assessments`

Одна запись = одна попытка аттестации.

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `employee_id` | uuid FK → employees | — |
| `target_position_id` | uuid FK → positions | — |
| `cluster_id` | uuid FK → clusters | — |
| `bpm_process_id` | varchar | ID процесса в UnityBPM |
| `status` | enum | `pending` / `completed` |
| `hr_comment` | text | Общий комментарий HR |
| `submitted_at` | timestamptz | Когда запросил сотрудник |
| `completed_at` | timestamptz | Когда HR завершил |

---

### `assessment_skills`

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `assessment_id` | uuid FK → assessments | — |
| `skill_id` | uuid FK → skills | — |
| `result` | enum | `passed` / `failed` |
| `comment` | text | Комментарий HR по навыку (что подтянуть) |

---

### `employee_projects`

Проекты, добавленные сотрудником вручную. Основной проект — в `employees.project_hrms`.

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `employee_id` | uuid FK → employees | — |
| `title` | varchar | Название проекта |
| `date_from` | date | — |
| `date_to` | date | null = текущий |
| `description` | text | — |
| `created_at` | timestamptz | — |

---

### `rating_weights`

| Поле | Тип | Описание |
|------|-----|---------|
| `component` | enum PK | `skills` / `learning` / `superapp` / `profile` / `corporate` |
| `weight` | smallint | Сумма всех = 100 |
| `updated_at` | timestamptz | — |
| `updated_by` | uuid FK → employees | Кто изменил |

Начальные значения: skills=30, learning=25, superapp=25, profile=10, corporate=10.

---

### `profile_ratings`

Результат ночного батча.

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `employee_id` | uuid FK → employees | — |
| `score` | numeric(3,2) | Итоговый балл 0.00–5.00 |
| `component_scores` | jsonb | `{"skills": 4.1, "learning": 3.8, ...}` |
| `rank_in_position` | integer | Позиция в ранжировании |
| `total_in_position` | integer | Всего сотрудников в скоупе |
| `computed_at` | timestamptz | — |

---

### `notifications`

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `employee_id` | uuid FK → employees | — |
| `type` | enum | `skill_approved` / `skill_rejected` / `plan_updated` / `assessment_completed` |
| `payload` | jsonb | Данные для рендера уведомления |
| `is_read` | boolean | — |
| `created_at` | timestamptz | — |

---

### `audit_log`

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | uuid PK | — |
| `actor_id` | uuid | Кто совершил действие |
| `actor_role` | varchar | `hr` / `admin` |
| `action` | varchar | `assessment.result.submitted`, `skill.created`, `rating.weights.updated` и т.д. |
| `entity_type` | varchar | Тип сущности |
| `entity_id` | uuid | ID изменённой записи |
| `diff` | jsonb | Было → стало |
| `created_at` | timestamptz | — |

Аудит-лог — только запись. Удаление и изменение не предусмотрены.

---

## 5. API Эндпоинты

Базовый URL: `/api/v1`. Все ответы — `Content-Type: application/json`. Ошибки:

```json
{ "error": "NOT_FOUND", "message": "Описание" }
```

Стандартные коды: 200, 201, 400, 401, 403, 404, 422, 500.

---

### 5.1 Профиль сотрудника

#### `GET /api/me`

Возвращает профиль текущего авторизованного сотрудника. Данные из HRMS (синхронизируются по расписанию).

**Response 200:**
```json
{
  "id": "uuid",
  "fullName": "Алексей Иванов",
  "photoUrl": "https://s3.../avatar.jpg",
  "position": { "id": "uuid", "name": "Foreman B" },
  "cluster": { "id": "uuid", "code": "K1", "name": "К1 — Инфраструктура" },
  "company": "BI Construction",
  "division": "Строительство",
  "organization": "БИ Констракшн Север",
  "projectHrms": "Жилой комплекс Аль-Фараби",
  "tenureYears": 3.5
}
```

---

#### `GET /api/me/rating`

Последний рассчитанный рейтинг. Если батч ещё не запускался — 404.

**Response 200:**
```json
{
  "score": 4.3,
  "components": {
    "skills": 4.5,
    "learning": 4.1,
    "superapp": 4.0,
    "profile": 4.8,
    "corporate": 3.9
  },
  "rankInPosition": 12,
  "totalInPosition": 87,
  "computedAt": "2026-07-04T23:00:00Z"
}
```

---

#### `GET /api/me/skills`

Навыки сотрудника с текущим уровнем и статусом подтверждения.

**Response 200:**
```json
{
  "skills": [
    {
      "skillId": "uuid",
      "name": "Управление субподрядчиками",
      "category": "Управление",
      "currentLevel": 3,
      "status": "confirmed",
      "confirmedBy": "Марат Сейткали",
      "confirmedAt": "2026-05-10T14:00:00Z"
    }
  ]
}
```

---

#### `PUT /api/me/skills/:skillId`

Сотрудник выставляет уровень навыка (1 или 2 — без апрува, 3 или 4 — уходит в BPM).

**Request:**
```json
{ "level": 3 }
```

**Логика:**
- Уровень 1–2: записывает `status = self`, апрув не нужен
- Уровень 3–4: записывает `status = pending`, отправляет запрос в UnityBPM (см. раздел интеграций), создаёт запись в `skill_approval_history`

**Response 200:**
```json
{
  "skillId": "uuid",
  "currentLevel": 3,
  "status": "pending"
}
```

---

### 5.2 Карьерный план

#### `GET /api/me/plans`

Список всех карьерных планов сотрудника.

**Response 200:**
```json
{
  "plans": [
    {
      "id": "uuid",
      "targetPosition": { "id": "uuid", "name": "Foreman A" },
      "status": "active",
      "createdAt": "2026-01-15T09:00:00Z",
      "skillsTotal": 18,
      "skillsDone": 12,
      "learningTotal": 8,
      "learningDone": 5,
      "lastAssessmentComment": "Подтяните BIM-технологии до уровня 3",
      "hasUpdatedBanner": false
    }
  ]
}
```

`hasUpdatedBanner: true` — если Админ добавил навык к должности после последнего просмотра плана.

---

#### `GET /api/plans/:planId`

Полная детализация плана.

**Response 200:**
```json
{
  "id": "uuid",
  "targetPosition": { "id": "uuid", "name": "Foreman A" },
  "status": "active",
  "createdAt": "2026-01-15T09:00:00Z",
  "requirements": [
    {
      "skillId": "uuid",
      "name": "BIM-технологии",
      "requiredLevel": 3,
      "currentLevel": 2,
      "status": "confirmed",
      "assessmentComment": "Подтяните до уровня Продвинутый"
    }
  ],
  "learningItems": [
    {
      "id": "uuid",
      "title": "Курс BIM Autodesk",
      "category": "Обязательные курсы",
      "status": "in-progress",
      "source": "lms"
    }
  ],
  "readinessPercent": 67
}
```

`readinessPercent` — доля выполненных обязательных пунктов (исключая `Рекомендуемые курсы`).

---

#### `POST /api/me/goal`

Смена карьерной цели сотрудником. Текущий активный план становится `replaced`, создаётся новый.

**Request:**
```json
{ "targetPositionId": "uuid" }
```

**Валидация:** `targetPositionId` должен быть достижим из текущей должности по карьерному графу кластера сотрудника.

**Response 201:**
```json
{ "planId": "uuid" }
```

---

### 5.3 Карьерный граф

#### `GET /api/career-graph`

**Query params:** `?clusterId=uuid`

Возвращает граф переходов для кластера. Используется фронтендом для построения CareerMap.

**Response 200:**
```json
{
  "clusterId": "uuid",
  "positions": [
    { "id": "uuid", "name": "Foreman D" },
    { "id": "uuid", "name": "Foreman C" }
  ],
  "edges": [
    { "from": "uuid-foreman-d", "to": "uuid-foreman-c" },
    { "from": "uuid-foreman-c", "to": "uuid-foreman-b" }
  ]
}
```

Кэшировать в Redis (инвалидация при изменении Админом).

---

### 5.4 Аттестация (сотрудник)

#### `GET /api/me/assessments`

История всех аттестаций сотрудника.

**Response 200:**
```json
{
  "assessments": [
    {
      "id": "uuid",
      "targetPosition": { "id": "uuid", "name": "Foreman A" },
      "status": "completed",
      "submittedAt": "2026-05-01T10:00:00Z",
      "completedAt": "2026-05-10T16:00:00Z",
      "hrComment": "В целом хороший уровень, подтяните BIM",
      "skills": [
        {
          "skillId": "uuid",
          "name": "BIM-технологии",
          "result": "failed",
          "comment": "Требуется уровень Продвинутый, сейчас Средний"
        }
      ]
    }
  ]
}
```

---

#### `POST /api/me/assessments/request`

Запрос аттестации. Создаёт запись со статусом `pending` и отправляет процесс в UnityBPM.

**Request:**
```json
{ "targetPositionId": "uuid" }
```

**Логика:**
1. Создать запись `assessment` со статусом `pending`
2. Вызвать UnityBPM API: `POST /bpm/process/assessment/start` с `employee_id`, `target_position_id`, `cluster_id`, `assessment_id`
3. Сохранить `bpm_process_id` из ответа BPM

**Response 201:**
```json
{ "assessmentId": "uuid", "status": "pending" }
```

---

### 5.5 Должности и навыки (справочники)

#### `GET /api/positions`

Список всех должностей с зарплатными вилками.

**Response 200:**
```json
{
  "positions": [
    {
      "id": "uuid",
      "name": "Foreman B",
      "grade": "M3",
      "description": "...",
      "salaryMin": 450000,
      "salaryMax": 650000
    }
  ]
}
```

---

#### `GET /api/positions/:positionId/requirements`

**Query params:** `?clusterId=uuid`

Требования к навыкам для должности в кластере.

**Response 200:**
```json
{
  "positionId": "uuid",
  "clusterId": "uuid",
  "requirements": [
    {
      "skillId": "uuid",
      "name": "Управление субподрядчиками",
      "category": "Управление",
      "requiredLevel": 3
    }
  ]
}
```

---

#### `GET /api/skills`

Полный каталог навыков.

**Query params:** `?category=Управление&search=BIM`

**Response 200:**
```json
{
  "skills": [
    {
      "id": "uuid",
      "name": "BIM-технологии",
      "category": "Технические",
      "description": "..."
    }
  ]
}
```

---

### 5.6 Опыт и проекты

#### `GET /api/me/experience`

Полный профиль опыта.

**Response 200:**
```json
{
  "workHistory": [
    { "company": "BI Construction", "position": "Foreman C", "from": "2022-01", "to": "2024-06" }
  ],
  "education": [
    { "institution": "КазНТУ", "degree": "Бакалавр", "year": 2021 }
  ],
  "certifications": [
    { "title": "PMP", "issuer": "PMI", "year": 2023, "fileUrl": "https://s3/..." }
  ],
  "projectHrms": { "title": "ЖК Аль-Фараби", "from": "2025-01" },
  "projectsManual": [
    { "id": "uuid", "title": "Офисный центр Байтерек", "from": "2024-03", "to": "2025-01", "description": "..." }
  ],
  "corporateActivity": {
    "agreementIndex": 4.2,
    "eventsCount": 8
  }
}
```

---

#### `POST /api/me/projects`

Добавить проект вручную.

**Request:**
```json
{
  "title": "Офисный центр Байтерек",
  "dateFrom": "2024-03-01",
  "dateTo": "2025-01-01",
  "description": "..."
}
```

**Response 201:** `{ "id": "uuid" }`

---

#### `PUT /api/me/projects/:projectId`

Обновить проект. Доступно только для проектов с `source = manual`.

---

#### `DELETE /api/me/projects/:projectId`

Удалить проект. Доступно только для проектов с `source = manual`.

---

### 5.7 Уведомления

#### `GET /api/me/notifications`

**Query params:** `?unreadOnly=true`

**Response 200:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "skill_approved",
      "payload": { "skillName": "BIM-технологии", "level": 3 },
      "isRead": false,
      "createdAt": "2026-07-04T12:00:00Z"
    }
  ],
  "unreadCount": 3
}
```

---

#### `POST /api/me/notifications/:notificationId/read`

Пометить уведомление как прочитанное. **Response 200:** `{}`

#### `POST /api/me/notifications/read-all`

Прочитать все. **Response 200:** `{}`

---

### 5.8 HR-панель

> Все эндпоинты требуют роль `hr`. HR видит только сотрудников своего скоупа (уточнить с бизнесом — компания? кластер?).

#### `GET /api/hr/assessments`

**Query params:** `?status=pending|completed&page=1&limit=20`

**Response 200:**
```json
{
  "total": 45,
  "items": [
    {
      "id": "uuid",
      "employee": {
        "id": "uuid",
        "fullName": "Алексей Иванов",
        "currentPosition": "Foreman B",
        "photoUrl": "..."
      },
      "targetPosition": { "name": "Foreman A" },
      "cluster": { "name": "К1" },
      "status": "pending",
      "submittedAt": "2026-07-01T09:00:00Z"
    }
  ]
}
```

---

#### `GET /api/hr/assessments/:assessmentId`

Детали аттестации для заполнения HR: сотрудник + список навыков для оценки.

**Response 200:**
```json
{
  "id": "uuid",
  "employee": { "id": "uuid", "fullName": "Алексей Иванов" },
  "targetPosition": { "id": "uuid", "name": "Foreman A" },
  "cluster": { "id": "uuid", "name": "К1" },
  "status": "pending",
  "skillsToAssess": [
    {
      "skillId": "uuid",
      "name": "BIM-технологии",
      "requiredLevel": 3,
      "currentLevel": 2
    }
  ]
}
```

---

#### `POST /api/hr/assessments/:assessmentId/result`

HR завершает аттестацию. Записывает результат, уведомляет сотрудника.

**Request:**
```json
{
  "hrComment": "В целом хороший уровень. BIM требует доработки.",
  "skills": [
    { "skillId": "uuid", "result": "passed", "comment": "" },
    { "skillId": "uuid", "result": "failed", "comment": "Требуется уровень 3, сейчас 2" }
  ]
}
```

**Логика:**
1. Обновить `assessment.status = completed`, записать `hr_comment`, `completed_at`
2. Создать записи `assessment_skills`
3. Отправить уведомление `assessment_completed` сотруднику
4. Обновить флаг `hasUpdatedBanner = true` на активном плане сотрудника
5. Записать в `audit_log`

**Response 200:** `{}`

---

### 5.9 Admin-панель

> Все эндпоинты требуют роль `admin`. Все изменения пишутся в `audit_log`.

#### Навыки

`GET /api/admin/skills?page=1&limit=50&search=BIM` — список с пагинацией

`POST /api/admin/skills` — создать навык
```json
{ "name": {"ru": "BIM-технологии"}, "category": {"ru": "Технические"}, "description": {"ru": "..."} }
```

`PUT /api/admin/skills/:id` — обновить навык

`DELETE /api/admin/skills/:id` — удалить навык. Запрещено если навык используется в `requirements` или `employee_skills`. Вернуть 422 с пояснением.

---

#### Должности

`GET /api/admin/positions` — список должностей

`POST /api/admin/positions` — создать должность

`PUT /api/admin/positions/:id` — обновить (описание, грейд). Зарплатные вилки — только из HRMS, вручную не редактируются.

`DELETE /api/admin/positions/:id` — запрещено если есть активные планы или сотрудники на этой должности. Вернуть 422.

---

#### Карьерный граф

`GET /api/admin/career-graph?clusterId=uuid` — рёбра графа для кластера

`POST /api/admin/career-graph/edges` — добавить переход
```json
{ "clusterId": "uuid", "fromPositionId": "uuid", "toPositionId": "uuid" }
```

`DELETE /api/admin/career-graph/edges/:edgeId` — удалить переход. Инвалидировать Redis-кэш.

---

#### Требования к навыкам

`GET /api/admin/requirements?positionId=uuid&clusterId=uuid` — матрица требований

`PUT /api/admin/requirements` — сохранить матрицу (upsert)
```json
{
  "positionId": "uuid",
  "clusterId": "uuid",
  "requirements": [
    { "skillId": "uuid", "requiredLevel": 3 }
  ]
}
```

**Логика после сохранения:** если новый навык добавлен к должности — создать уведомления `plan_updated` всем сотрудникам с этой должностью в данном кластере, поднять `hasUpdatedBanner = true` на их активных планах.

---

#### Веса рейтинга

`GET /api/admin/rating-weights` — текущие веса

`PUT /api/admin/rating-weights` — обновить
```json
{
  "weights": {
    "skills": 30,
    "learning": 25,
    "superapp": 25,
    "profile": 10,
    "corporate": 10
  }
}
```

Валидация: сумма всех значений должна равняться 100. Вернуть 422 если нет.

---

#### Пользователи и роли

`GET /api/admin/users?page=1&limit=50&search=Алексей` — список сотрудников с ролями

`PUT /api/admin/users/:employeeId/roles` — назначить роли
```json
{ "roles": ["employee", "hr"] }
```

Синхронизировать с Keycloak через Admin API. Damu не хранит роли — они читаются из Keycloak-токена.

```csharp
// Keycloak Admin API — назначение ролей
public class KeycloakAdminClient(HttpClient http, IConfiguration config)
{
    // Получить admin-токен (client_credentials)
    private async Task<string> GetAdminTokenAsync()
    {
        var resp = await http.PostAsync(
            $"{config["Keycloak:Authority"]}/protocol/openid-connect/token",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["grant_type"]    = "client_credentials",
                ["client_id"]     = config["Keycloak:AdminClientId"],
                ["client_secret"] = config["Keycloak:AdminClientSecret"]
            }));
        var json = await resp.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("access_token").GetString()!;
    }

    public async Task AssignRolesAsync(Guid userId, IEnumerable<string> roles)
    {
        var token = await GetAdminTokenAsync();
        http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var realm = config["Keycloak:Realm"];
        var baseUrl = config["Keycloak:AdminBaseUrl"]; // https://keycloak.bi.group/admin/realms/{realm}

        // 1. Получить текущие роли пользователя
        // 2. Удалить лишние: DELETE /users/{id}/role-mappings/realm
        // 3. Добавить новые: POST /users/{id}/role-mappings/realm
        // Документация: https://www.keycloak.org/docs-api/latest/rest-api/
    }
}

// Регистрация
builder.Services.AddHttpClient<KeycloakAdminClient>();
```

---

#### Статистика

`GET /api/admin/stats`

**Response 200:**
```json
{
  "totalEmployees": 4000,
  "totalSkills": 84,
  "pendingApprovals": 23,
  "activePlans": 3812,
  "pendingAssessments": 7,
  "clusterBreakdown": [
    { "cluster": "K1", "count": 1200 },
    { "cluster": "K2-North", "count": 900 }
  ]
}
```

---

## 6. Webhooks (входящие от UnityBPM)

Аутентификация: `X-BPM-Secret: <shared_secret>` в заголовке (секрет в env, не в коде).

---

### `POST /webhooks/bpm/skill-approval`

Результат апрува навыка от утверждающего.

**Payload:**
```json
{
  "bpmTaskId": "task-123",
  "employeeId": "uuid",
  "skillId": "uuid",
  "level": 3,
  "decision": "approved",
  "approverName": "Марат Сейткали",
  "comment": "",
  "decidedAt": "2026-07-04T14:30:00Z"
}
```

**Логика:**
1. Найти запись в `skill_approval_history` по `bpm_task_id`
2. Обновить `decision`, `approver_name`, `comment`, `decided_at`
3. Обновить `employee_skills.status = confirmed` (или `rejected`)
4. Создать уведомление `skill_approved` / `skill_rejected` сотруднику
5. Записать в `audit_log`

**Response 200:** `{}`

---

### `POST /webhooks/bpm/assessment-status`

Обновление статуса процесса аттестации из BPM (опционально — для отслеживания прогресса).

**Payload:**
```json
{
  "bpmProcessId": "proc-456",
  "assessmentId": "uuid",
  "status": "hr_assigned",
  "updatedAt": "2026-07-02T10:00:00Z"
}
```

---

## 7. Kafka

### Топики

| Топик | Направление | Описание |
|-------|------------|---------|
| `lms.course.completed` | Потребитель | LMS публикует когда сотрудник завершил курс |
| `damu.notifications` | Производитель | (опционально) Damu публикует уведомления для других сервисов |

---

### Схема события `lms.course.completed`

```json
{
  "employeeId": "uuid",
  "lmsCourseId": "lms-course-789",
  "courseTitle": "BIM Autodesk Revit",
  "completedAt": "2026-07-03T18:00:00Z"
}
```

**Логика обработки:**
1. Найти `plan_learning_items` текущего активного плана сотрудника с `lms_course_id = lmsCourseId`
2. Обновить `status = done`, `completed_at`
3. Если такого пункта нет — залогировать и игнорировать (курс может быть не в плане)

### Реализация Kafka-консьюмера (.NET)

```csharp
// Domain DTO
public record CourseCompletedEvent(
    Guid EmployeeId,
    string LmsCourseId,
    string CourseTitle,
    DateTime CompletedAt);

// BackgroundService — запускается автоматически вместе с приложением
public class LmsKafkaConsumer(
    IServiceScopeFactory scopeFactory,
    IConfiguration config,
    ILogger<LmsKafkaConsumer> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        var consumerConfig = new ConsumerConfig
        {
            BootstrapServers = config["Kafka:BootstrapServers"],
            GroupId           = "bidamu-lms-consumer",
            AutoOffsetReset   = AutoOffsetReset.Earliest,
            EnableAutoCommit  = false
        };

        using var consumer = new ConsumerBuilder<Ignore, string>(consumerConfig).Build();
        consumer.Subscribe("lms.course.completed");

        while (!ct.IsCancellationRequested)
        {
            var result = consumer.Consume(ct);
            try
            {
                var evt = JsonSerializer.Deserialize<CourseCompletedEvent>(result.Message.Value)!;

                using var scope = scopeFactory.CreateScope();
                var service = scope.ServiceProvider.GetRequiredService<ILearningService>();
                await service.MarkCourseCompletedAsync(evt, ct);

                consumer.Commit(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Ошибка обработки lms.course.completed");
                // не коммитим — сообщение будет обработано повторно
            }
        }
    }
}

// Регистрация в Program.cs
builder.Services.AddHostedService<LmsKafkaConsumer>();
```

---

## 8. Интеграция с HRMS

### Синхронизация профилей

HRMS — источник правды. Damu не редактирует данные сотрудников.

**Рекомендуемая схема:** HRMS публикует событие в Kafka при изменении профиля → Damu обновляет `employees`.

**Альтернатива на MVP:** ночной батч `GET <hrms>/api/employees` → upsert в `employees`.

**Поля из HRMS:** `fullName`, `photoUrl`, `positionId` (маппинг по названию должности), `clusterId`, `companyId`, `division`, `organization`, `projectHrms`, `tenureYears`.

**Корпоративная активность:** `GET <hrms>/api/employees/:id/corporate-activity` → `{ agreementIndex, eventsCount }`. Используется в ночном батче рейтинга.

**Зарплатные вилки:** `GET <hrms>/api/positions/salaries` → обновить `positions.salary_min/max`. Раз в сутки.

---

## 9. Рейтинговый батч

Запускается каждую ночь в 02:00 через **Hangfire** (уже в списке NuGet). Пересчитывает рейтинг для всех активных сотрудников.

### Регистрация задания (.NET)

```csharp
// Program.cs
builder.Services.AddHangfire(cfg => cfg
    .UsePostgreSqlStorage(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddHangfireServer();

// Регистрация расписания — однократно при старте приложения
app.UseHangfireDashboard("/hangfire"); // закрыть от внешнего доступа в prod (только admin)

RecurringJob.AddOrUpdate<IRatingBatchService>(
    recurringJobId: "nightly-rating-batch",
    methodCall:     svc => svc.RunAsync(CancellationToken.None),
    cronExpression: "0 2 * * *",  // каждый день в 02:00
    timeZone:       TimeZoneInfo.FindSystemTimeZoneById("Asia/Almaty"));
```

### Алгоритм

```
для каждого сотрудника:

1. skills_score =
     (кол-во навыков со статусом confirmed и current_level >= required_level)
     / (кол-во навыков в requirements для position × cluster)
     × 5.0

2. learning_score =
     (кол-во plan_learning_items со status=done в активном плане)
     / (всего items в плане, кроме категории "Рекомендуемые курсы")
     × 5.0

3. superapp_score = 4.0  // заглушка на MVP, заменить при интеграции

4. profile_score =
     (кол-во заполненных полей профиля)
     / (всего полей профиля)
     × 5.0
   Поля: fullName, photoUrl, education, certifications, workHistory,
         projectHrms или projectsManual (хотя бы один)

5. corporate_score =
     normalize(hrms.agreementIndex)  // перевести в шкалу 0–5
     с учётом eventsCount

6. итоговый score = (
     skills_score    × weights.skills    +
     learning_score  × weights.learning  +
     superapp_score  × weights.superapp  +
     profile_score   × weights.profile   +
     corporate_score × weights.corporate
   ) / 100

записать в profile_ratings (score, component_scores, computed_at)

7. ранжирование: по каждой группе (company_id × cluster_id × position_id)
   отсортировать по score DESC, записать rank_in_position, total_in_position
```

---

## 10. Кэширование (Redis)

| Ключ | TTL | Когда инвалидировать |
|------|-----|---------------------|
| `career-graph:{clusterId}` | 1 час | При изменении рёбер в Admin |
| `positions:all` | 1 час | При изменении должностей |
| `skills:all` | 1 час | При изменении каталога |
| `requirements:{positionId}:{clusterId}` | 1 час | При изменении матрицы |
| `rating-weights` | 24 часа | При изменении в Admin |

### Пример использования (.NET)

```csharp
// Регистрация в Program.cs
builder.Services.AddStackExchangeRedisCache(options =>
    options.Configuration = builder.Configuration["Redis:ConnectionString"]);

// Сервис — паттерн cache-aside
public class CareerGraphService(IDistributedCache cache, AppDbContext db)
{
    private static readonly TimeSpan Ttl = TimeSpan.FromHours(1);

    public async Task<CareerGraphDto> GetAsync(Guid clusterId, CancellationToken ct)
    {
        var key = $"career-graph:{clusterId}";
        var cached = await cache.GetStringAsync(key, ct);

        if (cached is not null)
            return JsonSerializer.Deserialize<CareerGraphDto>(cached)!;

        var graph = await db.CareerGraphEdges
            .Where(e => e.ClusterId == clusterId)
            .ProjectToDto()
            .ToListAsync(ct);

        await cache.SetStringAsync(key,
            JsonSerializer.Serialize(graph),
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = Ttl },
            ct);

        return graph;
    }

    // Вызывать после каждого изменения рёбер в Admin
    public Task InvalidateAsync(Guid clusterId, CancellationToken ct)
        => cache.RemoveAsync($"career-graph:{clusterId}", ct);
}
```

---

## 11. Требования ИБ

- **Токен** — JWT из Keycloak. Хранится на фронте в памяти или httpOnly cookie. В localStorage не хранится.
- **Роли** — валидируются на сервере на каждом запросе. Клиентский RoleGuard — только UX.
- **Скоуп данных** — сотрудник видит только свои данные. `employeeId` берётся из токена, не из query/body.
- **S3** — доступ по подписанным ссылкам с TTL 15 минут. Публичные бакеты запрещены.
- **Webhook-секрет** — `X-BPM-Secret` в env, ротируется вручную при необходимости.
- **Аудит-лог** — все действия admin и hr пишутся в `audit_log`. ФИО и персональные данные в логи не пишутся.
- **SQL-инъекции** — только параметризованные запросы / ORM.
- **Rate limiting** — на эндпоинты `/api/me/assessments/request` и `PUT /api/me/skills/:id` (защита от спама).
- **CORS** — только домен фронтенда.

---

## 12. Нефункциональные требования

| Параметр | Требование |
|----------|-----------|
| Масштаб | ~4000 сотрудников. Пик — утро (09:00–10:00), массовый вход |
| Пагинация | Все списочные эндпоинты с пагинацией на сервере. Клиент не получает всё разом |
| Ответ API | p95 < 300 мс на основные эндпоинты (`/me`, `/plans`, `/career-graph`) |
| Рейтинговый батч | Завершается до 06:00, данные актуальны к началу рабочего дня |
| Доступность | 99.5% в рабочее время (08:00–20:00) |
| Логирование | Структурированные JSON-логи (request_id, employee_id — без ФИО, duration, status) |
| Среды | dev / staging / prod. CI/CD — деплой по push в соответствующую ветку |

---

## 13. Открытые вопросы (требуют ответа бизнеса)

| # | Вопрос |
|---|--------|
| 1 | Скоуп HR: HR видит всех сотрудников или только свою компанию/кластер? |
| 2 | Смена кластера сотрудника (перевод К1 → К2): что с активным планом и историей аттестаций? |
| 3 | Версионирование требований: если Админ изменил требуемый уровень навыка — пересчитывать существующие планы? |
| 4 | Поля для расчёта «заполненность профиля» — какие именно и с каким весом? |
| 5 | Авто-создание плана: как определить «следующую ступень» если у сотрудника нет явного пути вперёд (он на топовой должности)? |
| 6 | Аватары: загружает сотрудник сам через Damu (S3) или только из HRMS? |

---

## 14. Контракт с UnityBPM (зафиксировать на неделе 1)

Перед началом разработки согласовать с командой UnityBPM:

- [ ] Тестовая среда BPM доступна
- [ ] Endpoint для запуска процесса аттестации: URL, метод, payload, auth
- [ ] Endpoint для запроса апрува навыка: URL, метод, payload, auth
- [ ] Формат входящего webhook: заголовок секрета, структура payload
- [ ] Политика retry при недоступности Damu (BPM повторяет webhook N раз?)
- [ ] Формат `bpm_task_id` / `bpm_process_id` (UUID? строка?)
