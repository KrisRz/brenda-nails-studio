import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

const services = [
  {
    title: 'Classic Manicure',
    description: 'Professional nail care with cuticle treatment and polish application',
    price: 'From $35',
    duration: '45 min',
    image: '💅'
  },
  {
    title: 'Gel Extensions',
    description: 'Long-lasting gel nail extensions with custom shapes and designs',
    price: 'From $65',
    duration: '90 min',
    image: '✨'
  },
  {
    title: 'Nail Art Design',
    description: 'Custom artistic designs, patterns, and decorative elements',
    price: 'From $45',
    duration: '60 min',
    image: '🎨'
  },
  {
    title: 'Pedicure Deluxe',
    description: 'Complete foot care with exfoliation, massage, and polish',
    price: 'From $55',
    duration: '75 min',
    image: '🦶'
  },
  {
    title: 'French Manicure',
    description: 'Timeless elegant French tips with perfect precision',
    price: 'From $40',
    duration: '50 min',
    image: '🤍'
  },
  {
    title: 'Acrylic Nails',
    description: 'Durable acrylic extensions with unlimited design possibilities',
    price: 'From $70',
    duration: '120 min',
    image: '💎'
  }
]

export default function Services() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional nail care and artistic designs crafted with precision and passion
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.image}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-rose-600">
                    {service.price}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {service.duration}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
