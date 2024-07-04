'use client'

import 'katex/dist/katex.min.css'

import { type PropsWithChildren } from 'react'

import { type MenuDefn, type MenuId } from '~/components/Navigation/NavigationMenu/NavigationMenu'
import { LayoutMainContent } from '~/layouts/DefaultLayout'
import { MainSkeleton } from '~/layouts/MainSkeleton'

interface LayoutProps extends PropsWithChildren {
  menuId: MenuId
  menuDefn: MenuDefn
}

function ReferenceLayout({ menuId, menuDefn, children }: LayoutProps) {
  return (
    <>
      <MainSkeleton menuId={menuId} menuDefn={menuDefn}>
        <LayoutMainContent className="pb-0">{children}</LayoutMainContent>
      </MainSkeleton>
    </>
  )
}

export { ReferenceLayout }
