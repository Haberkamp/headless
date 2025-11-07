import type { ComponentPropsWithoutRef } from 'react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTabsRootContext } from './TabsRoot'

export interface TabsIndicatorProps extends ComponentPropsWithoutRef<'div'> {}

interface IndicatorStyle {
  size: number | null
  position: number | null
}

export function TabsIndicator({
  as: Component = 'div',
  children,
  ...props
}: TabsIndicatorProps) {
  const context = useTabsRootContext()
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    size: null,
    position: null,
  })

  const updateIndicatorStyle = useMemo(() => () => {
    const activeTab = context.tabsList.current?.querySelector<HTMLButtonElement>('[role="tab"][data-state="active"]')

    if (!activeTab) {
      setIndicatorStyle({ size: null, position: null })
      return
    }

    if (context.orientation === 'horizontal') {
      setIndicatorStyle({
        size: activeTab.offsetWidth,
        position: activeTab.offsetLeft,
      })
    }
    else {
      setIndicatorStyle({
        size: activeTab.offsetHeight,
        position: activeTab.offsetTop,
      })
    }
  }, [context])

  useEffect(() => {
    updateIndicatorStyle()
  }, [context.modelValue, context.dir, updateIndicatorStyle])

  useEffect(() => {
    if (!context.tabsList.current)
      return

    const resizeObserver = new ResizeObserver(() => {
      updateIndicatorStyle()
    })

    resizeObserver.observe(context.tabsList.current)

    const activeTab = context.tabsList.current.querySelector<HTMLButtonElement>('[role="tab"][data-state="active"]')
    if (activeTab) {
      resizeObserver.observe(activeTab)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [updateIndicatorStyle, context.tabsList])

  if (typeof indicatorStyle.size !== 'number')
    return null

  return (
    <Component
      style={{
        '--reka-tabs-indicator-size': `${indicatorStyle.size}px`,
        '--reka-tabs-indicator-position': `${indicatorStyle.position}px`,
        ...props.style,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </Component>
  )
}
