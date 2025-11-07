import type { ComponentPropsWithoutRef } from 'react'
import type { StringOrNumber } from './utils'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTabsRootContext } from './TabsRoot'
import { makeContentId, makeTriggerId } from './utils'

export interface TabsContentProps extends ComponentPropsWithoutRef<'div'> {
  value: StringOrNumber
  forceMount?: boolean
}

export function TabsContent({
  value,
  forceMount,
  as: Component = 'div',
  children,
  ...props
}: TabsContentProps) {
  const rootContext = useTabsRootContext()
  const triggerId = useMemo(() => makeTriggerId(rootContext.baseId, value), [rootContext.baseId, value])
  const contentId = useMemo(() => makeContentId(rootContext.baseId, value), [rootContext.baseId, value])
  const contentRef = useRef<HTMLDivElement>(null)
  const [isMountAnimationPrevented, setIsMountAnimationPrevented] = useState(true)

  const isSelected = useMemo(() => value === rootContext.modelValue, [value, rootContext.modelValue])
  const present = forceMount || isSelected
  const shouldRender = rootContext.unmountOnHide ? present : true
  const hidden = !present && !rootContext.unmountOnHide ? 'until-found' : undefined

  useEffect(() => {
    if (isSelected) {
      requestAnimationFrame(() => {
        setIsMountAnimationPrevented(false)
      })
    }
    else {
      setIsMountAnimationPrevented(true)
    }
  }, [isSelected])

  if (!shouldRender) {
    return null
  }

  return (
    <Component
      ref={contentRef}
      id={contentId}
      role="tabpanel"
      data-state={isSelected ? 'active' : 'inactive'}
      data-orientation={rootContext.orientation}
      aria-labelledby={triggerId}
      hidden={hidden}
      tabIndex={0}
      style={{
        animationDuration: isMountAnimationPrevented ? '0s' : undefined,
        ...props.style,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </Component>
  )
}
