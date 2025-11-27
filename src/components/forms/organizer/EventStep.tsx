import { CalendarIcon } from 'lucide-react'

import {
  eventFrequencyOptions,
  eventTypeOptions
} from '../../../constants/organizerFormOptions'
import { OrganizerFormData } from '../../../hooks/useOrganizerForm'
import { FormField } from '../../ui'

interface EventStepProps {
  formData: OrganizerFormData
  errors: Record<string, string>
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
}

export function EventStep({ formData, errors, onChange }: EventStepProps) {
  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
        <CalendarIcon className='h-5 w-5 text-indigo-500 mr-2' />
        Event Information
      </h2>

      <FormField
        label='Event Name'
        id='eventName'
        required
        value={formData.eventName}
        onChange={onChange}
        error={errors.eventName}
      />

      <FormField
        label='Event Type'
        id='eventType'
        type='select'
        options={eventTypeOptions}
        required
        value={formData.eventType}
        onChange={onChange}
        error={errors.eventType}
      />

      <FormField
        label='Elevator Pitch'
        id='elevatorPitch'
        textarea
        placeholder='Briefly describe your event in 1-2 sentences'
        value={formData.elevatorPitch}
        onChange={onChange}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          label='Event Frequency'
          id='eventFrequency'
          type='select'
          options={eventFrequencyOptions}
          required
          value={formData.eventFrequency}
          onChange={onChange}
          error={errors.eventFrequency}
        />
        <FormField
          label='Event Date'
          id='eventDate'
          type='date'
          value={formData.eventDate}
          onChange={onChange}
        />
      </div>

      <FormField
        label='Location'
        id='location'
        placeholder='Venue or location of the event'
        value={formData.location}
        onChange={onChange}
      />
    </div>
  )
}
