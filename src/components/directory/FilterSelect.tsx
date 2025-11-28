import React from 'react'

interface FilterSelectProps {
  id: string
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  className?: string
}

export function FilterSelect({ id, label, value, options, onChange, className }: FilterSelectProps) {
  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
      </label>
      <select
        id={id}
        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm ${className || ''}`}
        value={value}
        onChange={onChange}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
