import { TargetIcon } from 'lucide-react'
import { FormField, SelectionCard } from '../../ui'
import { BrandFormData } from '../../../hooks/useBrandForm'
import {
  sponsorshipTypes,
  ageRangeOptions,
  budgetOptions
} from '../../../constants/brandFormOptions'

interface SponsorshipStepProps {
  formData: BrandFormData
  errors: Record<string, string>
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  onMultiSelect: (name: string, value: string) => void
}

export function SponsorshipStep({
  formData,
  errors,
  onChange,
  onMultiSelect
}: SponsorshipStepProps) {
  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
        <TargetIcon className='h-5 w-5 text-indigo-500 mr-2' />
        Sponsorship Details
      </h2>

      <div>
        <label className='block text-sm font-medium text-gray-800 mb-2'>
          Sponsorship Type
          {errors.sponsorshipType && (
            <span className='text-red-500 ml-1 text-xs'>
              {errors.sponsorshipType}
            </span>
          )}
        </label>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {sponsorshipTypes.map((type) => {
            const Icon = type.IconComponent
            return (
              <SelectionCard
                key={type.id}
                id={type.id}
                label={type.label}
                description={type.description}
                icon={<Icon className='h-5 w-5' />}
                isSelected={formData.sponsorshipType.includes(type.id)}
                onClick={() => onMultiSelect('sponsorshipType', type.id)}
              />
            )
          })}
        </div>
      </div>

      <FormField
        label='Target Audience'
        id='targetAudience'
        textarea
        required
        placeholder='Describe your ideal customer or audience'
        value={formData.targetAudience}
        onChange={onChange}
        error={errors.targetAudience}
      />

      <FormField
        label='Target Age Range'
        id='ageRange'
        type='select'
        options={ageRangeOptions}
        required
        value={formData.ageRange}
        onChange={onChange}
        error={errors.ageRange}
      />

      <FormField
        label='Marketing Goals'
        id='marketingGoals'
        textarea
        placeholder='What do you hope to achieve through event sponsorships?'
        value={formData.marketingGoals}
        onChange={onChange}
      />

      <FormField
        label='Sponsorship Budget Range'
        id='budget'
        type='select'
        options={budgetOptions}
        required
        value={formData.budget}
        onChange={onChange}
        error={errors.budget}
      />
    </div>
  )
}
