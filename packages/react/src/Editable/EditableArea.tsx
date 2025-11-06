import type { ComponentPropsWithoutRef } from 'react'
import React from 'react'
import { useEditableRootContext } from './EditableRoot'

export interface EditableAreaProps extends ComponentPropsWithoutRef<'div'> {}

export function EditableArea({
  children,
  ...props
}: EditableAreaProps) {
  const context = useEditableRootContext()

  const style = context.autoResize ? { display: 'inline-grid' as const } : undefined

  return (
    <div
      data-placeholder-shown={context.isEditing ? undefined : ''}
      data-focus={context.isEditing ? '' : undefined}
      data-focused={context.isEditing ? '' : undefined}
      data-empty={context.isEmpty ? '' : undefined}
      data-readonly={context.readonly ? '' : undefined}
      data-disabled={context.disabled ? '' : undefined}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}
