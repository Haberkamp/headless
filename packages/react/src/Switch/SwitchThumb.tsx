import type { ComponentPropsWithoutRef } from 'react'
import React from 'react'
import { useSwitchRootContext } from './SwitchRoot'

export interface SwitchThumbProps extends ComponentPropsWithoutRef<'span'> {}

export function SwitchThumb({
  children,
  ...props
}: SwitchThumbProps) {
  const rootContext = useSwitchRootContext()

  return (
    <span
      data-state={rootContext.modelValue ? 'checked' : 'unchecked'}
      data-disabled={rootContext.disabled ? '' : undefined}
      {...props}
    >
      {children}
    </span>
  )
}
