import type { ComponentPropsWithoutRef } from 'react'
import { useMemo } from 'react'
import { usePaginationRootContext } from './PaginationRoot'

export interface PaginationLastProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type'> {
  as?: React.ElementType
}

export function PaginationLast({
  as: Component = 'button',
  ...props
}: PaginationLastProps) {
  const rootContext = usePaginationRootContext()
  const disabled = useMemo(() => rootContext.page === rootContext.pageCount || rootContext.disabled, [rootContext.page, rootContext.pageCount, rootContext.disabled])

  return (
    <Component
      aria-label="Last Page"
      type={Component === 'button' ? 'button' : undefined}
      disabled={disabled}
      onClick={() => !disabled && rootContext.onPageChange(rootContext.pageCount)}
      {...props}
    >
      {props.children ?? 'Last page'}
    </Component>
  )
}
