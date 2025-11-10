import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { SelectEvent } from './utils'
import { isEqual } from 'ohash'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRadioGroupRootContext } from './RadioGroupRoot'
import { handleSelect } from './utils'

type AcceptableValue = string | number | bigint | Record<string, any> | null

export interface RadioGroupItemProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'onClick'> {
  id?: string
  /** The value given as data when submitted with a `name`. */
  value?: AcceptableValue
  /** When `true`, prevents the user from interacting with the radio item. */
  disabled?: boolean
  /** Event handler called when the radio item is selected */
  onSelect?: (event: SelectEvent) => void
  children?: ReactNode | ((props: {
    /** Current checked state */
    checked: boolean
    /** Required state */
    required: boolean
    /** Disabled state */
    disabled: boolean
  }) => ReactNode)
}

interface RadioGroupItemContext {
  disabled: boolean
  checked: boolean
}

const RadioGroupItemContextValue = createContext<RadioGroupItemContext | null>(null)

export function useRadioGroupItemContext() {
  const context = useContext(RadioGroupItemContextValue)
  if (!context) {
    throw new Error('RadioGroupIndicator must be used within RadioGroupItem')
  }
  return context
}

export function RadioGroupItem({
  id,
  value,
  disabled: propDisabled = false,
  as: Component = 'button',
  onSelect,
  children,
  ...props
}: RadioGroupItemProps) {
  const rootContext = useRadioGroupRootContext()
  const itemRef = useRef<HTMLButtonElement>(null)
  const [isArrowKeyPressed, setIsArrowKeyPressed] = useState(false)

  const disabled = rootContext.disabled || propDisabled
  const checked = useMemo(() => {
    if (rootContext.modelValue === undefined || value === undefined)
      return false
    return isEqual(rootContext.modelValue, value)
  }, [rootContext.modelValue, value])

  const required = rootContext.required

  useEffect(() => {
    if (value !== undefined) {
      rootContext.registerItem(value)
    }
  }, [value, rootContext])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
        setIsArrowKeyPressed(true)
    }
    const handleKeyUp = () => {
      setIsArrowKeyPressed(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled)
      return

    handleSelect(event.nativeEvent, value, (ev) => {
      onSelect?.(ev)
      if (ev?.defaultPrevented)
        return

      rootContext.changeModelValue(value!)
      const isFormControl = itemRef.current?.closest('form')
      if (isFormControl) {
        ev.stopPropagation()
      }
    })
  }, [disabled, value, onSelect, rootContext])

  const handleFocus = useCallback(() => {
    setTimeout(() => {
      /**
       * Our arrow navigation will focus the radio when navigating with arrow keys
       * and we need to 'check' it in that case. We click it to 'check' it (instead
       * of updating `context.value`) so that the radio change event fires.
       */
      if (isArrowKeyPressed && itemRef.current)
        itemRef.current.click()
    }, 0)
  }, [isArrowKeyPressed])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    props.onKeyDown?.(e)
  }, [props])

  const isFormControl = useMemo(() => {
    if (!itemRef.current)
      return true
    return Boolean(itemRef.current.closest('form'))
  }, [])

  const ariaLabel = useMemo(() => {
    if (id && itemRef.current) {
      const label = document.querySelector(`[for="${id}"]`) as HTMLLabelElement
      return label?.innerText
    }
    return undefined
  }, [id])

  const contextValue = useMemo<RadioGroupItemContext>(() => ({
    disabled,
    checked,
  }), [disabled, checked])

  const valueString = useMemo(() => {
    if (value === undefined)
      return undefined
    return JSON.stringify(value)
  }, [value])

  const formValue = useMemo(() => {
    if (value === undefined)
      return undefined
    return String(value)
  }, [value])

  return (
    <RadioGroupItemContextValue.Provider value={contextValue}>
      <Component
        ref={itemRef as any}
        id={id}
        role="radio"
        type={Component === 'button' ? 'button' : undefined}
        aria-checked={checked}
        aria-label={props['aria-label'] || ariaLabel}
        aria-disabled={disabled ? 'true' : undefined}
        data-state={checked ? 'checked' : 'unchecked'}
        data-disabled={disabled ? '' : undefined}
        data-value={valueString}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...props}
      >
        {typeof children === 'function'
          ? children({ checked, required, disabled })
          : children}

        {isFormControl && rootContext.name && (
          <input
            type="radio"
            tabIndex={-1}
            value={formValue}
            checked={checked}
            name={rootContext.name}
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
            aria-hidden="true"
            readOnly
          />
        )}
      </Component>
    </RadioGroupItemContextValue.Provider>
  )
}
