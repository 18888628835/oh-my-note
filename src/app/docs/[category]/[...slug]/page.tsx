import { notFound } from 'next/navigation'
import AnimateImageProvider from 'src/components/AnimateImageProvider'
import Breadcrumb from 'src/components/breadcrumb'
import RenderMarkdown from 'src/components/renderMarkdown'
import Toc from 'src/components/toc'
import AppConfig from 'src/config/app'
import { getHeadingOfMarkdown, getPostContent } from 'src/lib/util'

const page = async ({ params: { slug, category } }: { params: { slug: string[]; category: string } }) => {
  const decodeSlug = slug.map((s) => decodeURIComponent(s))
  let postContent,
    tocHeadings,
    breadcrumbItems = []
  try {
    postContent = await getPostContent([AppConfig.docsPath, category, ...decodeSlug])
    const headings = getHeadingOfMarkdown(postContent, [1, 2, 3])
    tocHeadings = headings.filter((item) => item.depth !== 1)
    breadcrumbItems = [category, ...decodeSlug.slice(0, -1), headings[0]?.text ?? slug[slug.length - 1]]
  } catch (error) {
    notFound()
  }
  return (
    <div className="grid w-full h-full lg:grid-cols-[1fr_14rem]">
      <article className="px-4 md:px-6 overflow-x-hidden">
        <div className="mt-4 mb-7 sm:mt-2 md:mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <AnimateImageProvider>
          <RenderMarkdown data={postContent} />
        </AnimateImageProvider>
      </article>
      <Toc headings={tocHeadings} />
    </div>
  )
}

export default page
