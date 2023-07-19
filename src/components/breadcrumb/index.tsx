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
  return (
    <div className="text-sm breadcrumbs">
      <ul>
        {items.map((title, index) => (
          <li key={index}>
            <span className={index === items.length - 1 ? classNames['hover'] : classNames['default']}>{title}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Breadcrumb
