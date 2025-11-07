import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { isEqual } from 'ohash'
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

type AcceptableValue = string | number | bigint | Record<string, any> | null

function isValueEqualOrExist<T>(base: T | T[] | undefined, current: T | T[] | undefined) {
  if (base == null)
    return false
  if (Array.isArray(base)) {
    return base.some(val => isEqual(val, current))
  }
  else {
    return isEqual(base, current)
  }
}

export interface CheckboxGroupRootProps<T = AcceptableValue> extends Omit<ComponentPropsWithoutRef<'div'>, 'dir'> {
  /** The value of the checkbox when it is initially rendered. Use when you do not need to control its value. */
  defaultValue?: T[]
  /** The controlled value of the checkbox. */
  modelValue?: T[]
  /** When `false`, navigating through the items using arrow keys will be disabled. */
  rovingFocus?: boolean
  /** When `true`, prevents the user from interacting with the checkboxes */
  disabled?: boolean
  /** The reading direction */
  dir?: 'ltr' | 'rtl'
  /** The orientation of the group */
  orientation?: 'horizontal' | 'vertical'
  /** Whether to loop focus */
  loop?: boolean
  /** The name of the field */
  name?: string
  /** Whether the field is required */
  required?: boolean
  /** Event handler called when the value of the checkbox changes. */
  onModelValueChange?: (value: T[]) => void
  children?: ReactNode
}

interface CheckboxGroupRootContext {
  modelValue: AcceptableValue[]
  rovingFocus: boolean
  disabled: boolean
  changeModelValue: (value: AcceptableValue[]) => void
}

const CheckboxGroupRootContextValue = createContext<CheckboxGroupRootContext | null>(null)

export function useCheckboxGroupRootContext(fallback: CheckboxGroupRootContext | null): CheckboxGroupRootContext | null {
  const context = useContext(CheckboxGroupRootContextValue)
  return context ?? fallback
}

export function CheckboxGroupRoot<T extends AcceptableValue = AcceptableValue>({
  defaultValue = [],
  modelValue: controlledValue,
  rovingFocus = true,
  disabled = false,
  dir = 'ltr',
  orientation,
  loop,
  name,
  required = false,
  onModelValueChange,
  children,
  ...props
}: CheckboxGroupRootProps<T>) {
  const [internalValue, setInternalValue] = useState<T[]>(defaultValue)
  const rootRef = useRef<HTMLDivElement>(null)

  const modelValue = controlledValue ?? internalValue

  const changeModelValue = useCallback((value: AcceptableValue[]) => {
    if (controlledValue === undefined) {
      setInternalValue(value as T[])
    }
    onModelValueChange?.(value as T[])
  }, [controlledValue, onModelValueChange])

  const isFormControl = useMemo(() => {
    if (!rootRef.current)
      return true
    return Boolean(rootRef.current.closest('form'))
  }, [])

  const contextValue = useMemo<CheckboxGroupRootContext>(() => ({
    modelValue: modelValue as AcceptableValue[],
    rovingFocus,
    disabled,
    changeModelValue,
  }), [modelValue, rovingFocus, disabled, changeModelValue])

  return (
    <CheckboxGroupRootContextValue.Provider value={contextValue}>
      <div
        ref={rootRef}
        dir={dir}
        data-orientation={orientation}
        {...props}
      >
        {children}

        {isFormControl && name && (
          <input
            type="hidden"
            name={name}
            value={JSON.stringify(modelValue)}
            required={required}
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
            aria-hidden="true"
            data-hidden
          />
        )}
      </div>
    </CheckboxGroupRootContextValue.Provider>
  )
}
