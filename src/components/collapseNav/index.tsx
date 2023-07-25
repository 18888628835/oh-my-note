'use client'
import classNames from 'classnames'
import React, { useState } from 'react'
import { AiOutlineRight } from 'react-icons/ai'
import styled from 'styled-components'
import Menu from 'src/components/menu'

interface ICollapseNav {
  menu: Menu[]
}

const MenuList = styled(Menu)`
  padding-left: 0;
`

const CollapseNav: React.FC<ICollapseNav> = ({ menu }) => {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={classNames(
        'block sm:hidden bg-white border-b border-gray-200 backdrop-blur-sm backdrop-saturate-200 dark:border-[var(--basic-border-color)] dark:bg-[--dark-header-bg-color] z-20 sticky top-[64px]',
        { 'bg-white/80': open === false, 'bg-white': open },
      )}
    >
      <div className="flex flex-col justify-between px-4">
        <button className="py-2 text-left flex items-center gap-2" onClick={() => setOpen((o) => !o)}>
          <AiOutlineRight className={open ? 'transition-all rotate-90' : 'transition-all'} />
          Documentation
        </button>
        <div hidden={!open} className="w-full h-screen pr-3 pl-0 overflow-y-scroll">
          <MenuList menu={menu} />
        </div>
      </div>
    </div>
  )
}

export default CollapseNav
