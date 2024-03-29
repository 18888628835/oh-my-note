import React from 'react'

const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <section className="scrollbar-hide md:scrollbar-default bg-inherit">{children}</section>
}

export default Container
