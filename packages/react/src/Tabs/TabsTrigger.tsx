import type { ComponentPropsWithoutRef } from 'react'
import type { StringOrNumber } from './utils'
import React, { useCallback, useEffect, useId, useMemo, useRef } from 'react'
import { useTabsRootContext } from './TabsRoot'
import { makeContentId, makeTriggerId } from './utils'

export interface TabsTriggerProps extends ComponentPropsWithoutRef<'button'> {
  value: StringOrNumber
  disabled?: boolean
}

export function TabsTrigger({
  value,
  disabled = false,
  as: Component = 'button',
  children,
  ...props
}: TabsTriggerProps) {
  const rootContext = useTabsRootContext()
  const id = useId()
  const triggerId = useMemo(() => makeTriggerId(rootContext.baseId, value), [rootContext.baseId, value])
  const contentId = useMemo(() => makeContentId(rootContext.baseId, value), [rootContext.baseId, value])
  const triggerRef = useRef<HTMLButtonElement>(null)

  const isSelected = useMemo(() => value === rootContext.modelValue, [value, rootContext.modelValue])

  useEffect(() => {
    if (isSelected && triggerRef.current) {
      triggerRef.current.setAttribute('data-active', '')
    }
    else if (triggerRef.current) {
      triggerRef.current.removeAttribute('data-active')
    }
  }, [isSelected])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || e.ctrlKey) {
      e.preventDefault()
      return
    }
    if (e.button === 0) {
      rootContext.changeModelValue(value)
    }
  }, [disabled, value, rootContext])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      rootContext.changeModelValue(value)
    }
  }, [value, rootContext])

  const handleFocus = useCallback(() => {
    const isAutomaticActivation = rootContext.activationMode !== 'manual'
    if (!isSelected && !disabled && isAutomaticActivation) {
      rootContext.changeModelValue(value)
    }
  }, [isSelected, disabled, rootContext, value])

  return (
    <Component
      id={triggerId}
      ref={triggerRef as any}
      role="tab"
      type={Component === 'button' ? 'button' : undefined}
      aria-selected={isSelected ? 'true' : 'false'}
      aria-controls={contentId}
      data-state={isSelected ? 'active' : 'inactive'}
      data-disabled={disabled ? '' : undefined}
      data-orientation={rootContext.orientation}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </Component>
  )
}
