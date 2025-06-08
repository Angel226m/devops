 
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
        className="text-ocean-500 dark:text-ocean-400"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-9 h-9"
        >
          <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
        </svg>
      </motion.div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          <span className="text-ocean-500 dark:text-ocean-400">Ocean</span>
          <span>Tours</span>
        </h1>
        <p className="text-xs text-gray-600 dark:text-gray-400">Pisco, Perú</p>
      </div>
    </div>
  );
};

export default Logo;