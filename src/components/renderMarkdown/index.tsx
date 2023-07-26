/* eslint-disable @next/next/no-img-element */
'use client'
import Link from 'next/link'
import { FC, useContext } from 'react'
import { HiExternalLink } from 'react-icons/hi'
import ReactMarkdown from 'react-markdown'
import { Prism } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { styled } from 'styled-components'
import CodeBlock from 'src/components/codeBlock'
import HeadingHashLink from 'src/components/hashLink'
import { getChildrenId } from 'src/lib/md-utils'
import { EnvContext } from 'src/store/env'

interface RenderMarkdownProps {
  data: string
}
const SyntaxHighlighter = styled(Prism)`
  background: inherit !important;
  code {
    /* white-space: break-all !important; */
    word-break: break-all !important;
  }
`

const RenderMarkdown: FC<RenderMarkdownProps> = ({ data }) => {
  const { darkMode } = useContext(EnvContext)
  return (
    <div style={{ position: 'relative' }}>
      <ReactMarkdown
        components={{
          code({ node, style, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const code = String(children).replace(/\n$/, '')
            // 小写的 language以便验从映射表中获取文件的suffix 和 icon
            const language = match ? match?.[1]?.toLocaleLowerCase() : ''
            const mode = (['codeSandbox', 'preview'] as Array<CodeblockMode>).find((item) =>
              className?.toLocaleLowerCase()?.includes(item.toLocaleLowerCase()),
            )
            return !inline && match ? (
              <CodeBlock
                {...{ code, mode, language }}
                renderHighlighter={
                  <SyntaxHighlighter
                    {...props}
                    {...{ showLineNumbers: true, wrapLines: true, language }}
                    style={darkMode ? vscDarkPlus : undefined}
                  >
                    {code}
                  </SyntaxHighlighter>
                }
              />
            ) : (
              <code {...props}>{children}</code>
            )
          },
          h2({ node, children, level }) {
            const id = getChildrenId(node.children)
            return (
              <HeadingHashLink level={level} id={id} href={`#${id}`}>
                {children}
              </HeadingHashLink>
            )
          },
          h3({ children, node, level }) {
            const id = getChildrenId(node.children)
            return (
              <HeadingHashLink level={level} id={id} href={`#${id}`}>
                {children}
              </HeadingHashLink>
            )
          },
          img({ src, alt }) {
            return (
              <span className="flex justify-center items-center border-gray-200 dark:border-[var(--basic-border-color)] border rounded-md mt-6 mb-6 p-2">
                <img loading="lazy" className="blur-sm" alt={alt || ''} src={src || ''} />
              </span>
            )
          },
          a({ href, children, ...restProps }) {
            if (href && !href?.includes('http')) {
              return (
                <Link href={href} {...restProps}>
                  <span className="inline-flex items-center text-blue-400">
                    {children}
                    <HiExternalLink />
                  </span>
                </Link>
              )
            }
            return (
              <a {...{ href, children, ...restProps }}>
                <span className="inline-flex items-center text-blue-400">
                  {children}
                  <HiExternalLink />
                </span>
              </a>
            )
          },
        }}
        className="markdown-body dark:text-white dark:bg-[var(--dark-bg-color)]"
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
      >
        {data}
      </ReactMarkdown>
    </div>
  )
}

export default RenderMarkdown
