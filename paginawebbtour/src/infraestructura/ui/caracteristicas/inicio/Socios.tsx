 
import { motion } from 'framer-motion';

const Socios = () => {
  // Lista de socios (simulados)
  const socios = [
    { id: 1, nombre: 'Turismo Perú', logo: 'https://via.placeholder.com/150x80/e2e8f0/475569?text=Turismo+Perú' },
    { id: 2, nombre: 'Viajes Seguros', logo: 'https://via.placeholder.com/150x80/e2e8f0/475569?text=Viajes+Seguros' },
    { id: 3, nombre: 'Aventura Total', logo: 'https://via.placeholder.com/150x80/e2e8f0/475569?text=Aventura+Total' },
    { id: 4, nombre: 'Pisco Travel', logo: 'https://via.placeholder.com/150x80/e2e8f0/475569?text=Pisco+Travel' },
    { id: 5, nombre: 'Descubre Paracas', logo: 'https://via.placeholder.com/150x80/e2e8f0/475569?text=Descubre+Paracas' },
    { id: 6, nombre: 'Marina Tours', logo: 'https://via.placeholder.com/150x80/e2e8f0/475569?text=Marina+Tours' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
      {socios.map((socio, index) => (
        <motion.div
          key={socio.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: "easeOut" 
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
          }}
          className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-4 h-24"
        >
          <img 
            src={socio.logo} 
            alt={socio.nombre} 
            className="max-h-12 max-w-full"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Socios;