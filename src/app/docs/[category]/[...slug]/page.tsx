import fs from 'fs'
import path from 'path'
import classNames from 'classnames'
import { marked } from 'marked'
import { notFound } from 'next/navigation'
import styles from 'src/app/docs/[category]/[...slug]/page.module.scss'
import AnimateImageProvider from 'src/components/AnimateImageProvider'
import Breadcrumb from 'src/components/breadcrumb'
import RenderMarkdown from 'src/components/renderMarkdown'
import Toc from 'src/components/toc'
import AppConfig from 'src/config/app'
import { getTextFromRaw } from 'src/lib/util'

const page = async ({ params: { slug, category } }: { params: { slug: string[]; category: string } }) => {
  const decodeSlug = slug.map((s) => decodeURIComponent(s))
  let postContent,
    headings,
    breadcrumbItems = []
  try {
    postContent = await getPostContent([category, ...decodeSlug])
    const tokens = marked.lexer(postContent)
    breadcrumbItems = [category, ...decodeSlug.slice(0, -1), getTextFromRaw(tokens[0].raw) || slug[slug.length - 1]]
    headings = tokens.filter((token) => token.type === 'heading' && [2, 3].includes(token.depth)) as {
      text: string
      depth: number
    }[]
  } catch (error) {
    notFound()
  }
  return (
    <div className={styles['doc-main-container']}>
      <div className={classNames(styles['doc-container'], 'pl-4')}>
        <article className={styles['doc-article']}>
          <div className="mt-4 mb-7 md:mt-2 md:mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <AnimateImageProvider>
            <RenderMarkdown data={postContent} />
          </AnimateImageProvider>
        </article>
        <Toc headings={headings} />
      </div>
    </div>
  )
}

export default page

async function getPostContent(slug: string[]) {
  const fullPath = path.join(process.cwd(), AppConfig.docsPath, ...slug) + AppConfig.suffix
  const fileContent = fs.readFileSync(fullPath, 'utf-8')

  return fileContent
}
