import React from 'react'

/**
 * Card component for grouping related content
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="md">
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 * </Card>
 * ```
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  children: React.ReactNode
  className?: string
}

interface CardSubComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function Card({
  variant = 'default',
  padding = 'md',
  shadow,
  rounded = 'lg',
  hover = false,
  children,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'bg-white border transition-all'

  const variantStyles = {
    default: 'border-gray-200 shadow-sm',
    elevated: 'border-gray-100 shadow-md hover:shadow-lg',
    outlined: 'border-gray-300 bg-transparent',
    interactive:
      'border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-100 cursor-pointer'
  }

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6'
  }

  const shadowStyles = shadow
    ? {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg'
      }[shadow]
    : ''

  const roundedStyles = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }

  const hoverStyle = hover && variant !== 'interactive' ? 'hover:shadow-md' : ''

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${shadowStyles} ${roundedStyles[rounded]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ children, className = '', ...props }: CardSubComponentProps) {
  return (
    <div className={`px-5 py-4 border-b border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  )
}

function CardBody({ children, className = '', ...props }: CardSubComponentProps) {
  return (
    <div className={`px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ children, className = '', ...props }: CardSubComponentProps) {
  return (
    <div className={`px-5 py-4 border-t border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter
