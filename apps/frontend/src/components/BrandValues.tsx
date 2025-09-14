const values = [
  {
    icon: '✨',
    title: 'Artistry',
    description:
      'Every nail tells a unique story, crafted with passion and precision',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: '💎',
    title: 'Quality',
    description:
      'Premium products and techniques for exceptional, long-lasting results',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    icon: '🌟',
    title: 'Experience',
    description:
      'Luxury service from consultation to final reveal - pure indulgence',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: '💝',
    title: 'Care',
    description:
      'Your comfort and satisfaction are at the heart of everything we do',
    gradient: 'from-pink-500 to-rose-600',
  },
]

export default function BrandValues() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-pink-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-luxury-title font-serif text-gray-900 mb-6 luxury-heading tracking-tight-luxury">
            Our Values
          </h2>
          <p className="text-luxury-subtitle font-sans text-gray-600 max-w-2xl mx-auto">
            The principles that guide every service, every detail, every moment
            at Brenda Nails Studio
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl interactive-card hover-glow hover-lift"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {value.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 luxury-heading group-hover:text-rose-600 transition-colors duration-300 text-reveal">
                <span>{value.title}</span>
              </h3>
              <p className="text-gray-600 font-sans leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {value.description}
              </p>

              {/* Hover Accent */}
              <div
                className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${value.gradient} rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
