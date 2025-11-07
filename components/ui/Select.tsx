"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  value = "",
  onChange,
  disabled = false,
  className,
  name,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      // Create a synthetic event to match the expected signature
      const syntheticEvent = {
        target: { value: optionValue, name: name || "" },
        currentTarget: { value: optionValue, name: name || "" },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 bg-white text-left flex items-center justify-between shadow-sm",
            error
              ? "border-error focus:ring-error"
              : "border-border hover:border-primary hover:shadow-md",
            disabled && "opacity-50 cursor-not-allowed",
            isOpen && "border-primary ring-2 ring-primary",
            className
          )}
        >
          <span className={cn("truncate text-sm", selectedOption ? "text-text-primary font-medium" : "text-text-secondary")}>
            {selectedOption ? selectedOption.label : placeholder || "Select an option"}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-text-secondary flex-shrink-0 transition-transform duration-200 ml-2",
              isOpen && "rotate-180 text-primary"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-border rounded-lg shadow-xl max-h-60 overflow-auto transform transition-all duration-200 ease-out origin-top">
            {placeholder && !selectedOption && (
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={cn(
                  "w-full px-4 py-2.5 text-left hover:bg-surface transition-colors text-sm border-b border-border",
                  !selectedOption && "bg-surface font-medium"
                )}
              >
                <span className="text-text-secondary">{placeholder}</span>
              </button>
            )}
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full px-4 py-2.5 text-left hover:bg-surface transition-colors text-sm",
                  selectedOption?.value === option.value && "bg-secondary text-text-primary font-medium",
                  index !== 0 && "border-t border-border"
                )}
              >
                <span className="text-text-primary">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-error font-medium">{error}</p>}
    </div>
  );
};
