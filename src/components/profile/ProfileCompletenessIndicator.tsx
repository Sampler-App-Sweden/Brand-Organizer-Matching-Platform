import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import { ProfileOverview } from '../../services/profileService'

interface ProfileCompletenessIndicatorProps {
  profile: {
    description?: string | null
    role?: 'Brand' | 'Organizer'
    whatTheySeek?: {
      sponsorshipTypes?: string[]
      budgetRange?: string | null
      audienceTags?: string[]
      eventTypes?: string[]
    }
  }
  className?: string
}

interface Requirement {
  label: string
  met: boolean
  description: string
}

export function ProfileCompletenessIndicator({
  profile,
  className = ''
}: ProfileCompletenessIndicatorProps) {
  const requirements: Requirement[] = []

  // Check description
  const hasDescription = profile.description && profile.description.trim() !== ''
  requirements.push({
    label: 'Profile Description',
    met: hasDescription,
    description: 'Add a compelling description of your organization'
  })

  if (profile.role === 'Brand') {
    // Brand-specific requirements
    const hasSponsorshipTypes =
      profile.whatTheySeek?.sponsorshipTypes &&
      profile.whatTheySeek.sponsorshipTypes.length > 0
    requirements.push({
      label: 'Sponsorship Types',
      met: hasSponsorshipTypes,
      description: 'Select at least one sponsorship type you\'re interested in'
    })

    const hasBudget = !!profile.whatTheySeek?.budgetRange
    requirements.push({
      label: 'Budget Range',
      met: hasBudget,
      description: 'Specify your sponsorship budget range'
    })

    const hasAudienceTags =
      profile.whatTheySeek?.audienceTags &&
      profile.whatTheySeek.audienceTags.length > 0 &&
      !profile.whatTheySeek.audienceTags.includes('-')
    requirements.push({
      label: 'Target Audience',
      met: hasAudienceTags,
      description: 'Define your target audience demographics'
    })
  } else if (profile.role === 'Organizer') {
    // Organizer-specific requirements
    const hasAudienceTags =
      profile.whatTheySeek?.audienceTags &&
      profile.whatTheySeek.audienceTags.length > 0 &&
      !profile.whatTheySeek.audienceTags.includes('-')
    requirements.push({
      label: 'Audience Demographics',
      met: hasAudienceTags,
      description: 'Describe your event audience demographics'
    })
  }

  const metCount = requirements.filter((r) => r.met).length
  const totalCount = requirements.length
  const isComplete = metCount === totalCount
  const percentage = (metCount / totalCount) * 100

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <div className='flex items-start gap-3'>
        <div className='flex-shrink-0'>
          {isComplete ? (
            <CheckCircle className='h-6 w-6 text-green-500' />
          ) : (
            <AlertCircle className='h-6 w-6 text-amber-500' />
          )}
        </div>
        <div className='flex-1'>
          <h3 className='font-medium text-gray-900 mb-1'>
            Directory Visibility
          </h3>
          {isComplete ? (
            <p className='text-sm text-green-600 mb-2'>
              Your profile is complete and visible in the directory!
            </p>
          ) : (
            <p className='text-sm text-gray-600 mb-2'>
              Complete your profile to appear in the directory and be discovered
              by potential partners.
            </p>
          )}

          {/* Progress bar */}
          <div className='mb-3'>
            <div className='flex items-center justify-between text-xs text-gray-500 mb-1'>
              <span>
                {metCount} of {totalCount} requirements met
              </span>
              <span>{percentage.toFixed(0)}%</span>
            </div>
            <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className={`h-full transition-all duration-300 ${
                  isComplete
                    ? 'bg-green-500'
                    : percentage >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Requirements checklist */}
          <div className='space-y-2'>
            {requirements.map((req, idx) => (
              <div key={idx} className='flex items-start gap-2 text-sm'>
                {req.met ? (
                  <CheckCircle className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                ) : (
                  <AlertCircle className='h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5' />
                )}
                <div>
                  <span
                    className={`font-medium ${
                      req.met ? 'text-gray-700' : 'text-gray-900'
                    }`}
                  >
                    {req.label}
                  </span>
                  {!req.met && (
                    <p className='text-gray-500 text-xs mt-0.5'>
                      {req.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isComplete && (
            <div className='mt-3 p-2 bg-blue-50 rounded-md flex items-start gap-2'>
              <Info className='h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5' />
              <p className='text-xs text-blue-800'>
                Only complete profiles appear in the directory to ensure quality
                matches for all users.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}