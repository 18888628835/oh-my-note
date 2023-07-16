'use client'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from 'src/components/header/index.module.scss'
import AppConfig from 'src/config/app'

const DrawerSide = () => {
  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
      <ul className="menu p-4 w-[80%] xs:w-80 h-full bg-white">
        {/* Sidebar content here */}
        <div className="border-b border-solid border-base-200 pb-2">
          <Link className={classNames('flex', 'items-center', styles['nav-link'], styles['brand'])} href="/">
            <Image className={styles['logo']} width={29} height={32} alt="" src="/logosc-new.svg"></Image>
            <b>{AppConfig.brand}</b>
          </Link>
        </div>

        {AppConfig.navigation?.map(({ title, path }, index) => (
          <li key={index}>
            <Link href={path}>{title}</Link>
          </li>
        ))}
        <div className="divider">Documentation</div>
      </ul>
    </div>
  )
}

export default DrawerSide
