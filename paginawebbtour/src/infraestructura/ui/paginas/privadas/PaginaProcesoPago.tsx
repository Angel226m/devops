 
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../../store';

const PaginaProcesoPago = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, autenticado } = useSelector((state: RootState) => state.autenticacion);
  const [cargandoPago, setCargandoPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState('mercadopago');
  const [error, setError] = useState<string | null>(null);
  
  // Recuperar datos de la reserva del state o de sessionStorage
  const datosReserva = location.state || JSON.parse(sessionStorage.getItem('datosReservaPendiente') || '{}');
  
  useEffect(() => {
    // Redirigir a inicio de sesión si no está autenticado
    if (!autenticado) {
      navigate('/ingresar', { 
        state: { 
          returnUrl: '/proceso-pago',
          mensaje: 'Debes iniciar sesión para completar tu reserva'
        } 
      });
    }
    
    // Redirigir a la página de tours si no hay datos de reserva
    if (!datosReserva || !datosReserva.tourId) {
      navigate('/tours');
    }
    
    // Configurar Mercado Pago (aquí iría el código real de integración)
    const configurarMercadoPago = async () => {
      try {
        // Aquí se cargaría el SDK de Mercado Pago
        // Este es solo un placeholder
        console.log('Configurando Mercado Pago para el pago...');
      } catch (error) {
        console.error('Error al configurar Mercado Pago:', error);
        setError('No se pudo configurar el método de pago. Por favor, inténtalo nuevamente.');
      }
    };
    
    configurarMercadoPago();
    
    // Cleanup
    return () => {
      // Limpiar cualquier configuración de Mercado Pago
    };
  }, [autenticado, datosReserva, navigate]);
  
  const procesarPago = async () => {
    setCargandoPago(true);
    setError(null);
    
    try {
      // Simulación de procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redireccionar a página de confirmación
      navigate('/reserva-exitosa', {
        state: {
          ...datosReserva,
          metodoPago,
          fechaPago: new Date().toISOString(),
          idTransaccion: 'MP' + Math.floor(Math.random() * 10000000),
          reservaId: Math.floor(Math.random() * 1000000)
        }
      });
      
      // Limpiar datos de reserva pendiente
      sessionStorage.removeItem('datosReservaPendiente');
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setError('No se pudo procesar el pago. Por favor, inténtalo nuevamente.');
      setCargandoPago(false);
    }
  };
  
  if (!datosReserva || !datosReserva.tourId) {
    return null; // El useEffect se encargará de redireccionar
  }
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col space-y-6">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl shadow-md">
          <h1 className="text-2xl font-bold">{t('pago.titulo')}</h1>
          <p className="mt-1 opacity-80">{t('pago.subtitulo')}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información de la reserva */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos del tour */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Detalles de la reserva</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{datosReserva.tourNombre}</h3>
                    <div className="mt-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {new Date(datosReserva.fecha).toLocaleDateString('es-PE', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {datosReserva.horario}
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                    {datosReserva.totalPasajeros} pasajeros
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                                       <span className="text-gray-800">S/ {Number(datosReserva.total).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">IGV (18%):</span>
                      <span className="text-gray-800">S/ {(Number(datosReserva.total) * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-200">
                      <span className="text-gray-800">Total a pagar:</span>
                      <span className="text-green-600">S/ {Number(datosReserva.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Información del cliente */}
            {usuario && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Datos del cliente</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input 
                      type="text" 
                      value={`${usuario.nombres} ${usuario.apellidos}`}
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={usuario.correo} 
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input 
                      type="text" 
                      value={usuario.numero_celular || 'No especificado'} 
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                    <input 
                      type="text" 
                      value={usuario.numero_documento || 'No especificado'} 
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Opciones de pago */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Selecciona tu método de pago</h2>
              
              <div className="space-y-3">
                {/* Mercado Pago (opción principal) */}
                <div 
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    metodoPago === 'mercadopago' 
                      ? 'border-blue-400 bg-blue-50 shadow-sm' 
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
                        <img src="https://www.mercadopago.com/org-img/MP3/API/logos/mp-logo.svg" alt="Mercado Pago" className="h-8 mr-2" />
                        <span className="font-medium text-gray-800">Mercado Pago</span>
                      </label>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Recomendado</span>
                  </div>
                  
                  {metodoPago === 'mercadopago' && (
                    <div className="mt-3 ml-6 text-sm text-gray-600">
                      <p>Paga con tarjeta, Yape, Plin o cualquier método disponible en Mercado Pago.</p>
                      <div className="flex mt-2 space-x-2">
                        <img src="https://cdn.visa.com/v2/assets/images/logos/visa/logo.png" alt="Visa" className="h-5" />
                        <img src="https://www.mastercard.com.pe/content/dam/public/mastercardcom/lac/pe/home/consumers/find-a-card/images/black-mc-logo.svg" alt="Mastercard" className="h-5" />
                        <img src="https://www.bcp.com.bo/Content/core/images/footer/yape.svg" alt="Yape" className="h-5" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Otros métodos de pago (deshabilitados por ahora) */}
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
              
              {/* Muestra error si existe */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {/* Botón de pago */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={procesarPago}
                  disabled={cargandoPago}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center ${
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
                      Pagar S/ {Number(datosReserva.total).toFixed(2)}
                    </span>
                  )}
                </button>
                
                <p className="mt-2 text-xs text-center text-gray-500">
                  Al hacer clic en "Pagar", aceptas nuestros términos y condiciones.
                </p>
              </div>
            </div>
            
            {/* Información de seguridad */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="font-medium text-gray-800">Pago 100% seguro</h3>
              </div>
              <p className="text-xs text-gray-600 ml-7">
                Tu información de pago se procesa de forma segura. Utilizamos encriptación SSL para mantener tus datos protegidos.
              </p>
              
              <div className="flex items-center mt-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <h3 className="font-medium text-gray-800">Datos protegidos</h3>
              </div>
              <p className="text-xs text-gray-600 ml-7">
                No almacenamos tus datos de tarjeta. Todas las transacciones son procesadas por Mercado Pago.
              </p>
            </div>
          </div>
        </div>
        
        {/* Botón para volver */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors hover:bg-gray-50 flex items-center"
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