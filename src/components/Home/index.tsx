'use client'
import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import RenderMarkdown from 'src/components/renderMarkdown'
import { MenuContext } from 'src/store/MenuItems'

interface HomeProps {
  data: string
}
const Home: React.FC<HomeProps> = ({ data }) => {
  const menu = useContext(MenuContext)
  useEffect(() => {
    menu.update([])
  }, [])

  return <RenderMarkdown data={data} />
}

export default observer(Home)
