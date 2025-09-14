import RippleButton from './ui/RippleButton'

export default function Footer() {
  return (
    <footer
      className="relative py-20 text-gray-800 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #f9fafb 100%)',
      }}
    >
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-rose-400 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Award-winning Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
          {/* Enhanced Brand Section - 50% Width */}
          <div className="lg:col-span-5 space-y-8">
            {/* Brand Header */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">💅</span>
                <span className="text-3xl font-serif font-bold text-gray-900 luxury-heading">
                  Brenda Nails Studio
                </span>
              </div>
              <p className="text-lg font-serif italic text-gray-700 mb-6 max-w-md leading-relaxed">
                "Where artistry meets excellence"
              </p>
              <p className="text-gray-600 font-sans leading-relaxed max-w-lg">
                Professional nail artistry in Midsomer Norton. Licensed,
                certified, and award-winning studio offering luxury nail care
                with uncompromising attention to detail.
              </p>
            </div>

            {/* Enhanced Trust Signals */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center bg-white/40 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/50 hover:scale-105 transition-all duration-300">
                <span className="text-amber-500 mr-3 text-xl">⭐</span>
                <div>
                  <div className="font-bold text-gray-900">500+</div>
                  <div className="text-xs text-gray-600">Happy Clients</div>
                </div>
              </div>
              <div className="flex items-center bg-white/40 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/50 hover:scale-105 transition-all duration-300">
                <span className="text-purple-500 mr-3 text-xl">💎</span>
                <div>
                  <div className="font-bold text-gray-900">8+</div>
                  <div className="text-xs text-gray-600">Years Experience</div>
                </div>
              </div>
              <div className="flex items-center bg-white/40 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/50 hover:scale-105 transition-all duration-300">
                <span className="text-green-500 mr-3 text-xl">🏆</span>
                <div>
                  <div className="font-bold text-gray-900">Award</div>
                  <div className="text-xs text-gray-600">Winning Studio</div>
                </div>
              </div>
              <div className="flex items-center bg-white/40 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/50 hover:scale-105 transition-all duration-300">
                <span className="text-blue-500 mr-3 text-xl">🔒</span>
                <div>
                  <div className="font-bold text-gray-900">Licensed</div>
                  <div className="text-xs text-gray-600">& Insured</div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <h4 className="font-serif font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🕒</span>
                Studio Hours
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium text-gray-900">
                    10:00 - 17:00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium text-purple-600">
                    By appointment
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-purple-600">
                    By appointment
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Services & Navigation - 25% Width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            <div>
              <h3 className="text-xl font-serif font-bold mb-6 text-gray-900 luxury-heading">
                Our Services
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#services"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide font-sans"
                  >
                    Classic Manicure
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide font-sans"
                  >
                    Gel Extensions
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide font-sans"
                  >
                    Nail Art Design
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide font-sans"
                  >
                    Bridal Services
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-rose-600 hover:text-rose-700 font-medium transition-all duration-300 hover-text-slide font-sans"
                  >
                    Book Appointment →
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-serif font-bold mb-4 text-gray-900">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide font-sans text-sm"
                  >
                    About Brenda
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide font-sans text-sm"
                  >
                    Portfolio Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide font-sans text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide font-sans text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact & Social - 30% Width */}
          <div className="lg:col-span-3 space-y-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-serif font-bold mb-6 text-gray-900 luxury-heading">
                Get In Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-start hover:scale-105 transition-all duration-300 interactive-card">
                  <span className="mr-3 mt-1 text-pink-500 text-xl">📍</span>
                  <div>
                    <div className="font-medium text-gray-900 font-sans">
                      Studio Location
                    </div>
                    <div className="text-sm text-gray-600 font-sans">
                      11 bevington close
                      <br />
                      Midsomer Norton
                      <br />
                      Ba3 2fd Radstock
                    </div>
                    <a
                      href="https://maps.google.com/?q=11+bevington+close+Midsomer+Norton+Ba3+2fd+Radstock"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium mt-1 inline-block hover-text-slide"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>

                <div className="flex items-center hover:scale-105 transition-all duration-300 interactive-card">
                  <span className="mr-3 text-pink-500 text-xl">📞</span>
                  <div>
                    <div className="font-medium text-gray-900 font-sans">
                      Call Us
                    </div>
                    <a
                      href="tel:075111201840"
                      className="text-sm text-gray-600 hover:text-rose-600 transition-colors font-sans"
                    >
                      075111201840
                    </a>
                  </div>
                </div>

                <div className="flex items-center hover:scale-105 transition-all duration-300 interactive-card">
                  <span className="mr-3 text-pink-500 text-xl">✉️</span>
                  <div>
                    <div className="font-medium text-gray-900 font-sans">
                      Email Us
                    </div>
                    <a
                      href="mailto:beniahaker@interia.eu"
                      className="text-sm text-gray-600 hover:text-rose-600 transition-colors font-sans"
                    >
                      beniahaker@interia.eu
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-serif font-bold mb-4 text-gray-900">
                Nail Art Inspiration
              </h4>
              <p className="text-gray-600 text-sm mb-4 font-sans">
                Get exclusive nail art tips, seasonal trends & special offers
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 placeholder-gray-500 text-gray-800 font-sans"
                />
                <RippleButton variant="primary" size="sm" className="shadow-lg">
                  Join
                </RippleButton>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-serif font-bold mb-4 text-gray-900">
                Follow Our Work
              </h4>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/brendanails"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover-glow"
                  title="Instagram - Daily nail art"
                >
                  📸
                </a>
                <a
                  href="https://facebook.com/brendanails"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover-glow"
                  title="Facebook - Client reviews"
                >
                  👍
                </a>
                <a
                  href="https://tiktok.com/@brendanails"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover-glow"
                  title="TikTok - Nail tutorials"
                >
                  🎬
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-3 font-sans">
                @brendanails • Daily nail art inspiration & tutorials
              </p>
            </div>
          </div>
        </div>

        {/* Professional Bottom Section */}
        <div className="border-t border-white/30 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-600 text-sm font-sans">
                © 2025 Brenda Nails Studio. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-2 font-sans">
                Licensed Professional Nail Technician • Fully Insured Studio
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex space-x-4 text-xs">
                <a
                  href="#"
                  className="text-gray-500 hover:text-rose-600 transition-colors hover-text-slide font-sans"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-rose-600 transition-colors hover-text-slide font-sans"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-rose-600 transition-colors hover-text-slide font-sans"
                >
                  Cookie Policy
                </a>
              </div>
              <div className="text-center">
                <p className="text-rose-600 text-xs font-medium font-sans">
                  Book your dream nails today ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
