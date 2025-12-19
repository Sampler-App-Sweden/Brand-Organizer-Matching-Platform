import React from 'react'

/**
 * Avatar component for user profile images with fallback initials
 *
 * @example
 * ```tsx
 * <Avatar src="/avatar.jpg" name="John Doe" alt="John Doe" />
 * <Avatar name="Jane Smith" size="lg" colorScheme="brand" />
 * <Avatar src="/logo.png" variant="rounded" />
 * ```
 */

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'circle' | 'rounded' | 'square'
  colorScheme?: 'brand' | 'organizer' | 'gray' | 'primary'
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  variant = 'circle',
  colorScheme = 'primary',
  className = '',
  ...props
}: AvatarProps) {
  const baseStyles = 'flex items-center justify-center font-semibold overflow-hidden'

  const sizeStyles = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-20 w-20 text-xl'
  }

  const variantStyles = {
    circle: 'rounded-full',
    rounded: 'rounded-md',
    square: 'rounded-none'
  }

  const colorSchemeStyles = {
    brand: 'bg-blue-100 text-blue-800',
    organizer: 'bg-green-100 text-green-800',
    gray: 'bg-gray-200 text-gray-600',
    primary: 'bg-indigo-100 text-indigo-800'
  }

  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/)
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase()
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
  }

  if (src) {
    return (
      <div
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${colorSchemeStyles[colorScheme]} ${className}`}
      {...props}
    >
      {name ? getInitials(name) : '?'}
    </div>
  )
}
