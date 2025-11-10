import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React from 'react'
import { useDialogRootContext } from './DialogRoot'

export interface DialogTitleProps extends Omit<ComponentPropsWithoutRef<'h2'>, 'id'> {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  children?: ReactNode
}

export function DialogTitle({
  as: Component = 'h2',
  children,
  ...props
}: DialogTitleProps) {
  const rootContext = useDialogRootContext()

  return (
    <Component
      id={rootContext.titleId}
      {...props}
    >
      {children}
    </Component>
  )
}
