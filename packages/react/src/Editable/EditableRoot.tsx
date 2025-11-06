import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

type ActivationMode = 'focus' | 'dblclick' | 'none'
type SubmitMode = 'blur' | 'enter' | 'none' | 'both'

type EditableRootContextValue = {
  id: string | undefined
  name: string | undefined
  maxLength: number | undefined
  disabled: boolean
  modelValue: string | null | undefined
  inputValue: string | null | undefined
  setInputValue: (value: string | null | undefined) => void
  placeholder: { edit: string, preview: string }
  isEditing: boolean
  submitMode: SubmitMode
  activationMode: ActivationMode
  selectOnFocus: boolean
  edit: () => void
  cancel: () => void
  submit: () => void
  inputRef: React.RefObject<HTMLInputElement>
  startWithEditMode: boolean
  isEmpty: boolean
  readonly: boolean
  autoResize: boolean
}

const EditableRootContext = createContext<EditableRootContextValue | null>(null)

export function useEditableRootContext() {
  const context = useContext(EditableRootContext)
  if (!context) {
    throw new Error('Editable components must be used within EditableRoot')
  }
  return context
}

export interface EditableRootProps extends Omit<ComponentPropsWithoutRef<'div'>, 'dir'> {
  /** The default value of the editable field */
  defaultValue?: string
  /** The value of the editable field */
  value?: string | null
  /** The placeholder for the editable field */
  placeholder?: string | { edit: string, preview: string }
  /** The reading direction */
  dir?: 'ltr' | 'rtl'
  /** Whether the editable field is disabled */
  disabled?: boolean
  /** Whether the editable field is read-only */
  readonly?: boolean
  /** The activation event of the editable field */
  activationMode?: ActivationMode
  /** Whether to select the text in the input when it is focused. */
  selectOnFocus?: boolean
  /** The submit event of the editable field */
  submitMode?: SubmitMode
  /** Whether to start with the edit mode active */
  startWithEditMode?: boolean
  /** The maximum number of characters allowed */
  maxLength?: number
  /** Whether the editable field should auto resize */
  autoResize?: boolean
  /** The id of the field */
  id?: string
  /** The name of the field */
  name?: string
  /** Event handler called whenever the value changes */
  onValueChange?: (value: string) => void
  /** Event handler called when a value is submitted */
  onSubmit?: (value: string | null | undefined) => void
  /** Event handler called when the editable field changes state */
  onStateChange?: (state: 'edit' | 'submit' | 'cancel') => void
  children?: ReactNode | ((props: {
    isEditing: boolean
    modelValue: string | null | undefined
    isEmpty: boolean
    submit: () => void
    cancel: () => void
    edit: () => void
  }) => ReactNode)
}

export function EditableRoot({
  defaultValue = '',
  value: controlledValue,
  placeholder: propPlaceholder = 'Enter text...',
  dir = 'ltr',
  disabled = false,
  readonly = false,
  activationMode = 'focus',
  selectOnFocus = false,
  submitMode = 'blur',
  startWithEditMode = false,
  maxLength,
  autoResize = false,
  id,
  name,
  onValueChange,
  onSubmit,
  onStateChange,
  children,
  ...props
}: EditableRootProps) {
  const [isEditing, setIsEditing] = useState(startWithEditMode)
  const [internalValue, setInternalValue] = useState(controlledValue ?? defaultValue)
  const [inputValue, setInputValue] = useState(controlledValue ?? defaultValue)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const modelValue = controlledValue ?? internalValue

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInputValue(controlledValue)
    }
  }, [controlledValue])

  useEffect(() => {
    if (!isEditing) {
      setInputValue(modelValue)
    }
  }, [modelValue, isEditing])

  const placeholder = useMemo(() => {
    return typeof propPlaceholder === 'string'
      ? { edit: propPlaceholder, preview: propPlaceholder }
      : propPlaceholder
  }, [propPlaceholder])

  const isEmpty = useMemo(() => modelValue === '', [modelValue])

  const cancel = useCallback(() => {
    setIsEditing(false)
    onStateChange?.('cancel')
  }, [onStateChange])

  const edit = useCallback(() => {
    setIsEditing(true)
    setInputValue(modelValue)
    onStateChange?.('edit')
  }, [modelValue, onStateChange])

  const submit = useCallback(() => {
    const newValue = inputValue ?? ''
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    setIsEditing(false)
    onValueChange?.(newValue)
    onStateChange?.('submit')
    onSubmit?.(newValue)
  }, [inputValue, controlledValue, onValueChange, onSubmit, onStateChange])

  const handleDismiss = useCallback(() => {
    if (isEditing) {
      if (submitMode === 'blur' || submitMode === 'both') {
        submit()
      }
      else {
        cancel()
      }
    }
  }, [isEditing, submitMode, submit, cancel])

  useEffect(() => {
    if (!isEditing)
      return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (!rootRef.current || !target)
        return

      const isInside = rootRef.current.contains(target)
      if (!isInside) {
        handleDismiss()
      }
    }

    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null
      if (!rootRef.current || !target)
        return

      const isInside = rootRef.current.contains(target)
      if (!isInside) {
        handleDismiss()
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('pointerdown', handlePointerDown)
    }, 0)

    document.addEventListener('focusin', handleFocus)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('focusin', handleFocus)
    }
  }, [isEditing, handleDismiss])

  const handlePointerDownCapture = useCallback(() => {
    // Mark that pointer is inside
  }, [])

  const handleFocusCapture = useCallback(() => {
    // Mark that focus is inside
  }, [])

  const handleBlurCapture = useCallback(() => {
    // Mark that focus left
  }, [])

  const lastFocusedElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isEditing)
      return

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (!rootRef.current?.contains(target)) {
        lastFocusedElementRef.current = null
        return
      }

      const prevFocused = lastFocusedElementRef.current
      if (prevFocused && !rootRef.current.contains(prevFocused)) {
        // Focus entered from outside via shift+tab
        if (target !== inputRef.current && (target.getAttribute('aria-label') === 'cancel' || target.getAttribute('aria-label') === 'submit' || target.getAttribute('aria-label') === 'edit')) {
          setTimeout(() => {
            inputRef.current?.focus()
          }, 0)
        }
      }
      lastFocusedElementRef.current = target
    }

    document.addEventListener('focusin', handleFocusIn, true)
    return () => document.removeEventListener('focusin', handleFocusIn, true)
  }, [isEditing])

  const contextValue: EditableRootContextValue = {
    id,
    name,
    maxLength,
    disabled,
    modelValue,
    inputValue,
    setInputValue,
    placeholder,
    isEditing,
    submitMode,
    activationMode,
    selectOnFocus,
    edit,
    cancel,
    submit,
    inputRef,
    startWithEditMode,
    isEmpty,
    readonly,
    autoResize,
  }

  const [isFormControl, setIsFormControl] = useState(true)

  useEffect(() => {
    setIsFormControl(rootRef.current?.closest('form') !== null)
  }, [])

  return (
    <EditableRootContext.Provider value={contextValue}>
      <div
        ref={rootRef}
        data-dismissable-layer
        dir={dir}
        onFocusCapture={handleFocusCapture}
        onBlurCapture={handleBlurCapture}
        onPointerDownCapture={handlePointerDownCapture}
        {...props}
      >
        {typeof children === 'function'
          ? children({ isEditing, modelValue, isEmpty, submit, cancel, edit })
          : children}
        {isFormControl && name && (
          <input
            type="text"
            value={modelValue ?? ''}
            name={name}
            disabled={disabled}
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              borderWidth: 0,
            }}
            readOnly
            tabIndex={-1}
            aria-hidden="true"
          />
        )}
      </div>
    </EditableRootContext.Provider>
  )
}
