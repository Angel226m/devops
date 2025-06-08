 
import React from 'react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Seleccione fecha',
  required = false,
  disabled = false,
  min,
  max,
  className = '',
}) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      min={min}
      max={max}
      className={`w-full p-2 border rounded ${className}`}
    />
  );
};

export default DatePicker;