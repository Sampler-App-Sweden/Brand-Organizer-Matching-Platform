import type { Meta, StoryObj } from '@storybook/react-vite'

const brandColors = [
  {
    label: 'brand.primary',
    value: '#2563eb',
    helper: 'Primary CTA / highlights'
  },
  {
    label: 'brand.secondary',
    value: '#4f46e5',
    helper: 'Gradient stop / hover'
  },
  { label: 'brand.accent', value: '#38bdf8', helper: 'Glow accents / chips' },
  { label: 'brand.dark', value: '#1e3a8a', helper: 'Dark backgrounds' },
  { label: 'brand.light', value: '#eff6ff', helper: 'Soft fills / cards' },
  { label: 'feedback.success', value: '#16a34a', helper: 'Positive states' }
]

const surfaceTokens = [
  { label: 'surface.muted', helper: 'App background', value: '#f8fafc' },
  { label: 'surface.card', helper: 'Cards / panels', value: '#f1f5f9' }
]

const spacingTokens = [
  {
    label: 'spacing.section (5rem)',
    helper: 'Vertical rhythm for landing sections'
  },
  { label: 'spacing.card (2.5rem)', helper: 'Padding inside feature cards' },
  { label: 'shadow.brand', helper: 'Primary CTAs / floating cards' }
]

function DesignTokenDoc() {
  return (
    <section className='space-y-12 bg-surface-muted min-h-screen px-6 py-10 text-gray-900'>
      <div>
        <h1 className='text-3xl font-display mb-2'>Design Tokens</h1>
        <p className='text-gray-600 max-w-3xl'>
          These tokens mirror the Tailwind theme extensions in{' '}
          <code>tailwind.config.js</code> so we can keep utility-heavy UIs
          consistent across marketing and dashboard surfaces.
        </p>
      </div>

      <div className='space-y-6'>
        <h2 className='text-xl font-semibold'>Brand Colors</h2>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {brandColors.map((token) => (
            <div
              key={token.label}
              className='rounded-xl border border-gray-200 bg-white shadow-sm'
            >
              <div
                className='h-20 rounded-t-xl'
                style={{ backgroundColor: token.value }}
              />
              <div className='p-4 space-y-1'>
                <p className='font-mono text-sm text-gray-900'>{token.label}</p>
                <p className='text-xs uppercase tracking-wide text-gray-500'>
                  {token.value}
                </p>
                <p className='text-sm text-gray-600'>{token.helper}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='space-y-6'>
        <h2 className='text-xl font-semibold'>Surfaces</h2>
        <div className='grid gap-4 sm:grid-cols-2'>
          {surfaceTokens.map((token) => (
            <div
              key={token.label}
              className='rounded-2xl border border-gray-200 bg-white/70 backdrop-blur'
            >
              <div className='p-6'>
                <div
                  className='h-24 rounded-xl shadow-brand'
                  style={{ backgroundColor: token.value }}
                />
              </div>
              <div className='px-6 pb-6'>
                <p className='font-mono text-sm text-gray-900'>{token.label}</p>
                <p className='text-xs text-gray-500'>{token.helper}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='space-y-6'>
        <h2 className='text-xl font-semibold'>Typography</h2>
        <div className='grid gap-6 md:grid-cols-2'>
          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <p className='text-xs uppercase tracking-[0.3em] text-gray-500 mb-2'>
              Display
            </p>
            <p className='font-display text-3xl text-gray-900'>Space Grotesk</p>
            <p className='text-gray-600 mt-2'>
              Used for hero headlines, dashboards, and section headers.
            </p>
          </div>
          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <p className='text-xs uppercase tracking-[0.3em] text-gray-500 mb-2'>
              Sans
            </p>
            <p className='font-sans text-3xl text-gray-900'>Inter</p>
            <p className='text-gray-600 mt-2'>
              Default body copy and form text.
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <h2 className='text-xl font-semibold'>Spacing & Effects</h2>
        <div className='grid gap-4 lg:grid-cols-3'>
          {spacingTokens.map((token) => (
            <div
              key={token.label}
              className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'
            >
              <p className='font-mono text-sm text-gray-900'>{token.label}</p>
              <p className='text-sm text-gray-600 mt-1'>{token.helper}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const meta = {
  title: 'Design System/Design Tokens',
  component: DesignTokenDoc,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Reference for Tailwind-driven design tokens used across SponsrAI.'
      }
    }
  }
} satisfies Meta<typeof DesignTokenDoc>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => <DesignTokenDoc />
}
