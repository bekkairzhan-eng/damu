import { useLocalStorage } from './useLocalStorage'
import { DEFAULT_SKILL_CATEGORIES } from '../data/mySkillsData'

// Общее избранное для навыков — используется и в каталоге ("Навыки"), и в
// "Мои навыки", чтобы переключение в одном месте сразу отражалось в другом.
// `baseCats` — навыки, уже входящие в профиль (карьерный трек и т.п.),
// `custom` — навыки, добавленные сотрудником самостоятельно вне трека
// (через "В план" в каталоге или через постановку сердечка на ещё не
// добавленном навыке — в этом случае запись создаётся без уровня).
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

  function isFavorite(name) {
    const inBase = findInBase(name)
    if (inBase) return !!inBase.skill.starred
    return !!custom.find(s => s.name === name)?.starred
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
    const existing = custom.find(s => s.name === name)
    if (existing) {
      setCustom(prev => prev.map(s => s.name === name ? { ...s, starred: !s.starred } : s))
    } else {
      setCustom(prev => [...prev, {
        name, category, level: null, status: null,
        confirmed: false, target: false, starred: true, custom: true,
      }])
    }
  }

  return { baseCats, setBaseCats, custom, setCustom, findInBase, isFavorite, toggleFavorite }
}
