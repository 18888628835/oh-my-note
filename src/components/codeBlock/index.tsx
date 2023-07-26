'use client'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import React, { FC, PropsWithChildren, useState } from 'react'
import { AiOutlineCheck, AiOutlineCodeSandbox } from 'react-icons/ai'
import { BsCodeSlash, BsCode } from 'react-icons/bs'
import { MdOutlineContentCopy } from 'react-icons/md'
import { VscDebugStart } from 'react-icons/vsc'
import Root from 'react-shadow'
import styles from 'src/components/codeBlock/index.module.scss'
import { languageIconMapping } from 'src/lib/constant'
import { executeJS, getCodeSandboxParameters, getCodeSandboxSrc } from 'src/lib/md-utils'

interface ICodeBlock {
  code: string
  language: string
  mode?: CodeblockMode
  renderHighlighter: React.ReactNode
}

const CodeBlock: FC<PropsWithChildren<ICodeBlock>> = ({ language, code, renderHighlighter, mode }) => {
  const [copied, setCopied] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const parameters = getCodeSandboxParameters({ language, code })
  const LanguageIcon = languageIconMapping?.[language] || languageIconMapping.default

  function reset() {
    setCopied(false)
  }
  async function onCopy() {
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
  function toggleShowCode() {
    setShowCode((oldStatus) => !oldStatus)
  }

  return (
    <div className={classNames('dark:bg-[var(--dark-code-block-bg-color)]', styles['root-container'])}>
      <div
        className={classNames(
          styles['copy-wrap'],
          'flex-space-between-box bg-[var(--basic-background)] dark:bg-[var(--dark-code-block-header-bg-color)]',
        )}
      >
        <div className="flex items-center gap-1">
          <LanguageIcon className="text-lg" />
          <span>{language}</span>
        </div>
        <div className="flex gap-1">
          {/* 小写的 language以便验证是否有 execute 图标 */}
          {['js', 'javascript'].includes(language) && (
            <Tooltip title="执行代码">
              <button
                onClick={() => executeJS(code)}
                className={classNames(
                  'flex items-center justify-center dark:hover:bg-[var(--dark-btn-hover-bg-color)] dark:hover:text-[var(--dark-btn-hover-color)] hover:bg-[var(--color-btn-hover-background)]',
                  styles['copy-btn'],
                )}
              >
                <VscDebugStart />
              </button>
            </Tooltip>
          )}
          <Tooltip title="复制代码">
            <button
              onClick={onCopy}
              className={classNames(
                'flex-center-box dark:hover:bg-[var(--dark-btn-hover-bg-color)] dark:hover:text-[var(--dark-btn-hover-color)] hover:bg-[var(--color-btn-hover-background)]',
                styles['copy-btn'],
              )}
            >
              {!copied ? (
                <MdOutlineContentCopy className={classNames('animate__animated', 'animate__zoomIn')} />
              ) : (
                <AiOutlineCheck className={classNames('animate__animated', 'animate__zoomIn')} />
              )}
            </button>
          </Tooltip>
        </div>
      </div>
      {mode === 'preview' ? (
        <Root.div className="px-2 py-2 w-full max-h-[500px] overflow-scroll flex justify-center items-center">
          <div dangerouslySetInnerHTML={{ __html: code }} />
        </Root.div>
      ) : mode === 'codeSandbox' ? (
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
      {mode && (
        <footer>
          <div className="text-gray-500 text-xl gap-2 flex items-center px-3 py-3 border-t border-[rgba(5, 5, 5, 0.06)] dark:border-[var(--basic-border-color)] border-dashed">
            {mode === 'preview' && (
              <form
                className="flex items-center"
                action={getCodeSandboxSrc({ embed: false })}
                method="POST"
                target="_blank"
              >
                <input type="hidden" name="parameters" value={`${parameters}`} />
                <Tooltip title="在 codeSandbox 中打开">
                  <button type="submit" className="dark:hover:text-[var(--dark-btn-hover-color)]">
                    <AiOutlineCodeSandbox />
                  </button>
                </Tooltip>
              </form>
            )}
            <Tooltip title={showCode ? '隐藏代码' : '显示代码'}>
              <button type="button" onClick={toggleShowCode} className="dark:hover:text-[var(--dark-btn-hover-color)]">
                {showCode ? <BsCodeSlash /> : <BsCode />}
              </button>
            </Tooltip>
          </div>

          <div
            hidden={!showCode}
            className="border-dashed border-t border-[rgba(5, 5, 5, 0.06)] dark:border-[var(--basic-border-color)]"
          >
            {renderHighlighter}
          </div>
        </footer>
      )}
    </div>
  )
}

export default CodeBlock
