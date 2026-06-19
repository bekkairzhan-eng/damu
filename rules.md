## Контекст проекта

**Цель:** Создать свой продукт — более простой по UX, но с таким же мощным функционалом, как референсный продукт.

**Референс:** Существующий продукт ориентирован на айтишников, поэтому сложный. Есть скриншоты — их нужно изучить и записать данные сюда.

**Аудитория нашего продукта:** ИТР состав — все сотрудники BI Group

**Подход:** Изучаем скриншоты референса → фиксируем функционал в rules.md → проектируем своё, проще по интерфейсу.

**Масштаб:** ~4 000 сотрудников BI Group (ИТР состав). Небольшой масштаб → всё в одной системе, не дробить. Референс (LEVEL UP) рассчитан на 75 000 пользователей — поэтому там всё раздельно, нам так не нужно.

**Стратегия продукта:**
- Сначала: Карьерные треки (MVP для HRD)
- В будущем: LMS встроить в ту же систему (не отдельный продукт)
- Причина: строители не будут прыгать между системами, нужно одно окно


---

## Референс: LEVEL UP — разбор экранов

**Навигация верхнего уровня:** My Dashboard | My Plans | Career Map | Titles | Skills

---

### 1. My Dashboard (раздел)
Внутри три вкладки: **My dashboard** | **My skills** | **Experience profile**

#### Вкладка 1.1 — My dashboard (главная, первый экран при входе)

**Хэдер:** My dashboard | My plans | Career map | Titles | Skills

**Приветствие:** "Welcome back, [Имя]!" + подзаголовок-мотивация

**Табы профиля:** My skills | Experience profile

**Блок — Directions in focus (приоритетные направления):**
- Карточка цели 1: название цели (напр. "Become Lead Software Engineer"), прогресс плана (%), дедлайн
- Карточка цели 2: Assessment-based development — рекомендации на основе оценки (если нет данных — заглушка)
- Ссылка "My plans" для просмотра всех планов

**Блок — Detected skills waiting for your confirmation:**
- Список навыков, которые система предлагает подтвердить

**Блок — Employee profile score:**
- Круговой индикатор с числовым показателем — оценка полноты/зрелости профиля

**Блок — Notifications (справа):**
- Лента уведомлений (напр. о назначениях, оценках)

**Профиль пользователя (слева):**
- Фото, имя, должность, подразделение
- Ссылки: View my skills / Key demand (граф навыков — визуализация)

---

#### Вкладка 1.2 — My Skills

**Фильтры (левый сайдбар):**
- Level: Novice / Intermediate / Advanced / Expert
- Status: Favourite / Confirmed / Target Skill
- State: Self-declared / Confirmed / Rejected
- Dimensions (категории): Academic Disciplines, Business Functions, Consulting Practices, Engagement Types, Engineering Practices и др.

**Верхний баннер:** статус актуальности профиля навыков + кнопки "Skill legend" и "Add skill"

**Легенда уровней навыка** (цветовая система — зелёные квадраты):
- Каждый навык имеет уровень, отображаемый индикатором (1-4 квадрата)

**Структура навыков по категориям (раскрывающиеся секции):**

1. **Languages (CEFR)** — языки с уровнем по европейской шкале (A1–C2)
   - Пример: English A, English Speaking, Kazakh, Russian

2. **Academic Disciplines** — академические дисциплины
   - Пример: AI, Artificial Intelligence, Clean Code

3. **Leadership & Soft Skills** (~14 навыков)
   - Adaptability, Business Acumen, Communication, Consultancy, Creativity, Developing Others, Diversity & Inclusion, Driving Change, Leadership, Managing Teamwork, Ownership, Presenting, Problem-solving, Diplomacy

4. **Managerial**
   - Interviewing and Hiring, Performance Development, Agile, Kanban, Prototyping, Scrum

5. **Technical / Tool skills** (длинный список)
   - Microsoft Power BI, Power Platform, SQL, Python, REST API, RPA, SCADA, SolidWorks, UIPath и др.

**Механика каждого навыка:**
- Иконка "сердце" (добавить в избранное)
- Цветной индикатор уровня (зелёные квадраты)
- Иконка инфо (описание навыка)
- Метки: звёздочки/иконки — подтверждён / self-declared / требует подтверждения

**Два столбца на экране:**
- Левый — UPDATE SKILLS LEVEL (навыки для обновления уровня)
- Правый — SELF-DECLARED SKILLS (навыки, заявленные самим пользователем)

---

#### Вкладка 1.3 — Experience Profile

**Описание раздела:** агрегирует данные о производственном и непроизводственном опыте, вкладе в корпоративные инициативы, профессиональных достижениях.

**Переключатель:** "Synchronise all timelines" — синхронизировать все временные шкалы

---

**Блок — General Experience (общий опыт):**
- Общий стаж в компании
- Стаж в текущей основной специализации (Primary Skill)
- Текущая и предыдущие должности с датами
- Key Role (ключевая роль)
- Employee Profile Score — числовой рейтинг профиля
- Подтверждённый уровень языка (напр. English B2, дата подтверждения)

---

**Блок — Production Experience (производственный опыт):**

1. **Experience Timeline** — горизонтальная временная шкала:
   - Показывает историю должностей и проектов по времени
   - Цветовое кодирование статусов: Non-Documented / Documented / In Milestone / In Training / In Progress / Proposed / On Vacation / Completed

2. **Workload Chart** — столбчатый график загрузки по кварталам:
   - Показывает занятость на проектах (% от времени) поквартально
   - Легенда: At least Resources / KS Milestone / SW Milestone / On Serving / Triggering / Proposed / On Vacation / Allocated

---

**Блок — Industry Experience:**
- Таблица: отрасль / суботрасль | суммарный опыт | последний опыт | текущие проектные назначения
- Пример строк: Consumer, Energy & Resources, Power & Utilities, Other

---

**Блок — Certificates (сертификаты):**
- Таблица: название | тип (Certificate / Training) | статус (Valid / Expired) | дата выдачи | дата истечения
- Пример: Azure Fundamentals, Power Automate RPA Developer, Azure AI Engineer, C# Bot Developer, Oracle SQL, SAP WM

---

**Блок — Contribution by Categories (вклад по категориям):**
- Временная шкала по кварталам
- Категория "Going Extra Mile" — иконки/бейджи за дополнительный вклад

**Блок — Contribution by Programs (вклад в программы):**
- Referral Program: Referrer — участие в реферальной программе
- Technical Evaluation: Interviewer — участие как интервьюер

**Блок — Learning Programs (программы обучения):**
- Временная шкала участия в обучающих программах (Growing Continuously и др.) — иконки курсов по кварталам

---

### 2. My Plans (раздел)

**Два блока:**

**Recommended for growth** — планы, рекомендованные системой:
- Карточки планов с: названием цели, текущей и целевой должностью, подразделением
- Прогресс-бар: выполнено X из Y пунктов
- Дедлайн "Reach till: дата" (просроченный — красный)
- Пример карточек: "Become Lead Software Engineer" (15/21, до 06 Feb 2027), "Assessment-based development plan" (нет данных — заглушка), "Previous career plan" (18/19, дедлайн прошёл)

**Personal plans** — планы, созданные вручную:
- Кем могут создаваться: сам сотрудник, менеджер, people partner, skill advisor, talent manager
- Кнопка "+ Add plan"
- При создании — модальное окно **"Choose personal plan type"** с типами (чекбоксы):
  - Feedback
  - Mentorship
  - Project
  - Onboarding
  - Contribution
  - OKR
  - KPI
  - Skill vector

**Страница личного плана (после создания):**
- Заголовок: "My personal plan" + иконки редактировать / закрепить
- Тип плана отображается под заголовком (можно изменить)
- Кнопки действий: Share | Delete | Archive | "Created by [имя] 1 minute ago"
- Справа: круговой индикатор прогресса (X/Y) + поле "Reach till" (дедлайн, можно задать)

**Добавление элементов в план — кнопка "Add" (выпадающий список):**
- **Task** — задача
- **Skill** — навык
- **Certificate** — сертификат

Также кнопка **"Add learning resources"** — добавить учебные материалы

**Инструменты:** Add group (группировать элементы) | Select items | Filters

**Модальное окно "Add skill":**
- Поиск по названию навыка
- Табы: All | Selected | Recommended
- Список навыков по категориям (раскрывающиеся): Academic Disciplines → AI → список навыков
- Для каждого навыка: чекбокс + индикатор уровня + поле **Target level** (Not specified / выбрать уровень)
- Кнопка Save

---

**Вкладка "Career eligibility" — текущее соответствие требованиям для повышения:**

Заголовок: "Current eligibility status for [Целевая должность]"
Кнопки: **Share** | **Request Assessment** (подать заявку на оценку)

**Три статуса каждого требования:**
- ✅ Зелёный — выполнено
- ⚠️ Оранжевый — выполнено с оговорками
- ❌ Красный — не выполнено

**Важное примечание (синий баннер):**
- Данные синхронизируются автоматически при изменении требований или опыта сотрудника
- Синхронизация может занимать до **48 часов**

**Структура требований — два столбца: Title requirements | Full Session**

Категории требований:
- **General experience:**
  - Общий стаж в компании (мин.)
  - Employee profile score (мин.)
  - Подтверждённый уровень английского
- **Production experience:**
  - Участие в производственной деятельности (последние 3 месяца)

---

**Детальная страница карьерного плана (по клику на карточку плана):**

Заголовок: "Career plan — [Целевая должность]" + подразделение + дата изменения

Справа: круговой индикатор **Skills progress**

**Три вкладки:**
- **Skills requirements** — требования по навыкам (основная)
- **Learning plan** — план обучения
- **Career eligibility** — соответствие карьерным требованиям

**Баннер-уведомление:** если план обновился — "The content in your plan has been updated" + кнопка "View changes"

**Инструменты:** Add | Add learning resources | Skill legend | Show skill gaps only | Skills added auto update | Select items

**Навыки сгруппированы по категориям (раскрывающиеся секции):**
- Practices (напр. BPA Development, DB Development General, Solution Architecture)
- Programming language (.NET, Java, JavaScript, Python)
- Technologies (UiPath, WorkFusion, Blue Prism, Automation Anywhere)
- Academic Disciplines (English B2)
- Leadership & Soft Skills (Communication и др.)
- Ungrouped (Consultancy, Ownership, Adaptability, Leadership, Being a Team Player и др.)

**Для каждого навыка:**
- Индикатор уровня (зелёные квадраты)
- Название + иконки (звёздочка = приоритетный, стрелка = рост)
- Статус **"Developed skill"** — если навык уже достигнут (зелёная метка)
- Поле **"Set due date"** — установить срок

---

### 5. Skills (раздел)

Подзаголовок: "Explore all skills. Become the professional you always wanted to be"

---

**Главная страница — каталог всех навыков:**

- Поиск по названию навыка
- Табы: **All skills** | **Favorite** | **Recommended**
- Переключатель: **Tree view** (on/off) | Sort by: Skill name A–Z
- Инфобаннер: ссылка на документацию о навыках

**Категории (дерево, раскрывающееся):**
Academic Disciplines | AI | Business Functions | Consulting Practice | Engagement Types | Engineering Practices | Industries | Leadership & Soft Skills | Managerial | Technologies

**Каждый навык в списке:**
- Иконка сердца (избранное)
- Индикатор уровня (квадраты)
- Название
- **"added by X people"** — сколько людей добавили навык (популярность)
- Кнопка **"Add to plan"** прямо из списка

---

**Детальная страница навыка (по клику):**

Заголовок + иконки: Share | Add to my plan | Subscribe | дата последнего обновления
Справа: **"Set your skill level"** — самостоятельно задекларировать уровень (Self-declared level)

**Описание навыка:**
- Текстовое описание
- "Show more"
- Кнопка **"Generate description by AI"** — ИИ-генерация альтернативного описания

**Табы уровней:** Novice | Intermediate | Advanced | Expert | View all

Для каждого уровня — **"What you should know":**
- Novice: базовое понимание без практического опыта
- Intermediate: самостоятельная реализация средней сложности
- Advanced: enterprise-уровень, полное владение
- Expert: (подразумевается)
- Кнопка **"Generate proficiency by AI"** — ИИ генерирует описание уровня

---

**Блоки обучающих материалов:**

1. **Learning materials** (+ Add):
   - Материалы от экспертов: KB-статьи, Learning Path (From Experts)

2. **Learning materials from Learn:**
   - **"AI-designed Learning path from Learn"** — ИИ подбирает курсы, тренинги, программы
   - Карусель курсов с кнопкой "Save as my learning material"
   - Ссылка "Explore all" на платформу Learn

3. **Practical tasks from Experts** (+ Add personal task | Generate practical tasks by AI):
   - Задачи от экспертов (или заглушка если нет)

4. **Practical tasks from Plus** ("What is PLUS?" — ссылка):
   - Практические задачи с датой, нагрузкой в часах в неделю, кнопкой "View task"
   - Примеры: Develop AI Agents (1–3h/нед), написание статей (3–5h/нед)

5. **Videos from Videoportal:**
   - Карусель видео по навыку

6. **Questions for self-check** (+ Add personal question | Generate questions by AI):
   - Вопросы для самопроверки

7. **Reach out to Content authors:**
   - Контакты авторов контента по навыку

---

### 4. Titles (раздел)

Подзаголовок: "Explore all titles and career paths available within the Company"
Ссылки: "Explore career paths on the Career map" | "Learn more about the Career framework"

**Фильтры:**
- All titles / поиск по функции или должности
- Job function (напр. Software Engineering)
- Track (грейд: A, B…)
- Primary skill (напр. RPA Engineering, BI Engineering, Adobe Commerce и др.)

**Основная механика — сравнительная таблица уровней:**
Должности внутри одной линейки отображаются в столбцах слева направо по возрастанию уровня:
- LEVEL 1: Junior Software Engineer
- LEVEL 2: Software Engineer
- LEVEL 3 **YOU ARE HERE** (текущая, подсвечена)
- LEVEL 4 **YOUR NEXT CAREER TARGET** (целевая)

---

**Вкладка 1 — General requirements (поведенческие требования):**

Описания в формате текста для каждого уровня по категориям:

- **Client Relations** — от "участвует в митингах" до "ведёт сложные клиентские переговоры"
- **Team Management** — от "работает под надзором" до "наставничество, делегирование, коучинг"
- **Architecture & Practice** — от "читает диаграммы и знает паттерны" до "проектирует системную архитектуру"

У каждого уровня также блок: **"It is also recommended to:"** — дополнительные рекомендации

---

**Вкладка 2 — Skill requirements (матрица навыков):**

Фильтры: Show required | Year of graduation | Show my skill level | Highlight skills

Навыки разбиты по категориям, для каждого — требуемый уровень по столбцам уровней:

**Уровни навыков:** Novice → Intermediate → Advanced → Expert

Иконки:
- ↑ = навык в росте / целевой
- ⊘ = опциональный / рекомендуемый (не обязательный)
- — = не требуется на данном уровне

**Категории и примеры навыков:**
- **Practices:** RPA Development, BPA Development, Solution Architecture
- **Programming language:** .NET, Java, JavaScript, Python
- **Technologies:** UiPath, WorkFusion, Blue Prism, Automation Anywhere
- **Academic Disciplines:** English (B2)
- **Software Engineering Excellence:** SE Processes, SE Architecture, SE Knowledge
- **Leadership & Soft Skills:** Communication & Interaction with Customer
- **Ungrouped:** Self-Management, Building dialogue, Diversity & Inclusion, Developing Others, Consultancy, Communication, Ownership, Managing Teamwork, Business Acumen, Adaptability

**Mandatory** — обязательные навыки (базовые для должности)

---

### 3. Career Map (раздел)

Подзаголовок: "Build a path towards your career target and modify the target when needed"

**Строка построения пути:**
- **From:** [текущая должность] → **To:** [выбрать целевую должность] + поле Search + тогл **Career suggestions**

**Прогресс-шаги (линейный степпер сверху):**
Choose target → Set due date → Work on your plan → Request assessment

---

**Интерактивный холст (canvas):**
- Перетаскиваемая карта, масштабируется (+/−)
- Карточки должностей расположены слева направо по карьерному пути:
  - Левее — прошлые должности (история)
  - По центру — **YOU ARE HERE** (текущая, подсвечена): должность, грейд (A3), Primary skill, дата смены должности, "View details"
  - Правее — **YOUR NEXT CAREER TARGET**: целевая должность, грейд (A4), Primary skill, дедлайн, "View details"
- Кнопка **"Open career plan"** под целевой карточкой

**Онбординг-тур (5 шагов, встроен в интерфейс):**
1. "You are here" — объяснение текущей позиции
2. "Build path" — как выбрать цель
3. "Career suggestions" — популярные пути с текущей должности
4. "Search" — поиск по функциям, должностям, линейкам
5. "Zoom" — управление масштабом (запоминает настройки)

**Выпадающий список целевых должностей ("To"):**
Структурирован по функциям и содержит Title lines:
- **Business:** Marketing (5), Sales Enablement (3), Business Development (9), Client Partnership (2)
- **Consulting:** Consulting Analysis (2), Advisory...
- (и другие функции)

**Ключевые механики:**
- **Career suggestions** (тогл) — система предлагает самые популярные переходы с текущей должности
- Поиск по job functions / titles / title lines
- История должностей видна на карте (карточки слева от текущей)

