import { ProfileOverview } from '../../services/profileService'
import { DirectoryCard } from './DirectoryCard'

interface DirectoryGridProps {
  profiles: ProfileOverview[]
}

export function DirectoryGrid({ profiles }: DirectoryGridProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
      {profiles.map((profile) => (
        <DirectoryCard key={profile.id} profile={profile} />
      ))}
    </div>
  )
}
