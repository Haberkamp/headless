import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { useEffect, useRef } from 'react'
import { useDialogRootContext } from './DialogRoot'
import { getActiveElement, getOpenState } from './utils'

export interface DialogContentImplProps extends ComponentPropsWithoutRef<'div'> {
  forceMount?: boolean
  trapFocus?: boolean
  disableOutsidePointerEvents?: boolean
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerEvent) => void
  onFocusOutside?: (event: FocusEvent) => void
  onInteractOutside?: (event: PointerEvent | FocusEvent) => void
  onOpenAutoFocus?: (event: Event) => void
  onCloseAutoFocus?: (event: Event) => void
  children?: ReactNode
}

export function DialogContentImpl({
  forceMount,
  trapFocus = false,
  disableOutsidePointerEvents = false,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  onOpenAutoFocus,
  onCloseAutoFocus,
  children,
  ...props
}: DialogContentImplProps) {
  const rootContext = useDialogRootContext()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      rootContext.contentElement.current = contentRef.current
      if (getActiveElement() !== document.body) {
        rootContext.triggerElement.current = getActiveElement() || undefined
      }
    }
  }, [rootContext])

  useEffect(() => {
    if (!rootContext.open || !contentRef.current)
      return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscapeKeyDown?.(e)
        if (!e.defaultPrevented) {
          rootContext.onOpenChange(false)
        }
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (!contentRef.current?.contains(e.target as Node)) {
        onPointerDownOutside?.(e)
        onInteractOutside?.(e)
        if (!e.defaultPrevented) {
          rootContext.onOpenChange(false)
        }
      }
    }

    const handleFocusOut = (e: FocusEvent) => {
      if (!contentRef.current?.contains(e.relatedTarget as Node)) {
        onFocusOutside?.(e)
        onInteractOutside?.(e)
        if (!e.defaultPrevented && trapFocus) {
          e.preventDefault()
        }
        if (!e.defaultPrevented && !trapFocus) {
          rootContext.onOpenChange(false)
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('focusout', handleFocusOut, true)

    if (trapFocus && contentRef.current) {
      const getFocusableElements = () => {
        return Array.from(contentRef.current!.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )) as HTMLElement[]
      }

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !contentRef.current)
          return

        const focusableElements = getFocusableElements()
        if (focusableElements.length === 0)
          return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        }
        else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }

      document.addEventListener('keydown', handleTab)

      if (onOpenAutoFocus) {
        const event = new Event('mountAutoFocus')
        onOpenAutoFocus(event)
        if (!event.defaultPrevented) {
          const focusableElements = getFocusableElements()
          focusableElements[0]?.focus()
        }
      }

      return () => {
        document.removeEventListener('keydown', handleTab)
        document.removeEventListener('keydown', handleEscape)
        document.removeEventListener('pointerdown', handlePointerDown, true)
        document.removeEventListener('focusout', handleFocusOut, true)

        if (onCloseAutoFocus) {
          const event = new Event('unmountAutoFocus')
          onCloseAutoFocus(event)
          if (!event.defaultPrevented) {
            rootContext.triggerElement.current?.focus()
          }
        }
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('focusout', handleFocusOut, true)
    }
  }, [rootContext.open, trapFocus, rootContext, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onOpenAutoFocus, onCloseAutoFocus])

  if (!forceMount && !rootContext.open)
    return null

  return (
    <div
      ref={contentRef}
      id={rootContext.contentId}
      role="dialog"
      aria-describedby={rootContext.descriptionId}
      aria-labelledby={rootContext.titleId}
      data-state={getOpenState(rootContext.open)}
      data-dismissable-layer
      style={{
        pointerEvents: disableOutsidePointerEvents ? 'auto' : undefined,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
