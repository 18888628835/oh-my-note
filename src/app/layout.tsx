import 'animate.css'
import 'normalize.css'
import 'src/style/markdown.css'
import 'src/style/variable.css'
import 'src/style/reset.css'
import 'src/style/global.css'
import { Metadata } from 'next'
import BackTop from 'src/components/BackTop'
import Provider from 'src/components/Provider'
import Header from 'src/components/header'
import AppConfig from 'src/config/app'
import StyledJsxRegistry from 'src/lib/registry'
export const metadata: Metadata = {
  title: 'Oh-My-Note',
  description: '业余时间手写的文档系统，记录着我的心得笔记。',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = await getNavigation()
  return (
    <html lang="en">
      <body className="s:scrollbar-hide">
        <StyledJsxRegistry>
          <Provider>
            <Header nav={nav} />
            {children}
            <BackTop />
          </Provider>
        </StyledJsxRegistry>
      </body>
    </html>
  )
}

async function getNavigation() {
  return AppConfig.navigation
}
