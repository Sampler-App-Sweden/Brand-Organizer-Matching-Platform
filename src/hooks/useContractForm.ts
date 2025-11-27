import { useState } from 'react'

export interface ContractFormData {
  sponsorshipAmount: string
  sponsorshipType: string
  deliverables: string
  startDate: string
  endDate: string
  paymentTerms: string
  cancellationPolicy: string
  additionalTerms: string
}

export function useContractForm() {
  const [formData, setFormData] = useState<ContractFormData>({
    sponsorshipAmount: '',
    sponsorshipType: '',
    deliverables: '',
    startDate: '',
    endDate: '',
    paymentTerms: '',
    cancellationPolicy: '',
    additionalTerms: ''
  })
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => setStep((s) => s + 1)
  const prevStep = () => setStep((s) => s - 1)

  return {
    formData,
    setFormData,
    step,
    setStep,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    nextStep,
    prevStep
  }
}
