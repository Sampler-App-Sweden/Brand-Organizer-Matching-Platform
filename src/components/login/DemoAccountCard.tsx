import { Copy, Check } from 'lucide-react'
import { DemoAccount } from '../../constants/demoAccounts'

interface DemoAccountCardProps {
  account: DemoAccount
  copiedId: string | null
  onCopy: (text: string, id: string) => void
  onQuickLogin: (email: string, password: string) => void
}

export function DemoAccountCard({
  account,
  copiedId,
  onCopy,
  onQuickLogin
}: DemoAccountCardProps) {
  const Icon = account.icon

  return (
    <div className='p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all'>
      <div className='flex items-start gap-3'>
        <div className='p-2 bg-blue-50 rounded-lg'>
          <Icon className='h-5 w-5 text-blue-600' />
        </div>
        <div className='flex-1'>
          <h4 className='font-medium text-gray-900 mb-1'>{account.type}</h4>
          <p className='text-xs text-gray-600 mb-3'>{account.description}</p>

          <div className='space-y-2'>
            <div className='flex items-center justify-between gap-2'>
              <code className='text-xs bg-gray-50 px-2 py-1 rounded flex-1 truncate'>
                {account.email}
              </code>
              <button
                type='button'
                onClick={() => onCopy(account.email, `email-${account.type}`)}
                className='text-gray-500 hover:text-gray-700 flex-shrink-0'
                title='Copy email'
              >
                {copiedId === `email-${account.type}` ? (
                  <Check className='h-4 w-4 text-green-600' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </button>
            </div>

            <div className='flex items-center justify-between gap-2'>
              <code className='text-xs bg-gray-50 px-2 py-1 rounded flex-1'>
                {account.password}
              </code>
              <button
                type='button'
                onClick={() =>
                  onCopy(account.password, `password-${account.type}`)
                }
                className='text-gray-500 hover:text-gray-700 flex-shrink-0'
                title='Copy password'
              >
                {copiedId === `password-${account.type}` ? (
                  <Check className='h-4 w-4 text-green-600' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </button>
            </div>
          </div>

          <button
            type='button'
            onClick={() => onQuickLogin(account.email, account.password)}
            className='mt-3 w-full text-xs px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors'
          >
            Quick Login
          </button>
        </div>
      </div>
    </div>
  )
}
