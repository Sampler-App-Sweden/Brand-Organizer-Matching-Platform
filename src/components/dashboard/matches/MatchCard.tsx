import { ArrowRightIcon, CheckIcon, StarIcon, XIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EnhancedMatch, MatchView } from '../../../types/matches'
import { Button } from '../../ui'

interface MatchCardProps {
  match: EnhancedMatch
  activeView: MatchView
  userType: 'brand' | 'organizer'
  isSaved: boolean
  onSave: (matchId: string) => void
  onDismiss: (matchId: string) => void
  onExpressInterest: (matchId: string) => void
}

function getScoreColor(score: number) {
  if (score >= 85) return 'bg-green-100 text-green-800'
  if (score >= 70) return 'bg-amber-100 text-amber-800'
  return 'bg-gray-100 text-gray-800'
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
            <div className='h-12 w-12 rounded-full overflow-hidden mr-2 bg-gray-200'>
              {match.brandLogo ? (
                <img
                  src={match.brandLogo}
                  alt={match.brandName}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='h-full w-full flex items-center justify-center bg-blue-100 text-blue-800 font-bold'>
                  {match.brandName.charAt(0)}
                </div>
              )}
            </div>
            <div className='flex flex-col items-center mx-1'>
              <div className='w-5 h-0.5 bg-gray-300'></div>
              <div className='my-1 text-gray-400'>×</div>
              <div className='w-5 h-0.5 bg-gray-300'></div>
            </div>
            <div className='h-12 w-12 rounded-full overflow-hidden ml-2 bg-gray-200'>
              {match.organizerLogo ? (
                <img
                  src={match.organizerLogo}
                  alt={match.organizerName}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='h-full w-full flex items-center justify-center bg-green-100 text-green-800 font-bold'>
                  {match.organizerName.charAt(0)}
                </div>
              )}
            </div>
          </div>
          {activeView === 'suggested' && (
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                match.score
              )}`}
            >
              {match.score}% Match
            </div>
          )}
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
                  <button
                    className='p-2 text-gray-400 hover:text-gray-600'
                    onClick={() => onDismiss(match.id)}
                    title='Dismiss'
                  >
                    <XIcon className='h-5 w-5' />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
