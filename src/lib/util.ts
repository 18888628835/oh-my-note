import fs from 'fs'
import { marked } from 'marked'
import AppConfig from 'src/config/app'
export function isDirectory(path: string) {
  return fs.statSync(path).isDirectory()
}

export function addSuffix(fileName: string) {
  return fileName + AppConfig.suffix
}

export function deleteSuffix(fileName: string) {
  const pointIndex = fileName.lastIndexOf('.')
  if (pointIndex === -1) return fileName
  return fileName.substring(0, pointIndex)
}

export function getLabelFromMarkdown(markdownFilePath: string) {
  const markdown = fs.readFileSync(markdownFilePath, 'utf-8')
  const firstLine = markdown?.split('/n')[0]
  const title = marked.lexer(firstLine)[0]?.raw
  const label = title?.replaceAll('#', '').trim().replaceAll('\n', '')
  return label
}
