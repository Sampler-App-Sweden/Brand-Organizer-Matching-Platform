import { Check, X, Heart, MessageCircle, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EnhancedConnection } from '../../types/connection'
import { Badge, Button, IconButton } from '../ui'

interface ConnectionCardProps {
  connection: EnhancedConnection
  viewType: 'sent' | 'received' | 'mutual'
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
  onWithdraw?: (id: string) => void
  onStartConversation?: (brandId: string, organizerId: string) => void
}

export function ConnectionCard({
  connection,
  viewType,
  onAccept,
  onReject,
  onWithdraw,
  onStartConversation
}: ConnectionCardProps) {
  const displayName = viewType === 'sent' ? connection.receiverName : connection.senderName
  const displayLogo = viewType === 'sent' ? connection.receiverLogo : connection.senderLogo
  const isOrganizer = connection.senderType === 'organizer'
  const isBrand = connection.senderType === 'brand'

  const getStatusBadge = () => {
    if (connection.isMutual) {
      return <Badge variant='success' size='sm'>Mutual Connection</Badge>
    }

    switch (connection.status) {
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
            {connection.isMutual && (
              <div className='absolute -top-1 -right-1 bg-pink-500 rounded-full p-1'>
                <Heart className='h-3 w-3 text-white fill-white' />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className='flex-grow'>
            <Link
              to={`/profiles/${connection.senderType === viewType ? connection.senderId : connection.receiverId}`}
              className='text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors'
            >
              {displayName}
            </Link>
            <div className='flex items-center gap-2 mt-1'>
              <Badge
                variant={isBrand ? 'brand' : 'organizer'}
                size='xs'
              >
                {connection.senderType === viewType ? connection.receiverType : connection.senderType}
              </Badge>
              {getStatusBadge()}
              {connection.hasAIMatch && (
                <Badge variant='secondary' size='xs'>AI Match Too</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Status Date */}
        <div className='text-sm text-gray-500'>
          {formatDate(connection.createdAt)}
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100'>
        {viewType === 'received' && connection.status === 'pending' && (
          <>
            <Button
              size='sm'
              variant='danger'
              onClick={() => onReject?.(connection.id)}
              leftIcon={<X className='h-4 w-4' />}
            >
              Decline
            </Button>
            <Button
              size='sm'
              variant='success'
              onClick={() => onAccept?.(connection.id)}
              leftIcon={<Check className='h-4 w-4' />}
            >
              Accept
            </Button>
          </>
        )}

        {viewType === 'sent' && (connection.status === 'pending' || connection.status === 'accepted') && (
          <Button
            size='sm'
            variant='outline'
            onClick={() => onWithdraw?.(connection.id)}
            leftIcon={<Trash2 className='h-4 w-4' />}
            title={
              connection.status === 'accepted' && connection.isMutual
                ? 'Withdrawing will archive the conversation'
                : 'Withdraw your connection'
            }
          >
            Withdraw
          </Button>
        )}

        {connection.isMutual && (
          <Button
            size='sm'
            variant='primary'
            onClick={() => onStartConversation?.(connection.brandId, connection.organizerId)}
            leftIcon={<MessageCircle className='h-4 w-4' />}
          >
            Start Conversation
          </Button>
        )}

        {viewType === 'sent' && connection.status === 'accepted' && !connection.isMutual && (
          <div className='text-sm text-gray-600'>
            Waiting for them to express connection back
          </div>
        )}
      </div>
    </div>
  )
}
