import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { StringOrNumber } from './utils'
import React, { createContext, useCallback, useContext, useId, useMemo, useRef, useState } from 'react'

type Direction = 'ltr' | 'rtl'
type DataOrientation = 'vertical' | 'horizontal'

export interface TabsRootProps<T extends StringOrNumber = StringOrNumber>
  extends Omit<ComponentPropsWithoutRef<'div'>, 'dir'> {
  defaultValue?: T
  orientation?: DataOrientation
  dir?: Direction
  activationMode?: 'automatic' | 'manual'
  modelValue?: T
  onModelValueChange?: (value: T) => void
  unmountOnHide?: boolean
  children?: ReactNode | ((props: { modelValue: T | undefined }) => ReactNode)
}

interface TabsRootContext {
  modelValue: StringOrNumber | undefined
  changeModelValue: (value: StringOrNumber) => void
  orientation: DataOrientation
  dir: Direction
  unmountOnHide: boolean
  activationMode: 'automatic' | 'manual'
  baseId: string
  tabsList: React.RefObject<HTMLElement>
}

const TabsRootContextValue = createContext<TabsRootContext | null>(null)

export function useTabsRootContext() {
  const context = useContext(TabsRootContextValue)
  if (!context) {
    throw new Error('TabsRoot must be used within TabsRoot')
  }
  return context
}

export function TabsRoot<T extends StringOrNumber = StringOrNumber>({
  defaultValue,
  orientation = 'horizontal',
  dir = 'ltr',
  activationMode = 'automatic',
  modelValue: controlledValue,
  onModelValueChange,
  unmountOnHide = true,
  children,
  ...props
}: TabsRootProps<T>) {
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue)
  const tabsListRef = useRef<HTMLElement>(null)
  const baseId = useId()

  const modelValue = controlledValue ?? internalValue

  const changeModelValue = useCallback((value: StringOrNumber) => {
    if (controlledValue === undefined) {
      setInternalValue(value as T)
    }
    onModelValueChange?.(value as T)
  }, [controlledValue, onModelValueChange])

  const contextValue = useMemo<TabsRootContext>(() => ({
    modelValue,
    changeModelValue,
    orientation,
    dir,
    unmountOnHide,
    activationMode,
    baseId: `reka-tabs-${baseId}`,
    tabsList: tabsListRef,
  }), [modelValue, changeModelValue, orientation, dir, unmountOnHide, activationMode, baseId])

  return (
    <TabsRootContextValue.Provider value={contextValue}>
      <div
        dir={dir}
        data-orientation={orientation}
        {...props}
      >
        {typeof children === 'function'
          ? children({ modelValue })
          : children}
      </div>
    </TabsRootContextValue.Provider>
  )
}
