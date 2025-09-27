import { useEffect, useState } from 'react'
import { soundSystem } from '../../utils/soundSystem'

export default function SoundToggle() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load sound preference from localStorage
    const savedPreference = localStorage.getItem('brendaNails_soundEnabled')
    const enabled = savedPreference === 'true'

    setIsSoundEnabled(enabled)
    soundSystem.setEnabled(enabled)
    setIsLoaded(true)
  }, [])

  const toggleSound = () => {
    const newState = !isSoundEnabled
    setIsSoundEnabled(newState)
    soundSystem.setEnabled(newState)

    // Save preference to localStorage
    localStorage.setItem('brendaNails_soundEnabled', newState.toString())

    // Play a test sound when enabling
    if (newState) {
      setTimeout(() => soundSystem.play('button-click'), 100)
    }
  }

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm animate-pulse" />
    )
  }

  return (
    <button
      onClick={toggleSound}
      className={`
        group relative w-10 h-10 rounded-full transition-all duration-300 
        backdrop-blur-sm border border-white/20 hover:border-white/40
        hover:scale-110 hover:shadow-lg hover:shadow-rose-500/20
        ${
          isSoundEnabled
            ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30'
            : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
        }
      `}
      title={isSoundEnabled ? 'Wyłącz dźwięki' : 'Włącz dźwięki'}
      aria-label={isSoundEnabled ? 'Wyłącz dźwięki' : 'Włącz dźwięki'}
    >
      {/* Sound Wave Animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isSoundEnabled ? (
          <div className="relative">
            {/* Speaker Icon */}
            <svg
              className="w-4 h-4 relative z-10"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>

            {/* Animated Sound Waves */}
            <div className="absolute -right-1 top-1/2 -translate-y-1/2">
              <div className="w-1 h-1 bg-current rounded-full animate-pulse opacity-80" />
            </div>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2">
              <div
                className="w-1 h-2 bg-current rounded-full animate-pulse opacity-60"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2">
              <div
                className="w-1 h-1 bg-current rounded-full animate-pulse opacity-40"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Muted Speaker Icon */}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>

            {/* X mark for muted */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-1 h-1 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Luxury Glow Effect */}
      <div
        className={`
        absolute inset-0 rounded-full transition-opacity duration-300
        ${
          isSoundEnabled
            ? 'bg-gradient-to-br from-rose-400/20 to-pink-500/20 opacity-100'
            : 'opacity-0'
        }
      `}
      />

      {/* Hover Ring Effect */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/30 transition-all duration-300 group-hover:scale-110" />
    </button>
  )
}
