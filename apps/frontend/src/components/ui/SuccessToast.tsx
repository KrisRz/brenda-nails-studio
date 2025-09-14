import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

interface SuccessToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  type?: 'success' | 'error' | 'info'
}

export default function SuccessToast({
  message,
  isVisible,
  onClose,
  type = 'success',
}: SuccessToastProps) {
  const toastRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && toastRef.current) {
      // Entrance animation
      gsap.fromTo(
        toastRef.current,
        { x: 400, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      )

      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        if (toastRef.current) {
          gsap.to(toastRef.current, {
            x: 400,
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: onClose,
          })
        }
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600'
      case 'error':
        return 'bg-red-500 text-white border-red-600'
      case 'info':
        return 'bg-blue-500 text-white border-blue-600'
      default:
        return 'bg-green-500 text-white border-green-600'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'info':
        return 'ℹ️'
      default:
        return '✅'
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        ref={toastRef}
        className={`
          ${getToastStyles()}
          px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm
          border-2 max-w-sm
          transform-gpu
        `}
      >
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getIcon()}</div>
          <div className="flex-1">
            <p className="font-sans font-medium">{message}</p>
          </div>
          <button
            onClick={() => {
              if (toastRef.current) {
                gsap.to(toastRef.current, {
                  x: 400,
                  opacity: 0,
                  duration: 0.3,
                  onComplete: onClose,
                })
              }
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
