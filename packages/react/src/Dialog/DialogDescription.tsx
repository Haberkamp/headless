import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React from 'react'
import { useDialogRootContext } from './DialogRoot'

export interface DialogDescriptionProps extends Omit<ComponentPropsWithoutRef<'p'>, 'id'> {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  children?: ReactNode
}

export function DialogDescription({
  as: Component = 'p',
  children,
  ...props
}: DialogDescriptionProps) {
  const rootContext = useDialogRootContext()

  return (
    <Component
      id={rootContext.descriptionId}
      {...props}
    >
      {children}
    </Component>
  )
}
