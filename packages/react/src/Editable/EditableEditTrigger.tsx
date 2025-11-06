import type { ComponentPropsWithoutRef } from 'react'
import React from 'react'
import { useEditableRootContext } from './EditableRoot'

export interface EditableEditTriggerProps extends ComponentPropsWithoutRef<'button'> {}

export function EditableEditTrigger({
  children = 'Edit',
  ...props
}: EditableEditTriggerProps) {
  const context = useEditableRootContext()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && e.shiftKey && !context.isEditing) {
      e.preventDefault()
      context.inputRef.current?.focus()
    }
  }

  return (
    <button
      aria-label="edit"
      aria-disabled={context.disabled ? '' : undefined}
      data-disabled={context.disabled ? '' : undefined}
      disabled={context.disabled}
      type="button"
      hidden={context.isEditing ? '' : undefined}
      onClick={context.edit}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  )
}
