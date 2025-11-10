import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { useMemo } from 'react'
import { useSliderRootContext } from './SliderRoot'
import { convertValueToPercentage } from './utils'

export interface SliderRangeProps extends ComponentPropsWithoutRef<'span'> {
  children?: ReactNode
}

export function SliderRange({ children, ...props }: SliderRangeProps) {
  const rootContext = useSliderRootContext()

  const percentages = useMemo(() => rootContext.currentValue.map(value =>
    convertValueToPercentage(value, rootContext.min, rootContext.max),
  ), [rootContext.currentValue, rootContext.min, rootContext.max])

  const offsetStart = useMemo(() => rootContext.currentValue.length > 1 ? Math.min(...percentages) : 0, [rootContext.currentValue.length, percentages])
  const offsetEnd = useMemo(() => 100 - Math.max(...percentages, 0), [percentages])

  const orientation = rootContext.orientation === 'horizontal'
    ? { startEdge: 'left' as const, endEdge: 'right' as const }
    : { startEdge: 'bottom' as const, endEdge: 'top' as const }

  return (
    <span
      data-disabled={rootContext.disabled ? '' : undefined}
      data-orientation={rootContext.orientation}
      style={{
        [orientation.startEdge]: `${offsetStart}%`,
        [orientation.endEdge]: `${offsetEnd}%`,
        ...props.style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
