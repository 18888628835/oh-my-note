'use client'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import style from 'src/components/drawerSide/index.module.scss'
import styles from 'src/components/header/index.module.scss'
import AppConfig from 'src/config/app'
import { MenuContext } from 'src/store/MenuItems'

function generateMenu(items: Menu[]) {
  return items?.map((item) => {
    if (item !== undefined && Array.isArray(item.children) && item.children.length > 0) {
      return (
        <li key={item.key}>
          <details className="max-w-full">
            <summary>{item.label}</summary>
            <ul>{generateMenu(item.children)}</ul>
          </details>
        </li>
      )
    }

    return (
      <li key={item.key}>
        <Link href={item.key}>{item.label}</Link>
      </li>
    )
  })
}
const DrawerSide = () => {
  const menuItems = useContext(MenuContext)
  const documentation = generateMenu(menuItems.value)

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
      <ul className="menu p-4 w-[80%] xs:w-80 bg-white dark:bg-slate-800 h-[100vh]">
        <div className="w-full overflow-scroll scrollbar-hide">
          {/* Sidebar content here */}

          <div className={classNames(styles['page-header'], 'shadow pb-4')}>
            <Link className={classNames('flex', 'items-center', styles['nav-link'], styles['brand'])} href="/">
              <Image className={styles['logo']} width={32} height={32} alt="" src="/logosc-new.svg"></Image>
              <b>{AppConfig.brand}</b>
            </Link>
          </div>
          <div className={style['documentation-menu']}>
            <div>
              {AppConfig.navigation?.map(({ title, path }, index) => (
                <li key={index}>
                  <Link href={path}>{title}</Link>
                </li>
              ))}
            </div>
            <div className="h-[1px] bg-slate-200 my-4" />
            <div>{documentation}</div>
            <li>
              <Link href={AppConfig.github}>GitHub</Link>
            </li>
            <li>
              <Link href={AppConfig.npm}>NPM</Link>
            </li>
          </div>
        </div>
      </ul>
    </div>
  )
}

export default observer(DrawerSide)
