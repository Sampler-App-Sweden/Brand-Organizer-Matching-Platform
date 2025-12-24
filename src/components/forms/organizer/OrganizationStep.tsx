import { BuildingIcon } from 'lucide-react'

import { OrganizerFormData } from '../../../hooks/useOrganizerForm'
import { FormField } from '../../ui'

interface OrganizationStepProps {
  formData: OrganizerFormData
  errors: Record<string, string>
  currentUser: { email?: string } | null
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
}

export function OrganizationStep({
  formData,
  errors,
  currentUser,
  onChange
}: OrganizationStepProps) {
  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
        <BuildingIcon className='h-5 w-5 text-indigo-500 mr-2' />
        Organization Information
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          label='Organization Name'
          id='organizerName'
          required
          value={formData.organizerName}
          onChange={onChange}
          error={errors.organizerName}
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

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Email Address
        </label>
        <input
          type='email'
          value={currentUser?.email || ''}
          disabled
          className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed'
        />
        <p className='mt-1 text-xs text-gray-500'>
          Your email is linked to your account and cannot be changed here.
        </p>
      </div>

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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          label='Phone Number'
          id='phone'
          type='tel'
          value={formData.phone}
          onChange={onChange}
        />
        <FormField
          label='Website'
          id='website'
          type='url'
          value={formData.website}
          onChange={onChange}
        />
      </div>

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
          required
          value={formData.city}
          onChange={onChange}
          error={errors.city}
        />
      </div>
    </div>
  )
}
