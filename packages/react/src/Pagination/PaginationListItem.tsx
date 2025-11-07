import type { ComponentPropsWithoutRef } from 'react'
import { usePaginationRootContext } from './PaginationRoot'

export interface PaginationListItemProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type'> {
  /** Value for the page */
  value: number
  as?: React.ElementType
}

export function PaginationListItem({
  value,
  as: Component = 'button',
  ...props
}: PaginationListItemProps) {
  const rootContext = usePaginationRootContext()
  const isSelected = rootContext.page === value
  const disabled = rootContext.disabled

  return (
    <Component
      data-type="page"
      aria-label={`Page ${value}`}
      aria-current={isSelected ? 'page' : undefined}
      data-selected={isSelected ? 'true' : undefined}
      disabled={disabled}
      type={Component === 'button' ? 'button' : undefined}
      onClick={() => !disabled && rootContext.onPageChange(value)}
      {...props}
    >
      {props.children ?? value}
    </Component>
  )
}
