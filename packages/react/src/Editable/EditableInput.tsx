import type { ComponentPropsWithoutRef } from 'react'
import React, { useEffect } from 'react'
import { useEditableRootContext } from './EditableRoot'

export interface EditableInputProps extends ComponentPropsWithoutRef<'input'> {}

const ENTER_KEY = 'Enter'

export function EditableInput({
  ...props
}: EditableInputProps) {
  const context = useEditableRootContext()

  useEffect(() => {
    if (context.startWithEditMode && context.inputRef.current) {
      context.inputRef.current.focus({ preventScroll: true })
      if (context.selectOnFocus) {
        context.inputRef.current.select()
      }
    }
  }, [context.startWithEditMode, context.selectOnFocus])

  useEffect(() => {
    if (context.isEditing && context.inputRef.current) {
      context.inputRef.current.focus({ preventScroll: true })
      if (context.selectOnFocus) {
        context.inputRef.current.select()
      }
    }
  }, [context.isEditing, context.selectOnFocus])

  const handleSubmitKeyDown = (event: React.KeyboardEvent) => {
    if (
      (context.submitMode === 'enter' || context.submitMode === 'both')
      && event.key === ENTER_KEY
      && !event.shiftKey
      && !event.metaKey
    ) {
      event.preventDefault()
      context.submit()
    }
  }

  const style = context.autoResize
    ? {
        all: 'unset' as const,
        gridArea: '1 / 1 / auto / auto',
        visibility: !context.isEditing ? 'hidden' as const : undefined,
      }
    : context.isEditing
      ? undefined
      : {
          position: 'absolute' as const,
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap' as const,
          borderWidth: 0,
        }

  const handleFocus = () => {
    if (!context.isEditing) {
      context.edit()
    }
  }

  return (
    <input
      ref={context.inputRef}
      value={context.inputValue ?? ''}
      placeholder={context.placeholder.edit}
      disabled={context.disabled}
      maxLength={context.maxLength}
      data-disabled={context.disabled ? '' : undefined}
      data-readonly={context.readonly ? '' : undefined}
      readOnly={context.readonly}
      aria-label="editable input"
      tabIndex={0}
      style={style}
      onChange={(e) => {
        context.setInputValue(e.target.value)
      }}
      onFocus={handleFocus}
      onKeyDown={(e) => {
        if (e.key === ENTER_KEY || e.key === ' ') {
          handleSubmitKeyDown(e)
        }
        if (e.key === 'Escape') {
          context.cancel()
        }
      }}
      onClick={(e) => {
        if (!context.isEditing) {
          context.edit()
          e.currentTarget.focus()
        }
      }}
      {...props}
    />
  )
}
