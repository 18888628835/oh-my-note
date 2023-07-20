import React from 'react'
import RenderMarkdown from 'src/components/renderMarkdown'
import { getPostContent } from 'src/lib/util'

const ChangeLog = async () => {
  const data = await getPostContent(['CHANGELOG'])
  return (
    <main className="grid items-center justify-center pt-4 px-4">
      <RenderMarkdown data={data} />
    </main>
  )
}

export default ChangeLog
