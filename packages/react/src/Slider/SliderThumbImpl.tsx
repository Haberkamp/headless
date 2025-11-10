import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { useSliderRootContext } from './SliderRoot'
import { convertValueToPercentage, getLabel, getThumbInBoundsOffset } from './utils'

export interface SliderThumbImplProps extends ComponentPropsWithoutRef<'span'> {
  index: number
  children?: ReactNode
}

export const SliderThumbImpl = forwardRef<HTMLElement, SliderThumbImplProps>(({
  index,
  children,
  ...props
}, ref) => {
  const rootContext = useSliderRootContext()
  const thumbElementRef = useRef<HTMLElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setIsMounted(true)
    const element = thumbElementRef.current
    if (element) {
      rootContext.addThumbElement(element)
      const updateSize = () => {
        setSize({ width: element.clientWidth, height: element.clientHeight })
      }
      updateSize()
      const observer = new ResizeObserver(updateSize)
      observer.observe(element)
      return () => {
        observer.disconnect()
        rootContext.removeThumbElement(element)
      }
    }
  }, [rootContext])

  const value = useMemo(() => rootContext.value?.[index], [rootContext.value, index])
  const percent = useMemo(() => value === undefined ? 0 : convertValueToPercentage(value, rootContext.min, rootContext.max), [value, rootContext.min, rootContext.max])
  const label = useMemo(() => getLabel(index, rootContext.value?.length ?? 0), [index, rootContext.value?.length])

  const orientation = rootContext.orientation === 'horizontal'
    ? { startEdge: 'left' as const, size: size.width, direction: 1 }
    : { startEdge: 'bottom' as const, size: size.height, direction: -1 }

  const thumbInBoundsOffset = useMemo(() => {
    if (rootContext.thumbAlignment === 'overflow' || !orientation.size) {
      return 0
    }
    else {
      return getThumbInBoundsOffset(orientation.size, percent, orientation.direction)
    }
  }, [rootContext.thumbAlignment, orientation.size, percent, orientation.direction])

  const handleFocus = () => {
    rootContext.setValueIndexToChange(index)
  }

  return (
    <span
      ref={(el) => {
        thumbElementRef.current = el
        if (typeof ref === 'function')
          ref(el)
        else if (ref)
          ref.current = el
      }}
      role="slider"
      tabIndex={rootContext.disabled ? undefined : 0}
      aria-label={props['aria-label'] || label}
      aria-disabled={rootContext.disabled ? 'true' : undefined}
      data-disabled={rootContext.disabled ? '' : undefined}
      data-orientation={rootContext.orientation}
      aria-valuenow={value}
      aria-valuemin={rootContext.min}
      aria-valuemax={rootContext.max}
      aria-orientation={rootContext.orientation}
      onFocus={handleFocus}
      style={{
        transform: 'var(--reka-slider-thumb-transform)',
        position: 'absolute',
        [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`,
        display: !isMounted && value === undefined ? 'none' : 'block',
        width: props.style?.width || '20px',
        height: props.style?.height || '20px',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </span>
  )
})

SliderThumbImpl.displayName = 'SliderThumbImpl'
