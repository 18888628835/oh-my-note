'use client'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import React, { FC, PropsWithChildren, useState } from 'react'
import { AiOutlineCheck, AiOutlineCodeSandbox } from 'react-icons/ai'
import { BsCodeSlash, BsCode } from 'react-icons/bs'
import { MdOutlineContentCopy } from 'react-icons/md'
import Root from 'react-shadow'
import styles from 'src/components/codeBlock/index.module.scss'
import { getCodeSandboxParameters, getCodeSandboxSrc } from 'src/lib/md-utils'

interface CopyProps {
  code: string
  language: string
  mode?: CodeblockMode
  renderHighlighter: React.ReactNode
}

const CodeBlock: FC<PropsWithChildren<CopyProps>> = ({ language, code, renderHighlighter, mode }) => {
  const [copied, setCopied] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const parameters = getCodeSandboxParameters({ language, code })
  function reset() {
    setCopied(false)
  }
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      const timer = setTimeout(() => {
        reset()
        window.clearTimeout(timer)
      }, 1500)
    } catch (err) {
      reset()
    }
  }
  const toggleShowCode = () => setShowCode((oldStatus) => !oldStatus)
  return (
    <div className={styles['root-container']}>
      <div className={classNames(styles['copy-wrap'], 'flex-space-between-box')}>
        <div className={styles['language']}>{language}</div>
        <Tooltip title="复制代码">
          <button onClick={onCopy} className={classNames('flex-center-box', styles['copy-btn'])}>
            {!copied ? (
              <MdOutlineContentCopy className={classNames('animate__animated', 'animate__zoomIn')} />
            ) : (
              <AiOutlineCheck className={classNames('animate__animated', 'animate__zoomIn')} />
            )}
          </button>
        </Tooltip>
      </div>
      {mode === 'preview' ? (
        <Root.div className="px-2 py-2 w-full max-h-[500px] overflow-scroll flex justify-center items-center">
          <div dangerouslySetInnerHTML={{ __html: code }} />
        </Root.div>
      ) : mode === 'codesandbox' ? (
        <div className="px-2 py-2 w-full h-[500px]">
          <iframe
            className="w-full h-full"
            width="100%"
            height="auto"
            src={getCodeSandboxSrc({ embed: true, parameters })}
          />
        </div>
      ) : (
        renderHighlighter
      )}
      {mode === 'preview' && (
        <footer>
          <form
            className="text-gray-500 text-xl gap-2 flex items-center px-3 py-3 border-t border-[rgba(5, 5, 5, 0.06)] border-dashed"
            action={getCodeSandboxSrc({ embed: false })}
            method="POST"
            target="_blank"
          >
            <input type="hidden" name="parameters" value={`${parameters}`} />
            <Tooltip title="在 codeSandbox 中打开">
              <button type="submit">
                <AiOutlineCodeSandbox />
              </button>
            </Tooltip>
            <Tooltip title={showCode ? '隐藏代码' : '显示代码'}>
              <button type="button" onClick={toggleShowCode}>
                {showCode ? <BsCodeSlash /> : <BsCode />}
              </button>
            </Tooltip>
          </form>
          <div hidden={!showCode} className="border-dashed border-t border-[rgba(5, 5, 5, 0.06)]">
            {renderHighlighter}
          </div>
        </footer>
      )}
    </div>
  )
}

export default CodeBlock
