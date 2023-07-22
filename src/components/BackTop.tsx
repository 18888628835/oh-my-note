'use client'
import { FloatButton } from 'antd'
import React from 'react'
import { styled } from 'styled-components'

const AntBackTop = styled(FloatButton.BackTop)`
  @media (prefers-color-scheme: dark) {
    .ant-float-btn-body:hover {
      background-color: var(--color-btn-hover-background);
    }
  }
`
const BackTop = () => {
  return <AntBackTop />
}

export default BackTop
