import React from 'react'
import { Button } from '../../components/ui'

type TabType = 'users' | 'brands' | 'organizers' | 'matches' | 'tickets'

interface AdminDashboardActionsProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  activeTab: TabType
  exportData: (tab: TabType) => void
  emailData: (tab: TabType) => Promise<void>
  isExporting: boolean
  exportFeedback: { visible: boolean; type: string; message: string }
}

export const AdminDashboardActions: React.FC<AdminDashboardActionsProps> = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  exportData,
  emailData,
  isExporting,
  exportFeedback
}) => (
  <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
    <div className='flex flex-col md:flex-row justify-between items-center'>
      <div className='relative w-full md:w-64 mb-4 md:mb-0'>
        <input
          type='text'
          placeholder='Search...'
          className='pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='flex space-x-2'>
        <Button
          variant='outline'
          className='flex items-center'
          onClick={() => exportData(activeTab)}
        >
          ⬇️ Download {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Button>
        <Button
          variant='primary'
          className='flex items-center'
          onClick={() => emailData(activeTab)}
          disabled={isExporting}
        >
          {isExporting ? (
            <span className='inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
          ) : (
            '✉️'
          )}
          Email to info@sponsrai.com
        </Button>
      </div>
    </div>
    {/* Feedback message */}
    {exportFeedback.visible && (
      <div
        className={`mt-4 p-3 rounded-md ${
          exportFeedback.type === 'success'
            ? 'bg-green-100 text-green-800'
            : exportFeedback.type === 'error'
            ? 'bg-red-100 text-red-800'
            : 'bg-blue-100 text-blue-800'
        }`}
      >
        {exportFeedback.message}
      </div>
    )}
  </div>
)
