'use client';

import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '@/styles/custom-textarea.css'; // ⬅️ tambahkan CSS dark/light di sini

interface CustomTextAreaProps {
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: { name: string; value: string }) => void;
  rows?: number;
  autoResize?: boolean;
  className?: string;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  autoResize = true,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ name, value: e.target.value });
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="font-medium text-sm">{label}</label>}

      <InputTextarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        rows={rows}
        autoResize={autoResize}
        className="custom-textarea w-full rounded-md"
      />
    </div>
  );
};

export default CustomTextArea;
