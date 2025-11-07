import type { ComponentPropsWithoutRef } from 'react'
import React, { useCallback, useEffect, useRef } from 'react'
import { useTabsRootContext } from './TabsRoot'

export interface TabsListProps extends ComponentPropsWithoutRef<'div'> {
  loop?: boolean
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
    ? Array.from(parentElement.querySelectorAll('[role="tab"]:not([data-disabled])'))
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

export function TabsList({
  loop = true,
  children,
  ...props
}: TabsListProps) {
  const rootContext = useTabsRootContext()
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      rootContext.tabsList.current = listRef.current
    }
  }, [rootContext])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    if (!target || !listRef.current)
      return
    useArrowNavigation(e.nativeEvent as any, target, listRef.current, {
      arrowKeyOptions: rootContext.orientation,
      dir: rootContext.dir,
      focus: true,
      loop,
    })
  }, [rootContext, loop])

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={rootContext.orientation}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  )
}
