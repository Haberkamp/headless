import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { DialogCloseProps } from '../Dialog'
import React from 'react'
import { DialogClose } from '../Dialog'

export interface AlertDialogActionProps extends DialogCloseProps {}

export function AlertDialogAction({
  as = 'button',
  children,
  ...props
}: AlertDialogActionProps) {
  return (
    <DialogClose as={as} {...props}>
      {children}
    </DialogClose>
  )
}
