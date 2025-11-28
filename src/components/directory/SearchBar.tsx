import React from 'react'
import { SearchIcon } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className='mb-4'>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <SearchIcon className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type='text'
          placeholder='Search...'
          className='pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm'
          value={value}
          onChange={onChange}
        />
      </div>
    </form>
  )
}
