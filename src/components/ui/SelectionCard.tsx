import React from 'react'
interface SelectionCardProps {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  isSelected: boolean
  onClick: () => void
  className?: string
}
export function SelectionCard({
  id,
  label,
  description,
  icon,
  isSelected,
  onClick,
  className = ''
}: SelectionCardProps) {
  return (
    <div
      className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-200 hover:border-indigo-300'
      } ${className}`}
      onClick={onClick}
    >
      <div className='absolute top-3 right-3'>
        <div
          className={`h-5 w-5 rounded-full border ${
            isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
          } flex items-center justify-center`}
        >
          {isSelected && <div className='h-2 w-2 bg-white rounded-full'></div>}
        </div>
      </div>
      <div className='flex items-start'>
        {icon && (
          <div
            className={`p-3 rounded-full mr-3 ${
              isSelected
                ? 'bg-indigo-100 text-indigo-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {icon}
          </div>
        )}
        <div>
          <h3 className='font-medium text-gray-900'>{label}</h3>
          {description && (
            <p className='text-sm text-gray-500'>{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
