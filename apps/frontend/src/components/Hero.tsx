import { Button } from './ui/button'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100 pt-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Brenda Nails Studio
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Professional nail art and beauty services crafted with passion and precision
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
            Book Appointment
          </Button>
          <Button variant="outline" size="lg">
            View Gallery
          </Button>
        </div>
      </div>
    </section>
  )
}
