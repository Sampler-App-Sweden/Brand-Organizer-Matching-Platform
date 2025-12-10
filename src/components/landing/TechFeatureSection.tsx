import { ReactNode } from 'react'
interface Feature {
  icon: ReactNode
  title: string
  description: string
}
interface TechFeatureSectionProps {
  title: string
  subtitle?: string
  features: Feature[]
}
export function TechFeatureSection({
  title,
  subtitle,
  features
}: TechFeatureSectionProps) {
  return (
    <div className='bg-white py-16 relative overflow-hidden'>
      {/* Tech background elements */}
      <div className='absolute inset-0 tech-grid opacity-10'></div>
      <div className='absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-70 blur-3xl'></div>
      <div className='absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full -ml-32 -mb-32 opacity-70 blur-3xl'></div>
      <div className='container mx-auto px-4 relative z-10'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4 relative inline-block'>
            {title}
            <div className='absolute -z-10 w-full h-2 bg-blue-100 bottom-1 left-0 transform -rotate-1'></div>
          </h2>
          {subtitle && (
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              {subtitle}
            </p>
          )}
        </div>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 relative group'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg'></div>
              <div className='bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-brand-secondary relative z-10 group-hover:scale-110 transition-transform overflow-hidden'>
                <div className='relative z-10'>{feature.icon}</div>
                <div className='absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity'></div>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2 relative z-10 group-hover:text-indigo-700 transition-colors'>
                {feature.title}
              </h3>
              <p className='text-gray-600 relative z-10 group-hover:text-gray-700 transition-colors'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
