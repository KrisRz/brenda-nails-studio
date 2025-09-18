// Script to generate basic sound effects using Web Audio API
// Run this in browser console to generate and download audio files

function generateSound(frequency, duration, type = 'sine', volume = 0.1) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = frequency
  oscillator.type = type

  // Fade in/out for smoother sound
  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}

// Generate different sound effects
const sounds = {
  'card-hover': () => generateSound(800, 0.1, 'sine', 0.05),
  'button-click': () => generateSound(1000, 0.08, 'square', 0.06),
  'modal-open': () => {
    generateSound(600, 0.15, 'sine', 0.04)
    setTimeout(() => generateSound(800, 0.1, 'sine', 0.03), 50)
  },
  'modal-close': () => {
    generateSound(800, 0.1, 'sine', 0.03)
    setTimeout(() => generateSound(600, 0.15, 'sine', 0.04), 50)
  },
  'gallery-click': () => generateSound(1200, 0.06, 'triangle', 0.05),
  'form-step': () => generateSound(900, 0.12, 'sine', 0.04),
  'form-success': () => {
    generateSound(600, 0.2, 'sine', 0.06)
    setTimeout(() => generateSound(800, 0.15, 'sine', 0.05), 100)
    setTimeout(() => generateSound(1000, 0.1, 'sine', 0.04), 200)
  },
  'nav-hover': () => generateSound(700, 0.08, 'sine', 0.03),
}

// To use: Run sounds['card-hover']() in browser console
console.log('Sound generators ready. Use: sounds["card-hover"]()')
console.log('Available sounds:', Object.keys(sounds))
