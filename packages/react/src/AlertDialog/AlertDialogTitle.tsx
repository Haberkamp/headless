import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { DialogTitleProps } from '../Dialog'
import React from 'react'
import { DialogTitle } from '../Dialog'

export interface AlertDialogTitleProps extends DialogTitleProps {}

export function AlertDialogTitle({
  as = 'h2',
  children,
  ...props
}: AlertDialogTitleProps) {
  return (
    <DialogTitle as={as} {...props}>
      {children}
    </DialogTitle>
  )
}
