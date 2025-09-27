import { FaFacebookF, FaInstagram } from 'react-icons/fa'
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
          <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
            {/* Brand Header */}
            <div>
              <div className="flex items-center mb-4 justify-center lg:justify-start">
                <span className="text-3xl  font-bold text-gray-900 luxury-heading">
                  Brenda Nails Studio
                </span>
              </div>
              <p className="text-lg  italic text-gray-700 mb-6 max-w-md leading-relaxed">
                "Where artistry meets excellence"
              </p>
              <p className="text-gray-600  leading-relaxed max-w-lg">
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
              <h4 className=" font-bold text-gray-900 mb-4 flex items-center">
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
          <div className="lg:col-span-2 space-y-8 text-center lg:text-left">
            {/* Services */}
            <div>
              <h3 className="text-xl  font-bold mb-6 text-gray-900 luxury-heading">
                Our Services
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#services"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide "
                  >
                    Gel Manicure
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide "
                  >
                    Gel Acrylic Nails
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide "
                  >
                    French Manicure
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide "
                  >
                    Cartoon Art
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-rose-600 hover:text-rose-700 font-medium transition-all duration-300 hover-text-slide "
                  >
                    Book Appointment →
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg  font-bold mb-4 text-gray-900">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide  text-sm"
                  >
                    About Brenda
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide  text-sm"
                  >
                    Portfolio Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide  text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-of-service"
                    className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover-text-slide  text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact & Social - 30% Width */}
          <div className="lg:col-span-3 space-y-8 text-center lg:text-left">
            {/* Contact Info */}
            <div>
              <h3 className="text-xl  font-bold mb-6 text-gray-900 luxury-heading">
                Get In Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-start hover:scale-105 transition-all duration-300 interactive-card justify-center lg:justify-start">
                  <span className="mr-3 mt-1 text-pink-500 text-xl">📍</span>
                  <div>
                    <div className="font-medium text-gray-900 ">
                      Studio Location
                    </div>
                    <div className="text-sm text-gray-600 ">
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

                <div className="flex items-center hover:scale-105 transition-all duration-300 interactive-card justify-center lg:justify-start">
                  <span className="mr-3 text-pink-500 text-xl">📞</span>
                  <div>
                    <div className="font-medium text-gray-900 ">Call Us</div>
                    <a
                      href="tel:07511201840"
                      className="text-sm text-gray-600 hover:text-rose-600 transition-colors "
                    >
                      07511201840
                    </a>
                  </div>
                </div>

                <div className="flex items-center hover:scale-105 transition-all duration-300 interactive-card justify-center lg:justify-start">
                  <span className="mr-3 text-pink-500 text-xl">✉️</span>
                  <div>
                    <div className="font-medium text-gray-900 ">Email Us</div>
                    <a
                      href="mailto:beniahaker@interia.eu"
                      className="text-sm text-gray-600 hover:text-rose-600 transition-colors "
                    >
                      beniahaker@interia.eu
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg  font-bold mb-4 text-gray-900">
                Follow Our Work
              </h4>
              <div className="flex gap-3 justify-center lg:justify-start">
                <a
                  href="https://www.instagram.com/brenda_nails_uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover-glow"
                  title="Instagram - Daily nail art"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/brendanailsmobile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover-glow"
                  title="Facebook - Client reviews"
                >
                  <FaFacebookF className="w-5 h-5" />
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-3 ">
                @brenda_nails_uk • Daily nail art inspiration & tutorials
              </p>
            </div>
          </div>
        </div>

        {/* Professional Bottom Section */}
        <div className="border-t border-white/30 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-600 text-sm ">
                © 2025 Brenda Nails Studio. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-2 ">
                Licensed Professional Nail Technician • Fully Insured Studio
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex space-x-4 text-xs">
                <a
                  href="/privacy-policy"
                  className="text-gray-500 hover:text-rose-600 transition-colors hover-text-slide "
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-of-service"
                  className="text-gray-500 hover:text-rose-600 transition-colors hover-text-slide "
                >
                  Terms of Service
                </a>
              </div>
              <div className="text-center">
                <p className="text-rose-600 text-xs font-medium ">
                  Book your dream nails today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
