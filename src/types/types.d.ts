interface Menu {
  key: string
  label: string
  children: undefined | Array<Menu>
}

type CodeblockMode = 'codeSandbox' | 'preview'

declare module '*.css'
declare module '@docsearch/css'
declare module 'normalize.css'
