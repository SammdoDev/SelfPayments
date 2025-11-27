"use client";

import { AutoComplete } from "primereact/autocomplete";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import "@/styles/autocomplete-dark.css";

export interface AutocompleteOption {
  label: string;
  value: string;
}

interface AutocompleteFieldProps {
  value: AutocompleteOption | null;
  onChange: (value: AutocompleteOption | null) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  onFocus?: () => void;
}

const CustomAutoComplete: React.FC<AutocompleteFieldProps> = ({
  value,
  onChange,
  options,
  placeholder = "Search...",
  label,
  className,
  onFocus,
}) => {
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>(
    []
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    const checkTheme = () =>
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const search = (event: { query: string }) => {
    const query = event.query.toLowerCase();
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
    setFilteredOptions(filtered);
  };

  const clearSelection = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const showAllOptions = () => {
    setFilteredOptions(options);
  };

  const handleFocus = () => {
    showAllOptions();
    if (onFocus) onFocus();
  };

  return (
    <div className={`${className}gap-1 w-full`}>
      {label && (
        <label
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <AutoComplete
          ref={inputRef}
          field="label"
          value={value}
          suggestions={filteredOptions}
          completeMethod={search}
          onChange={(e) => onChange(e.value || null)}
          placeholder={placeholder}
          className={`w-full ${isDarkMode ? "p-autocomplete-dark" : ""}`}
          dropdown
          onDropdownClick={showAllOptions}
          onFocus={handleFocus}
        />

        {value && (
          <button
            type="button"
            onClick={clearSelection}
            className={`absolute right-14 top-1/2 -translate-y-1/2 rounded-full p-1 transition ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomAutoComplete;
