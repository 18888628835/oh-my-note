'use client'
import { SessionProvider } from 'next-auth/react'
import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { EnvContext, Theme, THEME_STORAGE_KEY } from 'src/store/env'

function getSystemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolveDark(theme: Theme) {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return getSystemDark()
}

function applyDarkClass(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
}

const Provider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    const nextTheme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
    const isDark = resolveDark(nextTheme)
    setThemeState(nextTheme)
    setDarkMode(isDark)
    applyDarkClass(isDark)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      const isDark = resolveDark(theme)
      setDarkMode(isDark)
      applyDarkClass(isDark)
    }

    sync()

    if (theme !== 'system') return

    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(darkMode ? 'light' : 'dark')
  }, [darkMode, setTheme])

  return (
    <SessionProvider>
      <EnvContext.Provider value={{ darkMode, theme, setTheme, toggleTheme }}>{children}</EnvContext.Provider>
    </SessionProvider>
  )
}

export default Provider
