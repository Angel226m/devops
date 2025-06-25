 import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seccion from '../../componentes/layout/Seccion';
import Cargador from '../../componentes/comunes/Cargador';
import { Link } from 'react-router-dom';

interface Sede {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  distrito: string;
  provincia: string;
  pais: string;
  imagen: string;
  descripcion: string;
}

const PaginaSedes = () => {
  const { t } = useTranslation();
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Simulación de carga de datos
  useEffect(() => {
    // Desplazar al inicio de la página
    window.scrollTo(0, 0);
    // En un caso real, aquí se haría la petición a la API
    setTimeout(() => {
      const data = [
        {
          id: 1,
          nombre: "Sede Principal - Pisco",
          direccion: "Av. San Martín 123, Pisco",
          telefono: "+51 956 789 123",
          correo: "pisco@oceantours.com",
          distrito: "Pisco",
          provincia: "Pisco",
          pais: "Perú",
          imagen: "https://images.unsplash.com/photo-1596397249129-c7524aba3e53",
          descripcion: "Nuestra sede principal ubicada en el corazón de Pisco, a pocos minutos deles el terminal portuario general San Martín. Cuenta con amplio estacionamiento, cafetería y todas las comodidades para iniciar tu aventura marina."
        },
        {
          id: 2,
          nombre: "Sede Paracas",
          direccion: "Malecón Paracas 456, Paracas",
          telefono: "+51 945 678 912",
          correo: "paracas@oceantours.com",
          distrito: "Paracas",
          provincia: "Pisco",
          pais: "Perú",
          imagen: "https://images.unsplash.com/photo-1596397454750-43b7c6c2e05f",
          descripcion: "Ubicada cerca al puerto de Paracas, nuestra sede ofrece tours directos a la Reserva Nacional de Paracas y experiencias de avistamiento de fauna marina. Disfruta de nuestro lounge con vista al mar mientras esperas tu aventura."
        },
        {
          id: 3,
          nombre: "Sede San Andrés",
          direccion: "Calle Los Pescadores 789, San Andrés",
          telefono: "+51 934 567 891",
          correo: "sanandres@oceantours.com",
          distrito: "San Andrés",
          provincia: "Pisco",
          pais: "Perú",
          imagen: "https://images.unsplash.com/photo-1581888517319-2693814b5fe4",
          descripcion: "Nuestra sede en el tradicional distrito pesquero de San Andrés, especializada en tours de pesca deportiva y experiencias gastronómicas marinas. Aprende de los mejores pescadores locales y disfruta del auténtico sabor del mar."
        }
      ];
      setSedes(data);
      setCargando(false);
    }, 1500);
  }, []);
  
  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Cargador tamano="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Cabecera */}
      <div className="relative h-64 md:h-80 bg-blue-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1601232257562-9c79c45bda7e')",
            opacity: 0.7
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-blue-700/60 to-blue-900/80" />
        
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">{t('sedes.titulo')}</h1>
            <p className="text-lg text-white max-w-2xl mx-auto drop-shadow">
              {t('sedes.descripcion')}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <Seccion className="py-16 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-16">
            {sedes.map((sede, index) => (
              <motion.div
                key={sede.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8 items-center bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={sede.imagen} 
                    alt={sede.nombre} 
                    className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="w-full md:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                      {sede.nombre}
                    </h2>
                    
                    <p className="text-gray-700 mb-6">
                      {sede.descripcion}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-800 font-medium">{sede.direccion}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-800">{sede.telefono}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-800">{sede.correo}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Link
                        to={`/tours?sede=${sede.id}`}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                      >
                        {t('sedes.verTours')}
                      </Link>
                      <a
                        href={`https://maps.google.com/?q=${sede.direccion}, ${sede.distrito}, ${sede.pais}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                      >
                        {t('sedes.verMapa')}
                      </a>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Seccion>
      
      {/* Sección de Contacto */}
      <Seccion className="py-16 bg-gradient-to-b from-blue-50 to-teal-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            {t('sedes.contactoTitulo')}
          </h2>
          <p className="text-gray-700">
            {t('sedes.contactoDescripcion')}
          </p>
        </motion.div>
        
        <div className="flex justify-center">
          <Link
            to="/contacto"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {t('sedes.contactoBoton')}
          </Link>
        </div>
      </Seccion>
    </div>
  );
};

export default PaginaSedes;