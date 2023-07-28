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
    <section className="min-h-[calc(100vh-var(--page-header-height))] relative sm:py-10 mx-auto sm:flex sm:flex-row sm:px-6">
      <aside className="hidden sm:block">
        <div className="styled-scrollbar sticky overflow-y-scroll top-[var(--sticky-top)] max-h-[calc(100vh-var(--sticky-top))] w-[284px]">
          <div className="border-r border-[var(--basic-border-color)] pr-4">
            <span className="flex items-center gap-2 text-lg mb-2">
              <FiBox />
              Documentation
            </span>
            <Menu menu={categoryMenu} />
          </div>
        </div>
      </aside>
      <CollapseNav menu={categoryMenu} />
      <div className="z-10">{children}</div>
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
