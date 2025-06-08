 
interface InsigniaProps {
  texto: string;
  variante?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  tamano?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Insignia = ({
  texto,
  variante = 'primary',
  tamano = 'md',
  className = ''
}: InsigniaProps) => {
  // Mapas de clases según las propiedades
  const varianteClases = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
    secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  };

  const tamanoClases = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${varianteClases[variante]} ${tamanoClases[tamano]} ${className}`}>
      {texto}
    </span>
  );
};

export default Insignia;