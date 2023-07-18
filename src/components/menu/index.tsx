'use client'
import classNames from 'classnames'
import Link from 'next/link'
import React from 'react'
import styles from 'src/components/menu/index.module.scss'
function generateMenu(items: Menu[]) {
  return items?.map((item) => {
    if (item !== undefined && Array.isArray(item.children) && item.children.length > 0) {
      return (
        <li key={item.key}>
          <details>
            <summary>{item.label}</summary>
            <ul>{generateMenu(item.children)}</ul>
          </details>
        </li>
      )
    }

    return (
      <li key={item.key}>
        <Link href={'/' + item.key}>{item.label}</Link>
      </li>
    )
  })
}
const Menu = ({ menu }: { menu: Menu[] }) => {
  return (
    <ul
      className={classNames(
        'menu pt-1 md:w-[--doc-sidebar-width] xs:w-80 bg-white overflow-y-auto',
        styles['documentation-menu'],
      )}
    >
      {generateMenu(menu)}
    </ul>
  )
}

export default Menu