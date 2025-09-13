export default function Gallery() {
  const galleryImages = [
    {
      id: 1,
      category: 'Nail Art',
      description: 'Floral design with gold accents',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=500&fit=crop&crop=center'
    },
    {
      id: 2,
      category: 'French Manicure',
      description: 'Classic white tips with nude base',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=500&fit=crop&crop=center'
    },
    {
      id: 3,
      category: 'Gel Extensions',
      description: 'Long coffin shape with ombre effect',
      image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=500&fit=crop&crop=center'
    },
    {
      id: 4,
      category: 'Acrylic Nails',
      description: 'Stiletto shape with rhinestone details',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=500&fit=crop&crop=center'
    },
    {
      id: 5,
      category: 'Pedicure',
      description: 'Summer bright colors with toe art',
      image: 'https://images.unsplash.com/photo-1562887284-5c6c2c4e3c4c?w=400&h=500&fit=crop&crop=center'
    },
    {
      id: 6,
      category: 'Nail Art',
      description: 'Geometric patterns in pastels',
      image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=500&fit=crop&crop=center'
    },
    {
      id: 7,
      category: 'Chrome Nails',
      description: 'Mirror finish chrome effect',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop&crop=center'
    },
    {
      id: 8,
      category: 'Marble Nails',
      description: 'Elegant marble pattern design',
      image: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=500&fit=crop&crop=center'
    },
    {
      id: 9,
      category: 'Glitter Nails',
      description: 'Sparkling glitter gradient',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&crop=center'
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {/* Actual image */}
              <img
                src={image.image}
                alt={`${image.category} - ${image.description}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjQ4Ij7wn5KFPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZiNzI4MCIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNiI+TmFpbCBBcnQ8L3RleHQ+Cjwvc3ZnPgo=';
                }}
              />
              
              {/* Overlay with description */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-sm mb-1">{image.category}</h3>
                  <p className="text-xs opacity-90">{image.description}</p>
                </div>
              </div>
              
              {/* Category badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-medium text-gray-800">{image.category}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            type="button"
            className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 hover:scale-105 transition-transform"
          >
            View Full Gallery
          </button>
        </div>
      </div>
    </section>
  )
}
