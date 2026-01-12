import { BarChart3Icon } from 'lucide-react'

import { BrandFormData } from '../../../hooks/useBrandForm'
import { FormField, SelectionCard } from '../../ui'

interface DetailsStepProps {
  formData: BrandFormData
  errors: Record<string, string>
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  onRadioChange: (name: string, value: string) => void
}

export function DetailsStep({
  formData,
  errors,
  onChange,
  onRadioChange
}: DetailsStepProps) {
  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
        <BarChart3Icon className='h-5 w-5 text-indigo-500 mr-2' />
        Additional Details
      </h2>

      <div>
        <label className='block text-sm font-medium text-gray-800 mb-2'>
          Are you interested in financial sponsorship opportunities?
        </label>
        <div className='grid grid-cols-2 gap-4'>
          <SelectionCard
            id='financial-yes'
            label='Yes'
            isSelected={formData.interestedInFinancialSponsorship === 'yes'}
            onClick={() =>
              onRadioChange('interestedInFinancialSponsorship', 'yes')
            }
          />
          <SelectionCard
            id='financial-no'
            label='No'
            isSelected={formData.interestedInFinancialSponsorship === 'no'}
            onClick={() =>
              onRadioChange('interestedInFinancialSponsorship', 'no')
            }
          />
        </div>
      </div>

      {formData.interestedInFinancialSponsorship === 'yes' && (
        <FormField
          label='Financial Sponsorship Amount'
          id='financialSponsorshipAmount'
          placeholder='e.g., 50,000 SEK'
          value={formData.financialSponsorshipAmount}
          onChange={onChange}
        />
      )}

      <FormField
        label='Success Metrics'
        id='successMetrics'
        textarea
        placeholder='How will you measure the success of your sponsorship?'
        value={formData.successMetrics}
        onChange={onChange}
      />

      <div>
        <label className='block text-sm font-medium text-gray-800 mb-2'>
          Are you interested in product sampling tools?
        </label>
        <div className='grid grid-cols-2 gap-4'>
          <SelectionCard
            id='sampling-yes'
            label='Yes'
            isSelected={formData.interestedInSamplingTools === 'yes'}
            onClick={() => onRadioChange('interestedInSamplingTools', 'yes')}
          />
          <SelectionCard
            id='sampling-no'
            label='No'
            isSelected={formData.interestedInSamplingTools === 'no'}
            onClick={() => onRadioChange('interestedInSamplingTools', 'no')}
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-800 mb-2'>
          Do you have upcoming test panels or sampling opportunities?
        </label>
        <div className='grid grid-cols-2 gap-4'>
          <SelectionCard
            id='testpanel-yes'
            label='Yes'
            isSelected={formData.hasTestPanels === 'yes'}
            onClick={() => onRadioChange('hasTestPanels', 'yes')}
          />
          <SelectionCard
            id='testpanel-no'
            label='No'
            isSelected={formData.hasTestPanels === 'no'}
            onClick={() => onRadioChange('hasTestPanels', 'no')}
          />
        </div>
      </div>

      {formData.hasTestPanels === 'yes' && (
        <FormField
          label='Test Panel Details'
          id='testPanelDetails'
          textarea
          placeholder='Describe your upcoming test panels or sampling opportunities'
          value={formData.testPanelDetails}
          onChange={onChange}
        />
      )}

      <FormField
        label='Additional Information'
        id='additionalInfo'
        textarea
        placeholder="Any other details you'd like to share"
        value={formData.additionalInfo}
        onChange={onChange}
      />
    </div>
  )
}
