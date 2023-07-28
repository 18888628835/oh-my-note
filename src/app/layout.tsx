import 'animate.css'
import 'normalize.css'
import 'src/style/markdown.css'
import 'src/style/variable.css'
import 'src/style/reset.css'
import 'src/style/global.css'
import '@docsearch/css'
import { Metadata } from 'next'
import Container from 'src/app/Container'
import BackTop from 'src/components/BackTop'
import Provider from 'src/components/Provider'
import Header from 'src/components/header'
import AppConfig from 'src/config/app'
import StyledJsxRegistry from 'src/lib/registry'
export const metadata: Metadata = {
  title: AppConfig.brand,
  description: '业余时间手写的文档系统，记录着我的心得笔记。',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = await getNavigation()
  return (
    <html lang="en" className="dark:bg-[var(--dark-bg-color)] dark:text-white">
      <link
        rel="preconnect"
        href={`https://${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}-dsn.algolia.net`}
        crossOrigin="anonymous"
      />
      <body>
        <StyledJsxRegistry>
          <Provider>
            <Container>
              <Header nav={nav} />
              {children}
              <BackTop />
            </Container>
          </Provider>
        </StyledJsxRegistry>
      </body>
    </html>
  )
}

async function getNavigation() {
  return AppConfig.navigation
}
