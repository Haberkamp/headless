import type { ComponentPropsWithoutRef } from 'react'
import React from 'react'
import { useAccordionItemContext } from './AccordionItem'
import { useAccordionRootContext } from './AccordionRoot'

export interface AccordionHeaderProps extends ComponentPropsWithoutRef<'h3'> {}

export function AccordionHeader({
  as: Component = 'h3',
  ...props
}: AccordionHeaderProps) {
  const rootContext = useAccordionRootContext()
  const itemContext = useAccordionItemContext()

  return (
    <Component
      data-orientation={rootContext.orientation}
      data-state={itemContext.dataState}
      data-disabled={itemContext.dataDisabled}
      {...props}
    />
  )
}
