import type { ComponentPropsWithoutRef } from 'react'
import { useEffect } from 'react'
import { useAvatarRootContext } from './AvatarRoot'
import { useImageLoadingStatus } from './utils'

export interface AvatarImageProps extends ComponentPropsWithoutRef<'img'> {
  src: string
  referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>['referrerPolicy']
  crossOrigin?: React.ImgHTMLAttributes<HTMLImageElement>['crossOrigin']
  onLoadingStatusChange?: (status: 'idle' | 'loading' | 'loaded' | 'error') => void
}

export function AvatarImage({
  src,
  referrerPolicy,
  crossOrigin,
  onLoadingStatusChange,
  as: Component = 'img',
  style,
  ...props
}: AvatarImageProps) {
  const rootContext = useAvatarRootContext()
  const imageLoadingStatus = useImageLoadingStatus(src, { referrerPolicy, crossOrigin })

  useEffect(() => {
    onLoadingStatusChange?.(imageLoadingStatus)
    if (imageLoadingStatus !== 'idle') {
      rootContext.setImageLoadingStatus(imageLoadingStatus)
    }
  }, [imageLoadingStatus, onLoadingStatusChange, rootContext])

  return (
    <Component
      role="img"
      src={src}
      referrerPolicy={referrerPolicy}
      crossOrigin={crossOrigin}
      style={{
        display: imageLoadingStatus === 'loaded' ? undefined : 'none',
        ...style,
      }}
      {...props}
    />
  )
}
