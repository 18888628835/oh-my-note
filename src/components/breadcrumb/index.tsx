'use client'
import React from 'react'

interface BreadcrumbProps {
  items: Array<string>
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const classNames = {
    hover: 'text-[#171717] dark:text-[var(--dark-toc-hover-font-color)]',
    default: 'text-[#8f8f8f] dark:text-[var(--dark-toc-font-color)]',
  }
  const [topLevel, ...rest] = items
  return (
    <div className="text-sm breadcrumbs pt-0">
      <ul>
        <li>
          <span data-doc-level={0} className={classNames['default']}>
            {topLevel}
          </span>
        </li>
        {rest.map((title, index) => (
          <li key={index}>
            <span className={index === rest.length - 1 ? classNames['hover'] : classNames['default']}>{title}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Breadcrumb
