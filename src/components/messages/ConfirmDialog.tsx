interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning'
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning'
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black bg-opacity-50'
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className='relative bg-white rounded-lg shadow-xl max-w-md w-full p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          {title}
        </h3>
        <p className='text-sm text-gray-600 mb-6'>
          {message}
        </p>

        <div className='flex justify-end gap-3'>
          <button
            onClick={onCancel}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors'
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
