'use client'
import React, { FC } from 'react'
import { BsLink45Deg } from 'react-icons/bs'
import { styled } from 'styled-components'

const A = styled.a`
  &[data-role='hash-link'] {
    &:hover {
      text-decoration: none;
      color: var(--color-for-hover-link);
    }
    &:hover svg {
      opacity: 1;
    }
  }
  svg {
    opacity: 0;
    vertical-align: text-bottom;
    margin-left: var(--basic-gap);
  }
`

const HeadingHashLink: FC<{ level: number; id: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  children,
  level,
  id,
  ...restProps
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <HeadingTag id={id}>
      <A id={id} className="dark:text-white text-[var(--basic-font-color)]" data-role="hash-link" {...restProps}>
        {children}
        <BsLink45Deg className="inline-block" />
      </A>
    </HeadingTag>
  )
}

export default HeadingHashLink
