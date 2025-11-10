import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { DialogContentModalProps } from './DialogContentModal'
import type { DialogContentNonModalProps } from './DialogContentNonModal'
import React from 'react'
import { DialogContentModal } from './DialogContentModal'
import { DialogContentNonModal } from './DialogContentNonModal'
import { useDialogRootContext } from './DialogRoot'

export interface DialogContentProps extends Omit<DialogContentModalProps, 'trapFocus'> {
  forceMount?: boolean
  children?: ReactNode
}

export function DialogContent({
  forceMount,
  children,
  ...props
}: DialogContentProps) {
  const rootContext = useDialogRootContext()
  const present = forceMount || rootContext.open

  if (!present)
    return null

  if (rootContext.modal) {
    return (
      <DialogContentModal {...props}>
        {children}
      </DialogContentModal>
    )
  }

  return (
    <DialogContentNonModal {...props}>
      {children}
    </DialogContentNonModal>
  )
}
