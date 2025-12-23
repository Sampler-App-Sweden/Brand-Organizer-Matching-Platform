import type { ReactNode } from 'react'

interface TechCardProps {
  title: string
  description?: string
  icon?: ReactNode
  footer?: ReactNode
  className?: string
  onClick?: () => void
}
export function TechCard({
  title,
  description,
  icon,
  footer,
  className = '',
  onClick
}: TechCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-indigo-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group relative p-8 flex flex-col items-start ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
      style={{ minHeight: 160 }}
    >
      {/* Glow ring */}
      <div className='absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-indigo-400/40 to-purple-300/30 rounded-full blur-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-500' />
      {/* Icon with gradient ring - top left */}
      {icon && (
        <div className='relative mb-5' style={{ alignSelf: 'flex-start' }}>
          <span className='inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg ring-4 ring-indigo-200/40 group-hover:scale-110 transition-transform duration-300'>
            <span className='text-white text-3xl'>{icon}</span>
          </span>
        </div>
      )}
      <h3 className='text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors duration-300 text-left'>
        {title}
      </h3>
      {description && (
        <p className='text-gray-600 text-base group-hover:text-gray-800 transition-colors duration-300 text-left'>
          {description}
        </p>
      )}
      {footer && (
        <div className='border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-lg relative z-10 group-hover:bg-gray-100 transition-colors w-full'>
          {footer}
        </div>
      )}
      {/* Bottom border animation */}
      <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-indigo-600 group-hover:w-full transition-all duration-300'></div>
    </div>
  )
}
