import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import '@/styles/custom-text-field.css'; 

interface CustomTextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: { name: string; value: string }) => void;
  className?: string;
  type?: string;
  clearable?: boolean;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  name,
  label,
  placeholder,
  value = '',
  onChange,
  className = '',
  type = 'text',
  clearable = true,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.({ name: e.target.name, value: e.target.value });
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.({ name, value: '' });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPasswordField = type === 'password';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        <InputText
          name={name}
          type={isPasswordField && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={internalValue}
          onChange={handleChange}
          className={`custom-text-input w-full pr-10 ${className}`}
        />

        {clearable && internalValue && (
          <i
            className="pi pi-times absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 cursor-pointer"
            onClick={handleClear}
          />
        )}

        {isPasswordField && (
          <i
            className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'} absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 cursor-pointer`}
            onClick={togglePasswordVisibility}
          />
        )}
      </div>
    </div>
  );
};

export default CustomTextField;
