import { Check, X, Heart, MessageCircle, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EnhancedInterest } from '../../types/interest'
import { Badge, Button, IconButton } from '../ui'

interface InterestCardProps {
  interest: EnhancedInterest
  viewType: 'sent' | 'received' | 'mutual'
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
  onWithdraw?: (id: string) => void
  onStartConversation?: (brandId: string, organizerId: string) => void
}

export function InterestCard({
  interest,
  viewType,
  onAccept,
  onReject,
  onWithdraw,
  onStartConversation
}: InterestCardProps) {
  const displayName = viewType === 'sent' ? interest.receiverName : interest.senderName
  const displayLogo = viewType === 'sent' ? interest.receiverLogo : interest.senderLogo
  const isOrganizer = interest.senderType === 'organizer'
  const isBrand = interest.senderType === 'brand'

  const getStatusBadge = () => {
    if (interest.isMutual) {
      return <Badge variant='success' size='sm'>Mutual Interest</Badge>
    }

    switch (interest.status) {
      case 'pending':
        return <Badge variant='warning' size='sm'>Pending</Badge>
      case 'accepted':
        return <Badge variant='success' size='sm'>Accepted</Badge>
      case 'rejected':
        return <Badge variant='danger' size='sm'>Declined</Badge>
      case 'withdrawn':
        return <Badge variant='secondary' size='sm'>Withdrawn</Badge>
      default:
        return null
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-4'>
          {/* Logo or Avatar */}
          <div className='relative h-16 w-16 flex-shrink-0'>
            {displayLogo ? (
              <img
                src={displayLogo}
                alt={displayName}
                className='h-full w-full object-cover rounded-md'
              />
            ) : (
              <div
                className={`h-full w-full rounded-md flex items-center justify-center text-white font-bold text-2xl ${
                  isBrand ? 'bg-blue-500' : 'bg-emerald-500'
                }`}
              >
                {displayName.charAt(0)}
              </div>
            )}
            {interest.isMutual && (
              <div className='absolute -top-1 -right-1 bg-pink-500 rounded-full p-1'>
                <Heart className='h-3 w-3 text-white fill-white' />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className='flex-grow'>
            <Link
              to={`/profiles/${interest.senderType === viewType ? interest.senderId : interest.receiverId}`}
              className='text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors'
            >
              {displayName}
            </Link>
            <div className='flex items-center gap-2 mt-1'>
              <Badge
                variant={isBrand ? 'brand' : 'organizer'}
                size='xs'
              >
                {interest.senderType === viewType ? interest.receiverType : interest.senderType}
              </Badge>
              {getStatusBadge()}
              {interest.hasAIMatch && (
                <Badge variant='secondary' size='xs'>AI Match Too</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Status Date */}
        <div className='text-sm text-gray-500'>
          {formatDate(interest.createdAt)}
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100'>
        {viewType === 'received' && interest.status === 'pending' && (
          <>
            <Button
              size='sm'
              variant='outline'
              colorScheme='red'
              onClick={() => onReject?.(interest.id)}
              leftIcon={<X className='h-4 w-4' />}
            >
              Decline
            </Button>
            <Button
              size='sm'
              variant='solid'
              colorScheme='green'
              onClick={() => onAccept?.(interest.id)}
              leftIcon={<Check className='h-4 w-4' />}
            >
              Accept
            </Button>
          </>
        )}

        {viewType === 'sent' && (interest.status === 'pending' || interest.status === 'accepted') && (
          <Button
            size='sm'
            variant='outline'
            colorScheme='gray'
            onClick={() => onWithdraw?.(interest.id)}
            leftIcon={<Trash2 className='h-4 w-4' />}
            title={
              interest.status === 'accepted' && interest.isMutual
                ? 'Withdrawing will archive the conversation'
                : 'Withdraw your interest'
            }
          >
            Withdraw
          </Button>
        )}

        {interest.isMutual && (
          <Button
            size='sm'
            variant='solid'
            colorScheme='indigo'
            onClick={() => onStartConversation?.(interest.brandId, interest.organizerId)}
            leftIcon={<MessageCircle className='h-4 w-4' />}
          >
            Start Conversation
          </Button>
        )}

        {viewType === 'sent' && interest.status === 'accepted' && !interest.isMutual && (
          <div className='text-sm text-gray-600'>
            Waiting for them to express interest back
          </div>
        )}
      </div>
    </div>
  )
}
