import type { ComponentPropsWithoutRef } from 'react'
import { useMemo } from 'react'
import { usePaginationRootContext } from './PaginationRoot'

export interface PaginationPrevProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type'> {
  as?: React.ElementType
}

export function PaginationPrev({
  as: Component = 'button',
  ...props
}: PaginationPrevProps) {
  const rootContext = usePaginationRootContext()
  const disabled = useMemo(() => rootContext.page === 1 || rootContext.disabled, [rootContext.page, rootContext.disabled])

  return (
    <Component
      aria-label="Previous Page"
      type={Component === 'button' ? 'button' : undefined}
      disabled={disabled}
      onClick={() => !disabled && rootContext.onPageChange(rootContext.page - 1)}
      {...props}
    >
      {props.children ?? 'Prev page'}
    </Component>
  )
}
