import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import React from 'react'
import { FiBox } from 'react-icons/fi'
import CollapseNav from 'src/components/collapseNav'
import Menu from 'src/components/menu/index'
import AppConfig from 'src/config/app'
import { deleteSuffix, getLabelFromMarkdown, readDir } from 'src/lib/util'

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
    <section className="max-w-screen-xl min-h-[calc(100vh-var(--page-header-height))] relative sm:py-10 mx-auto sm:flex sm:flex-row sm:px-6">
      <aside className="hidden sm:block relative">
        <div className="styled-scrollbar sticky overflow-y-scroll top-[var(--sticky-top)] h-[calc(100vh-var(--sticky-top))] pr-4 w-[284px]">
          <span className="flex items-center gap-2 text-lg mb-2">
            <FiBox />
            Documentation
          </span>
          <Menu menu={categoryMenu} />
        </div>
      </aside>
      <CollapseNav menu={categoryMenu} />
      <div className="z-10 flex-grow flex">{children}</div>
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
        return { label: getLabelFromMarkdown(filePath) || label, key, children: undefined }
      }
    })

    return result
  }

  return traverseDir(path.join(AppConfig.docsPath, directory))
}

function getFileLists(directory: string) {
  const fileList: Array<string[]> = []

  function traverseDir(dir: string, prefix = '') {
    const files = readDir(dir)

    files.forEach((file) => {
      const filePath = path.join(dir, file)
      const stats = fs.statSync(filePath)

      if (stats.isDirectory()) {
        traverseDir(filePath, path.join(prefix, file))
      } else {
        fileList.push([...prefix.split('/'), deleteSuffix(file)])
      }
    })
  }

  traverseDir(directory)

  return fileList
}

export async function generateStaticParams({ params: { category } }: { params: { category: string } }) {
  const fileLists = getFileLists(path.join(process.cwd(), AppConfig.docsPath, category))

  const slugs = fileLists.map((fileList) => ({ slug: fileList.filter((name) => name !== ''), category }))

  return slugs
}
