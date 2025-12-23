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
    isEditMode,
    isSubmitting,
    loading,
    otherDetails,
    productDetails,
    selectedTypes,
    setDiscountDetails,
    setFinancialDetails,
    setIsEditMode,
    setOtherDetails,
    setProductDetails,
    sponsorshipTypes,
    status,
    updatedAt
  } = useBrandSponsorship(brandId)

  if (!brandId) {
    return (
      <div className='py-8'>
        <p className='text-gray-600'>
          Complete your brand profile to configure sponsorship offers.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='py-8'>
        <p className='text-gray-600'>Loading your sponsorship offer...</p>
      </div>
    )
  }

  // Display mode - show saved data with edit button
  if (!isEditMode && status && selectedTypes.length > 0) {
    return (
      <div className='space-y-4'>
        {/* Header with status and edit button */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
          <div className='flex items-center gap-3'>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {status === 'published' ? 'Published' : 'Draft'}
            </div>
            {updatedAt && (
              <span className='text-xs text-gray-500'>
                Updated {new Date(updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <Button
            variant='outline'
            onClick={() => setIsEditMode(true)}
            className='flex items-center gap-2 w-full sm:w-auto justify-center'
          >
            Edit
          </Button>
        </div>

        {/* Sponsorship types grid with details */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {sponsorshipTypes
            .filter((type) => selectedTypes.includes(type.id))
            .map((type) => {
              // Get details for this type
              let detailsContent = null

              if (type.id === 'financial' && financialDetails.amount) {
                detailsContent = (
                  <div className='mt-3 pt-3 border-t border-purple-200'>
                    <p className='font-semibold text-gray-900 text-base'>
                      {financialDetails.amount} SEK
                    </p>
                    <p className='text-xs text-gray-600 mt-1'>
                      {financialDetails.terms}
                    </p>
                  </div>
                )
              } else if (type.id === 'product' && productDetails.name) {
                detailsContent = (
                  <div className='mt-3 pt-3 border-t border-purple-200'>
                    <p className='font-semibold text-gray-900 text-sm'>
                      {productDetails.name}
                    </p>
                    {productDetails.quantity && (
                      <p className='text-xs text-gray-600 mt-1'>
                        {productDetails.quantity} units available
                      </p>
                    )}
                    {productDetails.description && (
                      <p className='text-xs text-gray-600 mt-1 line-clamp-2'>
                        {productDetails.description}
                      </p>
                    )}
                  </div>
                )
              } else if (type.id === 'discount' && discountDetails.code) {
                detailsContent = (
                  <div className='mt-3 pt-3 border-t border-purple-200'>
                    <p className='font-semibold text-gray-900 text-sm'>
                      {discountDetails.value}% off
                    </p>
                    <div className='flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-gray-600'>
                      <span>Code: {discountDetails.code}</span>
                      {discountDetails.validFrom && (
                        <span>From {discountDetails.validFrom}</span>
                      )}
                      {discountDetails.validTo && (
                        <span>To {discountDetails.validTo}</span>
                      )}
                    </div>
                  </div>
                )
              } else if (type.id === 'other' && otherDetails.title) {
                detailsContent = (
                  <div className='mt-3 pt-3 border-t border-purple-200'>
                    <p className='font-semibold text-gray-900 text-sm'>
                      {otherDetails.title}
                    </p>
                    {otherDetails.description && (
                      <p className='text-xs text-gray-600 mt-1 line-clamp-2'>
                        {otherDetails.description}
                      </p>
                    )}
                  </div>
                )
              }

              return (
                <div
                  key={type.id}
                  className='flex flex-col p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg'
                >
                  <div className='flex items-start gap-3'>
                    <type.icon className='h-5 w-5 text-purple-600 flex-shrink-0' />
                    <div className='min-w-0 flex-1'>
                      <p className='font-medium text-gray-900 text-sm'>{type.name}</p>
                      <p className='text-xs text-gray-600 mt-0.5'>
                        {type.description}
                      </p>
                    </div>
                  </div>
                  {detailsContent}
                </div>
              )
            })}
        </div>

        {feedback && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              feedback.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>
    )
  }

  // Edit mode - show full form
  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Status badge */}
      {status && (
        <div className='flex items-center gap-3'>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === 'published'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {status === 'published' ? 'Published' : 'Draft'}
          </div>
          {updatedAt && (
            <span className='text-xs text-gray-500'>
              Updated {new Date(updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Sponsorship type selection */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
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
        <div className='space-y-4'>
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
                    Amount (SEK)
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
      {/* Preview - simplified without nested cards */}
      {selectedTypes.length > 0 && (
        <div className='bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-lg border border-indigo-200'>
          <p className='text-sm font-medium text-gray-700 mb-3'>Preview</p>
          <div className='space-y-2'>
            {selectedTypes.includes('product') && productDetails.name && (
              <div className='flex items-center gap-2 text-sm text-gray-700'>
                <PackageIcon className='h-4 w-4 text-indigo-600 flex-shrink-0' />
                <span className='font-medium'>{productDetails.name}</span>
                {productDetails.quantity && (
                  <span className='text-gray-500'>({productDetails.quantity} units)</span>
                )}
              </div>
            )}
            {selectedTypes.includes('discount') && discountDetails.value && (
              <div className='flex items-center gap-2 text-sm text-gray-700'>
                <PercentIcon className='h-4 w-4 text-indigo-600 flex-shrink-0' />
                <span className='font-medium'>{discountDetails.value}% off</span>
                {discountDetails.code && (
                  <span className='text-gray-500'>({discountDetails.code})</span>
                )}
              </div>
            )}
            {selectedTypes.includes('financial') && financialDetails.amount && (
              <div className='flex items-center gap-2 text-sm text-gray-700'>
                <DollarSignIcon className='h-4 w-4 text-indigo-600 flex-shrink-0' />
                <span className='font-medium'>{financialDetails.amount} SEK</span>
              </div>
            )}
            {selectedTypes.includes('other') && otherDetails.title && (
              <div className='flex items-center gap-2 text-sm text-gray-700'>
                <PlusCircleIcon className='h-4 w-4 text-indigo-600 flex-shrink-0' />
                <span className='font-medium'>{otherDetails.title}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className='flex flex-col sm:flex-row gap-3 sm:justify-end'>
        <Button
          variant='outline'
          className='flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors w-full sm:w-auto'
          onClick={() => handleSave('draft')}
          disabled={isSubmitting || selectedTypes.length === 0 || !brandId}
        >
          <SaveIcon className='h-4 w-4' />
          Save Draft
        </Button>
        <Button
          variant='primary'
          className='flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 shadow-md hover:shadow-lg transition-all w-full sm:w-auto'
          onClick={() => handleSave('published')}
          disabled={isSubmitting || selectedTypes.length === 0 || !brandId}
        >
          <SendIcon className='h-4 w-4' />
          Publish Offer
        </Button>
      </div>
      {feedback && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  )
}
