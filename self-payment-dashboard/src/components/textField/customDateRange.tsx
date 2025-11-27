"use client";

import { Calendar } from "primereact/calendar";
import { useEffect, useRef, useState } from "react";
import "@/styles/date-range-dark.css";
import { formatDate } from "@/utils/context/dateUtils";

interface CustomDateRangeProps {
  value?: [Date | null, Date | null];
  onChange: (value: [Date | null, Date | null]) => void;
  label?: string;
  placeholder?: string;
  showIcon?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
}

const CustomDateRange: React.FC<CustomDateRangeProps> = ({
  value,
  onChange,
  label,
  placeholder = "Select date range",
  showIcon = true,
  minDate,
  maxDate,
  disabled = false,
  className = "",
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const calendarRef = useRef<any>(null);

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const initialRange: [Date | null, Date | null] =
    value && value[0] && value[1] ? value : [sevenDaysAgo, today];

  const [dateRange, setDateRange] =
    useState<[Date | null, Date | null]>(initialRange);

  useEffect(() => {
    if (!value || !value[0] || !value[1]) {
      onChange([sevenDaysAgo, today]);
    }
  }, []);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleChange = (e: any) => {
    const range = e.value as [Date | null, Date | null];
    if (range && range[0] && !range[1]) {
      setDateRange([range[0], range[0]]);
      onChange([range[0], range[0]]);
    } else {
      setDateRange(range);
      onChange(range);
    }
  };

  const displayValue =
    dateRange[0] && dateRange[1]
      ? `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`
      : "";

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label
          htmlFor="dateRange"
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <Calendar
          ref={calendarRef}
          id="dateRange"
          value={dateRange}
          onChange={handleChange}
          selectionMode="range"
          placeholder={placeholder}
          showIcon={showIcon}
          dateFormat="dd M yy"
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          readOnlyInput
          inputClassName="cursor-pointer"
          className={`w-full ${
            isDarkMode ? "p-calendar-dark" : "p-calendar-light"
          }`}
          panelClassName={
            isDarkMode ? "p-calendar-panel-dark" : "p-calendar-panel-light"
          }
        />

        {displayValue && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none text-transparent">
            {displayValue}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDateRange;
