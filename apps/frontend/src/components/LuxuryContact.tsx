import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { soundSystem } from '../utils/soundSystem'
import EnhancedSuccessState from './ui/EnhancedSuccessState'
import FloatingInput from './ui/FloatingInput'
import RippleButton from './ui/RippleButton'
import SuccessToast from './ui/SuccessToast'

export default function LuxuryContact() {
  const [formStep, setFormStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showEnhancedSuccess, setShowEnhancedSuccess] = useState(false)
  const [dynamicServices, setDynamicServices] = useState<any[]>([])
  const stepRef = useRef<HTMLDivElement>(null)

  const totalSteps = 4

  // Initialize with hardcoded services, then fetch from CMS API
  useEffect(() => {
    // Set initial hardcoded services
    setDynamicServices(services)

    const fetchServices = async () => {
      try {
        const response = await fetch(
          'https://ivn5ztultd.execute-api.eu-west-2.amazonaws.com/cms-data?type=services'
        )
        if (response.ok) {
          const cmsServices = await response.json()

          // Transform API services to booking form format
          const transformedServices = cmsServices.map((service: any) => ({
            name: service.name,
            price: `From £${service.price}`,
            duration: `${service.duration} min`,
            emoji: '💅', // Default emoji
            description: service.description,
          }))

          setDynamicServices(transformedServices)
        }
      } catch (error) {
        console.error('Failed to fetch services for booking form:', error)
        // Keep default hardcoded services
      }
    }

    fetchServices()
  }, [])

  const steps = [
    {
      id: 1,
      title: 'Begin Your Luxury Journey',
      subtitle: 'Tell us about your vision for perfect nails',
      icon: '',
    },
    {
      id: 2,
      title: 'Choose your service',
      subtitle: 'Select your perfect treatment',
      icon: '',
    },
    {
      id: 3,
      title: 'Pick your time',
      subtitle: 'When would you like to visit?',
      icon: '📅',
    },
    {
      id: 4,
      title: 'Final details',
      subtitle: 'Complete your booking',
      icon: '📋',
    },
  ]

  const services = [
    {
      name: 'Gel Manicure',
      price: 'From £30',
      duration: '70 min',
      emoji: '💅',
      description:
        'Professional gel manicure with long-lasting shine and durability',
    },
    {
      name: 'Gel Acrylic Nails',
      price: 'From £45',
      duration: '120 min',
      emoji: '✨',
      description:
        'Extension on form with gel acrylic for strength and custom shapes',
    },
    {
      name: 'Gel Manicure Infill (up to 3 weeks)',
      price: 'From £30',
      duration: '60 min',
      emoji: '🔄',
      description: 'Maintenance and refresh for your existing gel manicure',
    },
    {
      name: 'French Manicure',
      price: 'From £30',
      duration: '50 min',
      emoji: '🤍',
      description: 'Timeless elegant French tips with perfect precision',
    },
    {
      name: 'Gel Manicure Infill (over 3 weeks)',
      price: 'From £35',
      duration: '90 min',
      emoji: '🔧',
      description: 'Extended maintenance for gel manicures requiring more work',
    },
    {
      name: 'Cartoon Art (per nail)',
      price: 'From £5',
      duration: '20 min',
      emoji: '🎨',
      description:
        'Custom cartoon designs and artistic elements on individual nails',
    },
    {
      name: 'Removal only',
      price: 'From £10',
      duration: '30 min',
      emoji: '🧽',
      description: 'Professional nail polish or gel removal service',
    },
    {
      name: 'Nail repair (per nail)',
      price: 'From £5',
      duration: '15 min',
      emoji: '🔨',
      description: 'Professional repair for damaged or broken nails',
    },
  ]

  // Step animation
  useEffect(() => {
    if (stepRef.current) {
      gsap.fromTo(
        stepRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [formStep])

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      soundSystem.play('form-step')
      setFormStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setFormStep((prev) => Math.max(prev - 1, 1))
  }

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {}

    switch (formStep) {
      case 1:
        if (!formData.firstName.trim())
          newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim())
          newErrors.lastName = 'Last name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = 'Invalid email format'
        break
      case 2:
        if (!formData.service) newErrors.service = 'Please select a service'
        break
      case 3:
        if (!formData.date) {
          newErrors.date = 'Please select a date'
        } else {
          // Validate date is not in the past
          const selectedDate = new Date(formData.date)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          if (selectedDate < today) {
            newErrors.date = 'Please select a future date'
          }
          // Validate date is not more than 3 months in advance
          const threeMonthsFromNow = new Date()
          threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
          if (selectedDate > threeMonthsFromNow) {
            newErrors.date = 'Bookings available up to 3 months in advance'
          }
        }
        if (!formData.time) {
          newErrors.time = 'Please select a time'
        } else {
          // Basic business hours validation (9 AM to 6 PM)
          const [hours] = formData.time.split(':').map(Number)
          if (hours < 9 || hours >= 18) {
            newErrors.time = 'Please select a time between 9:00 AM and 6:00 PM'
          }
        }
        break
      case 4:
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formStep < totalSteps) {
      nextStep()
      return
    }

    if (!validateCurrentStep()) return

    setIsSubmitting(true)

    try {
      // API call to contact endpoint for SMS notifications
      const response = await fetch(
        'https://ivn5ztultd.execute-api.eu-west-2.amazonaws.com/contact',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            subject: `Contact Request: ${formData.service}`,
            message: `Phone: ${formData.phone}
Service: ${formData.service}
Date: ${formData.date}
Time: ${formData.time}

${formData.message || `Contact request for ${formData.service}`}`,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to submit contact form')
      }

      const result = await response.json()

      setIsSubmitting(false)
      soundSystem.play('form-success')
      setShowEnhancedSuccess(true)

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        time: '',
        message: '',
      })
      setFormStep(1)
    } catch (error) {
      console.error('Contact form submission error:', error)
      setIsSubmitting(false)
      // Show error message to user
      setErrors({ submit: 'Failed to submit contact form. Please try again.' })
    }
  }

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #fdf2f8, #ffffff, #fef7ff, #fff0f5)',
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-pink-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-300 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Luxury Header */}
        <div className="text-center mb-16">
          <h2 className="text-luxury-hero text-gray-900 mb-6 luxury-heading tracking-tight-luxury">
            Book Your Dream Nails
          </h2>
          <p className="text-luxury-subtitle text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Experience our luxury step-by-step booking journey. We'll guide you
            through creating your perfect nail appointment.
          </p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${
                      formStep >= step.id
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {formStep > step.id ? '✓' : step.icon}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                      formStep >= step.id ? 'text-rose-600' : 'text-gray-400'
                    }`}
                  >
                    Step {step.id}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-pink-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(formStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/60 shadow-2xl">
            {/* Step Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{steps[formStep - 1].icon}</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 luxury-heading">
                {steps[formStep - 1].title}
              </h3>
              <p className="text-gray-600 text-lg">
                {steps[formStep - 1].subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step Content */}
              <div ref={stepRef} className="min-h-[300px]">
                {/* Step 1: Personal Info */}
                {formStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FloatingInput
                        label="First Name"
                        value={formData.firstName}
                        onChange={(value) => updateField('firstName', value)}
                        required
                        error={errors.firstName}
                        icon="👤"
                      />
                      <FloatingInput
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(value) => updateField('lastName', value)}
                        required
                        error={errors.lastName}
                        icon="👤"
                      />
                    </div>
                    <FloatingInput
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(value) => updateField('email', value)}
                      required
                      error={errors.email}
                      icon="📧"
                    />
                  </div>
                )}

                {/* Step 2: Service Selection */}
                {formStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dynamicServices.map((service, index) => (
                        <div
                          key={index}
                          onClick={() => updateField('service', service.name)}
                          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 interactive-card ${
                            formData.service === service.name
                              ? 'border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg transform scale-105'
                              : 'border-gray-200 bg-white/80 hover:border-rose-300 hover:shadow-md'
                          }`}
                        >
                          <div className="text-4xl mb-3">{service.emoji}</div>
                          <h4 className="font-bold text-gray-900 mb-2 luxury-heading">
                            {service.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {service.description}
                          </p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-rose-600 text-lg">
                              {service.price}
                            </span>
                            <span className="text-gray-500">
                              {service.duration}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.service && (
                      <p className="text-red-500 text-sm text-center animate-shake">
                        {errors.service}
                      </p>
                    )}
                  </div>
                )}

                {/* Step 3: Date & Time */}
                {formStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FloatingInput
                        label="Preferred Date"
                        type="date"
                        value={formData.date}
                        min={new Date().toISOString().split('T')[0]}
                        max={
                          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split('T')[0]
                        }
                        onChange={(value) => updateField('date', value)}
                        required
                        error={errors.date}
                        icon="📅"
                      />
                      <FloatingInput
                        label="Preferred Time"
                        type="time"
                        value={formData.time}
                        min="09:00"
                        max="18:00"
                        onChange={(value) => updateField('time', value)}
                        required
                        error={errors.time}
                        icon="⏰"
                      />
                    </div>

                    {/* Quick Time Selection */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-4 text-center">
                        Or choose from popular time slots:
                      </p>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {[
                          '09:00',
                          '10:30',
                          '12:00',
                          '13:30',
                          '15:00',
                          '16:30',
                        ].map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => updateField('time', time)}
                            className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 hover-lift ${
                              formData.time === time
                                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg transform scale-105'
                                : 'bg-white/80 text-gray-700 hover:bg-rose-50 hover:text-rose-600 hover:shadow-md'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Final Details */}
                {formStep === 4 && (
                  <div className="space-y-6">
                    <FloatingInput
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(value) => updateField('phone', value)}
                      required
                      error={errors.phone}
                      icon="📱"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Special requests or design ideas?
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => updateField('message', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl focus:ring-4 focus:ring-pink-400/20 focus:border-rose-500 transition-all duration-300 hover:shadow-md resize-none"
                        placeholder="Tell us about your dream nails... Any colors, patterns, or special designs you have in mind? 🎨"
                      />
                    </div>

                    {/* Booking Summary */}
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
                      <h4 className="font-bold text-gray-900 mb-4 text-center luxury-heading">
                        Booking Summary
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Client:</span>
                          <span className="font-medium">
                            {formData.firstName} {formData.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Service:</span>
                          <span className="font-medium text-rose-600">
                            {formData.service || 'Not selected'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Date & Time:</span>
                          <span className="font-medium">
                            {formData.date} at {formData.time}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Contact:</span>
                          <span className="font-medium">{formData.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Navigation */}
              <div className="pt-8 mt-8 border-t border-gray-200">
                {/* Step indicator - always visible on mobile */}
                <div className="text-center mb-6">
                  <span className="text-sm text-gray-500">
                    Step {formStep} of {totalSteps}
                  </span>
                </div>

                {/* Buttons layout - responsive */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={formStep === 1}
                    className={`order-2 sm:order-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      formStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 shadow-md hover-lift'
                    }`}
                  >
                    ← Previous
                  </button>

                  <div className="order-1 sm:order-2">
                    {formStep < totalSteps ? (
                      <RippleButton
                        variant="primary"
                        size="lg"
                        className="shadow-lg hover-glow w-full sm:w-auto"
                      >
                        Next Step →
                      </RippleButton>
                    ) : (
                      <RippleButton
                        loading={isSubmitting}
                        variant="primary"
                        size="lg"
                        className="shadow-xl animate-pulse-glow w-full sm:w-auto"
                      >
                        {isSubmitting ? 'Booking...' : 'Complete Booking'}
                      </RippleButton>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Enhanced Success State */}
      <EnhancedSuccessState
        isVisible={showEnhancedSuccess}
        onComplete={() => {
          setShowEnhancedSuccess(false)
          // Redirect to home page after successful booking
          window.location.href = '/'
        }}
        type="booking"
      />

      {/* Success Toast */}
      <SuccessToast
        message="🎉 Appointment booked successfully! We'll contact you soon."
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />
    </section>
  )
}
