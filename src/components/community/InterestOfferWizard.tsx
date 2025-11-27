import React, { useState } from 'react';
import { XIcon, ArrowRightIcon, CheckCircleIcon } from 'lucide-react';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { CommunityMember } from '../../types/community';
import { User } from '../../services/authService';
interface InterestOfferWizardProps {
  member: CommunityMember;
  currentUser: User | null;
  onClose: () => void;
}
export function InterestOfferWizard({
  member,
  currentUser,
  onClose
}: InterestOfferWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    targetItem: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      // In a real implementation, this would send the data to a backend API
      console.log('Submitting interest/offer:', {
        from: currentUser?.id,
        to: member.id,
        fromType: currentUser?.type,
        toType: member.type,
        ...formData,
        timestamp: new Date()
      });
    }, 1500);
  };
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  // Determine wizard title based on user types
  const getWizardTitle = () => {
    if (currentUser?.type === 'organizer' && member.type === 'brand') {
      return 'Express Interest';
    }
    if (currentUser?.type === 'brand' && member.type === 'organizer') {
      return 'Offer Sponsorship';
    }
    return 'Connect';
  };
  // Sample products/events for the dropdown
  // In a real implementation, these would come from the user's profile
  const sampleItems = [{
    id: '1',
    name: currentUser?.type === 'brand' ? 'Organic Energy Drink' : 'Summer Festival 2023'
  }, {
    id: '2',
    name: currentUser?.type === 'brand' ? 'Protein Bars' : 'Winter Conference 2023'
  }, {
    id: '3',
    name: currentUser?.type === 'brand' ? 'Merchandise Pack' : 'Monthly Networking Event'
  }];
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto relative">
        {/* Close button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <XIcon className="h-5 w-5" />
        </button>
        <div className="p-6">
          {isComplete ? <div className="text-center py-8">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Message Sent!
              </h2>
              <p className="text-gray-600 mb-6">
                Your message has been sent to {member.name}. They will be
                notified and can respond via the platform.
              </p>
              <Button variant="primary" onClick={onClose}>
                Close
              </Button>
            </div> : <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getWizardTitle()}
              </h2>
              <p className="text-gray-600 mb-6">
                Connect with {member.name} to explore collaboration
                opportunities.
              </p>
              {/* Progress indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2, 3, 4].map(i => <div key={i} className={`flex items-center justify-center rounded-full h-8 w-8 text-sm font-medium 
                        ${i < step ? 'bg-green-100 text-green-800' : i === step ? 'bg-indigo-100 text-indigo-800 ring-2 ring-indigo-300' : 'bg-gray-100 text-gray-400'}`}>
                      {i}
                    </div>)}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 px-1">
                  <span>Your Info</span>
                  <span>
                    {currentUser?.type === 'brand' ? 'Product' : 'Event'}
                  </span>
                  <span>Message</span>
                  <span>Review</span>
                </div>
              </div>
              {/* Step 1: Contact Info */}
              {step === 1 && <div className="space-y-4">
                  <FormField label="Your Name" id="name" required value={formData.name} onChange={handleChange} />
                  <FormField label="Email Address" id="email" type="email" required value={formData.email} onChange={handleChange} />
                  <FormField label="Phone Number (optional)" id="phone" type="tel" value={formData.phone} onChange={handleChange} />
                  <div className="flex justify-end mt-6">
                    <Button variant="primary" onClick={nextStep} disabled={!formData.name || !formData.email} className="flex items-center">
                      Next
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>}
              {/* Step 2: Target Product/Event */}
              {step === 2 && <div className="space-y-4">
                  <FormField label={currentUser?.type === 'brand' ? 'Select Your Product' : 'Select Your Event'} id="targetItem" type="select" required value={formData.targetItem} onChange={handleChange} options={sampleItems.map(item => ({
              value: item.id,
              label: item.name
            }))} />
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button variant="primary" onClick={nextStep} disabled={!formData.targetItem} className="flex items-center">
                      Next
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>}
              {/* Step 3: Message */}
              {step === 3 && <div className="space-y-4">
                  <FormField label="Your Message" id="message" textarea rows={5} required value={formData.message} onChange={handleChange} placeholder={currentUser?.type === 'brand' ? `I'd love to provide samples of our products at your upcoming event...` : `We're interested in featuring your products at our upcoming event...`} />
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button variant="primary" onClick={nextStep} disabled={!formData.message} className="flex items-center">
                      Next
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>}
              {/* Step 4: Review */}
              {step === 4 && <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Review Your Message
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500">From:</span>{' '}
                        <span className="text-gray-900">
                          {formData.name} ({formData.email})
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">To:</span>{' '}
                        <span className="text-gray-900">{member.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          {currentUser?.type === 'brand' ? 'Product:' : 'Event:'}
                        </span>{' '}
                        <span className="text-gray-900">
                          {sampleItems.find(item => item.id === formData.targetItem)?.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Message:</span>
                        <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                          {formData.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-indigo-500 to-purple-600">
                      {isSubmitting ? <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Sending...
                        </div> : 'Send Message'}
                    </Button>
                  </div>
                </div>}
            </>}
        </div>
      </div>
    </div>;
}