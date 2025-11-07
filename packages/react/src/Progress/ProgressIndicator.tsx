import type { ComponentPropsWithoutRef } from 'react'
import React from 'react'
import { useProgressRootContext } from './ProgressRoot'

export interface ProgressIndicatorProps extends ComponentPropsWithoutRef<'div'> {}

export function ProgressIndicator({
  ...props
}: ProgressIndicatorProps) {
  const rootContext = useProgressRootContext()

  return (
    <div
      data-state={rootContext.progressState}
      data-value={rootContext.modelValue ?? undefined}
      data-max={rootContext.max}
      {...props}
    />
  )
}
