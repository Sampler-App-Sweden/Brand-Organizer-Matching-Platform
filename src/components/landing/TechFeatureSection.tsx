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
    <section className='relative py-20 bg-gradient-to-br from-white via-indigo-50 to-blue-100 overflow-hidden'>
      {/* Modern glassy blobs */}
      <div className='absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-300/20 rounded-full blur-3xl animate-float1' />
      <div className='absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-indigo-400/30 to-purple-300/20 rounded-full blur-3xl animate-float2' />
      <div className='absolute inset-0 pointer-events-none z-0'>
        <div className='w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent opacity-60' />
      </div>
      <div className='container mx-auto px-4 relative z-10'>
        <div className='text-center mb-14'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight relative inline-block'>
            <span className='relative z-10'>{title}</span>
            <span className='absolute -z-10 w-full h-3 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bottom-1 left-0 rounded-lg blur-sm opacity-80' />
          </h2>
          {subtitle && (
            <p className='text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto font-medium'>
              {subtitle}
            </p>
          )}
        </div>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-10'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='relative group rounded-2xl p-8 bg-white/70 backdrop-blur-md border border-indigo-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden'
              style={{
                minHeight: 160,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              {/* Glow ring */}
              <div className='absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-indigo-400/40 to-purple-300/30 rounded-full blur-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-500' />
              {/* Icon with gradient ring - top left */}
              <div
                className='relative mb-5'
                style={{ alignSelf: 'flex-start' }}
              >
                <span className='inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg ring-4 ring-indigo-200/40 group-hover:scale-110 transition-transform duration-300'>
                  <span className='text-white text-3xl'>{feature.icon}</span>
                </span>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors duration-300 text-left'>
                {feature.title}
              </h3>
              <p className='text-gray-600 text-base group-hover:text-gray-800 transition-colors duration-300 text-left'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Animations for floating blobs */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(20px) scale(1.07); }
        }
        .animate-float1 { animation: float1 8s ease-in-out infinite; }
        .animate-float2 { animation: float2 10s ease-in-out infinite; }
      `}</style>
    </section>
  )
}
