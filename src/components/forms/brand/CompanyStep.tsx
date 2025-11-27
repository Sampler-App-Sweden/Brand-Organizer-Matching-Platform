import { BuildingIcon } from 'lucide-react'
import { FormField } from '../../ui'
import { BrandFormData } from '../../../hooks/useBrandForm'

interface CompanyStepProps {
  formData: BrandFormData
  errors: Record<string, string>
  currentUser: { id: string; email: string; type: string } | null
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
}

export function CompanyStep({
  formData,
  errors,
  currentUser,
  onChange
}: CompanyStepProps) {
  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
        <BuildingIcon className='h-5 w-5 text-indigo-500 mr-2' />
        Company Information
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          label='Company Name'
          id='companyName'
          required
          value={formData.companyName}
          onChange={onChange}
          error={errors.companyName}
        />
        <FormField
          label='Contact Name'
          id='contactName'
          required
          value={formData.contactName}
          onChange={onChange}
          error={errors.contactName}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          label='Contact Title/Position'
          id='contactTitle'
          value={formData.contactTitle}
          onChange={onChange}
        />
        <FormField
          label='Phone Number'
          id='phone'
          type='tel'
          value={formData.phone}
          onChange={onChange}
        />
      </div>

      <FormField
        label='Email Address'
        id='email'
        type='email'
        required
        value={formData.email}
        onChange={onChange}
        error={errors.email}
        disabled={!!currentUser}
      />

      {!currentUser && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            label='Password'
            id='password'
            type='password'
            required
            value={formData.password}
            onChange={onChange}
            error={errors.password}
          />
          <FormField
            label='Confirm Password'
            id='confirmPassword'
            type='password'
            required
            value={formData.confirmPassword}
            onChange={onChange}
            error={errors.confirmPassword}
          />
        </div>
      )}

      <FormField
        label='Website'
        id='website'
        type='url'
        value={formData.website}
        onChange={onChange}
      />

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-1'>
          <FormField
            label='Address'
            id='address'
            value={formData.address}
            onChange={onChange}
          />
        </div>
        <FormField
          label='Postal Code'
          id='postalCode'
          value={formData.postalCode}
          onChange={onChange}
        />
        <FormField
          label='City'
          id='city'
          value={formData.city}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
