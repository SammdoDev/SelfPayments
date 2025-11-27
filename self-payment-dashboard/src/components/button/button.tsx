'use client';

import { Button } from 'primereact/button';
import React from 'react';
import '@/styles/custom-button.css';

interface CustomButtonProps {
  label?: string;
  icon?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  severity?: 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' | 'contrast';
  disabled?: boolean;
  size?: 'small' | 'large';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label = 'Click Me',
  icon,
  onClick,
  className = '',
  type = 'button',
  severity = 'secondary',
  disabled = false,
  size,
  rounded = 'md',
}) => {
  const roundedClass = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded];

  return (
    <Button
      label={label}
      icon={icon}
      onClick={onClick}
      className={`custom-button ${roundedClass} ${className}`}
      type={type}
      severity={severity}
      disabled={disabled}
      size={size}
    />
  );
};

export default CustomButton;
