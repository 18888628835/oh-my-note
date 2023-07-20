import { createContext } from 'react'

export const EnvContext = createContext<{ darkMode: boolean }>({ darkMode: false })
