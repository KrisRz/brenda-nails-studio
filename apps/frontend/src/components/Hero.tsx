import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'
import { Button } from './ui/button'

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const tl = gsap.timeline({ delay: 0.5 })

      // Title letter-by-letter reveal
      if (titleRef.current) {
        const text = titleRef.current.textContent || ''
        titleRef.current.innerHTML = text
          .split(' ')
          .map(
            (word) =>
              `<span style="display: inline-block; opacity: 0; transform: translateY(100px) rotateX(90deg);">${word}</span>`
          )
          .join(' ')

        tl.to(titleRef.current.querySelectorAll('span'), {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.15,
          onComplete: () => {
            // Clean up spans after animation
            const spans = titleRef.current?.querySelectorAll('span')
            spans?.forEach((span) => {
              span.style.cssText = ''
            })
          },
        })
      }

      // Subtitle slide up
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              // Ensure clean final state
              if (subtitleRef.current) {
                subtitleRef.current.style.opacity = '1'
                subtitleRef.current.style.transform = 'translateY(0px)'
              }
            },
          },
          '-=0.3'
        )
      }

      // Buttons scale in
      if (buttonsRef.current) {
        const buttons = buttonsRef.current.querySelectorAll('a')
        tl.fromTo(
          buttons,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
            onComplete: () => {
              // Clean final state for buttons
              buttons.forEach((button) => {
                button.style.opacity = '1'
                button.style.transform = 'scale(1) translateY(0px)'
              })
            },
          },
          '-=0.2'
        )
      }

      // Floating elements subtle animation
      const floatingElements =
        heroRef.current?.querySelectorAll('.floating-element')
      if (floatingElements) {
        floatingElements.forEach((element, index) => {
          gsap.to(element, {
            y: index % 2 === 0 ? -10 : 10,
            rotation: index % 2 === 0 ? 180 : -180,
            duration: 8 + index * 1,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: index * 0.5,
          })
        })
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    >
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/images/brenda-poster.svg"
        >
          <source
            src="/videos/nail-polish-background-compressed.mp4"
            type="video/mp4"
          />
          <source src="/videos/brenda-intro.mp4" type="video/mp4" />
        </video>

        {/* Minimal overlay only for text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Floating nail polish elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-4 h-4 bg-rose-300 rounded-full opacity-30"></div>
        <div className="floating-element absolute top-32 right-20 w-3 h-3 bg-pink-400 rounded-full opacity-40"></div>
        <div className="floating-element absolute bottom-40 left-1/4 w-5 h-5 bg-rose-400 rounded-full opacity-25"></div>
        <div className="floating-element absolute bottom-60 right-1/3 w-2 h-2 bg-pink-300 rounded-full opacity-35"></div>
        <div className="floating-element absolute top-1/2 left-16 w-3 h-3 bg-rose-200 rounded-full opacity-30"></div>
        <div className="floating-element absolute top-1/3 right-12 w-4 h-4 bg-pink-500 rounded-full opacity-20"></div>
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <h1
              ref={titleRef}
              className="text-4xl md:text-6xl font-bold text-red-500 drop-shadow-2xl tracking-wide luxury-heading"
            >
              NAILS. REINVENTED.
            </h1>
          </div>
        </div>
        <p
          ref={subtitleRef}
          className="text-luxury-subtitle text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-lg opacity-0"
          style={{ transform: 'translateY(30px)' }}
        >
          Where artistry meets excellence. Professional nail care crafted with
          passion and precision.
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#contact">
            <Button
              size="lg"
              className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
            >
              Book Appointment
            </Button>
          </a>
          <a href="#gallery">
            <Button variant="outline" size="lg">
              View Gallery
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
