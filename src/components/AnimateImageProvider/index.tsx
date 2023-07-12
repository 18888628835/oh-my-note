'use client'
import fastDom from 'fastdom'
import React, { useEffect, FC, PropsWithChildren, useRef } from 'react'

const AnimateImageProvider: FC<PropsWithChildren> = ({ children }) => {
  const rootDom = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let startIndex = 0
    const images = rootDom.current?.querySelectorAll('img') || []

    const viewHeight = window.innerHeight
    function animateAllImage() {
      window.requestAnimationFrame(() => {
        fastDom.measure(() => {
          // 从startIndex开始，只要有一个图片进入视口，就会触发动画
          for (let i = startIndex; i <= images.length - 1; i++) {
            const image = images[i]
            const { top, height } = image.getBoundingClientRect()
            if (viewHeight - top > height * 0.75) {
              fastDom.mutate(() => {
                image.className = ''
                // image.classList.add('animate__animated', 'animate__pulse')
              })
              // 触发动画后，startIndex会更新为下张图片的索引，下次循环就会从这个索引开始
              startIndex = i + 1
            } else {
              break
            }
          }
        })
      })
    }
    window.addEventListener('scroll', animateAllImage)
    return () => {
      window.removeEventListener('scroll', animateAllImage)
    }
  }, [])

  return <div ref={rootDom}>{children}</div>
}

export default AnimateImageProvider
