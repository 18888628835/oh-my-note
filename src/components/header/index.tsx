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
  const rootClasses = classNames(styles['page-header'], styles['page-header-sticky'], 'px-9')
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
    <header className={rootClasses}>
      <nav className={classNames(styles['nav'], styles['nav-padding'])}>
        <div className={styles['nav-left']}>
          <Link
            className={classNames('flex', 'items-center', 'justify-center', styles['nav-link'], styles['brand'])}
            href="/"
          >
            <Image className={styles['logo']} width={29} height={32} alt="" src="/logosc-new.svg"></Image>
            <b>Oh-My-Note</b>
          </Link>

          {nav.map(({ title, path }, index) => (
            <Link className={classNames(styles['nav-link-padding'], styles['nav-link'])} href={path} key={index}>
              {title}
            </Link>
          ))}
        </div>
        <div className={styles['nav-right']}>
          <div className={classNames(styles['action'], 'flex gap-2')}>
            <Search />
            <Dropdown
              menu={{
                items: dropdownItems,
              }}
            >
              <div className={classNames('flex-center-box', styles['gap-4'], styles['nav-link'])}>
                {data ? <Avatar size="small" src={data?.user?.image} /> : 'Sign in'}
                <AiFillCaretDown />
              </div>
            </Dropdown>
          </div>
          <Link className={styles['npm']} target="_blank" href="https://18888628835.github.io/react-drag-resizable/" />
          <Link className={styles['git-hub']} target="_blank" href="https://github.com/18888628835" />
        </div>
      </nav>
      <motion.div className={styles['progress-bar']} hidden={isScroll === false} style={{ scaleX: scrollYProgress }} />
    </header>
  )
}

export default Header
