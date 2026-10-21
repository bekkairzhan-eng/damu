// Блоки KPI — стандарт для топ-100 Холдинга. Цвета используются в виджетах и на бейджах.
export const KPI_BLOCKS = [
  { id: 'fin',    name: 'Fin',              color: '#4361ee' },
  { id: 'client', name: 'Client',           color: '#0ea5e9' },
  { id: 'bp',     name: 'Business Process', color: '#f59e0b' },
  { id: 'hr',     name: 'HR',               color: '#10b981' },
]

// Пороги итогового выполнения (% от плана, взвешенно)
export const KPI_ACHIEVED = 90
export const KPI_RISK = 70

// Статусы согласования набора KPI
export const KPI_STATUS = {
  draft:    { label: 'Черновик',         color: '#7a8fa0', bg: '#f1f4f8' },
  pending:  { label: 'На согласовании',  color: '#b45309', bg: '#fef3c7' },
  approved: { label: 'Утверждено',       color: '#059669', bg: '#d1fae5' },
}

// Задача KPI: вес у задачи, сумма весов всех задач = 100%
export const INITIAL_KPI_TASKS = [
  { id: 'k1', block: 'fin',    name: 'EBITDA проекта',                    unit: 'млн ₸', plan: 1200, fact: 1050, weight: 25 },
  { id: 'k2', block: 'fin',    name: 'Экономия на закупках',              unit: '%',     plan: 5,    fact: 3.2,  weight: 15 },
  { id: 'k3', block: 'client', name: 'NPS по сданным объектам',           unit: 'балл',  plan: 70,   fact: 72,   weight: 15 },
  { id: 'k4', block: 'client', name: 'Сдача объектов в срок',             unit: 'шт',    plan: 6,    fact: 4,    weight: 15 },
  { id: 'k5', block: 'bp',     name: 'Внедрение цифрового контроля работ', unit: '%',     plan: 100,  fact: 40,   weight: 15 },
  { id: 'k6', block: 'hr',     name: 'Текучесть ИТР',                     unit: '%',     plan: 100,  fact: 85,   weight: 10 },
  { id: 'k7', block: 'hr',     name: 'Преемники на ключевые позиции',     unit: 'чел',   plan: 3,    fact: 2,    weight: 5  },
]

// IDP: пункты из оценки 360 (привязаны к компетенции) + личные задачи
export const INITIAL_IDP = [
  { id: 'i1', type: '360',      title: 'Развить навык делегирования',          competency: 'Лидерство',           due: '2026-12-31', done: false },
  { id: 'i2', type: '360',      title: 'Пройти курс по обратной связи',        competency: 'Коммуникация',        due: '2026-11-30', done: true  },
  { id: 'i3', type: 'personal', title: 'Пробежать марафон',                    competency: '',                    due: '2026-09-15', done: false },
  { id: 'i4', type: 'personal', title: 'Прочитать 6 книг по бизнесу',          competency: '',                    due: '2026-12-31', done: false },
]
