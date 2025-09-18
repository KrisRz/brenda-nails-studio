interface SkeletonCardProps {
  variant?: 'service' | 'gallery' | 'testimonial'
  className?: string
}

export default function SkeletonCard({
  variant = 'service',
  className = '',
}: SkeletonCardProps) {
  const getSkeletonLayout = () => {
    switch (variant) {
      case 'service':
        return (
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-white/50">
            {/* Image skeleton */}
            <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl mb-4 skeleton" />

            {/* Title skeleton */}
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full mb-3 skeleton" />

            {/* Description skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full skeleton" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-3/4 skeleton" />
            </div>

            {/* Price skeleton */}
            <div className="flex justify-between items-center">
              <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full skeleton" />
              <div className="h-4 w-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full skeleton" />
            </div>
          </div>
        )

      case 'gallery':
        return (
          <div className="aspect-square bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-2xl skeleton" />
        )

      case 'testimonial':
        return (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60">
            {/* Quote skeleton */}
            <div className="space-y-3 mb-6">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full skeleton" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full skeleton" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-2/3 skeleton" />
            </div>

            {/* Client info skeleton */}
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full skeleton" />
              <div>
                <div className="h-5 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full mb-2 skeleton" />
                <div className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full skeleton" />
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4">
            <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl skeleton" />
          </div>
        )
    }
  }

  return (
    <div className={`animate-pulse ${className}`}>{getSkeletonLayout()}</div>
  )
}
