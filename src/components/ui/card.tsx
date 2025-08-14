import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ className = '', ...props }: CardProps) {
  const baseClasses = 'rounded-2xl border border-gray-100 bg-white/90 backdrop-blur text-gray-900 shadow-sm'
  return <div className={`${baseClasses} ${className}`} {...props} />
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardHeader({ className = '', ...props }: CardHeaderProps) {
  const baseClasses = 'flex flex-col space-y-1.5 p-6'
  return <div className={`${baseClasses} ${className}`} {...props} />
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function CardTitle({ className = '', ...props }: CardTitleProps) {
  const baseClasses = 'text-2xl font-semibold leading-none tracking-tight'
  return <h3 className={`${baseClasses} ${className}`} {...props} />
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export function CardDescription({ className = '', ...props }: CardDescriptionProps) {
  const baseClasses = 'text-sm text-gray-600'
  return <p className={`${baseClasses} ${className}`} {...props} />
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardContent({ className = '', ...props }: CardContentProps) {
  const baseClasses = 'p-6 pt-0'
  return <div className={`${baseClasses} ${className}`} {...props} />
} 