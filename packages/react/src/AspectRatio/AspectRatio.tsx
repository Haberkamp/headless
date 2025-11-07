import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useMemo } from 'react'

export interface AspectRatioProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /**
   * The desired ratio. Eg: 16/9
   * @defaultValue 1
   */
  ratio?: number
  /**
   * The element or component this component should render as.
   * @defaultValue "div"
   */
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  /**
   * Children can be a function that receives the aspect value
   */
  children?: ReactNode | ((props: {
    /** Current aspect ratio (in %) */
    aspect: number
  }) => ReactNode)
}

export function AspectRatio({
  ratio = 1,
  as: Component = 'div',
  children,
  style,
  ...props
}: AspectRatioProps) {
  const aspect = useMemo(() => {
    return (1 / ratio) * 100
  }, [ratio])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${aspect}%`,
        ...style,
      }}
      data-reka-aspect-ratio-wrapper
      {...props}
    >
      <Component
        style={{
          position: 'absolute',
          inset: '0px',
        }}
      >
        {typeof children === 'function'
          ? children({ aspect })
          : children}
      </Component>
    </div>
  )
}
