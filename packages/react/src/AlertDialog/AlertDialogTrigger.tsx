import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { DialogTriggerProps } from '../Dialog'
import React from 'react'
import { DialogTrigger } from '../Dialog'

export interface AlertDialogTriggerProps extends DialogTriggerProps {}

export function AlertDialogTrigger({
  as = 'button',
  children,
  ...props
}: AlertDialogTriggerProps) {
  return (
    <DialogTrigger as={as} {...props}>
      {children}
    </DialogTrigger>
  )
}
