import { BriefcaseIcon } from 'lucide-react'

import {
  bonusValueOptions,
  offeringTypes
} from '../../../constants/organizerFormOptions'
import { OrganizerFormData } from '../../../hooks/useOrganizerForm'
import { FormField, SelectionCard } from '../../ui'

interface OfferingsStepProps {
  formData: OrganizerFormData
  errors: Record<string, string>
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  onMultiSelect: (name: string, value: string) => void
  onRadioChange: (name: string, value: string) => void
}

export function OfferingsStep({
  formData,
  errors,
  onChange,
  onMultiSelect,
  onRadioChange
}: OfferingsStepProps) {
  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
        <BriefcaseIcon className='h-5 w-5 text-indigo-500 mr-2' />
        Sponsorship Offerings
      </h2>

      <div>
        <label className='block text-sm font-medium text-gray-800 mb-2'>
          Are you seeking financial sponsorship?
        </label>
        <div className='grid grid-cols-2 gap-4'>
          <SelectionCard
            id='financial-yes'
            label='Yes'
            isSelected={formData.seekingFinancialSponsorship === 'yes'}
            onClick={() => onRadioChange('seekingFinancialSponsorship', 'yes')}
          />
          <SelectionCard
            id='financial-no'
            label='No'
            isSelected={formData.seekingFinancialSponsorship === 'no'}
            onClick={() => onRadioChange('seekingFinancialSponsorship', 'no')}
          />
        </div>
      </div>

      {formData.seekingFinancialSponsorship === 'yes' && (
        <>
          <FormField
            label='Financial Sponsorship Amount'
            id='financialSponsorshipAmount'
            placeholder='e.g., 50,000 SEK'
            value={formData.financialSponsorshipAmount}
            onChange={onChange}
          />
          <FormField
            label='What sponsors receive for financial support'
            id='financialSponsorshipOffers'
            textarea
            placeholder='Describe what sponsors will receive in return for financial support'
            value={formData.financialSponsorshipOffers}
            onChange={onChange}
          />
        </>
      )}

      <div>
        <label className='block text-sm font-medium text-gray-800 mb-2'>
          What can you offer sponsors?
          {errors.offeringTypes && (
            <span className='text-red-500 ml-1 text-xs'>
              {errors.offeringTypes}
            </span>
          )}
        </label>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          {offeringTypes.map((type) => {
            const Icon = type.IconComponent
            return (
              <SelectionCard
                key={type.id}
                id={type.id}
                label={type.label}
                description={type.description}
                icon={<Icon className='h-5 w-5' />}
                isSelected={formData.offeringTypes.includes(type.id)}
                onClick={() => onMultiSelect('offeringTypes', type.id)}
              />
            )
          })}
        </div>
      </div>

      {formData.offeringTypes.includes('brand_visibility') && (
        <FormField
          label='Brand Visibility Details'
          id='brandVisibility'
          textarea
          placeholder='Describe how brands will be visible at your event'
          value={formData.brandVisibility}
          onChange={onChange}
        />
      )}

      {formData.offeringTypes.includes('product_sampling') && (
        <FormField
          label='Product Sampling Details'
          id='productSampling'
          textarea
          placeholder='Describe product sampling opportunities for sponsors'
          value={formData.productSampling}
          onChange={onChange}
        />
      )}

      {formData.offeringTypes.includes('content_creation') && (
        <FormField
          label='Content Creation Details'
          id='contentCreation'
          textarea
          placeholder='Describe what kind of content you can create for sponsors'
          value={formData.contentCreation}
          onChange={onChange}
        />
      )}

      {formData.offeringTypes.includes('lead_generation') && (
        <FormField
          label='Lead Generation Details'
          id='leadGeneration'
          textarea
          placeholder='Describe how you can help brands generate leads'
          value={formData.leadGeneration}
          onChange={onChange}
        />
      )}

      {formData.offeringTypes.includes('product_feedback') && (
        <FormField
          label='Product Feedback Details'
          id='productFeedback'
          textarea
          placeholder='Describe how you can gather product feedback for brands'
          value={formData.productFeedback}
          onChange={onChange}
        />
      )}

      <div>
        <label className='block text-sm font-medium text-gray-800 mb-2'>
          Bonus Value
        </label>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          {bonusValueOptions.map((option) => {
            const Icon = option.IconComponent
            return (
              <SelectionCard
                key={option.id}
                id={option.id}
                label={option.label}
                description={option.description}
                icon={<Icon className='h-5 w-5' />}
                isSelected={formData.bonusValue.includes(option.id)}
                onClick={() => onMultiSelect('bonusValue', option.id)}
              />
            )
          })}
        </div>
      </div>

      {formData.bonusValue.length > 0 && (
        <FormField
          label='Bonus Value Details'
          id='bonusValueDetails'
          textarea
          placeholder='Provide more details about the bonus value you offer'
          value={formData.bonusValueDetails}
          onChange={onChange}
        />
      )}

      <FormField
        label='Additional Information'
        id='additionalInfo'
        textarea
        placeholder="Any other details you'd like to share with potential sponsors"
        value={formData.additionalInfo}
        onChange={onChange}
      />
    </div>
  )
}
