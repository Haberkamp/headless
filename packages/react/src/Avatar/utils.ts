import { useEffect, useRef, useState } from 'react'

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

function resolveLoadingStatus(image: HTMLImageElement | null, src?: string): ImageLoadingStatus {
  if (!image) {
    return 'idle'
  }
  if (!src) {
    return 'error'
  }
  if (image.src !== src) {
    image.src = src
  }
  return image.complete && image.naturalWidth > 0 ? 'loaded' : 'loading'
}

export function useImageLoadingStatus(
  src: string,
  { referrerPolicy, crossOrigin }: { referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>['referrerPolicy'], crossOrigin?: React.ImgHTMLAttributes<HTMLImageElement>['crossOrigin'] } = {},
) {
  const [isMounted, setIsMounted] = useState(false)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [loadingStatus, setLoadingStatus] = useState<ImageLoadingStatus>('idle')

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== 'undefined' && !imageRef.current) {
      imageRef.current = new window.Image()
    }
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') {
      return
    }

    const img = imageRef.current
    if (!img) {
      return
    }

    const currentStatus = resolveLoadingStatus(img, src)
    setLoadingStatus(currentStatus)

    const handleLoad = () => {
      setLoadingStatus('loaded')
    }

    const handleError = () => {
      setLoadingStatus('error')
    }

    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)

    if (referrerPolicy) {
      img.referrerPolicy = referrerPolicy
    }
    if (typeof crossOrigin === 'string') {
      img.crossOrigin = crossOrigin
    }

    if (img.src !== src) {
      img.src = src
    }

    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [src, referrerPolicy, crossOrigin, isMounted])

  return loadingStatus
}
