import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'

interface FloatingInputProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: string
  icon?: string
  className?: string
}

export default function FloatingInput({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  icon,
  className = '',
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const labelRef = useRef<HTMLLabelElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  const hasValue = value.length > 0
  const shouldFloat =
    isFocused || hasValue || type === 'date' || type === 'time'

  useEffect(() => {
    // Validate on value change
    if (required && value.length > 0) {
      setIsValid(value.trim().length > 0)
    }
  }, [value, required])

  useEffect(() => {
    // Error animation
    if (error && errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [error])

  const handleFocus = () => {
    setIsFocused(true)

    // Focus animation
    if (inputRef.current) {
      gsap.to(inputRef.current, {
        scale: 1.02,
        duration: 0.2,
        ease: 'power2.out',
      })
    }
  }

  const handleBlur = () => {
    setIsFocused(false)

    // Blur animation
    if (inputRef.current) {
      gsap.to(inputRef.current, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      })
    }

    // Validation
    if (required && value.trim().length === 0) {
      setIsValid(false)
      // Shake animation for invalid
      if (inputRef.current) {
        gsap.to(inputRef.current, {
          x: [-5, 5, -5, 5, 0],
          duration: 0.4,
          ease: 'power2.out',
        })
      }
    }
  }

  const getBorderColor = () => {
    if (error || !isValid) return 'border-red-400 focus:border-red-500'
    if (isFocused) return 'border-rose-500 focus:border-rose-600'
    if (hasValue && isValid) return 'border-green-400'
    return 'border-gray-300 focus:border-rose-500'
  }

  return (
    <div className={`relative ${className}`}>
      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full px-4 py-4 ${icon ? 'pl-12' : 'px-4'}
            bg-white/80 backdrop-blur-sm
            border-2 rounded-2xl
            transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-rose-500/20
            ${type === 'date' || type === 'time' ? '' : 'placeholder-transparent'}
            ${getBorderColor()}
            transform-gpu
          `}
          placeholder={type === 'date' || type === 'time' ? '' : label}
          required={required}
        />

        {/* Floating Label */}
        <label
          ref={labelRef}
          className={`
            absolute left-4 ${icon ? 'left-12' : 'left-4'}
            transition-all duration-300 pointer-events-none
            font-sans
            ${
              shouldFloat
                ? '-top-2 text-xs bg-white px-2 rounded'
                : 'top-1/2 -translate-y-1/2 text-base'
            }
            ${
              isFocused
                ? 'text-rose-600'
                : error || !isValid
                  ? 'text-red-500'
                  : 'text-gray-500'
            }
          `}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>

        {/* Validation Icon */}
        {hasValue && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isValid && !error ? (
              <div className="text-green-500 animate-scale-in">✓</div>
            ) : (
              <div className="text-red-500 animate-pulse">⚠</div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {(error || !isValid) && (
        <div
          ref={errorRef}
          className="mt-2 text-sm text-red-500 font-sans flex items-center space-x-1"
        >
          <span>⚠</span>
          <span>{error || `${label} is required`}</span>
        </div>
      )}

      {/* Success Message */}
      {hasValue && isValid && !error && (
        <div className="mt-2 text-sm text-green-600 font-sans flex items-center space-x-1 animate-fade-in">
          <span>✓</span>
          <span>Looks good!</span>
        </div>
      )}
    </div>
  )
}
