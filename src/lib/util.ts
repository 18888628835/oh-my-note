import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import AppConfig from 'src/config/app'

export function deleteSuffix(fileName: string) {
  const pointIndex = fileName.lastIndexOf(AppConfig.suffix)
  if (pointIndex === -1) return fileName
  return fileName.substring(0, pointIndex)
}

export function getTitleOfMarkdown(markdownFilePath: string) {
  const markdown = fs.readFileSync(markdownFilePath, 'utf-8')
  const rootHeading = getHeadingOfMarkdown(markdown, [1])
  const title = rootHeading[0]?.text ?? ''
  return title
}
export function getHeadingOfMarkdown(markdown: string, levels: number[]) {
  const heading = marked
    .lexer(markdown)
    .filter((item) => item.type === 'heading' && levels.includes(item.depth)) as marked.Tokens.Heading[]
  return heading
}

export function readDir(entry: string) {
  // ios系统会自动创建一个.DS_Store文件，需要过滤掉
  return fs.readdirSync(entry).filter((file) => (file === '.DS_Store' ? false : true))
}

export async function getPostContent(paths: string[]) {
  const fullPath = path.join(process.cwd(), ...paths) + AppConfig.suffix
  const fileContent = fs.readFileSync(fullPath, 'utf-8')

  return fileContent
}

export function sleep(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}
