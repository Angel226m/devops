// ui/paginas/privadas/PaginaPerfil.tsx
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
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-ocean-600 to-cyan-500 text-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">{t('menu.perfil')}</h1>
          <p className="opacity-90">{t('perfil.gestionarCuenta')}</p>
        </div>
        
        {/* Alertas y mensajes */}
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
        
        {/* Datos del perfil */}
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
        
        {/* Cambio de contraseña */}
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

export default PaginaPerfil;