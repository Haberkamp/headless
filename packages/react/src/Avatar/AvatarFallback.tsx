import type { ComponentPropsWithoutRef } from 'react'
import { useEffect, useState } from 'react'
import { useAvatarRootContext } from './AvatarRoot'

export interface AvatarFallbackProps extends ComponentPropsWithoutRef<'span'> {
  /** Useful for delaying rendering so it only appears for those with slower connections. */
  delayMs?: number
}

export function AvatarFallback({
  delayMs,
  as: Component = 'span',
  ...props
}: AvatarFallbackProps) {
  const rootContext = useAvatarRootContext()
  const [canRender, setCanRender] = useState(delayMs === undefined)

  useEffect(() => {
    if (delayMs !== undefined && typeof window !== 'undefined') {
      const timerId = window.setTimeout(() => {
        setCanRender(true)
      }, delayMs)

      return () => {
        window.clearTimeout(timerId)
      }
    }
  }, [delayMs])

  if (!canRender || rootContext.imageLoadingStatus === 'loaded') {
    return null
  }

  return <Component {...props} />
}
