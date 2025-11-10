import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { DialogContentProps } from '../Dialog'
import React, { createContext, useContext, useEffect, useRef } from 'react'
import { DialogContent } from '../Dialog'
import { useDialogRootContext } from '../Dialog/DialogRoot'

interface AlertDialogContentContext {
  onCancelElementChange: (el: HTMLElement | undefined) => void
}

const AlertDialogContentContextValue = createContext<AlertDialogContentContext | null>(null)

export function useAlertDialogContentContext() {
  const context = useContext(AlertDialogContentContextValue)
  if (!context) {
    throw new Error('AlertDialogCancel must be used within AlertDialogContent')
  }
  return context
}

export interface AlertDialogContentProps extends DialogContentProps {}

export function AlertDialogContent({
  children,
  onPointerDownOutside,
  onInteractOutside,
  onOpenAutoFocus,
  ...props
}: AlertDialogContentProps) {
  const rootContext = useDialogRootContext()
  const cancelElementRef = useRef<HTMLElement | undefined>()

  const contextValue: AlertDialogContentContext = {
    onCancelElementChange: (el) => {
      cancelElementRef.current = el
    },
  }

  useEffect(() => {
    if (rootContext.open && cancelElementRef.current) {
      setTimeout(() => {
        cancelElementRef.current?.focus({ preventScroll: true })
      }, 0)
    }
  }, [rootContext.open])

  const handleOpenAutoFocus = (event: Event) => {
    onOpenAutoFocus?.(event)
    if (!event.defaultPrevented) {
      event.preventDefault()
      setTimeout(() => {
        cancelElementRef.current?.focus({ preventScroll: true })
      }, 0)
    }
  }

  const handlePointerDownOutside = (event: PointerEvent) => {
    event.preventDefault()
    onPointerDownOutside?.(event)
  }

  const handleInteractOutside = (event: PointerEvent | FocusEvent) => {
    event.preventDefault()
    onInteractOutside?.(event)
  }

  return (
    <AlertDialogContentContextValue.Provider value={contextValue}>
      <DialogContent
        role="alertdialog"
        onPointerDownOutside={handlePointerDownOutside}
        onInteractOutside={handleInteractOutside}
        onOpenAutoFocus={handleOpenAutoFocus}
        {...props}
      >
        {children}
      </DialogContent>
    </AlertDialogContentContextValue.Provider>
  )
}
