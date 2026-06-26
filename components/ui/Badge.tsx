import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'success' | 'error' | 'warning' | 'gray'
}

const variants = {
  default: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
  success: 'bg-green-50 text-brand-green border-green-200',
  error: 'bg-red-50 text-brand-red border-red-200',
  warning: 'bg-orange-100 text-orange-700 border-orange-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
