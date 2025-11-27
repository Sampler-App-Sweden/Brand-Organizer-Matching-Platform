import { FormField } from '../ui'
import { Button } from '../ui'
import { SPONSORSHIP_TYPE_OPTIONS } from '../../constants/contractFormOptions'

interface ContractFormStep1Props {
  formData: any
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onNext: () => void
}

export function ContractFormStep1({ formData, onChange, onNext }: ContractFormStep1Props) {
  return (
    <div>
      <div className="space-y-4 mb-6">
        <FormField
          label="Sponsringsbelopp (SEK)"
          id="sponsorshipAmount"
          required
          value={formData.sponsorshipAmount}
          onChange={onChange}
          placeholder="t.ex. 25000"
        />
        <FormField
          label="Sponsringstyp"
          id="sponsorshipType"
          type="select"
          options={SPONSORSHIP_TYPE_OPTIONS}
          required
          value={formData.sponsorshipType}
          onChange={onChange}
        />
        <FormField
          label="Leverabler (vad varumärket får)"
          id="deliverables"
          textarea
          required
          placeholder="Lista alla leverabler som varumärket kommer att få, t.ex. logotyp på marknadsföringsmaterial, monterplats, etc."
          value={formData.deliverables}
          onChange={onChange}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={onNext} variant="primary">
          Fortsätt
        </Button>
      </div>
    </div>
  )
}
