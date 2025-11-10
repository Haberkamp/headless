import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { SliderHorizontal } from './SliderHorizontal'
import { SliderVertical } from './SliderVertical'
import { ARROW_KEYS, getClosestValueIndex, getDecimalCount, getNextSortedValues, hasMinStepsBetweenValues, PAGE_KEYS, roundValue } from './utils'

type DataOrientation = 'vertical' | 'horizontal'
type Direction = 'ltr' | 'rtl'
type ThumbAlignment = 'contain' | 'overflow'

export interface SliderRootProps extends Omit<ComponentPropsWithoutRef<'span'>, 'dir' | 'defaultValue' | 'children' | 'onChange'> {
  defaultValue?: number[]
  value?: number[] | null
  onChange?: (value: number[] | undefined) => void
  onValueCommit?: (value: number[]) => void
  disabled?: boolean
  orientation?: DataOrientation
  dir?: Direction
  inverted?: boolean
  min?: number
  max?: number
  step?: number
  minStepsBetweenThumbs?: number
  thumbAlignment?: ThumbAlignment
  name?: string
  required?: boolean
  children?: ReactNode | ((props: { value: number[] | null | undefined }) => ReactNode)
}

interface SliderRootContext {
  orientation: DataOrientation
  disabled: boolean
  min: number
  max: number
  value?: number[] | null | undefined
  currentValue: number[]
  valueIndexToChange: number
  setValueIndexToChange: (index: number) => void
  thumbElements: HTMLElement[]
  getNextThumbIndex: () => number
  addThumbElement: (el: HTMLElement) => void
  removeThumbElement: (el: HTMLElement) => void
  thumbAlignment: ThumbAlignment
  updateValues: (value: number, atIndex: number, options?: { commit?: boolean }) => void
}

const SliderRootContextValue = createContext<SliderRootContext | null>(null)

export function useSliderRootContext() {
  const context = useContext(SliderRootContextValue)
  if (!context) {
    throw new Error('SliderRoot must be used within SliderRoot')
  }
  return context
}

export function SliderRoot({
  defaultValue = [0],
  value: controlledValue,
  onChange,
  onValueCommit,
  disabled = false,
  orientation = 'horizontal',
  dir = 'ltr',
  inverted = false,
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  thumbAlignment = 'contain',
  name,
  required = false,
  children,
  ...props
}: SliderRootProps) {
  const [internalValue, setInternalValue] = useState<number[] | null>(defaultValue)
  const [valueIndexToChange, setValueIndexToChange] = useState(0)
  const valuesBeforeSlideStartRef = useRef<number[]>([])
  const rootRef = useRef<HTMLSpanElement>(null)
  const thumbElementsRef = useRef<HTMLElement[]>([])
  const thumbIndexCounterRef = useRef(0)

  const value = controlledValue ?? internalValue
  const currentValue = useMemo(() => Array.isArray(value) ? [...value] : [], [value])

  const isFormControl = useMemo(() => {
    if (!rootRef.current)
      return true
    return Boolean(rootRef.current.closest('form'))
  }, [])

  const updateValues = useCallback((newValue: number, atIndex: number, options?: { commit?: boolean }) => {
    const { commit } = options || { commit: false }
    const decimalCount = getDecimalCount(step)
    const snapToStep = roundValue(Math.round((newValue - min) / step) * step + min, decimalCount)
    const clampedValue = Math.min(Math.max(snapToStep, min), max)

    const nextValues = getNextSortedValues(currentValue, clampedValue, atIndex)

    if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
      const newIndex = nextValues.indexOf(clampedValue)
      setValueIndexToChange(newIndex)
      const hasChanged = String(nextValues) !== String(value)
      if (hasChanged && commit) {
        onValueCommit?.(nextValues)
      }

      if (hasChanged) {
        thumbElementsRef.current[newIndex]?.focus()
        if (controlledValue === undefined) {
          setInternalValue(nextValues)
        }
        onChange?.(nextValues)
      }
    }
  }, [currentValue, value, step, min, max, minStepsBetweenThumbs, controlledValue, onChange, onValueCommit])

  const handleSlideStart = useCallback((slideValue: number) => {
    const closestIndex = getClosestValueIndex(currentValue, slideValue)
    valuesBeforeSlideStartRef.current = [...currentValue]
    updateValues(slideValue, closestIndex)
  }, [currentValue, updateValues])

  const handleSlideMove = useCallback((slideValue: number) => {
    updateValues(slideValue, valueIndexToChange)
  }, [valueIndexToChange, updateValues])

  const handleSlideEnd = useCallback(() => {
    const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChange]
    const nextValue = currentValue[valueIndexToChange]
    const hasChanged = nextValue !== prevValue
    if (hasChanged) {
      onValueCommit?.(currentValue)
    }
  }, [valueIndexToChange, currentValue, onValueCommit])

  const getNextThumbIndex = useCallback(() => {
    return thumbIndexCounterRef.current++
  }, [])

  const addThumbElement = useCallback((el: HTMLElement) => {
    thumbElementsRef.current.push(el)
  }, [])

  const removeThumbElement = useCallback((el: HTMLElement) => {
    const i = thumbElementsRef.current.findIndex(e => e === el)
    if (i >= 0) {
      thumbElementsRef.current.splice(i, 1)
    }
  }, [])

  const contextValue = useMemo<SliderRootContext>(() => ({
    orientation,
    disabled,
    min,
    max,
    value,
    currentValue,
    valueIndexToChange,
    setValueIndexToChange,
    thumbElements: thumbElementsRef.current,
    getNextThumbIndex,
    addThumbElement,
    removeThumbElement,
    thumbAlignment,
    updateValues,
  }), [orientation, disabled, min, max, value, currentValue, valueIndexToChange, thumbAlignment, getNextThumbIndex, addThumbElement, removeThumbElement, updateValues])

  const handlePointerDown = useCallback(() => {
    if (!disabled) {
      valuesBeforeSlideStartRef.current = [...currentValue]
    }
  }, [disabled, currentValue])

  const handleHomeKeyDown = useCallback(() => {
    if (!disabled) {
      updateValues(min, 0, { commit: true })
    }
  }, [disabled, min, updateValues])

  const handleEndKeyDown = useCallback(() => {
    if (!disabled) {
      updateValues(max, currentValue.length - 1, { commit: true })
    }
  }, [disabled, max, currentValue.length, updateValues])

  const handleStepKeyDown = useCallback((event: KeyboardEvent, direction: number) => {
    if (!disabled) {
      const isPageKey = PAGE_KEYS.includes(event.key)
      const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key))
      const multiplier = isSkipKey ? 10 : 1
      const atIndex = valueIndexToChange
      const currentVal = currentValue[atIndex]
      const stepInDirection = step * multiplier * direction
      updateValues(currentVal + stepInDirection, atIndex, { commit: true })
    }
  }, [disabled, valueIndexToChange, currentValue, step, updateValues])

  const Component = orientation === 'horizontal' ? SliderHorizontal : SliderVertical

  return (
    <SliderRootContextValue.Provider value={contextValue}>
      <Component
        ref={rootRef}
        min={min}
        max={max}
        dir={dir}
        inverted={inverted}
        aria-disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        onPointerDown={handlePointerDown}
        onSlideStart={handleSlideStart}
        onSlideMove={handleSlideMove}
        onSlideEnd={handleSlideEnd}
        onHomeKeyDown={handleHomeKeyDown}
        onEndKeyDown={handleEndKeyDown}
        onStepKeyDown={handleStepKeyDown}
        {...props}
      >
        {typeof children === 'function'
          ? children({ value })
          : children}

        {isFormControl && (
          <input
            type="number"
            role="spinbutton"
            value={value?.[0] ?? ''}
            name={name}
            required={required}
            disabled={disabled}
            step={step}
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              borderWidth: 0,
            }}
            tabIndex={-1}
            readOnly
          />
        )}
      </Component>
    </SliderRootContextValue.Provider>
  )
}
