import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import { notFound } from 'next/navigation'
import React from 'react'
import { FiBox } from 'react-icons/fi'
import CollapseNav from 'src/components/collapseNav'
import Menu from 'src/components/menu/index'
import AppConfig from 'src/config/app'
import { deleteSuffix, getTitleOfMarkdown, readDir } from 'src/lib/util'

const layout = async ({
  params: { category },
  children,
}: {
  params: { category: string }
  children: React.ReactNode
}) => {
  let categoryMenu

  try {
    categoryMenu = await traverseDirectory(category)
  } catch (error) {
    notFound()
  }
  return (
    <section className="relative min-h-[calc(100vh-var(--page-header-height))] sm:pt-10 flex sm:px-6 flex-col sm:flex-row">
      <aside className="w-[284px] sticky top-[104px] sm:block hidden max-h-[calc(100vh-64px-40px)] border-r border-[var(--basic-border-color)] pr-4">
        <div className="h-full">
          {/* aside header */}
          <div className="text-lg border-b border-[var(--basic-border-color)]">
            <div className="flex items-center gap-2 pb-2">
              <FiBox />
              Documentation
            </div>
          </div>
          {/* aside content menus */}
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

async function traverseDirectory(directory: string): Promise<Menu[]> {
  function traverseDir(dir: string): Menu[] {
    const files = readDir(dir)

    const result = files.map((file) => {
      const filePath = path.join(dir, file)
      const stats = fs.statSync(filePath)
      const label = deleteSuffix(file)
      const key = deleteSuffix(filePath)

      if (stats.isDirectory()) {
        const children = traverseDir(filePath)
        return { label, key, children }
      } else {
        return { label: getTitleOfMarkdown(filePath) || label, key, children: undefined }
      }
    })

    return result
  }

  return traverseDir(path.join(AppConfig.docsPath, directory))
}

export async function generateStaticParams({ params: { category } }: { params: { category: string } }) {
  const entry = path.join(process.cwd(), AppConfig.docsPath, category, path.sep)
  // 弃用原先的手写方法，改用 glob直接获取 markdown 文件的路径
  const filePaths = await glob(`${entry}**/*${AppConfig.suffix}`)
  const slugs = filePaths.map((filePath) => ({
    slug: deleteSuffix(filePath.replace(entry, '')).split(path.sep),
    category,
  }))

  return slugs
}
