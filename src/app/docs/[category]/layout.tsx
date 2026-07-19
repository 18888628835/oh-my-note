import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return <section className="relative min-h-[calc(100vh-var(--page-header-height))] bg-inherit">{children}</section>
}

export default layout
