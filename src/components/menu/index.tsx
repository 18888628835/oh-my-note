'use client'
import classNames from 'classnames'
import Link from 'next/link'
import React from 'react'
import styles from 'src/components/menu/index.module.scss'
function generateMenu(items: Menu[], onClick?: (e: React.MouseEvent) => void) {
  return items?.map((item) => {
    if (item !== undefined && Array.isArray(item.children) && item.children.length > 0) {
      return (
        <li key={item.key}>
          <details>
            <summary className="dark:hover:text-white dark:text-[var(--dark-menu-font-color)]">{item.label}</summary>
            <ul className="ml-6 dark:before:bg-[var(--header-shadow-color)]">{generateMenu(item.children, onClick)}</ul>
          </details>
        </li>
      )
    }

    return (
      <li key={item.key}>
        <Link
          onClick={onClick}
          className="dark:hover:text-white dark:text-[var(--dark-menu-font-color)]"
          href={'/' + item.key}
        >
          {item.label}
        </Link>
      </li>
    )
  })
}
interface IMenuList {
  menu: Menu[]
  onClick?: (e: React.MouseEvent) => void
}
const MenuList = ({ menu, onClick }: IMenuList) => {
  return (
    <ul className={classNames('menu pt-1 px-0 overflow-y-auto', styles['documentation-menu'])}>
      {generateMenu(menu, onClick)}
    </ul>
  )
}

export default MenuList
