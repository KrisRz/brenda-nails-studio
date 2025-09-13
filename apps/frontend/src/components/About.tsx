import { Button } from './ui/button'

export default function About() {
  return (
    <section className="py-20 bg-gradient-to-r from-rose-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Meet Brenda
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                With over 8 years of experience in nail artistry, Brenda combines 
                technical expertise with creative vision to deliver exceptional results. 
                Specializing in custom nail art, gel extensions, and luxury manicure services.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Every client receives personalized attention in our modern, 
                hygiene-focused studio environment. We use only premium products 
                and the latest techniques to ensure your nails look stunning and stay healthy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-rose-600 mb-2">500+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-rose-600 mb-2">8+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                Book Consultation
              </Button>
              <Button variant="outline" size="lg" className="border-rose-600 text-rose-600 hover:bg-rose-50">
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
                  <a href="/videos/brenda-intro.mp4" className="text-rose-600 underline">
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
                  <div className="text-sm opacity-90">Professional Portrait</div>
                </div>
              </div>
              
              {/* Loading indicator */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 opacity-0 transition-opacity duration-300" id="video-loading">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
              </div>
              
              {/* Custom play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-rose-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              
              {/* Video info overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium">Meet Brenda</p>
                <p className="text-gray-200 text-xs">Professional Nail Artist</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-400 rounded-full opacity-20" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400 rounded-full opacity-15" />
          </div>
        </div>
      </div>
    </section>
  )
}
