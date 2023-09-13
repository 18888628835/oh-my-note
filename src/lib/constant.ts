import { AiFillHtml5, AiOutlineFile, AiOutlineConsoleSql } from 'react-icons/ai'
import { BiLogoTypescript, BiLogoJavascript, BiLogoCss3, BiTerminal } from 'react-icons/bi'
import { IconType } from 'react-icons/lib'
import { VscJson } from 'react-icons/vsc'

export const languageSuffixMapping = {
  jsx: 'jsx',
  tsx: 'tsx',
  javascript: 'js',
  js: 'js',
  json: 'json',
  css: 'css',
  html: 'html',
  typescript: 'ts',
  ts: 'ts',
}

export const codeSandboxSrc = 'https://codesandbox.io/api/v1/sandboxes/define'
export const packageJSON = {
  dependencies: {
    '@types/react': '^18.0.0',
    '@types/react-dom': '^18.0.0',
    react: '^18.0.0',
    'react-dom': '^18.0.0',
  },
  devDependencies: {
    typescript: '^5.0.2',
  },
}
export const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
  </head>
  <body>
    <div id="container" style="padding: 24px" />
    <script>const mountNode = document.getElementById('container');</script>
  </body>
</html>
`
export const indexJsx = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

createRoot(document.getElementById('container')).render(<App />);
`

export const appJsx = `
import React from 'react';
import  Demo  from './demo';
  
const App: React.FC = () => <Demo/>;
  
export default App;
`
export const embedConfiguration = {
  embed: 1,
  hidedevtools: 1,
  hidenavigation: 1,
  autoresize: 1,
  runonclick: 1,
  theme: 'light',
  view: 'preview',
}

export const languageIconMapping: Record<string, IconType> = {
  html: AiFillHtml5,
  typescript: BiLogoTypescript,
  ts: BiLogoTypescript,
  tsx: BiLogoTypescript,
  javascript: BiLogoJavascript,
  js: BiLogoJavascript,
  jsx: BiLogoJavascript,
  css: BiLogoCss3,
  json: VscJson,
  sql: AiOutlineConsoleSql,
  bash: BiTerminal,
  default: AiOutlineFile,
}
