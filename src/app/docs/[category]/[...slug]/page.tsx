import { marked } from 'marked'
import { notFound } from 'next/navigation'
import AnimateImageProvider from 'src/components/AnimateImageProvider'
import Breadcrumb from 'src/components/breadcrumb'
import RenderMarkdown from 'src/components/renderMarkdown'
import Toc from 'src/components/toc'
import AppConfig from 'src/config/app'
import { getPostContent, getTextFromRaw } from 'src/lib/util'

const page = async ({ params: { slug, category } }: { params: { slug: string[]; category: string } }) => {
  const decodeSlug = slug.map((s) => decodeURIComponent(s))
  let postContent,
    headings,
    breadcrumbItems = []
  try {
    postContent = await getPostContent([AppConfig.docsPath, category, ...decodeSlug])
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
    <div className="flex w-full h-full">
      <article className="px-4 md:px-6 overflow-x-hidden">
        <div className="mt-4 mb-7 sm:mt-2 md:mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <AnimateImageProvider>
          <RenderMarkdown data={postContent} />
        </AnimateImageProvider>
      </article>
      <Toc headings={headings} />
    </div>
  )
}

export default page
