'use client'
import { injectStores } from '@mobx-devtools/tools'
import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren, FC } from 'react'
import { menuItems, MenuContext } from 'src/store/MenuItems'

injectStores({
  menuItems,
})
const Provider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <MenuContext.Provider value={menuItems}>{children}</MenuContext.Provider>
    </SessionProvider>
  )
}

export default Provider
