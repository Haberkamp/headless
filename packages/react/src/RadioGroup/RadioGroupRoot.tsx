import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

type AcceptableValue = string | number | bigint | Record<string, any> | null
type Direction = 'ltr' | 'rtl'
type DataOrientation = 'vertical' | 'horizontal'

export interface RadioGroupRootProps extends Omit<ComponentPropsWithoutRef<'div'>, 'dir'> {
  /** The controlled value of the radio item to check. Can be binded as `v-model`. */
  modelValue?: AcceptableValue
  /**
   * The value of the radio item that should be checked when initially rendered.
   *
   * Use when you do not need to control the state of the radio items.
   */
  defaultValue?: AcceptableValue
  /** When `true`, prevents the user from interacting with radio items. */
  disabled?: boolean
  /** The orientation of the component. */
  orientation?: DataOrientation
  /** The reading direction of the combobox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. */
  dir?: Direction
  /** When `true`, keyboard navigation will loop from last item to first, and vice versa. */
  loop?: boolean
  /** The name of the field */
  name?: string
  /** Whether the field is required */
  required?: boolean
  /** Event handler called when the radio group value changes */
  onModelValueChange?: (value: AcceptableValue) => void
  children?: ReactNode | ((props: {
    /** Current input values */
    modelValue: AcceptableValue | undefined
  }) => ReactNode)
}

interface RadioGroupRootContext {
  modelValue: AcceptableValue | undefined
  changeModelValue: (value: AcceptableValue) => void
  disabled: boolean
  loop: boolean
  orientation: DataOrientation | undefined
  name?: string
  required: boolean
  parentElement: React.RefObject<HTMLElement>
  registerItem: (value: AcceptableValue) => void
}

const RadioGroupRootContextValue = createContext<RadioGroupRootContext | null>(null)

export function useRadioGroupRootContext() {
  const context = useContext(RadioGroupRootContextValue)
  if (!context) {
    throw new Error('RadioGroupItem must be used within RadioGroupRoot')
  }
  return context
}

function useArrowNavigation(
  e: React.KeyboardEvent,
  currentElement: HTMLElement,
  parentElement: HTMLElement | undefined,
  options: {
    arrowKeyOptions?: 'horizontal' | 'vertical' | 'both'
    dir?: 'ltr' | 'rtl'
    focus?: boolean
    loop?: boolean
  } = {},
): HTMLElement | null {
  const {
    arrowKeyOptions = 'both',
    dir = 'ltr',
    focus = false,
    loop = false,
  } = options

  const [right, left, up, down] = [
    e.key === 'ArrowRight',
    e.key === 'ArrowLeft',
    e.key === 'ArrowUp',
    e.key === 'ArrowDown',
  ]
  const goingVertical = up || down
  const goingHorizontal = right || left
  if (
    (!goingVertical && !goingHorizontal)
    || (arrowKeyOptions === 'vertical' && goingHorizontal)
    || (arrowKeyOptions === 'horizontal' && goingVertical)
  ) {
    return null
  }

  const allCollectionItems: HTMLElement[] = parentElement
    ? Array.from(parentElement.querySelectorAll('[role="radio"]:not([data-disabled])'))
    : []

  if (!allCollectionItems.length)
    return null

  e.preventDefault()

  let item: HTMLElement | null = null

  if (goingHorizontal || goingVertical) {
    const goForward = goingVertical ? down : dir === 'ltr' ? right : left
    const index = allCollectionItems.indexOf(currentElement)
    const newIndex = goForward ? index + 1 : index - 1
    const adjustedNewIndex = loop
      ? (newIndex + allCollectionItems.length) % allCollectionItems.length
      : Math.max(0, Math.min(newIndex, allCollectionItems.length - 1))
    item = allCollectionItems[adjustedNewIndex] || null
  }

  if (focus && item) {
    item.focus()
  }

  return item
}

export function RadioGroupRoot({
  defaultValue,
  modelValue: controlledValue,
  disabled = false,
  orientation,
  dir = 'ltr',
  loop = true,
  name,
  required = false,
  onModelValueChange,
  children,
  ...props
}: RadioGroupRootProps) {
  const [internalValue, setInternalValue] = useState<AcceptableValue | undefined>(defaultValue)
  const rootRef = useRef<HTMLDivElement>(null)
  const parentElementRef = useRef<HTMLElement>(null)
  const registeredItemsRef = useRef<AcceptableValue[]>([])
  const hasAutoSelectedRef = useRef(false)

  const modelValue = controlledValue ?? internalValue

  const registerItem = useCallback((value: AcceptableValue) => {
    if (value === undefined)
      return

    if (!registeredItemsRef.current.includes(value)) {
      registeredItemsRef.current.push(value)

      // Auto-select first item if no value is set
      if (!hasAutoSelectedRef.current && modelValue === undefined && defaultValue === undefined && controlledValue === undefined) {
        hasAutoSelectedRef.current = true
        setInternalValue(value)
        onModelValueChange?.(value)
      }
    }
  }, [modelValue, defaultValue, controlledValue, onModelValueChange])

  useEffect(() => {
    if (rootRef.current) {
      parentElementRef.current = rootRef.current
    }
  }, [])

  const changeModelValue = useCallback((value: AcceptableValue) => {
    if (controlledValue === undefined) {
      setInternalValue(value)
    }
    onModelValueChange?.(value)
  }, [controlledValue, onModelValueChange])

  const isFormControl = useMemo(() => {
    if (!rootRef.current)
      return true
    return Boolean(rootRef.current.closest('form'))
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    if (!target || !parentElementRef.current)
      return
    const nextItem = useArrowNavigation(e.nativeEvent as any, target, parentElementRef.current, {
      arrowKeyOptions: orientation,
      dir,
      focus: true,
      loop,
    })

    // Select the item when navigating with arrow keys
    if (nextItem) {
      const dataValue = nextItem.getAttribute('data-value')
      if (dataValue) {
        try {
          const value = JSON.parse(dataValue)
          changeModelValue(value)
        }
        catch {
          // If parsing fails, use the string value as-is
          changeModelValue(dataValue)
        }
      }
    }
  }, [orientation, dir, loop, changeModelValue])

  const contextValue = useMemo<RadioGroupRootContext>(() => ({
    modelValue,
    changeModelValue,
    disabled,
    loop,
    orientation,
    name,
    required,
    parentElement: parentElementRef,
    registerItem,
  }), [modelValue, changeModelValue, disabled, loop, orientation, name, required, registerItem])

  return (
    <RadioGroupRootContextValue.Provider value={contextValue}>
      <div
        ref={rootRef}
        role="radiogroup"
        data-disabled={disabled ? '' : undefined}
        aria-orientation={orientation}
        aria-required={required}
        dir={dir}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {typeof children === 'function'
          ? children({ modelValue })
          : children}

        {isFormControl && name && (
          <input
            type="hidden"
            name={name}
            value={modelValue !== undefined ? String(modelValue) : ''}
            required={required}
            disabled={disabled}
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
    </RadioGroupRootContextValue.Provider>
  )
}
