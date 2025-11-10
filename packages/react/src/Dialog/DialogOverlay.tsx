import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { useEffect } from 'react'
import { useDialogRootContext } from './DialogRoot'

export interface DialogOverlayProps extends ComponentPropsWithoutRef<'div'> {
  forceMount?: boolean
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  children?: ReactNode
}

export function DialogOverlay({
  forceMount,
  as: Component = 'div',
  children,
  ...props
}: DialogOverlayProps) {
  const rootContext = useDialogRootContext()

  useEffect(() => {
    if (rootContext.modal && rootContext.open) {
      const originalStyle = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [rootContext.modal, rootContext.open])

  if (!rootContext.modal)
    return null

  const present = forceMount || rootContext.open

  if (!present)
    return null

  return (
    <Component
      data-state={rootContext.open ? 'open' : 'closed'}
      style={{ pointerEvents: 'auto', ...props.style }}
      {...props}
    >
      {children}
    </Component>
  )
}
