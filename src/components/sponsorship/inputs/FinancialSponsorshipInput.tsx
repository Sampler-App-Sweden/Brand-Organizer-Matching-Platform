import { clampNumber } from '../../../utils/validation'
import { DollarSignIcon } from 'lucide-react'

interface FinancialSponsorshipInputProps {
  financialDetails: {
    minAmount: string
    maxAmount: string
    paymentWindow: string
  }
  setFinancialDetails: (details: {
    minAmount: string
    maxAmount: string
    paymentWindow: string
  }) => void
}

export function FinancialSponsorshipInput({
  financialDetails,
  setFinancialDetails
}: FinancialSponsorshipInputProps) {
  return (
    <div className='bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 relative'>
      <div className='absolute -top-3 -left-3 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center'>
        <DollarSignIcon className='h-3 w-3 text-indigo-600' />
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-4'>
        Financial Sponsorship Request
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Minimum Amount (SEK)
          </label>
          <input
            type='number'
            min={0}
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            placeholder='e.g. 500'
            value={financialDetails.minAmount}
            onChange={(e) =>
              setFinancialDetails({
                ...financialDetails,
                minAmount: clampNumber(e.target.value)
              })
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Maximum Amount (SEK)
          </label>
          <input
            type='number'
            min={0}
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            placeholder='e.g. 2000'
            value={financialDetails.maxAmount}
            onChange={(e) =>
              setFinancialDetails({
                ...financialDetails,
                maxAmount: clampNumber(e.target.value)
              })
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Payment Window
          </label>
          <select
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            value={financialDetails.paymentWindow}
            onChange={(e) =>
              setFinancialDetails({
                ...financialDetails,
                paymentWindow: e.target.value
              })
            }
          >
            <option value='before'>Before event</option>
            <option value='split'>Split (before/after)</option>
            <option value='after'>After event</option>
            <option value='flexible'>Flexible</option>
          </select>
        </div>
      </div>
    </div>
  )
}
