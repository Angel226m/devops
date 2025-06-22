 /*

import { motion } from 'framer-motion';

const OceanLogo = () => {
  return (
    <div className="flex items-center space-x-3">
      <motion.div
        initial={{ y: 0 }}
        animate={{ 
          y: [0, -5, 0, 5, 0],
          rotate: [0, 2, 0, -2, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'loop',
          ease: "easeInOut"
        }}
        className="text-cyan-600"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-12 h-12"
        >
          <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
        </svg>
      </motion.div>
      <div>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-800"
        >
          <span className="text-cyan-600">Ocean</span>
          <span>Tours</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm text-gray-600"
        >
          Pisco, Perú
        </motion.p>
      </div>
    </div>
  );
};

export default OceanLogo;*/

import { motion } from 'framer-motion';

const OceanLogo = () => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ 
            y: [0, -3, 0, 3, 0],
            opacity: 1
          }}
          transition={{
            opacity: { duration: 0.3 },
            y: {
              duration: 5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }
          }}
          className="text-blue-600"
        >
          {/* Icono principal */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-14 h-14"
          >
            <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
          </svg>
          
          {/* Ondas del agua (decorativas) */}
          <motion.div
            className="absolute -bottom-4 -left-4 w-20 h-6 opacity-60"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path d="M0,15 C15,15 15,0 30,0 C45,0 45,15 60,15 C75,15 75,0 90,0 C105,0 105,15 120,15 V30 H0 Z" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
      <div className="ml-3">
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl font-bold text-gray-800"
        >
          <span className="text-blue-600">Ocean</span>
          <span>Tours</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm text-gray-600 mt-1"
        >
          Pisco, Perú
        </motion.p>
      </div>
    </div>
  );
};

export default OceanLogo;