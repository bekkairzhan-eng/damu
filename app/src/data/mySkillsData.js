export const DEFAULT_SKILL_CATEGORIES = [
  {
    name: 'Языки (CEFR)', open: true, isLanguage: true,
    skills: [
      { name: 'Казахский',  confirmed: true,   target: true,  starred: false, native: true },
      { name: 'Русский',    confirmed: true,   target: false, starred: false, native: true },
      { name: 'Английский', selfDeclared: true, target: false, starred: false, cefr: 'B1' },
    ],
  },
  {
    name: 'Строительные практики', open: true,
    skills: [
      { name: 'Управление строительной площадкой', level: 3, confirmed: true, target: true, starred: false },
      { name: 'Контроль качества строительства', level: 3, confirmed: true, target: true, starred: false },
      { name: 'Охрана труда и техника безопасности', level: 4, confirmed: true, target: true, starred: false },
      { name: 'Нормативная база строительства', level: 3, selfDeclared: true, target: true, starred: false },
      { name: 'Проектная документация', level: 2, selfDeclared: true, target: false, starred: false },
    ],
  },
  {
    name: 'Технологии', open: false,
    skills: [
      { name: 'BIM-технологии (Revit)', level: 2, selfDeclared: true, target: true, starred: false },
      { name: 'AutoCAD', level: 2, selfDeclared: true, target: true, starred: false },
      { name: 'MS Project', level: 1, selfDeclared: true, target: true, starred: false },
      { name: 'Lean Construction', level: 2, selfDeclared: true, target: true, starred: false },
    ],
  },
  {
    name: 'Управление и лидерство', open: false,
    skills: [
      { name: 'Управление командой', level: 3, confirmed: true, target: true, starred: false },
      { name: 'Управление субподрядчиками', level: 2, selfDeclared: true, target: true, starred: false },
      { name: 'Финансовый контроль проекта', level: 2, selfDeclared: true, target: true, starred: false },
      { name: 'Решение конфликтов', level: 2, selfDeclared: true, target: false, starred: false },
      { name: 'Коммуникация с заказчиком', level: 3, confirmed: true, target: true, starred: false },
    ],
  },
]
