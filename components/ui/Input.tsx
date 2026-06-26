import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 outline-none text-sm transition-colors',
            'bg-white text-gray-900 placeholder:text-gray-400',
            error
              ? 'border-brand-red focus:border-brand-red'
              : 'border-gray-200 focus:border-brand-orange',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
