import { StarIcon } from 'lucide-react'


interface MatchPreviewProps {
  matchText: string
}

export function MatchPreview({ matchText }: MatchPreviewProps) {
  return (
    <div className='bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8 relative overflow-hidden'>
      <div className='absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -mr-12 -mt-12 opacity-50'></div>
      <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
        <StarIcon className='h-5 w-5 text-indigo-500 mr-2' />
        Instant Match Preview
      </h3>
      <div className='relative z-10'>
        <p className='text-gray-700 mb-4'>
          We'll connect you with brands able to offer:
        </p>
        <div className='bg-white p-4 rounded-lg shadow-sm border border-blue-100'>
          <p className='text-gray-800 font-medium'>{matchText}</p>
        </div>
        <p className='text-sm text-gray-500 mt-4'>
          This is an estimate based on your requirements and available sponsors
          in our network.
        </p>
      </div>
      {/* Constellation decoration */}
      <div className='absolute bottom-4 right-4 text-blue-200 opacity-30 flex'>
        <div className='h-2 w-2 rounded-full bg-indigo-400 mr-1'></div>
        <div className='h-1 w-1 rounded-full bg-indigo-400 mr-3 mt-1'></div>
        <div className='h-2 w-2 rounded-full bg-indigo-400 mr-1'></div>
        <div className='h-1 w-1 rounded-full bg-indigo-400 mr-1 mt-1'></div>
        <div className='h-2 w-2 rounded-full bg-indigo-400'></div>
      </div>
    </div>
  )
}
