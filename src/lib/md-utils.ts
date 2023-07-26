import { getParameters } from 'codesandbox/lib/api/define'
import queryString from 'query-string'
import {
  appJsx,
  indexHtml,
  indexJsx,
  languageSuffixMapping,
  packageJSON,
  codeSandboxSrc,
  embedConfiguration,
} from 'src/lib/constant'
embedConfiguration

export function getChildrenId(children: any[]) {
  let text = ''
  for (const n of children) {
    if (n.children) {
      text = text + getChildrenId(n.children)
    } else {
      text = text + n.value
    }
  }
  return text.replaceAll(' ', '')
}

export function getSuffixFromLanguage(language: string) {
  let suffix = language
  if (language in languageSuffixMapping) {
    suffix = languageSuffixMapping[language as keyof typeof languageSuffixMapping]
  }
  return suffix
}

export function getCodeSandboxParameters({ language, code }: { language: string; code: string }) {
  let configuration = {}
  const suffix = getSuffixFromLanguage(language)

  if (language === 'jsx' || language === 'tsx') {
    configuration = {
      'index.html': {
        content: indexHtml,
        isBinary: false,
      },
      [`index.${suffix}`]: {
        content: indexJsx,
        isBinary: false,
      },
      [`app.${suffix}`]: { content: appJsx, isBinary: false },
      [`demo.${suffix}`]: {
        content: code,
        isBinary: false,
      },
      'package.json': {
        content: JSON.stringify({ ...packageJSON, main: `index.${suffix}` }, null, 2),
        isBinary: false,
      },
    }
  }
  return getParameters({
    files: {
      [`index.${suffix}`]: {
        content: code,
        isBinary: false,
      },
      ...configuration,
    },
  })
}

export function getCodeSandboxSrc({ embed, parameters }: { embed: boolean; parameters?: string }) {
  if (embed === false) return codeSandboxSrc
  const searchString = queryString.stringify({ ...embedConfiguration, parameters })
  return `${codeSandboxSrc}?${searchString}`
}

export function executeJS(code: string) {
  try {
    return new Function(code)()
  } catch (error) {
    if (error instanceof Error) window.alert(error.message)
  }
}
