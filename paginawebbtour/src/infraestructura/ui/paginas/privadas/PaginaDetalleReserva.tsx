/*  import { useTranslation } from 'react-i18next';
  import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
 
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '../../../store';
import { obtenerDetalleReservaPorId, limpiarReservaDetalle } from '../../../store/slices/sliceReserva';
import Cargador from '../../componentes/comunes/Cargador';
import Alerta from '../../componentes/comunes/Alerta';

interface CantidadPasaje {
  cantidad: number;
  nombre_tipo?: string;
  precio_unitario?: number;
  subtotal?: number;
}

interface PaqueteReserva {
  id_paquete: number;
  nombre?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  desglose_pasajes?: {
    tipo: string;
    cantidad: number;
  }[];
}

interface ReservaDetallada {
  id_reserva: number;
  id_cliente: number;
  id_instancia?: number;
  id_sede: number;
  total_pagar: number;
  cantidad_pasajes?: CantidadPasaje[];
  paquetes?: PaqueteReserva[];
  notas?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  estado: EstadoReserva;
  fecha_cancelacion?: string;
  
  // Información del tour
  nombre_tour?: string;
  descripcion_tour?: string;
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  fecha_tour?: string;
  fecha_reserva?: string;
  duracion_tour?: number;
  
  // Información del cliente
  cliente?: {
    nombres: string;
    apellidos: string;
    email: string;
    telefono?: string;
    tipo_documento?: string;
    numero_documento?: string;
  };
  
  // Información de la sede
  sede?: {
    nombre: string;
    direccion?: string;
    telefono?: string;
  };
  
  // Relaciones
  instancia?: {
    id_instancia: number;
    nombre_tour?: string;
    fecha_especifica: string;
    hora_inicio: string;
    hora_fin?: string;
    cupo_disponible: number;
    estado: string;
    punto_encuentro?: string;
    instrucciones?: string;
  };
}

type EstadoReserva = 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE' | 'PROCESADO' | 'ANULADO' | 'RESERVADO';

const PaginaDetalleReserva = () => {
  // Scroll al inicio
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { reservaDetalle, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  
  // Tratar la reserva como ReservaDetallada
  const reserva = reservaDetalle as ReservaDetallada | null;

  // Cargar detalle de la reserva
  useEffect(() => {
    if (id && autenticado) {
      dispatch(obtenerDetalleReservaPorId(parseInt(id)));
    } else if (!autenticado) {
      navigate('/login');
    }
    
    // Limpiar al desmontar
    return () => {
      dispatch(limpiarReservaDetalle());
    };
  }, [id, dispatch, autenticado, navigate]);

  // Función para formatear fechas
  const formatearFecha = (fechaStr?: string, formato: 'completo' | 'corto' | 'relativo' = 'completo'): string => {
    if (!fechaStr) return t('reservas.fechaNoDisponible');

    try {
      let fecha: Date;

      if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaStr)) {
        const [dia, mes, anio] = fechaStr.split('/').map(Number);
        fecha = new Date(anio, mes - 1, dia);
      } else {
        fecha = new Date(fechaStr);
      }

      if (isNaN(fecha.getTime())) {
        return t('reservas.fechaInvalida');
      }

      const opciones: Intl.DateTimeFormatOptions = {};

      switch (formato) {
        case 'completo':
          opciones.year = 'numeric';
          opciones.month = 'long';
          opciones.day = 'numeric';
          opciones.weekday = 'long';
          break;
        case 'corto':
          opciones.year = 'numeric';
          opciones.month = 'short';
          opciones.day = 'numeric';
          break;
        case 'relativo':
          const ahora = new Date();
          const diferencia = fecha.getTime() - ahora.getTime();
          const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

          if (dias === 0) return t('reservas.hoy');
          if (dias === 1) return t('reservas.manana');
          if (dias === -1) return t('reservas.ayer');
          if (dias > 0 && dias <= 7) return t('reservas.enDias', { dias });
          if (dias < 0 && dias >= -7) return t('reservas.haceDias', { dias: Math.abs(dias) });

          opciones.year = 'numeric';
          opciones.month = 'short';
          opciones.day = 'numeric';
          break;
      }

      return fecha.toLocaleDateString('es-PE', opciones);
    } catch (error) {
      return t('reservas.fechaInvalida');
    }
  };

  // Función para formatear hora
  const formatearHora = (horaStr?: string): string => {
    if (!horaStr) return '';
    try {
      if (horaStr.includes(':')) {
        const partes = horaStr.split(':');
        return `${partes[0]}:${partes[1]}`;
      }
      return horaStr;
    } catch (error) {
      return horaStr || '';
    }
  };

  // Obtener clase de color según el estado
  const getEstadoClase = (estado: EstadoReserva): string => {
    const clases = {
      'CONFIRMADA': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      'CANCELADA': 'bg-rose-100 text-rose-800 border border-rose-200',
      'PENDIENTE': 'bg-amber-100 text-amber-800 border border-amber-200',
      'PROCESADO': 'bg-blue-100 text-blue-800 border border-blue-200',
      'ANULADO': 'bg-gray-100 text-gray-800 border border-gray-200',
      'RESERVADO': 'bg-sky-100 text-sky-800 border border-sky-200'
    };
    return clases[estado] || clases['RESERVADO'];
  };

  // Obtener icono según el estado
  const getEstadoIcono = (estado: EstadoReserva) => {
    const iconos = {
      'CONFIRMADA': (
        <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'CANCELADA': (
        <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'PENDIENTE': (
        <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'PROCESADO': (
        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      'ANULADO': (
        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      ),
      'RESERVADO': (
        <svg className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    };
    return iconos[estado] || iconos['RESERVADO'];
  };

  // Obtener texto traducido para el estado
  const getEstadoTexto = (estado: EstadoReserva): string => {
    return t(`reserva.estados.${estado.toLowerCase()}`);
  };

  // Calcular total de pasajeros
  const calcularTotalPasajeros = (): number => {
    if (!reserva) return 0;
    
    let total = 0;
    
    // Sumar pasajeros individuales
    if (reserva.cantidad_pasajes) {
      total += reserva.cantidad_pasajes.reduce((sum, p) => sum + p.cantidad, 0);
    }
    
    // Sumar pasajeros de paquetes
    if (reserva.paquetes) {
      reserva.paquetes.forEach(paquete => {
        if (paquete.desglose_pasajes) {
          paquete.desglose_pasajes.forEach(desglose => {
            total += desglose.cantidad * paquete.cantidad;
          });
        }
      });
    }
    
    return total;
  };

  // Obtener desglose detallado de pasajeros
  const getDesglosePasajeros = () => {
    if (!reserva) return {};
    
    const desglose: Record<string, number> = {};
    
    // Procesar pasajeros individuales
    if (reserva.cantidad_pasajes) {
      reserva.cantidad_pasajes.forEach(p => {
        const tipo = p.nombre_tipo || 'Pasajero';
        desglose[tipo] = (desglose[tipo] || 0) + p.cantidad;
      });
    }
    
    // Procesar pasajeros de paquetes
    if (reserva.paquetes) {
      reserva.paquetes.forEach(paquete => {
        if (paquete.desglose_pasajes) {
          paquete.desglose_pasajes.forEach(desglosePaq => {
            const cantidad = desglosePaq.cantidad * paquete.cantidad;
            desglose[desglosePaq.tipo] = (desglose[desglosePaq.tipo] || 0) + cantidad;
          });
        }
      });
    }
    
    return desglose;
  };

  // Estados de carga y error
  if (!autenticado) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('reservas.noSesion')}</h2>
          <p className="text-gray-600 mb-6">{t('reservas.iniciarSesionParaVerReservas')}</p>
          <Link to="/ingresar" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            {t('auth.iniciarSesion')}
          </Link>
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Cargador tamanio="lg" color="text-blue-600" />
              <p className="mt-4 text-gray-600 text-lg">Cargando detalles de la reserva...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <Alerta mensaje={error || 'No se pudo cargar la reserva'} tipo="error" />
              <div className="text-center mt-6">
                <Link to="/mis-reservas" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  {t('general.volver')} a Mis Reservas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const desglosePasajeros = getDesglosePasajeros();
  const totalPasajeros = calcularTotalPasajeros();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header con navegación *//*}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/mis-reservas')}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 mr-4 transition-all"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Reserva #{reserva.id_reserva}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Creada el {formatearFecha(reserva.fecha_creacion, 'completo')}
                  </p>
                </div>
              </div>

              {/* Estado de la reserva *//*}
              <div className="flex items-center">
                <span className={`px-6 py-3 inline-flex items-center text-base font-semibold rounded-xl ${getEstadoClase(reserva.estado)} shadow-sm`}>
                  {getEstadoIcono(reserva.estado)}
                  <span className="ml-3">{getEstadoTexto(reserva.estado)}</span>
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Información principal del tour *//*}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              
              {/* Información del Tour *//*}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center border border-sky-200">
                      <svg className="h-10 w-10 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6 flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {reserva.nombre_tour || (reserva.instancia?.nombre_tour) || 'Tour'}
                    </h2>
                    
                    {reserva.descripcion_tour && (
                      <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                        {reserva.descripcion_tour}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        
                        {/* Fecha del Tour *//*}
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">Fecha del Tour</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {formatearFecha(reserva.fecha_tour || reserva.instancia?.fecha_especifica, 'completo')}
                            </div>
                            <div className="text-sm text-blue-600">
                              {formatearFecha(reserva.fecha_tour || reserva.instancia?.fecha_especifica, 'relativo')}
                            </div>
                          </div>
                        </div>

                        {/* Horario *//*}
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mr-4">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">Horario</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {formatearHora(reserva.hora_inicio_tour || reserva.instancia?.hora_inicio)}
                              {reserva.hora_fin_tour && (
                                <> - {formatearHora(reserva.hora_fin_tour)}</>
                              )}
                            </div>
                            {reserva.duracion_tour && (
                              <div className="text-sm text-green-600">
                                Duración: {reserva.duracion_tour} horas
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        
                        {/* Total de Pasajeros *//*}
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mr-4">
                            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">Total de Pasajeros</div>
                            <div className="text-2xl font-bold text-purple-600">
                              {totalPasajeros}
                            </div>
                          </div>
                        </div>

                        {/* Total Pagado *//*}
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mr-4">
                            <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">Total Pagado</div>
                            <div className="text-2xl font-bold text-emerald-600">
                              S/ {reserva.total_pagar.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desglose detallado de pasajeros *//*}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Desglose de Pasajeros
                </h3>

                {/* Resumen por tipo de pasajero *//*}
                {Object.keys(desglosePasajeros).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {Object.entries(desglosePasajeros).map(([tipo, cantidad]) => (
                      <div key={tipo} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-blue-700">{cantidad}</div>
                            <div className="text-sm font-medium text-blue-600">{tipo}</div>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            {tipo.toLowerCase().includes('niño') || tipo.toLowerCase().includes('child') ? (
                              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pasajeros individuales *//*}
                {reserva.cantidad_pasajes && reserva.cantidad_pasajes.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 text-sm flex items-center justify-center mr-2 font-bold">👤</span>
                      Pasajes Individuales
                    </h4>
                    <div className="space-y-3">
                      {reserva.cantidad_pasajes.map((pasaje, index) => (
                        <div key={index} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                                <span className="text-blue-600 font-bold">{pasaje.cantidad}</span>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {pasaje.nombre_tipo || 'Pasajero'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Cantidad: {pasaje.cantidad}
                                </div>
                              </div>
                            </div>
                            {pasaje.subtotal && (
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">
                                  S/ {pasaje.subtotal.toFixed(2)}
                                </div>
                                {pasaje.precio_unitario && (
                                  <div className="text-sm text-gray-500">
                                    S/ {pasaje.precio_unitario.toFixed(2)} c/u
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paquetes *//*}
                {reserva.paquetes && reserva.paquetes.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 text-sm flex items-center justify-center mr-2 font-bold">📦</span>
                      Paquetes Adquiridos
                    </h4>
                    <div className="space-y-4">
                      {reserva.paquetes.map((paquete, index) => (
                        <div key={index} className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mr-4">
                                <span className="text-emerald-600 font-bold">{paquete.cantidad}</span>
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-lg">
                                  {paquete.nombre || `Paquete #${paquete.id_paquete}`}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Cantidad de paquetes: {paquete.cantidad}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-emerald-600">
                                S/ {paquete.subtotal.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                S/ {paquete.precio_unitario.toFixed(2)} c/paquete
                              </div>
                            </div>
                          </div>

                          {/* Desglose del paquete *//*}
                          {paquete.desglose_pasajes && paquete.desglose_pasajes.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-emerald-200">
                              <div className="text-sm font-medium text-emerald-700 mb-3">
                                Incluye por cada paquete:
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {paquete.desglose_pasajes.map((desglose, desgloseIndex) => (
                                  <div key={desgloseIndex} className="bg-white rounded-lg p-3 border border-emerald-100">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700 font-medium">
                                        {desglose.tipo}
                                      </span>
                                      <span className="text-emerald-600 font-bold">
                                        {desglose.cantidad}x
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 text-xs text-emerald-600 bg-emerald-100 p-2 rounded-lg">
                                Total en {paquete.cantidad} paquete{paquete.cantidad > 1 ? 's' : ''}: {paquete.desglose_pasajes.reduce((sum, d) => sum + (d.cantidad * paquete.cantidad), 0)} pasajeros
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Información adicional *//*}
              {(reserva.instancia?.punto_encuentro || reserva.instancia?.instrucciones || reserva.notas) && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Información Adicional
                  </h3>

                  <div className="space-y-6">
                    {reserva.instancia?.punto_encuentro && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Punto de Encuentro
                        </h4>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-gray-700">{reserva.instancia.punto_encuentro}</p>
                        </div>
                      </div>
                    )}

                    {reserva.instancia?.instrucciones && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Instrucciones
                        </h4>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <p className="text-gray-700">{reserva.instancia.instrucciones}</p>
                        </div>
                      </div>
                    )}

                    {reserva.notas && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Notas de la Reserva
                        </h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-gray-700">{reserva.notas}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Panel lateral *//*}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              
              {/* Información del cliente *//*}
              {reserva.cliente && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Cliente
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Nombre Completo</div>
                      <div className="font-semibold text-gray-900">
                        {reserva.cliente.nombres} {reserva.cliente.apellidos}
                      </div>
                    </div>
                    {reserva.cliente.email && (
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="text-gray-900">{reserva.cliente.email}</div>
                      </div>
                    )}
                    {reserva.cliente.telefono && (
                      <div>
                        <div className="text-sm text-gray-500">Teléfono</div>
                        <div className="text-gray-900">{reserva.cliente.telefono}</div>
                      </div>
                    )}
                    {reserva.cliente.tipo_documento && reserva.cliente.numero_documento && (
                      <div>
                        <div className="text-sm text-gray-500">{reserva.cliente.tipo_documento}</div>
                        <div className="text-gray-900">{reserva.cliente.numero_documento}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Información de la sede *//*}
              {reserva.sede && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Sede
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Nombre</div>
                      <div className="font-semibold text-gray-900">{reserva.sede.nombre}</div>
                    </div>
                    {reserva.sede.direccion && (
                      <div>
                        <div className="text-sm text-gray-500">Dirección</div>
                        <div className="text-gray-900">{reserva.sede.direccion}</div>
                      </div>
                    )}
                    {reserva.sede.telefono && (
                      <div>
                        <div className="text-sm text-gray-500">Teléfono</div>
                        <div className="text-gray-900">{reserva.sede.telefono}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resumen de fechas *//*}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Fechas Importantes
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Reserva Creada</div>
                    <div className="text-gray-900">{formatearFecha(reserva.fecha_creacion, 'corto')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Última Actualización</div>
                    <div className="text-gray-900">{formatearFecha(reserva.fecha_actualizacion, 'corto')}</div>
                  </div>
                  {reserva.fecha_cancelacion && (
                    <div>
                      <div className="text-sm text-gray-500">Fecha de Cancelación</div>
                      <div className="text-red-600">{formatearFecha(reserva.fecha_cancelacion, 'corto')}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones *//*}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 transition-all font-medium"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimir Reserva
                  </button>
                  
                  <Link
                    to="/mis-reservas"
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 transition-all font-medium"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Ver Todas las Reservas
                  </Link>

                  <Link
                    to="/tours"
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-700 rounded-xl border border-emerald-200 transition-all font-medium"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Explorar Más Tours
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaDetalleReserva;*/



import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '../../../store';
import { obtenerDetalleReservaPorId, limpiarReservaDetalle } from '../../../store/slices/sliceReserva';
import Cargador from '../../componentes/comunes/Cargador';
import Alerta from '../../componentes/comunes/Alerta';

interface CantidadPasaje {
  cantidad: number;
  nombre_tipo?: string;
  precio_unitario?: number;
  subtotal?: number;
}

interface PaqueteReserva {
  id_paquete: number;
  nombre?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  desglose_pasajes?: {
    tipo: string;
    cantidad: number;
  }[];
}

interface ReservaDetallada {
  id_reserva: number;
  id_cliente: number;
  id_instancia?: number;
  id_sede: number;
  total_pagar: number;
  cantidad_pasajes?: CantidadPasaje[];
  paquetes?: PaqueteReserva[];
  notas?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  estado: EstadoReserva;
  fecha_cancelacion?: string;
  
  // Información del tour
  nombre_tour?: string;
  descripcion_tour?: string;
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  fecha_tour?: string;
  fecha_reserva?: string;
  duracion_tour?: number;
  
  // Información del cliente
  cliente?: {
    nombres: string;
    apellidos: string;
    email: string;
    telefono?: string;
    tipo_documento?: string;
    numero_documento?: string;
  };
  
  // Información de la sede
  sede?: {
    nombre: string;
    direccion?: string;
    telefono?: string;
  };
  
  // Relaciones
  instancia?: {
    id_instancia: number;
    nombre_tour?: string;
    fecha_especifica: string;
    hora_inicio: string;
    hora_fin?: string;
    cupo_disponible: number;
    estado: string;
    punto_encuentro?: string;
    instrucciones?: string;
  };
}

type EstadoReserva = 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE' | 'PROCESADO' | 'ANULADO' | 'RESERVADO';

const PaginaDetalleReserva = () => {
  // Scroll al inicio
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { reservaDetalle, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  
  // Tratar la reserva como ReservaDetallada
  const reserva = reservaDetalle as ReservaDetallada | null;

  // Cargar detalle de la reserva
  useEffect(() => {
    if (id && autenticado) {
      dispatch(obtenerDetalleReservaPorId(parseInt(id)));
    } else if (!autenticado) {
      navigate('/ingresar');
    }
    
    // Limpiar al desmontar
    return () => {
      dispatch(limpiarReservaDetalle());
    };
  }, [id, dispatch, autenticado, navigate]);

  // Función para formatear fechas - CORREGIDA
  const formatearFecha = (fechaStr?: string, formato: 'completo' | 'corto' | 'relativo' = 'completo'): string => {
    if (!fechaStr) return t('reservas.fechaNoDisponible');

    try {
      let fecha: Date;

      // 🔧 CORREGIR: Formato DD/MM/YYYY
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaStr)) {
        const [dia, mes, anio] = fechaStr.split('/').map(Number);
        fecha = new Date(anio, mes - 1, dia); // mes - 1 porque los meses van de 0 a 11
        console.log(`✅ Fecha DD/MM/YYYY procesada: ${fechaStr} -> ${fecha.toISOString()}`);
      } 
      // Formato ISO o YYYY-MM-DD
      else if (fechaStr.includes('T') || fechaStr.includes('Z') || /^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
        fecha = new Date(fechaStr);
        console.log(`✅ Fecha ISO procesada: ${fechaStr} -> ${fecha.toISOString()}`);
      }
      // Otros formatos
      else {
        fecha = new Date(fechaStr);
        console.log(`⚠️ Fecha genérica procesada: ${fechaStr} -> ${fecha.toISOString()}`);
      }

      if (isNaN(fecha.getTime())) {
        console.error(`❌ Fecha inválida: ${fechaStr}`);
        return t('reservas.fechaInvalida');
      }

      const opciones: Intl.DateTimeFormatOptions = {};

      switch (formato) {
        case 'completo':
          opciones.year = 'numeric';
          opciones.month = 'long';
          opciones.day = 'numeric';
          opciones.weekday = 'long';
          break;
        case 'corto':
          opciones.year = 'numeric';
          opciones.month = 'short';
          opciones.day = 'numeric';
          break;
        case 'relativo':
          const ahora = new Date();
          const diferencia = fecha.getTime() - ahora.getTime();
          const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

          if (dias === 0) return t('reservas.hoy');
          if (dias === 1) return t('reservas.manana');
          if (dias === -1) return t('reservas.ayer');
          if (dias > 0 && dias <= 7) return t('reservas.enDias', { dias });
          if (dias < 0 && dias >= -7) return t('reservas.haceDias', { dias: Math.abs(dias) });

          opciones.year = 'numeric';
          opciones.month = 'short';
          opciones.day = 'numeric';
          break;
      }

      return fecha.toLocaleDateString('es-PE', opciones);
    } catch (error) {
      console.error('❌ Error al formatear fecha:', error, 'Fecha original:', fechaStr);
      return t('reservas.fechaInvalida');
    }
  };

  // Función para formatear hora
  const formatearHora = (horaStr?: string): string => {
    if (!horaStr) return '';
    try {
      if (horaStr.includes(':')) {
        const partes = horaStr.split(':');
        return `${partes[0]}:${partes[1]}`;
      }
      return horaStr;
    } catch (error) {
      return horaStr || '';
    }
  };

  // Obtener clase de color según el estado
  const getEstadoClase = (estado: EstadoReserva): string => {
    const clases = {
      'CONFIRMADA': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      'CANCELADA': 'bg-rose-100 text-rose-800 border border-rose-200',
      'PENDIENTE': 'bg-amber-100 text-amber-800 border border-amber-200',
      'PROCESADO': 'bg-blue-100 text-blue-800 border border-blue-200',
      'ANULADO': 'bg-gray-100 text-gray-800 border border-gray-200',
      'RESERVADO': 'bg-sky-100 text-sky-800 border border-sky-200'
    };
    return clases[estado] || clases['RESERVADO'];
  };

  // Obtener icono según el estado
  const getEstadoIcono = (estado: EstadoReserva) => {
    const iconos = {
      'CONFIRMADA': (
        <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'CANCELADA': (
        <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'PENDIENTE': (
        <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'PROCESADO': (
        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      'ANULADO': (
        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      ),
      'RESERVADO': (
        <svg className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    };
    return iconos[estado] || iconos['RESERVADO'];
  };

  // Obtener texto traducido para el estado
  const getEstadoTexto = (estado: EstadoReserva): string => {
    const traducciones = {
      'CONFIRMADA': 'Confirmada',
      'CANCELADA': 'Cancelada',
      'PENDIENTE': 'Pendiente',
      'PROCESADO': 'Procesado',
      'ANULADO': 'Anulado',
      'RESERVADO': 'Reservado'
    };
    return traducciones[estado] || estado;
  };

  // 🔧 CALCULAR TOTAL DE PASAJEROS - CORREGIDO
  const calcularTotalPasajeros = (): number => {
    if (!reserva) return 0;
    
    let totalIndividuales = 0;
    let totalPaquetes = 0;
    
    console.log('🧮 Calculando total de pasajeros...');
    
    // Sumar SOLO pasajeros individuales
    if (reserva.cantidad_pasajes) {
      totalIndividuales = reserva.cantidad_pasajes.reduce((sum, p) => {
        console.log(`👤 Individual: ${p.nombre_tipo} = ${p.cantidad}`);
        return sum + p.cantidad;
      }, 0);
    }
    
    // Sumar pasajeros de paquetes (calculado desde desglose)
    if (reserva.paquetes) {
      reserva.paquetes.forEach((paquete, index) => {
        console.log(`📦 Paquete ${index + 1} (${paquete.cantidad} unidades):`);
        if (paquete.desglose_pasajes) {
          const pasajerosPorPaquete = paquete.desglose_pasajes.reduce((sum, desglose) => {
            console.log(`  - ${desglose.tipo}: ${desglose.cantidad} por paquete`);
            return sum + desglose.cantidad;
          }, 0);
          const totalEstePaquete = pasajerosPorPaquete * paquete.cantidad;
          console.log(`  📊 Total paquete ${index + 1}: ${pasajerosPorPaquete} × ${paquete.cantidad} = ${totalEstePaquete}`);
          totalPaquetes += totalEstePaquete;
        }
      });
    }
    
    const total = totalIndividuales + totalPaquetes;
    console.log(`🎯 TOTAL: ${totalIndividuales} individuales + ${totalPaquetes} en paquetes = ${total}`);
    return total;
  };

  // 🔧 OBTENER DESGLOSE DETALLADO - CORREGIDO
  const getDesglosePasajeros = () => {
    if (!reserva) return {};
    
    const desglose: Record<string, { individuales: number; paquetes: number; total: number }> = {};
    
    console.log('📊 Generando desglose de pasajeros...');
    
    // Procesar pasajeros individuales SOLAMENTE
    if (reserva.cantidad_pasajes) {
      reserva.cantidad_pasajes.forEach(p => {
        const tipo = p.nombre_tipo || 'Pasajero';
        if (!desglose[tipo]) {
          desglose[tipo] = { individuales: 0, paquetes: 0, total: 0 };
        }
        desglose[tipo].individuales += p.cantidad;
        console.log(`👤 ${tipo} individuales: +${p.cantidad} = ${desglose[tipo].individuales}`);
      });
    }
    
    // Procesar pasajeros de paquetes SOLAMENTE
    if (reserva.paquetes) {
      reserva.paquetes.forEach((paquete, paqIndex) => {
        console.log(`📦 Procesando paquete ${paqIndex + 1} (${paquete.cantidad} unidades):`);
        if (paquete.desglose_pasajes) {
          paquete.desglose_pasajes.forEach(desglosePaq => {
            const tipo = desglosePaq.tipo;
            const cantidadTotal = desglosePaq.cantidad * paquete.cantidad;
            
            if (!desglose[tipo]) {
              desglose[tipo] = { individuales: 0, paquetes: 0, total: 0 };
            }
            desglose[tipo].paquetes += cantidadTotal;
            console.log(`  📦 ${tipo} en paquetes: +${cantidadTotal} (${desglosePaq.cantidad} × ${paquete.cantidad}) = ${desglose[tipo].paquetes}`);
          });
        }
      });
    }
    
    // Calcular totales
    Object.keys(desglose).forEach(tipo => {
      desglose[tipo].total = desglose[tipo].individuales + desglose[tipo].paquetes;
      console.log(`🎯 ${tipo} TOTAL: ${desglose[tipo].individuales} individuales + ${desglose[tipo].paquetes} paquetes = ${desglose[tipo].total}`);
    });
    
    return desglose;
  };

  // Estados de carga y error
  if (!autenticado) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Necesitas iniciar sesión</h2>
          <p className="text-gray-600 mb-6">Inicia sesión para ver los detalles de tus reservas</p>
          <Link 
            to="/ingresar" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Cargador tamanio="lg" color="text-blue-600" />
              <p className="mt-4 text-gray-600 text-lg">Cargando detalles de la reserva...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <Alerta mensaje={error || 'No se pudo cargar la reserva'} tipo="error" />
              <div className="text-center mt-6">
                <Link 
                  to="/mis-reservas" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Volver a Mis Reservas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const desglosePasajeros = getDesglosePasajeros();
  const totalPasajeros = calcularTotalPasajeros();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header con navegación */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/mis-reservas')}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 mr-4 transition-all"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Reserva #{reserva.id_reserva}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Creada el {formatearFecha(reserva.fecha_creacion, 'completo')}
                  </p>
                </div>
              </div>

              {/* Estado de la reserva */}
              <div className="flex items-center">
                <span className={`px-6 py-3 inline-flex items-center text-base font-semibold rounded-xl ${getEstadoClase(reserva.estado)} shadow-sm`}>
                  {getEstadoIcono(reserva.estado)}
                  <span className="ml-3">{getEstadoTexto(reserva.estado)}</span>
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Información principal del tour */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              
              {/* Información del Tour */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center border border-sky-200">
                      <svg className="h-10 w-10 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6 flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {reserva.nombre_tour || reserva.instancia?.nombre_tour || 'Tour'}
                    </h2>
                    
                    {reserva.descripcion_tour && (
                      <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                        {reserva.descripcion_tour}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        
                        {/* Fecha del Tour */}
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">Fecha del Tour</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {formatearFecha(reserva.fecha_tour || reserva.instancia?.fecha_especifica, 'completo')}
                            </div>
                            <div className="text-sm text-blue-600">
                              {formatearFecha(reserva.fecha_tour || reserva.instancia?.fecha_especifica, 'relativo')}
                            </div>
                          </div>
                        </div>

                        {/* Horario */}
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mr-4">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">Horario</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {formatearHora(reserva.hora_inicio_tour || reserva.instancia?.hora_inicio)}
                              {(reserva.hora_fin_tour || reserva.instancia?.hora_fin) && (
                                <> - {formatearHora(reserva.hora_fin_tour || reserva.instancia?.hora_fin)}</>
                              )}
                            </div>
                            {reserva.duracion_tour && (
                              <div className="text-sm text-green-600">
                                Duración: {reserva.duracion_tour} horas
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        
                        {/* Total de Pasajeros */}
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mr-4">
                            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">Total de Pasajeros</div>
                            <div className="text-2xl font-bold text-purple-600">
                              {totalPasajeros}
                            </div>
                          </div>
                        </div>

                        {/* Total Pagado */}
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mr-4">
                            <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">Total Pagado</div>
                            <div className="text-2xl font-bold text-emerald-600">
                              S/ {reserva.total_pagar.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🎯 DESGLOSE DETALLADO DE PASAJEROS - COMPLETAMENTE CORREGIDO */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Desglose de Pasajeros
                </h3>

                {/* 📊 RESUMEN POR TIPO DE PASAJERO - CORREGIDO */}
                {Object.keys(desglosePasajeros).length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 text-sm flex items-center justify-center mr-2 font-bold">📊</span>
                      Resumen por Tipo
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(desglosePasajeros).map(([tipo, datos]) => (
                        <div key={tipo} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-3xl font-bold text-blue-700 mb-1">{datos.total}</div>
                              <div className="text-sm font-medium text-blue-600 mb-3">{tipo}</div>
                              
                              {/* 🔍 DESGLOSE DETALLADO */}
                              <div className="space-y-1 text-xs">
                                {datos.paquetes > 0 && (
                                  <div className="flex justify-between items-center bg-white/50 px-2 py-1 rounded">
                                    <span className="text-gray-600">En paquetes:</span>
                                    <span className="font-bold text-emerald-600">{datos.paquetes}</span>
                                  </div>
                                )}
                                {datos.individuales > 0 && (
                                  <div className="flex justify-between items-center bg-white/50 px-2 py-1 rounded">
                                    <span className="text-gray-600">Individuales:</span>
                                    <span className="font-bold text-blue-600">{datos.individuales}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center ml-4">
                              {tipo.toLowerCase().includes('niño') || tipo.toLowerCase().includes('nino') || tipo.toLowerCase().includes('child') ? (
                                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 👤 PASAJEROS INDIVIDUALES */}
                {reserva.cantidad_pasajes && reserva.cantidad_pasajes.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 text-sm flex items-center justify-center mr-2 font-bold">👤</span>
                      Pasajes Individuales ({reserva.cantidad_pasajes.length} tipo{reserva.cantidad_pasajes.length > 1 ? 's' : ''})
                    </h4>
                    <div className="space-y-3">
                      {reserva.cantidad_pasajes.map((pasaje, index) => (
                        <div key={index} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                                <span className="text-blue-600 font-bold">{pasaje.cantidad}</span>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {pasaje.nombre_tipo || 'Pasajero'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Cantidad: {pasaje.cantidad}
                                </div>
                              </div>
                            </div>
                            {pasaje.subtotal && (
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">
                                  S/ {pasaje.subtotal.toFixed(2)}
                                </div>
                                {pasaje.precio_unitario && (
                                  <div className="text-sm text-gray-500">
                                    S/ {pasaje.precio_unitario.toFixed(2)} c/u
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 📦 PAQUETES - COMPLETAMENTE CORREGIDO */}
                {reserva.paquetes && reserva.paquetes.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 text-sm flex items-center justify-center mr-2 font-bold">📦</span>
                      Paquetes Adquiridos ({reserva.paquetes.length} paquete{reserva.paquetes.length > 1 ? 's' : ''})
                    </h4>
                    <div className="space-y-4">
                      {reserva.paquetes.map((paquete, index) => {
                        // Calcular pasajeros por paquete individual
                        const pasajerosPorPaqueteUnitario = paquete.desglose_pasajes ? 
                          paquete.desglose_pasajes.reduce((sum, d) => sum + d.cantidad, 0) : 0;
                        // Total de pasajeros en este tipo de paquete (considerando cantidad)
                        const totalPasajerosTipoPaquete = pasajerosPorPaqueteUnitario * paquete.cantidad;
                        
                        return (
                          <div key={index} className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mr-4">
                                  <span className="text-emerald-600 font-bold">{paquete.cantidad}</span>
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 text-lg">
                                    {paquete.nombre || `Paquete Familiar #${paquete.id_paquete}`}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    <strong>{paquete.cantidad}</strong> paquete{paquete.cantidad > 1 ? 's' : ''} × <strong>{pasajerosPorPaqueteUnitario}</strong> personas/paquete = <strong className="text-emerald-700">{totalPasajerosTipoPaquete} personas</strong>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-emerald-600">
                                  S/ {paquete.subtotal.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  S/ {paquete.precio_unitario.toFixed(2)} c/paquete
                                </div>
                              </div>
                            </div>

                            {/* 🔍 DESGLOSE DEL PAQUETE */}
                            {paquete.desglose_pasajes && paquete.desglose_pasajes.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-emerald-200">
                                <div className="text-sm font-medium text-emerald-700 mb-3 flex items-center">
                                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                  </svg>
                                  Cada paquete incluye:
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                  {paquete.desglose_pasajes.map((desglose, desgloseIndex) => (
                                    <div key={desgloseIndex} className="bg-white rounded-lg p-3 border border-emerald-100">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700 font-medium">
                                          {desglose.tipo}
                                        </span>
                                        <span className="text-emerald-600 font-bold">
                                          {desglose.cantidad}×
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* 📊 TOTAL CALCULADO */}
                                <div className="bg-emerald-100 rounded-lg p-4">
                                  <div className="text-sm text-emerald-800">
                                    <div className="font-bold mb-2 flex items-center">
                                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                      </svg>
                                      Total en {paquete.cantidad} paquete{paquete.cantidad > 1 ? 's' : ''}:
                                    </div>
                                    <div className="space-y-1">
                                      {paquete.desglose_pasajes.map((desglose, idx) => {
                                        const totalTipo = desglose.cantidad * paquete.cantidad;
                                        return (
                                          <div key={idx} className="flex justify-between items-center">
                                            <span>{desglose.tipo}:</span>
                                            <span className="font-bold">
                                              {desglose.cantidad} × {paquete.cantidad} = {totalTipo}
                                            </span>
                                          </div>
                                        );
                                      })}
                                      <div className="border-t border-emerald-200 pt-2 mt-2">
                                        <div className="flex justify-between font-bold text-emerald-900">
                                          <span>Total personas:</span>
                                          <span className="text-lg">{totalPasajerosTipoPaquete}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Información adicional */}
              {(reserva.instancia?.punto_encuentro || reserva.instancia?.instrucciones || reserva.notas) && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Información Adicional
                  </h3>

                  <div className="space-y-6">
                    {reserva.instancia?.punto_encuentro && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Punto de Encuentro
                        </h4>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-gray-700">{reserva.instancia.punto_encuentro}</p>
                        </div>
                      </div>
                    )}

                    {reserva.instancia?.instrucciones && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Instrucciones
                        </h4>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <p className="text-gray-700">{reserva.instancia.instrucciones}</p>
                        </div>
                      </div>
                    )}

                    {reserva.notas && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Notas de la Reserva
                        </h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-gray-700">{reserva.notas}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Panel lateral */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              
              {/* Información del cliente */}
              {reserva.cliente && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Cliente
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Nombre Completo</div>
                      <div className="font-semibold text-gray-900">
                        {reserva.cliente.nombres} {reserva.cliente.apellidos}
                      </div>
                    </div>
                    {reserva.cliente.email && (
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="text-gray-900">{reserva.cliente.email}</div>
                      </div>
                    )}
                    {reserva.cliente.telefono && (
                      <div>
                        <div className="text-sm text-gray-500">Teléfono</div>
                        <div className="text-gray-900">{reserva.cliente.telefono}</div>
                      </div>
                    )}
                    {reserva.cliente.tipo_documento && reserva.cliente.numero_documento && (
                      <div>
                        <div className="text-sm text-gray-500">{reserva.cliente.tipo_documento}</div>
                        <div className="text-gray-900">{reserva.cliente.numero_documento}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Información de la sede */}
              {reserva.sede && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Sede
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Nombre</div>
                      <div className="font-semibold text-gray-900">{reserva.sede.nombre}</div>
                    </div>
                    {reserva.sede.direccion && (
                      <div>
                        <div className="text-sm text-gray-500">Dirección</div>
                        <div className="text-gray-900">{reserva.sede.direccion}</div>
                      </div>
                    )}
                    {reserva.sede.telefono && (
                      <div>
                        <div className="text-sm text-gray-500">Teléfono</div>
                        <div className="text-gray-900">{reserva.sede.telefono}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resumen de fechas */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Fechas Importantes
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Reserva Creada</div>
                    <div className="text-gray-900">{formatearFecha(reserva.fecha_creacion, 'corto')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Última Actualización</div>
                    <div className="text-gray-900">{formatearFecha(reserva.fecha_actualizacion, 'corto')}</div>
                  </div>
                  {reserva.fecha_cancelacion && (
                    <div>
                      <div className="text-sm text-gray-500">Fecha de Cancelación</div>
                      <div className="text-red-600">{formatearFecha(reserva.fecha_cancelacion, 'corto')}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 transition-all font-medium"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimir Reserva
                  </button>
                  
                  <Link
                    to="/mis-reservas"
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 transition-all font-medium"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Ver Todas las Reservas
                  </Link>

                                  <Link
                    to="/tours"
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-700 rounded-xl border border-emerald-200 transition-all font-medium"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Explorar Más Tours
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaDetalleReserva;