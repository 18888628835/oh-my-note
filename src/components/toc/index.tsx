'use client'
import classNames from 'classnames'
import { FC, useState } from 'react'
import { useEvent } from 'react-use'

interface TocProps {
  headings: { text: string; depth: number }[]
}

const Toc: FC<TocProps> = ({ headings }) => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const getClasses = (index: number) =>
    classNames('block leading-[1.6] text-ellipsis whitespace-nowrap overflow-x-hidden', {
      'font-medium': index === activeIndex,
      'text-[var(--color-for-hover-link)]': index === activeIndex,
      'hover:text-gray-600 dark:hover:text-[var(--dark-toc-hover-font-color)]': index !== activeIndex,
      'text-gray-500 dark:text-[var(--dark-toc-font-color)]': index !== activeIndex,
    })
  function setActiveElement() {
    const h2Elements = document.querySelectorAll('h2[id]')
    const h3Elements = document.querySelectorAll('h3[id]')
    const hElements = [...h2Elements, ...h3Elements]
    const tocElements = [...document.querySelectorAll('li[data-id]')] as Array<Element & { dataset: { id: string } }>
    // 视口高度
    const viewHeight = window.innerHeight
    // markdown content 高度
    // 60 为 header 的高度 + 16 padding = 76
    const contentHeight = viewHeight - 76
    // 遍历每个h2/h3元素
    for (const hElement of hElements) {
      const hTop = hElement.getBoundingClientRect().top
      // 如果h2/h3元素距离页面顶部的距离大于76且小于markdown content高度的一半
      if (hTop >= 0 && hTop <= contentHeight / 2) {
        const index = tocElements.findIndex((tocElement) => tocElement.dataset.id === hElement.id)
        setActiveIndex(index)
        return
      }
    }
  }

  useEvent('scroll', setActiveElement, window)

  return (
    <div className={'hidden xl:block shrink-0 pl-4 w-[256px]'}>
      <div className="w-full sticky top-[var(--sticky-top)] pb-[var(--basic-gap)] pl-4 border-l border-[var(--basic-border-color)]">
        <div className="mb-1 mt-[7px] text-sm font-medium text-gray-700 dark:text-white">On this page</div>
        <ul className="space-y-2.5 py-2 text-sm overflow-y-auto max-h-[70vh]">
          {headings.map(({ text, depth }, index) => (
            <li
              className={depth === 3 ? 'pl-3' : ''}
              data-id={`${text.replaceAll(' ', '').replaceAll('`', '')}`}
              key={index}
              onClick={() => setActiveIndex(index)}
            >
              <a className={getClasses(index)} href={`#${text.replaceAll(' ', '').replaceAll('`', '')}`}>
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Toc
