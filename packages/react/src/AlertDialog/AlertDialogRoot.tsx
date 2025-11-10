import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { DialogRootProps } from '../Dialog'
import React from 'react'
import { DialogRoot } from '../Dialog'

export interface AlertDialogRootProps extends Omit<DialogRootProps, 'modal'> {
  children?: ReactNode | ((props: { open: boolean, close: () => void }) => ReactNode)
}

export function AlertDialogRoot({
  children,
  ...props
}: AlertDialogRootProps) {
  return (
    <DialogRoot {...props} modal={true}>
      {children}
    </DialogRoot>
  )
}
