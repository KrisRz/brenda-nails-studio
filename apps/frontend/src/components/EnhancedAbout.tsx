import { Button } from './ui/button'

export default function EnhancedAbout() {
  return (
    <section
      className="py-20 relative"
      style={{
        background:
          'linear-gradient(135deg, #fdf2f8, #fff0f5, #ffffff, #fef7ff)',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <h2 className="text-luxury-title font-serif text-gray-900 mb-6 luxury-heading tracking-tight-luxury">
            Meet Brenda
          </h2>
          <p className="text-luxury-subtitle font-sans text-gray-600 max-w-3xl mx-auto">
            A journey of passion, dedication, and artistic excellence in nail
            artistry
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content - Left side */}
          <div className="lg:col-span-1 space-y-8">
            {/* Story */}
            <div>
              <p className="text-luxury-body font-sans text-gray-700 leading-relaxed mb-6">
                With over 8 years of dedicated experience in nail artistry,
                Brenda has transformed her passion into an art form. What
                started as a fascination with colors and creativity has evolved
                into a mastery of technique, precision, and luxury service.
              </p>
              <p className="text-luxury-body font-sans text-gray-700 leading-relaxed mb-8">
                Specializing in custom nail art, gel extensions, and luxury
                manicure services, Brenda combines technical expertise with
                creative vision to deliver exceptional results that exceed
                expectations every single time.
              </p>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center group">
                <div className="text-4xl font-serif font-bold text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                  500+
                </div>
                <div className="text-sm text-gray-600 font-sans">
                  Happy Clients
                </div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-serif font-bold text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                  8+
                </div>
                <div className="text-sm text-gray-600 font-sans">
                  Years Experience
                </div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-serif font-bold text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                  100%
                </div>
                <div className="text-sm text-gray-600 font-sans">
                  Satisfaction
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <a href="#contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Book Your Appointment
                </Button>
              </a>
              <Button
                variant="outline"
                size="lg"
                className="border-rose-600 text-rose-600 hover:bg-rose-50 hover:scale-105 transition-all duration-300"
              >
                View Certifications
              </Button>
            </div>
          </div>

          {/* Image - Right side */}
          <div className="lg:col-span-1">
            <div className="relative">
              <div className="aspect-square rounded-3xl shadow-2xl overflow-hidden bg-gray-100">
                <video
                  className="w-full h-full object-cover transition-opacity duration-300"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  poster="/images/brenda-poster.svg"
                >
                  <source src="/videos/brenda-intro.mp4" type="video/mp4" />
                  {/* Fallback */}
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-rose-200 to-pink-300">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">👩‍🎨</div>
                      <div className="text-xl font-semibold">
                        Brenda's Video
                      </div>
                    </div>
                  </div>
                </video>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-400 rounded-full opacity-20" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400 rounded-full opacity-15" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
