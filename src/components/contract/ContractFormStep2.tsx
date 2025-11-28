import { PAYMENT_TERMS_OPTIONS } from '../../constants/contractFormOptions'
import { Button, FormField } from '../ui'

import type { ContractFormData } from '../../hooks/useContractForm'

interface ContractFormStep2Props {
  formData: ContractFormData
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  onPrev: () => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
}

export function ContractFormStep2({
  formData,
  onChange,
  onPrev,
  onSubmit,
  isSubmitting
}: ContractFormStep2Props) {
  return (
    <form onSubmit={onSubmit}>
      <div className='space-y-4 mb-6'>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            label='Start Date'
            id='startDate'
            type='date'
            required
            value={formData.startDate}
            onChange={onChange}
          />
          <FormField
            label='End Date'
            id='endDate'
            type='date'
            required
            value={formData.endDate}
            onChange={onChange}
          />
        </div>
        <FormField
          label='Payment Terms'
          id='paymentTerms'
          type='select'
          options={PAYMENT_TERMS_OPTIONS}
          required
          value={formData.paymentTerms}
          onChange={onChange}
        />
        <FormField
          label='Cancellation Policy'
          id='cancellationPolicy'
          textarea
          required
          placeholder='Describe the cancellation policy for the contract, e.g., notice period, fees, etc.'
          value={formData.cancellationPolicy}
          onChange={onChange}
        />
        <FormField
          label='Additional Terms (optional)'
          id='additionalTerms'
          textarea
          placeholder='Any additional terms or conditions for the contract'
          value={formData.additionalTerms}
          onChange={onChange}
        />
      </div>
      <div className='flex justify-between'>
        <Button onClick={onPrev} variant='outline' type='button'>
          Go Back
        </Button>
        <Button type='submit' variant='primary' disabled={isSubmitting}>
          {isSubmitting ? 'Creating Contract...' : 'Create Contract'}
        </Button>
      </div>
    </form>
  )
}
