import React from 'react'

/**
 * Input component for text fields
 *
 * @example
 * ```tsx
 * <Input type="email" placeholder="Enter email" />
 * <Input error leftIcon={<SearchIcon />} />
 * <Input rightElement={<IconButton icon={<EyeIcon />} />} />
 * ```
 */

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'filled' | 'flushed'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  rightElement?: React.ReactNode
  fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      error = false,
      leftIcon,
      rightIcon,
      rightElement,
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

    const sizeStyles = {
      sm: 'h-9 text-sm',
      md: 'h-10 text-sm',
      lg: 'h-11 text-base'
    }

    const errorStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : ''
    const widthStyle = fullWidth ? 'w-full' : ''
    const hasLeftIcon = leftIcon ? 'pl-10' : ''
    const hasRightElement = rightIcon || rightElement ? 'pr-10' : ''

    if (leftIcon || rightIcon || rightElement) {
      return (
        <div className={`relative ${widthStyle}`}>
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${errorStyles} ${widthStyle} ${hasLeftIcon} ${hasRightElement} ${className}`}
            {...props}
          />
          {(rightIcon || rightElement) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightElement || rightIcon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${errorStyles} ${widthStyle} ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
