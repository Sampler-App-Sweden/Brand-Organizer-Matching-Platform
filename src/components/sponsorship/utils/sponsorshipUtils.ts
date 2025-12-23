import { OrganizerRequestTypeId } from '../../../types/sponsorship'
import { toTitleCase } from '../../../utils/formatting'

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
    items.push(`${amount} SEK grant`)
  }
  if (selectedTypes.includes('media')) {
    items.push('Media/PR placements')
  }
  if (selectedTypes.includes('other')) {
    const title = otherDetails.title || 'Custom collaboration'
    const formattedTitle = toTitleCase(title)
    const truncatedTitle = formattedTitle.length > 80
      ? `${formattedTitle.substring(0, 80)}...`
      : formattedTitle
    items.push(truncatedTitle)
  }
  return items.join(', ')
}
