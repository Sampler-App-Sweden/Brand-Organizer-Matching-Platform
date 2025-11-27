import { useState } from 'react'
import { Button } from '../ui'
import { CheckCircleIcon } from 'lucide-react'

export function ContractDetails({ contract }: { contract: any }) {
  const [brandApproved, setBrandApproved] = useState(
    contract.brandApproved || false
  )
  const [organizerApproved, setOrganizerApproved] = useState(
    contract.organizerApproved || false
  )

  const handleApprove = (party: 'brand' | 'organizer') => {
    // In a real app, this would update the server
    if (party === 'brand') setBrandApproved(true)
    if (party === 'organizer') setOrganizerApproved(true)
    // Optionally update localStorage or backend here
  }

  const isFullyApproved = brandApproved && organizerApproved

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>
        Sponsorship Agreement
      </h2>
      <div
        className={`rounded px-3 py-2 mb-6 font-medium text-sm ${
          isFullyApproved
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {isFullyApproved ? 'Approved' : 'Awaiting approval'}
      </div>
      <div className='space-y-6'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Brand</h3>
            <p className='text-gray-900'>{contract.brandName}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Organizer</h3>
            <p className='text-gray-900'>{contract.organizerName}</p>
          </div>
        </div>
        <div>
          <h3 className='text-sm font-medium text-gray-500'>Event</h3>
          <p className='text-gray-900'>{contract.eventName}</p>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>
              Sponsorship Amount
            </h3>
            <p className='text-gray-900'>{contract.sponsorshipAmount} SEK</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>
              Sponsorship Type
            </h3>
            <p className='text-gray-900'>
              {contract.sponsorshipType === 'financial'
                ? 'Financial sponsorship'
                : contract.sponsorshipType === 'product'
                ? 'Product sponsorship'
                : contract.sponsorshipType === 'service'
                ? 'Service sponsorship'
                : 'Mixed sponsorship'}
            </p>
          </div>
        </div>
        <div>
          <h3 className='text-sm font-medium text-gray-500'>Deliverables</h3>
          <p className='text-gray-900 whitespace-pre-line'>
            {contract.deliverables}
          </p>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Start Date</h3>
            <p className='text-gray-900'>
              {new Date(contract.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>End Date</h3>
            <p className='text-gray-900'>
              {new Date(contract.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div>
          <h3 className='text-sm font-medium text-gray-500'>Payment Terms</h3>
          <p className='text-gray-900'>
            {contract.paymentTerms === 'full_upfront'
              ? 'Full payment in advance'
              : contract.paymentTerms === 'installments'
              ? '50% in advance, 50% after the event'
              : contract.paymentTerms === 'post_event'
              ? 'Full payment after the event'
              : 'Custom payment plan'}
          </p>
        </div>
        <div>
          <h3 className='text-sm font-medium text-gray-500'>
            Cancellation Policy
          </h3>
          <p className='text-gray-900'>{contract.cancellationPolicy}</p>
        </div>
        {contract.additionalTerms && (
          <div>
            <h3 className='text-sm font-medium text-gray-500'>
              Additional Terms
            </h3>
            <p className='text-gray-900'>{contract.additionalTerms}</p>
          </div>
        )}
        <div className='border-t pt-4 mt-6'>
          <div className='flex justify-between'>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>
                Brand Approval
              </h3>
              {brandApproved ? (
                <div className='flex items-center text-green-600'>
                  <CheckCircleIcon className='h-4 w-4 mr-1' />
                  <span>Approved</span>
                </div>
              ) : (
                <Button
                  variant='outline'
                  onClick={() => handleApprove('brand')}
                  className='mt-2'
                >
                  Approve as Brand
                </Button>
              )}
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>
                Organizer Approval
              </h3>
              {organizerApproved ? (
                <div className='flex items-center text-green-600'>
                  <CheckCircleIcon className='h-4 w-4 mr-1' />
                  <span>Approved</span>
                </div>
              ) : (
                <Button
                  variant='outline'
                  onClick={() => handleApprove('organizer')}
                  className='mt-2'
                >
                  Approve as Organizer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
