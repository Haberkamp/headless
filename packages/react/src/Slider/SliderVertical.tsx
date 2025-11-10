import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react'
import { SliderImpl } from './SliderImpl'
import { useSliderRootContext } from './SliderRoot'
import { BACK_KEYS, linearScale } from './utils'

interface SliderVerticalProps extends ComponentPropsWithoutRef<'span'> {
  min: number
  max: number
  inverted?: boolean
  onSlideStart?: (value: number) => void
  onSlideMove?: (value: number) => void
  onSlideEnd?: () => void
  onHomeKeyDown?: (event: KeyboardEvent) => void
  onEndKeyDown?: (event: KeyboardEvent) => void
  onStepKeyDown?: (event: KeyboardEvent, direction: number) => void
  children?: ReactNode
}

export const SliderVertical = forwardRef<HTMLSpanElement, SliderVerticalProps>(({
  min,
  max,
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

  const isSlidingFromBottom = useMemo(() => !inverted, [inverted])

  const getValueFromPointerEvent = useCallback((event: PointerEvent, slideStart?: boolean) => {
    const rect = rectRef.current || sliderElementRef.current!.getBoundingClientRect()
    const thumb = rootContext.thumbElements[rootContext.valueIndexToChange]
    const thumbHeight = rootContext.thumbAlignment === 'contain' ? thumb.clientHeight : 0

    if (!offsetPosition && !slideStart && rootContext.thumbAlignment === 'contain') {
      setOffsetPosition(event.clientY - thumb.getBoundingClientRect().top)
    }

    const input: [number, number] = [0, rect.height - thumbHeight]
    const output: [number, number] = isSlidingFromBottom ? [max, min] : [min, max]
    const value = linearScale(input, output)

    const position = slideStart
      ? event.clientY - rect.top - thumbHeight / 2
      : event.clientY - rect.top - (offsetPosition ?? 0)

    rectRef.current = rect
    return value(position)
  }, [min, max, isSlidingFromBottom, rootContext, offsetPosition])

  const startEdge = useMemo(() => isSlidingFromBottom ? 'bottom' : 'top', [isSlidingFromBottom])
  const endEdge = useMemo(() => isSlidingFromBottom ? 'top' : 'bottom', [isSlidingFromBottom])
  const direction = useMemo(() => isSlidingFromBottom ? 1 : -1, [isSlidingFromBottom])

  const handleSlideStart = useCallback((event: PointerEvent) => {
    const value = getValueFromPointerEvent(event, true)
    onSlideStart?.(value)
  }, [getValueFromPointerEvent, onSlideStart])

  const handleSlideMove = useCallback((event: PointerEvent) => {
    const value = getValueFromPointerEvent(event)
    onSlideMove?.(value)
  }, [getValueFromPointerEvent, onSlideMove])

  const handleSlideEnd = useCallback(() => {
    rectRef.current = undefined
    setOffsetPosition(undefined)
    onSlideEnd?.()
  }, [onSlideEnd])

  const handleStepKeyDown = useCallback((event: KeyboardEvent, _direction: number) => {
    const slideDirection = isSlidingFromBottom ? 'from-bottom' : 'from-top'
    const isBackKey = BACK_KEYS[slideDirection].includes(event.key)
    onStepKeyDown?.(event, isBackKey ? -1 : 1)
  }, [isSlidingFromBottom, onStepKeyDown])

  return (
    <SliderImpl
      ref={(el) => {
        sliderElementRef.current = el
        if (typeof ref === 'function')
          ref(el)
        else if (ref)
          ref.current = el
      }}
      data-orientation="vertical"
      style={{
        ['--reka-slider-thumb-transform' as any]:
          !isSlidingFromBottom && rootContext.thumbAlignment === 'overflow' ? 'translateY(-50%)' : 'translateY(50%)',
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

SliderVertical.displayName = 'SliderVertical'
