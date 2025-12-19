import React from 'react'

/**
 * IconButton component for icon-only buttons
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon={<SearchIcon />}
 *   aria-label="Search"
 *   variant="ghost"
 * />
 * <IconButton
 *   icon={<BookmarkIcon />}
 *   aria-label="Save"
 *   variant="solid"
 *   colorScheme="primary"
 *   rounded="full"
 * />
 * ```
 */

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'solid' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  colorScheme?: 'gray' | 'primary' | 'danger' | 'success'
  rounded?: 'md' | 'lg' | 'full'
  icon: React.ReactNode
  isLoading?: boolean
  'aria-label': string
}

export function IconButton({
  variant = 'ghost',
  size = 'md',
  colorScheme = 'gray',
  rounded = 'md',
  icon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantStyles = {
    ghost: {
      gray: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      primary:
        'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 focus:ring-indigo-500',
      danger: 'text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-red-500',
      success:
        'text-green-600 hover:text-green-700 hover:bg-green-50 focus:ring-green-500'
    },
    solid: {
      gray: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
      primary:
        'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
    },
    outline: {
      gray: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      primary:
        'border border-indigo-300 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
      danger:
        'border border-red-300 text-red-600 hover:bg-red-50 focus:ring-red-500',
      success:
        'border border-green-300 text-green-600 hover:bg-green-50 focus:ring-green-500'
    }
  }

  const sizeStyles = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-9 w-9 text-base',
    lg: 'h-10 w-10 text-lg'
  }

  const roundedStyles = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }

  const disabledStyle =
    disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant][colorScheme]} ${sizeStyles[size]} ${roundedStyles[rounded]} ${disabledStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        icon
      )}
    </button>
  )
}
