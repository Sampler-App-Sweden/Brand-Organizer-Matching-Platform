import { Heart } from 'lucide-react'
import { MouseEvent, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { expressInterest, withdrawInterest, getSentInterests } from '../../services/interestService'

type InterestStatusUI = 'none' | 'sent' | 'received' | 'mutual'

interface InterestButtonProps {
  profileId: string
  profileRole: 'brand' | 'organizer'
  currentUserId: string
  currentUserType: 'brand' | 'organizer' | 'admin'
  interestStatus: InterestStatusUI
  onInterestChange?: () => void
  className?: string
}

export function InterestButton({
  profileId,
  profileRole,
  currentUserId,
  currentUserType,
  interestStatus,
  onInterestChange,
  className = ''
}: InterestButtonProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!currentUserId) {
      navigate('/login', {
        state: { returnUrl: `${location.pathname}${location.search}` }
      })
      return
    }

    if (interestStatus === 'received' || interestStatus === 'mutual') {
      // Don't allow action on received or mutual status from this button
      // They should go to the interests page to accept/view
      return
    }

    try {
      setIsLoading(true)

      if (interestStatus === 'none') {
        // Express new interest
        await expressInterest(
          currentUserId,
          currentUserType as 'brand' | 'organizer',
          profileId,
          profileRole
        )
      } else if (interestStatus === 'sent') {
        // Withdraw interest
        const sentInterests = await getSentInterests(currentUserId)
        const interest = sentInterests.find(i => i.receiverId === profileId)

        if (interest) {
          const confirmed = window.confirm(
            interest.status === 'accepted'
              ? 'Withdrawing from a mutual match will archive the conversation. Are you sure?'
              : 'Are you sure you want to withdraw your interest?'
          )

          if (confirmed) {
            await withdrawInterest(interest.id)
          } else {
            setIsLoading(false)
            return
          }
        }
      }

      // Notify parent to refetch status
      onInterestChange?.()
    } catch (err) {
      console.error('Failed to handle interest:', err)
      alert('Failed to update interest. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonStyles = () => {
    if (interestStatus === 'mutual') {
      return 'bg-pink-50 text-pink-700 border border-pink-200 cursor-default'
    } else if (interestStatus === 'sent') {
      return 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700'
    } else if (interestStatus === 'received') {
      return 'bg-indigo-50 text-indigo-700 border border-indigo-200 cursor-pointer hover:bg-indigo-100'
    } else {
      return 'bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent'
    }
  }

  const getButtonText = () => {
    if (interestStatus === 'mutual') return 'Mutual Interest'
    if (interestStatus === 'sent') return isLoading ? 'Withdrawing...' : 'Withdraw Interest'
    if (interestStatus === 'received') return 'Interested in You'
    return isLoading ? 'Sending...' : 'Express Interest'
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || interestStatus === 'mutual'}
      className={`
        w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-colors
        ${getButtonStyles()}
        ${isLoading ? 'opacity-60 cursor-wait' : ''}
        ${className}
      `}
    >
      <Heart
        className={`h-4 w-4 ${
          interestStatus === 'mutual' ? 'fill-pink-500 text-pink-500' : ''
        }`}
      />
      {getButtonText()}
    </button>
  )
}
