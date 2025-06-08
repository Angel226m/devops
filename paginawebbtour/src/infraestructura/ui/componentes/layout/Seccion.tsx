 
import { ReactNode } from 'react';

interface SeccionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

const Seccion = ({ children, className = '', id }: SeccionProps) => {
  return (
    <section id={id} className={`w-full ${className}`}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
};

export default Seccion;