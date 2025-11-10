import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React from 'react'
import { useDialogRootContext } from './DialogRoot'

export interface DialogCloseProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type'> {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  children?: ReactNode
}

export function DialogClose({
  as: Component = 'button',
  children,
  ...props
}: DialogCloseProps) {
  const rootContext = useDialogRootContext()

  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      onClick={() => rootContext.onOpenChange(false)}
      {...props}
    >
      {children}
    </Component>
  )
}
