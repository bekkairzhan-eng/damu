import { useLocalStorage } from './useLocalStorage'
import { DEFAULT_SKILL_CATEGORIES } from '../data/mySkillsData'

// Общее состояние навыков сотрудника — используется и в каталоге ("Навыки"),
// и на деталке навыка, и в "Мои навыки", чтобы действия в одном месте сразу
// отражались в другом.
// `baseCats` — навыки, уже входящие в профиль (карьерный трек и т.п.),
// `custom` — навыки, добавленные сотрудником самостоятельно вне трека через
// "В план". Уровень новой записи всегда 0 ("не начат") — уровни 1-2-3
// подтверждаются автоматически из BILIM/TestLab, сотрудник их не выставляет.
export function useSkillFavorite() {
  const [baseCats, setBaseCats] = useLocalStorage('myskills:base', DEFAULT_SKILL_CATEGORIES)
  const [custom, setCustom] = useLocalStorage('myskills:custom', [])

  function findInBase(name) {
    for (const cat of baseCats) {
      const skill = cat.skills.find(s => s.name === name)
      if (skill) return { categoryName: cat.name, skill }
    }
    return null
  }

  function findCustom(name) {
    return custom.find(s => s.name === name) ?? null
  }

  function isInPlan(name) {
    return !!findInBase(name) || !!findCustom(name)
  }

  // Навык вне трека можно убрать из "Навыки" тем же способом, каким добавили —
  // но только пока уровень не выставлен (0). Целевые навыки (findInBase) сюда
  // не попадают — их исключить нельзя никогда.
  function isRemovable(name) {
    const c = findCustom(name)
    return !!c && !findInBase(name) && (c.level ?? 0) === 0
  }

  function addToPlan(name, category) {
    if (isInPlan(name)) return
    setCustom(prev => [...prev, {
      name, category, level: 0, status: null,
      confirmed: false, target: false, starred: false, custom: true,
    }])
  }

  function removeFromPlan(name) {
    setCustom(prev => prev.filter(s => !(s.name === name && (s.level ?? 0) === 0)))
  }

  function isFavorite(name) {
    const inBase = findInBase(name)
    if (inBase) return !!inBase.skill.starred
    return !!findCustom(name)?.starred
  }

  function toggleFavorite(name, category) {
    const inBase = findInBase(name)
    if (inBase) {
      setBaseCats(prev => prev.map(cat => cat.name !== inBase.categoryName ? cat : {
        ...cat,
        skills: cat.skills.map(s => s.name === name ? { ...s, starred: !s.starred } : s),
      }))
      return
    }
    const existing = findCustom(name)
    if (existing) {
      setCustom(prev => prev.map(s => s.name === name ? { ...s, starred: !s.starred } : s))
    } else {
      setCustom(prev => [...prev, {
        name, category, level: 0, status: null,
        confirmed: false, target: false, starred: true, custom: true,
      }])
    }
  }

  return {
    baseCats, setBaseCats, custom, setCustom,
    findInBase, findCustom, isInPlan, isRemovable, addToPlan, removeFromPlan,
    isFavorite, toggleFavorite,
  }
}
