import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'

interface ProgressiveImageProps {
  src: string
  alt: string
  className?: string
  lowQualitySrc?: string
  onLoad?: () => void
  placeholder?: React.ReactNode
}

export default function ProgressiveImage({
  src,
  alt,
  className = '',
  lowQualitySrc,
  onLoad,
  placeholder,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (imageRef.current) {
      // Preload the high-quality image
      const img = new Image()
      img.onload = () => {
        setIsLoaded(true)
        setIsLoading(false)

        // Quick reveal animation
        if (imageRef.current) {
          gsap.fromTo(
            imageRef.current,
            { opacity: 0, filter: 'blur(5px)' },
            {
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.3,
              ease: 'power2.out',
              onComplete: () => {
                if (onLoad) onLoad()
              },
            }
          )
        }
      }

      img.onerror = () => {
        setHasError(true)
        setIsLoading(false)
      }

      img.src = src
    }
  }, [src, onLoad])

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}
      >
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📷</div>
          <div className="text-sm">Image unavailable</div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Low quality placeholder or skeleton */}
      {isLoading && (
        <div className="absolute inset-0">
          {lowQualitySrc ? (
            <img
              src={lowQualitySrc}
              alt={alt}
              className="w-full h-full object-cover filter blur-md scale-110"
            />
          ) : placeholder ? (
            placeholder
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 skeleton" />
          )}
        </div>
      )}

      {/* High quality image */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ opacity: 0 }} // Start invisible for GSAP animation
      />

      {/* Loading indicator - disabled for faster loading */}
      {false && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
