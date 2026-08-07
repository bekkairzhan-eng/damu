import { CATEGORIES, categoryOf } from './skillsCatalog'

// Названия и категории навыков всегда берутся из общего каталога
// (skillsCatalog.js) — здесь задаётся только состояние конкретного
// сотрудника (уровень, подтверждение, целевой/избранное). Так они не могут
// разъехаться с тем, что видно в /skills и /admin/skills.

const SEED_SKILLS = [
  { name: 'Казахский', confirmed: true, target: true, starred: false, native: true },
  { name: 'Русский', confirmed: true, target: false, starred: false, native: true },
  { name: 'Английский', selfDeclared: true, target: false, starred: false, cefr: 'B1' },

  { name: 'Управление строительной площадкой', level: 3, confirmed: true, target: true, starred: false },
  { name: 'Контроль качества строительства', level: 3, confirmed: true, target: true, starred: false },
  { name: 'Охрана труда и ТБ', level: 4, confirmed: true, target: true, starred: false },
  { name: 'Нормативная база строительства', level: 3, selfDeclared: true, target: true, starred: false },
  { name: 'Проектная документация', level: 2, selfDeclared: true, target: false, starred: false },

  { name: 'BIM-технологии (Revit)', level: 2, selfDeclared: true, target: true, starred: false },
  { name: 'AutoCAD', level: 2, selfDeclared: true, target: true, starred: false },
  { name: 'MS Project', level: 1, selfDeclared: true, target: true, starred: false },
  { name: 'Lean Construction', level: 2, selfDeclared: true, target: true, starred: false },

  { name: 'Управление командой', level: 3, confirmed: true, target: true, starred: false },
  { name: 'Управление субподрядчиками', level: 2, selfDeclared: true, target: true, starred: false },
  { name: 'Финансовый контроль проекта', level: 2, selfDeclared: true, target: true, starred: false },
  { name: 'Управление конфликтами', level: 2, selfDeclared: true, target: false, starred: false },
  { name: 'Коммуникация с заказчиком', level: 3, confirmed: true, target: true, starred: false },
]

const OPEN_BY_DEFAULT = new Set(['Языки (CEFR)', 'Строительные практики'])

export const DEFAULT_SKILL_CATEGORIES = CATEGORIES
  .map(catName => ({
    name: catName,
    open: OPEN_BY_DEFAULT.has(catName),
    isLanguage: catName === 'Языки (CEFR)',
    skills: SEED_SKILLS.filter(s => categoryOf(s.name) === catName),
  }))
  .filter(cat => cat.skills.length > 0)
