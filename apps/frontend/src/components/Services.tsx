import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import SectionDivider from './SectionDivider'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    title: 'Classic Manicure',
    description:
      'Professional nail care with cuticle treatment and polish application',
    price: 'From £25',
    duration: '45 min',
    image:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop&crop=hands',
    bgGradient: 'from-rose-400 to-pink-500',
    size: 'large',
  },
  {
    title: 'Gel Extensions',
    description:
      'Long-lasting gel nail extensions with custom shapes and designs',
    price: 'From £45',
    duration: '90 min',
    image:
      'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=300&fit=crop&crop=hands',
    bgGradient: 'from-purple-400 to-rose-500',
    size: 'large',
  },
  {
    title: 'Nail Art Design',
    description: 'Custom artistic designs, patterns, and decorative elements',
    price: 'From £35',
    duration: '60 min',
    image:
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=300&fit=crop&crop=hands',
    bgGradient: 'from-pink-400 to-rose-500',
    size: 'small',
  },
  {
    title: 'French Manicure',
    description: 'Timeless elegant French tips with perfect precision',
    price: 'From £30',
    duration: '50 min',
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&crop=hands',
    bgGradient: 'from-rose-300 to-pink-400',
    size: 'small',
  },
  {
    title: 'Pedicure Deluxe',
    description: 'Complete foot care with exfoliation, massage, and polish',
    price: 'From £40',
    duration: '75 min',
    image:
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=300&fit=crop&crop=feet',
    bgGradient: 'from-rose-400 to-purple-500',
    size: 'medium',
  },
  {
    title: 'Acrylic Nails',
    description:
      'Durable acrylic extensions with unlimited design possibilities',
    price: 'From £50',
    duration: '120 min',
    image:
      'https://images.unsplash.com/photo-1562887284-5c6c2c0b6c01?w=400&h=300&fit=crop&crop=hands',
    bgGradient: 'from-purple-400 to-pink-500',
    size: 'medium',
  },
]

export default function Services() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // GSAP Advanced Scroll Animations
    const ctx = gsap.context(() => {
      // Title animation with letter reveal
      if (titleRef.current) {
        const titleText = titleRef.current.querySelector('h2')
        const description = titleRef.current.querySelector('p')

        // Simple one-time title animation (no retriggering)
        if (titleText) {
          const text = titleText.textContent || ''
          titleText.innerHTML = text
            .split('')
            .map((char, i) =>
              char === ' '
                ? '<span>&nbsp;</span>'
                : `<span style="display: inline-block; opacity: 0; transform: translateY(30px);">${char}</span>`
            )
            .join('')

          // Animate letters once on scroll
          gsap.to(titleText.querySelectorAll('span'), {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.03,
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none', // Only play once
            },
            onComplete: () => {
              titleText.querySelectorAll('span').forEach((span) => {
                span.style.cssText = ''
              })
            },
          })
        }

        // Description - make it static (always visible)
        if (description) {
          gsap.set(description, { opacity: 1, y: 0 }) // Static, no animation
        }
      }

      // Cards staggered animation with 3D effects
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('[data-index]')

        // Create reusable animation
        const animateCards = () => {
          gsap.set(cards, {
            opacity: 0,
            y: 50,
            rotationX: 20,
            transformPerspective: 1000,
          })

          gsap.to(cards, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            ease: 'power2.out',
            stagger: {
              amount: 0.8,
              from: 'start',
              ease: 'power2.inOut',
            },
            onComplete: () => {
              // Clean final state for all cards - ensure perfect alignment
              cards.forEach((card) => {
                card.style.opacity = '1'
                card.style.transform =
                  'translateY(0px) rotateX(0deg) translateZ(0px)'
                // Force reflow to ensure consistent positioning
                card.offsetHeight
              })
            },
          })
        }

        // Set up ScrollTrigger with proper reset
        ScrollTrigger.create({
          trigger: cardsRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          onEnter: animateCards,
          onEnterBack: animateCards,
          invalidateOnRefresh: true,
        })

        // 3D Hover Effects for Cards
        cards.forEach((card) => {
          // Mouse enter - 3D tilt effect
          card.addEventListener('mouseenter', (e) => {
            gsap.to(card, {
              rotationY: 8,
              rotationX: -8,
              z: 50,
              duration: 0.3,
              ease: 'power2.out',
              transformOrigin: 'center center',
            })

            // Animate inner elements
            const image = card.querySelector('img')
            const overlay = card.querySelector('.group-hover\\:bg-black\\/5')

            if (image) {
              gsap.to(image, {
                scale: 1.1,
                duration: 0.4,
                ease: 'power2.out',
              })
            }

            if (overlay) {
              gsap.to(overlay, {
                opacity: 0.05,
                duration: 0.3,
              })
            }
          })

          // Mouse move - dynamic 3D tilt based on cursor position
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const deltaX = (e.clientX - centerX) / (rect.width / 2)
            const deltaY = (e.clientY - centerY) / (rect.height / 2)

            gsap.to(card, {
              rotationY: deltaX * 15,
              rotationX: -deltaY * 15,
              duration: 0.1,
              ease: 'power2.out',
            })
          })

          // Mouse leave - reset to normal
          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              rotationY: 0,
              rotationX: 0,
              z: 0,
              duration: 0.4,
              ease: 'power2.out',
            })

            const image = card.querySelector('img')
            const overlay = card.querySelector('.group-hover\\:bg-black\\/5')

            if (image) {
              gsap.to(image, {
                scale: 1,
                duration: 0.4,
                ease: 'power2.out',
              })
            }

            if (overlay) {
              gsap.to(overlay, {
                opacity: 0.1,
                duration: 0.3,
              })
            }
          })
        })
      }

      // Background elements parallax
      const bgElements = sectionRef.current?.querySelectorAll('.bg-element')
      if (bgElements) {
        bgElements.forEach((element, index) => {
          gsap.to(element, {
            y: index % 2 === 0 ? -50 : 50,
            rotation: index % 2 === 0 ? 180 : -180,
            duration: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const getCardSize = (size: string) => {
    switch (size) {
      case 'large':
        return 'md:col-span-2 md:row-span-2 h-96'
      case 'medium':
        return 'md:col-span-1 md:row-span-1 h-80'
      case 'small':
        return 'md:col-span-1 md:row-span-1 h-80'
      default:
        return 'md:col-span-1 md:row-span-1 h-80'
    }
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(to bottom, #fff0f5, #ffffff, #fdf2f8, #fef7ff)',
      }}
    >
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="bg-element absolute top-20 left-10 w-32 h-32 bg-rose-300 rounded-full blur-3xl"></div>
        <div className="bg-element absolute bottom-40 right-20 w-48 h-48 bg-pink-300 rounded-full blur-3xl"></div>
        <div className="bg-element absolute top-1/2 left-1/3 w-24 h-24 bg-purple-300 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Animated Title */}
        <div ref={titleRef} className="text-center mb-20">
          <div className="overflow-hidden mb-6">
            <h2 className="text-luxury-title font-serif bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent luxury-heading tracking-tight-luxury">
              Our Services
            </h2>
          </div>
          <p className="text-luxury-subtitle font-sans text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the artistry of professional nail care with our curated
            collection of luxury treatments
          </p>
        </div>

        {/* Asymmetric Masonry Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min"
        >
          {services.map((service, index) => (
            <div
              key={index}
              data-index={index}
              className={`group relative overflow-hidden rounded-3xl ${getCardSize(service.size)} 
                transform transition-all duration-700 ease-out transform-3d
                ${
                  visibleCards.includes(index)
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-20 opacity-0'
                }
                hover:scale-105 hover:shadow-2xl hover:shadow-rose-200/50
              `}
              style={{
                transitionDelay: `${index * 150}ms`,
                backgroundImage: `url(${service.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Light Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-500"></div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="transform group-hover:-translate-y-2 transition-transform duration-500">
                  <h3 className="text-2xl font-bold mb-2 drop-shadow-lg group-hover:text-shadow-luxury transition-all duration-300 text-reveal">
                    <span>{service.title}</span>
                  </h3>
                  <p className="text-white/90 mb-4 text-sm leading-relaxed drop-shadow group-hover:text-white transition-all duration-300">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white drop-shadow-lg">
                      {service.price}
                    </span>
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm border border-white/30">
                      {service.duration}
                    </span>
                  </div>
                </div>
                {/* Hover Button */}
                <div className="absolute inset-x-6 bottom-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <button className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-white/30 transition-all duration-300 mt-4">
                    Book Now
                  </button>
                </div>
              </div>

              {/* Golden Accent */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-80 group-hover:scale-150 transition-transform duration-500"></div>
            </div>
          ))}
        </div>

        {/* Luxury Quote Section */}
        <div className="text-center mt-16 mb-8">
          <div className="max-w-6xl mx-auto relative">
            <div className="relative z-10 py-8">
              {/* Large Quote */}
              <blockquote className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-gray-800 mb-6 luxury-heading leading-tight tracking-tight-luxury max-w-5xl mx-auto">
                Perfection is in the details
              </blockquote>

              {/* Attribution */}
              <cite className="text-xl md:text-2xl text-amber-600 tracking-luxury font-sans not-italic font-medium">
                — Brenda, Master Nail Artist
              </cite>

              {/* Simple Star */}
              <div className="text-amber-400 text-4xl mt-6">✨</div>
            </div>
          </div>
        </div>
      </div>

      {/* Award-winning Section Divider */}
      <SectionDivider color="#fff0f5" className="text-pink-50" />
    </section>
  )
}
