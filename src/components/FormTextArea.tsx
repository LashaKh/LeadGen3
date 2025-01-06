import React from 'react';

interface FormTextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export function FormTextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
}: FormTextAreaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <textarea
        id={id}
        required={required}
        rows={rows}
        className="mt-1 block w-full rounded-lg bg-white/5 border border-purple-900/30 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
