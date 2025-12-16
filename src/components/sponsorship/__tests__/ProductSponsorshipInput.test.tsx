import { render, screen, fireEvent } from '@testing-library/react'
import { ProductSponsorshipInput } from '../inputs/ProductSponsorshipInput'

describe('ProductSponsorshipInput', () => {
  it('renders input fields and updates values', () => {
    const productDetails = { items: '', quantity: '' }
    const setProductDetails = jest.fn()
    render(
      <ProductSponsorshipInput
        productDetails={productDetails}
        setProductDetails={setProductDetails}
      />
    )

    // Check labels
    expect(screen.getByLabelText('Desired Items')).toBeInTheDocument()
    expect(screen.getByLabelText('Desired Quantity')).toBeInTheDocument()

    // Simulate input
    fireEvent.change(screen.getByLabelText('Desired Items'), {
      target: { value: 'Coffee' }
    })
    expect(setProductDetails).toHaveBeenCalledWith({
      items: 'Coffee',
      quantity: ''
    })

    fireEvent.change(screen.getByLabelText('Desired Quantity'), {
      target: { value: '100' }
    })
    expect(setProductDetails).toHaveBeenCalledWith({
      items: '',
      quantity: '100'
    })
  })
})
