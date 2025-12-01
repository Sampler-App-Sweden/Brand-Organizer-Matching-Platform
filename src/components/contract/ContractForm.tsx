import { ContractFormStep1 } from './ContractFormStep1'
import { ContractFormStep2 } from './ContractFormStep2'
import { useContractForm } from '../../hooks/useContractForm'
import {
  generateContractId,
  saveContractToLocalStorage
} from '../../utils/contractUtils'

interface ContractFormProps {
  brandName: string
  organizerName: string
  eventName: string
  matchId: string
  onContractCreated: (contractData: any) => void
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
    setFormData,
    step,
    setStep,
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
      const contractData = {
        id: generateContractId(),
        matchId,
        brandName,
        organizerName,
        eventName,
        ...formData,
        createdAt: new Date(),
        status: 'pending'
      }
      saveContractToLocalStorage(contractData)
      onContractCreated(contractData)
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>
        Skapa sponsringsavtal
      </h2>
      <p className='text-gray-600 mb-6'>
        Detta avtal kommer att formalisera samarbetet mellan {brandName} och{' '}
        {organizerName} för eventet "{eventName}".
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
