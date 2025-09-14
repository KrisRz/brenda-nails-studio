import { gsap } from 'gsap'
import { useRef, useState } from 'react'

interface RippleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export default function RippleButton({
  children,
  onClick,
  className = '',
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const createRipple = (e: React.MouseEvent) => {
    if (disabled || loading) return

    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const newRipple = {
      id: Date.now(),
      x,
      y,
    }

    setRipples((prev) => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 600)

    // Button press animation
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    })

    if (onClick) onClick()
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white'
      case 'secondary':
        return 'bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white'
      case 'outline':
        return 'border-2 border-rose-600 text-rose-600 hover:bg-rose-50'
      default:
        return 'bg-gradient-to-r from-rose-600 to-pink-600 text-white'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm'
      case 'md':
        return 'px-6 py-3 text-base'
      case 'lg':
        return 'px-8 py-4 text-lg'
      default:
        return 'px-6 py-3 text-base'
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={createRipple}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden
        ${getVariantClasses()}
        ${getSizeClasses()}
        font-semibold rounded-full
        transition-all duration-300
        hover:scale-105 hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        transform-gpu
        ${className}
      `}
    >
      {/* Content */}
      <span
        className={`flex items-center justify-center space-x-2 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
      >
        {children}
      </span>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      )}

      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '100px',
            height: '100px',
            animationDuration: '600ms',
          }}
        />
      ))}

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  )
}
