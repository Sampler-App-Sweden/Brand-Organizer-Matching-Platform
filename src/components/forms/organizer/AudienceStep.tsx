import { UsersIcon } from 'lucide-react'

import {
  attendeeCountOptions,
  demographicOptions
} from '../../../constants/organizerFormOptions'
import { OrganizerFormData } from '../../../hooks/useOrganizerForm'
import { FormField, SelectionCard } from '../../ui'

interface AudienceStepProps {
  formData: OrganizerFormData
  errors: Record<string, string>
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  onMultiSelect: (name: string, value: string) => void
}

export function AudienceStep({
  formData,
  errors,
  onChange,
  onMultiSelect
}: AudienceStepProps) {
  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
        <UsersIcon className='h-5 w-5 text-indigo-500 mr-2' />
        Audience Information
      </h2>

      <FormField
        label='Expected Attendee Count'
        id='attendeeCount'
        type='select'
        options={attendeeCountOptions}
        required
        value={formData.attendeeCount}
        onChange={onChange}
        error={errors.attendeeCount}
      />

      <FormField
        label='Audience Description'
        id='audienceDescription'
        textarea
        required
        placeholder='Describe your typical attendees, their interests, and demographics'
        value={formData.audienceDescription}
        onChange={onChange}
        error={errors.audienceDescription}
      />

      <div>
        <label className='block text-sm font-medium text-gray-800 mb-2'>
          Audience Age Demographics
          {errors.audienceDemographics && (
            <span className='text-red-500 ml-1 text-xs'>
              {errors.audienceDemographics}
            </span>
          )}
        </label>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {demographicOptions.map((demo) => {
            const Icon = demo.IconComponent
            return (
              <SelectionCard
                key={demo.id}
                id={demo.id}
                label={demo.label}
                icon={<Icon className='h-5 w-5' />}
                isSelected={formData.audienceDemographics.includes(demo.id)}
                onClick={() => onMultiSelect('audienceDemographics', demo.id)}
              />
            )
          })}
        </div>
      </div>

      <FormField
        label='Sponsorship Needs'
        id='sponsorshipNeeds'
        textarea
        placeholder="Describe what kinds of sponsors you're looking for and why"
        value={formData.sponsorshipNeeds}
        onChange={onChange}
      />
    </div>
  )
}
