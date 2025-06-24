 /*import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../../../infrastructure/store/slices/authSlice';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { FiUser, FiLock, FiLogIn, FiAnchor, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    correo: '',
    contrasena: '',
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      // Si es admin y no tiene sede seleccionada, ir a selección de sede
      if (user.rol === 'ADMIN') {
        navigate('/seleccionar-sede');
      } else {
        // Otros roles van directo a su dashboard
        redirectBasedOnRole(user.rol);
      }
    }
  }, [isAuthenticated, user]);

  // Función para redirigir según el rol
  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'ADMIN':
        navigate('/admin/dashboard');
        break;
      case 'VENDEDOR':
        navigate('/vendedor/dashboard');
        break;
      case 'CHOFER':
        navigate('/chofer/dashboard');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error al empezar a escribir
    if (error) {
      dispatch(clearError());
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Limpiar mensajes de error anteriores
    dispatch(clearError());
    
    // Despachar acción de login con el valor de "recordarme"
    const resultAction = await dispatch(
      login({ 
        ...credentials, 
        rememberMe: rememberMe  // Añadir la opción recordarme a la petición
      })
    );
    
    if (login.fulfilled.match(resultAction)) {
      console.log("Respuesta de login:", resultAction.payload);
      
      let userInfo;
      // Manejar ambos formatos de respuesta posibles
      if (resultAction.payload.usuario) {
        userInfo = resultAction.payload.usuario;
      } else {
        userInfo = resultAction.payload;
      }
      
      // Redirigir según el rol
      if (userInfo && userInfo.rol === 'ADMIN') {
        navigate('/seleccionar-sede');
      } else if (userInfo) {
        redirectBasedOnRole(userInfo.rol);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-800 to-blue-600 p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md flex flex-col">
        {/* Encabezado con animación *//*}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-8 text-white text-center">
          <div className="flex justify-center mb-3">
            <div className="rounded-full bg-white/20 p-3 transition-all duration-300 hover:scale-110">
              <FiAnchor size={42} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-wide">Tours Náuticos</h1>
          <p className="text-blue-100 mt-2 text-sm tracking-wider">SISTEMA DE ADMINISTRACIÓN</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-xl font-semibold text-center text-gray-700 mb-8">
            Bienvenido de Vuelta
          </h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center animate-fadeIn">
              <FiAlertCircle className="mr-2 flex-shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Correo Electrónico
              </label>
              <div className="relative transition-all duration-200 rounded-lg group-hover:shadow-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={credentials.correo}
                  onChange={handleChange}
                  required
                  placeholder="tu@correo.com"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                />
              </div>
            </div>
            
            <div className="group">
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Contraseña
              </label>
              <div className="relative transition-all duration-200 rounded-lg group-hover:shadow-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="contrasena"
                  name="contrasena"
                  value={credentials.contrasena}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? 
                    <FiEyeOff className="text-gray-400 hover:text-blue-500 transition-colors" /> : 
                    <FiEye className="text-gray-400 hover:text-blue-500 transition-colors" />
                  }
                </div>
              </div>
              <div className="mt-1 text-right">
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline transition-all">
                  ¿Olvidó su contraseña?
                </a>
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="remember-me" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checked:bg-blue-500 checked:right-0 checked:border-blue-500 outline-none focus:outline-none absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-all duration-200 ease-in"
                />
                <label 
                  htmlFor="remember-me" 
                  className="block overflow-hidden h-6 rounded-full bg-gray-200 cursor-pointer"
                ></label>
              </div>
              <label htmlFor="remember-me" className="text-sm text-gray-700 cursor-pointer">
                Mantener sesión iniciada
              </label>
            </div>
            
            <div className="text-xs text-gray-500 mt-1 ml-12">
              <p>
                {rememberMe 
                  ? '✓ La sesión se mantendrá activa por 7 días' 
                  : '✓ La sesión se cerrará después de 1 hora de inactividad'}
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl mt-6"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600 border-t">
          <p className="flex items-center justify-center">
            <FiAnchor className="text-blue-500 mr-1" size={14} />
            <span>Tours Náuticos &copy; {new Date().getFullYear()}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Agregar estos estilos adicionales al archivo CSS global
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
`;

export default LoginPage;*/
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../../infrastructure/store/slices/authSlice';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { FiLock, FiLogIn, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    correo: '',
    contrasena: '',
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      // Si es admin y no tiene sede seleccionada, ir a selección de sede
      if (user.rol === 'ADMIN') {
        navigate('/seleccionar-sede');
      } else {
        // Otros roles van directo a su dashboard
        redirectBasedOnRole(user.rol);
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Función para redirigir según el rol
  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'ADMIN':
        navigate('/admin/dashboard');
        break;
      case 'VENDEDOR':
        navigate('/vendedor/dashboard');
        break;
      case 'CHOFER':
        navigate('/chofer/dashboard');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error al empezar a escribir
    if (error) {
      dispatch(clearError());
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Limpiar mensajes de error anteriores
    dispatch(clearError());
    
    // Despachar acción de login con el valor de "recordarme"
    const resultAction = await dispatch(
      login({ 
        ...credentials, 
        rememberMe: rememberMe  // Añadir la opción recordarme a la petición
      })
    );
    
    if (login.fulfilled.match(resultAction)) {
      console.log("Respuesta de login:", resultAction.payload);
      
      let userInfo;
      // Manejar ambos formatos de respuesta posibles
      if (resultAction.payload.usuario) {
        userInfo = resultAction.payload.usuario;
      } else {
        userInfo = resultAction.payload;
      }
      
      // Redirigir según el rol
      if (userInfo && userInfo.rol === 'ADMIN') {
        navigate('/seleccionar-sede');
      } else if (userInfo) {
        redirectBasedOnRole(userInfo.rol);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-800 via-blue-700 to-blue-600 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md flex flex-col"
      >
        {/* Encabezado con logo animado de Ocean Tours */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-8 text-white text-center">
          <OceanLogo />
          <p className="text-blue-100 mt-2 text-sm tracking-wider">SISTEMA DE ADMINISTRACIÓN</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-xl font-semibold text-center text-gray-700 mb-8">
            Bienvenido de Vuelta
          </h2>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center"
            >
              <FiAlertCircle className="mr-2 flex-shrink-0" size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Correo Electrónico
              </label>
              <div className="relative transition-all duration-200 rounded-lg group-hover:shadow-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineMail className="text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
                </div>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={credentials.correo}
                  onChange={handleChange}
                  required
                  placeholder="tu@correo.com"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                />
              </div>
            </div>
            
            <div className="group">
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Contraseña
              </label>
              <div className="relative transition-all duration-200 rounded-lg group-hover:shadow-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="contrasena"
                  name="contrasena"
                  value={credentials.contrasena}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? 
                    <FiEyeOff className="text-gray-400 hover:text-blue-500 transition-colors" /> : 
                    <FiEye className="text-gray-400 hover:text-blue-500 transition-colors" />
                  }
                </div>
              </div>
              <div className="mt-1 text-right">
                <Link to="/recuperar-contrasena" className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline transition-all">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="remember-me" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checked:bg-blue-500 checked:right-0 checked:border-blue-500 outline-none focus:outline-none absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-all duration-200 ease-in"
                />
                <label 
                  htmlFor="remember-me" 
                  className="block overflow-hidden h-6 rounded-full bg-gray-200 cursor-pointer"
                ></label>
              </div>
              <label htmlFor="remember-me" className="text-sm text-gray-700 cursor-pointer">
                Mantener sesión iniciada
              </label>
            </div>
            
            <div className="text-xs text-gray-500 mt-1 ml-12">
              <p>
                {rememberMe 
                  ? '✓ La sesión se mantendrá activa por 7 días' 
                  : '✓ La sesión se cerrará después de 1 hora de inactividad'}
              </p>
            </div>
            
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl mt-6"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2" />
                  Iniciar Sesión
                </>
              )}
            </motion.button>
          </form>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600 border-t">
          <p className="flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-blue-500 mr-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5"
              >
                <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477z" />
              </svg>
            </motion.div>
            <span>Ocean Tours &copy; {new Date().getFullYear()}</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Componente del logo OceanLogo
const OceanLogo = () => {
  return (
    <div className="flex flex-col items-center justify-center mb-2">
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
        className="text-white mb-3"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-16 h-16"
        >
          <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
        </svg>
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-bold text-white"
      >
        <span className="text-blue-100">Ocean</span>
        <span>Tours</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-sm text-blue-100"
      >
        Pisco, Perú
      </motion.p>
    </div>
  );
};

// Agregar estos estilos adicionales al archivo CSS global
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
`;

export default LoginPage;