 
import { useState } from 'react';

interface EntradaProps {
  label: string;
  type: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  iconoIzquierda?: React.ReactNode;
  iconoDerecha?: React.ReactNode;
  onClickIconoDerecha?: () => void;
}

const Entrada = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  iconoIzquierda,
  iconoDerecha,
  onClickIconoDerecha
}: EntradaProps) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const esPassword = type === 'password';
  
  // Manejar el toggle de mostrar/ocultar contraseña
  const toggleMostrarPassword = () => {
    setMostrarPassword(!mostrarPassword);
  };
  
  // Determinar tipo de input para password
  const tipoInput = esPassword ? (mostrarPassword ? 'text' : 'password') : type;
  
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {iconoIzquierda && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {iconoIzquierda}
          </div>
        )}
        
        <input
          type={tipoInput}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-2 ${iconoIzquierda ? 'pl-10' : ''} ${(iconoDerecha || esPassword) ? 'pr-10' : ''} 
            border ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700'} 
            rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors
            ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}
          `}
        />
        
        {esPassword && (
          <button
            type="button"
            onClick={toggleMostrarPassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            {mostrarPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
        
        {!esPassword && iconoDerecha && (
          <div 
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${onClickIconoDerecha ? 'cursor-pointer' : ''}`}
            onClick={onClickIconoDerecha}
          >
            {iconoDerecha}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Entrada;