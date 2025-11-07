import type { ComponentPropsWithoutRef } from 'react'
import { useMemo } from 'react'
import { usePaginationRootContext } from './PaginationRoot'

export interface PaginationNextProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type'> {
  as?: React.ElementType
}

export function PaginationNext({
  as: Component = 'button',
  ...props
}: PaginationNextProps) {
  const rootContext = usePaginationRootContext()
  const disabled = useMemo(() => rootContext.page === rootContext.pageCount || rootContext.disabled, [rootContext.page, rootContext.pageCount, rootContext.disabled])

  return (
    <Component
      aria-label="Next Page"
      type={Component === 'button' ? 'button' : undefined}
      disabled={disabled}
      onClick={() => !disabled && rootContext.onPageChange(rootContext.page + 1)}
      {...props}
    >
      {props.children ?? 'Next page'}
    </Component>
  )
}
