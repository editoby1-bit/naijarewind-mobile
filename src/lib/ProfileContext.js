// src/lib/ProfileContext.js
import { createContext, useContext, useState } from 'react'

const ProfileContext = createContext({ activeProfile: null, setActiveProfile: () => {} })

export function ProfileProvider({ children }) {
  const [activeProfile, setActiveProfile] = useState(null)
  return <ProfileContext.Provider value={{ activeProfile, setActiveProfile }}>{children}</ProfileContext.Provider>
}

export function useActiveProfile() {
  return useContext(ProfileContext)
}
