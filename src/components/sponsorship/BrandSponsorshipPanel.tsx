import React, { useState } from 'react';
import { PackageIcon, PercentIcon, DollarSignIcon, HelpCircleIcon, SaveIcon, SendIcon } from 'lucide-react';
import { Button } from '../Button';
interface SponsorshipType {
  id: 'product' | 'discount' | 'financial' | 'custom';
  name: string;
  description: string;
  icon: React.ReactNode;
  percentage: number;
}
export function BrandSponsorshipPanel() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    quantity: ''
  });
  const [discountDetails, setDiscountDetails] = useState({
    code: '',
    value: '',
    validFrom: '',
    validTo: ''
  });
  const [financialDetails, setFinancialDetails] = useState({
    amount: '',
    terms: 'upfront'
  });
  const [customMix, setCustomMix] = useState({
    product: 33,
    discount: 33,
    financial: 34
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const sponsorshipTypes: SponsorshipType[] = [{
    id: 'product',
    name: 'Product Sponsorship',
    description: 'Provide in-kind items (e.g. coffee beans, merch)',
    icon: <PackageIcon className="h-5 w-5" />,
    percentage: customMix.product
  }, {
    id: 'discount',
    name: 'Discount Sponsorship',
    description: 'Issue promo codes or percentage discounts',
    icon: <PercentIcon className="h-5 w-5" />,
    percentage: customMix.discount
  }, {
    id: 'financial',
    name: 'Financial Sponsorship',
    description: 'Direct monetary support',
    icon: <DollarSignIcon className="h-5 w-5" />,
    percentage: customMix.financial
  }, {
    id: 'custom',
    name: 'Custom Mix',
    description: 'Allocate percentages across multiple sponsorship types',
    icon: <div className="h-5 w-5" />,
    percentage: 100
  }];
  const handleTypeToggle = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter(id => id !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };
  const handleCustomMixChange = (type: 'product' | 'discount' | 'financial', value: number) => {
    const remaining = 100 - value;
    if (type === 'product') {
      // Distribute remaining percentage between discount and financial
      const discountShare = Math.round(remaining * (customMix.discount / (customMix.discount + customMix.financial)));
      setCustomMix({
        product: value,
        discount: discountShare,
        financial: remaining - discountShare
      });
    } else if (type === 'discount') {
      // Distribute remaining percentage between product and financial
      const productShare = Math.round(remaining * (customMix.product / (customMix.product + customMix.financial)));
      setCustomMix({
        product: productShare,
        discount: value,
        financial: remaining - productShare
      });
    } else {
      // Distribute remaining percentage between product and discount
      const productShare = Math.round(remaining * (customMix.product / (customMix.product + customMix.discount)));
      setCustomMix({
        product: productShare,
        discount: remaining - productShare,
        financial: value
      });
    }
  };
  const handleSaveDraft = () => {
    setIsDraft(true);
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message
    }, 1000);
  };
  const handlePublish = () => {
    setIsDraft(false);
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message
    }, 1000);
  };
  return <div className="bg-white rounded-lg shadow-sm p-6 border border-indigo-100 relative overflow-hidden">
      {/* Mystical background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-70"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-full -ml-12 -mb-12 opacity-50"></div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <span className="mr-2 text-2xl">✦</span>
        Choose Your Sponsorship Type
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {sponsorshipTypes.map(type => <div key={type.id} className={`relative rounded-lg p-5 cursor-pointer transition-all duration-300 ${selectedTypes.includes(type.id) ? 'bg-indigo-50 border-2 border-indigo-300' : 'bg-white border border-gray-200 hover:border-indigo-200'}`} onClick={() => handleTypeToggle(type.id)}>
            <div className="absolute top-3 right-3">
              <div className={`h-5 w-5 rounded-full ${selectedTypes.includes(type.id) ? 'bg-indigo-500' : 'bg-gray-200'} flex items-center justify-center`}>
                {selectedTypes.includes(type.id) && <div className="h-2 w-2 bg-white rounded-full"></div>}
              </div>
            </div>
            <div className="flex items-start">
              <div className={`p-3 rounded-full ${selectedTypes.includes(type.id) ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'} mr-4`}>
                {type.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1 flex items-center">
                  {type.name}
                  <div className="relative group ml-2">
                    <HelpCircleIcon className="h-4 w-4 text-gray-400" />
                    <div className="absolute left-0 bottom-full mb-2 w-60 bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      {type.description}
                    </div>
                  </div>
                </h3>
                <p className="text-sm text-gray-500">{type.description}</p>
              </div>
            </div>
            {/* Arcane border */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent opacity-50"></div>
          </div>)}
      </div>
      {/* Input fields for selected sponsorship types */}
      {selectedTypes.length > 0 && <div className="space-y-8 mb-8">
          {selectedTypes.includes('product') && <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <PackageIcon className="h-3 w-3 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Product Sponsorship Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input type="text" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={productDetails.name} onChange={e => setProductDetails({
              ...productDetails,
              name: e.target.value
            })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Quantity
                  </label>
                  <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={productDetails.quantity} onChange={e => setProductDetails({
              ...productDetails,
              quantity: e.target.value
            })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Description
                  </label>
                  <textarea rows={3} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={productDetails.description} onChange={e => setProductDetails({
              ...productDetails,
              description: e.target.value
            })}></textarea>
                </div>
              </div>
            </div>}
          {selectedTypes.includes('discount') && <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <PercentIcon className="h-3 w-3 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Discount Sponsorship Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Promo Code
                  </label>
                  <input type="text" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={discountDetails.code} onChange={e => setDiscountDetails({
              ...discountDetails,
              code: e.target.value
            })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value (%)
                  </label>
                  <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={discountDetails.value} onChange={e => setDiscountDetails({
              ...discountDetails,
              value: e.target.value
            })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From
                  </label>
                  <input type="date" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={discountDetails.validFrom} onChange={e => setDiscountDetails({
              ...discountDetails,
              validFrom: e.target.value
            })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid To
                  </label>
                  <input type="date" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={discountDetails.validTo} onChange={e => setDiscountDetails({
              ...discountDetails,
              validTo: e.target.value
            })} />
                </div>
              </div>
            </div>}
          {selectedTypes.includes('financial') && <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <DollarSignIcon className="h-3 w-3 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Financial Sponsorship Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (€)
                  </label>
                  <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={financialDetails.amount} onChange={e => setFinancialDetails({
              ...financialDetails,
              amount: e.target.value
            })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Terms
                  </label>
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={financialDetails.terms} onChange={e => setFinancialDetails({
              ...financialDetails,
              terms: e.target.value
            })}>
                    <option value="upfront">Full payment upfront</option>
                    <option value="installments">
                      Installments (50% upfront, 50% after)
                    </option>
                    <option value="post-event">Full payment after event</option>
                    <option value="custom">Custom terms</option>
                  </select>
                </div>
              </div>
            </div>}
          {selectedTypes.includes('custom') && <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Custom Mix Allocation
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Adjust the sliders to allocate percentages across different
                sponsorship types.
              </p>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <PackageIcon className="h-4 w-4 mr-1 text-indigo-500" />{' '}
                      Product Sponsorship
                    </label>
                    <span className="text-sm text-gray-500">
                      {customMix.product}%
                    </span>
                  </div>
                  <input type="range" min="0" max="100" value={customMix.product} onChange={e => handleCustomMixChange('product', parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <PercentIcon className="h-4 w-4 mr-1 text-indigo-500" />{' '}
                      Discount Sponsorship
                    </label>
                    <span className="text-sm text-gray-500">
                      {customMix.discount}%
                    </span>
                  </div>
                  <input type="range" min="0" max="100" value={customMix.discount} onChange={e => handleCustomMixChange('discount', parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <DollarSignIcon className="h-4 w-4 mr-1 text-indigo-500" />{' '}
                      Financial Sponsorship
                    </label>
                    <span className="text-sm text-gray-500">
                      {customMix.financial}%
                    </span>
                  </div>
                  <input type="range" min="0" max="100" value={customMix.financial} onChange={e => handleCustomMixChange('financial', parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
            </div>}
        </div>}
      {/* Preview summary panel */}
      {selectedTypes.length > 0 && <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="text-indigo-500 mr-2">✧</span>
            Sponsorship Summary
          </h3>
          <div className="relative z-10">
            <p className="text-gray-700 mb-4">You're offering:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(selectedTypes.includes('product') || selectedTypes.includes('custom')) && <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                  <div className="flex items-center mb-2">
                    <PackageIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-medium text-gray-900">Product</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedTypes.includes('custom') ? `${customMix.product}%` : '100%'}
                    {productDetails.name && ` - ${productDetails.name}`}
                    {productDetails.quantity && ` (${productDetails.quantity} units)`}
                  </div>
                </div>}
              {(selectedTypes.includes('discount') || selectedTypes.includes('custom')) && <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                  <div className="flex items-center mb-2">
                    <PercentIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-medium text-gray-900">Discount</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedTypes.includes('custom') ? `${customMix.discount}%` : '100%'}
                    {discountDetails.value && ` - ${discountDetails.value}% off`}
                    {discountDetails.code && ` (${discountDetails.code})`}
                  </div>
                </div>}
              {(selectedTypes.includes('financial') || selectedTypes.includes('custom')) && <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                  <div className="flex items-center mb-2">
                    <DollarSignIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-medium text-gray-900">Financial</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedTypes.includes('custom') ? `${customMix.financial}%` : '100%'}
                    {financialDetails.amount && ` - €${financialDetails.amount}`}
                  </div>
                </div>}
            </div>
          </div>
        </div>}
      {/* Action buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="flex items-center hover:bg-indigo-50 transition-colors" onClick={handleSaveDraft} disabled={isSubmitting || selectedTypes.length === 0}>
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button variant="primary" className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 shadow-md hover:shadow-lg transition-all" onClick={handlePublish} disabled={isSubmitting || selectedTypes.length === 0}>
          <SendIcon className="h-4 w-4 mr-2" />
          Publish Offer
        </Button>
      </div>
      {/* Mystical decorative elements */}
      <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-70"></div>
    </div>;
}