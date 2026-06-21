export const skillGroups = [
  {
    name: 'Строительные практики', skills: [
      { name: 'Управление строительной площадкой', level: 3, target: 4, status: 'gap' },
      { name: 'Контроль качества строительства', level: 3, target: 4, status: 'gap' },
      { name: 'Нормативная база строительства', level: 3, target: 4, status: 'gap' },
    ]
  },
  {
    name: 'Технологии', skills: [
      { name: 'BIM-технологии (Revit)', level: 2, target: 3, status: 'gap' },
      { name: 'AutoCAD', level: 2, target: 3, status: 'gap' },
      { name: 'MS Project', level: 1, target: 2, status: 'gap' },
      { name: 'Lean Construction', level: 2, target: 3, status: 'gap' },
    ]
  },
  {
    name: 'Управление и лидерство', skills: [
      { name: 'Управление командой', level: 3, target: 3, status: 'developed', starred: true },
      { name: 'Управление субподрядчиками', level: 2, target: 3, status: 'gap' },
      { name: 'Финансовый контроль проекта', level: 2, target: 3, status: 'gap' },
      { name: 'Коммуникация с заказчиком', level: 3, target: 3, status: 'developed', starred: true },
    ]
  },
  {
    name: 'Охрана труда', skills: [
      { name: 'Охрана труда и ТБ', level: 4, target: 4, status: 'developed' },
    ]
  },
  {
    name: 'Языки', skills: [
      { name: 'Казахский', level: 3, target: 3, status: 'developed', badge: 'C1' },
    ]
  },
  {
    name: 'Прочее', skills: [
      { name: 'Адаптивность', level: 2, target: 3, status: 'gap' },
      { name: 'Развитие сотрудников', level: 1, target: 2, status: 'gap' },
      { name: 'Командная работа', level: 2, target: 2, status: 'developed', starred: true },
      { name: 'Принятие решений', level: 2, target: 3, status: 'gap' },
      { name: 'Управление конфликтами', level: 2, target: 3, status: 'gap' },
    ]
  },
]

export const LEARNING_PLAN = [
  {
    category: 'Обязательные курсы',
    items: [
      { title: 'Управление строительным проектом: уровень Foreman C', type: 'Курс', duration: '16 ч', status: 'in-progress', progress: 60, due: '31 Авг 2026', provider: 'BI University' },
      { title: 'Нормативная база строительства РК (обновление 2025)', type: 'Курс', duration: '8 ч', status: 'done', progress: 100, due: '01 Янв 2026', provider: 'BI University' },
      { title: 'Охрана труда и ТБ — переаттестация', type: 'Сертификат', duration: '4 ч', status: 'done', progress: 100, due: '01 Фев 2026', provider: 'Buildex Training Center' },
      { title: 'BIM-технологии: Revit для прорабов', type: 'Курс', duration: '24 ч', status: 'not-started', progress: 0, due: '01 Окт 2026', provider: 'BILIM' },
    ],
  },
  {
    category: 'Рекомендуемые курсы',
    items: [
      { title: 'Lean Construction: инструменты и практика', type: 'Курс', duration: '12 ч', status: 'in-progress', progress: 30, due: '31 Июл 2026', provider: 'Buildex Training Center' },
      { title: 'Управление субподрядчиками и договорная работа', type: 'Курс', duration: '10 ч', status: 'not-started', progress: 0, due: '01 Ноя 2026', provider: 'BI University' },
      { title: 'MS Project: планирование строительных работ', type: 'Курс', duration: '8 ч', status: 'not-started', progress: 0, due: '01 Дек 2026', provider: 'BILIM' },
    ],
  },
  {
    category: 'Сертификаты для повышения',
    items: [
      { title: 'Удостоверение Foreman C — аттестация BI Group', type: 'Сертификат', duration: '—', status: 'not-started', progress: 0, due: '06 Фев 2027', provider: 'BI Group HR', mandatory: true },
      { title: 'Казахский язык — уровень B2', type: 'Сертификат', duration: '—', status: 'done', progress: 100, due: '12 Мар 2025', provider: 'Казтест', mandatory: true },
    ],
  },
]

export const plan1TotalSkills = skillGroups.flatMap(g => g.skills).length
export const plan1DevelopedSkills = skillGroups.flatMap(g => g.skills).filter(s => s.status === 'developed').length

const allLearning = LEARNING_PLAN.flatMap(g => g.items)
export const plan1TotalLearning = allLearning.length
export const plan1DoneLearning = allLearning.filter(i => i.status === 'done').length
