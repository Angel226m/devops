 
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar archivos de traducción
import es from '../servicios/idioma/traducciones/es';
import en from '../servicios/idioma/traducciones/en';

// Configurar i18next
i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Inicializa react-i18next
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en }
    },
    fallbackLng: 'es', // Idioma por defecto
    interpolation: {
      escapeValue: false // No escapar HTML
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;