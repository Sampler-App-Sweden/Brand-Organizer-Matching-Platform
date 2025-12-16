import {
  DollarSignIcon,
  PackageIcon,
  PercentIcon,
  PlusCircleIcon,
  SaveIcon,
  SendIcon
} from 'lucide-react'

import { Button } from '../ui'
import { useBrandSponsorship } from '../../hooks/useBrandSponsorship'
import { type SponsorshipTypeId } from '../../types/sponsorship'
import { clampNumber } from '../../utils/validation'
import { toTitleCase } from '../../utils/formatting'
import { SponsorshipTypeCard } from './SponsorshipTypeCard'

interface BrandSponsorshipPanelProps {
  brandId?: string
}

export function BrandSponsorshipPanel({ brandId }: BrandSponsorshipPanelProps) {
  const {
    discountDetails,
    feedback,
    financialDetails,
    handleSave,
    handleTypeToggle,
    isSubmitting,
    loading,
    otherDetails,
    productDetails,
    selectedTypes,
    setDiscountDetails,
    setFinancialDetails,
    setOtherDetails,
    setProductDetails,
    sponsorshipTypes,
    status,
    updatedAt
  } = useBrandSponsorship(brandId)

  if (!brandId) {
    return (
      <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-indigo-100'>
        <p className='text-gray-600'>
          Complete your brand profile to configure sponsorship offers.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-indigo-100'>
        <p className='text-gray-600'>Loading your sponsorship offer...</p>
      </div>
    )
  }
  return (
    <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-indigo-100 relative overflow-hidden'>
      {/* Mystical background elements */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-70'></div>
      <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50'></div>
      <div className='absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-full -ml-12 -mb-12 opacity-50'></div>
      <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
        <span className='mr-2 text-2xl'>✦</span>
        Choose Your Sponsorship Type
      </h2>
      {status && (
        <div className='mb-4 text-sm text-gray-600'>
          Current status:{' '}
          <span
            className={
              status === 'published'
                ? 'text-green-600 font-medium'
                : 'text-yellow-600 font-medium'
            }
          >
            {status === 'published' ? 'Published' : 'Draft'}
          </span>
          {updatedAt && ` • Last saved ${new Date(updatedAt).toLocaleString()}`}
        </div>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {sponsorshipTypes.map((type) => (
          <SponsorshipTypeCard
            key={type.id}
            id={type.id}
            title={type.name}
            description={type.description}
            icon={type.icon}
            selected={selectedTypes.includes(type.id)}
            onToggle={(id) => handleTypeToggle(id as SponsorshipTypeId)}
          />
        ))}
      </div>
      {/* Input fields for selected sponsorship types */}
      {selectedTypes.length > 0 && (
        <div className='space-y-8 mb-8'>
          {selectedTypes.includes('product') && (
            <div className='bg-gray-50 p-6 rounded-lg border border-gray-200 relative'>
              <div className='absolute -top-3 -left-3 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center'>
                <PackageIcon className='h-3 w-3 text-indigo-600' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Product Sponsorship Details
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Product Name
                  </label>
                  <input
                    type='text'
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    value={productDetails.name}
                    onChange={(e) =>
                      setProductDetails({
                        ...productDetails,
                        name: e.target.value
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Available Quantity
                  </label>
                  <input
                    type='number'
                    min={0}
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    value={productDetails.quantity}
                    onChange={(e) =>
                      setProductDetails({
                        ...productDetails,
                        quantity: clampNumber(e.target.value)
                      })
                    }
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    value={productDetails.description}
                    onChange={(e) =>
                      setProductDetails({
                        ...productDetails,
                        description: e.target.value
                      })
                    }
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          {selectedTypes.includes('discount') && (
            <div className='bg-gray-50 p-6 rounded-lg border border-gray-200 relative'>
              <div className='absolute -top-3 -left-3 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center'>
                <PercentIcon className='h-3 w-3 text-indigo-600' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Discount Sponsorship Details
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Promo Code
                  </label>
                  <input
                    type='text'
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    value={discountDetails.code}
                    onChange={(e) =>
                      setDiscountDetails({
                        ...discountDetails,
                        code: e.target.value
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Discount Value (%)
                  </label>
                  <input
                    type='number'
                    min={0}
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    value={discountDetails.value}
                    onChange={(e) =>
                      setDiscountDetails({
                        ...discountDetails,
                        value: clampNumber(e.target.value)
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Valid From
                  </label>
                  <input
                    type='date'
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    value={discountDetails.validFrom}
                    onChange={(e) =>
                      setDiscountDetails({
                        ...discountDetails,
                        validFrom: e.target.value
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Valid To
                  </label>
                  <input
                    type='date'
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    value={discountDetails.validTo}
                    onChange={(e) =>
                      setDiscountDetails({
                        ...discountDetails,
                        validTo: e.target.value
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {selectedTypes.includes('financial') && (
            <div className='bg-gray-50 p-6 rounded-lg border border-gray-200 relative'>
              <div className='absolute -top-3 -left-3 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center'>
                <DollarSignIcon className='h-3 w-3 text-indigo-600' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Financial Sponsorship Details
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Amount (€)
                  </label>
                  <input
                    type='number'
                    min={0}
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    value={financialDetails.amount}
                    onChange={(e) =>
                      setFinancialDetails({
                        ...financialDetails,
                        amount: clampNumber(e.target.value)
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Payment Terms
                  </label>
                  <select
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    value={financialDetails.terms}
                    onChange={(e) =>
                      setFinancialDetails({
                        ...financialDetails,
                        terms: e.target.value
                      })
                    }
                  >
                    <option value='upfront'>Full payment upfront</option>
                    <option value='installments'>
                      Installments (50% upfront, 50% after)
                    </option>
                    <option value='post-event'>Full payment after event</option>
                    <option value='custom'>Custom terms</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {selectedTypes.includes('other') && (
            <div className='bg-gray-50 p-6 rounded-lg border border-gray-200 relative'>
              <div className='absolute -top-3 -left-3 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center'>
                <PlusCircleIcon className='h-3 w-3 text-indigo-600' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Other Sponsorship Details
              </h3>
              <div className='grid grid-cols-1 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Sponsorship Title
                  </label>
                  <input
                    type='text'
                    placeholder='e.g., Media Coverage, Venue Access, etc.'
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    value={otherDetails.title}
                    onChange={(e) =>
                      setOtherDetails({
                        ...otherDetails,
                        title: e.target.value
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder='Describe what you are offering...'
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    value={otherDetails.description}
                    onChange={(e) =>
                      setOtherDetails({
                        ...otherDetails,
                        description: e.target.value
                      })
                    }
                  ></textarea>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Preview summary panel */}
      {selectedTypes.length > 0 && (
        <div className='bg-indigo-50 p-6 rounded-lg border border-indigo-100 mb-8 relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full -mr-12 -mt-12 opacity-50'></div>
          <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
            <span className='text-indigo-500 mr-2'>✧</span>
            Sponsorship Summary
          </h3>
          <div className='relative z-10'>
            <p className='text-gray-700 mb-4'>You're offering:</p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {selectedTypes.includes('product') && (
                <div className='bg-white p-4 rounded-lg shadow-sm border border-indigo-100'>
                  <div className='flex items-center mb-2'>
                    <PackageIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    <span className='font-medium text-gray-900'>Product</span>
                  </div>
                  <div className='text-sm text-gray-500'>
                    {productDetails.name && `${productDetails.name}`}
                    {productDetails.quantity &&
                      ` (${productDetails.quantity} units)`}
                  </div>
                </div>
              )}
              {selectedTypes.includes('discount') && (
                <div className='bg-white p-4 rounded-lg shadow-sm border border-indigo-100'>
                  <div className='flex items-center mb-2'>
                    <PercentIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    <span className='font-medium text-gray-900'>Discount</span>
                  </div>
                  <div className='text-sm text-gray-500'>
                    {discountDetails.value &&
                      `${discountDetails.value}% off`}
                    {discountDetails.code && ` (${discountDetails.code})`}
                  </div>
                </div>
              )}
              {selectedTypes.includes('financial') && (
                <div className='bg-white p-4 rounded-lg shadow-sm border border-indigo-100'>
                  <div className='flex items-center mb-2'>
                    <DollarSignIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    <span className='font-medium text-gray-900'>Financial</span>
                  </div>
                  <div className='text-sm text-gray-500'>
                    {financialDetails.amount &&
                      `€${financialDetails.amount}`}
                  </div>
                </div>
              )}
              {selectedTypes.includes('other') && (
                <div className='bg-white p-4 rounded-lg shadow-sm border border-indigo-100'>
                  <div className='flex items-center mb-2'>
                    <PlusCircleIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    <span className='font-medium text-gray-900'>
                      {otherDetails.title ? toTitleCase(otherDetails.title) : 'Other'}
                    </span>
                  </div>
                  <div className='text-sm text-gray-500'>
                    {otherDetails.description || 'Custom sponsorship'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Action buttons */}
      <div className='flex justify-end space-x-4'>
        <Button
          variant='outline'
          className='flex items-center hover:bg-indigo-50 transition-colors'
          onClick={() => handleSave('draft')}
          disabled={isSubmitting || selectedTypes.length === 0 || !brandId}
        >
          <SaveIcon className='h-4 w-4 mr-2' />
          Save Draft
        </Button>
        <Button
          variant='primary'
          className='flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 shadow-md hover:shadow-lg transition-all'
          onClick={() => handleSave('published')}
          disabled={isSubmitting || selectedTypes.length === 0 || !brandId}
        >
          <SendIcon className='h-4 w-4 mr-2' />
          Publish Offer
        </Button>
      </div>
      {feedback && (
        <div
          className={`mt-4 rounded-md border px-4 py-2 text-sm ${
            feedback.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {feedback.message}
        </div>
      )}
      {/* Mystical decorative elements */}
      <div className='absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-70'></div>
    </div>
  )
}
