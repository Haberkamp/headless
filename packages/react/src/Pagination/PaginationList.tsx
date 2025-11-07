import type { ComponentPropsWithoutRef } from 'react'
import { useMemo } from 'react'
import { usePaginationRootContext } from './PaginationRoot'
import { getRange, transform } from './utils'

type Pages = Array<{ type: 'ellipsis' } | { type: 'page', value: number }>

export interface PaginationListProps extends ComponentPropsWithoutRef<'ul'> {
  children?: React.ReactNode | ((props: { items: Pages }) => React.ReactNode)
}

export function PaginationList({
  children,
  ...props
}: PaginationListProps) {
  const rootContext = usePaginationRootContext()

  const items = useMemo(() => {
    return transform(
      getRange(
        rootContext.page,
        rootContext.pageCount,
        rootContext.siblingCount,
        rootContext.showEdges,
      ),
    )
  }, [rootContext.page, rootContext.pageCount, rootContext.siblingCount, rootContext.showEdges])

  if (typeof children === 'function') {
    return <ul {...props}>{children({ items })}</ul>
  }

  return <ul {...props}>{children}</ul>
}
