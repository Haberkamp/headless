import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { DialogDescriptionProps } from '../Dialog'
import React from 'react'
import { DialogDescription } from '../Dialog'

export interface AlertDialogDescriptionProps extends DialogDescriptionProps {}

export function AlertDialogDescription({
  as = 'p',
  children,
  ...props
}: AlertDialogDescriptionProps) {
  return (
    <DialogDescription as={as} {...props}>
      {children}
    </DialogDescription>
  )
}
