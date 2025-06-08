/*import { useTranslation } from 'react-i18next';

interface SelectorPasajeProps {
  tipo: 'adulto' | 'nino';
  precio: number;
  cantidad: number;
  setCantidad: (cantidad: number) => void;
  min: number;
  max: number;
}

const SelectorPasaje = ({ tipo, precio, cantidad, setCantidad, min, max }: SelectorPasajeProps) => {
  const { t } = useTranslation();
  
  const incrementar = () => {
    if (cantidad < max) {
      setCantidad(cantidad + 1);
    }
  };
  
  const decrementar = () => {
    if (cantidad > min) {
      setCantidad(cantidad - 1);
    }
  };
  
  const getBgColor = () => {
    return tipo === 'adulto' 
      ? 'bg-blue-50/70' 
      : 'bg-cyan-50/70';
  };
  
  return (
    <div className={`flex items-center justify-between ${getBgColor()} border border-sky-100 rounded-lg p-3 shadow-sm`}>
      <div>
        <h4 className="font-medium text-black">
          {tipo === 'adulto' ? t('tour.adulto') : t('tour.nino')}
        </h4>
        <p className="text-sm text-blue-700">
          {tipo === 'adulto' 
            ? t('tour.adultoDescripcion') 
            : t('tour.ninoDescripcion')}
        </p>
        <p className="text-teal-600 font-medium mt-1">
          ${precio.toFixed(2)}
        </p>
      </div>
      
      <div className="flex items-center space-x-2 bg-white/80 p-2 rounded-lg">
        <button
          type="button"
          onClick={decrementar}
          disabled={cantidad <= min}
          className={`w-8 h-8 flex items-center justify-center rounded-full border ${
            cantidad <= min
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-teal-200 text-teal-600 hover:bg-teal-50'
          }`}
          aria-label={t('general.decrementar')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <span className="text-black w-5 text-center font-medium">
          {cantidad}
        </span>
        
        <button
          type="button"
          onClick={incrementar}
          disabled={cantidad >= max}
          className={`w-8 h-8 flex items-center justify-center rounded-full border ${
            cantidad >= max
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-teal-200 text-teal-600 hover:bg-teal-50'
          }`}
          aria-label={t('general.incrementar')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SelectorPasaje;*/



import { useTranslation } from 'react-i18next';

interface SelectorPasajeProps {
  tipo: string;
  precio: number;
  cantidad: number;
  setCantidad: (cantidad: number) => void;
  min: number;
  max: number;
  edad?: string;
  colorScheme?: 'blue' | 'teal' | 'primary';
}

const SelectorPasaje = ({ 
  tipo, 
  precio, 
  cantidad, 
  setCantidad, 
  min, 
  max,
  edad,
  colorScheme = 'blue'
}: SelectorPasajeProps) => {
  const { t } = useTranslation();
  
  // Obtener clases de colores según el esquema seleccionado
  const getColorClasses = () => {
    switch (colorScheme) {
      case 'teal':
        return {
          bg: 'bg-teal-50',
          border: 'border-teal-200',
          text: 'text-teal-800',
          buttonBg: 'bg-teal-100',
          buttonHover: 'hover:bg-teal-200',
          buttonText: 'text-teal-600',
          buttonDisabled: 'text-teal-300',
          priceText: 'text-teal-600'
        };
      case 'primary':
        return {
          bg: 'bg-primary-50',
          border: 'border-primary-200',
          text: 'text-primary-800',
          buttonBg: 'bg-primary-100',
          buttonHover: 'hover:bg-primary-200',
          buttonText: 'text-primary-600',
          buttonDisabled: 'text-primary-300',
          priceText: 'text-primary-600'
        };
      case 'blue':
      default:
        return {
          bg: 'bg-sky-50',
          border: 'border-sky-200',
          text: 'text-blue-800',
          buttonBg: 'bg-sky-100',
          buttonHover: 'hover:bg-sky-200',
          buttonText: 'text-blue-600',
          buttonDisabled: 'text-blue-300',
          priceText: 'text-blue-600'
        };
    }
  };
  
  const colors = getColorClasses();
  
  const incrementar = () => {
    if (cantidad < max) {
      setCantidad(cantidad + 1);
    }
  };
  
  const decrementar = () => {
    if (cantidad > min) {
      setCantidad(cantidad - 1);
    }
  };

  return (
    <div className={`flex items-center justify-between p-3 ${colors.bg} border ${colors.border} rounded-lg`}>
      <div>
        <div className={`font-medium ${colors.text}`}>{tipo}</div>
        {edad && (
          <div className="text-xs text-gray-500 mt-1">{edad}</div>
        )}
        <div className={`text-sm font-medium ${colors.priceText}`}>${precio.toFixed(2)}</div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={decrementar}
          disabled={cantidad <= min}
          className={`w-8 h-8 flex items-center justify-center rounded-full ${colors.buttonBg} ${colors.buttonHover} transition-colors`}
          aria-label={t('general.decrementar')}
        >
          <span className={`${cantidad <= min ? colors.buttonDisabled : colors.buttonText}`}>-</span>
        </button>
        
        <span className={`w-6 text-center ${colors.text}`}>{cantidad}</span>
        
        <button
          type="button"
          onClick={incrementar}
          disabled={cantidad >= max}
          className={`w-8 h-8 flex items-center justify-center rounded-full ${colors.buttonBg} ${colors.buttonHover} transition-colors`}
          aria-label={t('general.incrementar')}
        >
          <span className={`${cantidad >= max ? colors.buttonDisabled : colors.buttonText}`}>+</span>
        </button>
      </div>
    </div>
  );
};

export default SelectorPasaje;