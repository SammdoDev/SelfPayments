'use client';

import { InputText } from 'primereact/inputtext';
import React from 'react';
import '@/styles/custom-number-field.css'; // ⬅️ CSS dark/light

interface CustomNumberFieldProps {
  name: string;
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (e: { name: string; value: string }) => void;
  className?: string;
  min?: number;
  max?: number;
}

const CustomNumberField: React.FC<CustomNumberFieldProps> = ({
  name,
  label,
  value,
  placeholder = '',
  onChange,
  className = '',
  min,
  max,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]*$/;
    const val = e.target.value;

    if (val === '' || regex.test(val)) {
      if (min !== undefined && parseInt(val) < min) return;
      if (max !== undefined && parseInt(val) > max) return;
      onChange({ name, value: val });
    }
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>}
      <InputText
        keyfilter="int"
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="custom-number-input w-full rounded-md"
      />
    </div>
  );
};

export default CustomNumberField;
