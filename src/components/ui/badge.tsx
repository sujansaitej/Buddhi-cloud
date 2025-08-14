import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'soft'
  children: React.ReactNode
}

export function Badge({ variant = 'default', className = '', ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
  
  const variantClasses = {
    default: 'border-transparent bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200',
    destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
    outline: 'bg-white text-gray-900 border-gray-200',
    soft: 'border-transparent'
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`
  
  return (
    <div className={classes} {...props} />
  )
} 