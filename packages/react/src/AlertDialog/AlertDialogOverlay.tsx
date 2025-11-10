import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { DialogOverlayProps } from '../Dialog'
import React from 'react'
import { DialogOverlay } from '../Dialog'

export interface AlertDialogOverlayProps extends DialogOverlayProps {}

export function AlertDialogOverlay({
  children,
  ...props
}: AlertDialogOverlayProps) {
  return (
    <DialogOverlay {...props}>
      {children}
    </DialogOverlay>
  )
}
