import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'

const testimonials = [
  {
    id: 1,
    quote:
      "Brenda transformed not just my nails, but my confidence. I walk into every meeting feeling powerful and polished. It's not just a manicure - it's a complete transformation.",
    name: 'Sarah Mitchell',
    role: 'CEO & Entrepreneur',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    service: 'Executive Manicure',
  },
  {
    id: 2,
    quote:
      'My wedding day was perfect, and my nails were the finishing touch that made everything magical. Brenda understood my vision completely and created something beyond my dreams.',
    name: 'Emma Thompson',
    role: 'Bride',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    service: 'Bridal Nail Art',
  },
  {
    id: 3,
    quote:
      "As a beauty influencer, I've experienced the best salons worldwide. Brenda's artistry and attention to detail rivals the top studios in Paris and New York.",
    name: 'Jessica Chen',
    role: 'Beauty Influencer',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    service: 'Luxury Nail Art',
  },
  {
    id: 4,
    quote:
      "I'm a surgeon and my hands are everything to me. Brenda not only makes them beautiful but also ensures they're healthy and strong. True professional care.",
    name: 'Dr. Amanda Foster',
    role: 'Surgeon',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    service: 'Professional Care',
  },
  {
    id: 5,
    quote:
      "After trying countless salons, I finally found my nail artist for life. Brenda's creativity knows no bounds, and every visit is like unwrapping a beautiful gift.",
    name: 'Olivia Rodriguez',
    role: 'Fashion Designer',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    service: 'Creative Nail Design',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const testimonialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 7000) // Longer time to read luxury stories

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (testimonialRef.current) {
      gsap.fromTo(
        testimonialRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [currentIndex])

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-luxury-title font-serif text-gray-900 mb-6 luxury-heading tracking-tight-luxury">
            Client Love
          </h2>
          <p className="text-luxury-subtitle font-sans text-gray-600 max-w-2xl mx-auto">
            Real stories from our amazing clients who trust us with their nail
            artistry
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={testimonialRef}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-indigo-200/30 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              {/* Quote */}
              <div className="text-center mb-8">
                <div className="text-6xl text-rose-300 mb-4 font-serif">"</div>
                <blockquote className="text-luxury-subtitle font-sans text-gray-700 leading-relaxed italic max-w-3xl mx-auto">
                  {currentTestimonial.quote}
                </blockquote>
              </div>

              {/* Client Info */}
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl"
                />
                <div className="text-center md:text-left">
                  <h4 className="font-serif font-bold text-gray-900 text-xl luxury-heading mb-1">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-gray-600 font-sans text-lg mb-1">
                    {currentTestimonial.role}
                  </p>
                  <p className="text-rose-600 font-sans text-sm font-medium mb-2">
                    {currentTestimonial.service}
                  </p>
                  {/* Stars */}
                  <div className="flex justify-center md:justify-start">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-xl">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation & Counter */}
          <div className="flex flex-col items-center space-y-4 mt-8">
            {/* Counter */}
            <div className="text-sm text-gray-500 font-sans">
              {currentIndex + 1} of {testimonials.length}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-rose-500 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
