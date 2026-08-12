# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Команды

Все команды запускаются из папки `app/`:

```bash
npm run dev      # Запустить dev-сервер (Vite)
npm run build    # Сборка для продакшена
npm run lint     # ESLint
npm run preview  # Превью продакшен-сборки
```

Тесты отсутствуют.

## Правило по Git

**Никогда не пушить на GitHub без явного запроса пользователя.** Инструкция: «не надо пушить без моего запроса».

## Контекст проекта

**BI DAMU** — платформа карьерного развития для ИТР-сотрудников BI Group (~4 000 человек). React-прототип, созданный на основе референсного продукта «LEVEL UP». Все данные сейчас захардкожены — бэкенда нет.

Навигация: Моя страница → Моё развитие → Карьерный трек → Должности → Навыки.

## Архитектура

**Стек:** React 19 + Vite + React Router v7. TypeScript не используется. CSS-модулей нет — все стили задаются через инлайн `style={{}}`. Tailwind подключён, но почти не используется.

**Точка входа:** `app/src/App.jsx` — настраивает `ProfileProvider` и маршруты React Router.

**Лэйаут:** `app/src/components/Layout.jsx` — сворачиваемый сайдбар + `<Outlet />` для контента страниц. TopNav вынесен отдельно (`TopNav.jsx`). Кнопка сворачивания сайдбара позиционируется через `position: fixed` на границе между сайдбаром и основным контентом.

**Глобальное состояние:** `app/src/ProfileContext.jsx` — предоставляет `overallScore` (рейтинг профиля) и `isDark` / `toggleDark` (тёмная тема через класс `html.dark` + CSS filter — временный хак, нормальная тёмная тема запланирована позже).

**Хук персистентности:** `app/src/hooks/useLocalStorage.js` — `useLocalStorage(key, default)` — используется вместо `useState` везде, где состояние должно сохраняться после перезагрузки.

### Ключи localStorage

| Ключ | Где используется | Назначение |
|------|-----------------|------------|
| `careermap:goal` | CareerMap, MyPlans, CareerPlanDetail | Текущая карьерная цель (по умолчанию: `'Foreman A'`) |
| `careermap:zoom` | CareerMap | Масштаб карты |
| `careermap:tour-seen` | CareerMap | Завершён ли онбординг-тур |
| `theme:dark` | ProfileContext | Переключатель тёмной темы |
| `admin:skills` | SkillsCatalog, SkillContentEditor, Skills, SkillDetail, MySkills (через `mySkillsData.js`) | Каталог навыков — единственный источник данных о навыках, см. «Каталог навыков» ниже |
| `admin:positions` | Positions, PositionContentEditor, Titles | Каталог должностей — грейды, «Общие требования», ссылки на Базу знаний, см. «Каталог должностей» ниже |
| `admin:req-categories` | Positions, PositionContentEditor, Titles | Общий справочник категорий «Общих требований» |
| `myskills:base` / `myskills:custom` | `useSkillFavorite` (MySkills, Skills, SkillDetail) | Навыки в профиле сотрудника: карьерный трек / добавленные самостоятельно |

Таблица не исчерпывающая — есть и другие ключи (`admin:requirements`, `hr:*`, `assessment:*`, `dashboard:*`, `auth:roles`), см. по коду через `useLocalStorage`.

### Логика CareerMap (`app/src/pages/CareerMap.jsx`)

Самый большой и сложный файл. Два режима отображения, управляемых состоянием `buildTo`:
- `buildTo === null` → **стандартный вид**: показывает Foreman A (прошлое) → Foreman B (текущая) → savedGoal (цель), по центру
- `buildTo !== null` → **режим исследования**: показывает ветвящиеся пути через DFS по `CAREER_GRAPH`

Ключевые константы (захардкожены в начале файла):
- `CURRENT_POSITION = 'Foreman B'` — должность текущего пользователя
- `CAREER_GRAPH` — список смежности, определяющий допустимые карьерные переходы. Порядок Foreman: C (junior) → B (middle) → A (senior) — как школьные оценки, A лучше C
- `NEXT_GOAL_OPTIONS` — с каких позиций можно перейти на какие (используется для показа кнопки «Установить карьерную цель»)
- `GOAL_TO_PLAN_ID` — связывает целевую должность с id плана для навигации на `/plans`

Поиск путей: `findAllPaths(from, to)` — DFS по `CAREER_GRAPH`. `computeLayout(paths)` разбивает пути на `{prefix, branches, suffix}` для визуализации ветвлений. `ForkConnector` рисует SVG-линии развилок между карточками.

Кнопка «Установить карьерную цель» появляется только на карточках из `NEXT_GOAL_OPTIONS[CURRENT_POSITION]` и только если это не текущая цель. Диалог подтверждения использует локальное состояние `confirmGoal`.

### MyPlans / CareerPlanDetail

`app/src/pages/MyPlans/index.jsx` — читает `careermap:goal` из localStorage и динамически формирует название активного плана («Стать {savedGoal}»). При навигации из CareerMap передаётся `{ state: { planId } }` через React Router для автоматического открытия нужного плана.

`app/src/pages/MyPlans/CareerPlanDetail.jsx` — три вкладки: требования к навыкам, план обучения, готовность к оценке. Вкладка готовности считает обязательные пункты из `LEARNING_PLAN` (из `careerPlan1.js`), исключая категорию `'Рекомендуемые курсы'` и пункты, в названии которых есть `'казахский'` (учитывается отдельно).

### Каталог навыков (`app/src/data/skillsCatalog.js`)

Единственный источник правды по навыкам во всём прототипе (объединено 07.08.2026 — раньше `/admin/skills`, `/skills`, «Мои навыки», `Requirements.jsx`, `Titles.jsx`, `careerPlan1.js` и другие экраны хардкодили свои несовпадающие списки названий/категорий). Экспортирует:
- `CATEGORIES` — 8 категорий, порядок используется везде, где нужно сгруппировать навыки одинаково
- `INITIAL_SKILLS` — 46 навыков: `{id, name, category, approver, description, levels, materials}`. `levels` — по одному объекту на 1–4: `{description, link}` для Базового/Среднего (ссылка на курс BILIM), `{description, testId}` для Продвинутого (привязка к `data/testlabTests.js`), `{description}` для Эксперта. `materials` — `{knowledgeBase, mandatoryPath}`, каждый `{title, url}`
- `categoryOf(name)` — хелпер, вычисляет категорию навыка по имени; используют все экраны, которым нужно сгруппировать свой локальный список навыков по тем же категориям (`mySkillsData.js`, `careerPlan1.js`, `CareerPlanDetail.jsx`, `Titles.jsx`) — так название/категория никогда не расходятся с каталогом
- `emptyLevels()`/`emptyMaterials()` — дефолт для нового навыка без контента

Контент (описание, по уровням, материалы) реально заполнен только для одного демо-навыка (`BIM-технологии (Revit)`) — для остальных 45 пустой, показывается плейсхолдер «не заполнено администратором». Редактируется в админке: `/admin/skills/:id` (`SkillContentEditor.jsx`).

Экраны вроде `Requirements.jsx` (матрица должность×уровень), `Titles.jsx` (требования по грейдам), `careerPlan1.js`/`CareerPlanDetail.jsx` (план развития), `Assessment/index.jsx`, `HR/AssessmentEntry.jsx`, `MyPlans/index.jsx`, `MyDashboard.jsx` — держат свои локальные данные (уровень/цель/статус/результат аттестации и т.п., это законно другая сущность), но названия навыков в них обязаны совпадать со строками из `INITIAL_SKILLS` — иначе `categoryOf()` вернёт `undefined` и запись потеряется при группировке.

**Навигация «Мои навыки» → «Навыки»:** значок ⓘ у навыка в `MySkills.jsx` делает `navigate('/skills', { state: { openSkill: { name, category } } })` — `Skills/index.jsx` читает `location.state?.openSkill` при монтировании и сразу открывает `SkillDetail` нужного навыка (тот же паттерн, что и `{ state: { planId } }` из CareerMap → MyPlans, см. ниже).

### Справочник тестов TestLab (`app/src/data/testlabTests.js`)

`INITIAL_TESTLAB_TESTS` — статический список `{id, name}`, пока без интеграции с TestLab. Используется только на вкладке «Продвинутый» в `SkillContentEditor.jsx` (админ выбирает тест из списка через `<select>`, привязка сохраняется как `testId` в `skillsCatalog.js`) и в `SkillDetail.jsx` (показать сотруднику, каким тестом подтверждается уровень 3). Подробности механики подтверждения — [TASKS.md](TASKS.md#логика-подтверждения-навыков-по-уровням).

### Каталог должностей (`app/src/data/positionsCatalog.js`)

Единый источник по должностям (объединено 12.08.2026 — раньше `Titles.jsx` держал три своих хардкода: `LEVELS` с грейдами, `GEN_REQS` с текстами «Общих требований» и `KB_LINKS` со ссылками, а в `Admin/Positions.jsx` был отдельный список, и грейды по одной должности расходились между экранами). Экспортирует:
- `INITIAL_POSITIONS` — 11 должностей: `{id, name, grade, track, employeeType, isDamuEnabled, description, kbUrl, generalReqs}`. `generalReqs` — `{categoryId: текст}`
- `INITIAL_REQ_CATEGORIES` — категории «Общих требований», **общий справочник для всех должностей** (6 штук). Добавление категории делает её обязательной у каждой должности
- `TRACKS`, `missingReqs(position, categories)`, `isComplete(position, categories)` — последние два считают незаполненные категории (пустая строка = не заполнено)

**Грейд — только чтение**, источник правды HRMS (Kafka). Админ его не редактирует: поля нет в форме, в таблице выводится с подсказкой. Набор: Foreman D=13 → C=14 → B=15 → A=16 → Site Manager=17 → Deputy PM=18 → PM=19.

**Обязательность заполнения** («без шахматки»): `PositionContentEditor.jsx` не даёт сохранить должность, пока пустая хотя бы одна категория (кнопка «Сохранить» задизейблена, при попытке — список незаполненных). `Positions.jsx` показывает счётчик «5/6» по каждой должности и баннер со списком незаполненных. На `/titles` пустая ячейка выводится как «Не заполнено», а не молча пустой.

Тексты заполнены только для Foreman C/B/A и Site Manager — те 4 должности, что показываются на `/titles` (`SHOWN_POSITIONS`). Остальные 7 в админке видны как «0/6».

### Файлы данных

`app/src/data/careerPlan1.js` — захардкоженный план обучения для перехода Foreman B → Foreman C. Категории берутся из `skillsCatalog.js` через `categoryOf()` (см. выше), не свои. Статусы пунктов: `'done'`, `'in-progress'`, `'not-started'`.

### Страница Должности (`app/src/pages/Titles.jsx`)

Сравнительная таблица для 4 уровней (Foreman A/B/C, Site Manager). Два раздела отображаются как единый скролл (в стиле лендинга) с кнопками-якорями для перехода: «Общие требования» и «Требования к навыкам». Якорный скролл: `ref.getBoundingClientRect().top + window.pageYOffset - 72`.

## Стилевые соглашения

- Все стили — инлайн `style={{}}`. CSS-классы используются только для иконок `material-symbols-outlined` и нескольких hover-классов сайдбара, добавляемых через тег `<style>`
- Цветовая палитра: основной `#4361ee` (синий), тёмный `#0f1923`, вторичный текст `#7a8fa0`, граница `#e8edf2`, поверхность `#fff`, фон страницы `#f5f6fa`
- Тёмная тема реализована как `filter: invert(1) hue-rotate(180deg)` на `html.dark` — временный хак, полноценная реализация через CSS-переменные запланирована позже
