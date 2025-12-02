import type { Meta, StoryObj } from '@storybook/react-vite'

function StorybookGuide() {
  return (
    <div className='space-y-10 p-8 bg-surface-muted min-h-screen text-gray-900'>
      <header className='space-y-3'>
        <p className='text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark'>
          Playbook
        </p>
        <h1 className='text-4xl font-display'>Storybook usage for SponsrAI</h1>
        <p className='text-gray-600 max-w-3xl'>
          This page captures how we keep Tailwind-heavy layouts consistent
          inside Storybook. Treat it as a quick onboarding reference before
          adding new stories.
        </p>
      </header>

      <section className='grid gap-6 lg:grid-cols-2'>
        {[
          {
            title: '1. Tailwind + Fonts',
            body: '`src/index.css` loads Inter + Space Grotesk and applies the brand surfaces. Every story inherits those styles because `.storybook/preview.ts` imports the file. Wrap a story in a padded `div` if you need extra breathing room.'
          },
          {
            title: '2. Design tokens',
            body: 'Tokens live in `tailwind.config.js` and are documented in `Design System/Design Tokens`. Use semantic classes such as `bg-brand-primary` or `shadow-brand` instead of raw hex values whenever possible.'
          },
          {
            title: '3. Utility combinations',
            body: 'See `Utility Combos` for approved stacks (glass panels, gradient CTAs, stat pills). Copy those class strings when creating new marketing or dashboard panels.'
          },
          {
            title: '4. Context requirements',
            body: 'Components that depend on React Router or context providers should use decorators defined in `.storybook/preview.ts`. Keep decorators minimal and mock data with args.'
          }
        ].map((card) => (
          <article
            key={card.title}
            className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'
          >
            <h2 className='text-xl font-semibold mb-2'>{card.title}</h2>
            <p className='text-gray-600'>{card.body}</p>
          </article>
        ))}
      </section>

      <section className='rounded-2xl border border-dashed border-brand-light bg-white/70 p-6'>
        <h2 className='text-2xl font-display mb-2'>
          Adding a new component story
        </h2>
        <ol className='list-decimal space-y-3 text-gray-700 pl-5'>
          <li>
            Create the component in `src/components/...` with Tailwind utilities
            that reference the tokens.
          </li>
          <li>
            Create a story in the same folder or under `src/stories/` using the
            `@storybook/react-vite` types.
          </li>
          <li>
            Document repeated class stacks in `Utility Combos` if other teams
            should reuse them.
          </li>
          <li>
            Run `npm run storybook -- --smoke-test` before commits to ensure
            stories compile.
          </li>
        </ol>
      </section>
    </div>
  )
}

const meta = {
  title: 'Design System/Storybook Guide',
  component: StorybookGuide,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof StorybookGuide>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => <StorybookGuide />
}
