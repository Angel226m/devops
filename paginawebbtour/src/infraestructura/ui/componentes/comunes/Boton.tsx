 
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type BotonVariante = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type BotonTamano = 'sm' | 'md' | 'lg' | 'xl';
type BotonAncho = 'auto' | 'full';

interface BotonProps {
  texto: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variante?: BotonVariante;
  tamano?: BotonTamano;
  ancho?: BotonAncho;
  disabled?: boolean;
  cargando?: boolean;
  icono?: React.ReactNode;
  iconoPosicion?: 'izquierda' | 'derecha';
  className?: string;
  ruta?: string;
  externo?: boolean;
}

const Boton = ({
  texto,
  onClick,
  type = 'button',
  variante = 'primary',
  tamano = 'md',
  ancho = 'auto',
  disabled = false,
  cargando = false,
  icono,
  iconoPosicion = 'izquierda',
  className = '',
  ruta,
  externo = false
}: BotonProps) => {
  // Mapas de clases según las propiedades
  const varianteClases = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-md hover:shadow-lg',
    outline: 'bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
  };

  const tamanoClases = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const anchoClases = {
    auto: 'inline-flex',
    full: 'flex w-full'
  };

  // Clase base del botón
  const baseClases = `${anchoClases[ancho]} items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`;
  
  // Juntar todas las clases
  const clases = `${baseClases} ${varianteClases[variante]} ${tamanoClases[tamano]} ${className} ${disabled || cargando ? 'opacity-70 cursor-not-allowed' : ''}`;

  // Contenido del botón
  const contenido = (
    <>
      {cargando ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{texto}</span>
        </span>
      ) : (
        <>
          {icono && iconoPosicion === 'izquierda' && <span className="mr-2">{icono}</span>}
          <span>{texto}</span>
          {icono && iconoPosicion === 'derecha' && <span className="ml-2">{icono}</span>}
        </>
      )}
    </>
  );

  // Si tiene una ruta, renderizar como Link
  if (ruta) {
    if (externo) {
      return (
        <motion.a
          whileTap={{ scale: 0.98 }}
          href={ruta}
          target="_blank"
          rel="noopener noreferrer"
          className={clases}
        >
          {contenido}
        </motion.a>
      );
    }
    return (
      <motion.div whileTap={{ scale: 0.98 }}>
        <Link to={ruta} className={clases}>
          {contenido}
        </Link>
      </motion.div>
    );
  }

  // Si no tiene ruta, renderizar como button
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || cargando}
      className={clases}
    >
      {contenido}
    </motion.button>
  );
};

export default Boton;