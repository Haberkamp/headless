import type { ComponentPropsWithoutRef } from 'react'
import type { DialogContentImplProps } from './DialogContentImpl'
import React, { useRef } from 'react'
import { DialogContentImpl } from './DialogContentImpl'
import { useDialogRootContext } from './DialogRoot'

export interface DialogContentNonModalProps extends DialogContentImplProps {}

export function DialogContentNonModal({
  onCloseAutoFocus,
  onInteractOutside,
  ...props
}: DialogContentNonModalProps) {
  const rootContext = useDialogRootContext()
  const hasInteractedOutsideRef = useRef(false)
  const hasPointerDownOutsideRef = useRef(false)

  return (
    <DialogContentImpl
      trapFocus={false}
      disableOutsidePointerEvents={false}
      onCloseAutoFocus={(event) => {
        if (!event.defaultPrevented) {
          if (!hasInteractedOutsideRef.current) {
            rootContext.triggerElement.current?.focus()
          }
          event.preventDefault()
        }
        hasInteractedOutsideRef.current = false
        hasPointerDownOutsideRef.current = false
        onCloseAutoFocus?.(event)
      }}
      onInteractOutside={(event) => {
        if (!event.defaultPrevented) {
          hasInteractedOutsideRef.current = true
          if (event.type === 'pointerdown') {
            hasPointerDownOutsideRef.current = true
          }
        }

        const target = (event as any).target as HTMLElement
        const targetIsTrigger = rootContext.triggerElement.current?.contains(target)
        if (targetIsTrigger) {
          event.preventDefault()
        }

        if (event.type === 'focusin' && hasPointerDownOutsideRef.current) {
          event.preventDefault()
        }

        onInteractOutside?.(event)
      }}
      {...props}
    />
  )
}
