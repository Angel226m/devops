import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface DatosReserva {
  reservaId: number | null;
  paymentId: string | null;
  metodoPago: string;
  fechaPago: string;
  tourNombre: string;
  total: number;
  fecha: string;
  horario: string;
  totalPasajeros: number;
  estado: string;
  mensaje: string;
}

const PaginaPagoFallido: React.FC = () => {
      window.scrollTo(0, 0);

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener datos del state
  const datosReserva = location.state as DatosReserva;
  
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
  
  // Si no hay datos, mostrar mensaje genérico
  if (!datosReserva) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-red-50 to-red-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pago Fallido</h1>
          <p className="text-gray-600 mb-6">Lo sentimos, no pudimos procesar tu pago. Por favor, intenta nuevamente con otro método de pago.</p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => navigate('/proceso-pago')}
              className="w-full py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Intentar Nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-red-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Encabezado */}
          <div className="bg-red-600 py-6 px-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white mx-auto" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-white mt-3">{datosReserva.mensaje || 'Pago Rechazado'}</h1>
            <p className="text-white opacity-90 mt-1">Lo sentimos, no pudimos procesar tu pago.</p>
          </div>
          
          {/* Contenido */}
          <div className="p-6">
            {/* Detalles del problema */}
            <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-200">
              <h2 className="text-lg font-semibold text-red-800 mb-2">¿Por qué falló tu pago?</h2>
              <p className="text-red-700">El pago puede haber fallado por varias razones:</p>
              <ul className="list-disc ml-5 mt-2 text-red-700">
                <li>Fondos insuficientes en tu cuenta</li>
                <li>Problemas con la entidad bancaria</li>
                <li>Datos de tarjeta incorrectos</li>
                <li>Límites de compra excedidos</li>
                <li>Problemas de conexión</li>
              </ul>
            </div>
            
            {/* Información del tour */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Información de la Reserva</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tour:</p>
                  <p className="font-medium text-gray-800">{datosReserva.tourNombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha:</p>
                  <p className="font-medium text-gray-800">{formatearFecha(datosReserva.fecha)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Horario:</p>
                  <p className="font-medium text-gray-800">{datosReserva.horario}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total a pagar:</p>
                  <p className="font-medium text-gray-800">S/ {datosReserva.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            {/* Instrucciones */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">¿Qué puedes hacer?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full flex-shrink-0 p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-gray-700">Intenta nuevamente con otra tarjeta o método de pago.</p>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full flex-shrink-0 p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-gray-700">Comunícate con tu banco para verificar si hay alguna restricción en tu tarjeta.</p>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full flex-shrink-0 p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-gray-700">Asegúrate de tener fondos suficientes en tu cuenta.</p>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full flex-shrink-0 p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-gray-700">Si continúas teniendo problemas, contáctanos a través de nuestro formulario de <a href="/contacto" className="text-blue-600 hover:underline">contacto</a>.</p>
                </div>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => navigate('/proceso-pago', { 
                  state: {
                    ...datosReserva,
                    instanciaId: datosReserva.reservaId
                  }
                })}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Intentar Pagar Nuevamente
              </button>
              
              <button
                onClick={() => navigate('/cliente/mis-reservas')}
                className="flex-1 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Ver Mis Reservas
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaPagoFallido;