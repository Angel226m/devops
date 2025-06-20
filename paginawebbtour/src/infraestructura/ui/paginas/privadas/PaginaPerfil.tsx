// ui/paginas/privadas/PaginaPerfil.tsx
/*
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { actualizarCliente, cambiarContrasena } from '../../../store/slices/sliceAutenticacion';
import Cargador from '../../componentes/comunes/Cargador';
import Alerta from '../../componentes/comunes/Alerta';

const PaginaPerfil = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { usuario, cargando, error } = useSelector((state: RootState) => state.autenticacion);
  
  const [editando, setEditando] = useState(false);
  const [cambiandoContrasena, setCambiandoContrasena] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    numero_celular: '',
    numero_documento: ''
  });

  // Estado para el formulario de cambio de contraseña
  const [formContrasena, setFormContrasena] = useState({
    contrasena_actual: '',
    contrasena_nueva: '',
    confirmar_contrasena: ''
  });

  // Actualizar el formulario cuando cambia el usuario
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        numero_celular: usuario.numero_celular || '',
        numero_documento: usuario.numero_documento || ''
      });
    }
  }, [usuario]);

  // Manejar cambios en los inputs del formulario principal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en los inputs del formulario de contraseña
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormContrasena(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cambios del perfil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario) return;
    
    try {
      await dispatch(actualizarCliente({ 
        id: usuario.id_cliente, 
        datos: formData 
      })).unwrap();
      
      setMensaje({
        texto: t('perfil.actualizacionExitosa'),
        tipo: 'success'
      });
      
      setEditando(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setMensaje({
        texto: t('perfil.errorActualizacion'),
        tipo: 'error'
      });
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario) return;
    
    // Verificar que las contraseñas coinciden
    if (formContrasena.contrasena_nueva !== formContrasena.confirmar_contrasena) {
      setMensaje({
        texto: t('perfil.contrasenaNoCoincide'),
        tipo: 'error'
      });
      return;
    }
    
    try {
      await dispatch(cambiarContrasena({ 
        id: usuario.id_cliente, 
        datos: {
          contrasena_actual: formContrasena.contrasena_actual,
          nueva_contrasena: formContrasena.contrasena_nueva  // Cambiado a nueva_contrasena
        }
      })).unwrap();
      
      setMensaje({
        texto: t('perfil.contrasenaActualizada'),
        tipo: 'success'
      });
      
      // Resetear formulario
      setFormContrasena({
        contrasena_actual: '',
        contrasena_nueva: '',
        confirmar_contrasena: ''
      });
      
      setCambiandoContrasena(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setMensaje({
        texto: t('perfil.errorCambioContrasena'),
        tipo: 'error'
      });
    }
  };

  if (!usuario) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">{t('perfil.noSesion')}</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('perfil.iniciarSesionParaVerPerfil')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado *//*}
        <div className="bg-gradient-to-r from-ocean-600 to-cyan-500 text-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">{t('menu.perfil')}</h1>
          <p className="opacity-90">{t('perfil.gestionarCuenta')}</p>
        </div>
        
        {/* Alertas y mensajes *//*}
        {mensaje && (
          <Alerta 
            mensaje={mensaje.texto} 
            tipo={mensaje.tipo} 
          />
        )}
        
        {error && (
          <Alerta 
            mensaje={error} 
            tipo="error" 
          />
        )}
        
        {/* Datos del perfil *//*}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('perfil.informacionPersonal')}
            </h2>
            
            {!editando ? (
              <button
                onClick={() => setEditando(true)}
                className="px-4 py-2 bg-ocean-500 hover:bg-ocean-600 text-white rounded-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                {t('perfil.editar')}
              </button>
            ) : (
              <button
                onClick={() => setEditando(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
              >
                {t('perfil.cancelar')}
              </button>
            )}
          </div>
          
          {!editando ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('perfil.nombres')}</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{usuario.nombres}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('perfil.apellidos')}</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{usuario.apellidos}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('perfil.correo')}</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{usuario.correo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('perfil.telefono')}</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{usuario.numero_celular || t('perfil.noRegistrado')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('perfil.documento')}</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{usuario.numero_documento || t('perfil.noRegistrado')}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('perfil.nombres')}
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('perfil.apellidos')}
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('perfil.correo')}
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('perfil.telefono')}
                  </label>
                  <input
                    type="tel"
                    name="numero_celular"
                    value={formData.numero_celular}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('perfil.documento')}
                  </label>
                  <input
                    type="text"
                    name="numero_documento"
                    value={formData.numero_documento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditando(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                >
                  {t('perfil.cancelar')}
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ocean-600 hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500"
                >
                  {cargando ? (
                    <Cargador tamanio="sm" color="text-white" />
                  ) : (
                    t('perfil.guardar')
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Cambio de contraseña *//*}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('perfil.cambiarContrasena')}
            </h2>
            
            {!cambiandoContrasena ? (
              <button
                onClick={() => setCambiandoContrasena(true)}
                className="px-4 py-2 bg-ocean-500 hover:bg-ocean-600 text-white rounded-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                {t('perfil.cambiarContrasena')}
              </button>
            ) : (
              <button
                onClick={() => setCambiandoContrasena(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
              >
                {t('perfil.cancelar')}
              </button>
            )}
          </div>
          
          {cambiandoContrasena && (
            <form onSubmit={handleChangePassword} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('perfil.contrasenaActual')}
                  </label>
                  <input
                    type="password"
                    name="contrasena_actual"
                    value={formContrasena.contrasena_actual}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('perfil.nuevaContrasena')}
                  </label>
                  <input
                    type="password"
                    name="contrasena_nueva"
                    value={formContrasena.contrasena_nueva}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('perfil.confirmarContrasena')}
                  </label>
                  <input
                    type="password"
                    name="confirmar_contrasena"
                    value={formContrasena.confirmar_contrasena}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCambiandoContrasena(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                >
                  {t('perfil.cancelar')}
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ocean-600 hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500"
                >
                  {cargando ? (
                    <Cargador tamanio="sm" color="text-white" />
                  ) : (
                    t('perfil.actualizar')
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginaPerfil;*/


import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { actualizarCliente, cambiarContrasena } from '../../../store/slices/sliceAutenticacion';
import Cargador from '../../componentes/comunes/Cargador';
import Alerta from '../../componentes/comunes/Alerta';

const PaginaPerfil = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { usuario, cargando, error } = useSelector((state: RootState) => state.autenticacion);
  
  const [editando, setEditando] = useState(false);
  const [cambiandoContrasena, setCambiandoContrasena] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    numero_celular: '',
    numero_documento: ''
  });

  // Estado para el formulario de cambio de contraseña
  const [formContrasena, setFormContrasena] = useState({
    contrasena_actual: '',
    contrasena_nueva: '',
    confirmar_contrasena: ''
  });

  // Actualizar el formulario cuando cambia el usuario
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        numero_celular: usuario.numero_celular || '',
        numero_documento: usuario.numero_documento || ''
      });
    }
  }, [usuario]);

  // Manejar cambios en los inputs del formulario principal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en los inputs del formulario de contraseña
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormContrasena(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cambios del perfil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario) return;
    
    try {
      await dispatch(actualizarCliente({ 
        id: usuario.id_cliente, 
        datos: formData 
      })).unwrap();
      
      setMensaje({
        texto: t('perfil.actualizacionExitosa'),
        tipo: 'success'
      });
      
      setEditando(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setMensaje({
        texto: t('perfil.errorActualizacion'),
        tipo: 'error'
      });
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario) return;
    
    // Verificar que las contraseñas coinciden
    if (formContrasena.contrasena_nueva !== formContrasena.confirmar_contrasena) {
      setMensaje({
        texto: t('perfil.contrasenaNoCoincide'),
        tipo: 'error'
      });
      return;
    }
    
    try {
      await dispatch(cambiarContrasena({ 
        id: usuario.id_cliente, 
        datos: {
          contrasena_actual: formContrasena.contrasena_actual,
          nueva_contrasena: formContrasena.contrasena_nueva  // Cambiado a nueva_contrasena
        }
      })).unwrap();
      
      setMensaje({
        texto: t('perfil.contrasenaActualizada'),
        tipo: 'success'
      });
      
      // Resetear formulario
      setFormContrasena({
        contrasena_actual: '',
        contrasena_nueva: '',
        confirmar_contrasena: ''
      });
      
      setCambiandoContrasena(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setMensaje({
        texto: t('perfil.errorCambioContrasena'),
        tipo: 'error'
      });
    }
  };

  if (!usuario) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900">{t('perfil.noSesion')}</h2>
          <p className="mt-2 text-gray-600">{t('perfil.iniciarSesionParaVerPerfil')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Encabezado */}
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-6 border border-blue-100">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{t('menu.perfil')}</h1>
                <p className="text-gray-600">{t('perfil.gestionarCuenta')}</p>
              </div>
            </div>
          </div>
          
          {/* Alertas y mensajes */}
          {mensaje && (
            <div className="mb-6">
              <Alerta 
                mensaje={mensaje.texto} 
                tipo={mensaje.tipo} 
              />
            </div>
          )}
          
          {error && (
            <div className="mb-6">
              <Alerta 
                mensaje={error} 
                tipo="error" 
              />
            </div>
          )}
          
          {/* Datos del perfil */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-blue-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.691-.1-1.02A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800">
                  {t('perfil.informacionPersonal')}
                </h2>
              </div>
              
              {!editando ? (
                <button
                  onClick={() => setEditando(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-all shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                  {t('perfil.editar')}
                </button>
              ) : (
                <button
                  onClick={() => setEditando(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all"
                >
                  {t('perfil.cancelar')}
                </button>
              )}
            </div>
            
            {!editando ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-sm font-medium text-gray-700">{t('perfil.nombres')}</h3>
                    </div>
                    <p className="text-gray-900 font-medium">{usuario.nombres}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-sm font-medium text-gray-700">{t('perfil.apellidos')}</h3>
                    </div>
                    <p className="text-gray-900 font-medium">{usuario.apellidos}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <h3 className="text-sm font-medium text-gray-700">{t('perfil.correo')}</h3>
                    </div>
                    <p className="text-gray-900 font-medium">{usuario.correo}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <h3 className="text-sm font-medium text-gray-700">{t('perfil.telefono')}</h3>
                    </div>
                    <p className="text-gray-900 font-medium">{usuario.numero_celular || t('perfil.noRegistrado')}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-sm font-medium text-gray-700">{t('perfil.documento')}</h3>
                    </div>
                    <p className="text-gray-900 font-medium">{usuario.numero_documento || t('perfil.noRegistrado')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('perfil.nombres')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleInputChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('perfil.apellidos')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('perfil.correo')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('perfil.telefono')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="numero_celular"
                        value={formData.numero_celular}
                        onChange={handleInputChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('perfil.documento')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="numero_documento"
                        value={formData.numero_documento}
                        onChange={handleInputChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditando(false)}
                    className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {t('perfil.cancelar')}
                  </button>
                  <button
                    type="submit"
                    disabled={cargando}
                    className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {cargando ? (
                      <Cargador tamanio="sm" color="text-white" />
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {t('perfil.guardar')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Cambio de contraseña */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800">
                  {t('perfil.cambiarContrasena')}
                </h2>
              </div>
              
              {!cambiandoContrasena ? (
                <button
                  onClick={() => setCambiandoContrasena(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-all shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1 .257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2h5a1 1 0 100-2h-5z" clipRule="evenodd" />
                  </svg>
                  {t('perfil.cambiarContrasena')}
                </button>
              ) : (
                <button
                  onClick={() => setCambiandoContrasena(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all"
                >
                  {t('perfil.cancelar')}
                </button>
              )}
            </div>
            
            {cambiandoContrasena && (
              <form onSubmit={handleChangePassword} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('perfil.contrasenaActual')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="contrasena_actual"
                        value={formContrasena.contrasena_actual}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('perfil.nuevaContrasena')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="contrasena_nueva"
                        value={formContrasena.contrasena_nueva}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        minLength={8}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">La contraseña debe tener al menos 8 caracteres</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('perfil.confirmarContrasena')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="confirmar_contrasena"
                        value={formContrasena.confirmar_contrasena}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCambiandoContrasena(false)}
                    className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {t('perfil.cancelar')}
                  </button>
                  <button
                    type="submit"
                    disabled={cargando}
                    className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    {cargando ? (
                      <Cargador tamanio="sm" color="text-white" />
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {t('perfil.actualizar')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaPerfil;