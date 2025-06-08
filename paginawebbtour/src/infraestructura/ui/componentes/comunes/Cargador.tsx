 
import { FC } from 'react';

interface CargadorProps {
  texto?: string;
  tamano?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

const Cargador: FC<CargadorProps> = ({ 
  texto = 'Cargando...', 
  tamano = 'md', 
  color = 'primary' 
}) => {
  // Mapeo de tamaños
  const tamanoClases = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  
  // Mapeo de colores
  const colorClases = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    white: 'text-white'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${tamanoClases[tamano]} ${colorClases[color]}`}>
        <svg 
          className="animate-spin -ml-1 mr-3 w-full h-full" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      {texto && (
        <p className={`mt-2 ${colorClases[color]} text-center font-medium animate-pulse`}>
          {texto}
        </p>
      )}
    </div>
  );
};

export default Cargador;