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
  const capturingElementRef = React.useRef<HTMLElement | null>(null)
  const elementRef = React.useRef<HTMLSpanElement | null>(null)

  // Use native event listeners because React's synthetic events don't properly support setPointerCapture
  React.useEffect(() => {
    const element = elementRef.current
    if (!element)
      return

    const handleNativePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      target.setPointerCapture(event.pointerId)
      capturingElementRef.current = target
      event.preventDefault()

      if (rootContext.thumbElements.includes(target)) {
        target.focus()
      }
      else {
        onSlideStart?.(event)
      }
    }

    const handleNativePointerMove = (event: PointerEvent) => {
      const capturingElement = capturingElementRef.current
      if (!capturingElement)
        return

      if (capturingElement.hasPointerCapture(event.pointerId)) {
        onSlideMove?.(event)
      }
    }

    const handleNativePointerUp = (event: PointerEvent) => {
      const capturingElement = capturingElementRef.current
      if (!capturingElement)
        return

      if (capturingElement.hasPointerCapture(event.pointerId)) {
        capturingElement.releasePointerCapture(event.pointerId)
        capturingElementRef.current = null
        onSlideEnd?.(event)
      }
    }

    element.addEventListener('pointerdown', handleNativePointerDown)
    element.addEventListener('pointermove', handleNativePointerMove)
    element.addEventListener('pointerup', handleNativePointerUp)

    return () => {
      element.removeEventListener('pointerdown', handleNativePointerDown)
      element.removeEventListener('pointermove', handleNativePointerMove)
      element.removeEventListener('pointerup', handleNativePointerUp)
    }
  }, [onSlideStart, onSlideMove, onSlideEnd, rootContext])

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

  // React synthetic event handlers are kept for keyboard events only
  // Pointer events are handled via native listeners above due to setPointerCapture limitations

  return (
    <span
      ref={(el) => {
        elementRef.current = el
        if (typeof ref === 'function') {
          ref(el)
        }
        else if (ref) {
          ref.current = el
        }
      }}
      data-slider-impl
      style={{
        position: 'relative',
        touchAction: 'none', // Prevent default touch behaviors
        ...props.style,
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </span>
  )
})

SliderImpl.displayName = 'SliderImpl'
