interface LoadingSpinnerProps {
  size?: number | string
  className?: string
  colorClass?: string // Tailwind color override
}

/**
 * A reusable purple loading spinner for the app.
 * Default size: 48px (h-12 w-12), purple border.
 */
export function LoadingSpinner({
  size = 48,
  className = '',
  colorClass = 'border-indigo-200 border-t-indigo-600'
}: LoadingSpinnerProps) {
  const px = typeof size === 'number' ? `${size}px` : size
  return (
    <div
      className={`inline-block animate-spin rounded-full border-4 ${colorClass} ${className}`}
      style={{ width: px, height: px }}
      role='status'
      aria-label='Loading'
    />
  )
}

export default LoadingSpinner
