import type { ComponentPropsWithoutRef } from 'react'
import { useMemo } from 'react'
import { usePaginationRootContext } from './PaginationRoot'

export interface PaginationFirstProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type'> {
  as?: React.ElementType
}

export function PaginationFirst({
  as: Component = 'button',
  ...props
}: PaginationFirstProps) {
  const rootContext = usePaginationRootContext()
  const disabled = useMemo(() => rootContext.page === 1 || rootContext.disabled, [rootContext.page, rootContext.disabled])

  return (
    <Component
      aria-label="First Page"
      type={Component === 'button' ? 'button' : undefined}
      disabled={disabled}
      onClick={() => !disabled && rootContext.onPageChange(1)}
      {...props}
    >
      {props.children ?? 'First page'}
    </Component>
  )
}
