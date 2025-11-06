import type { ComponentPropsWithoutRef } from 'react'
import React from 'react'
import { useEditableRootContext } from './EditableRoot'

export interface EditablePreviewProps extends ComponentPropsWithoutRef<'span'> {}

export function EditablePreview({
  children,
  ...props
}: EditablePreviewProps) {
  const context = useEditableRootContext()

  const handleFocus = () => {
    if (context.activationMode === 'focus') {
      context.edit()
    }
  }

  const handleDoubleClick = () => {
    if (context.activationMode === 'dblclick') {
      context.edit()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && e.shiftKey && !context.isEditing) {
      e.preventDefault()
      context.inputRef.current?.focus()
    }
  }

  const style = context.autoResize
    ? {
        whiteSpace: 'pre' as const,
        userSelect: 'none' as const,
        gridArea: '1 / 1 / auto / auto',
        visibility: context.isEditing ? 'hidden' as const : undefined,
        overflow: 'hidden' as const,
        textOverflow: 'ellipsis' as const,
      }
    : undefined

  return (
    <span
      tabIndex={0}
      data-placeholder-shown={context.isEditing ? undefined : ''}
      hidden={context.autoResize ? undefined : context.isEditing}
      style={style}
      onFocus={handleFocus}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children ?? (context.modelValue || context.placeholder.preview)}
    </span>
  )
}
