import { Archive, Trash2, X } from 'lucide-react'

interface BulkActionsToolbarProps {
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onDeselectAll: () => void
  onArchive: () => void
  onDelete: () => void
  onCancel: () => void
}

export function BulkActionsToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onArchive,
  onDelete,
  onCancel
}: BulkActionsToolbarProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0

  return (
    <div className='bg-indigo-600 text-white p-3 flex items-center justify-between shadow-lg'>
      <div className='flex items-center gap-3'>
        <button
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className='flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium'
        >
          <input
            type='checkbox'
            checked={allSelected}
            onChange={() => {}}
            className='h-4 w-4 rounded border-white/50'
          />
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
        <span className='text-sm font-medium'>
          {selectedCount} selected
        </span>
      </div>

      <div className='flex items-center gap-2'>
        <button
          onClick={onArchive}
          disabled={selectedCount === 0}
          className='flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium'
        >
          <Archive className='h-4 w-4' />
          Archive
        </button>
        <button
          onClick={onDelete}
          disabled={selectedCount === 0}
          className='flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium'
        >
          <Trash2 className='h-4 w-4' />
          Delete
        </button>
        <button
          onClick={onCancel}
          className='flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium ml-2'
        >
          <X className='h-4 w-4' />
          Cancel
        </button>
      </div>
    </div>
  )
}
