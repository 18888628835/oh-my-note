import path from 'path'
import React from 'react'
import AppConfig from 'src/config/app'
import { readDir } from 'src/lib/util'

const layout = async ({ children }: { children: React.ReactNode }) => {
  return <main>{children}</main>
}

export default layout
export async function generateStaticParams() {
  const entry = path.join(process.cwd(), AppConfig.docsPath)
  const categories = readDir(entry)

  return categories.map((category) => ({ category }))
}
