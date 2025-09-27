import { useEffect, useState } from 'react'
import { soundSystem } from '../utils/soundSystem'
import SoundToggle from './ui/SoundToggle'
import { Button } from './ui/button'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHomePage, setIsHomePage] = useState(true)

  // Check if we're on the home page
  useEffect(() => {
    const checkHomePage = () => {
      const path = window.location.pathname
      setIsHomePage(path === '/' || path === '/index.html')
    }

    checkHomePage()
    // Listen for navigation changes
    window.addEventListener('popstate', checkHomePage)
    return () => window.removeEventListener('popstate', checkHomePage)
  }, [])

  const navItems = [
    { name: 'Home', href: isHomePage ? '#home' : '/#home' },
    { name: 'Services', href: isHomePage ? '#services' : '/#services' },
    { name: 'About', href: isHomePage ? '#about' : '/#about' },
    { name: 'Gallery', href: isHomePage ? '#gallery' : '/#gallery' },
    { name: 'Contact', href: isHomePage ? '#contact' : '/#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex flex-col">
              <span
                className={`text-lg font-bold tracking-wide transition-all duration-300 luxury-heading ${
                  isScrolled
                    ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 bg-clip-text text-transparent'
                    : 'text-white drop-shadow-2xl'
                }`}
              >
                BRENDA
              </span>
              <span
                className={`text-xs font-light tracking-[0.2em] -mt-1 transition-all duration-300 ${
                  isScrolled ? 'text-rose-500' : 'text-rose-200 drop-shadow-lg'
                }`}
              >
                BRENDA NAILS STUDIO
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`font-medium tracking-wide text-sm uppercase transition-all duration-300 hover:scale-105 relative group ${
                  isScrolled
                    ? 'text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-rose-500 hover:to-purple-600 hover:bg-clip-text'
                    : 'text-white hover:text-rose-200 drop-shadow-lg'
                }`}
                onMouseEnter={() => soundSystem.play('nav-hover')}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isScrolled
                      ? 'bg-gradient-to-r from-rose-500 to-purple-600'
                      : 'bg-rose-200'
                  }`}
                ></span>
              </a>
            ))}
          </div>

          {/* Sound Toggle - Absolute Right */}
          <div className="hidden md:block absolute right-4">
            <SoundToggle />
          </div>

          {/* Mobile menu button and sound toggle */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Sound Toggle for Mobile */}
            <SoundToggle />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`focus:outline-none transition-colors duration-300 ${
                isScrolled
                  ? 'text-gray-700 hover:text-rose-600'
                  : 'text-white hover:text-rose-300 drop-shadow-lg'
              }`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className={`md:hidden py-4 border-t transition-colors duration-300 ${
              isScrolled
                ? 'border-gray-200 bg-white/95'
                : 'border-white/20 bg-black/20 backdrop-blur-md'
            }`}
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`font-medium tracking-wide text-sm uppercase transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? 'text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-rose-500 hover:to-purple-600 hover:bg-clip-text'
                      : 'text-white hover:text-rose-200'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={() => soundSystem.play('nav-hover')}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
