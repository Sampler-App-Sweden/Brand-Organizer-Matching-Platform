import React, { useState } from 'react';
import { Button } from './ui';
import { FormField } from './ui';
import { CheckCircleIcon } from 'lucide-react';
interface ContractFormProps {
  brandName: string;
  organizerName: string;
  eventName: string;
  matchId: string;
  onContractCreated: (contractData: any) => void;
}
export function ContractForm({
  brandName,
  organizerName,
  eventName,
  matchId,
  onContractCreated
}: ContractFormProps) {
  const [formData, setFormData] = useState({
    sponsorshipAmount: '',
    sponsorshipType: '',
    deliverables: '',
    startDate: '',
    endDate: '',
    paymentTerms: '',
    cancellationPolicy: '',
    additionalTerms: ''
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // In a real app, this would send data to a server
    setTimeout(() => {
      const contractData = {
        id: `contract-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        matchId,
        brandName,
        organizerName,
        eventName,
        ...formData,
        createdAt: new Date(),
        status: 'pending'
      };
      // Save to localStorage
      const contracts = JSON.parse(localStorage.getItem('contracts') || '[]');
      contracts.push(contractData);
      localStorage.setItem('contracts', JSON.stringify(contracts));
      onContractCreated(contractData);
      setIsSubmitting(false);
    }, 1000);
  };
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const sponsorshipTypeOptions = [{
    value: 'financial',
    label: 'Finansiell sponsring'
  }, {
    value: 'product',
    label: 'Produktsponsring'
  }, {
    value: 'service',
    label: 'Tjänstesponsring'
  }, {
    value: 'mixed',
    label: 'Blandad sponsring'
  }];
  const paymentTermsOptions = [{
    value: 'full_upfront',
    label: 'Full betalning i förskott'
  }, {
    value: 'installments',
    label: '50% i förskott, 50% efter eventet'
  }, {
    value: 'post_event',
    label: 'Full betalning efter eventet'
  }, {
    value: 'custom',
    label: 'Anpassad betalningsplan'
  }];
  return <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Skapa sponsringsavtal
      </h2>
      <p className="text-gray-600 mb-6">
        Detta avtal kommer att formalisera samarbetet mellan {brandName} och{' '}
        {organizerName} för eventet "{eventName}".
      </p>
      {step === 1 && <div>
          <div className="space-y-4 mb-6">
            <FormField label="Sponsringsbelopp (SEK)" id="sponsorshipAmount" required value={formData.sponsorshipAmount} onChange={handleChange} placeholder="t.ex. 25000" />
            <FormField label="Sponsringstyp" id="sponsorshipType" type="select" options={sponsorshipTypeOptions} required value={formData.sponsorshipType} onChange={handleChange} />
            <FormField label="Leverabler (vad varumärket får)" id="deliverables" textarea required placeholder="Lista alla leverabler som varumärket kommer att få, t.ex. logotyp på marknadsföringsmaterial, monterplats, etc." value={formData.deliverables} onChange={handleChange} />
          </div>
          <div className="flex justify-end">
            <Button onClick={nextStep} variant="primary">
              Fortsätt
            </Button>
          </div>
        </div>}
      {step === 2 && <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Startdatum" id="startDate" type="date" required value={formData.startDate} onChange={handleChange} />
              <FormField label="Slutdatum" id="endDate" type="date" required value={formData.endDate} onChange={handleChange} />
            </div>
            <FormField label="Betalningsvillkor" id="paymentTerms" type="select" options={paymentTermsOptions} required value={formData.paymentTerms} onChange={handleChange} />
            <FormField label="Avbokningspolicy" id="cancellationPolicy" textarea required placeholder="Beskriv villkoren för avbokning, t.ex. '50% återbetalning vid avbokning 30 dagar före eventet'" value={formData.cancellationPolicy} onChange={handleChange} />
            <FormField label="Ytterligare villkor (valfritt)" id="additionalTerms" textarea placeholder="Lägg till eventuella ytterligare villkor eller noteringar" value={formData.additionalTerms} onChange={handleChange} />
          </div>
          <div className="flex justify-between">
            <Button onClick={prevStep} variant="outline">
              Tillbaka
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Skapar avtal...' : 'Skapa avtal'}
            </Button>
          </div>
        </form>}
    </div>;
}
export function ContractDetails({
  contract
}: {
  contract: any;
}) {
  const [brandApproved, setBrandApproved] = useState(contract.brandApproved || false);
  const [organizerApproved, setOrganizerApproved] = useState(contract.organizerApproved || false);
  const handleApprove = (party: 'brand' | 'organizer') => {
    // In a real app, this would update the server
    const contracts = JSON.parse(localStorage.getItem('contracts') || '[]');
    const updatedContracts = contracts.map((c: any) => {
      if (c.id === contract.id) {
        return {
          ...c,
          brandApproved: party === 'brand' ? true : c.brandApproved,
          organizerApproved: party === 'organizer' ? true : c.organizerApproved,
          status: c.brandApproved && c.organizerApproved ? 'approved' : 'pending'
        };
      }
      return c;
    });
    localStorage.setItem('contracts', JSON.stringify(updatedContracts));
    if (party === 'brand') {
      setBrandApproved(true);
    } else {
      setOrganizerApproved(true);
    }
  };
  const isFullyApproved = brandApproved && organizerApproved;
  return <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Sponsringsavtal</h2>
        <div className={`px-3 py-1 text-sm font-medium rounded-full ${isFullyApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {isFullyApproved ? 'Godkänt' : 'Väntar på godkännande'}
        </div>
      </div>
      {isFullyApproved && <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Avtalet är godkänt av båda parter
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Grattis! Avtalet mellan {contract.brandName} och{' '}
                  {contract.organizerName} är nu officiellt.
                </p>
              </div>
            </div>
          </div>
        </div>}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Varumärke</h3>
            <p className="text-gray-900">{contract.brandName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Arrangör</h3>
            <p className="text-gray-900">{contract.organizerName}</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Event</h3>
          <p className="text-gray-900">{contract.eventName}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Sponsringsbelopp
            </h3>
            <p className="text-gray-900">{contract.sponsorshipAmount} SEK</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Sponsringstyp</h3>
            <p className="text-gray-900">
              {contract.sponsorshipType === 'financial' ? 'Finansiell sponsring' : contract.sponsorshipType === 'product' ? 'Produktsponsring' : contract.sponsorshipType === 'service' ? 'Tjänstesponsring' : 'Blandad sponsring'}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Leverabler</h3>
          <p className="text-gray-900 whitespace-pre-line">
            {contract.deliverables}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Startdatum</h3>
            <p className="text-gray-900">
              {new Date(contract.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Slutdatum</h3>
            <p className="text-gray-900">
              {new Date(contract.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Betalningsvillkor
          </h3>
          <p className="text-gray-900">
            {contract.paymentTerms === 'full_upfront' ? 'Full betalning i förskott' : contract.paymentTerms === 'installments' ? '50% i förskott, 50% efter eventet' : contract.paymentTerms === 'post_event' ? 'Full betalning efter eventet' : 'Anpassad betalningsplan'}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Avbokningspolicy
          </h3>
          <p className="text-gray-900">{contract.cancellationPolicy}</p>
        </div>
        {contract.additionalTerms && <div>
            <h3 className="text-sm font-medium text-gray-500">
              Ytterligare villkor
            </h3>
            <p className="text-gray-900">{contract.additionalTerms}</p>
          </div>}
        <div className="border-t pt-4 mt-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Varumärkets godkännande
              </h3>
              {brandApproved ? <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  <span>Godkänt</span>
                </div> : <Button variant="outline" onClick={() => handleApprove('brand')} className="mt-2">
                  Godkänn som varumärke
                </Button>}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Arrangörens godkännande
              </h3>
              {organizerApproved ? <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  <span>Godkänt</span>
                </div> : <Button variant="outline" onClick={() => handleApprove('organizer')} className="mt-2">
                  Godkänn som arrangör
                </Button>}
            </div>
          </div>
        </div>
      </div>
    </div>;
}