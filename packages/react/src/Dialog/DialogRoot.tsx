import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useId, useMemo, useRef, useState } from 'react'

export interface DialogRootProps extends Omit<ComponentPropsWithoutRef<'div'>, 'dir'> {
  open?: boolean
  defaultOpen?: boolean
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode | ((props: { open: boolean, close: () => void }) => ReactNode)
}

interface DialogRootContext {
  open: boolean
  modal: boolean
  openModal: () => void
  onOpenChange: (value: boolean) => void
  onOpenToggle: () => void
  triggerElement: React.MutableRefObject<HTMLElement | undefined>
  contentElement: React.MutableRefObject<HTMLElement | undefined>
  contentId: string
  titleId: string
  descriptionId: string
}

const DialogRootContextValue = createContext<DialogRootContext | null>(null)

export function useDialogRootContext() {
  const context = useContext(DialogRootContextValue)
  if (!context) {
    throw new Error('DialogRoot must be used within DialogRoot')
  }
  return context
}

export function DialogRoot({
  open: controlledOpen,
  defaultOpen = false,
  modal = true,
  onOpenChange,
  children,
  ...props
}: DialogRootProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const triggerElement = useRef<HTMLElement>(undefined)
  const contentElement = useRef<HTMLElement>(undefined)
  const baseId = useId()
  const [contentId] = useState(() => `reka-dialog-content-${baseId}`)
  const [titleId] = useState(() => `reka-dialog-title-${baseId}`)
  const [descriptionId] = useState(() => `reka-dialog-description-${baseId}`)

  const open = controlledOpen ?? internalOpen

  const handleOpenChange = useCallback((value: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(value)
    }
    onOpenChange?.(value)
  }, [controlledOpen, onOpenChange])

  const openModal = useCallback(() => {
    handleOpenChange(true)
  }, [handleOpenChange])

  const onOpenToggle = useCallback(() => {
    handleOpenChange(!open)
  }, [open, handleOpenChange])

  const contextValue = useMemo<DialogRootContext>(() => ({
    open,
    modal,
    openModal,
    onOpenChange: handleOpenChange,
    onOpenToggle,
    triggerElement,
    contentElement,
    contentId,
    titleId,
    descriptionId,
  }), [open, modal, openModal, handleOpenChange, onOpenToggle, contentId, titleId, descriptionId])

  return (
    <DialogRootContextValue.Provider value={contextValue}>
      <div {...props}>
        {typeof children === 'function'
          ? children({ open, close: () => handleOpenChange(false) })
          : children}
      </div>
    </DialogRootContextValue.Provider>
  )
}
