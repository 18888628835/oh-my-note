'use client'
import classNames from 'classnames'
import { useContext } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { EnvContext } from 'src/store/env'

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(EnvContext)

  return (
    <button
      type="button"
      aria-label={darkMode ? '切换到浅色模式' : '切换到深色模式'}
      title={darkMode ? '切换到浅色模式' : '切换到深色模式'}
      onClick={toggleTheme}
      className={classNames(
        'btn btn-ghost btn-circle btn-sm mx-1',
        'hover:bg-[var(--color-btn-hover-background)]',
        'dark:hover:bg-[var(--dark-btn-hover-bg-color)] dark:hover:text-[var(--dark-btn-hover-color)]',
      )}
    >
      {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </button>
  )
}

export default ThemeToggle
