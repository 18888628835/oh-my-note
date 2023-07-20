'use client'
import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren, FC } from 'react'
import { useMedia } from 'react-use'
import { EnvContext } from 'src/store/env'

const Provider: FC<PropsWithChildren> = ({ children }) => {
  const isDarkMode = useMedia('(prefers-color-scheme: dark)', true)
  return (
    <SessionProvider>
      <EnvContext.Provider value={{ darkMode: isDarkMode }}>{children}</EnvContext.Provider>
    </SessionProvider>
  )
}

export default Provider
