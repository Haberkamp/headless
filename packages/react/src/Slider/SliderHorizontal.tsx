import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { Direction } from './utils'
import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react'
import { SliderImpl } from './SliderImpl'
import { useSliderRootContext } from './SliderRoot'
import { BACK_KEYS, linearScale } from './utils'

interface SliderHorizontalProps extends ComponentPropsWithoutRef<'span'> {
  min: number
  max: number
  dir?: Direction
  inverted?: boolean
  onSlideStart?: (value: number) => void
  onSlideMove?: (value: number) => void
  onSlideEnd?: () => void
  onHomeKeyDown?: (event: KeyboardEvent) => void
  onEndKeyDown?: (event: KeyboardEvent) => void
  onStepKeyDown?: (event: KeyboardEvent, direction: number) => void
  children?: ReactNode
}

export const SliderHorizontal = forwardRef<HTMLSpanElement, SliderHorizontalProps>(({
  min,
  max,
  dir = 'ltr',
  inverted = false,
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
  const sliderElementRef = useRef<HTMLSpanElement>(null)
  const [offsetPosition, setOffsetPosition] = useState<number>()
  const rectRef = useRef<DOMRect | undefined>(undefined)

  const isSlidingFromLeft = useMemo(() => (dir !== 'rtl' && !inverted) || (dir !== 'ltr' && inverted), [dir, inverted])

  const getValueFromPointerEvent = useCallback((event: PointerEvent, slideStart?: boolean) => {
    const rect = rectRef.current || sliderElementRef.current!.getBoundingClientRect()
    const thumb = rootContext.thumbElements[rootContext.valueIndexToChange]
    const thumbWidth = rootContext.thumbAlignment === 'contain' ? thumb.clientWidth : 0

    if (!offsetPosition && !slideStart && rootContext.thumbAlignment === 'contain') {
      setOffsetPosition(event.clientX - thumb.getBoundingClientRect().left)
    }

    const input: [number, number] = [0, rect.width - thumbWidth]
    const output: [number, number] = isSlidingFromLeft ? [min, max] : [max, min]
    const value = linearScale(input, output)

    rectRef.current = rect
    const position = slideStart
      ? event.clientX - rect.left - thumbWidth / 2
      : event.clientX - rect.left - (offsetPosition ?? 0)

    return value(position)
  }, [min, max, isSlidingFromLeft, rootContext, offsetPosition])

  const startEdge = useMemo(() => isSlidingFromLeft ? 'left' : 'right', [isSlidingFromLeft])
  const endEdge = useMemo(() => isSlidingFromLeft ? 'right' : 'left', [isSlidingFromLeft])
  const direction = useMemo(() => isSlidingFromLeft ? 1 : -1, [isSlidingFromLeft])

  const handleSlideStart = useCallback((event: PointerEvent) => {
    const value = getValueFromPointerEvent(event, true)
    onSlideStart?.(value)
  }, [getValueFromPointerEvent, onSlideStart])

  const handleSlideMove = useCallback((event: PointerEvent) => {
    const value = getValueFromPointerEvent(event)
    onSlideMove?.(value)
  }, [getValueFromPointerEvent, onSlideMove])

  const handleSlideEnd = useCallback(() => {
    rectRef.current = undefined as any
    setOffsetPosition(undefined)
    onSlideEnd?.()
  }, [onSlideEnd])

  const handleStepKeyDown = useCallback((event: KeyboardEvent, _direction: number) => {
    const slideDirection = isSlidingFromLeft ? 'from-left' : 'from-right'
    const isBackKey = BACK_KEYS[slideDirection].includes(event.key)
    onStepKeyDown?.(event, isBackKey ? -1 : 1)
  }, [isSlidingFromLeft, onStepKeyDown])

  return (
    <SliderImpl
      ref={(el) => {
        sliderElementRef.current = el
        if (typeof ref === 'function')
          ref(el)
        else if (ref)
          ref.current = el
      }}
      dir={dir}
      data-orientation="horizontal"
      style={{
        ['--reka-slider-thumb-transform' as any]:
          !isSlidingFromLeft && rootContext.thumbAlignment === 'overflow' ? 'translateX(50%)' : 'translateX(-50%)',
        ...props.style,
      }}
      onSlideStart={handleSlideStart}
      onSlideMove={handleSlideMove}
      onSlideEnd={handleSlideEnd}
      onStepKeyDown={handleStepKeyDown}
      onEndKeyDown={onEndKeyDown}
      onHomeKeyDown={onHomeKeyDown}
      {...props}
    >
      {children}
    </SliderImpl>
  )
})

SliderHorizontal.displayName = 'SliderHorizontal'
