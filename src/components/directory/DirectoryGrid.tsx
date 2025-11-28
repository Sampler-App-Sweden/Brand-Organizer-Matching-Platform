import { getMemberMatches } from '../../services/communityService'
import { CommunityMember } from '../../types/community'
import { DirectoryCard } from './DirectoryCard'

interface DirectoryGridProps {
  members: CommunityMember[]
}
export function DirectoryGrid({ members }: DirectoryGridProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
      {members.map((member) => {
        // Get mock matches for this member
        const matches = getMemberMatches(member.id)
        return (
          <DirectoryCard key={member.id} member={member} matches={matches} />
        )
      })}
    </div>
  )
}
