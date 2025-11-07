import type { ComponentPropsWithoutRef } from 'react'
import React from 'react'
import { useCollapsibleRootContext } from './CollapsibleRoot'

export interface CollapsibleTriggerProps extends ComponentPropsWithoutRef<'button'> {}

export function CollapsibleTrigger({
  as: Component = 'button',
  ...props
}: CollapsibleTriggerProps) {
  const rootContext = useCollapsibleRootContext()

  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      aria-controls={rootContext.contentId}
      aria-expanded={rootContext.open}
      data-state={rootContext.open ? 'open' : 'closed'}
      data-disabled={rootContext.disabled ? '' : undefined}
      disabled={rootContext.disabled}
      onClick={rootContext.onOpenToggle}
      {...props}
    />
  )
}
