import type { ComponentPropsWithoutRef } from 'react'
import React from 'react'
import { useEditableRootContext } from './EditableRoot'

export interface EditableCancelTriggerProps extends ComponentPropsWithoutRef<'button'> {}

export function EditableCancelTrigger({
  children = 'Cancel',
  ...props
}: EditableCancelTriggerProps) {
  const context = useEditableRootContext()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && e.shiftKey && !context.isEditing) {
      e.preventDefault()
      context.inputRef.current?.focus()
    }
  }

  const handleFocus = (e: React.FocusEvent) => {
    if (!context.isEditing) {
      // Check if focus came from outside via shift+tab
      const relatedTarget = e.relatedTarget as HTMLElement | null
      if (relatedTarget && !e.currentTarget.closest('[data-dismissable-layer]')?.contains(relatedTarget)) {
        setTimeout(() => {
          context.inputRef.current?.focus()
        }, 0)
      }
    }
  }

  return (
    <button
      aria-label="cancel"
      aria-disabled={context.disabled ? '' : undefined}
      data-disabled={context.disabled ? '' : undefined}
      disabled={context.disabled}
      type="button"
      hidden={context.isEditing ? undefined : ''}
      onClick={context.cancel}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </button>
  )
}
