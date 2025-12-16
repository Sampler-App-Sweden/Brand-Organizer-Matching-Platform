import { OrganizerRequestTypeId } from '../../../types/sponsorship'

import type { OrganizerProductDetails, OrganizerDiscountDetails, OrganizerFinancialDetails, OrganizerOtherDetails } from '../../../types/sponsorship';

export function generateMatchPreview(
  selectedTypes: OrganizerRequestTypeId[],
  productDetails: OrganizerProductDetails,
  discountDetails: OrganizerDiscountDetails,
  financialDetails: OrganizerFinancialDetails,
  otherDetails: OrganizerOtherDetails
) {
  const items = []
  if (selectedTypes.includes('product')) {
    const productItem = productDetails.items || 'Product samples'
    const quantity = productDetails.quantity || '200'
    items.push(`${productItem} × ${quantity}`)
  }
  if (selectedTypes.includes('discount')) {
    const discountValue = discountDetails.targetLevel || '15'
    items.push(`${discountValue}% off`)
  }
  if (selectedTypes.includes('financial')) {
    const amount = financialDetails.maxAmount || '1,000'
    items.push(`€${amount} grant`)
  }
  if (selectedTypes.includes('media')) {
    items.push('Media/PR placements')
  }
  if (selectedTypes.includes('other')) {
    const truncatedTitle = otherDetails.title.length > 80
      ? `${otherDetails.title.substring(0, 80)}...`
      : otherDetails.title || 'Custom collaboration'
    items.push(truncatedTitle)
  }
  return items.join(', ')
}
