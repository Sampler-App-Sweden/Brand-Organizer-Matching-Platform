import React from 'react'
import { X } from 'lucide-react'

/**
 * Badge component for labels, tags, and status indicators
 *
 * @example
 * ```tsx
 * <Badge variant="primary" size="sm">New</Badge>
 * <Badge variant="brand" rounded="full">Brand</Badge>
 * <Badge variant="success" dot>Active</Badge>
 * ```
 */

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral'
    | 'brand'
    | 'organizer'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: 'sm' | 'md' | 'full'
  dot?: boolean
  removable?: boolean
  onRemove?: () => void
  children: React.ReactNode
  className?: string
}

export function Badge({
  variant = 'primary',
  size = 'sm',
  rounded = 'md',
  dot = false,
  removable = false,
  onRemove,
  children,
  className = '',
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium transition-colors'

  const variantStyles = {
    primary: 'bg-indigo-50 text-indigo-700',
    secondary: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-50 text-blue-700',
    neutral: 'bg-gray-100 text-gray-700',
    brand: 'bg-blue-100 text-blue-800',
    organizer: 'bg-green-100 text-green-800'
  }

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  const roundedStyles = {
    sm: 'rounded',
    md: 'rounded-md',
    full: 'rounded-full'
  }

  const dotColorStyles = {
    primary: 'bg-indigo-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-gray-500',
    brand: 'bg-blue-500',
    organizer: 'bg-green-500'
  }

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles[rounded]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full mr-1.5 ${dotColorStyles[variant]}`}
        />
      )}
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 hover:opacity-70 focus:outline-none"
          aria-label="Remove"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
