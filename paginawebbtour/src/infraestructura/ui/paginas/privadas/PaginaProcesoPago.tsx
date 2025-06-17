 /* import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../../store';

// Componentes locales
const Cargador = () => (
  <div className="flex justify-center items-center">
    <div className="relative">
      <div className="w-6 h-6 rounded-full absolute border-2 border-solid border-gray-200"></div>
      <div className="w-6 h-6 rounded-full animate-spin absolute border-2 border-solid border-cyan-500 border-t-transparent"></div>
    </div>
  </div>
);

// Definición de MercadoPago en window para TypeScript
declare global {
  interface Window {
    MercadoPago: any;
  }
}

// Constantes de configuración
const MERCADO_PAGO_PUBLIC_KEY = 'TEST-77110b60-f2cc-454f-ad25-5d08b927ac85';

const PaginaProcesoPago = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, autenticado } = useSelector((state: RootState) => state.autenticacion);
  
  // Recuperar datos de la reserva del state o de sessionStorage
  const datosReserva = location.state || JSON.parse(sessionStorage.getItem('datosReservaPendiente') || '{}');
  
  // Estados para el flujo de pago
  const [cargandoPago, setCargandoPago] = useState(false);
  const [cargandoMercadoPago, setCargandoMercadoPago] = useState(true);
  const [metodoPago, setMetodoPago] = useState('mercadopago');
  const [error, setError] = useState<string | null>(null);
  const [preferencia, setPreferencia] = useState<any>(null);
  const [botonGenerado, setBotonGenerado] = useState(false);
  
  // Estados para datos de usuario
  const [editandoUsuario, setEditandoUsuario] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState({
    nombres: usuario?.nombres || '',
    apellidos: usuario?.apellidos || '',
    correo: usuario?.correo || '',
    numero_celular: usuario?.numero_celular || '',
    numero_documento: usuario?.numero_documento || ''
  });
  
  // Referencias para el SDK de Mercado Pago
  const mercadoPagoButtonRef = useRef<HTMLDivElement>(null);
  const configuracionIniciadaRef = useRef(false);
  const solicitudEnviadaRef = useRef(false);
  
  // Calcular subtotal, IGV y total
  const subtotal = Number(datosReserva.total || 0);
  const igv = subtotal * 0.18;
  const total = subtotal; // Ya incluye IGV en este caso

  // Función para crear preferencia de Mercado Pago de forma simulada
  const crearPreferenciaMercadoPagoSimulada = useCallback(async () => {
    console.log("Creando preferencia simulada de Mercado Pago");
    
    try {
      // En un entorno real, aquí harías una llamada a tu backend para crear una preferencia real
      // Simular una respuesta exitosa después de un breve retraso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Crear una preferencia simulada con todas las propiedades necesarias
      const preferenciaSimulada = {
        id_reserva: Math.floor(Math.random() * 1000),
        nombre_tour: datosReserva.tourNombre,
        preferenceID: `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        initPoint: 'https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=123456789',
        sandboxInitPoint: 'https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=123456789'
      };
      
      // Actualizar el estado con la preferencia simulada
      setPreferencia(preferenciaSimulada);
      
      // Guardar ID de reserva para referencia futura
      sessionStorage.setItem('reservaEnProceso', JSON.stringify({
        id: preferenciaSimulada.id_reserva,
        tour: datosReserva.tourNombre,
        fecha: datosReserva.fecha
      }));
      
      return preferenciaSimulada;
    } catch (error) {
      console.error("Error al crear preferencia simulada:", error);
      throw error;
    }
  }, [datosReserva.tourNombre, datosReserva.fecha]);

  // Función para renderizar el botón de Mercado Pago
  const renderizarBotonMercadoPago = useCallback((preferenceId: string) => {
    if (!window.MercadoPago || !mercadoPagoButtonRef.current) {
      console.error("MercadoPago no está disponible o el contenedor del botón no existe");
      return false;
    }

    try {
      console.log("Renderizando botón de MercadoPago con preferenceID:", preferenceId);
      
      // Limpiar el contenedor
      mercadoPagoButtonRef.current.innerHTML = '';
      
      // Inicializar MercadoPago
      const mp = new window.MercadoPago(MERCADO_PAGO_PUBLIC_KEY, {
        locale: 'es-PE'
      });
      
      // Renderizar el botón de checkout
      mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '.checkout-button',
          label: 'Pagar ahora',
        },
        theme: {
          elementsColor: '#00A1E4',
          headerColor: '#004d99',
        }
      });
      
      return true;
    } catch (error) {
      console.error("Error al renderizar botón de MercadoPago:", error);
      return false;
    }
  }, []);

  // Función principal para inicializar el proceso de pago
  const inicializarProcesoPago = useCallback(async () => {
    if (!usuario?.id_cliente || !datosReserva.instanciaId || solicitudEnviadaRef.current) {
      return;
    }
    
    try {
      solicitudEnviadaRef.current = true;
      setCargandoMercadoPago(true);
      setError(null);
      
      console.log("Iniciando proceso de pago con MercadoPago...");
      
      // Simular obtención de preferencia
      const preferenciaData = await crearPreferenciaMercadoPagoSimulada();
      
      // Intentar renderizar el botón si MercadoPago ya está disponible
      let botonRenderizado = false;
      if (window.MercadoPago) {
        botonRenderizado = renderizarBotonMercadoPago(preferenciaData.preferenceID);
      }
      
      // Si no se pudo renderizar el botón, configurar un observador para intentarlo cuando el script se cargue
      if (!botonRenderizado) {
        const checkMercadoPago = setInterval(() => {
          if (window.MercadoPago) {
            clearInterval(checkMercadoPago);
            const success = renderizarBotonMercadoPago(preferenciaData.preferenceID);
            if (success) {
              setBotonGenerado(true);
              setCargandoMercadoPago(false);
            }
          }
        }, 500);
        
        // Limpiar el intervalo después de 10 segundos para evitar bucles infinitos
        setTimeout(() => {
          clearInterval(checkMercadoPago);
          if (!botonGenerado) {
            setCargandoMercadoPago(false);
            console.warn("No se pudo renderizar el botón de MercadoPago después de varios intentos");
          }
        }, 10000);
      } else {
        setBotonGenerado(true);
        setCargandoMercadoPago(false);
      }
    } catch (error) {
      console.error("Error al inicializar proceso de pago:", error);
      setError("No se pudo configurar el método de pago. Por favor, intenta nuevamente.");
      setCargandoMercadoPago(false);
      solicitudEnviadaRef.current = false;
    }
  }, [usuario, datosReserva.instanciaId, crearPreferenciaMercadoPagoSimulada, renderizarBotonMercadoPago, botonGenerado]);
  
  // Verificar si estamos regresando de un pago en Mercado Pago
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const reservaId = params.get('reserva_id');
    
    if (status && reservaId) {
      // Si estamos regresando con un estado y un ID de reserva
      switch (status) {
        case 'success':
          // Pago exitoso, redirigir a la página de confirmación
          navigate('/reserva-exitosa', {
            state: {
              reservaId: parseInt(reservaId),
              estado: 'CONFIRMADA',
              metodoPago: 'mercadopago',
              fechaPago: new Date().toISOString()
            }
          });
          break;
        case 'pending':
          // Pago pendiente
          navigate('/reserva-exitosa', {
            state: {
              reservaId: parseInt(reservaId),
              estado: 'PENDIENTE',
              metodoPago: 'mercadopago',
              fechaPago: new Date().toISOString()
            }
          });
          break;
        case 'failure':
          // Pago fallido
          setError('El pago no pudo ser procesado. Por favor, intenta nuevamente o utiliza otro método de pago.');
          break;
      }
    }
  }, [location.search, navigate]);
  
  // Inicializar datos de usuario
  useEffect(() => {
    // Solo actualizamos los datos de usuario cuando cambia el usuario
    if (usuario) {
      setDatosUsuario({
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        numero_celular: usuario.numero_celular || '',
        numero_documento: usuario.numero_documento || ''
      });
    }
  }, [usuario]);

  // Verificar autenticación y datos de reserva
  useEffect(() => {
    // Redirigir a inicio de sesión si no está autenticado
    if (!autenticado) {
      navigate('/ingresar', { 
        state: { 
          returnUrl: '/proceso-pago',
          mensaje: 'Debes iniciar sesión para completar tu reserva'
        } 
      });
      return;
    }
    
    // Redirigir a la página de tours si no hay datos de reserva
    if (!datosReserva || !datosReserva.instanciaId) {
      navigate('/tours');
      return;
    }
  }, [autenticado, datosReserva, navigate]);
  
  // Inicializar el proceso de pago solo una vez
  useEffect(() => {
    // Solo iniciar el proceso si no se ha iniciado antes y tenemos los datos necesarios
    if (!configuracionIniciadaRef.current && usuario?.id_cliente && datosReserva?.instanciaId) {
      console.log("Iniciando configuración de Mercado Pago");
      configuracionIniciadaRef.current = true;
      inicializarProcesoPago();
    }
  }, [usuario, datosReserva, inicializarProcesoPago]);
  
  // Manejar cambios en los campos de usuario
  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Guardar cambios del usuario
  const guardarCambiosUsuario = () => {
    // Aquí puedes implementar la lógica para guardar los cambios en la base de datos
    // Por ahora solo cerramos el modo de edición
    setEditandoUsuario(false);
    
    // Muestra un mensaje de éxito
    alert('Cambios guardados correctamente.');
  };
  
  // Función para simular un pago directo
  const procesarPagoDirecto = async () => {
    setCargandoPago(true);
    setError(null);
    
    try {
      console.log("Procesando pago directo...");
      
      // Si ya tenemos una preferencia, usamos la URL directamente
      if (preferencia) {
        console.log("Redirigiendo a URL de pago:", preferencia.sandboxInitPoint);
        window.location.href = preferencia.sandboxInitPoint || preferencia.initPoint;
        return;
      }
      
      // Si no tenemos preferencia, creamos una simulada
      console.log("Creando nueva preferencia para pago directo");
      const nuevaPreferencia = await crearPreferenciaMercadoPagoSimulada();
      
      // Simular redirección a página de pago
      console.log("Simulando pago exitoso, redirigiendo a página de confirmación");
      setTimeout(() => {
        // En modo simulación, redirigir directamente a página de éxito
        navigate('/reserva-exitosa', {
          state: {
            reservaId: nuevaPreferencia.id_reserva,
            estado: 'CONFIRMADA',
            metodoPago: 'mercadopago',
            fechaPago: new Date().toISOString(),
            tourNombre: datosReserva.tourNombre,
            total: total,
            fecha: datosReserva.fecha,
            horario: datosReserva.horario,
            totalPasajeros: datosReserva.totalPasajeros
          }
        });
      }, 1500);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setError('No se pudo procesar el pago. Por favor, inténtalo nuevamente.');
      setCargandoPago(false);
    }
  };
  
  // Formatear fecha para mostrar
  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-PE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Si no hay datos de reserva, no renderizar nada
  if (!datosReserva || !datosReserva.instanciaId) {
    return null; // El useEffect se encargará de redireccionar
  }
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-white via-blue-50 to-cyan-50 min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Encabezado *//*}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold">{t('pago.titulo', 'Proceso de Pago')}</h1>
          <p className="mt-1 opacity-90">{t('pago.subtitulo', 'Completa tu reserva realizando el pago')}</p>
          
          {/* Paso de proceso *//*
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between max-w-md">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs mt-1">Selección</span>
              </div>
              
              <div className="flex-1 h-0.5 mx-2 bg-white/40"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <span className="text-xs mt-1">Pago</span>
              </div>
              
              <div className="flex-1 h-0.5 mx-2 bg-white/40"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <span className="text-xs mt-1">Confirmación</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información de la reserva *//*}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos del tour *//*}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-cyan-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Detalles de la reserva
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{datosReserva.tourNombre}</h3>
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{formatearFecha(datosReserva.fecha)}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{datosReserva.horario}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-200">
                    {datosReserva.totalPasajeros} pasajeros
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-800">S/ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">IGV (18%):</span>
                      <span className="text-gray-800">S/ {igv.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-200">
                      <span className="text-gray-800">Total a pagar:</span>
                      <span className="text-teal-600 text-lg">S/ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Información del cliente *//*}
            {usuario && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyan-100">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Datos del cliente
                  </h2>
                  
                  <button 
                    type="button"
                    onClick={() => setEditandoUsuario(!editandoUsuario)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    {editandoUsuario ? (
                      <>Cancelar</>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Editar
                      </>
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input 
                      type="text" 
                      name="nombres"
                      value={datosUsuario.nombres}
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                    <input 
                      type="text" 
                      name="apellidos"
                      value={datosUsuario.apellidos}
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      name="correo"
                      value={datosUsuario.correo}
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input 
                      type="text" 
                      name="numero_celular"
                      value={datosUsuario.numero_celular} 
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                    <input 
                      type="text" 
                      name="numero_documento"
                      value={datosUsuario.numero_documento} 
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
                
                {editandoUsuario && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={guardarCambiosUsuario}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Guardar cambios
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Opciones de pago *//*}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-cyan-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Selecciona tu método de pago
              </h2>
              
              <div className="space-y-3">
                {/* Mercado Pago (opción principal) *//*}
                <div 
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    metodoPago === 'mercadopago' 
                      ? 'border-cyan-400 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-sm' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => setMetodoPago('mercadopago')}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="mercadopago"
                        name="metodoPago"
                        checked={metodoPago === 'mercadopago'}
                        onChange={() => setMetodoPago('mercadopago')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="mercadopago" className="ml-2 flex items-center cursor-pointer">
                        <img src="https://woocommerce.com/wp-content/uploads/2021/05/tw-mercado-pago-v2@2x.png" alt="Mercado Pago" className="h-8 mr-2" />
                        <span className="font-medium text-gray-800">Mercado Pago</span>
                      </label>
                    </div>
                    <span className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-2 py-1 rounded border border-blue-200">Recomendado</span>
                  </div>
                  
                  {metodoPago === 'mercadopago' && (
                    <div className="mt-3 ml-6 text-sm text-gray-600">
                      <p>Paga con tarjeta, Yape, Plin o cualquier método disponible en Mercado Pago.</p>
                      <div className="flex flex-wrap mt-2 gap-2">
                        <div className="bg-white rounded p-1 border border-gray-200 shadow-sm">
                          <img src="https://images.freeimages.com/vme/images/7/1/715862/visa_logo_preview.jpg?h=350" alt="Visa" className="h-5" />
                        </div>
                        <div className="bg-white rounded p-1 border border-gray-200 shadow-sm">
                          <img src="https://images.freeimages.com/vme/images/9/9/99813/mastercard_logo_preview.jpg?h=350" alt="Mastercard" className="h-5" />
                        </div>
                        <div className="bg-white rounded p-1 border border-gray-200 shadow-sm">
                          <img src="https://logosenvector.com/logo/img/yape-bcp-4390.jpg" alt="Yape" className="h-5" />
                        </div>
                        <div className="bg-white rounded p-1 border border-gray-200 shadow-sm">
                          <img src="https://images.seeklogo.com/logo-png/38/1/plin-logo-png_seeklogo-386806.png" alt="Plin" className="h-5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Otros métodos de pago (deshabilitados por ahora) *//*}
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="yape"
                      name="metodoPago"
                      disabled
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-not-allowed"
                    />
                    <label htmlFor="yape" className="ml-2 flex items-center cursor-not-allowed">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-purple-700 font-bold text-sm">YP</span>
                      </div>
                      <span className="text-gray-800">Yape directo</span>
                    </label>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="transferencia"
                      name="metodoPago"
                      disabled
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-not-allowed"
                    />
                    <label htmlFor="transferencia" className="ml-2 flex items-center cursor-not-allowed">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-800">Transferencia Bancaria</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Muestra error si existe *//*}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {/* Sección de pago *//*}
              <div className="mt-6">
                {cargandoMercadoPago ? (
                  <div className="w-full py-6 flex justify-center items-center bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                    <Cargador />
                    <span className="ml-2 text-blue-600">Cargando opciones de pago...</span>
                  </div>
                ) : (
                  <>
                    {/* Contenedor para el botón de Mercado Pago *//*}
                    <div id="mercadopago-button-container">
                      <div className="checkout-button" ref={mercadoPagoButtonRef}></div>
                    </div>
                    
                    {/* Botón alternativo para pago directo (siempre visible para este ejemplo) *//*}
                    <button
                      type="button"
                      onClick={procesarPagoDirecto}
                      disabled={cargandoPago}
                      className={`w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center ${
                        cargandoPago ? 'opacity-70 cursor-not-allowed hover:transform-none' : 'transform hover:-translate-y-0.5'
                      }`}
                    >
                      {cargandoPago ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando pago...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 7H4C2.9 7 2 7.9 2 9V15C2 16.1 2.9 17 4 17H20C21.1 17 22 16.1 22 15V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
                            <path d="M16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13Z" fill="currentColor"/>
                            <path d="M8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z" fill="currentColor"/>
                          </svg>
                          Pagar S/ {total.toFixed(2)}
                        </span>
                      )}
                    </button>
                  </>
                )}
                
                <p className="mt-2 text-xs text-center text-gray-500">
                  Al hacer clic en "Pagar", aceptas nuestros <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a>.
                </p>
              </div>
            </div>
            
            {/* Información de seguridad *//*}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-cyan-200">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800">Pago 100% seguro</h3>
              </div>
              <p className="text-xs text-gray-600 ml-10">
                Tu información de pago se procesa de forma segura. Utilizamos encriptación SSL para mantener tus datos protegidos.
              </p>
              
              <div className="flex items-center mt-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800">Datos protegidos</h3>
              </div>
              <p className="text-xs text-gray-600 ml-10">
                No almacenamos tus datos de tarjeta. Todas las transacciones son procesadas por Mercado Pago con la mayor seguridad.
              </p>
            </div>
            
            {/* Soporte *//*}
            <div className="bg-white p-4 rounded-xl border border-cyan-200 flex items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-800">¿Necesitas ayuda?</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Si tienes problemas con el pago o dudas sobre tu reserva, contáctanos:
                </p>
                <div className="mt-2 text-xs">
                  <div className="flex items-center text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +51 987 654 321
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botón para volver *//*}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-cyan-300 text-cyan-700 font-medium rounded-lg transition-colors hover:bg-cyan-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaProcesoPago;*/import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../../store';
import { clienteAxios } from '../../../api/clienteAxios';
import { endpoints } from '../../../api/endpoints';
import Cargador from '../../componentes/comunes/Cargador';

// Definición de MercadoPago en window para TypeScript
declare global {
  interface Window {
    MercadoPago: any;
  }
}

// Interfaces para tipificar los datos
interface Pasaje {
  id_tipo_pasaje: number;
  cantidad: number;
  precio_unitario: number;
}

interface Paquete {
  id_paquete_pasajes: number;
  precio: number;
}

// Interfaces para los datos que vienen del datosReserva
interface PasajeDatosReserva {
  idTipoPasaje: number;
  cantidad: number;
  precioUnitario: number;
}

interface PaqueteDatosReserva {
  idPaquetePasajes: number;
  precio: number;
  seleccionado: boolean;
}

// Constantes de configuración
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_SANDBOX = !IS_PRODUCTION;

const PaginaProcesoPago = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, autenticado } = useSelector((state: RootState) => state.autenticacion);
  
  // Recuperar datos de la reserva del state o de sessionStorage
  const datosReserva = location.state || JSON.parse(sessionStorage.getItem('datosReservaPendiente') || '{}');
  
  // Estados para el flujo de pago
  const [cargandoPago, setCargandoPago] = useState(false);
  const [cargandoMercadoPago, setCargandoMercadoPago] = useState(true);
  const [metodoPago, setMetodoPago] = useState('mercadopago');
  const [error, setError] = useState<string | null>(null);
  const [preferencia, setPreferencia] = useState<any>(null);
  const [sdkCargado, setSdkCargado] = useState(false);
  const [usarModoSimulado, setUsarModoSimulado] = useState(process.env.NODE_ENV === 'development');
  const [publicKey, setPublicKey] = useState('');
  
  // Estados para datos de usuario
  const [editandoUsuario, setEditandoUsuario] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState({
    nombres: usuario?.nombres || '',
    apellidos: usuario?.apellidos || '',
    correo: usuario?.correo || '',
    numero_celular: usuario?.numero_celular || '',
    numero_documento: usuario?.numero_documento || ''
  });

  // Referencia al contenedor del botón
  const mercadoPagoButtonRef = useRef<HTMLDivElement>(null);
  
  // Calcular subtotal, IGV y total
  const subtotal = Number(datosReserva.total || 0);
  const igv = subtotal * 0.18;
  const total = subtotal; // Ya incluye IGV en este caso

  // Manejar cambios en los campos de usuario
  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Guardar cambios del usuario
  const guardarCambiosUsuario = () => {
    // Aquí puedes implementar la lógica para guardar los cambios en la base de datos
    // Por ahora solo cerramos el modo de edición
    setEditandoUsuario(false);
    
    // Muestra un mensaje de éxito
    alert('Cambios guardados correctamente.');
  };

  // Obtener la clave pública desde el backend
  const obtenerClavePublica = useCallback(async () => {
    try {
      const response = await clienteAxios.get(endpoints.mercadoPago.publicKey);
      if (response.data && response.data.public_key) {
        setPublicKey(response.data.public_key);
        return response.data.public_key;
      }
      throw new Error('No se pudo obtener la clave pública de Mercado Pago');
    } catch (error) {
      console.error('Error al obtener clave pública:', error);
      setError('No se pudo conectar con el servidor de pagos. Por favor, intenta nuevamente.');
      return null;
    }
  }, []);

  // Crear una preferencia simulada (para pruebas)
  const crearPreferenciaSimulada = useCallback(() => {
    const preferencia = {
      id: `TEST-${Date.now()}`,
      preference_id: `TEST-${Date.now()}`,
      init_point: "https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=123456789",
      sandbox_init_point: "https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=123456789"
    };
    
    console.log("Preferencia simulada creada:", preferencia);
    return preferencia;
  }, []);

  // Crear preferencia real usando el backend
 // Crear preferencia real usando el backend
const crearPreferenciaReal = useCallback(async () => {
  try {
    // Verificamos qué tipo de reserva tenemos
    if (datosReserva.reservaId) {
      // Si ya tenemos una reserva, usamos el endpoint para pagar una reserva existente
      console.log("Obteniendo preferencia para reserva existente:", datosReserva.reservaId);
      
      const endpoint = endpoints.mercadoPago.pagarReserva(datosReserva.reservaId);
      const response = await clienteAxios.post(endpoint);
      
      console.log("Respuesta del servidor:", response.data);
      
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error("La respuesta del servidor no contiene datos de preferencia");
      }
    } else if (datosReserva.instanciaId) {
      // Si es una nueva reserva, creamos una reserva con Mercado Pago
      console.log("Creando nueva reserva con Mercado Pago para instancia:", datosReserva.instanciaId);
      
      // Preparar los datos de pasajes en el formato correcto
      const pasajes = datosReserva.cantidadesPasajes
        ?.filter((p: PasajeDatosReserva) => p.cantidad > 0)
        .map((p: PasajeDatosReserva) => ({
          id_tipo_pasaje: p.idTipoPasaje,
          cantidad: p.cantidad,
          precio_unitario: p.precioUnitario
        })) || [];
      
      // Preparar los datos de paquetes en el formato correcto
      const paquetes = datosReserva.paquetes
        ?.filter((p: PaqueteDatosReserva) => p.seleccionado)
        .map((p: PaqueteDatosReserva) => ({
          id_paquete_pasajes: p.idPaquetePasajes,
          precio: p.precio
        })) || [];
      
      // Datos para enviar al backend
      const datosParaEnviar = {
        id_instancia: datosReserva.instanciaId,
        id_cliente: usuario?.id_cliente, 
        pasajes: pasajes,
        paquetes: paquetes,
        monto: datosReserva.total || total,
        tour_nombre: datosReserva.tourNombre || "Tour",
        email: usuario?.correo || datosUsuario.correo,
        nombre: usuario?.nombres || datosUsuario.nombres,
        apellido: usuario?.apellidos || datosUsuario.apellidos,
        telefono: usuario?.numero_celular || datosUsuario.numero_celular,
        documento: usuario?.numero_documento || datosUsuario.numero_documento
      };
      
      const response = await clienteAxios.post(endpoints.mercadoPago.reservar, datosParaEnviar);
      
      if (response.data && response.data.data) {
        // Si se creó una reserva, guardar su ID
        if (response.data.data.id_reserva) {
          sessionStorage.setItem('reservaEnProceso', JSON.stringify({
            id: response.data.data.id_reserva,
            tour: datosReserva.tourNombre,
            fecha: datosReserva.fecha
          }));
        }
        return response.data.data;
      } else {
        throw new Error("La respuesta del servidor no contiene datos de preferencia");
      }
    } else {
      throw new Error("No se encontró ID de reserva o instancia");
    }
  } catch (error: any) {
    console.error("Error al crear preferencia real:", error);
    
    // Mostrar mensaje de error más detallado
    if (error.response && error.response.data) {
      const mensaje = error.response.data.message || error.response.data.error || "Error desconocido del servidor";
      setError(`Error del servidor: ${mensaje}`);
    } else {
      setError(`Error al crear preferencia: ${error.message || "Error desconocido"}`);
    }
    
    throw error;
  }
}, [datosReserva, datosUsuario, usuario, total]);

  // Cargar el SDK de Mercado Pago
  const cargarMercadoPagoSDK = useCallback(() => {
    if (window.MercadoPago) {
      console.log("SDK de MercadoPago ya está cargado");
      setSdkCargado(true);
      return Promise.resolve();
    }
    
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      
      script.onload = () => {
        console.log("SDK de MercadoPago cargado correctamente");
        setSdkCargado(true);
        resolve();
      };
      
      script.onerror = () => {
        console.error("Error al cargar el SDK de MercadoPago");
        setError("No se pudo cargar el procesador de pagos. Verifica tu conexión a internet.");
        reject();
      };
      
      document.head.appendChild(script);
    });
  }, []);

  // Renderizar el botón de Mercado Pago
  const renderizarBotonMercadoPago = useCallback(() => {
    if (!preferencia) {
      console.log("No hay preferencia para renderizar el botón");
      return;
    }
    
    if (!mercadoPagoButtonRef.current) {
      console.log("No se encontró la referencia al contenedor del botón");
      return;
    }
    
    if (!window.MercadoPago) {
      console.log("El SDK de MercadoPago no está disponible");
      return;
    }
    
    if (!publicKey) {
      console.log("No hay clave pública disponible");
      return;
    }
    
    try {
      // Obtener el ID de preferencia
      const preferenceId = preferencia.preference_id || preferencia.id;
      
      if (!preferenceId) {
        console.error("No se encontró ID de preferencia válido");
        return;
      }
      
      console.log("Renderizando botón con preferenceId:", preferenceId);
      
      // Inicializar MercadoPago
      const mp = new window.MercadoPago(publicKey, {
        locale: 'es-PE'
      });
      
      // Limpiar el contenedor
      mercadoPagoButtonRef.current.innerHTML = '';
      
      // Renderizar el botón
      mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '.mercado-pago-button',
          label: 'Pagar con Mercado Pago',
        }
      });
      
      console.log("Botón de MercadoPago renderizado correctamente");
    } catch (error) {
      console.error("Error al renderizar el botón de MercadoPago:", error);
      setError("Error al inicializar el botón de pago. Por favor, actualiza la página.");
    }
  }, [preferencia, publicKey]);

  // Iniciar el proceso de pago
  const iniciarProcesoPago = useCallback(async () => {
    try {
      setCargandoMercadoPago(true);
      setError(null);
      
      // 1. Cargar el SDK si no está cargado
      await cargarMercadoPagoSDK();
      
      // 2. Obtener la clave pública si no la tenemos
      if (!publicKey) {
        const key = await obtenerClavePublica();
        if (!key && !usarModoSimulado) {
          throw new Error('No se pudo obtener la clave pública de Mercado Pago');
        }
      }
      
      // 3. Crear preferencia (simulada o real)
      let nuevaPreferencia;
      
      if (usarModoSimulado) {
        console.log("Usando modo simulado para crear preferencia");
        nuevaPreferencia = crearPreferenciaSimulada();
      } else {
        console.log("Usando modo real para crear preferencia");
        nuevaPreferencia = await crearPreferenciaReal();
      }
      
      // 4. Actualizar el estado
      setPreferencia(nuevaPreferencia);
      
    } catch (error: any) {
      console.error("Error al iniciar el proceso de pago:", error);
      if (!error.message || !error.message.includes('Error al crear preferencia')) {
        setError("No se pudo iniciar el proceso de pago. Por favor, intenta nuevamente.");
      }
    } finally {
      setCargandoMercadoPago(false);
    }
  }, [cargarMercadoPagoSDK, crearPreferenciaSimulada, crearPreferenciaReal, obtenerClavePublica, publicKey, usarModoSimulado]);

  // Función para procesar pago directo
  const procesarPagoDirecto = async () => {
    if (cargandoPago) return;
    
    setCargandoPago(true);
    setError(null);
    
    try {
      console.log("Procesando pago directo...");
      
      // Si tenemos una preferencia con URL de pago, redirigir a ella
      if (preferencia) {
        // Determinar qué URL usar según el entorno
        const url = IS_SANDBOX
          ? (preferencia.sandbox_init_point || preferencia.init_point)
          : preferencia.init_point;
        
        console.log("Redirigiendo a URL de pago:", url);
        
        if (usarModoSimulado) {
          // En modo simulado, redirigir a página de éxito directamente
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          navigate('/reserva-exitosa', {
            state: {
              reservaId: datosReserva.reservaId || datosReserva.instanciaId,
              estado: 'CONFIRMADA',
              metodoPago: 'mercadopago',
              fechaPago: new Date().toISOString(),
              tourNombre: datosReserva.tourNombre,
              total: total,
              fecha: datosReserva.fecha,
              horario: datosReserva.horario,
              totalPasajeros: datosReserva.totalPasajeros,
              mensaje: 'Tu pago ha sido procesado exitosamente'
            }
          });
        } else if (url) {
          // En modo real, redirigir a la URL de pago
          window.location.href = url;
        } else {
          throw new Error("No se encontró URL de pago en la preferencia");
        }
        return;
      }
      
      // Si no tenemos preferencia, intentar crearla
      await iniciarProcesoPago();
      
      // Verificar si ahora tenemos preferencia
      if (preferencia) {
        const url = IS_SANDBOX
          ? (preferencia.sandbox_init_point || preferencia.init_point)
          : preferencia.init_point;
        
        if (usarModoSimulado) {
          // En modo simulado, redirigir a página de éxito directamente
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          navigate('/reserva-exitosa', {
            state: {
              reservaId: datosReserva.reservaId || datosReserva.instanciaId,
              estado: 'CONFIRMADA',
              metodoPago: 'mercadopago',
              fechaPago: new Date().toISOString(),
              tourNombre: datosReserva.tourNombre,
              total: total,
              fecha: datosReserva.fecha,
              horario: datosReserva.horario,
              totalPasajeros: datosReserva.totalPasajeros,
              mensaje: 'Tu pago ha sido procesado exitosamente'
            }
          });
        } else if (url) {
          // En modo real, redirigir a la URL de pago
          window.location.href = url;
        } else {
          throw new Error("No se encontró URL de pago en la preferencia");
        }
        return;
      }
      
      setError("No se pudo generar el pago. Por favor, intenta nuevamente.");
      
    } catch (error: any) {
      console.error('Error al procesar el pago:', error);
      if (!error.message || !error.message.includes('Error al crear preferencia')) {
        setError('No se pudo procesar el pago. Por favor, inténtalo nuevamente.');
      }
    } finally {
      setCargandoPago(false);
    }
  };
  
  // Iniciar el proceso cuando el componente se monta
  useEffect(() => {
    const iniciarMercadoPago = async () => {
      try {
        // 1. Obtener clave pública
        if (!publicKey) {
          await obtenerClavePublica();
        }
        
        // 2. Iniciar proceso de pago
        await iniciarProcesoPago();
        
      } catch (error) {
        console.error('Error al inicializar Mercado Pago:', error);
      }
    };
    
    iniciarMercadoPago();
  }, [obtenerClavePublica, iniciarProcesoPago, publicKey]);

  // Renderizar el botón cuando la preferencia cambia
  useEffect(() => {
    if (preferencia && sdkCargado && publicKey) {
      // Pequeño retraso para asegurar que el DOM está listo
      const timeoutId = setTimeout(() => {
        renderizarBotonMercadoPago();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [preferencia, sdkCargado, publicKey, renderizarBotonMercadoPago]);
  
  // Verificar si estamos regresando de un pago en Mercado Pago
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const paymentId = params.get('payment_id');
    const externalReference = params.get('external_reference');
    
    if (status) {
      // Si estamos regresando con un estado
      let reservaId;
      
      // Extraer ID de reserva
      if (externalReference && externalReference.startsWith('RESERVA-')) {
        reservaId = parseInt(externalReference.replace('RESERVA-', ''));
      } else {
        reservaId = datosReserva.reservaId || datosReserva.instanciaId;
      }
      
      // Datos comunes para cualquier estado
      const datosBase = {
        reservaId: reservaId,
        paymentId: paymentId,
        metodoPago: 'mercadopago',
        fechaPago: new Date().toISOString(),
        tourNombre: datosReserva.tourNombre,
        total: total,
        fecha: datosReserva.fecha,
        horario: datosReserva.horario,
        totalPasajeros: datosReserva.totalPasajeros
      };
      
      switch (status) {
        case 'approved':
        case 'success':
          // Pago exitoso
          navigate('/reserva-exitosa', {
            state: {
              ...datosBase,
              estado: 'CONFIRMADA',
              mensaje: 'Tu pago ha sido procesado exitosamente'
            }
          });
          break;
        case 'pending':
          // Pago pendiente
          navigate('/reserva-exitosa', {
            state: {
              ...datosBase,
              estado: 'PENDIENTE',
              mensaje: 'Tu pago está pendiente de confirmación'
            }
          });
          break;
        case 'failure':
        case 'rejected':
          // Pago fallido
          navigate('/pago-fallido', {
            state: {
              ...datosBase,
              estado: 'RECHAZADO',
              mensaje: 'El pago no pudo ser procesado'
            }
          });
          break;
      }
    }
  }, [location.search, navigate, datosReserva, total]);
  
  // Formatear fecha para mostrar
  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-PE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-white via-blue-50 to-cyan-50 min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold">{t('pago.titulo', 'Proceso de Pago')}</h1>
          <p className="mt-1 opacity-90">{t('pago.subtitulo', 'Completa tu reserva realizando el pago')}</p>
          
          {/* Paso de proceso */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between max-w-md">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs mt-1">Selección</span>
              </div>
              
              <div className="flex-1 h-0.5 mx-2 bg-white/40"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <span className="text-xs mt-1">Pago</span>
              </div>
              
              <div className="flex-1 h-0.5 mx-2 bg-white/40"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <span className="text-xs mt-1">Confirmación</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información de la reserva */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos del tour */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-cyan-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Detalles de la reserva
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{datosReserva.tourNombre}</h3>
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{formatearFecha(datosReserva.fecha)}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{datosReserva.horario}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-200">
                    {datosReserva.totalPasajeros} pasajeros
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-800">S/ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">IGV (18%):</span>
                      <span className="text-gray-800">S/ {igv.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-200">
                      <span className="text-gray-800">Total a pagar:</span>
                      <span className="text-teal-600 text-lg">S/ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Información del cliente */}
            {usuario && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyan-100">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Datos del cliente
                  </h2>
                  
                  <button 
                    type="button"
                    onClick={() => setEditandoUsuario(!editandoUsuario)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    {editandoUsuario ? (
                      <>Cancelar</>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Editar
                      </>
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input 
                      type="text" 
                      name="nombres"
                      value={datosUsuario.nombres}
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                    <input 
                      type="text" 
                      name="apellidos"
                      value={datosUsuario.apellidos}
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      name="correo"
                      value={datosUsuario.correo}
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input 
                      type="text" 
                      name="numero_celular"
                      value={datosUsuario.numero_celular} 
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                    <input 
                      type="text" 
                      name="numero_documento"
                      value={datosUsuario.numero_documento} 
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
                
                {editandoUsuario && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={guardarCambiosUsuario}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Guardar cambios
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Opciones de pago */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-cyan-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Opciones de pago
              </h2>
              
              {/* Muestra error si existe */}
              {error && (
                <div className="mt-4 mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {/* Opciones de modo (solo para desarrollo) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-yellow-50 border rounded border-yellow-200 text-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
                    <span className="font-medium text-yellow-800">Modo de prueba</span>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={usarModoSimulado} 
                        onChange={(e) => setUsarModoSimulado(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">Usar modo simulado</span>
                    </label>
                  </div>
                </div>
              )}
              
              {/* Tarjetas de prueba (solo en desarrollo) */}
              {process.env.NODE_ENV === 'development' && usarModoSimulado && (
                <div className="mb-4 p-3 bg-blue-50 border rounded border-blue-200 text-sm">
                  <div className="font-medium text-blue-800 mb-2">Tarjetas de prueba:</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-2 bg-white rounded border border-blue-100">
                      <div className="text-gray-700 font-medium">Mastercard (aprobada)</div>
                      <div className="text-gray-600">5031 7557 3453 0604</div>
                      <div className="text-gray-500 text-xs">
                        <span>CVV: 123</span> | <span>Fecha: 11/25</span> | <span>Nombre: APRO</span>
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded border border-blue-100">
                      <div className="text-gray-700 font-medium">Visa (rechazada)</div>
                      <div className="text-gray-600">4509 9535 6623 3704</div>
                      <div className="text-gray-500 text-xs">
                        <span>CVV: 123</span> | <span>Fecha: 11/25</span> | <span>Nombre: RECH</span>
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded border border-blue-100">
                      <div className="text-gray-700 font-medium">Visa (pendiente)</div>
                      <div className="text-gray-600">4075 5957 1648 3764</div>
                      <div className="text-gray-500 text-xs">
                        <span>CVV: 123</span> | <span>Fecha: 11/25</span> | <span>Nombre: CONT</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Sección de pago */}
              <div>
                {cargandoMercadoPago ? (
                  <div className="w-full py-6 flex justify-center items-center bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                    <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-blue-500 rounded-full mr-2"></div>
                    <span className="text-blue-500">Cargando opciones de pago...</span>
                  </div>
                ) : (
                  <>
                    {/* Contenedor para el botón de Mercado Pago */}
                    <div 
                      className="mercado-pago-button w-full min-h-[60px] bg-blue-50 rounded-lg border border-blue-200 mb-4 flex items-center justify-center"
                      ref={mercadoPagoButtonRef}
                    >
                      <span className="text-sm text-blue-500">Opciones de pago con Mercado Pago</span>
                    </div>
                    
                    {/* Botón alternativo para pago directo */}
                    <button
                      type="button"
                      onClick={procesarPagoDirecto}
                      disabled={cargandoPago}
                      className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center ${
                        cargandoPago ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-600 hover:to-teal-600'
                      }`}
                    >
                      {cargandoPago ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando pago...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Pagar S/ {total.toFixed(2)}
                        </span>
                      )}
                    </button>
                    
                    <p className="mt-2 text-xs text-center text-gray-500">
                      Al hacer clic en "Pagar", aceptas nuestros <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a>.
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {/* Información de seguridad */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-cyan-200">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800">Pago 100% seguro</h3>
              </div>
              <p className="text-xs text-gray-600 ml-10">
                Tu información de pago se procesa de forma segura.
              </p>
              
              <div className="flex items-center mt-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800">Datos protegidos</h3>
              </div>
              <p className="text-xs text-gray-600 ml-10">
                No almacenamos tus datos de tarjeta. Todas las transacciones son procesadas por Mercado Pago con la mayor seguridad.
              </p>
            </div>
          </div>
        </div>
        
        {/* Botón para volver */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-cyan-300 text-cyan-700 font-medium rounded-lg transition-colors hover:bg-cyan-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaProcesoPago;