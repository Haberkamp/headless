import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type DataOrientation = 'vertical' | 'horizontal'

export interface SeparatorProps extends Omit<ComponentPropsWithoutRef<'div'>, 'dir'> {
  /**
   * Orientation of the component.
   *
   * Either `vertical` or `horizontal`. Defaults to `horizontal`.
   */
  orientation?: DataOrientation
  /**
   * Whether or not the component is purely decorative. <br>When `true`, accessibility-related attributes
   * are updated so that that the rendered element is removed from the accessibility tree.
   */
  decorative?: boolean
  children?: ReactNode
}

const ORIENTATIONS = ['horizontal', 'vertical'] as const
function isValidOrientation(orientation: any): orientation is DataOrientation {
  return ORIENTATIONS.includes(orientation)
}

export function Separator({
  orientation: propOrientation = 'horizontal',
  decorative = false,
  children,
  ...props
}: SeparatorProps) {
  const orientation = isValidOrientation(propOrientation) ? propOrientation : 'horizontal'
  const ariaOrientation = orientation === 'vertical' ? orientation : undefined

  const semanticProps = decorative
    ? { role: 'none' as const }
    : { 'aria-orientation': ariaOrientation, 'role': 'separator' as const }

  return (
    <div
      data-orientation={orientation}
      {...semanticProps}
      {...props}
    >
      {children}
    </div>
  )
}
