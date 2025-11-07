import type { ComponentPropsWithoutRef } from 'react'

export interface PaginationEllipsisProps extends ComponentPropsWithoutRef<'span'> {
  as?: React.ElementType
}

export function PaginationEllipsis({
  as: Component = 'span',
  ...props
}: PaginationEllipsisProps) {
  return (
    <Component
      data-type="ellipsis"
      {...props}
    >
      {props.children ?? '…'}
    </Component>
  )
}
