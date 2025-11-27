import { PackageIcon } from 'lucide-react'
import { FormField } from '../../ui'
import { BrandFormData } from '../../../hooks/useBrandForm'
import { industryOptions } from '../../../constants/brandFormOptions'

interface ProductStepProps {
  formData: BrandFormData
  errors: Record<string, string>
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
}

export function ProductStep({ formData, errors, onChange }: ProductStepProps) {
  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
        <PackageIcon className='h-5 w-5 text-indigo-500 mr-2' />
        Product Information
      </h2>

      <FormField
        label='Industry'
        id='industry'
        type='select'
        options={industryOptions}
        required
        value={formData.industry}
        onChange={onChange}
        error={errors.industry}
      />

      <FormField
        label='Product Name'
        id='productName'
        required
        value={formData.productName}
        onChange={onChange}
        error={errors.productName}
      />

      <FormField
        label='Product Description'
        id='productDescription'
        textarea
        required
        value={formData.productDescription}
        onChange={onChange}
        error={errors.productDescription}
        helpText='Describe your product, its features, and what makes it unique'
      />

      <FormField
        label='Product Quantity Available for Sampling'
        id='productQuantity'
        placeholder='e.g., 500 samples, 1000 units, etc.'
        value={formData.productQuantity}
        onChange={onChange}
      />
    </div>
  )
}
