'use client';

import { Calendar as PrimeCalendar, CalendarProps } from 'primereact/calendar';
import { useState, useEffect, useRef } from 'react';
import '@/styles/calendar-dark.css';

interface CustomCalendarProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  placeholder?: string;
  label?: string;
  showIcon?: boolean;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  label,
  showIcon = true,
  dateFormat = 'yy-mm-dd',
  minDate,
  maxDate,
  disabled = false,
  className = '',
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    const checkTheme = () =>
      setIsDarkMode(document.documentElement.classList.contains('dark'));

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const handleChange: CalendarProps['onChange'] = (e) => {
    onChange(e.value as Date | null);
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label
          className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <PrimeCalendar
          ref={calendarRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          showIcon={showIcon}
          dateFormat={dateFormat}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          className={`w-full ${isDarkMode ? 'p-calendar-dark' : ''}`}
        />
      </div>
    </div>
  );
};

export default CustomCalendar;
