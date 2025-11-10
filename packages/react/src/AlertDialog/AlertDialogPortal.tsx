import type { ReactNode } from 'react'
import type { DialogPortalProps } from '../Dialog'
import React from 'react'
import { DialogPortal } from '../Dialog'

export interface AlertDialogPortalProps extends DialogPortalProps {}

export function AlertDialogPortal({
  children,
  ...props
}: AlertDialogPortalProps) {
  return (
    <DialogPortal {...props}>
      {children}
    </DialogPortal>
  )
}
