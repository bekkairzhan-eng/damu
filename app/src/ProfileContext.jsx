import { createContext, useContext, useState, useEffect } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'

const ProfileContext = createContext(null)

const INITIAL_SCORE = 4.3

export function ProfileProvider({ children }) {
  const [overallScore, setOverallScore] = useState(INITIAL_SCORE)
  const [isDark, setIsDark] = useLocalStorage('theme:dark', false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  function toggleDark() { setIsDark(v => !v) }

  return (
    <ProfileContext.Provider value={{ overallScore, setOverallScore, isDark, toggleDark }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
