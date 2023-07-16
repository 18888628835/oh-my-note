import RenderMarkdown from 'src/components/renderMarkdown'
import { getREADME } from 'src/lib/util'

export default async function Home() {
  const markdown = await getREADME()
  return (
    <main className="pt-4 px-4 s:px-8 sm:px-16 w-full grid items-center justify-center min-h-[calc(100vh-var(--page-header-height))] bg-[linear-gradient(0deg, var(--banner-background-color) 0, #fff 100%)]">
      <RenderMarkdown data={markdown} />
    </main>
  )
}
