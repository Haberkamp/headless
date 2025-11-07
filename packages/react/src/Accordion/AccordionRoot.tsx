import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

type Direction = 'ltr' | 'rtl'
type DataOrientation = 'vertical' | 'horizontal'
type SingleOrMultipleType = 'single' | 'multiple'
type AcceptableValue = string | number | bigint | Record<string, any> | null

interface SingleOrMultipleProps<T = AcceptableValue | AcceptableValue[]> {
  type?: SingleOrMultipleType
  modelValue?: T
  defaultValue?: T
  onModelValueChange?: (value: (T extends 'single' ? string : string[]) | undefined) => void
}

function isEqual(a: any, b: any): boolean {
  if (a === b)
    return true
  if (a == null || b == null)
    return false
  if (typeof a !== typeof b)
    return false
  if (typeof a !== 'object')
    return a === b
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length)
    return false
  for (const key of keysA) {
    if (!keysB.includes(key) || !isEqual(a[key], b[key]))
      return false
  }
  return true
}

function isValueEqualOrExist(arr: AcceptableValue[], value: AcceptableValue): boolean {
  return arr.some(item => isEqual(item, value))
}

function getDefaultType({ type, defaultValue, modelValue }: SingleOrMultipleProps): SingleOrMultipleType {
  if (type)
    return type
  const value = modelValue || defaultValue
  if (value !== undefined) {
    return Array.isArray(value) ? 'multiple' : 'single'
  }
  return 'single'
}

function getDefaultValue({ type, defaultValue }: SingleOrMultipleProps): AcceptableValue | AcceptableValue[] | undefined {
  if (defaultValue !== undefined)
    return defaultValue
  return type === 'single' ? undefined : []
}

export interface AccordionRootProps<T = string | string[]>
  extends Omit<ComponentPropsWithoutRef<'div'>, 'dir'>, SingleOrMultipleProps<T> {
  collapsible?: boolean
  disabled?: boolean
  dir?: Direction
  orientation?: DataOrientation
  unmountOnHide?: boolean
  children?: ReactNode | ((props: { modelValue: AcceptableValue | AcceptableValue[] | undefined }) => ReactNode)
}

interface AccordionRootContext {
  disabled: boolean
  direction: Direction
  orientation: DataOrientation
  parentElement: React.RefObject<HTMLElement>
  changeModelValue: (value: string) => void
  isSingle: boolean
  modelValue: AcceptableValue | AcceptableValue[] | undefined
  collapsible: boolean
  unmountOnHide: boolean
}

const AccordionRootContextValue = createContext<AccordionRootContext | null>(null)

export function useAccordionRootContext() {
  const context = useContext(AccordionRootContextValue)
  if (!context) {
    throw new Error('AccordionRoot must be used within AccordionRoot')
  }
  return context
}

export function AccordionRoot<T extends string | string[] = string | string[]>({
  type,
  modelValue: controlledValue,
  defaultValue,
  onModelValueChange,
  collapsible = false,
  disabled = false,
  dir = 'ltr',
  orientation = 'vertical',
  unmountOnHide = true,
  children,
  ...props
}: AccordionRootProps<T>) {
  const resolvedType = useMemo(() => getDefaultType({ type, defaultValue, controlledValue }), [type, defaultValue, controlledValue])
  const defaultVal = useMemo(() => getDefaultValue({ type, defaultValue }), [type, defaultValue])

  const [internalValue, setInternalValue] = useState<AcceptableValue | AcceptableValue[] | undefined>(defaultVal)
  const parentElementRef = useRef<HTMLDivElement>(null)

  const modelValue = controlledValue ?? internalValue
  const isSingle = resolvedType === 'single'

  const changeModelValue = useCallback((value: string) => {
    if (isSingle) {
      const newValue = isEqual(value, modelValue) ? undefined : value
      if (controlledValue === undefined)
        setInternalValue(newValue)
      onModelValueChange?.(newValue as any)
    }
    else {
      const modelValueArray = Array.isArray(modelValue) ? [...modelValue] : (modelValue ? [modelValue] : [])
      let newValue: AcceptableValue[]
      if (isValueEqualOrExist(modelValueArray as AcceptableValue[], value)) {
        const index = modelValueArray.findIndex(i => isEqual(i, value))
        newValue = [...modelValueArray]
        newValue.splice(index, 1)
      }
      else {
        newValue = [...modelValueArray, value]
      }
      if (controlledValue === undefined)
        setInternalValue(newValue)
      onModelValueChange?.(newValue as any)
    }
  }, [isSingle, modelValue, controlledValue, onModelValueChange])

  const contextValue = useMemo<AccordionRootContext>(() => ({
    disabled,
    direction: dir,
    orientation,
    parentElement: parentElementRef,
    changeModelValue,
    isSingle,
    modelValue,
    collapsible,
    unmountOnHide,
  }), [disabled, dir, orientation, changeModelValue, isSingle, modelValue, collapsible, unmountOnHide])

  return (
    <AccordionRootContextValue.Provider value={contextValue}>
      <div ref={parentElementRef} {...props}>
        {typeof children === 'function'
          ? children({ modelValue })
          : children}
      </div>
    </AccordionRootContextValue.Provider>
  )
}
