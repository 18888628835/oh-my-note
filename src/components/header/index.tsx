'use client'
import { Avatar, Dropdown } from 'antd'
import classNames from 'classnames'
import { motion, useScroll } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { FC } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import DrawerSide from 'src/components/drawerSide'
import styles from 'src/components/header/index.module.scss'
import Search from 'src/components/search/Search'
import AppConfig from 'src/config/app'
import useIsScroll from 'src/hooks/useIsScroll'
interface HeaderProps {
  nav: typeof AppConfig.navigation
}

const Header: FC<HeaderProps> = ({ nav }) => {
  const { scrollYProgress } = useScroll()
  const session = useSession()
  const { data } = session
  const { isScroll } = useIsScroll()
  const signOutItems = [
    {
      key: '1',
      label: (
        <div className={classNames('flex-center-box', styles['gap-8'], styles['nav-link'])} onClick={() => signOut()}>
          Sign out
        </div>
      ),
    },
  ]
  const signInItems = [
    {
      key: '1',
      label: (
        <div
          className={classNames('flex-center-box', styles['gap-8'], styles['nav-link'])}
          onClick={() => signIn('github')}
        >
          <Image width={24} height={24} src="/github.svg" alt="" />
          Sign in with github
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div
          className={classNames('flex-center-box', styles['gap-8'], styles['nav-link'])}
          onClick={() => signIn('google')}
        >
          <Image width={24} height={24} src="/google.svg" alt="" />
          Sign in with google
        </div>
      ),
    },
  ]
  const dropdownItems = data ? signOutItems : signInItems
  return (
    <header className={classNames(styles['page-header'], styles['page-header-sticky'], 'sm:px-9')}>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <nav className="w-full navbar">
            <div className="flex-none md:hidden">
              <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            {/* logo and nav */}
            <div className="flex-1 px-2 mx-2">
              <div className="items-center whitespace-nowrap hidden xs:flex">
                <Link
                  className={classNames('flex', 'items-center', 'justify-center', styles['nav-link'], styles['brand'])}
                  href="/"
                >
                  <Image className={styles['logo']} width={32} height={32} alt="" src="/logosc-new.svg"></Image>
                  <b className="s:block hidden">{AppConfig.brand}</b>
                </Link>
                <div className="hidden md:block">
                  {nav.map(({ title, path }, index) => (
                    <Link
                      className={classNames(styles['nav-link-padding'], styles['nav-link'])}
                      href={path}
                      key={index}
                    >
                      {title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {/* 登录 */}
            <div className="ml-2">
              <div className="flex-none">
                <div className="items-center flex">
                  <Dropdown
                    menu={{
                      items: dropdownItems,
                    }}
                    arrow={false}
                  >
                    <div className="flex justify-center items-center whitespace-nowrap">
                      {data ? <Avatar size="small" src={data?.user?.image} /> : 'Sign in'}
                      <AiFillCaretDown />
                    </div>
                  </Dropdown>
                  <Link
                    className={classNames(styles['npm'], 'hidden lg:block')}
                    target="_blank"
                    href="https://18888628835.github.io/react-drag-resizable/"
                  />
                  <Link
                    className={classNames(styles['git-hub'], 'hidden lg:block')}
                    target="_blank"
                    href="https://github.com/18888628835"
                  />
                </div>
              </div>
              {/* 搜索 */}
              <Search />
            </div>
          </nav>
        </div>
        <DrawerSide />
      </div>
      <motion.div className={styles['progress-bar']} hidden={isScroll === false} style={{ scaleX: scrollYProgress }} />
    </header>
  )
}

export default Header
