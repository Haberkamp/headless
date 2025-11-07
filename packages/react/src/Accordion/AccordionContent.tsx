import type { ComponentPropsWithoutRef } from 'react'
import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useAccordionItemContext } from './AccordionItem'
import { useAccordionRootContext } from './AccordionRoot'

export interface AccordionContentProps extends ComponentPropsWithoutRef<'div'> {
  forceMount?: boolean
  onContentFound?: () => void
}

export function AccordionContent({
  as: Component = 'div',
  forceMount,
  onContentFound,
  children,
  ...props
}: AccordionContentProps) {
  const rootContext = useAccordionRootContext()
  const itemContext = useAccordionItemContext()
  const id = useId()
  const contentId = `reka-collapsible-content-${id}`
  const contentRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [isMountAnimationPrevented, setIsMountAnimationPrevented] = useState(itemContext.open)

  const present = forceMount || itemContext.open
  const shouldRender = rootContext.unmountOnHide ? present : true
  const hidden = !present && !rootContext.unmountOnHide ? 'until-found' : undefined

  useEffect(() => {
    if (itemContext.open && contentRef.current) {
      const node = contentRef.current
      const rect = node.getBoundingClientRect()
      setHeight(rect.height)
      setWidth(rect.width)
    }
  }, [itemContext.open])

  useEffect(() => {
    if (isMountAnimationPrevented) {
      requestAnimationFrame(() => {
        setIsMountAnimationPrevented(false)
      })
    }
  }, [isMountAnimationPrevented])

  useEffect(() => {
    const node = contentRef.current
    if (!node)
      return

    const handleBeforeMatch = () => {
      requestAnimationFrame(() => {
        rootContext.changeModelValue(itemContext.value)
        onContentFound?.()
      })
    }

    node.addEventListener('beforematch', handleBeforeMatch)
    return () => {
      node.removeEventListener('beforematch', handleBeforeMatch)
    }
  }, [rootContext, itemContext.value, onContentFound])

  const skipAnimation = useMemo(() => isMountAnimationPrevented && itemContext.open, [isMountAnimationPrevented, itemContext.open])

  return (
    <Component
      ref={contentRef}
      role="region"
      id={contentId}
      aria-labelledby={itemContext.triggerId}
      data-state={skipAnimation ? undefined : itemContext.dataState}
      data-disabled={itemContext.dataDisabled}
      data-orientation={rootContext.orientation}
      hidden={hidden}
      style={{
        '--reka-accordion-content-width': `${width}px`,
        '--reka-accordion-content-height': `${height}px`,
        ...props.style,
      } as React.CSSProperties}
      {...props}
    >
      {shouldRender ? children : null}
    </Component>
  )
}
