import type { ComponentPropsWithoutRef } from 'react'
import type { DialogContentImplProps } from './DialogContentImpl'
import React from 'react'
import { DialogContentImpl } from './DialogContentImpl'
import { useDialogRootContext } from './DialogRoot'

export interface DialogContentModalProps extends DialogContentImplProps {}

export function DialogContentModal({
  onCloseAutoFocus,
  onPointerDownOutside,
  onFocusOutside,
  ...props
}: DialogContentModalProps) {
  const rootContext = useDialogRootContext()

  return (
    <DialogContentImpl
      trapFocus={rootContext.open}
      disableOutsidePointerEvents={true}
      onCloseAutoFocus={(event) => {
        if (!event.defaultPrevented) {
          event.preventDefault()
          rootContext.triggerElement.current?.focus()
        }
        onCloseAutoFocus?.(event)
      }}
      onPointerDownOutside={(event) => {
        const originalEvent = event
        const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true
        const isRightClick = originalEvent.button === 2 || ctrlLeftClick

        if (isRightClick) {
          event.preventDefault()
        }
        onPointerDownOutside?.(event)
      }}
      onFocusOutside={(event) => {
        event.preventDefault()
        onFocusOutside?.(event)
      }}
      {...props}
    />
  )
}
