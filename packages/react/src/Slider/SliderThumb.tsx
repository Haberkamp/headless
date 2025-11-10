import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { useRef } from 'react'
import { useSliderRootContext } from './SliderRoot'
import { SliderThumbImpl } from './SliderThumbImpl'

export interface SliderThumbProps extends ComponentPropsWithoutRef<'span'> {
  children?: ReactNode
}

export function SliderThumb({ children, ...props }: SliderThumbProps) {
  const rootContext = useSliderRootContext()
  const indexRef = useRef<number | null>(null)
  if (indexRef.current === null) {
    indexRef.current = rootContext.getNextThumbIndex()
  }
  const index = indexRef.current

  return (
    <SliderThumbImpl
      index={index}
      {...props}
    >
      {children}
    </SliderThumbImpl>
  )
}
