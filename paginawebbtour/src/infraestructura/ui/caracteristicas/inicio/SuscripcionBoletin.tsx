 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const SuscripcionBoletin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    // Simulación de envío
    setTimeout(() => {
      setCargando(false);
      setEnviado(true);
      setEmail('');
      
      // Resetear mensaje después de 5 segundos
      setTimeout(() => {
        setEnviado(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section className="py-16 bg-ocean-600 dark:bg-ocean-900 relative overflow-hidden">
      {/* Olas decorativas */}
      <div className="absolute top-0 left-0 right-0 transform rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full text-white dark:text-gray-900">
          <path 
            fill="currentColor" 
            fillOpacity="1" 
            d="M0,32L60,48C120,64,240,96,360,96C480,96,600,64,720,48C840,32,960,32,1080,42.7C1200,53,1320,75,1380,85.3L1440,96L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
          />
        </svg>
      </div>
      
      {/* Burbujas animadas */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 80 + 20,
              height: Math.random() * 80 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {t('boletin.titulo')}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-ocean-100 mb-8 text-lg"
          >
            {t('boletin.descripcion')}
          </motion.p>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('boletin.placeholder')}
              required
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              disabled={cargando || enviado}
            />
            
            <button
              type="submit"
              className={`px-6 py-3 bg-white text-ocean-600 font-semibold rounded-lg hover:bg-ocean-100 transition-colors duration-300 disabled:opacity-70 ${
                cargando || enviado ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              disabled={cargando || enviado}
            >
              {cargando ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-ocean-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('boletin.procesando')}
                </span>
              ) : enviado ? t('boletin.exito') : t('boletin.suscribirse')}
            </button>
          </motion.form>
          
          {enviado && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 text-white bg-ocean-500/30 p-2 rounded-lg"
            >
              {t('boletin.mensajeExito')}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SuscripcionBoletin;