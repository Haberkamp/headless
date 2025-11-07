import type { ComponentPropsWithoutRef } from 'react'
import React, { useEffect, useId, useRef } from 'react'
import { useAccordionItemContext } from './AccordionItem'
import { useAccordionRootContext } from './AccordionRoot'

export interface AccordionTriggerProps extends ComponentPropsWithoutRef<'button'> {}

export function AccordionTrigger({
  as: Component = 'button',
  ...props
}: AccordionTriggerProps) {
  const rootContext = useAccordionRootContext()
  const itemContext = useAccordionItemContext()
  const id = useId()
  const triggerId = `reka-accordion-trigger-${id}`
  const triggerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!itemContext.triggerId) {
      itemContext.setTriggerId(triggerId)
    }
  }, [triggerId, itemContext])

  useEffect(() => {
    if (triggerRef.current) {
      itemContext.setCurrentElement(triggerRef.current)
    }
  }, [itemContext])

  const changeItem = () => {
    const triggerDisabled = rootContext.isSingle && itemContext.open && !rootContext.collapsible
    if (itemContext.disabled || triggerDisabled)
      return

    rootContext.changeModelValue(itemContext.value)
  }

  return (
    <Component
      id={itemContext.triggerId || triggerId}
      ref={triggerRef as any}
      data-reka-collection-item
      type={Component === 'button' ? 'button' : undefined}
      aria-disabled={itemContext.disabled || undefined}
      aria-expanded={itemContext.open || false}
      data-disabled={itemContext.dataDisabled}
      data-orientation={rootContext.orientation}
      data-state={itemContext.dataState}
      disabled={itemContext.disabled}
      onClick={changeItem}
      {...props}
    />
  )
}
