import { ArrowRightIcon, CheckIcon, StarIcon, XIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EnhancedMatch, MatchView } from '../../../types/matches'
import { Avatar, Badge, Button, IconButton } from '../../ui'

interface MatchCardProps {
  match: EnhancedMatch
  activeView: MatchView
  userType: 'brand' | 'organizer'
  isSaved: boolean
  onSave: (matchId: string) => void
  onDismiss: (matchId: string) => void
  onExpressInterest: (matchId: string) => void
}

function getScoreVariant(score: number): 'success' | 'warning' | 'neutral' {
  if (score >= 85) return 'success'
  if (score >= 70) return 'warning'
  return 'neutral'
}

export function MatchCard({
  match,
  activeView,
  userType,
  isSaved,
  onSave,
  onDismiss,
  onExpressInterest
}: MatchCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all hover:shadow-md ${
        activeView === 'suggested' && isSaved ? 'ring-2 ring-indigo-500' : ''
      }`}
    >
      <div className='p-5'>
        <div className='flex justify-between items-start mb-4'>
          <div className='flex items-center'>
            <Avatar
              src={match.brandLogo}
              name={match.brandName}
              alt={match.brandName}
              size='md'
              variant='circle'
              colorScheme='brand'
              className='mr-2'
            />
            <div className='flex flex-col items-center mx-1'>
              <div className='w-5 h-0.5 bg-gray-300'></div>
              <div className='my-1 text-gray-400'>×</div>
              <div className='w-5 h-0.5 bg-gray-300'></div>
            </div>
            <Avatar
              src={match.organizerLogo}
              name={match.organizerName}
              alt={match.organizerName}
              size='md'
              variant='circle'
              colorScheme='organizer'
              className='ml-2'
            />
          </div>
          <div className='flex flex-col items-end gap-1'>
            {activeView === 'suggested' && (
              <Badge variant={getScoreVariant(match.score)} size='md' rounded='full'>
                {match.score}% Match
              </Badge>
            )}
            {activeView === 'confirmed' && match.matchSource && (
              <Badge
                variant={
                  match.matchSource === 'hybrid'
                    ? 'success'
                    : match.matchSource === 'manual'
                    ? 'neutral'
                    : 'info'
                }
                size='sm'
                rounded='full'
              >
                {match.matchSource === 'ai' && 'AI Match'}
                {match.matchSource === 'manual' && 'Manual Match'}
                {match.matchSource === 'hybrid' && 'Hybrid Match'}
              </Badge>
            )}
          </div>
        </div>

        <div className='flex justify-between items-start mb-4'>
          <div className='w-1/2 pr-2'>
            <h3 className='font-medium text-gray-900 text-sm'>
              {match.brandName}
            </h3>
            <p className='text-xs text-gray-600 truncate'>
              {match.productName}
            </p>
          </div>
          <div className='w-1/2 pl-2'>
            <h3 className='font-medium text-gray-900 text-sm'>
              {match.organizerName}
            </h3>
            <p className='text-xs text-gray-600 truncate'>{match.eventName}</p>
          </div>
        </div>

        {activeView === 'suggested' && (
          <div className='mb-4'>
            <h4 className='text-xs font-medium text-gray-500 mb-2'>
              Why you match:
            </h4>
            <ul className='space-y-1'>
              {match.matchCriteria.slice(0, 3).map((criterion, index) => (
                <li
                  key={index}
                  className='flex items-center text-sm text-gray-700'
                >
                  <CheckIcon className='h-4 w-4 text-green-500 mr-2 flex-shrink-0' />
                  <span className='truncate'>{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className='flex justify-between items-center mt-4'>
          {activeView === 'confirmed' ? (
            <>
              <div>
                <span className='text-xs text-gray-500'>
                  Matched on {new Date(match.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Link
                to={`/dashboard/${userType}/matches/${match.id}`}
                className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                View Details
                <ArrowRightIcon className='ml-1 h-3 w-3' />
              </Link>
            </>
          ) : (
            <div className='flex space-x-2 w-full'>
              {isSaved ? (
                <Button
                  variant='primary'
                  className='flex-1'
                  onClick={() => onExpressInterest(match.id)}
                >
                  Express Interest
                </Button>
              ) : (
                <>
                  <Button
                    variant='outline'
                    className='flex items-center flex-1'
                    onClick={() => onSave(match.id)}
                  >
                    <StarIcon className='h-4 w-4 mr-1' />
                    Save
                  </Button>
                  <Button
                    variant='primary'
                    className='flex-1'
                    onClick={() => onExpressInterest(match.id)}
                  >
                    Express Interest
                  </Button>
                  <IconButton
                    variant='ghost'
                    size='md'
                    colorScheme='gray'
                    icon={<XIcon className='h-5 w-5' />}
                    onClick={() => onDismiss(match.id)}
                    aria-label='Dismiss match'
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
