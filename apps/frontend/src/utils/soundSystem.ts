class SoundSystem {
  private sounds: Map<
    string,
    | HTMLAudioElement
    | { volume: number; currentTime: number; play: () => Promise<void> }
  > = new Map()
  private enabled = false // Default to disabled for better UX
  private volume = 0.3 // Subtle volume for luxury feel
  private initialized = false
  private audioContext: AudioContext | null = null
  private userInteracted = false

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      this.initialize()
      // Load saved preference from localStorage
      try {
        const savedPreference = localStorage.getItem('brendaNails_soundEnabled')
        if (savedPreference !== null) {
          this.enabled = savedPreference === 'true'
        }
      } catch (error) {
        // localStorage not available, use default
      }
    }
  }

  private initialize() {
    if (this.initialized) return
    this.initialized = true

    // Check user preference
    try {
      const savedPreference = localStorage.getItem('brendaNails_soundEnabled')
      if (savedPreference !== null) {
        this.enabled = savedPreference === 'true'
      }
    } catch (error) {
      // localStorage not available, keep default
    }

    // Don't create sounds until user interaction
    // They will be created on-demand in play() method
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
      play: async () => {
        return new Promise<void>((resolve) => {
          this.generateWebAudioSound(
            soundConfig.frequency,
            soundConfig.duration,
            soundConfig.type
          )
          resolve()
        })
      },
    }

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

  private async initAudioContext() {
    if (this.audioContext) return this.audioContext

    if (typeof window === 'undefined') return null

    try {
      this.audioContext = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )()

      // Resume context if suspended (required for user interaction)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      return this.audioContext
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
      return null
    }
  }

  private async generateWebAudioSound(
    frequency: number,
    duration: number,
    type: OscillatorType
  ) {
    if (typeof window === 'undefined' || !this.userInteracted) return

    try {
      const audioContext = await this.initAudioContext()
      if (!audioContext) return

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
      // Silently fail - audio is not critical
    }
  }

  play(soundName: string, customVolume?: number) {
    // Ensure initialization in browser
    if (typeof window !== 'undefined') {
      this.initialize()
      this.userInteracted = true // Mark user interaction
    }

    if (!this.enabled || !this.userInteracted) return

    // Create sound on-demand if it doesn't exist
    let sound = this.sounds.get(soundName)
    if (!sound) {
      this.createGeneratedSound(soundName)
      sound = this.sounds.get(soundName)
      if (!sound) {
        return // Still couldn't create sound
      }
    }

    try {
      // Reset to beginning and set volume if supported
      if (sound.currentTime !== undefined) {
        sound.currentTime = 0
      }
      if (sound.volume !== undefined) {
        sound.volume = customVolume ?? this.volume
      }

      // Play with promise handling for better browser compatibility
      const playPromise = sound.play()
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Silently handle play failures
        })
      }
    } catch (error) {
      // Silently handle errors
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('brendaNails_soundEnabled', enabled.toString())
      } catch (error) {
        // localStorage not available, ignore
      }
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume)) // Clamp between 0-1
    for (const sound of this.sounds.values()) {
      sound.volume = this.volume
    }
  }

  getVolume(): number {
    return this.volume
  }

  // Preload all sounds on user interaction (required for mobile)
  async preloadAll() {
    this.userInteracted = true

    // Initialize all sounds after user interaction
    this.createGeneratedSound('card-hover')
    this.createGeneratedSound('button-click')
    this.createGeneratedSound('modal-open')
    this.createGeneratedSound('modal-close')
    this.createGeneratedSound('gallery-click')
    this.createGeneratedSound('form-step')
    this.createGeneratedSound('form-success')
    this.createGeneratedSound('nav-hover')

    // Initialize the audio context
    try {
      await this.initAudioContext()
    } catch (error) {
      // Silently handle preload failures
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
