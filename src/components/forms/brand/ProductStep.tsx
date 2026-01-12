import { PackageIcon } from 'lucide-react'

import { industryOptions } from '../../../constants/brandFormOptions'
import { BrandFormData } from '../../../hooks/useBrandForm'
import { formatBusinessText } from '../../../utils/formatting'
import { FormField } from '../../ui'

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
  const handleCustomIndustryBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const formatted = formatBusinessText(e.target.value)
    // Create a synthetic event with the formatted value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'customIndustry',
        value: formatted
      }
    } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    onChange(syntheticEvent)
  }

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

      {formData.industry === 'other' && (
        <FormField
          label='Specify Industry'
          id='customIndustry'
          required
          value={formData.customIndustry}
          onChange={onChange}
          onBlur={handleCustomIndustryBlur}
          error={errors.customIndustry}
          placeholder='e.g., Arts & Culture'
          helpText='First letter of each word will be capitalized, "and" will be replaced with "&"'
        />
      )}

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
