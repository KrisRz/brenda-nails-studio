import { gsap } from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { soundSystem } from '../utils/soundSystem'
import { Button } from './ui/button'

export default function About() {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isCertModalOpen, setIsCertModalOpen] = useState(false)

  // Modal animations
  const openCertModal = () => {
    soundSystem.play('modal-open')
    setIsCertModalOpen(true)
    document.body.style.overflow = 'hidden'

    requestAnimationFrame(() => {
      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
        )

        const modalItems = modalRef.current.querySelectorAll('.cert-item')
        gsap.fromTo(
          modalItems,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
            delay: 0.2,
          }
        )
      }
    })
  }

  const closeCertModal = useCallback(() => {
    soundSystem.play('modal-close')
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setIsCertModalOpen(false)
          document.body.style.overflow = 'unset'
        },
      })
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isCertModalOpen && e.key === 'Escape') closeCertModal()
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isCertModalOpen, closeCertModal])

  // Certifications data - using actual JPG images
  const certifications = [
    {
      id: 1,
      title: 'Professional Certification 1',
      issuer: 'Beauty Academy',
      year: '2024',
      image: '/images/certifications/11.jpg',
    },
    {
      id: 2,
      title: 'Professional Certification 2',
      issuer: 'Nail Institute',
      year: '2023',
      image: '/images/certifications/111.jpg',
    },
    {
      id: 3,
      title: 'Professional Certification 3',
      issuer: 'Beauty Institute',
      year: '2023',
      image: '/images/certifications/22.jpg',
    },
    {
      id: 4,
      title: 'Professional Certification 4',
      issuer: 'Academy of Beauty',
      year: '2022',
      image: '/images/certifications/33.jpg',
    },
    {
      id: 5,
      title: 'Professional Certification 5',
      issuer: 'Professional Institute',
      year: '2022',
      image: '/images/certifications/44.jpg',
    },
    {
      id: 6,
      title: 'Professional Certification 6',
      issuer: 'Beauty Academy',
      year: '2021',
      image: '/images/certifications/55.jpg',
    },
    {
      id: 7,
      title: 'Professional Certification 7',
      issuer: 'Beauty Institute',
      year: '2021',
      image: '/images/certifications/66.jpg',
    },
  ]

  return (
    <section
      className="py-20 relative"
      style={{
        background:
          'linear-gradient(135deg, #fdf2f8, #fff0f5, #ffffff, #fef7ff)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-luxury-title  text-gray-900 mb-6 luxury-heading tracking-tight-luxury">
                Meet Brenda
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                With over 8 years of experience in nail artistry, Brenda
                combines technical expertise with creative vision to deliver
                exceptional results. Specializing in custom nail art, gel
                extensions, and luxury manicure services.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Every client receives personalized attention in our modern,
                hygiene-focused studio environment. We use only premium products
                and the latest techniques to ensure your nails look stunning and
                stay healthy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-rose-600 mb-2">
                  500+
                </div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-rose-600 mb-2">8+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                  Book Appointment
                </Button>
              </a>
              <Button
                variant="outline"
                size="lg"
                className="border-rose-600 text-rose-600 hover:bg-rose-50"
                onClick={openCertModal}
              >
                View Certifications
              </Button>
            </div>
          </div>

          {/* Video/Image section */}
          <div className="relative">
            {/* Video/Image container */}
            <div className="aspect-[4/5] rounded-3xl shadow-2xl overflow-hidden bg-gray-100">
              {/* Opcja 1: Video */}
              <video
                className="w-full h-full object-cover transition-opacity duration-300"
                controls
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/images/brenda-poster.svg"
                onLoadStart={() => console.log('Video loading started')}
                onCanPlay={() => console.log('Video ready to play')}
              >
                <source src="/videos/brenda-intro.mp4" type="video/mp4" />
                {/* Fallback message */}
                <p className="text-center text-gray-600 p-8">
                  Your browser doesn't support video playback.
                  <br />
                  <a
                    href="/videos/brenda-intro.mp4"
                    className="text-rose-600 underline"
                  >
                    Download video
                  </a>
                </p>
              </video>

              {/* Opcja 2: Zdjęcie (wyłączone - używamy video) */}
              {/*
              <img
                src="/images/brenda-photo.jpg"
                alt="Brenda - Professional Nail Artist"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback jeśli nie ma zdjęcia
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              */}

              {/* Fallback placeholder */}
              <div className="hidden items-center justify-center h-full bg-gradient-to-br from-rose-200 to-pink-300">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">👩‍🎨</div>
                  <div className="text-xl font-semibold">Brenda's Photo</div>
                  <div className="text-sm opacity-90">
                    Professional Portrait
                  </div>
                </div>
              </div>

              {/* Loading indicator */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-gray-100 opacity-0 transition-opacity duration-300"
                id="video-loading"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600" />
              </div>

              {/* Custom play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-rose-600 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Video info overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium">Meet Brenda</p>
                <p className="text-gray-200 text-xs">
                  Professional Nail Artist
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-400 rounded-full opacity-20" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400 rounded-full opacity-15" />
          </div>
        </div>
      </div>

      {/* Certifications Modal */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeCertModal}
            onKeyDown={(e) => e.key === 'Enter' && closeCertModal()}
            role="button"
            tabIndex={0}
            aria-label="Close modal"
          />

          {/* Modal Content */}
          <div
            ref={modalRef}
            className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            style={{ opacity: 0, transform: 'scale(0.8)' }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeCertModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Professional Certifications
              </h3>
              <p className="text-gray-600">
                Brenda's professional qualifications and training achievements
              </p>
            </div>

            {/* Certifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="cert-item group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{
                    opacity: 0,
                    transform: 'translateY(30px) scale(0.9)',
                  }}
                >
                  {/* Certificate Image */}
                  <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                    <img
                      src={cert.image}
                      alt={`${cert.title} Certificate`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback placeholder if image fails to load
                        console.log('Image failed to load:', cert.image)
                        const target = e.currentTarget
                        target.style.display = 'none'
                        const placeholder =
                          target.nextElementSibling as HTMLElement
                        if (placeholder) placeholder.style.display = 'flex'
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', cert.image)
                      }}
                    />

                    {/* Fallback placeholder */}
                    <div className="hidden absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-100 items-center justify-center">
                      <div className="text-center text-gray-600">
                        <div className="text-4xl mb-2">📜</div>
                        <div className="text-sm font-medium">Certificate</div>
                      </div>
                    </div>

                    {/* Click overlay for opening PDF */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 cursor-pointer flex items-center justify-center group-hover:bg-black/20">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <svg
                          className="w-6 h-6 text-gray-800"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">
                      {cert.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">{cert.issuer}</p>
                    <p className="text-rose-600 text-sm font-medium mb-3">
                      {cert.year}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <a
                        href={cert.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200 text-center"
                      >
                        View Full
                      </a>
                      <a
                        href={cert.image}
                        download
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-lg transition-colors duration-200 text-center"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-rose-50 rounded-xl">
              <p className="text-sm text-gray-700 text-center">
                All certifications are current and verified. Brenda continues
                her education to stay updated with the latest techniques and
                industry standards.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
