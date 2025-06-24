 

/*
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { cerrarSesion } from '../../store/slices/sliceAutenticacion';
import Logo from './Logo';
import { useTranslation } from 'react-i18next';
import CambiadorIdioma from '../componentes/navegacion/CambiadorIdioma';

const BarraNavegacion = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Obtener información de autenticación del estado global
  const { usuario, autenticado } = useSelector((state: RootState) => state.autenticacion);

  // Detectar scroll para cambiar estilo de la barra
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Manejar cierre de sesión
  const handleCerrarSesion = async () => {
    try {
      await dispatch(cerrarSesion()).unwrap();
      navigate('/');
      setMenuUsuarioAbierto(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Clase activa para enlaces de navegación
  const claseActiva = "text-white bg-ocean-600 px-4 py-2 rounded-full font-semibold";
  const claseNormal = "text-ocean-600 dark:text-ocean-300 hover:text-white hover:bg-ocean-500 px-4 py-2 rounded-full transition-all duration-300";

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-gradient-to-r from-ocean-600 via-ocean-500 to-cyan-500 dark:from-ocean-800 dark:via-ocean-700 dark:to-cyan-700 text-white backdrop-blur-md shadow-lg' 
        : 'bg-gradient-to-r from-ocean-500 via-ocean-400 to-cyan-400 dark:from-ocean-700 dark:via-ocean-600 dark:to-cyan-600 text-white'
    }`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo *//*}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">
              <span className="bg-cyan-500 dark:bg-cyan-600 px-3 py-1 rounded-l-full">Ocean</span>
              <span className="bg-ocean-600 dark:bg-ocean-700 px-3 py-1 rounded-r-full ml-[-5px]">Tours</span>
            </span>
          </Link>

          {/* Navegación escritorio *//*}
          <div className="hidden md:flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-full px-3 py-2">
            <NavLink to="/inicio" className={({ isActive }) => isActive ? claseActiva : claseNormal}>
              {t('menu.inicio')}
            </NavLink>
            <NavLink to="/tours" className={({ isActive }) => isActive ? claseActiva : claseNormal}>
              {t('menu.tours')}
            </NavLink>
            <NavLink to="/sedes" className={({ isActive }) => isActive ? claseActiva : claseNormal}>
              {t('menu.sedes')}
            </NavLink>
            <NavLink to="/sobre-nosotros" className={({ isActive }) => isActive ? claseActiva : claseNormal}>
              {t('menu.sobreNosotros')}
            </NavLink>
            <NavLink to="/contacto" className={({ isActive }) => isActive ? claseActiva : claseNormal}>
              {t('menu.contacto')}
            </NavLink>
          </div>

          {/* Botones de acción y selector de idioma *//*}
          <div className="hidden md:flex items-center space-x-4">
            {/* Añadir el selector de idioma aquí *//*}
            <div className="bg-white/15 backdrop-blur-sm rounded-full p-1">
              <CambiadorIdioma />
            </div>
            
            {/* Mostrar opciones según estado de autenticación *//*}
            {autenticado ? (
              <div className="relative">
                <button 
                  onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-full transition-colors duration-300"
                >
                  <div className="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                    {usuario?.nombres.charAt(0)}{usuario?.apellidos.charAt(0)}
                  </div>
                  <span className="max-w-[150px] truncate">
                    {usuario?.nombres.split(' ')[0]}
                  </span>
                  <svg className={`h-4 w-4 transition-transform ${menuUsuarioAbierto ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Menú desplegable del usuario *//*}
                {menuUsuarioAbierto && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      <div className="font-medium truncate">{usuario?.nombre_completo}</div>
                      <div className="truncate text-gray-500 dark:text-gray-400">{usuario?.correo}</div>
                    </div>
                    <Link 
                      to="/perfil" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setMenuUsuarioAbierto(false)}
                    >
                      <div className="flex items-center">
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {t('menu.perfil')}
                      </div>
                    </Link>
                    <Link 
                      to="/mis-reservas" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setMenuUsuarioAbierto(false)}
                    >
                      <div className="flex items-center">
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {t('menu.misReservas')}
                      </div>
                    </Link>
                    <button 
                      onClick={handleCerrarSesion}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        {t('autenticacion.cerrarSesion')}
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/ingresar" className="px-4 py-2 text-white hover:bg-white/20 rounded-full transition-colors duration-300">
                  {t('autenticacion.ingresar')}
                </Link>
                <Link to="/registrarse" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition-colors duration-300 shadow-md hover:shadow-lg border-2 border-white">
                  {t('autenticacion.registrarse')}
                </Link>
              </>
            )}
          </div>

          {/* Botón menú móvil *//*}
          <div className="md:hidden flex items-center space-x-2">
            {/* Versión móvil del selector de idioma *//*}
            <div className="bg-white/15 backdrop-blur-sm rounded-full p-1">
              <CambiadorIdioma />
            </div>
            
            {/* Si está autenticado, mostrar avatar *//*}
            {autenticado && (
              <button 
                onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-600 text-white font-bold"
              >
                {usuario?.nombres.charAt(0)}{usuario?.apellidos.charAt(0)}
              </button>
            )}
            
            <button 
              className="bg-white/15 text-white hover:bg-white/25 p-2 rounded-full transition-colors duration-300"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuAbierto ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Menú móvil *//*}
      {menuAbierto && (
        <div className="md:hidden bg-gradient-to-b from-ocean-500 to-cyan-500 dark:from-ocean-700 dark:to-cyan-700 shadow-lg text-white">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {/* Si está autenticado, mostrar información del usuario *//*}
            {autenticado && (
              <div className="bg-white/10 rounded-lg p-4 mb-2">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xl font-bold">
                    {usuario?.nombres.charAt(0)}{usuario?.apellidos.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{usuario?.nombre_completo}</div>
                    <div className="text-sm text-white/80">{usuario?.correo}</div>
                  </div>
                </div>
              </div>
            )}
            
            <NavLink 
              to="/inicio" 
              className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
              onClick={() => setMenuAbierto(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              {t('menu.inicio')}
            </NavLink>
            <NavLink 
              to="/tours" 
              className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
              onClick={() => setMenuAbierto(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" />
              </svg>
              {t('menu.tours')}
            </NavLink>
            <NavLink 
              to="/sedes" 
              className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
              onClick={() => setMenuAbierto(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {t('menu.sedes')}
            </NavLink>
            <NavLink 
              to="/sobre-nosotros" 
              className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
              onClick={() => setMenuAbierto(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              {t('menu.sobreNosotros')}
            </NavLink>
            <NavLink 
              to="/contacto" 
              className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
              onClick={() => setMenuAbierto(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {t('menu.contacto')}
            </NavLink>
            
            {/* Mostrar opciones según estado de autenticación *//*}
            <div className="pt-4 border-t border-white/30 flex flex-col space-y-3">
              {autenticado ? (
                <>
                  <NavLink 
                    to="/perfil" 
                    className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'bg-white/10 hover:bg-white/20'}`}
                    onClick={() => setMenuAbierto(false)}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {t('menu.perfil')}
                  </NavLink>
                  <NavLink 
                    to="/mis-reservas" 
                    className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'bg-white/10 hover:bg-white/20'}`}
                    onClick={() => setMenuAbierto(false)}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {t('menu.misReservas')}
                  </NavLink>
                  <button 
                    onClick={() => {
                      handleCerrarSesion();
                      setMenuAbierto(false);
                    }}
                    className="px-4 py-3 text-white bg-red-500/80 hover:bg-red-600 rounded-lg flex items-center"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    {t('autenticacion.cerrarSesion')}
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/ingresar" 
                    className="px-4 py-3 text-white bg-white/20 hover:bg-white/30 rounded-lg flex items-center"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t('autenticacion.ingresar')}
                  </Link>
                  <Link 
                    to="/registrarse" 
                    className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-center flex items-center justify-center"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    {t('autenticacion.registrarse')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menú usuario móvil *//*}
      {menuUsuarioAbierto && autenticado && (
        <div className="md:hidden absolute right-4 mt-2 w-72 rounded-lg shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium truncate">{usuario?.nombre_completo}</div>
            <div className="truncate text-gray-500 dark:text-gray-400">{usuario?.correo}</div>
          </div>
          <Link 
            to="/perfil" 
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setMenuUsuarioAbierto(false)}
          >
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {t('menu.perfil')}
            </div>
          </Link>
          <Link 
            to="/mis-reservas" 
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setMenuUsuarioAbierto(false)}
          >
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {t('menu.misReservas')}
            </div>
          </Link>
          <button 
            onClick={handleCerrarSesion}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              {t('autenticacion.cerrarSesion')}
            </div>
          </button>
        </div>
      )}
    </header>
  );
};

export default BarraNavegacion;*/

import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { cerrarSesion } from '../../store/slices/sliceAutenticacion';
import Logo from './Logo';
import { useTranslation } from 'react-i18next';
import CambiadorIdioma from '../componentes/navegacion/CambiadorIdioma';

const BarraNavegacion = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Obtener información de autenticación del estado global
  const { usuario, autenticado } = useSelector((state: RootState) => state.autenticacion);

  // Detectar scroll para cambiar estilo de la barra
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Manejar cierre de sesión
  const handleCerrarSesion = async () => {
    try {
      await dispatch(cerrarSesion()).unwrap();
      navigate('/');
      setMenuUsuarioAbierto(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Clase activa para enlaces de navegación
  const claseActiva = "text-white bg-ocean-600 px-4 py-2 rounded-full font-semibold";
  const claseNormal = "text-ocean-600 dark:text-ocean-300 hover:text-white hover:bg-ocean-500 px-4 py-2 rounded-full transition-all duration-300";

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-gradient-to-r from-ocean-600 via-ocean-500 to-cyan-500 dark:from-ocean-800 dark:via-ocean-700 dark:to-cyan-700 text-white backdrop-blur-md shadow-lg' 
        : 'bg-gradient-to-r from-ocean-500 via-ocean-400 to-cyan-400 dark:from-ocean-700 dark:via-ocean-600 dark:to-cyan-600 text-white'
    }`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">
              <span className="bg-cyan-500 dark:bg-cyan-600 px-3 py-1 rounded-l-full">Ocean</span>
              <span className="bg-ocean-600 dark:bg-ocean-700 px-3 py-1 rounded-r-full ml-[-5px]">Tours</span>
            </span>
          </Link>

          {/* Navegación escritorio */}
          <div className="hidden md:flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-full px-3 py-2">
            <NavLink to="/inicio" className={({ isActive }) => isActive ? claseActiva : claseNormal}>
              {t('menu.inicio')}
            </NavLink>
            <NavLink to="/tours" className={({ isActive }) => isActive ? claseActiva : claseNormal}>
              {t('menu.tours')}
            </NavLink>
            <NavLink to="/sedes" className={({ isActive }) => isActive ? claseActiva : claseNormal}>
              {t('menu.sedes')}
            </NavLink>
            <NavLink to="/conservacion" className={({ isActive }) => isActive ? claseActiva : claseNormal}>
              {t('menu.conservacion', 'Conservación')}
            </NavLink>
            <NavLink to="/sobre-nosotros" className={({ isActive }) => isActive ? claseActiva : claseNormal}>
              {t('menu.sobreNosotros')}
            </NavLink>
            <NavLink to="/contacto" className={({ isActive }) => isActive ? claseActiva : claseNormal}>
              {t('menu.contacto')}
            </NavLink>
          </div>

          {/* Botones de acción y selector de idioma */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Añadir el selector de idioma aquí */}
            <div className="bg-white/15 backdrop-blur-sm rounded-full p-1">
              <CambiadorIdioma />
            </div>
            
            {/* Mostrar opciones según estado de autenticación */}
            {autenticado ? (
              <div className="relative">
                <button 
                  onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-full transition-colors duration-300"
                >
                  <div className="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                    {usuario?.nombres.charAt(0)}{usuario?.apellidos.charAt(0)}
                  </div>
                  <span className="max-w-[150px] truncate">
                    {usuario?.nombres.split(' ')[0]}
                  </span>
                  <svg className={`h-4 w-4 transition-transform ${menuUsuarioAbierto ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Menú desplegable del usuario */}
                {menuUsuarioAbierto && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      <div className="font-medium truncate">{usuario?.nombre_completo}</div>
                      <div className="truncate text-gray-500 dark:text-gray-400">{usuario?.correo}</div>
                    </div>
                    <Link 
                      to="/perfil" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setMenuUsuarioAbierto(false)}
                    >
                      <div className="flex items-center">
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {t('menu.perfil')}
                      </div>
                    </Link>
                    <Link 
                      to="/mis-reservas" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setMenuUsuarioAbierto(false)}
                    >
                      <div className="flex items-center">
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {t('menu.misReservas')}
                      </div>
                    </Link>
                    <button 
                      onClick={handleCerrarSesion}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        {t('autenticacion.cerrarSesion')}
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/ingresar" className="px-4 py-2 text-white hover:bg-white/20 rounded-full transition-colors duration-300">
                  {t('autenticacion.ingresar')}
                </Link>
                <Link to="/registrarse" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition-colors duration-300 shadow-md hover:shadow-lg border-2 border-white">
                  {t('autenticacion.registrarse')}
                </Link>
              </>
            )}
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Versión móvil del selector de idioma */}
            <div className="bg-white/15 backdrop-blur-sm rounded-full p-1">
              <CambiadorIdioma />
            </div>
            
            {/* Si está autenticado, mostrar avatar */}
            {autenticado && (
              <button 
                onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-600 text-white font-bold"
              >
                {usuario?.nombres.charAt(0)}{usuario?.apellidos.charAt(0)}
              </button>
            )}
            
            <button 
              className="bg-white/15 text-white hover:bg-white/25 p-2 rounded-full transition-colors duration-300"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuAbierto ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden bg-gradient-to-b from-ocean-500 to-cyan-500 dark:from-ocean-700 dark:to-cyan-700 shadow-lg text-white">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {/* Si está autenticado, mostrar información del usuario */}
            {autenticado && (
              <div className="bg-white/10 rounded-lg p-4 mb-2">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xl font-bold">
                    {usuario?.nombres.charAt(0)}{usuario?.apellidos.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{usuario?.nombre_completo}</div>
                    <div className="text-sm text-white/80">{usuario?.correo}</div>
                  </div>
                </div>
              </div>
            )}
            
            <NavLink 
              to="/inicio" 
              className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
              onClick={() => setMenuAbierto(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              {t('menu.inicio')}
            </NavLink>
            <NavLink 
              to="/tours" 
              className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
              onClick={() => setMenuAbierto(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" />
              </svg>
              {t('menu.tours')}
            </NavLink>
            <NavLink 
              to="/sedes" 
              className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
              onClick={() => setMenuAbierto(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {t('menu.sedes')}
            </NavLink>
            <NavLink 
              to="/conservacion" 
              className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
              onClick={() => setMenuAbierto(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
              </svg>
              {t('menu.conservacion', 'Conservación')}
            </NavLink>
            <NavLink 
              to="/sobre-nosotros" 
              className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
              onClick={() => setMenuAbierto(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              {t('menu.sobreNosotros')}
            </NavLink>
            <NavLink 
              to="/contacto" 
              className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
              onClick={() => setMenuAbierto(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {t('menu.contacto')}
            </NavLink>
            
            {/* Mostrar opciones según estado de autenticación */}
            <div className="pt-4 border-t border-white/30 flex flex-col space-y-3">
              {autenticado ? (
                <>
                  <NavLink 
                    to="/perfil" 
                    className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'bg-white/10 hover:bg-white/20'}`}
                    onClick={() => setMenuAbierto(false)}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {t('menu.perfil')}
                  </NavLink>
                  <NavLink 
                    to="/mis-reservas" 
                    className={({ isActive }) => `px-4 py-3 rounded-lg flex items-center ${isActive ? 'bg-white/30 font-semibold' : 'bg-white/10 hover:bg-white/20'}`}
                    onClick={() => setMenuAbierto(false)}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {t('menu.misReservas')}
                  </NavLink>
                  <button 
                    onClick={() => {
                      handleCerrarSesion();
                      setMenuAbierto(false);
                    }}
                    className="px-4 py-3 text-white bg-red-500/80 hover:bg-red-600 rounded-lg flex items-center"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    {t('autenticacion.cerrarSesion')}
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/ingresar" 
                    className="px-4 py-3 text-white bg-white/20 hover:bg-white/30 rounded-lg flex items-center"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t('autenticacion.ingresar')}
                  </Link>
                  <Link 
                    to="/registrarse" 
                    className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-center flex items-center justify-center"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    {t('autenticacion.registrarse')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menú usuario móvil */}
      {menuUsuarioAbierto && autenticado && (
        <div className="md:hidden absolute right-4 mt-2 w-72 rounded-lg shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium truncate">{usuario?.nombre_completo}</div>
            <div className="truncate text-gray-500 dark:text-gray-400">{usuario?.correo}</div>
          </div>
          <Link 
            to="/perfil" 
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setMenuUsuarioAbierto(false)}
          >
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {t('menu.perfil')}
            </div>
          </Link>
          <Link 
            to="/mis-reservas" 
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setMenuUsuarioAbierto(false)}
          >
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {t('menu.misReservas')}
            </div>
          </Link>
          <button 
            onClick={handleCerrarSesion}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              {t('autenticacion.cerrarSesion')}
            </div>
          </button>
        </div>
      )}
    </header>
  );
};

export default BarraNavegacion;