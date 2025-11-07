import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { CheckedState } from './utils'
import { isEqual } from 'ohash'
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useCheckboxGroupRootContext } from './CheckboxGroupRoot'
import { getState, isIndeterminate } from './utils'

type AcceptableValue = string | number | bigint | Record<string, any> | null

function isNullish(value: any): value is null | undefined {
  return value === null || value === undefined
}

function isValueEqualOrExist<T>(base: T | T[] | undefined, current: T | T[] | undefined) {
  if (isNullish(base))
    return false
  if (Array.isArray(base)) {
    return base.some(val => isEqual(val, current))
  }
  else {
    return isEqual(base, current)
  }
}

export interface CheckboxRootProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'onClick'> {
  /** The value of the checkbox when it is initially rendered. Use when you do not need to control its value. */
  defaultValue?: boolean | 'indeterminate'
  /** The controlled value of the checkbox. */
  modelValue?: boolean | 'indeterminate' | null
  /** When `true`, prevents the user from interacting with the checkbox */
  disabled?: boolean
  /**
   * The value given as data when submitted with a `name`.
   *  @defaultValue "on"
   */
  value?: AcceptableValue
  /** Id of the element */
  id?: string
  /** The name of the field */
  name?: string
  /** Whether the field is required */
  required?: boolean
  /** Event handler called when the value of the checkbox changes. */
  onModelValueChange?: (value: boolean | 'indeterminate') => void
  children?: ReactNode | ((props: {
    /** Current value */
    modelValue: CheckedState
    /** Current state */
    state: CheckedState
  }) => ReactNode)
}

interface CheckboxRootContext {
  disabled: boolean
  state: CheckedState
}

const CheckboxRootContextValue = createContext<CheckboxRootContext | null>(null)

export function useCheckboxRootContext() {
  const context = useContext(CheckboxRootContextValue)
  if (!context) {
    throw new Error('CheckboxRoot must be used within CheckboxRoot')
  }
  return context
}

export function CheckboxRoot({
  defaultValue,
  modelValue: controlledValue,
  disabled: propDisabled = false,
  value = 'on',
  id,
  name,
  required = false,
  onModelValueChange,
  children,
  ...props
}: CheckboxRootProps) {
  const checkboxGroupContext = useCheckboxGroupRootContext(null)
  const [internalValue, setInternalValue] = useState<CheckedState>(defaultValue ?? false)
  const rootRef = useRef<HTMLButtonElement>(null)

  const modelValue = controlledValue ?? internalValue

  const disabled = checkboxGroupContext?.disabled ?? propDisabled

  const checkboxState = useMemo<CheckedState>(() => {
    if (!isNullish(checkboxGroupContext?.modelValue)) {
      return isValueEqualOrExist(checkboxGroupContext.modelValue, value)
    }
    else {
      return modelValue === 'indeterminate' ? 'indeterminate' : modelValue
    }
  }, [checkboxGroupContext?.modelValue, value, modelValue])

  const handleClick = useCallback(() => {
    if (!isNullish(checkboxGroupContext?.modelValue)) {
      const modelValueArray = [...(checkboxGroupContext.modelValue || [])]
      if (isValueEqualOrExist(modelValueArray, value)) {
        const index = modelValueArray.findIndex(i => isEqual(i, value))
        modelValueArray.splice(index, 1)
      }
      else {
        modelValueArray.push(value)
      }
      checkboxGroupContext.changeModelValue(modelValueArray)
    }
    else {
      const newValue = isIndeterminate(modelValue) ? true : !modelValue
      if (controlledValue === undefined) {
        setInternalValue(newValue)
      }
      onModelValueChange?.(newValue)
    }
  }, [checkboxGroupContext, value, modelValue, controlledValue, onModelValueChange])

  const isFormControl = useMemo(() => {
    if (!rootRef.current)
      return true
    return Boolean(rootRef.current.closest('form'))
  }, [])

  const ariaLabel = useMemo(() => {
    if (id && rootRef.current) {
      const label = document.querySelector(`[for="${id}"]`) as HTMLLabelElement
      return label?.innerText
    }
    return undefined
  }, [id])

  const contextValue = useMemo<CheckboxRootContext>(() => ({
    disabled,
    state: checkboxState,
  }), [disabled, checkboxState])

  return (
    <CheckboxRootContextValue.Provider value={contextValue}>
      <button
        ref={rootRef}
        id={id}
        role="checkbox"
        type="button"
        aria-checked={isIndeterminate(checkboxState) ? 'mixed' : checkboxState}
        aria-required={required}
        aria-label={props['aria-label'] || ariaLabel}
        data-state={getState(checkboxState)}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
          }
          props.onKeyDown?.(e)
        }}
        onClick={handleClick}
        {...props}
      >
        {typeof children === 'function'
          ? children({ modelValue, state: checkboxState })
          : children}

        {isFormControl && name && !checkboxGroupContext && (
          <input
            type="checkbox"
            checked={!!checkboxState}
            name={name}
            value={value as string}
            disabled={disabled}
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
            readOnly
          />
        )}
      </button>
    </CheckboxRootContextValue.Provider>
  )
}
