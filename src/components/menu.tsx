'use client'
import { Menu as AntdMenu, MenuProps } from 'antd'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { styled } from 'styled-components'
import useDecodeParams from 'src/hooks/useDecodeParams'
const StyledMenu = styled(AntdMenu)`
  &.ant-menu-root {
    border: none;
    font-size: var(--basic-font-size);
    color: rgb(96, 103, 112);
    position: sticky;
    top: calc(var(--page-header-height) + 1rem + var(--doc-margin-top));
    height: calc(100vh - var(--page-header-height) - 1rem - var(--doc-margin-top));
  }
  .ant-menu-item,
  .ant-menu-submenu > .ant-menu-submenu-title {
    margin: 0 !important;
    width: 100%;
    border-radius: 4px !important;
  }
  .ant-menu-item-selected {
    background-color: rgb(197, 228, 255);
    color: var(--color-for-hover-link) !important;
  }
  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: var(--color-for-hover-link) !important;
  }
  .ant-menu-sub {
    background-color: transparent !important;
  }
`
const Menu: FC<MenuProps> = (props) => {
  const { push } = useRouter()
  const { category, slug } = useDecodeParams()
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])
  const extendFolder = slug.slice(0, slug.lastIndexOf('/'))

  useEffect(() => {
    setSelectedKeys([decodeURIComponent(`docs/${category}/${slug}`)])
  }, [category, slug])

  return (
    <StyledMenu
      defaultOpenKeys={[decodeURIComponent(`docs/${category}/${extendFolder}`)]}
      selectedKeys={selectedKeys}
      onSelect={({ selectedKeys }) => setSelectedKeys(selectedKeys)}
      expandIcon={({ isOpen }) => (
        <MdOutlineKeyboardArrowRight
          className={classNames('transition-transform', 'text-xl', 'text-[#b8b8c1]', {
            'rotate-90': isOpen,
          })}
        />
      )}
      className="text-ellipsis whitespace-nowrap overflow-x-hidden overflow-y-auto"
      {...props}
      onClick={(item) => {
        push(item.key)
      }}
    />
  )
}

export default Menu
