import {
  DollarSignIcon,
  MegaphoneIcon,
  PackageIcon,
  PercentIcon,
  SaveIcon,
  SendIcon,
  StarIcon
} from 'lucide-react'
import React from 'react'

import { Button } from '../ui'
import { useOrganizerSponsorship } from '../../hooks/useOrganizerSponsorship'
import { type OrganizerRequestTypeId } from '../../types/sponsorship'
import { clampNumber } from '../../utils/validation'
import { SponsorshipTypeCard } from './SponsorshipTypeCard'

interface SponsorshipRequest {
  id: 'product' | 'discount' | 'financial' | 'media' | 'any'
  name: string
  description: string
  icon: React.ReactNode
  percentage: number
}

interface OrganizerSponsorshipPanelProps {
  organizerId?: string
}

export function OrganizerSponsorshipPanel({
  organizerId
}: OrganizerSponsorshipPanelProps) {
  const {
    selectedTypes,
    productDetails,
    discountDetails,
    financialDetails,
    allocation,
    isSubmitting,
    loading,
    status,
    updatedAt,
    feedback,
    setProductDetails,
    setDiscountDetails,
    setFinancialDetails,
    setAllocation,
    handleTypeToggle,
    handleAllocationChange,
    handleSave
  } = useOrganizerSponsorship(organizerId)

  const sponsorshipRequests: SponsorshipRequest[] = [
    {
      id: 'product',
      name: 'Product Sponsorship',
      description: 'Request in-kind items for your event',
      icon: <PackageIcon className='h-5 w-5' />,
      percentage: allocation.product
    },
    {
      id: 'discount',
      name: 'Discount Sponsorship',
      description: 'Request promotional discounts for attendees',
      icon: <PercentIcon className='h-5 w-5' />,
      percentage: allocation.discount
    },
    {
      id: 'financial',
      name: 'Financial Sponsorship',
      description: 'Request direct monetary support',
      icon: <DollarSignIcon className='h-5 w-5' />,
      percentage: allocation.financial
    },
    {
      id: 'media',
      name: 'Media & Promotion',
      description: 'Request shout-outs, placements, or coverage',
      icon: <MegaphoneIcon className='h-5 w-5' />,
      percentage: 0
    },
    {
      id: 'any',
      name: 'Any Combination',
      description: 'Open to any type of sponsorship support',
      icon: <div className='h-5 w-5' />,
      percentage: 100
    }
  ]
  // Generate a mock match preview based on selected options
  const generateMatchPreview = () => {
    const items = []
    if (selectedTypes.includes('product') || selectedTypes.includes('any')) {
      const productItem = productDetails.items || 'Product samples'
      const quantity = productDetails.quantity || '200'
      items.push(`${productItem} × ${quantity}`)
    }
    if (selectedTypes.includes('discount') || selectedTypes.includes('any')) {
      const discountValue = discountDetails.targetLevel || '15'
      items.push(`${discountValue}% off`)
    }
    if (selectedTypes.includes('financial') || selectedTypes.includes('any')) {
      const amount = financialDetails.maxAmount || '1,000'
      items.push(`€${amount} grant`)
    }
    if (selectedTypes.includes('media') || selectedTypes.includes('any')) {
      items.push('Media/PR placements')
    }
    return items.join(', ')
  }
  return (
    <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-indigo-100 relative overflow-hidden'>
      {!organizerId && (
        <div className='text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4'>
          Complete your organizer profile to configure sponsorship requests.
        </div>
      )}
      {loading && (
        <div className='text-sm text-gray-600'>
          Loading your sponsorship request...
        </div>
      )}
      {/* Mystical background elements */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-70'></div>
      <div className='absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50'></div>
      <div className='absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-full -ml-12 -mb-12 opacity-50'></div>
      {/* Stars background */}
      <div className='absolute inset-0 overflow-hidden opacity-5 pointer-events-none'>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className='absolute rounded-full bg-white'
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`
            }}
          />
        ))}
      </div>
      <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
        <span className='mr-2 text-2xl'>✧</span>
        What Sponsorship Do You Seek?
      </h2>
      {status && (
        <div className='mb-3 text-sm text-gray-600'>
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
        {sponsorshipRequests.map((type) => (
          <SponsorshipTypeCard
            key={type.id}
            id={type.id}
            title={type.name}
            description={type.description}
            icon={type.icon}
            selected={selectedTypes.includes(type.id)}
            onToggle={(id) => handleTypeToggle(id as OrganizerRequestTypeId)}
          />
        ))}
      </div>
      {/* Input fields for selected sponsorship types */}
      {selectedTypes.length > 0 && (
        <div className='space-y-8 mb-8'>
          {selectedTypes.includes('product') && (
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
                      setProductDetails({
                        ...productDetails,
                        items: e.target.value
                      })
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
          )}
          {selectedTypes.includes('discount') && (
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
          )}
          {selectedTypes.includes('financial') && (
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
                    Minimum Amount (€)
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
                    Maximum Amount (€)
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
          )}
          {selectedTypes.includes('media') && (
            <div className='bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 relative'>
              <div className='absolute -top-3 -left-3 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center'>
                <MegaphoneIcon className='h-3 w-3 text-brand-secondary' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Media & Promotion Request
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Preferred Channels
                  </label>
                  <input
                    type='text'
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm'
                    placeholder='e.g. Social, newsletter, onsite signage'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Key Message
                  </label>
                  <input
                    type='text'
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-indigo-500 sm:text-sm'
                    placeholder='e.g. Brand spotlight, special offer'
                  />
                </div>
              </div>
            </div>
          )}
          {selectedTypes.includes('any') && (
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
                      <PackageIcon className='h-4 w-4 mr-1 text-indigo-500' />{' '}
                      Product Sponsorship
                    </label>
                    <span className='text-sm text-gray-500'>
                      {allocation.product}%
                    </span>
                  </div>
                  <input
                    type='range'
                    min='0'
                    max='100'
                    value={allocation.product}
                    onChange={(e) =>
                      handleAllocationChange(
                        'product',
                        parseInt(e.target.value)
                      )
                    }
                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                  />
                </div>
                <div>
                  <div className='flex justify-between mb-1'>
                    <label className='text-sm font-medium text-gray-700 flex items-center'>
                      <PercentIcon className='h-4 w-4 mr-1 text-indigo-500' />{' '}
                      Discount Sponsorship
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
                      handleAllocationChange(
                        'discount',
                        parseInt(e.target.value)
                      )
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
                      handleAllocationChange(
                        'financial',
                        parseInt(e.target.value)
                      )
                    }
                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Match preview panel */}
      {selectedTypes.length > 0 && (
        <div className='bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8 relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -mr-12 -mt-12 opacity-50'></div>
          <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
            <StarIcon className='h-5 w-5 text-indigo-500 mr-2' />
            Instant Match Preview
          </h3>
          <div className='relative z-10'>
            <p className='text-gray-700 mb-4'>
              We'll connect you with brands able to offer:
            </p>
            <div className='bg-white p-4 rounded-lg shadow-sm border border-blue-100'>
              <p className='text-gray-800 font-medium'>
                {generateMatchPreview()}
              </p>
            </div>
            <p className='text-sm text-gray-500 mt-4'>
              This is an estimate based on your requirements and available
              sponsors in our network.
            </p>
          </div>
          {/* Constellation decoration */}
          <div className='absolute bottom-4 right-4 text-blue-200 opacity-30 flex'>
            <div className='h-2 w-2 rounded-full bg-indigo-400 mr-1'></div>
            <div className='h-1 w-1 rounded-full bg-indigo-400 mr-3 mt-1'></div>
            <div className='h-2 w-2 rounded-full bg-indigo-400 mr-1'></div>
            <div className='h-1 w-1 rounded-full bg-indigo-400 mr-1 mt-1'></div>
            <div className='h-2 w-2 rounded-full bg-indigo-400'></div>
          </div>
        </div>
      )}
      {/* Action buttons */}
      <div className='flex justify-end space-x-4'>
        <Button
          variant='outline'
          className='flex items-center hover:bg-indigo-50 transition-colors'
          onClick={() => handleSave('draft')}
          disabled={isSubmitting || selectedTypes.length === 0 || !organizerId}
        >
          <SaveIcon className='h-4 w-4 mr-2' />
          Save Draft
        </Button>
        <Button
          variant='primary'
          className='flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 shadow-md hover:shadow-lg transition-all'
          onClick={() => handleSave('published')}
          disabled={isSubmitting || selectedTypes.length === 0 || !organizerId}
        >
          <SendIcon className='h-4 w-4 mr-2' />
          Publish Request
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
      <div className='absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-70'></div>
    </div>
  )
}
