'use client'

import 'katex/dist/katex.min.css'

import { type PropsWithChildren } from 'react'

import { type MenuId } from '~/components/Navigation/NavigationMenu/NavigationMenu'
import { LayoutMainContent } from '~/layouts/DefaultLayout'
import { MainSkeleton } from '~/layouts/MainSkeleton'

interface LayoutProps extends PropsWithChildren {
  menuId: MenuId
}

function ReferenceLayout({ menuId, children }: LayoutProps) {
  return (
    <>
      <MainSkeleton menuId={menuId}>
        <LayoutMainContent className="pb-0">{children}</LayoutMainContent>
      </MainSkeleton>
    </>
  )
}

export { ReferenceLayout }
