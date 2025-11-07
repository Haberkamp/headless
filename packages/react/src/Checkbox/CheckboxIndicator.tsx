import type { ComponentPropsWithoutRef } from 'react'
import React from 'react'
import { useCheckboxRootContext } from './CheckboxRoot'
import { getState, isIndeterminate } from './utils'

export interface CheckboxIndicatorProps extends ComponentPropsWithoutRef<'span'> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
}

export function CheckboxIndicator({
  forceMount,
  as: Component = 'span',
  children,
  ...props
}: CheckboxIndicatorProps) {
  const rootContext = useCheckboxRootContext()

  const present = forceMount || isIndeterminate(rootContext.state) || rootContext.state === true

  if (!present) {
    return null
  }

  return (
    <Component
      data-state={getState(rootContext.state)}
      data-disabled={rootContext.disabled ? '' : undefined}
      style={{ pointerEvents: 'none', ...props.style }}
      {...props}
    >
      {children}
    </Component>
  )
}
