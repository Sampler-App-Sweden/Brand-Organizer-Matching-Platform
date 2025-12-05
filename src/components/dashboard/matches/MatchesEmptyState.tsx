import { HandshakeIcon, SparklesIcon } from 'lucide-react'

import { MatchView } from '../../../types/matches'
import { Button } from '../../ui'

interface MatchesEmptyStateProps {
  activeView: MatchView
  onCtaClick: () => void
}

export function MatchesEmptyState({
  activeView,
  onCtaClick
}: MatchesEmptyStateProps) {
  const isConfirmed = activeView === 'confirmed'
  return (
    <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
      <div className='inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4'>
        {isConfirmed ? (
          <HandshakeIcon className='h-8 w-8 text-indigo-600' />
        ) : (
          <SparklesIcon className='h-8 w-8 text-indigo-600' />
        )}
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-2'>
        {isConfirmed
          ? 'No confirmed matches yet'
          : 'No suggested matches available'}
      </h3>
      <p className='text-gray-600 max-w-md mx-auto mb-6'>
        {isConfirmed
          ? 'When you and a partner both express interest in a match, it will appear here.'
          : "We'll notify you when we find new potential matches based on your profile."}
      </p>
      {isConfirmed && (
        <Button
          variant='primary'
          onClick={onCtaClick}
          className='flex items-center mx-auto'
        >
          <SparklesIcon className='h-4 w-4 mr-2' />
          View Suggestions
        </Button>
      )}
    </div>
  )
}
