import { render, screen } from '@testing-library/react'

import { MatchPreview } from '../MatchPreview'

describe('MatchPreview', () => {
  it('renders the match text', () => {
    render(<MatchPreview matchText='Test match preview' />)
    expect(screen.getByText('Test match preview')).toBeInTheDocument()
  })

  it('renders the title', () => {
    render(<MatchPreview matchText='Anything' />)
    expect(screen.getByText('Instant Match Preview')).toBeInTheDocument()
  })
})
