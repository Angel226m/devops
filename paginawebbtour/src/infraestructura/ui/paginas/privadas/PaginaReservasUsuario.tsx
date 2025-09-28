 /*
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../store';
import { listarMisReservas } from '../../../store/slices/sliceReserva';
import Cargador from '../../componentes/comunes/Cargador';
import Alerta from '../../componentes/comunes/Alerta';
 
interface CantidadPasaje {
  cantidad: number;
  nombre_tipo?: string;
}

interface ReservaExtendida {
  id_reserva: number;
  id_cliente: number;
  id_instancia?: number;
  id_canal?: number;
  id_sede: number;
  id_vendedor?: number | null;
  total_pagar: number;
  cantidad_pasajes?: CantidadPasaje[];
  paquetes?: any[];
  notas?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  estado: EstadoReserva;
  fecha_cancelacion?: string;
  
  // Campos adicionales que vienen del backend
  nombre_tour?: string;
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  fecha_tour?: string;
  fecha_reserva?: string;
  
  // Relaciones
  instancia?: {
    id_instancia: number;
    id_tour_programado: number;
    nombre_tour?: string;
    fecha_especifica: string;
    hora_inicio: string;
    cupo_disponible: number;
    estado: string;
  };
}

type EstadoReserva = 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE' | 'PROCESADO' | 'ANULADO' | 'RESERVADO';

const PaginaReservasUsuario = () => {
  // Scroll al inicio de la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas: reservasOriginales, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  
  // Tratar las reservas como ReservaExtendida
  const reservas = reservasOriginales as ReservaExtendida[];
  
  // Estado para filtros
  const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | 'TODOS'>('TODOS');

  // Cargar reservas al montar el componente
  useEffect(() => {
    if (autenticado) {
      dispatch(listarMisReservas());
    }
  }, [dispatch, autenticado]);

  // Función mejorada para formatear fechas
  const formatearFecha = (fechaStr?: string, formato: 'completo' | 'corto' | 'relativo' = 'completo'): string => {
    if (!fechaStr) return t('reservas.fechaNoDisponible');

    try {
      let fecha: Date;

      // Manejar formato DD/MM/YYYY
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaStr)) {
        const [dia, mes, anio] = fechaStr.split('/').map(Number);
        fecha = new Date(anio, mes - 1, dia);
      }
      // Manejar formato ISO o YYYY-MM-DD
      else if (fechaStr.includes('T') || fechaStr.includes('Z') || /^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
        fecha = new Date(fechaStr);
      }
      // Otros formatos
      else {
        fecha = new Date(fechaStr);
      }

      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        console.error(`Fecha inválida detectada: ${fechaStr}`);
        return t('reservas.fechaInvalida');
      }

      // Depuración: Mostrar la fecha procesada
      console.log(`Fecha procesada: ${fechaStr} -> ${fecha.toISOString()}`);

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
      console.error('Error al formatear fecha:', error, 'Fecha original:', fechaStr);
      return t('reservas.fechaInvalida');
    }
  };

  // Función para formatear hora
  const formatearHora = (horaStr?: string): string => {
    if (!horaStr) return '';
    
    try {
      // Si viene en formato HH:MM:SS, tomar solo HH:MM
      if (horaStr.includes(':')) {
        const partes = horaStr.split(':');
        return `${partes[0]}:${partes[1]}`;
      }
      return horaStr;
    } catch (error) {
      return horaStr || '';
    }
  };

  // Función para obtener la clase de color según el estado
  const getEstadoClase = (estado: EstadoReserva): string => {
    const clases = {
      'CONFIRMADA': 'bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm',
      'CANCELADA': 'bg-rose-100 text-rose-800 border border-rose-200 shadow-sm',
      'PENDIENTE': 'bg-amber-100 text-amber-800 border border-amber-200 shadow-sm',
      'PROCESADO': 'bg-blue-100 text-blue-800 border border-blue-200 shadow-sm',
      'ANULADO': 'bg-gray-100 text-gray-800 border border-gray-200 shadow-sm',
      'RESERVADO': 'bg-sky-100 text-sky-800 border border-sky-200 shadow-sm'
    };
    return clases[estado] || clases['RESERVADO'];
  };

  // Obtener icono según el estado
  const getEstadoIcono = (estado: EstadoReserva) => {
    const iconos = {
      'CONFIRMADA': (
        <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'CANCELADA': (
        <svg className="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'PENDIENTE': (
        <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'PROCESADO': (
        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      'ANULADO': (
        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      ),
      'RESERVADO': (
        <svg className="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

  // Obtener nombre del tour
  const getNombreTour = (reserva: ReservaExtendida): string => {
    return reserva.nombre_tour || 
           (reserva.instancia && reserva.instancia.nombre_tour) || 
           t('reservas.tourNoEspecificado');
  };

  // Obtener horario del tour
  const getHorarioTour = (reserva: ReservaExtendida): string => {
    const horaInicio = formatearHora(reserva.hora_inicio_tour || (reserva.instancia && reserva.instancia.hora_inicio));
    const horaFin = formatearHora(reserva.hora_fin_tour);
    
    if (horaInicio && horaFin) {
      return `${horaInicio} - ${horaFin}`;
    } else if (horaInicio) {
      return horaInicio;
    }
    
    return t('reservas.horarioNoEspecificado');
  };

  // Obtener total de pasajeros
  const getTotalPasajeros = (reserva: ReservaExtendida): number => {
    if (reserva.cantidad_pasajes && reserva.cantidad_pasajes.length > 0) {
      return reserva.cantidad_pasajes.reduce((total: number, p: CantidadPasaje) => total + p.cantidad, 0);
    }
    return 0;
  };

  // Obtener fecha del tour con validación
  const getFechaTour = (reserva: ReservaExtendida): string => {
    const fecha = reserva.fecha_tour || (reserva.instancia && reserva.instancia.fecha_especifica) || '';
    
    // Depuración: Mostrar qué fecha se está utilizando
    console.log(`getFechaTour - reserva.id_reserva: ${reserva.id_reserva}, fecha_tour: ${reserva.fecha_tour}, instancia.fecha_especifica: ${reserva.instancia?.fecha_especifica}, resultado: ${fecha}`);
    
    if (!fecha) {
      console.warn(`No se encontró fecha válida para la reserva ${reserva.id_reserva}`);
      return '';
    }
    return fecha;
  };

  // Obtener fecha de reserva
  const getFechaReserva = (reserva: ReservaExtendida): string => {
    return reserva.fecha_reserva || reserva.fecha_creacion || '';
  };

  // Aplicar filtros usando useMemo para optimización
  const reservasFiltradas = useMemo(() => {
    if (filtroEstado === 'TODOS') {
      return reservas;
    }
    return reservas.filter(r => r.estado === filtroEstado);
  }, [reservas, filtroEstado]);

  // Estadísticas de reservas
  const estadisticas = useMemo(() => {
    const stats = {
      total: reservas.length,
      confirmadas: reservas.filter(r => r.estado === 'CONFIRMADA').length,
      pendientes: reservas.filter(r => r.estado === 'PENDIENTE').length,
      canceladas: reservas.filter(r => r.estado === 'CANCELADA').length,
      reservadas: reservas.filter(r => r.estado === 'RESERVADO').length,
    };
    return stats;
  }, [reservas]);

  if (!autenticado) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md border border-blue-100 backdrop-blur-sm bg-white/80">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-sky-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('reservas.noSesion')}</h2>
          <p className="text-gray-600 mb-6">{t('reservas.iniciarSesionParaVerReservas')}</p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            {t('auth.iniciarSesion')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado mejorado *//*}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-4 mr-6 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('menu.misReservas')}</h1>
                  <p className="text-gray-600 text-lg">{t('reservas.gestionReservas')}</p>
                </div>
              </div>
              
              {/* Estadísticas rápidas *//*}
              <div className="flex gap-4 flex-wrap">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold text-emerald-700">{estadisticas.confirmadas}</div>
                  <div className="text-xs text-emerald-600">{t('reserva.estados.confirmada')}</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold text-amber-700">{estadisticas.pendientes}</div>
                  <div className="text-xs text-amber-600">{t('reserva.estados.pendiente')}</div>
                </div>
                <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold text-sky-700">{estadisticas.total}</div>
                  <div className="text-xs text-sky-600">{t('reservas.total')}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Alertas y mensajes *//*}
          {error && (
            <div className="mb-6">
              <Alerta 
                mensaje={error} 
                tipo="error" 
              />
            </div>
          )}
          
          {/* Filtros mejorados *//*}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800">
                  {t('reservas.filtrarPorEstado')}
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {[
                  { key: 'TODOS', icon: '📋', gradient: 'from-blue-600 to-cyan-600', bg: 'bg-gray-100', text: 'text-gray-800' },
                  { key: 'CONFIRMADA', icon: '✅', gradient: 'from-emerald-600 to-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-800' },
                  { key: 'RESERVADO', icon: '📅', gradient: 'from-sky-600 to-sky-500', bg: 'bg-sky-50', text: 'text-sky-800' },
                  { key: 'PENDIENTE', icon: '⏳', gradient: 'from-amber-600 to-amber-500', bg: 'bg-amber-50', text: 'text-amber-800' },
                  { key: 'CANCELADA', icon: '❌', gradient: 'from-rose-600 to-rose-500', bg: 'bg-rose-50', text: 'text-rose-800' }
                ].map(({ key, icon, gradient, bg, text }) => (
                  <button
                    key={key}
                    onClick={() => setFiltroEstado(key as EstadoReserva | 'TODOS')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center transform hover:scale-105 ${
                      filtroEstado === key 
                        ? `bg-gradient-to-r ${gradient} text-white shadow-lg` 
                        : `${bg} ${text} hover:shadow-md border border-current border-opacity-20`
                    }`}
                  >
                    <span className="mr-2">{icon}</span>
                    {key === 'TODOS' ? t('reservas.todos') : t(`reserva.estados.${key.toLowerCase()}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Lista de reservas *//*}
          {cargando ? (
            <div className="flex justify-center items-center h-64 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100">
              <Cargador tamanio="lg" color="text-blue-600" />
            </div>
          ) : reservasFiltradas.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-blue-100">
              <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center rounded-full bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {filtroEstado === 'TODOS' 
                  ? t('reservas.sinReservas') 
                  : t('reservas.sinReservasEstado', { estado: getEstadoTexto(filtroEstado) })}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8 text-lg">
                {t('reservas.explorarTours')}
              </p>
              <Link 
                to="/tours" 
                className="inline-flex items-center px-8 py-4 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('reservas.verTours')}
              </Link>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <tr>
                      {[
                        { key: 'tour', icon: '🏝️' },
                        { key: 'fecha', icon: '📅' },
                        { key: 'pasajeros', icon: '👥' },
                        { key: 'total', icon: '💰' },
                        { key: 'estado', icon: '📊' },
                        { key: 'acciones', icon: '⚙️' }
                      ].map(({ key, icon }) => (
                        <th key={key} scope="col" className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center">
                            <span className="mr-2">{icon}</span>
                            {t(`reservas.${key}`)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {reservasFiltradas.map(reserva => (
                      <tr key={reserva.id_reserva} className="hover:bg-blue-50 transition-colors duration-200">
                        {/* Tour *//*}
                        <td className="px-6 py-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center border border-sky-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="font-semibold text-gray-900 text-lg">{getNombreTour(reserva)}</div>
                              <div className="text-sm text-gray-600 flex items-center mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {getHorarioTour(reserva)}
                              </div>
                              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg mt-2 inline-block">
                                #{reserva.id_reserva}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Fecha *//*}
                        <td className="px-6 py-6">
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatearFecha(getFechaTour(reserva), 'completo')}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {t('reservas.reservadoEl')} {formatearFecha(getFechaReserva(reserva), 'corto')}
                            </div>
                            <div className="text-xs text-blue-600">
                              {formatearFecha(getFechaTour(reserva), 'relativo')}
                            </div>
                          </div>
                        </td>
                        
                        {/* Pasajeros *//*}
                        <td className="px-6 py-6">
                          <div className="text-center">
                            <span className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border border-blue-200 font-semibold">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {getTotalPasajeros(reserva)}
                            </span>
                          </div>
                        </td>
                        
                        {/* Total *//*}
                        <td className="px-6 py-6">
                          <div className="text-center">
                            <span className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border border-emerald-200 font-bold text-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              S/ {reserva.total_pagar.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        
                        {/* Estado *//*}
                        <td className="px-6 py-6">
                          <span className={`px-4 py-2 inline-flex items-center text-sm leading-5 font-semibold rounded-xl ${getEstadoClase(reserva.estado)}`}>
                            {getEstadoIcono(reserva.estado)}
                            <span className="ml-2">{getEstadoTexto(reserva.estado)}</span>
                          </span>
                        </td>
                        
                        {/* Acciones *//*}
                        <td className="px-6 py-6 text-right">
                          <Link 
                            to={`/reservas/${reserva.id_reserva}`} 
                            className="inline-flex items-center px-5 py-3 text-blue-600 hover:text-blue-800 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-all duration-200 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md font-medium transform hover:scale-105"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {t('reservas.verDetalles')}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginaReservasUsuario;*/ import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../store';
import { listarMisReservas } from '../../../store/slices/sliceReserva';
import Cargador from '../../componentes/comunes/Cargador';
import Alerta from '../../componentes/comunes/Alerta';

interface CantidadPasaje {
  cantidad: number;
  nombre_tipo?: string;
}

interface Paquete {
  nombre_paquete: string;
  cantidad: number;
  cantidad_total: number;
}

interface ReservaExtendida {
  id_reserva: number;
  id_cliente: number;
  id_instancia?: number;
  id_canal?: number;
  id_sede: number;
  id_vendedor?: number | null;
  total_pagar: number;
  cantidad_pasajes?: CantidadPasaje[];
  paquetes?: Paquete[];
  notas?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  estado: EstadoReserva;
  fecha_cancelacion?: string;
  nombre_tour?: string;
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  fecha_tour?: string;
  fecha_reserva?: string;
  instancia?: {
    id_instancia: number;
    id_tour_programado: number;
    nombre_tour?: string;
    fecha_especifica: string;
    hora_inicio: string;
    cupo_disponible: number;
    estado: string;
  };
}

type EstadoReserva = 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE' | 'PROCESADO' | 'ANULADO' | 'RESERVADO';

const PaginaReservasUsuario = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas: reservasOriginales, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  
  const reservas = reservasOriginales as ReservaExtendida[];
  const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | 'TODOS'>('TODOS');

  useEffect(() => {
    if (autenticado) {
      dispatch(listarMisReservas());
    }
  }, [dispatch, autenticado]);

  const formatearFecha = (fechaStr?: string, formato: 'completo' | 'corto' | 'relativo' = 'completo'): string => {
    if (!fechaStr) return t('reservas.fechaNoDisponible');
    try {
      let fecha: Date;
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaStr)) {
        const [dia, mes, anio] = fechaStr.split('/').map(Number);
        fecha = new Date(anio, mes - 1, dia);
      } else if (fechaStr.includes('T') || fechaStr.includes('Z') || /^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
        fecha = new Date(fechaStr);
      } else {
        fecha = new Date(fechaStr);
      }
      if (isNaN(fecha.getTime())) {
        console.error(`Fecha inválida detectada: ${fechaStr}`);
        return t('reservas.fechaInvalida');
      }
      console.log(`Fecha procesada: ${fechaStr} -> ${fecha.toISOString()}`);
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
      console.error('Error al formatear fecha:', error, 'Fecha original:', fechaStr);
      return t('reservas.fechaInvalida');
    }
  };

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

  const getEstadoClase = (estado: EstadoReserva): string => {
    const clases = {
      'CONFIRMADA': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'CANCELADA': 'bg-rose-50 text-rose-700 border-rose-100',
      'PENDIENTE': 'bg-amber-50 text-amber-700 border-amber-100',
      'PROCESADO': 'bg-blue-50 text-blue-700 border-blue-100',
      'ANULADO': 'bg-gray-50 text-gray-700 border-gray-100',
      'RESERVADO': 'bg-sky-50 text-sky-700 border-sky-100'
    };
    return clases[estado] || clases['RESERVADO'];
  };

  const getEstadoIcono = (estado: EstadoReserva) => {
    const iconos = {
      'CONFIRMADA': (
        <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'CANCELADA': (
        <svg className="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'PENDIENTE': (
        <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'PROCESADO': (
        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      'ANULADO': (
        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      ),
      'RESERVADO': (
        <svg className="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    };
    return iconos[estado] || iconos['RESERVADO'];
  };

  const getEstadoTexto = (estado: EstadoReserva): string => {
    return t(`reserva.estados.${estado.toLowerCase()}`);
  };

  const getNombreTour = (reserva: ReservaExtendida): string => {
    return reserva.nombre_tour || 
           (reserva.instancia && reserva.instancia.nombre_tour) || 
           t('reservas.tourNoEspecificado');
  };

  const getHorarioTour = (reserva: ReservaExtendida): string => {
    const horaInicio = formatearHora(reserva.hora_inicio_tour || (reserva.instancia && reserva.instancia.hora_inicio));
    const horaFin = formatearHora(reserva.hora_fin_tour);
    if (horaInicio && horaFin) {
      return `${horaInicio} - ${horaFin}`;
    } else if (horaInicio) {
      return horaInicio;
    }
    return t('reservas.horarioNoEspecificado');
  };

  const getTotalPasajeros = (reserva: ReservaExtendida): { total: number; detalle: string } => {
    let total = 0;
    const detalles: string[] = [];

    if (reserva.cantidad_pasajes && reserva.cantidad_pasajes.length > 0) {
      const totalPasajes = reserva.cantidad_pasajes.reduce((sum, p) => sum + p.cantidad, 0);
      total += totalPasajes;
      const pasajesTexto = reserva.cantidad_pasajes
        .map(p => `${p.cantidad} ${p.nombre_tipo || 'Pasajero'}`)
        .join(', ');
      if (pasajesTexto) detalles.push(`Pasajes: ${pasajesTexto}`);
    }

    if (reserva.paquetes && reserva.paquetes.length > 0) {
      const totalPaquetes = reserva.paquetes.reduce((sum, p) => sum + (p.cantidad_total || 0), 0);
      total += totalPaquetes;
      const paquetesTexto = reserva.paquetes
        .map(p => `${p.cantidad} ${p.nombre_paquete} (${p.cantidad_total} pers.)`)
        .join(', ');
      if (paquetesTexto) detalles.push(`Paquetes: ${paquetesTexto}`);
    }

    let tipo = '';
    if (reserva.cantidad_pasajes?.length && reserva.paquetes?.length) {
      tipo = 'Pasajes y Paquetes';
    } else if (reserva.cantidad_pasajes?.length) {
      tipo = 'Pasajes';
    } else if (reserva.paquetes?.length) {
      tipo = 'Paquetes';
    }

    const detalle = detalles.length > 0 ? `${tipo} (${detalles.join('; ')})` : 'Sin pasajeros';
    return { total, detalle };
  };

  const getFechaTour = (reserva: ReservaExtendida): string => {
    const fecha = reserva.fecha_tour || (reserva.instancia && reserva.instancia.fecha_especifica) || '';
    console.log(`getFechaTour - reserva.id_reserva: ${reserva.id_reserva}, fecha_tour: ${reserva.fecha_tour}, instancia.fecha_especifica: ${reserva.instancia?.fecha_especifica}, resultado: ${fecha}`);
    if (!fecha) {
      console.warn(`No se encontró fecha válida para la reserva ${reserva.id_reserva}`);
      return '';
    }
    return fecha;
  };

  const getFechaReserva = (reserva: ReservaExtendida): string => {
    return reserva.fecha_reserva || reserva.fecha_creacion || '';
  };

  const reservasFiltradas = useMemo(() => {
    if (filtroEstado === 'TODOS') {
      return reservas;
    }
    return reservas.filter(r => r.estado === filtroEstado);
  }, [reservas, filtroEstado]);

  const estadisticas = useMemo(() => {
    return {
      total: reservas.length,
      confirmadas: reservas.filter(r => r.estado === 'CONFIRMADA').length,
      pendientes: reservas.filter(r => r.estado === 'PENDIENTE').length,
      canceladas: reservas.filter(r => r.estado === 'CANCELADA').length,
      reservadas: reservas.filter(r => r.estado === 'RESERVADO').length,
    };
  }, [reservas]);

  if (!autenticado) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <div className="text-center bg-white p-12 rounded-3xl shadow-2xl max-w-md border border-indigo-100 backdrop-blur-lg bg-white/95">
          <div className="w-24 h-24 mx-auto mb-8 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 border border-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">{t('reservas.noSesion')}</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">{t('reservas.iniciarSesionParaVerReservas')}</p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-4 rounded-2xl shadow-md text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            {t('auth.iniciarSesion')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-indigo-100/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{t('menu.misReservas')}</h1>
                <p className="mt-2 text-lg text-gray-600 leading-relaxed">{t('reservas.gestionReservas')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              {[
                { label: t('reserva.estados.confirmada'), value: estadisticas.confirmadas, color: 'emerald', icon: '✅' },
                { label: t('reserva.estados.pendiente'), value: estadisticas.pendientes, color: 'amber', icon: '⏳' },
                { label: t('reserva.estados.reservado'), value: estadisticas.reservadas, color: 'sky', icon: '📅' },
                { label: t('reservas.total'), value: estadisticas.total, color: 'blue', icon: '📋' }
              ].map((stat, index) => (
                <div key={index} className={`rounded-2xl p-4 bg-${stat.color}-50 border border-${stat.color}-100 text-center transition-all duration-300 hover:shadow-md`}>
                  <div className="text-3xl font-bold text-${stat.color}-700">{stat.value}</div>
                  <div className="text-sm text-${stat.color}-600 flex items-center justify-center gap-1 mt-1">
                    <span>{stat.icon}</span>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-indigo-100/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">{t('reservas.filtrarPorEstado')}</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'TODOS', icon: '📋', gradient: 'indigo-600 blue-600', bg: 'gray-50', text: 'gray-700' },
                { key: 'CONFIRMADA', icon: '✅', gradient: 'emerald-600 emerald-500', bg: 'emerald-50', text: 'emerald-700' },
                { key: 'RESERVADO', icon: '📅', gradient: 'sky-600 sky-500', bg: 'sky-50', text: 'sky-700' },
                { key: 'PENDIENTE', icon: '⏳', gradient: 'amber-600 amber-500', bg: 'amber-50', text: 'amber-700' },
                { key: 'CANCELADA', icon: '❌', gradient: 'rose-600 rose-500', bg: 'rose-50', text: 'rose-700' }
              ].map(({ key, icon, gradient, bg, text }) => (
                <button
                  key={key}
                  onClick={() => setFiltroEstado(key as EstadoReserva | 'TODOS')}
                  className={`px-6 py-3 rounded-2xl text-base font-medium transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105 ${
                    filtroEstado === key 
                      ? `bg-gradient-to-r from-${gradient.split(' ')[0]} to-${gradient.split(' ')[1]} text-white` 
                      : `bg-${bg} text-${text} border border-${text.split('-')[0]}-100`
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                  {key === 'TODOS' ? t('reservas.todos') : t(`reserva.estados.${key.toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de reservas */}
        {cargando ? (
          <div className="flex justify-center items-center h-96 bg-white rounded-3xl shadow-xl border border-indigo-100/50 backdrop-blur-sm">
            <Cargador tamanio="lg" color="text-indigo-600" />
          </div>
        ) : reservasFiltradas.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-indigo-100/50 backdrop-blur-sm">
            <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              {filtroEstado === 'TODOS' 
                ? t('reservas.sinReservas') 
                : t('reservas.sinReservasEstado', { estado: getEstadoTexto(filtroEstado) })}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8 text-lg leading-relaxed">{t('reservas.explorarTours')}</p>
            <Link 
              to="/tours" 
              className="inline-flex items-center px-8 py-4 rounded-2xl shadow-md text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('reservas.verTours')}
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100/50 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
                  <tr>
                    {[
                      { key: 'tour', icon: '🏝️' },
                      { key: 'fecha', icon: '📅' },
                      { key: 'pasajeros', icon: '👥' },
                      { key: 'total', icon: '💰' },
                      { key: 'estado', icon: '📊' },
                      { key: 'acciones', icon: '⚙️' }
                    ].map(({ key, icon }) => (
                      <th key={key} scope="col" className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{icon}</span>
                          {t(`reservas.${key}`)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reservasFiltradas.map(reserva => {
                    const { total, detalle } = getTotalPasajeros(reserva);
                    return (
                      <tr key={reserva.id_reserva} className="hover:bg-indigo-50/50 transition-colors duration-300">
                        {/* Tour */}
                        <td className="px-8 py-6">
                          <div className="flex items-start gap-5">
                            <div className="flex-shrink-0">
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center border border-indigo-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-xl tracking-tight">{getNombreTour(reserva)}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {getHorarioTour(reserva)}
                              </div>
                              <div className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mt-3 inline-flex items-center">
                                # {reserva.id_reserva}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Fecha */}
                        <td className="px-8 py-6">
                          <div className="space-y-2">
                            <div className="text-base font-semibold text-gray-900 tracking-tight">
                              {formatearFecha(getFechaTour(reserva), 'completo')}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {t('reservas.reservadoEl')} {formatearFecha(getFechaReserva(reserva), 'corto')}
                            </div>
                            <div className="text-sm text-indigo-600 font-medium">
                              {formatearFecha(getFechaTour(reserva), 'relativo')}
                            </div>
                          </div>
                        </td>
                        {/* Pasajeros */}
                        <td className="px-8 py-6">
                          <div className="group relative inline-block">
                            <span className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-100 font-semibold text-base shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {total}
                            </span>
                            <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-xl shadow-2xl p-4 text-sm text-gray-700 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gray-100 pointer-events-none">
                              <p className="font-semibold mb-2 text-gray-900">Detalles de Pasajeros:</p>
                              {detalle}
                            </div>
                          </div>
                        </td>
                        {/* Total */}
                        <td className="px-8 py-6">
                          <div className="text-center">
                            <span className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-100 font-bold text-base shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              S/ {reserva.total_pagar.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        {/* Estado */}
                        <td className="px-8 py-6">
                          <span className={`px-5 py-2.5 inline-flex items-center text-base font-medium rounded-xl ${getEstadoClase(reserva.estado)} shadow-sm`}>
                            {getEstadoIcono(reserva.estado)}
                            <span className="ml-2">{getEstadoTexto(reserva.estado)}</span>
                          </span>
                        </td>
                        {/* Acciones */}
                        <td className="px-8 py-6 text-right">
                          <Link
                            to={`/reservas/${reserva.id_reserva}`}
                            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {t('reservas.verDetalles')}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaReservasUsuario;