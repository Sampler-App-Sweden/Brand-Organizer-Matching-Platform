import { SPONSORSHIP_TYPE_OPTIONS } from '../../constants/contractFormOptions'
import { FormField } from '../ui'
import { Button } from '../ui'

interface ContractFormStep1Props {
  formData: import('../../hooks/useContractForm').ContractFormData
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  onNext: () => void
}

export function ContractFormStep1({
  formData,
  onChange,
  onNext
}: ContractFormStep1Props) {
  return (
    <div>
      <div className='space-y-4 mb-6'>
        <FormField
          label='Sponsorship Amount (SEK)'
          id='sponsorshipAmount'
          required
          value={formData.sponsorshipAmount}
          onChange={onChange}
          placeholder='e.g 25000'
        />
        <FormField
          label='Sponsorship Type'
          id='sponsorshipType'
          type='select'
          options={SPONSORSHIP_TYPE_OPTIONS}
          required
          value={formData.sponsorshipType}
          onChange={onChange}
        />
        <FormField
          label='Deliverables (what the brand receives)'
          id='deliverables'
          textarea
          required
          placeholder='List the deliverables the brand will receive as part of the sponsorship'
          value={formData.deliverables}
          onChange={onChange}
        />
      </div>
      <div className='flex justify-end'>
        <Button onClick={onNext} variant='primary'>
          Continue
        </Button>
      </div>
    </div>
  )
}
