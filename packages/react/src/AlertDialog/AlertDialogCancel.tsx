import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { DialogCloseProps } from '../Dialog'
import React, { useEffect, useRef } from 'react'
import { DialogClose } from '../Dialog'
import { useAlertDialogContentContext } from './AlertDialogContent'

export interface AlertDialogCancelProps extends DialogCloseProps {}

export function AlertDialogCancel({
  as = 'button',
  children,
  ...props
}: AlertDialogCancelProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentContext = useAlertDialogContentContext()

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (wrapper) {
      const element = wrapper.firstElementChild as HTMLElement
      if (element) {
        contentContext.onCancelElementChange(element)
      }
    }
    return () => {
      contentContext.onCancelElementChange(undefined)
    }
  }, [contentContext])

  return (
    <div ref={wrapperRef} style={{ display: 'contents' }}>
      <DialogClose as={as} {...props}>
        {children}
      </DialogClose>
    </div>
  )
}
