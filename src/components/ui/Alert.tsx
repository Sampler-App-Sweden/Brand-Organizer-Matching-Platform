import React from 'react'
import {
  AlertCircle,
  CheckCircle,
  Info,
  X,
  XCircle
} from 'lucide-react'

/**
 * Alert component for notifications and messages
 *
 * @example
 * ```tsx
 * <Alert variant="error" description="Something went wrong" />
 * <Alert variant="success" title="Success" description="Changes saved" closable />
 * ```
 */

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  description?: string
  icon?: React.ReactNode
  closable?: boolean
  onClose?: () => void
  children?: React.ReactNode
}

export function Alert({
  variant = 'info',
  title,
  description,
  icon,
  closable = false,
  onClose,
  children,
  className = '',
  ...props
}: AlertProps) {
  const baseStyles = 'p-4 rounded-lg border flex items-start gap-3'

  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  }

  const defaultIcons = {
    info: <Info className="h-5 w-5 flex-shrink-0" />,
    success: <CheckCircle className="h-5 w-5 flex-shrink-0" />,
    warning: <AlertCircle className="h-5 w-5 flex-shrink-0" />,
    error: <XCircle className="h-5 w-5 flex-shrink-0" />
  }

  const displayIcon = icon || defaultIcons[variant]

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      role="alert"
      {...props}
    >
      {displayIcon && <div>{displayIcon}</div>}
      <div className="flex-1">
        {title && <div className="font-medium mb-1">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
        {children}
      </div>
      {closable && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-auto hover:opacity-70 focus:outline-none"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
