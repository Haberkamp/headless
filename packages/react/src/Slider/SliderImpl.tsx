import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { forwardRef } from 'react'
import { useSliderRootContext } from './SliderRoot'
import { ARROW_KEYS, PAGE_KEYS } from './utils'

export interface SliderImplProps extends ComponentPropsWithoutRef<'span'> {
  onSlideStart?: (event: PointerEvent) => void
  onSlideMove?: (event: PointerEvent) => void
  onSlideEnd?: (event: PointerEvent) => void
  onHomeKeyDown?: (event: KeyboardEvent) => void
  onEndKeyDown?: (event: KeyboardEvent) => void
  onStepKeyDown?: (event: KeyboardEvent, direction: number) => void
  children?: ReactNode
}

export const SliderImpl = forwardRef<HTMLSpanElement, SliderImplProps>(({
  onSlideStart,
  onSlideMove,
  onSlideEnd,
  onHomeKeyDown,
  onEndKeyDown,
  onStepKeyDown,
  children,
  ...props
}, ref) => {
  const rootContext = useSliderRootContext()

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Home') {
      onHomeKeyDown?.(event.nativeEvent)
      event.preventDefault()
    }
    else if (event.key === 'End') {
      onEndKeyDown?.(event.nativeEvent)
      event.preventDefault()
    }
    else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
      onStepKeyDown?.(event.nativeEvent, 0)
      event.preventDefault()
    }
  }

  const handlePointerDown = (event: React.PointerEvent) => {
    const target = event.target as HTMLElement
    target.setPointerCapture(event.pointerId)
    event.preventDefault()
    if (rootContext.thumbElements.includes(target)) {
      target.focus()
    }
    else {
      onSlideStart?.(event.nativeEvent)
    }
  }

  const handlePointerMove = (event: React.PointerEvent) => {
    const target = event.target as HTMLElement
    if (target.hasPointerCapture(event.pointerId)) {
      onSlideMove?.(event.nativeEvent)
    }
  }

  const handlePointerUp = (event: React.PointerEvent) => {
    const target = event.target as HTMLElement
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId)
      onSlideEnd?.(event.nativeEvent)
    }
  }

  return (
    <span
      ref={ref}
      data-slider-impl
      style={{
        position: 'relative',
        ...props.style,
      }}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      {...props}
    >
      {children}
    </span>
  )
})

SliderImpl.displayName = 'SliderImpl'
