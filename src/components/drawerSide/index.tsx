'use client'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import { styled } from 'styled-components'
import styles from 'src/components/header/index.module.scss'
import AppConfig from 'src/config/app'
import { MenuContext } from 'src/store/MenuItems'

const Div = styled.div`
  a {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    display: block !important;
  }
`
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
      <ul className="menu p-4 w-[80%] xs:w-80 bg-white min-h-full">
        <div className="w-full">
          {/* Sidebar content here */}
          <div className={classNames(styles['page-header'], 'shadow pb-4')}>
            <Link className={classNames('flex', 'items-center', styles['nav-link'], styles['brand'])} href="/">
              <Image className={styles['logo']} width={32} height={32} alt="" src="/logosc-new.svg"></Image>
              <b>{AppConfig.brand}</b>
            </Link>
          </div>
          <Div>
            {AppConfig.navigation?.map(({ title, path }, index) => (
              <li key={index}>
                <Link href={path}>{title}</Link>
              </li>
            ))}
            <div className="divider">Documentation</div>
            <div>{documentation}</div>
          </Div>
        </div>
      </ul>
    </div>
  )
}

export default observer(DrawerSide)
