import { ConnectionStats } from '../../types'

interface ConnectionSummaryProps {
  stats: ConnectionStats | null
}

export function ConnectionSummary({ stats }: ConnectionSummaryProps) {
  const mutualCount = stats?.mutual ?? 0

  return (
    <div className='mb-6'>
      <h2 className='text-sm font-medium text-gray-700 mb-4'>
        Connection Summary
      </h2>
      <div className='grid grid-cols-3 gap-4'>
        <div className='bg-gray-50 rounded-lg p-4'>
          <div className='text-2xl font-bold text-gray-900'>
            {stats?.sent.total ?? 0}
          </div>
          <div className='text-sm text-gray-600'>Sent</div>
          <div className='text-xs text-gray-500 mt-1'>
            {stats?.sent.pending ?? 0} pending
          </div>
        </div>
        <div className='bg-gray-50 rounded-lg p-4'>
          <div className='text-2xl font-bold text-gray-900'>
            {stats?.received.total ?? 0}
          </div>
          <div className='text-sm text-gray-600'>Received</div>
          <div className='text-xs text-gray-500 mt-1'>
            {stats?.received.pending ?? 0} pending
          </div>
        </div>
        <div className='bg-indigo-50 rounded-lg p-4'>
          <div className='text-2xl font-bold text-indigo-600'>
            {mutualCount}
          </div>
          <div className='text-sm text-indigo-700'>Mutual</div>
          <div className='text-xs text-indigo-600 mt-1'>Ready to message</div>
        </div>
      </div>
    </div>
  )
}
