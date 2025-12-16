import { clampNumber } from '../../../utils/validation'
import { PackageIcon } from 'lucide-react'

interface ProductSponsorshipInputProps {
  productDetails: { items: string; quantity: string }
  setProductDetails: (details: { items: string; quantity: string }) => void
}

export function ProductSponsorshipInput({
  productDetails,
  setProductDetails
}: ProductSponsorshipInputProps) {
  return (
    <div className='bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 relative'>
      <div className='absolute -top-3 -left-3 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center'>
        <PackageIcon className='h-3 w-3 text-blue-600' />
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-4'>
        Product Sponsorship Request
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Desired Items
          </label>
          <input
            type='text'
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            placeholder='e.g. Coffee beans, T-shirts, Water bottles'
            value={productDetails.items}
            onChange={(e) =>
              setProductDetails({ ...productDetails, items: e.target.value })
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Desired Quantity
          </label>
          <input
            type='number'
            min={0}
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            placeholder='e.g. 200'
            value={productDetails.quantity}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                quantity: clampNumber(e.target.value)
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
