import React from 'react';
type Option = {
  value: string;
  label: string;
};
interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  value: string | string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options?: Option[];
  helpText?: string;
  className?: string;
  textarea?: boolean;
  error?: string;
  disabled?: boolean;
}
export function FormField({
  label,
  id,
  type = 'text',
  placeholder = '',
  required = false,
  value,
  onChange,
  options = [],
  helpText,
  className = '',
  textarea = false,
  error,
  disabled = false
}: FormFieldProps) {
  // If textarea is true, override type
  if (textarea) {
    type = 'textarea';
  }
  return <div className={`form-field ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-800 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? <textarea id={id} name={id} rows={4} className={`block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`} placeholder={placeholder} value={value as string} onChange={onChange} required={required} disabled={disabled} /> : type === 'select' ? <select id={id} name={id} className={`block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`} value={value as string} onChange={onChange} required={required} disabled={disabled}>
          <option value="">Välj ett alternativ</option>
          {options.map(option => <option key={option.value} value={option.value}>
              {option.label}
            </option>)}
        </select> : <input id={id} name={id} type={type} className={`block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`} placeholder={placeholder} value={value as string} onChange={onChange} required={required} disabled={disabled} />}
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>;
}