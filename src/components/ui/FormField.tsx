import React from 'react'

type Option = {
  value: string
  label: string
}
interface FormFieldProps {
  label: string
  id: string
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'tel'
    | 'url'
    | 'number'
    | 'date'
    | 'select'
    | 'textarea'
  placeholder?: string
  required?: boolean
  value: string | string[]
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  onBlur?: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  options?: Option[]
  helpText?: string
  className?: string
  textarea?: boolean
  error?: string
  disabled?: boolean
  rows?: number
}
export function FormField({
  label,
  id,
  type = 'text',
  placeholder = '',
  required = false,
  value,
  onChange,
  onBlur,
  options = [],
  helpText,
  className = '',
  textarea = false,
  error,
  disabled = false
}: FormFieldProps) {
  // If textarea is true, override type
  if (textarea) {
    type = 'textarea'
  }
  return (
    <div className={`form-field ${className}`}>
      <label
        htmlFor={id}
        className='block text-sm font-medium text-gray-800 mb-1'
      >
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          rows={4}
          className={`block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : ''
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          name={id}
          className={`block w-full h-10 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : ''
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
        >
          <option value=''>Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          className={`block w-full h-10 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : ''
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
        />
      )}
      {helpText && <p className='mt-1 text-xs text-gray-500'>{helpText}</p>}
      {error && <p className='mt-1 text-xs text-red-600'>{error}</p>}
    </div>
  )
}
