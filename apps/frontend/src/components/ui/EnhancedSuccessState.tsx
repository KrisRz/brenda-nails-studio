import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

interface EnhancedSuccessStateProps {
  isVisible: boolean
  onComplete?: () => void
  message?: string
  type?: 'booking' | 'newsletter' | 'contact'
}

export default function EnhancedSuccessState({
  isVisible,
  onComplete,
  message = 'Success!',
  type = 'booking',
}: EnhancedSuccessStateProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const checkmarkRef = useRef<SVGSVGElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            if (onComplete) onComplete()
          }, 2000)
        },
      })

      // Container entrance
      tl.fromTo(
        containerRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      )

      // Checkmark draw animation
      if (checkmarkRef.current) {
        const path = checkmarkRef.current.querySelector('path')
        if (path) {
          const pathLength = path.getTotalLength()
          gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          })

          tl.to(
            path,
            {
              strokeDashoffset: 0,
              duration: 0.8,
              ease: 'power2.out',
            },
            '-=0.2'
          )
        }
      }

      // Confetti explosion
      if (confettiRef.current) {
        const confettiElements = confettiRef.current.children
        tl.fromTo(
          confettiElements,
          { scale: 0, y: 0, rotation: 0, opacity: 1 },
          {
            scale: 1,
            y: -100,
            rotation: 360,
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out',
            stagger: 0.1,
          },
          '-=0.5'
        )
      }
    }
  }, [isVisible, onComplete])

  const getIcon = () => {
    switch (type) {
      case 'booking':
        return '📅'
      case 'newsletter':
        return '💌'
      case 'contact':
        return '📞'
      default:
        return '✨'
    }
  }

  const getMessage = () => {
    switch (type) {
      case 'booking':
        return "🎉 Appointment booked successfully! We'll contact you soon to confirm your dream nails session."
      case 'newsletter':
        return '💌 Welcome to our nail art community! Check your email for exclusive tips and offers.'
      case 'contact':
        return "📞 Message sent successfully! We'll get back to you within 24 hours."
      default:
        return message
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        ref={containerRef}
        className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-white/60"
        style={{ opacity: 0, transform: 'scale(0)' }}
      >
        {/* Success Icon with Animation */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              ref={checkmarkRef}
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Confetti */}
          <div
            ref={confettiRef}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-2 left-2 text-2xl">🎉</div>
            <div className="absolute top-4 right-4 text-xl">✨</div>
            <div className="absolute top-1 left-1/2 text-lg">🎊</div>
            <div className="absolute top-3 right-1/4 text-xl">💫</div>
            <div className="absolute top-2 left-3/4 text-lg">⭐</div>
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-6">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3 luxury-heading">
            Perfect! {getIcon()}
          </h3>
          <p className="text-gray-600 font-sans leading-relaxed">
            {getMessage()}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            if (containerRef.current) {
              gsap.to(containerRef.current, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                  if (onComplete) onComplete()
                },
              })
            }
          }}
          className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
