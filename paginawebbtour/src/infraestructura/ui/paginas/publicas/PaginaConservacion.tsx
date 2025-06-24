import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ConservacionMarina from '../../caracteristicas/conservacion/ConservacionMarina';

const PaginaConservacion = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Cabecera */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-r from-blue-600 to-teal-500">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')",
            opacity: 0.3
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-teal-800/30 backdrop-blur-sm" />
        
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow-lg">
              {t('conservacion.titulo', 'Conservación Marina y Protección del Ecosistema')}
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto text-shadow">
              {t('conservacion.subtitulo', 'Descubre cómo Ocean Tours preserva el ecosistema marino de Paracas a través de protocolos rigurosos y control de visitas')}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Componente principal de conservación */}
      <ConservacionMarina />
    </div>
  );
};

export default PaginaConservacion;