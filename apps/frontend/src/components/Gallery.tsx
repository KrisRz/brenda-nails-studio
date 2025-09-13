export default function Gallery() {
  const galleryImages = [
    {
      id: 1,
      category: 'Nail Art',
      description: 'Floral design with gold accents'
    },
    {
      id: 2,
      category: 'French Manicure',
      description: 'Classic white tips with nude base'
    },
    {
      id: 3,
      category: 'Gel Extensions',
      description: 'Long coffin shape with ombre effect'
    },
    {
      id: 4,
      category: 'Acrylic Nails',
      description: 'Stiletto shape with rhinestone details'
    },
    {
      id: 5,
      category: 'Pedicure',
      description: 'Summer bright colors with toe art'
    },
    {
      id: 6,
      category: 'Nail Art',
      description: 'Geometric patterns in pastels'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Work
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our latest nail art creations and professional manicure work
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square bg-gradient-to-br from-pink-100 to-rose-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {/* Placeholder for actual images */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">💅</div>
                  <div className="text-sm font-medium text-gray-700">
                    {image.category}
                  </div>
                </div>
              </div>
              
              {/* Overlay with description */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-sm mb-1">{image.category}</h3>
                  <p className="text-xs opacity-90">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300">
            View Full Gallery
          </button>
        </div>
      </div>
    </section>
  )
}
