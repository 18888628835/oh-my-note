'use client'
import React from 'react'

interface BreadcrumbProps {
  items: Array<string>
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const classNames = {
    hover: 'text-[#171717]',
    default: 'text-[#8f8f8f]',
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
