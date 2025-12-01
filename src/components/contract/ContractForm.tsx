import { ContractFormStep1 } from './ContractFormStep1'
import { ContractFormStep2 } from './ContractFormStep2'
import { useContractForm } from '../../hooks/useContractForm'
import {
  generateContractId,
  saveContractToLocalStorage
} from '../../utils/contractUtils'

import type { Contract } from '../../types'

interface ContractFormProps {
  brandName: string
  organizerName: string
  eventName: string
  matchId: string
  onContractCreated: (contractData: Contract) => void
}

export function ContractForm({
  brandName,
  organizerName,
  eventName,
  matchId,
  onContractCreated
}: ContractFormProps) {
  const {
    formData,
    step,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    nextStep,
    prevStep
  } = useContractForm()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      if (!formData.sponsorshipType || !formData.paymentTerms) {
        setIsSubmitting(false)
        return
      }

      const contractData: Contract = {
        id: generateContractId(),
        matchId,
        brandName,
        organizerName,
        eventName,
        ...formData,
        sponsorshipAmount: Number(formData.sponsorshipAmount) || 0,
        sponsorshipType: formData.sponsorshipType,
        paymentTerms: formData.paymentTerms,
        additionalTerms: formData.additionalTerms || undefined,
        createdAt: new Date().toISOString(),
        status: 'pending',
        brandApproved: false,
        organizerApproved: false
      }
      saveContractToLocalStorage(contractData)
      onContractCreated(contractData)
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>
        Create sponsorship agreement
      </h2>
      <p className='text-gray-600 mb-6'>
        This agreement will formalize the collaboration between {brandName} and{' '}
        {organizerName} for the event "{eventName}".
      </p>
      {step === 1 && (
        <ContractFormStep1
          formData={formData}
          onChange={handleChange}
          onNext={nextStep}
        />
      )}
      {step === 2 && (
        <ContractFormStep2
          formData={formData}
          onChange={handleChange}
          onPrev={prevStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
