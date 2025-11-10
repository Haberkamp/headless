import type { ComponentPropsWithoutRef } from 'react'
import React from 'react'
import { useRadioGroupItemContext } from './RadioGroupItem'

export interface RadioGroupIndicatorProps extends ComponentPropsWithoutRef<'span'> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
}

export function RadioGroupIndicator({
  forceMount,
  as: Component = 'span',
  children,
  ...props
}: RadioGroupIndicatorProps) {
  const itemContext = useRadioGroupItemContext()

  const present = forceMount || itemContext.checked

  if (!present) {
    return null
  }

  return (
    <Component
      data-state={itemContext.checked ? 'checked' : 'unchecked'}
      data-disabled={itemContext.disabled ? '' : undefined}
      {...props}
    >
      {children}
    </Component>
  )
}
