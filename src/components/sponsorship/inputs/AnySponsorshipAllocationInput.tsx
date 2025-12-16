
import { PackageIcon, PercentIcon, DollarSignIcon } from 'lucide-react'

interface AnySponsorshipAllocationInputProps {
  allocation: { product: number; discount: number; financial: number }
  handleAllocationChange: (
    type: 'product' | 'discount' | 'financial',
    value: number
  ) => void
}

export function AnySponsorshipAllocationInput({
  allocation,
  handleAllocationChange
}: AnySponsorshipAllocationInputProps) {
  return (
    <div className='bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 relative'>
      <div className='absolute -top-3 -left-3 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center'>
        <div className='h-3 w-3 text-indigo-600' />
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-4'>
        Sponsorship Allocation
      </h3>
      <p className='text-sm text-gray-500 mb-4'>
        Adjust the sliders to specify how much of each type you need.
      </p>
      <div className='space-y-6'>
        <div>
          <div className='flex justify-between mb-1'>
            <label className='text-sm font-medium text-gray-700 flex items-center'>
              <PackageIcon className='h-4 w-4 mr-1 text-indigo-500' /> Product
              Sponsorship
            </label>
            <span className='text-sm text-gray-500'>{allocation.product}%</span>
          </div>
          <input
            type='range'
            min='0'
            max='100'
            value={allocation.product}
            onChange={(e) =>
              handleAllocationChange('product', parseInt(e.target.value))
            }
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
          />
        </div>
        <div>
          <div className='flex justify-between mb-1'>
            <label className='text-sm font-medium text-gray-700 flex items-center'>
              <PercentIcon className='h-4 w-4 mr-1 text-indigo-500' /> Discount
              Sponsorship
            </label>
            <span className='text-sm text-gray-500'>
              {allocation.discount}%
            </span>
          </div>
          <input
            type='range'
            min='0'
            max='100'
            value={allocation.discount}
            onChange={(e) =>
              handleAllocationChange('discount', parseInt(e.target.value))
            }
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
          />
        </div>
        <div>
          <div className='flex justify-between mb-1'>
            <label className='text-sm font-medium text-gray-700 flex items-center'>
              <DollarSignIcon className='h-4 w-4 mr-1 text-indigo-500' />{' '}
              Financial Sponsorship
            </label>
            <span className='text-sm text-gray-500'>
              {allocation.financial}%
            </span>
          </div>
          <input
            type='range'
            min='0'
            max='100'
            value={allocation.financial}
            onChange={(e) =>
              handleAllocationChange('financial', parseInt(e.target.value))
            }
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
          />
        </div>
      </div>
    </div>
  )
}
