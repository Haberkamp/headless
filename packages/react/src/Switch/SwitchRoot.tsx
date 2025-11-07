import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

export interface SwitchRootProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'onClick'> {
  /** The state of the switch when it is initially rendered. Use when you do not need to control its state. */
  defaultValue?: boolean
  /** The controlled state of the switch. */
  modelValue?: boolean | null
  /** When `true`, prevents the user from interacting with the switch. */
  disabled?: boolean
  id?: string
  /** The value given as data when submitted with a `name`. */
  value?: string
  /** The name of the field */
  name?: string
  /** Whether the field is required */
  required?: boolean
  /** Event handler called when the value of the switch changes. */
  onModelValueChange?: (value: boolean) => void
  children?: ReactNode | ((props: {
    /** Current value */
    modelValue: boolean
  }) => ReactNode)
}

interface SwitchRootContext {
  modelValue: boolean
  toggleCheck: () => void
  disabled: boolean
}

const SwitchRootContextValue = createContext<SwitchRootContext | null>(null)

export function useSwitchRootContext() {
  const context = useContext(SwitchRootContextValue)
  if (!context) {
    throw new Error('SwitchThumb must be used within SwitchRoot')
  }
  return context
}

export function SwitchRoot({
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
}: SwitchRootProps) {
  const [internalValue, setInternalValue] = useState<boolean>(defaultValue ?? false)
  const rootRef = useRef<HTMLButtonElement>(null)

  const modelValue = controlledValue ?? internalValue
  const disabled = propDisabled

  const toggleCheck = useCallback(() => {
    if (disabled)
      return

    const newValue = !modelValue
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onModelValueChange?.(newValue)
  }, [disabled, modelValue, controlledValue, onModelValueChange])

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

  const contextValue = useMemo<SwitchRootContext>(() => ({
    modelValue,
    toggleCheck,
    disabled,
  }), [modelValue, toggleCheck, disabled])

  return (
    <SwitchRootContextValue.Provider value={contextValue}>
      <button
        ref={rootRef}
        id={id}
        role="switch"
        type="button"
        aria-checked={modelValue}
        aria-required={required}
        aria-label={props['aria-label'] || ariaLabel}
        data-state={modelValue ? 'checked' : 'unchecked'}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        onClick={toggleCheck}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            toggleCheck()
          }
          props.onKeyDown?.(e)
        }}
        {...props}
      >
        {typeof children === 'function'
          ? children({ modelValue })
          : children}

        {isFormControl && name && (
          <input
            type="checkbox"
            name={name}
            disabled={disabled}
            required={required}
            value={value}
            checked={!!modelValue}
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
    </SwitchRootContextValue.Provider>
  )
}
