import { MegaphoneIcon } from 'lucide-react'


export function MediaSponsorshipInput() {
  return (
    <div className='bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 relative'>
      <div className='absolute -top-3 -left-3 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center'>
        <MegaphoneIcon className='h-3 w-3 text-brand-secondary' />
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-4'>
        Media & Promotion Request
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Preferred Channels
          </label>
          <input
            type='text'
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm'
            placeholder='e.g. Social, newsletter, onsite signage'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Key Message
          </label>
          <input
            type='text'
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-indigo-500 sm:text-sm'
            placeholder='e.g. Brand spotlight, special offer'
          />
        </div>
      </div>
    </div>
  )
}
