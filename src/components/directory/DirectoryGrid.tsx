import { ProfileOverview } from '../../services/profileService'
import { DirectoryCard } from './DirectoryCard'

type InterestStatus = 'none' | 'sent' | 'received' | 'mutual'

interface DirectoryGridProps {
  profiles: ProfileOverview[]
  showInterestAction?: boolean
  interestStatuses?: Map<string, InterestStatus>
  onExpressInterest?: (profileId: string) => void
}

export function DirectoryGrid({
  profiles,
  showInterestAction = false,
  interestStatuses,
  onExpressInterest
}: DirectoryGridProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
      {profiles.map((profile) => (
        <DirectoryCard
          key={profile.id}
          profile={profile}
          showInterestAction={showInterestAction}
          interestStatus={interestStatuses?.get(profile.userId) || 'none'}
          onExpressInterest={onExpressInterest}
        />
      ))}
    </div>
  )
}
