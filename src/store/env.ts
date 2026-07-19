import { createContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export const THEME_STORAGE_KEY = 'oh-my-note-theme'

export const EnvContext = createContext<{
  darkMode: boolean
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}>({
  darkMode: false,
  theme: 'system',
  setTheme: () => undefined,
  toggleTheme: () => undefined,
})
