import type { ComponentPropsWithoutRef } from 'react'
import React, { createContext, useCallback, useContext, useId, useMemo, useState } from 'react'

interface CollapsibleRootContext {
  contentId: string
  disabled?: boolean
  open: boolean
  unmountOnHide: boolean
  onOpenToggle: () => void
}

const CollapsibleRootContextValue = createContext<CollapsibleRootContext | null>(null)

export function useCollapsibleRootContext() {
  const context = useContext(CollapsibleRootContextValue)
  if (!context) {
    throw new Error('Collapsible components must be used within CollapsibleRoot')
  }
  return context
}

export interface CollapsibleRootProps extends Omit<ComponentPropsWithoutRef<'div'>, 'dir'> {
  /** The open state of the collapsible when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean
  /** The controlled open state of the collapsible. */
  open?: boolean
  /** When `true`, prevents the user from interacting with the collapsible. */
  disabled?: boolean
  /** When `true`, the element will be unmounted on closed state. */
  unmountOnHide?: boolean
  /** Event handler called when the open state of the collapsible changes. */
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode | ((props: { open: boolean }) => React.ReactNode)
}

export function CollapsibleRoot({
  defaultOpen = false,
  open: controlledOpen,
  disabled = false,
  unmountOnHide = true,
  onOpenChange,
  children,
  ...props
}: CollapsibleRootProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const baseId = useId()
  const contentId = `reka-collapsible-content-${baseId}`

  const open = controlledOpen ?? internalOpen

  const onOpenToggle = useCallback(() => {
    if (disabled)
      return

    const newOpen = !open
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }, [disabled, open, controlledOpen, onOpenChange])

  const contextValue = useMemo<CollapsibleRootContext>(() => ({
    contentId,
    disabled,
    open,
    unmountOnHide,
    onOpenToggle,
  }), [contentId, disabled, open, unmountOnHide, onOpenToggle])

  return (
    <CollapsibleRootContextValue.Provider value={contextValue}>
      <div
        data-state={open ? 'open' : 'closed'}
        data-disabled={disabled ? '' : undefined}
        {...props}
      >
        {typeof children === 'function'
          ? children({ open })
          : children}
      </div>
    </CollapsibleRootContextValue.Provider>
  )
}
