'use client'
import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren, FC } from 'react'
import { menuItems, MenuContext } from 'src/store/MenuItems'

const Provider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <MenuContext.Provider value={menuItems}>{children}</MenuContext.Provider>
    </SessionProvider>
  )
}

export default Provider
