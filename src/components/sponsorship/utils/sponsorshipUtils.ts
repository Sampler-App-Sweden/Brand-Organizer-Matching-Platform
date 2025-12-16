import { OrganizerRequestTypeId } from '../../../types/sponsorship'

import type { OrganizerProductDetails, OrganizerDiscountDetails, OrganizerFinancialDetails } from '../../../types/sponsorship';

export function generateMatchPreview(
  selectedTypes: OrganizerRequestTypeId[],
  productDetails: OrganizerProductDetails,
  discountDetails: OrganizerDiscountDetails,
  financialDetails: OrganizerFinancialDetails
) {
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
