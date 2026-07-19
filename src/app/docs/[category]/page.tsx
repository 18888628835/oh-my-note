import { notFound } from 'next/navigation'
import DocsIndex from 'src/components/docsIndex'
import { traverseDocsDirectory } from 'src/lib/util'

const page = async ({ params: { category } }: { params: { category: string } }) => {
  const decodedCategory = decodeURIComponent(category)

  try {
    const menu = traverseDocsDirectory(decodedCategory)
    return <DocsIndex category={decodedCategory} menu={menu} />
  } catch {
    notFound()
  }
}

export default page
