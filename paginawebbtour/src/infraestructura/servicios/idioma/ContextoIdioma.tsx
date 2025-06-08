 
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface IdiomaContextoProps {
  idioma: string;
  cambiarIdioma: (idioma: string) => void;
  idiomasDisponibles: { codigo: string; nombre: string; bandera: string }[];
}

const IdiomaContexto = createContext<IdiomaContextoProps | undefined>(undefined);

interface ContextoIdiomaProviderProps {
  children: ReactNode;
}

export const ContextoIdiomaProvider = ({ children }: ContextoIdiomaProviderProps) => {
  const { i18n } = useTranslation();
  const [idioma, setIdioma] = useState(i18n.language || 'es');

  const idiomasDisponibles = [
    { codigo: 'es', nombre: 'Español', bandera: '🇪🇸' },
    { codigo: 'en', nombre: 'English', bandera: '🇺🇸' }
  ];

  useEffect(() => {
    // Sincronizar el estado local con i18n
    setIdioma(i18n.language);
  }, [i18n.language]);

  const cambiarIdioma = (nuevoIdioma: string) => {
    i18n.changeLanguage(nuevoIdioma);
    setIdioma(nuevoIdioma);
    // Guardar preferencia en localStorage
    localStorage.setItem('idioma', nuevoIdioma);
  };

  return (
    <IdiomaContexto.Provider value={{ idioma, cambiarIdioma, idiomasDisponibles }}>
      {children}
    </IdiomaContexto.Provider>
  );
};

export const useIdioma = (): IdiomaContextoProps => {
  const context = useContext(IdiomaContexto);
  if (context === undefined) {
    throw new Error('useIdioma debe ser usado dentro de un ContextoIdiomaProvider');
  }
  return context;
};

export default IdiomaContexto;