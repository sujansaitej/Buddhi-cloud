import React from 'react'

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
}

export function Switch({ checked, onCheckedChange, className = '', label, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-gray-300'} ${className}`}
      {...props}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
      />
      {label && <span className="ml-2 text-sm text-gray-700">{label}</span>}
    </button>
  )
}



