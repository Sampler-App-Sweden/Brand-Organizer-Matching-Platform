import {
  DollarSignIcon,
  PackageIcon,
  PercentIcon,
  PlusCircleIcon,
  SaveIcon,
  SendIcon
} from 'lucide-react'
import React from 'react'

import { useOrganizerSponsorship } from '../../hooks/useOrganizerSponsorship'
import { OrganizerRequestTypeId } from '../../types/sponsorship'
import { Button } from '../ui'
import { baseSponsorshipRequests } from './constants/organizerSponsorshipRequests'
import {
  DiscountSponsorshipInput,
  FinancialSponsorshipInput,
  MediaSponsorshipInput,
  OtherSponsorshipInput,
  ProductSponsorshipInput
} from './inputs'
import { MatchPreview } from './MatchPreview'
import { SponsorshipTypeCard } from './SponsorshipTypeCard'
import { generateMatchPreview } from './utils/sponsorshipUtils'

interface SponsorshipRequest {
  id: 'product' | 'discount' | 'financial' | 'media' | 'other'
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
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
    otherDetails,
    isSubmitting,
    loading,
    status,
    updatedAt,
    feedback,
    isEditMode,
    setProductDetails,
    setDiscountDetails,
    setFinancialDetails,
    setOtherDetails,
    handleTypeToggle,
    handleSave,
    setIsEditMode
  } = useOrganizerSponsorship(organizerId)

  const sponsorshipRequests: SponsorshipRequest[] = baseSponsorshipRequests.map(
    (req) => ({
      ...req,
      percentage:
        req.id === 'product'
          ? allocation.product
          : req.id === 'discount'
          ? allocation.discount
          : req.id === 'financial'
          ? allocation.financial
          : 0
    })
  )
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

        {/* Sponsorship types grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {sponsorshipRequests
            .filter((type) => selectedTypes.includes(type.id))
            .map((type) => (
              <div
                key={type.id}
                className='flex items-start gap-3 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg'
              >
                <type.icon className='h-5 w-5 text-indigo-600 flex-shrink-0' />
                <div className='min-w-0 flex-1'>
                  <p className='font-medium text-gray-900 text-sm'>{type.name}</p>
                  <p className='text-xs text-gray-600 mt-0.5 line-clamp-2'>
                    {type.description}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Details cards */}
        <div className='space-y-3'>
          {selectedTypes.includes('product') && productDetails.items && (
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <div className='flex items-start gap-3'>
                <PackageIcon className='h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5' />
                <div className='min-w-0 flex-1'>
                  <p className='font-medium text-gray-900 text-sm'>
                    {productDetails.items}
                  </p>
                  {productDetails.quantity && (
                    <p className='text-xs text-gray-600 mt-1'>
                      Quantity: {productDetails.quantity}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedTypes.includes('discount') && (discountDetails.targetLevel || discountDetails.expectedVolume) && (
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <div className='flex items-start gap-3'>
                <PercentIcon className='h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5' />
                <div className='min-w-0 flex-1'>
                  {discountDetails.targetLevel && (
                    <p className='font-medium text-gray-900 text-sm'>
                      {discountDetails.targetLevel}% discount
                    </p>
                  )}
                  {discountDetails.expectedVolume && (
                    <p className='text-xs text-gray-600 mt-1'>
                      Expected volume: {discountDetails.expectedVolume}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedTypes.includes('financial') && (financialDetails.minAmount || financialDetails.maxAmount) && (
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <div className='flex items-start gap-3'>
                <DollarSignIcon className='h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5' />
                <div className='min-w-0 flex-1'>
                  <p className='font-medium text-gray-900 text-sm'>
                    {financialDetails.minAmount && `${financialDetails.minAmount} SEK`}
                    {financialDetails.minAmount && financialDetails.maxAmount && ' - '}
                    {financialDetails.maxAmount && `${financialDetails.maxAmount} SEK`}
                  </p>
                  <p className='text-xs text-gray-600 mt-1'>
                    {financialDetails.paymentWindow}
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTypes.includes('other') && otherDetails.title && (
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <div className='flex items-start gap-3'>
                <PlusCircleIcon className='h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5' />
                <div className='min-w-0 flex-1'>
                  <p className='font-medium text-gray-900 text-sm'>
                    {otherDetails.title}
                  </p>
                  <p className='text-sm text-gray-700 mt-1'>
                    {otherDetails.description}
                  </p>
                </div>
              </div>
            </div>
          )}
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
      {!organizerId && (
        <div className='text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
          Complete your organizer profile to configure sponsorship requests.
        </div>
      )}
      {loading && (
        <div className='text-sm text-gray-600'>
          Loading your sponsorship request...
        </div>
      )}

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
        <div className='space-y-4'>
          {selectedTypes.includes('product') && (
            <ProductSponsorshipInput
              productDetails={productDetails}
              setProductDetails={setProductDetails}
            />
          )}
          {selectedTypes.includes('discount') && (
            <DiscountSponsorshipInput
              discountDetails={discountDetails}
              setDiscountDetails={setDiscountDetails}
            />
          )}
          {selectedTypes.includes('financial') && (
            <FinancialSponsorshipInput
              financialDetails={financialDetails}
              setFinancialDetails={setFinancialDetails}
            />
          )}
          {selectedTypes.includes('media') && <MediaSponsorshipInput />}
          {selectedTypes.includes('other') && (
            <OtherSponsorshipInput
              otherDetails={otherDetails}
              setOtherDetails={setOtherDetails}
            />
          )}
        </div>
      )}
      {/* Match preview panel */}
      {selectedTypes.length > 0 && (
        <MatchPreview
          matchText={generateMatchPreview(
            selectedTypes,
            productDetails,
            discountDetails,
            financialDetails,
            otherDetails
          )}
        />
      )}

      {/* Action buttons */}
      <div className='flex flex-col sm:flex-row gap-3 sm:justify-end'>
        <Button
          variant='outline'
          className='flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors w-full sm:w-auto'
          onClick={() => handleSave('draft')}
          disabled={isSubmitting || selectedTypes.length === 0 || !organizerId}
        >
          <SaveIcon className='h-4 w-4' />
          Save Draft
        </Button>
        <Button
          variant='primary'
          className='flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 shadow-md hover:shadow-lg transition-all w-full sm:w-auto'
          onClick={() => handleSave('published')}
          disabled={isSubmitting || selectedTypes.length === 0 || !organizerId}
        >
          <SendIcon className='h-4 w-4' />
          Publish Request
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
