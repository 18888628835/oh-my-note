'use client'
import { Avatar, Dropdown } from 'antd'
import classNames from 'classnames'
import { motion, useScroll } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { FC } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
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
      <div className="drawer drawer-end">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <nav className="w-full navbar">
            <div className="flex-1 px-2 mx-2">
              <div className="md:flex items-center whitespace-nowrap ">
                <Link
                  className={classNames('flex', 'items-center', 'justify-center', styles['nav-link'], styles['brand'])}
                  href="/"
                >
                  <Image className={styles['logo']} width={29} height={32} alt="" src="/logosc-new.svg"></Image>
                  <b className="xs:block hidden">{AppConfig.brand}</b>
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

            <div className="ml-2">
              <div className="flex-none hidden lg:block">
                <div className="flex items-center">
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
                    className={styles['npm']}
                    target="_blank"
                    href="https://18888628835.github.io/react-drag-resizable/"
                  />
                  <Link className={styles['git-hub']} target="_blank" href="https://github.com/18888628835" />
                </div>
              </div>
              <Search />
              <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                  <svg width="24" height="24" fill="none" aria-hidden="true">
                    <path
                      d="M12 6v.01M12 12v.01M12 18v.01M12 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </label>
              </div>
            </div>
          </nav>
        </div>
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

            <li>
              <details open>
                <summary>Documentation</summary>
                <ul>
                  {nav.map(({ title, path }, index) => (
                    <li key={index}>
                      <Link href={path}>{title}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <li>
              <Link target="_blank" href="https://18888628835.github.io/react-drag-resizable/">
                NPM
              </Link>
            </li>
            <li>
              <Link target="_blank" href="https://github.com/18888628835">
                Github
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <motion.div className={styles['progress-bar']} hidden={isScroll === false} style={{ scaleX: scrollYProgress }} />
    </header>
  )
}

export default Header
