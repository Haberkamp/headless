import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const DEFAULT_MAX = 100

export type ProgressState = 'indeterminate' | 'loading' | 'complete'

export interface ProgressRootProps extends Omit<ComponentPropsWithoutRef<'div'>, 'dir'> {
  /** The progress value. Can be controlled. */
  modelValue?: number | null
  /** The maximum progress value. */
  max?: number
  /**
   * A function to get the accessible label text in a human-readable format.
   *
   * If not provided, the value label will be read as the numeric value as a percentage of the max value.
   */
  getValueLabel?: (value: number | null | undefined, max: number) => string | undefined
  /**
   * A function to get the accessible value text representing the current value in a human-readable format.
   */
  getValueText?: (value: number | null | undefined, max: number) => string | undefined
  /** Event handler called when the progress value changes */
  onModelValueChange?: (value: number | null | undefined) => void
  /** Event handler called when the max value changes */
  onMaxChange?: (value: number) => void
  children?: ReactNode | ((props: { modelValue: number | null | undefined }) => ReactNode)
}

interface ProgressRootContext {
  modelValue: number | null | undefined
  max: number
  progressState: ProgressState
}

const ProgressRootContextValue = createContext<ProgressRootContext | null>(null)

export function useProgressRootContext() {
  const context = useContext(ProgressRootContextValue)
  if (!context) {
    throw new Error('ProgressRoot must be used within ProgressRoot')
  }
  return context
}

const isNumber = (v: any): v is number => typeof v === 'number'

const isNullish = (value: any): value is null | undefined => value === null || value === undefined

function validateValue(value: any, max: number): number | null {
  const isValidValue
    = isNullish(value)
      || (isNumber(value) && !Number.isNaN(value) && value <= max && value >= 0)

  if (isValidValue)
    return value as number | null

  console.error(`Invalid prop \`value\` of value \`${value}\` supplied to \`ProgressRoot\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\`  or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`)
  return null
}

function validateMax(max: number): number {
  const isValidMaxError = isNumber(max) && !Number.isNaN(max) && max > 0

  if (isValidMaxError)
    return max

  console.error(
    `Invalid prop \`max\` of value \`${max}\` supplied to \`ProgressRoot\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`,
  )
  return DEFAULT_MAX
}

export function ProgressRoot({
  modelValue: controlledValue,
  max: maxProp = DEFAULT_MAX,
  getValueLabel = (value: number | null | undefined, max: number) =>
    isNumber(value) ? `${Math.round((value / max) * DEFAULT_MAX)}%` : undefined,
  getValueText,
  onModelValueChange,
  onMaxChange,
  children,
  ...props
}: ProgressRootProps) {
  const [internalValue, setInternalValue] = useState<number | null | undefined>(undefined)
  const [internalMax, setInternalMax] = useState(maxProp)

  const modelValue = controlledValue ?? internalValue
  const max = useMemo(() => validateMax(maxProp), [maxProp])

  useEffect(() => {
    const correctedMax = validateMax(maxProp)
    if (correctedMax !== internalMax) {
      setInternalMax(correctedMax)
      onMaxChange?.(correctedMax)
    }
  }, [maxProp, internalMax, onMaxChange])

  useEffect(() => {
    const correctedValue = validateValue(modelValue, max)
    if (correctedValue !== modelValue) {
      if (controlledValue === undefined) {
        setInternalValue(correctedValue)
      }
      onModelValueChange?.(correctedValue)
    }
  }, [modelValue, max, controlledValue, onModelValueChange])

  const progressState = useMemo<ProgressState>(() => {
    if (isNullish(modelValue))
      return 'indeterminate'
    if (modelValue === max)
      return 'complete'
    return 'loading'
  }, [modelValue, max])

  const contextValue = useMemo<ProgressRootContext>(() => ({
    modelValue,
    max,
    progressState,
  }), [modelValue, max, progressState])

  return (
    <ProgressRootContextValue.Provider value={contextValue}>
      <div
        role="progressbar"
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={isNumber(modelValue) ? modelValue : undefined}
        aria-valuetext={getValueText?.(modelValue, max)}
        aria-label={getValueLabel(modelValue, max)}
        data-state={progressState}
        data-value={modelValue ?? undefined}
        data-max={max}
        {...props}
      >
        {typeof children === 'function'
          ? children({ modelValue })
          : children}
      </div>
    </ProgressRootContextValue.Provider>
  )
}
