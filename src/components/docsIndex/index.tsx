import classNames from 'classnames'
import Link from 'next/link'
import React from 'react'
import { FiArrowUpRight, FiFileText, FiFolder } from 'react-icons/fi'
import AppConfig from 'src/config/app'

interface DocsIndexProps {
  category: string
  menu: Menu[]
}

function countDocs(menu: Menu[]): number {
  return menu.reduce((total, item) => {
    if (item.children?.length) {
      return total + countDocs(item.children)
    }
    return total + 1
  }, 0)
}

function getCategoryTitle(category: string) {
  const matched = AppConfig.navigation.find(
    (item) => item.path === `/docs/${category}` || item.path.startsWith(`/docs/${category}/`),
  )
  return matched?.title ?? category
}

const DocLink: React.FC<{ item: Menu }> = ({ item }) => {
  return (
    <Link
      href={'/' + item.key.replace(/\\/g, '/')}
      className={classNames(
        'group relative flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200',
        'border-[var(--basic-border-color)] bg-white/60',
        'hover:-translate-y-0.5 hover:border-[var(--color-for-hover-link)] hover:bg-[var(--basic-background)]',
        'hover:shadow-[0_8px_24px_-12px_rgba(40,158,249,0.35)]',
        'dark:bg-slate-900/40 dark:hover:bg-slate-800/70',
        'dark:hover:shadow-[0_8px_24px_-12px_rgba(40,158,249,0.25)]',
      )}
    >
      <span
        className={classNames(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
          'bg-[var(--basic-background)] text-slate-500',
          'group-hover:bg-[rgba(40,158,249,0.12)] group-hover:text-[var(--color-for-hover-link)]',
          'dark:bg-slate-800 dark:text-slate-400',
        )}
      >
        <FiFileText className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-[var(--basic-font-color)] transition-colors duration-200 group-hover:text-[var(--color-for-hover-link)] dark:text-white">
        {item.label}
      </span>
      <FiArrowUpRight
        className={classNames(
          'h-4 w-4 shrink-0 text-slate-300 transition-all duration-200',
          'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-for-hover-link)]',
          'dark:text-slate-600',
        )}
      />
    </Link>
  )
}

const DocSection: React.FC<{ items: Menu[]; depth?: number }> = ({ items, depth = 0 }) => {
  const files = items.filter((item) => !item.children?.length)
  const folders = items.filter((item) => item.children?.length)

  return (
    <div className={classNames('space-y-8', depth > 0 && 'pl-1')}>
      {files.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {files.map((item) => (
            <li key={item.key}>
              <DocLink item={item} />
            </li>
          ))}
        </ul>
      )}

      {folders.map((folder) => (
        <section key={folder.key} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--basic-border-color)] pb-2">
            <FiFolder className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <h2 className="text-base font-semibold text-[var(--basic-font-color)] dark:text-white">{folder.label}</h2>
            <span className="text-xs text-[#8f8f8f] dark:text-[var(--dark-toc-font-color)]">
              {countDocs(folder.children ?? [])}
            </span>
          </div>
          <DocSection items={folder.children ?? []} depth={depth + 1} />
        </section>
      ))}
    </div>
  )
}

const DocsIndex: React.FC<DocsIndexProps> = ({ category, menu }) => {
  const total = countDocs(menu)
  const title = getCategoryTitle(category)

  return (
    <div className="w-full px-4 pb-16 pt-4 md:px-6">
      <header className="mb-10 max-w-3xl">
        <p className="mb-2 text-sm tracking-wide text-[#8f8f8f] dark:text-[var(--dark-toc-font-color)]">
          Documentation
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--basic-font-color)] dark:text-white">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#8f8f8f] dark:text-[var(--dark-toc-font-color)]">
          {total > 0 ? `共 ${total} 篇文档，点击卡片即可阅读。` : '该分类下暂无文档。'}
        </p>
      </header>

      {total > 0 ? (
        <DocSection items={menu} />
      ) : (
        <div
          className={classNames(
            'rounded-xl border border-dashed px-6 py-12 text-center',
            'border-[var(--basic-border-color)] text-[#8f8f8f]',
            'dark:text-[var(--dark-toc-font-color)]',
          )}
        >
          暂无可用文档
        </div>
      )}
    </div>
  )
}

export default DocsIndex
