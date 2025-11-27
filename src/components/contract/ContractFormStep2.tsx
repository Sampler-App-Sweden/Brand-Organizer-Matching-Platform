import { FormField } from '../ui'
import { Button } from '../ui'
import { PAYMENT_TERMS_OPTIONS } from '../../constants/contractFormOptions'

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
            label='Startdatum'
            id='startDate'
            type='date'
            required
            value={formData.startDate}
            onChange={onChange}
          />
          <FormField
            label='Slutdatum'
            id='endDate'
            type='date'
            required
            value={formData.endDate}
            onChange={onChange}
          />
        </div>
        <FormField
          label='Betalningsvillkor'
          id='paymentTerms'
          type='select'
          options={PAYMENT_TERMS_OPTIONS}
          required
          value={formData.paymentTerms}
          onChange={onChange}
        />
        <FormField
          label='Avbokningspolicy'
          id='cancellationPolicy'
          textarea
          required
          placeholder="Beskriv villkoren för avbokning, t.ex. '50% återbetalning vid avbokning 30 dagar före eventet'"
          value={formData.cancellationPolicy}
          onChange={onChange}
        />
        <FormField
          label='Ytterligare villkor (valfritt)'
          id='additionalTerms'
          textarea
          placeholder='Lägg till eventuella ytterligare villkor eller noteringar'
          value={formData.additionalTerms}
          onChange={onChange}
        />
      </div>
      <div className='flex justify-between'>
        <Button onClick={onPrev} variant='outline' type='button'>
          Tillbaka
        </Button>
        <Button type='submit' variant='primary' disabled={isSubmitting}>
          {isSubmitting ? 'Skapar avtal...' : 'Skapa avtal'}
        </Button>
      </div>
    </form>
  )
}
