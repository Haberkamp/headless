import type { ComponentPropsWithoutRef } from 'react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useCollapsibleRootContext } from './CollapsibleRoot'

export interface CollapsibleContentProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
  onContentFound?: () => void
}

export function CollapsibleContent({
  as: Component = 'div',
  forceMount,
  onContentFound,
  children,
  ...props
}: CollapsibleContentProps) {
  const rootContext = useCollapsibleRootContext()
  const contentRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [isMountAnimationPrevented, setIsMountAnimationPrevented] = useState(rootContext.open)
  const [currentStyle, setCurrentStyle] = useState<{ transitionDuration?: string, animationName?: string }>()

  const present = forceMount || rootContext.open
  const shouldRender = rootContext.unmountOnHide ? present : true
  const hidden = !present && !rootContext.unmountOnHide ? 'until-found' : undefined

  useEffect(() => {
    const node = contentRef.current
    if (!node)
      return

    const updateDimensions = async () => {
      await new Promise(resolve => setTimeout(resolve, 0))

      if (!currentStyle) {
        setCurrentStyle({
          transitionDuration: node.style.transitionDuration,
          animationName: node.style.animationName,
        })
      }

      // block any animations/transitions so the element renders at its full dimensions
      node.style.transitionDuration = '0s'
      node.style.animationName = 'none'

      // get width and height from full dimensions
      const rect = node.getBoundingClientRect()
      setHeight(rect.height)
      setWidth(rect.width)

      // kick off any animations/transitions that were originally set up if it isn't the initial mount
      if (!isMountAnimationPrevented) {
        node.style.transitionDuration = currentStyle?.transitionDuration || ''
        node.style.animationName = currentStyle?.animationName || ''
      }
    }

    updateDimensions()
  }, [rootContext.open, present, currentStyle, isMountAnimationPrevented])

  useEffect(() => {
    if (rootContext.open) {
      requestAnimationFrame(() => {
        setIsMountAnimationPrevented(false)
      })
    }
    else {
      setIsMountAnimationPrevented(true)
    }
  }, [rootContext.open])

  useEffect(() => {
    const node = contentRef.current
    if (!node)
      return

    const handleBeforeMatch = () => {
      requestAnimationFrame(() => {
        rootContext.onOpenToggle()
        onContentFound?.()
      })
    }

    node.addEventListener('beforematch', handleBeforeMatch)
    return () => {
      node.removeEventListener('beforematch', handleBeforeMatch)
    }
  }, [rootContext, onContentFound])

  useEffect(() => {
    const node = contentRef.current
    if (!node)
      return

    if (hidden === 'until-found') {
      node.setAttribute('hidden', 'until-found')
    }
    else if (hidden === undefined) {
      node.removeAttribute('hidden')
    }
  }, [hidden])

  const skipAnimation = useMemo(() => isMountAnimationPrevented && rootContext.open, [isMountAnimationPrevented, rootContext.open])

  if (!shouldRender) {
    return null
  }

  return (
    <Component
      ref={contentRef}
      id={rootContext.contentId}
      data-state={skipAnimation ? undefined : rootContext.open ? 'open' : 'closed'}
      data-disabled={rootContext.disabled ? '' : undefined}
      style={{
        '--reka-collapsible-content-height': `${height}px`,
        '--reka-collapsible-content-width': `${width}px`,
        ...props.style,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </Component>
  )
}
