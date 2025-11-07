import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAccordionRootContext } from './AccordionRoot'

enum AccordionItemState {
  Open = 'open',
  Closed = 'closed',
}

export interface AccordionItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'dir'> {
  disabled?: boolean
  value: string
  children?: ReactNode | ((props: { open: boolean }) => ReactNode)
}

interface AccordionItemContext {
  open: boolean
  dataState: AccordionItemState
  disabled: boolean
  dataDisabled: '' | undefined
  triggerId: string
  currentRef: React.RefObject<HTMLElement>
  currentElement: HTMLElement | undefined
  value: string
  setTriggerId: (id: string) => void
  setCurrentElement: (el: HTMLElement | undefined) => void
}

const AccordionItemContextValue = createContext<AccordionItemContext | null>(null)

export function useAccordionItemContext() {
  const context = useContext(AccordionItemContextValue)
  if (!context) {
    throw new Error('AccordionItem must be used within AccordionItem')
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
  } = {},
): HTMLElement | null {
  const {
    arrowKeyOptions = 'both',
    dir = 'ltr',
    focus = false,
  } = options

  const [right, left, up, down, home, end] = [
    e.key === 'ArrowRight',
    e.key === 'ArrowLeft',
    e.key === 'ArrowUp',
    e.key === 'ArrowDown',
    e.key === 'Home',
    e.key === 'End',
  ]
  const goingVertical = up || down
  const goingHorizontal = right || left
  if (
    !home
    && !end
    && ((!goingVertical && !goingHorizontal)
      || (arrowKeyOptions === 'vertical' && goingHorizontal)
      || (arrowKeyOptions === 'horizontal' && goingVertical))
  ) {
    return null
  }

  const allCollectionItems: HTMLElement[] = parentElement
    ? Array.from(parentElement.querySelectorAll('[data-reka-collection-item]'))
    : []

  if (!allCollectionItems.length)
    return null

  e.preventDefault()

  let item: HTMLElement | null = null

  if (goingHorizontal || goingVertical) {
    const goForward = goingVertical ? down : dir === 'ltr' ? right : left
    const index = allCollectionItems.indexOf(currentElement)
    const newIndex = goForward ? index + 1 : index - 1
    const adjustedNewIndex = (newIndex + allCollectionItems.length) % allCollectionItems.length
    item = allCollectionItems[adjustedNewIndex] || null
  }
  else if (home) {
    item = allCollectionItems[0] || null
  }
  else if (end) {
    item = allCollectionItems[allCollectionItems.length - 1] || null
  }

  if (focus && item) {
    item.focus()
  }

  return item
}

export function AccordionItem({
  disabled: itemDisabled = false,
  value,
  children,
  ...props
}: AccordionItemProps) {
  const rootContext = useAccordionRootContext()
  const [triggerId, setTriggerId] = useState('')
  const currentRef = useRef<HTMLElement>(null)
  const [currentElement, setCurrentElement] = useState<HTMLElement | undefined>(undefined)

  useEffect(() => {
    if (currentRef.current) {
      setCurrentElement(currentRef.current)
    }
  }, [])

  const open = useMemo(() => rootContext.isSingle
    ? value === rootContext.modelValue
    : Array.isArray(rootContext.modelValue) && rootContext.modelValue.includes(value), [rootContext.isSingle, value, rootContext.modelValue])

  const disabled = useMemo(() => rootContext.disabled || itemDisabled, [rootContext.disabled, itemDisabled])
  const dataDisabled = useMemo(() => (disabled ? '' : undefined), [disabled])
  const dataState = useMemo(() => (open ? AccordionItemState.Open : AccordionItemState.Closed), [open])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    if (!target || !rootContext.parentElement.current)
      return
    useArrowNavigation(e.nativeEvent as any, target, rootContext.parentElement.current, {
      arrowKeyOptions: rootContext.orientation,
      dir: rootContext.direction,
      focus: true,
    })
  }, [rootContext])

  const contextValue = useMemo<AccordionItemContext>(() => ({
    open,
    dataState,
    disabled,
    dataDisabled,
    triggerId,
    currentRef,
    currentElement,
    value,
    setTriggerId,
    setCurrentElement,
  }), [open, dataState, disabled, dataDisabled, triggerId, currentRef, currentElement, value])

  return (
    <AccordionItemContextValue.Provider value={contextValue}>
      <div
        data-orientation={rootContext.orientation}
        data-disabled={dataDisabled}
        data-state={dataState}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {typeof children === 'function'
          ? children({ open })
          : children}
      </div>
    </AccordionItemContextValue.Provider>
  )
}
