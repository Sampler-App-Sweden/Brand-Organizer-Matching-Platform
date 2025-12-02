import type { Meta, StoryObj } from '@storybook/react-vite'

const cardCombos = [
  {
    title: 'Glass Panel',
    classes:
      'bg-white/80 backdrop-blur border border-white/60 shadow-brand rounded-brand p-8 space-y-4',
    description: 'Used on hero sections + dashboard cards with floating visuals.'
  },
  {
    title: 'Muted Card',
    classes: 'bg-surface-card border border-gray-200 rounded-2xl p-6 space-y-3',
    description: 'Community + directory list items.'
  },
  {
    title: 'Gradient CTA',
    classes:
      'bg-brand-gradient text-white rounded-xl px-8 py-4 shadow-brand transition hover:shadow-lg',
    description: 'Primary CTA buttons / hero signups.'
  }
]

const statCombos = [
  {
    title: 'Stat Pill',
    classes:
      'inline-flex items-center gap-2 rounded-full bg-brand-light/80 px-4 py-1 text-sm font-medium text-brand-dark',
    description: 'Registration + KPI highlights.'
  },
  {
    title: 'Badge',
    classes:
      'inline-flex items-center rounded-md border border-brand-light bg-white px-3 py-1 text-xs font-semibold text-brand-secondary',
    description: 'Status tags for organizers + sponsors.'
  }
]

const meta = {
  title: 'Design System/Utility Combos',
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Cards: Story = {
  render: () => (
    <div className='space-y-8 p-8 bg-surface-muted min-h-screen'>
      <div>
        <h2 className='text-2xl font-display mb-2'>Card & CTA Patterns</h2>
        <p className='text-gray-600'>Drag these class stacks into new components to stay on-brand.</p>
      </div>
      <div className='grid gap-6 md:grid-cols-3'>
        {cardCombos.map((combo) => (
          <div key={combo.title} className='rounded-2xl border border-dashed border-gray-200 bg-white/60 p-4'>
            <div className={combo.classes}>
              <p className='text-lg font-semibold text-gray-900'>{combo.title}</p>
              <p className='text-sm text-gray-600'>{combo.description}</p>
            </div>
            <code className='mt-4 block text-xs text-gray-500 break-words'>
              {combo.classes}
            </code>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Badges: Story = {
  render: () => (
    <div className='space-y-8 p-8 bg-surface-muted min-h-screen'>
      <div>
        <h2 className='text-2xl font-display mb-2'>Badges & Stat Pills</h2>
        <p className='text-gray-600'>Small UI elements that appear in directories, dashboards, and forms.</p>
      </div>
      <div className='grid gap-6 md:grid-cols-2'>
        {statCombos.map((combo) => (
          <div key={combo.title} className='rounded-2xl border border-dashed border-gray-200 bg-white/60 p-4'>
            <div className={combo.classes}>{combo.title}</div>
            <code className='mt-4 block text-xs text-gray-500 break-words'>
              {combo.classes}
            </code>
            <p className='mt-2 text-sm text-gray-600'>{combo.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
