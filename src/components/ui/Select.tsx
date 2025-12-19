import React from 'react'

/**
 * Select component for dropdown menus
 *
 * @example
 * ```tsx
 * <Select
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' }
 *   ]}
 *   placeholder="Select an option"
 * />
 * ```
 */

interface SelectOption {
  value: string
  label: string
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'default' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  options?: SelectOption[]
  placeholder?: string
  fullWidth?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      variant = 'default',
      size = 'md',
      error = false,
      options = [],
      placeholder,
      fullWidth = true,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'px-3 py-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white'

    const variantStyles = {
      default: 'border-gray-300 focus:border-indigo-500',
      filled: 'border-transparent bg-gray-100 focus:bg-white focus:border-indigo-500'
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

    return (
      <select
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${errorStyles} ${widthStyle} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'
