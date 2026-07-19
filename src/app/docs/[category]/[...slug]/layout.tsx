import path from 'path'
import { glob } from 'glob'
import { notFound } from 'next/navigation'
import React from 'react'
import { FiBox } from 'react-icons/fi'
import CollapseNav from 'src/components/collapseNav'
import Menu from 'src/components/menu/index'
import AppConfig from 'src/config/app'
import { deleteSuffix, traverseDocsDirectory } from 'src/lib/util'

const layout = async ({
  params: { category },
  children,
}: {
  params: { category: string }
  children: React.ReactNode
}) => {
  let categoryMenu: Menu[]

  try {
    categoryMenu = traverseDocsDirectory(decodeURIComponent(category))
  } catch {
    notFound()
  }

  return (
    <section className="relative min-h-[calc(100vh-var(--page-header-height))] sm:pt-10 flex sm:px-6 flex-col sm:flex-row bg-inherit">
      <aside className="w-[284px] sticky top-[104px] sm:block hidden max-h-[calc(100vh-64px-40px)] border-r border-[var(--basic-border-color)] pr-4">
        <div className="h-full">
          <div className="text-lg border-b border-[var(--basic-border-color)]">
            <div className="flex items-center gap-2 pb-2">
              <FiBox />
              Documentation
            </div>
          </div>
          <div className="max-h-[calc(100%-36px)] overflow-y-scroll">
            <Menu menu={categoryMenu} />
          </div>
        </div>
      </aside>
      <div className="z-20 sticky top-[64px] block sm:hidden">
        <CollapseNav menu={categoryMenu} />
      </div>
      <div className="z-10 flex-1 relative dark:bg-[var(--dark-bg-color)]">{children}</div>
    </section>
  )
}

export default layout

export async function generateStaticParams({ params: { category } }: { params: { category: string } }) {
  const entry = path.join(process.cwd(), AppConfig.docsPath, category, path.sep)
  const filePaths = await glob(`${entry}**/*${AppConfig.suffix}`)
  return filePaths.map((filePath) => ({
    slug: deleteSuffix(filePath.replace(entry, '')).split(path.sep),
  }))
}
