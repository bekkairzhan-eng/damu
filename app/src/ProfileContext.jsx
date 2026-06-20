import { createContext, useContext, useState } from 'react'

const ProfileContext = createContext(null)

// Initial overallScore computed from default state in ExperienceProfile:
// profileScore(2 projects)=4.0, corpScore(3 checked)=5.0
// (4.3*30 + 4.5*25 + 4.0*25 + 4.0*10 + 5.0*10) / 100 = 4.3
const INITIAL_SCORE = 4.3

export function ProfileProvider({ children }) {
  const [overallScore, setOverallScore] = useState(INITIAL_SCORE)
  return (
    <ProfileContext.Provider value={{ overallScore, setOverallScore }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
