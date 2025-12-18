import { SaveIcon, SendIcon } from 'lucide-react'
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
    setProductDetails,
    setDiscountDetails,
    setFinancialDetails,
    setOtherDetails,
    handleTypeToggle,
    handleSave
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
  return (
    <div className='mb-8'>
      {!organizerId && (
        <div className='text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4'>
          Complete your organizer profile to configure sponsorship requests.
        </div>
      )}
      {loading && (
        <div className='text-sm text-gray-600 mb-4'>
          Loading your sponsorship request...
        </div>
      )}
      <h2 className='text-xl font-bold text-gray-900 mb-6'>
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
    </div>
  )
}
