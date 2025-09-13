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

          {/* Image placeholder */}
          <div className="relative">
            <div className="aspect-[4/5] bg-gradient-to-br from-rose-200 to-pink-300 rounded-3xl shadow-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">👩‍🎨</div>
                <div className="text-xl font-semibold">Brenda's Photo</div>
                <div className="text-sm opacity-90">Professional Portrait</div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400 rounded-full opacity-15"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
