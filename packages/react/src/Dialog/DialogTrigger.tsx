import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { useEffect, useRef } from 'react'
import { useDialogRootContext } from './DialogRoot'

export interface DialogTriggerProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type'> {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  children?: ReactNode
}

export function DialogTrigger({
  as: Component = 'button',
  children,
  ...props
}: DialogTriggerProps) {
  const rootContext = useDialogRootContext()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) {
      rootContext.triggerElement.current = ref.current
    }
  }, [rootContext])

  return (
    <Component
      ref={ref as any}
      type={Component === 'button' ? 'button' : undefined}
      aria-haspopup="dialog"
      aria-expanded={rootContext.open || false}
      aria-controls={rootContext.open ? rootContext.contentId : undefined}
      data-state={rootContext.open ? 'open' : 'closed'}
      onClick={rootContext.onOpenToggle}
      {...props}
    >
      {children}
    </Component>
  )
}
