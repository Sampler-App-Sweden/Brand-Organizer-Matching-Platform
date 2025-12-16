import { MoreHorizontalIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface OtherSponsorshipInputProps {
  otherDetails: { title: string; description: string }
  setOtherDetails: (details: { title: string; description: string }) => void
}

const MAX_TITLE_LENGTH = 100
const MAX_DESCRIPTION_LENGTH = 500

export function OtherSponsorshipInput({
  otherDetails,
  setOtherDetails
}: OtherSponsorshipInputProps) {
  const [titleCount, setTitleCount] = useState(otherDetails.title.length)
  const [descriptionCount, setDescriptionCount] = useState(
    otherDetails.description.length
  )

  useEffect(() => {
    setTitleCount(otherDetails.title.length)
    setDescriptionCount(otherDetails.description.length)
  }, [otherDetails])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, MAX_TITLE_LENGTH)
    setOtherDetails({ ...otherDetails, title: value })
  }

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value.slice(0, MAX_DESCRIPTION_LENGTH)
    setOtherDetails({ ...otherDetails, description: value })
  }

  return (
    <div className='bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 relative'>
      <div className='absolute -top-3 -left-3 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center'>
        <MoreHorizontalIcon className='h-3 w-3 text-purple-600' />
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-4'>
        Other Collaboration Details
      </h3>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            What type of collaboration are you seeking?
          </label>
          <input
            type='text'
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm'
            placeholder='e.g. Venue partnership, Equipment loan, Volunteer support'
            value={otherDetails.title}
            onChange={handleTitleChange}
            maxLength={MAX_TITLE_LENGTH}
          />
          <div className='mt-1 text-xs text-gray-500 text-right'>
            {titleCount}/{MAX_TITLE_LENGTH} characters
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Please describe what you need
          </label>
          <textarea
            rows={4}
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm'
            placeholder='Provide details about your collaboration needs, including any specific requirements, timelines, or expectations...'
            value={otherDetails.description}
            onChange={handleDescriptionChange}
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
          <div className='mt-1 text-xs text-gray-500 text-right'>
            {descriptionCount}/{MAX_DESCRIPTION_LENGTH} characters
          </div>
        </div>
      </div>
    </div>
  )
}
