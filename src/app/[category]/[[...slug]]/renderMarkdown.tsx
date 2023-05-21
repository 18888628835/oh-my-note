'use client'
import { marked } from 'marked'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

interface RenderMarkdownProps {
  data: string
}
const RenderMarkdown: FC<RenderMarkdownProps> = ({ data }) => {
  window.location.pathname
  const tokens = marked.lexer(data)
  const headings = tokens.filter((token) => token.type === 'heading')

  return (
    <div>
      <ReactMarkdown
        components={{
          code({ node, style, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter customStyle={{ background: 'none' }} {...props} language={match[1]} PreTag="div">
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            )
          },
        }}
        className="markdown-body"
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
      >
        {data}
      </ReactMarkdown>
    </div>
  )
}

export default RenderMarkdown
