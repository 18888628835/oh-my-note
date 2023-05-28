import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import { notFound } from 'next/navigation'
import styles from 'src/app/docs/[category]/[...slug]/page.module.scss'
import RenderMarkdown from 'src/components/renderMarkdown'
import AppConfig from 'src/config/app'

const page = async ({ params: { slug, category } }: { params: { slug: string[]; category: string } }) => {
  let postContent, headings

  try {
    postContent = await getPostContent([category, ...slug])
    const tokens = marked.lexer(postContent)
    headings = tokens.filter((token) => token.type === 'heading' && [2, 3].includes(token.depth)) as { text: string }[]
  } catch (error) {
    notFound()
  }
  return (
    <div className="post" style={{ display: 'flex' }}>
      <article className={styles['blog-container']}>
        <RenderMarkdown data={postContent} />
      </article>
      <div>
        <nav>
          {headings.map(({ text }, index) => (
            <div key={index}>{text}</div>
          ))}
        </nav>
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
