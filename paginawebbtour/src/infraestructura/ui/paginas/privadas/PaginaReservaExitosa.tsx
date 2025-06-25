 import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { clienteAxios } from '../../../api/clienteAxios';
import Cargador from '../../componentes/comunes/Cargador';

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

const PaginaReservaExitosa: React.FC = () => {
      window.scrollTo(0, 0);

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [cargando, setCargando] = useState(true);
  const [detalleReserva, setDetalleReserva] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Obtener datos del state
  const datosReserva = location.state as DatosReserva;
  
  useEffect(() => {
    const obtenerDetalleReserva = async () => {
      try {
        if (!datosReserva || !datosReserva.reservaId) {
          throw new Error('No se encontraron datos de la reserva');
        }
        
        const response = await clienteAxios.get(`/api/v1/cliente/mis-reservas/${datosReserva.reservaId}`);
        
        if (response.data && response.data.data) {
          setDetalleReserva(response.data.data);
        } else {
          throw new Error('No se pudo obtener el detalle de la reserva');
        }
      } catch (error: any) {
        console.error('Error al obtener detalle de reserva:', error);
        setError(error.message || 'Error al cargar datos de la reserva');
      } finally {
        setCargando(false);
      }
    };
    
    obtenerDetalleReserva();
    
    // Guardar en localStorage para recuperar si se refresca la página
    if (datosReserva) {
      localStorage.setItem('ultimaReservaExitosa', JSON.stringify(datosReserva));
    }
  }, [datosReserva]);
  
  // Si no hay datos en el state, intentar recuperarlos del localStorage
  useEffect(() => {
    if (!datosReserva) {
      const datosGuardados = localStorage.getItem('ultimaReservaExitosa');
      if (datosGuardados) {
        try {
          const datos = JSON.parse(datosGuardados);
          // Redirigir con los datos recuperados
          navigate('/reserva-exitosa', { state: datos, replace: true });
        } catch (error) {
          console.error('Error al recuperar datos guardados:', error);
          setError('No se encontraron datos de la reserva');
          setCargando(false);
        }
      } else {
        setError('No se encontraron datos de la reserva');
        setCargando(false);
      }
    }
  }, [datosReserva, navigate]);
  
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
  
  // Determinar color y mensaje según estado
  const obtenerColorEstado = () => {
    if (!datosReserva) return 'bg-gray-500';
    
    switch (datosReserva.estado) {
      case 'CONFIRMADA':
        return 'bg-green-500';
      case 'PENDIENTE':
        return 'bg-yellow-500';
      case 'RECHAZADO':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  const obtenerIconoEstado = () => {
    if (!datosReserva) return null;
    
    switch (datosReserva.estado) {
      case 'CONFIRMADA':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'PENDIENTE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'RECHAZADO':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50 to-cyan-50">
        <Cargador mensaje="Cargando información de tu reserva..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-blue-50 to-cyan-50 p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    );
  }
  
  if (!datosReserva) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-blue-50 to-cyan-50 p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 max-w-md">
          <p className="font-bold">Aviso</p>
          <p>No se encontraron datos de la reserva.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-cyan-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado con estado */}
        <div className={`rounded-xl shadow-lg overflow-hidden mb-8`}>
          <div className={`${obtenerColorEstado()} py-8 px-6 flex items-center justify-center`}>
            <div className="text-center">
              {obtenerIconoEstado()}
              <h1 className="text-3xl font-bold text-white mt-4">{datosReserva.mensaje || 'Reserva procesada'}</h1>
              <p className="text-white text-lg mt-2">
                {datosReserva.estado === 'CONFIRMADA' && 'Tu reserva ha sido confirmada exitosamente.'}
                {datosReserva.estado === 'PENDIENTE' && 'Tu reserva está pendiente de confirmación.'}
                {datosReserva.estado === 'RECHAZADO' && 'Hubo un problema con tu pago. Intenta nuevamente.'}
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6">
            {/* Información del tour */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Detalles del Tour
              </h2>
              
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
                  <p className="text-sm text-gray-600">Total de pasajeros:</p>
                  <p className="font-medium text-gray-800">{datosReserva.totalPasajeros}</p>
                </div>
              </div>
            </div>
            
            {/* Información del pago */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Información del Pago
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Estado del pago:</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      datosReserva.estado === 'CONFIRMADA' ? 'bg-green-500' : 
                      datosReserva.estado === 'PENDIENTE' ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}></span>
                    <span className="font-medium text-gray-800">
                      {datosReserva.estado === 'CONFIRMADA' ? 'Confirmado' : 
                       datosReserva.estado === 'PENDIENTE' ? 'Pendiente' : 
                       'Rechazado'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Método de pago:</p>
                  <p className="font-medium text-gray-800">{
                    datosReserva.metodoPago === 'mercadopago' ? 'Mercado Pago' : datosReserva.metodoPago
                  }</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID de Pago:</p>
                  <p className="font-medium text-gray-800">{datosReserva.paymentId || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Número de Reserva:</p>
                  <p className="font-medium text-gray-800">#{datosReserva.reservaId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de Pago:</p>
                  <p className="font-medium text-gray-800">{formatearFecha(datosReserva.fechaPago)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total pagado:</p>
                  <p className="font-medium text-gray-800 text-lg text-teal-600">S/ {datosReserva.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            {/* Instrucciones según el estado */}
            <div className={`p-4 rounded-lg ${
              datosReserva.estado === 'CONFIRMADA' ? 'bg-green-50 border border-green-200' : 
              datosReserva.estado === 'PENDIENTE' ? 'bg-yellow-50 border border-yellow-200' : 
              'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-medium text-lg ${
                datosReserva.estado === 'CONFIRMADA' ? 'text-green-800' : 
                datosReserva.estado === 'PENDIENTE' ? 'text-yellow-800' : 
                'text-red-800'
              }`}>
                {datosReserva.estado === 'CONFIRMADA' ? '¿Qué sigue?' : 
                 datosReserva.estado === 'PENDIENTE' ? 'Estado pendiente' : 
                 'Pago rechazado'}
              </h3>
              
              {datosReserva.estado === 'CONFIRMADA' && (
                <div className="mt-2 text-green-700">
                  <p>Tu reserva ha sido confirmada. Te hemos enviado un correo electrónico con los detalles.</p>
                  <p className="mt-2">Por favor, llega al punto de encuentro con 15 minutos de anticipación el día de tu tour.</p>
                </div>
              )}
              
              {datosReserva.estado === 'PENDIENTE' && (
                <div className="mt-2 text-yellow-700">
                  <p>Tu pago está siendo procesado. Te notificaremos por correo electrónico cuando se confirme.</p>
                  <p className="mt-2">Puedes revisar el estado de tu reserva en la sección "Mis Reservas" de tu perfil.</p>
                </div>
              )}
              
              {datosReserva.estado === 'RECHAZADO' && (
                <div className="mt-2 text-red-700">
                  <p>Tu pago no pudo ser procesado. Esto puede deberse a:</p>
                  <ul className="list-disc ml-5 mt-1">
                    <li>Fondos insuficientes</li>
                    <li>Datos incorrectos</li>
                    <li>Problemas con tu entidad bancaria</li>
                  </ul>
                  <p className="mt-2">Puedes intentar nuevamente con otro método de pago o contactar a soporte.</p>
                </div>
              )}
            </div>
            
            {/* Botones de acción */}
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-4">
              <button
                onClick={() => navigate('/cliente/mis-reservas')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Ver Mis Reservas
              </button>
              
              {datosReserva.estado === 'RECHAZADO' && (
                <button
                  onClick={() => navigate('/proceso-pago', { 
                    state: {
                      ...datosReserva,
                      instanciaId: datosReserva.reservaId
                    }
                  })}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                  Intentar Pagar Nuevamente
                </button>
              )}
              
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
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

export default PaginaReservaExitosa;