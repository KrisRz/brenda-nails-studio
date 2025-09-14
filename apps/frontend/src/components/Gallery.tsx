import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import SectionDivider from './SectionDivider'

gsap.registerPlugin(ScrollTrigger)

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation with letter reveal
      if (titleRef.current) {
        const titleText = titleRef.current.querySelector('h2')
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

          gsap.to(titleText.querySelectorAll('span'), {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.03,
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
            },
            onComplete: () => {
              titleText.querySelectorAll('span').forEach((span) => {
                span.style.cssText = ''
              })
            },
          })
        }

        // Animate description
        const description = titleRef.current.querySelector('p')
        if (description) {
          gsap.to(description, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.3,
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
            },
            onComplete: () => {
              description.style.opacity = '1'
              description.style.transform = 'translateY(0px)'
            },
          })
        }
      }

      // Gallery grid animation
      if (gridRef.current) {
        const images = gridRef.current.querySelectorAll('.gallery-item')

        gsap.set(images, {
          opacity: 0,
          y: 60,
          scale: 0.8,
        })

        gsap.to(images, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          stagger: {
            amount: 1.2,
            from: 'start',
            ease: 'power2.inOut',
          },
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse',
          },
          onComplete: () => {
            images.forEach((image) => {
              image.style.opacity = '1'
              image.style.transform = 'translateY(0px) scale(1)'
            })
          },
        })
      }

      // CTA button animation
      if (ctaRef.current) {
        const button = ctaRef.current.querySelector('button')
        if (button) {
          gsap.fromTo(
            button,
            { opacity: 0, y: 30, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: ctaRef.current,
                start: 'top 80%',
              },
              onComplete: () => {
                button.style.opacity = '1'
                button.style.transform = 'translateY(0px) scale(1)'
              },
            }
          )
        }
      }

      // Background elements parallax
      const bgElements = sectionRef.current?.querySelectorAll('.bg-element')
      if (bgElements) {
        bgElements.forEach((element, index) => {
          gsap.to(element, {
            y: index % 2 === 0 ? -40 : 40,
            rotation: index % 2 === 0 ? 90 : -90,
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

      // 3D Hover Effects for Gallery Items
      if (gridRef.current) {
        const galleryItems = gridRef.current.querySelectorAll('.gallery-item')

        galleryItems.forEach((item) => {
          // Mouse enter - 3D tilt effect
          item.addEventListener('mouseenter', () => {
            gsap.to(item, {
              rotationY: 12,
              rotationX: -8,
              z: 30,
              duration: 0.3,
              ease: 'power2.out',
              transformOrigin: 'center center',
            })

            // Animate image scale
            const image = item.querySelector('img')
            if (image) {
              gsap.to(image, {
                scale: 1.15,
                duration: 0.4,
                ease: 'power2.out',
              })
            }
          })

          // Mouse move - dynamic 3D tilt
          item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const deltaX = (e.clientX - centerX) / (rect.width / 2)
            const deltaY = (e.clientY - centerY) / (rect.height / 2)

            gsap.to(item, {
              rotationY: deltaX * 20,
              rotationX: -deltaY * 20,
              duration: 0.1,
              ease: 'power2.out',
            })
          })

          // Mouse leave - reset
          item.addEventListener('mouseleave', () => {
            gsap.to(item, {
              rotationY: 0,
              rotationX: 0,
              z: 0,
              duration: 0.4,
              ease: 'power2.out',
            })

            const image = item.querySelector('img')
            if (image) {
              gsap.to(image, {
                scale: 1.1, // Keep slight hover scale from CSS
                duration: 0.4,
                ease: 'power2.out',
              })
            }
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Modal animations
  const openModal = () => {
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'

    // Delay animation until next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
        )

        // Animate grid items
        const modalItems = modalRef.current.querySelectorAll(
          '.modal-gallery-item'
        )
        gsap.fromTo(
          modalItems,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.05,
            delay: 0.2,
          }
        )

        // Add 3D hover effects to modal items
        modalItems.forEach((item) => {
          item.addEventListener('mouseenter', () => {
            gsap.to(item, {
              rotationY: 10,
              rotationX: -5,
              z: 20,
              duration: 0.3,
              ease: 'power2.out',
            })
          })

          item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const deltaX = (e.clientX - centerX) / (rect.width / 2)
            const deltaY = (e.clientY - centerY) / (rect.height / 2)

            gsap.to(item, {
              rotationY: deltaX * 15,
              rotationX: -deltaY * 15,
              duration: 0.1,
              ease: 'power2.out',
            })
          })

          item.addEventListener('mouseleave', () => {
            gsap.to(item, {
              rotationY: 0,
              rotationX: 0,
              z: 0,
              duration: 0.4,
              ease: 'power2.out',
            })
          })
        })
      }
    })
  }

  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setIsModalOpen(false)
          document.body.style.overflow = 'unset'
        },
      })
    }
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setIsLightboxOpen(true)

    if (lightboxRef.current) {
      gsap.fromTo(
        lightboxRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      )

      const lightboxImage = lightboxRef.current.querySelector('.lightbox-image')
      if (lightboxImage) {
        gsap.fromTo(
          lightboxImage,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        )
      }
    }
  }

  const closeLightbox = () => {
    if (lightboxRef.current) {
      gsap.to(lightboxRef.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => setIsLightboxOpen(false),
      })
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    )
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'ArrowRight') nextImage()
        if (e.key === 'ArrowLeft') prevImage()
        if (e.key === 'Escape') closeLightbox()
      }
      if (isModalOpen && e.key === 'Escape') closeModal()
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isLightboxOpen, isModalOpen])

  const galleryImages = [
    {
      id: 1,
      category: 'Nail Art',
      description: 'Floral design with gold accents',
      image:
        'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=500&fit=crop&crop=center',
    },
    {
      id: 2,
      category: 'French Manicure',
      description: 'Classic white tips with nude base',
      image:
        'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=500&fit=crop&crop=center',
    },
    {
      id: 3,
      category: 'Gel Extensions',
      description: 'Long coffin shape with ombre effect',
      image:
        'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=500&fit=crop&crop=center',
    },
    {
      id: 4,
      category: 'Acrylic Nails',
      description: 'Stiletto shape with rhinestone details',
      image:
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=500&fit=crop&crop=center',
    },
    {
      id: 5,
      category: 'Pedicure',
      description: 'Summer bright colors with toe art',
      image:
        'https://images.unsplash.com/photo-1562887284-5c6c2c4e3c4c?w=400&h=500&fit=crop&crop=center',
    },
    {
      id: 6,
      category: 'Nail Art',
      description: 'Geometric patterns in pastels',
      image:
        'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=500&fit=crop&crop=center',
    },
    {
      id: 7,
      category: 'Chrome Nails',
      description: 'Mirror finish chrome effect',
      image:
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop&crop=center',
    },
    {
      id: 8,
      category: 'Marble Nails',
      description: 'Elegant marble pattern design',
      image:
        'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=500&fit=crop&crop=center',
    },
    {
      id: 9,
      category: 'Glitter Nails',
      description: 'Sparkling glitter gradient',
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&crop=center',
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #fef7ff, #ffffff, #fff0f5)',
      }}
    >
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="bg-element absolute top-20 left-10 w-24 h-24 bg-purple-300 rounded-full blur-2xl"></div>
        <div className="bg-element absolute bottom-40 right-20 w-32 h-32 bg-pink-300 rounded-full blur-3xl"></div>
        <div className="bg-element absolute top-1/2 left-1/4 w-20 h-20 bg-rose-300 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-luxury-title font-serif text-gray-900 mb-4 luxury-heading tracking-tight-luxury">
            Our Work
          </h2>
          <p
            className="text-luxury-subtitle font-sans text-gray-600 max-w-2xl mx-auto opacity-0"
            style={{ transform: 'translateY(20px)' }}
          >
            Discover our latest nail art creations and professional manicure
            work
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="gallery-item group relative aspect-square rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 transform-3d interactive-card hover-glow"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Actual image */}
              <img
                src={image.image}
                alt={`${image.category} - ${image.description}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjQ4Ij7wn5KFPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZiNzI4MCIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNiI+TmFpbCBBcnQ8L3RleHQ+Cjwvc3ZnPgo='
                }}
              />

              {/* Overlay with description */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-sm mb-1">
                    {image.category}
                  </h3>
                  <p className="text-xs opacity-90">{image.description}</p>
                </div>
              </div>

              {/* Category badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-medium text-gray-800">
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="text-center mt-12">
          <button
            type="button"
            onClick={openModal}
            className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 hover:scale-105 transition-transform opacity-0"
            style={{ transform: 'translateY(30px) scale(0.9)' }}
          >
            View Full Gallery
          </button>
        </div>
      </div>

      {/* Modal Gallery */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div
            ref={modalRef}
            className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            style={{ opacity: 0, transform: 'scale(0.8)' }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Gallery
              </h3>
              <p className="text-gray-600">
                Explore all our nail art creations and professional work
              </p>
            </div>

            {/* Modal Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className="modal-gallery-item group relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform-3d"
                  onClick={() => openLightbox(index)}
                  style={{
                    opacity: 0,
                    transform: 'translateY(30px) scale(0.9)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <img
                    src={image.image}
                    alt={`${image.category} - ${image.description}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-3 text-white">
                      <h4 className="font-semibold text-sm">
                        {image.category}
                      </h4>
                      <p className="text-xs opacity-90">{image.description}</p>
                    </div>
                  </div>

                  {/* Zoom icon */}
                  <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm">🔍</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ opacity: 0 }}
        >
          {/* Lightbox Backdrop */}
          <div
            className="absolute inset-0 bg-black/95"
            onClick={closeLightbox}
          />

          {/* Lightbox Content */}
          <div className="relative max-w-4xl w-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>

            {/* Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              →
            </button>

            {/* Main Image */}
            <div
              className="lightbox-image"
              style={{ opacity: 0, transform: 'scale(0.8)' }}
            >
              <img
                src={galleryImages[currentImageIndex]?.image}
                alt={`${galleryImages[currentImageIndex]?.category} - ${galleryImages[currentImageIndex]?.description}`}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />

              {/* Image Info */}
              <div className="text-center mt-4 text-white">
                <h4 className="text-xl font-semibold mb-1">
                  {galleryImages[currentImageIndex]?.category}
                </h4>
                <p className="text-white/80">
                  {galleryImages[currentImageIndex]?.description}
                </p>
                <p className="text-sm text-white/60 mt-2">
                  {currentImageIndex + 1} of {galleryImages.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Award-winning Section Divider */}
      <SectionDivider color="#fef7ff" className="text-purple-50" />
    </section>
  )
}
