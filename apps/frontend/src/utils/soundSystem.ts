class SoundSystem {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private enabled = true
  private volume = 0.3 // Subtle volume for luxury feel
  private initialized = false

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private initialize() {
    if (this.initialized) return
    this.initialized = true

    // Load sound files
    this.loadSound('card-hover', '/sounds/card-hover.mp3')
    this.loadSound('button-click', '/sounds/button-click.mp3')
    this.loadSound('modal-open', '/sounds/modal-open.mp3')
    this.loadSound('modal-close', '/sounds/modal-close.mp3')
    this.loadSound('gallery-click', '/sounds/gallery-click.mp3')
    this.loadSound('form-step', '/sounds/form-step.mp3')
    this.loadSound('form-success', '/sounds/form-success.mp3')
    this.loadSound('nav-hover', '/sounds/nav-hover.mp3')

    // Check user preference
    const savedPreference = localStorage.getItem('brendaNails_soundEnabled')
    if (savedPreference !== null) {
      this.enabled = savedPreference === 'true'
    }
  }

  private loadSound(name: string, url: string) {
    try {
      const audio = new Audio(url)
      audio.preload = 'auto'
      audio.volume = this.volume

      // Handle loading errors gracefully - fallback to generated sounds
      audio.addEventListener('error', () => {
        console.warn(
          `Could not load sound file: ${name}, using generated sound`
        )
        this.createGeneratedSound(name)
      })

      // Check if file loads successfully
      audio.addEventListener(
        'canplaythrough',
        () => {
          this.sounds.set(name, audio)
        },
        { once: true }
      )
    } catch (error) {
      console.warn(`Error loading sound ${name}:`, error)
      this.createGeneratedSound(name)
    }
  }

  private createGeneratedSound(name: string) {
    // Create a simple sound using Web Audio API as fallback
    const soundConfig = this.getSoundConfig(name)

    // Create a fake audio element that generates sound on play
    const fakeAudio = {
      volume: this.volume,
      currentTime: 0,
      play: () => {
        return new Promise<void>((resolve) => {
          this.generateWebAudioSound(
            soundConfig.frequency,
            soundConfig.duration,
            soundConfig.type
          )
          resolve()
        })
      },
    } as HTMLAudioElement

    this.sounds.set(name, fakeAudio)
  }

  private getSoundConfig(name: string) {
    const configs = {
      'card-hover': {
        frequency: 800,
        duration: 0.1,
        type: 'sine' as OscillatorType,
      },
      'button-click': {
        frequency: 1000,
        duration: 0.08,
        type: 'square' as OscillatorType,
      },
      'modal-open': {
        frequency: 600,
        duration: 0.15,
        type: 'sine' as OscillatorType,
      },
      'modal-close': {
        frequency: 800,
        duration: 0.1,
        type: 'sine' as OscillatorType,
      },
      'gallery-click': {
        frequency: 1200,
        duration: 0.06,
        type: 'triangle' as OscillatorType,
      },
      'form-step': {
        frequency: 900,
        duration: 0.12,
        type: 'sine' as OscillatorType,
      },
      'form-success': {
        frequency: 1000,
        duration: 0.2,
        type: 'sine' as OscillatorType,
      },
      'nav-hover': {
        frequency: 700,
        duration: 0.08,
        type: 'sine' as OscillatorType,
      },
    }
    return (
      configs[name as keyof typeof configs] || {
        frequency: 800,
        duration: 0.1,
        type: 'sine' as OscillatorType,
      }
    )
  }

  private generateWebAudioSound(
    frequency: number,
    duration: number,
    type: OscillatorType
  ) {
    if (typeof window === 'undefined') return

    try {
      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type

      // Fade in/out for smoother sound
      const now = audioContext.currentTime
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, now + 0.01)
      gainNode.gain.linearRampToValueAtTime(0, now + duration)

      oscillator.start(now)
      oscillator.stop(now + duration)
    } catch (error) {
      console.warn('Web Audio API not supported or failed:', error)
    }
  }

  play(soundName: string, customVolume?: number) {
    // Ensure initialization in browser
    if (typeof window !== 'undefined') {
      this.initialize()
    }

    if (!this.enabled) return

    const sound = this.sounds.get(soundName)
    if (!sound) {
      console.warn(`Sound not found: ${soundName}`)
      return
    }

    try {
      // Reset to beginning and set volume
      sound.currentTime = 0
      sound.volume = customVolume ?? this.volume

      // Play with promise handling for better browser compatibility
      const playPromise = sound.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Auto-play was prevented, which is normal
          console.debug(`Audio play prevented for ${soundName}:`, error)
        })
      }
    } catch (error) {
      console.warn(`Error playing sound ${soundName}:`, error)
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('brendaNails_soundEnabled', enabled.toString())
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume)) // Clamp between 0-1
    this.sounds.forEach((sound) => {
      sound.volume = this.volume
    })
  }

  getVolume(): number {
    return this.volume
  }

  // Preload all sounds on user interaction (required for mobile)
  async preloadAll() {
    const promises = Array.from(this.sounds.values()).map((sound) => {
      return new Promise<void>((resolve) => {
        if (sound.readyState >= 2) {
          // HAVE_CURRENT_DATA
          resolve()
        } else {
          sound.addEventListener('canplaythrough', () => resolve(), {
            once: true,
          })
          sound.addEventListener('error', () => resolve(), { once: true })
        }
      })
    })

    try {
      await Promise.all(promises)
      console.log('All sounds preloaded successfully')
    } catch (error) {
      console.warn('Some sounds failed to preload:', error)
    }
  }
}

// Create singleton instance
export const soundSystem = new SoundSystem()

// Auto-preload on first user interaction (browser only)
if (typeof window !== 'undefined') {
  let preloaded = false
  const preloadOnInteraction = () => {
    if (!preloaded) {
      soundSystem.preloadAll()
      preloaded = true

      // Remove listeners after first interaction
      document.removeEventListener('click', preloadOnInteraction)
      document.removeEventListener('touchstart', preloadOnInteraction)
      document.removeEventListener('keydown', preloadOnInteraction)
    }
  }

  // Listen for first user interaction
  document.addEventListener('click', preloadOnInteraction, { passive: true })
  document.addEventListener('touchstart', preloadOnInteraction, {
    passive: true,
  })
  document.addEventListener('keydown', preloadOnInteraction, { passive: true })
}
