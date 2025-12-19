import React from 'react'

/**
 * Textarea component for multi-line text input
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Enter description" rows={4} />
 * <Textarea error resize="none" />
 * ```
 */

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled' | 'flushed'
  error?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  fullWidth?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'default',
      error = false,
      resize = 'vertical',
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'px-3 py-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200'

    const variantStyles = {
      default: 'border-gray-300 bg-white focus:border-indigo-500',
      filled:
        'border-transparent bg-gray-100 focus:bg-white focus:border-indigo-500',
      flushed:
        'border-0 border-b-2 border-gray-300 rounded-none focus:border-indigo-500 px-0'
    }

    const errorStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : ''
    const widthStyle = fullWidth ? 'w-full' : ''

    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    }

    return (
      <textarea
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${errorStyles} ${widthStyle} ${resizeStyles[resize]} ${className}`}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
