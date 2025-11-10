import type { ReactNode } from 'react'
import React from 'react'
import { createPortal } from 'react-dom'

export interface DialogPortalProps {
  container?: HTMLElement
  children?: ReactNode
}

export function DialogPortal({
  container,
  children,
}: DialogPortalProps) {
  const target = container || (typeof document !== 'undefined' ? document.body : null)

  if (!target)
    return null

  return createPortal(children, target)
}
