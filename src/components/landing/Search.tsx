import { SearchIcon, SparklesIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Search = () => {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      // Navigate to AI onboarding with the search query
      navigate(`/onboarding?q=${encodeURIComponent(searchInput)}`)
    }
  }

  return (
    <div className='bg-gray-50 py-12'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
            Tell us what you're looking to achieve
          </h2>
          <form onSubmit={handleSearchSubmit} className='relative'>
            <div className='flex flex-col sm:flex-row'>
              <div className='relative flex-grow mb-3 sm:mb-0'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <SparklesIcon className='h-5 w-5 text-brand-primary' />
                </div>
                <input
                  type='text'
                  className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:to-brand-primary text-gray-900 placeholder-gray-500'
                  style={{ textIndent: '1.5rem' }}
                  placeholder='I want to launch my new drink at events...'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <button
                type='submit'
                className='bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-lg sm:rounded-l-none font-medium transition-colors flex items-center justify-center'
              >
                <SearchIcon className='h-5 w-5 mr-1' />
                Search
              </button>
            </div>
            <p className='text-sm text-gray-500 mt-2'>
              Try: "I need sponsors for my tech conference" or "Looking for food
              festivals to showcase our products"
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
