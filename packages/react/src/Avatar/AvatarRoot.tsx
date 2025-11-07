import type { ComponentPropsWithoutRef } from 'react'
import type { ImageLoadingStatus } from './utils'
import { createContext, useContext, useState } from 'react'

interface AvatarRootContextValue {
  imageLoadingStatus: ImageLoadingStatus
  setImageLoadingStatus: (status: ImageLoadingStatus) => void
}

const AvatarRootContext = createContext<AvatarRootContextValue | null>(null)

export function useAvatarRootContext() {
  const context = useContext(AvatarRootContext)
  if (!context) {
    throw new Error('Avatar components must be used within AvatarRoot')
  }
  return context
}

export interface AvatarRootProps extends ComponentPropsWithoutRef<'span'> {}

export function AvatarRoot({
  as: Component = 'span',
  children,
  ...props
}: AvatarRootProps) {
  const [imageLoadingStatus, setImageLoadingStatus] = useState<ImageLoadingStatus>('idle')

  return (
    <AvatarRootContext.Provider value={{ imageLoadingStatus, setImageLoadingStatus }}>
      <Component {...props}>
        {children}
      </Component>
    </AvatarRootContext.Provider>
  )
}
