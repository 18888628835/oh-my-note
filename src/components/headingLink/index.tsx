import React, { FC } from 'react'
import { BsLink45Deg } from 'react-icons/bs'

const HeadingLink: FC<{ level: number; id: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  children,
  level,
  id,
  ...restProps
}) => {
  const Heading = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Heading id={id} data-doc-level={level}>
      <a
        className="dark:text-white text-[var(--basic-font-color)] hover:text-[var(--color-for-hover-link)] group/item"
        {...restProps}
      >
        {children}
        <BsLink45Deg className="inline-block align-bottom ml-2 opacity-0 group-hover/item:opacity-100" />
      </a>
    </Heading>
  )
}

export default HeadingLink
