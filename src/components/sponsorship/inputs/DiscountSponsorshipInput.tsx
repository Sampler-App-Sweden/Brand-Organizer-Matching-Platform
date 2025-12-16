import { clampNumber } from '../../../utils/validation'
import { PercentIcon } from 'lucide-react'

interface DiscountSponsorshipInputProps {
  discountDetails: { targetLevel: string; expectedVolume: string }
  setDiscountDetails: (details: {
    targetLevel: string
    expectedVolume: string
  }) => void
}

export function DiscountSponsorshipInput({
  discountDetails,
  setDiscountDetails
}: DiscountSponsorshipInputProps) {
  return (
    <div className='bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 relative'>
      <div className='absolute -top-3 -left-3 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center'>
        <PercentIcon className='h-3 w-3 text-blue-600' />
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-4'>
        Discount Sponsorship Request
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Target Discount Level (%)
          </label>
          <input
            type='number'
            min={0}
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            placeholder='e.g. 15'
            value={discountDetails.targetLevel}
            onChange={(e) =>
              setDiscountDetails({
                ...discountDetails,
                targetLevel: clampNumber(e.target.value)
              })
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Expected Volume (# of uses)
          </label>
          <input
            type='number'
            min={0}
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            placeholder='e.g. 500'
            value={discountDetails.expectedVolume}
            onChange={(e) =>
              setDiscountDetails({
                ...discountDetails,
                expectedVolume: clampNumber(e.target.value)
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
