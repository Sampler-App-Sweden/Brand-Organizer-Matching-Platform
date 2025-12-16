import React from 'react'

interface SponsorshipTypeCardProps {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  selected: boolean
  onToggle: (id: string) => void
  titleAccessory?: React.ReactNode
}

export function SponsorshipTypeCard({
  id,
  title,
  description,
  icon: Icon,
  selected,
  onToggle,
  titleAccessory
}: SponsorshipTypeCardProps) {
  return (
    <div
      className={`relative rounded-lg p-5 cursor-pointer transition-all duration-300 ${
        selected
          ? 'bg-indigo-50 border-2 border-indigo-300 shadow-sm'
          : 'bg-white border border-gray-200 hover:border-indigo-200'
      }`}
      onClick={() => onToggle(id)}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle(id)
        }
      }}
    >
      <div className='flex items-start'>
        <div
          className={`p-3 rounded-full ${
            selected
              ? 'bg-indigo-100 text-indigo-600'
              : 'bg-gray-100 text-gray-500'
          } mr-4`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className='font-medium text-gray-900 mb-1 flex items-center gap-2'>
            {title}
            {titleAccessory && (
              <span className='inline-flex'>{titleAccessory}</span>
            )}
          </h3>
          <p className='text-sm text-gray-500'>{description}</p>
        </div>
      </div>
      <div className='absolute bottom-3 right-3 text-blue-200 opacity-30'>
        <span aria-hidden='true'>
          {/* Decorative key icon replacement with simple symbol to keep footprint light */}
          ✦
        </span>
      </div>
    </div>
  )
}
