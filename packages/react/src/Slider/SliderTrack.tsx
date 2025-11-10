import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React from 'react'
import { useSliderRootContext } from './SliderRoot'

export interface SliderTrackProps extends ComponentPropsWithoutRef<'span'> {
  children?: ReactNode
}

export function SliderTrack({ children, ...props }: SliderTrackProps) {
  const rootContext = useSliderRootContext()

  return (
    <span
      data-disabled={rootContext.disabled ? '' : undefined}
      data-orientation={rootContext.orientation}
      {...props}
    >
      {children}
    </span>
  )
}
