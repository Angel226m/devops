 /*

import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [renderKey, setRenderKey] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modalReserva, setModalReserva] = useState<ReservaExtendida | null>(null);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas: reservasOriginales, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  const reservas = reservasOriginales as ReservaExtendida[];
  const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | 'TODOS'>('TODOS');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (autenticado) {
      dispatch(listarMisReservas())
        .unwrap()
        .then(() => setRenderKey(prev => prev + 1))
        .catch((err) => console.error("❌ Error al cargar reservas:", err));
    }
    // Detectar modo oscuro del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener('change', (e) => setIsDarkMode(e.matches));
    return () => mediaQuery.removeEventListener('change', () => {});
  }, [dispatch, autenticado]);

  const formatearFecha = (fechaStr?: string): string => {
    if (!fechaStr) return 'N/A';
    if (fechaStr.includes('/')) {
      const [day, month, year] = fechaStr.split('/');
      const fecha = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });
      }
    }
    const fecha = new Date(fechaStr);
    return isNaN(fecha.getTime()) ? 'Fecha inválida' : fecha.toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatearHora = (horaStr?: string): string => horaStr?.split(':').slice(0, 2).join(':') || 'N/A';

  const getEstadoClase = (estado: EstadoReserva): string => ({
    'CONFIRMADA': 'bg-green-100 text-green-800 border-green-200',
    'CANCELADA': 'bg-red-100 text-red-800 border-red-200',
    'PENDIENTE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'PROCESADO': 'bg-blue-100 text-blue-800 border-blue-200',
    'ANULADO': 'bg-gray-100 text-gray-800 border-gray-200',
    'RESERVADO': 'bg-purple-100 text-purple-800 border-purple-200',
  })[estado] || 'bg-gray-100 text-gray-800 border-gray-200';

  const getEstadoIcono = (estado: EstadoReserva) => ({
    'CONFIRMADA': '✅',
    'CANCELADA': '❌',
    'PENDIENTE': '⏳',
    'PROCESADO': '✅',
    'ANULADO': '❌',
    'RESERVADO': '📅',
  })[estado] || '📅';

  const getEstadoTexto = (estado: EstadoReserva): string => ({
    'CONFIRMADA': 'Confirmada',
    'CANCELADA': 'Cancelada',
    'PENDIENTE': 'Pendiente',
    'PROCESADO': 'Procesado',
    'ANULADO': 'Anulado',
    'RESERVADO': 'Reservado'
  })[estado] || estado;

  const getNombreTour = (reserva: ReservaExtendida): string => 
    reserva.nombre_tour || reserva.instancia?.nombre_tour || 'Tour no especificado';

  const getHorarioTour = (reserva: ReservaExtendida): string => {
    const horaInicio = formatearHora(reserva.hora_inicio_tour || reserva.instancia?.hora_inicio);
    const horaFin = formatearHora(reserva.hora_fin_tour);
    return horaInicio && horaFin ? `${horaInicio} - ${horaFin}` : horaInicio || 'N/A';
  };

  const getTotalPasajeros = (reserva: ReservaExtendida): { total: number; detalle: string } => {
    let total = 0;
    const detalles: string[] = [];
    
    if (reserva.cantidad_pasajes?.length) {
      const totalPasajes = reserva.cantidad_pasajes.reduce((sum, p) => sum + p.cantidad, 0);
      total += totalPasajes;
      detalles.push(`${reserva.cantidad_pasajes.map(p => `${p.cantidad} ${p.nombre_tipo || 'Pasajero'}`).join(', ')}`);
    }
    
    if (reserva.paquetes?.length) {
      const totalPaquetes = reserva.paquetes.reduce((sum, p) => sum + (p.cantidad_total || p.cantidad * 2), 0); // Asumimos 2 pasajeros por paquete si cantidad_total no está definido
      total += totalPaquetes;
      detalles.push(`${reserva.paquetes.map(p => `${p.cantidad} ${p.nombre_paquete} (${p.cantidad_total || p.cantidad * 2} pasajeros)`).join(', ')}`);
    }
    
    return { total, detalle: detalles.length ? detalles.join(' | ') : 'Sin detalle' };
  };

  const getFechaTour = (reserva: ReservaExtendida): string => 
    reserva.fecha_tour || reserva.instancia?.fecha_especifica || 'N/A';

  const getFechaReserva = (reserva: ReservaExtendida): string => 
    reserva.fecha_reserva || reserva.fecha_creacion || 'N/A';

  const reservasFiltradas = useMemo(() => {
    if (!Array.isArray(reservas)) return [];
    return filtroEstado === 'TODOS' ? reservas : reservas.filter(r => r.estado === filtroEstado);
  }, [reservas, filtroEstado, renderKey]);

  const estadisticas = useMemo(() => {
    if (!Array.isArray(reservas)) {
      return { total: 0, confirmadas: 0, pendientes: 0, canceladas: 0, reservadas: 0 };
    }
    return {
      total: reservas.length,
      confirmadas: reservas.filter(r => r.estado === 'CONFIRMADA').length,
      pendientes: reservas.filter(r => r.estado === 'PENDIENTE').length,
      canceladas: reservas.filter(r => r.estado === 'CANCELADA').length,
      reservadas: reservas.filter(r => r.estado === 'RESERVADO').length,
    };
  }, [reservas, renderKey]);

  if (!autenticado) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}
      >
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-3xl shadow-2xl p-8 max-w-md w-full text-center`}>
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-3">Sesión requerida</h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Inicia sesión para ver tus reservas</p>
          <Link 
            to="/ingresar" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md"
          >
            Iniciar Sesión
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      key={renderKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Toggle modo oscuro *//*}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-600'} transition-all duration-300`}
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Header *//*}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-3xl shadow-xl p-6 mb-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl">📋</div>
              <div>
                <h1 className="text-3xl font-bold">Mis Reservas</h1>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} text-sm`}>Planifica tus aventuras con estilo</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
              {[
                { label: 'Confirmadas', count: estadisticas.confirmadas, color: 'bg-green-100 border-green-200 text-green-700', dark: 'bg-green-900 border-green-700 text-green-200' },
                { label: 'Pendientes', count: estadisticas.pendientes, color: 'bg-yellow-100 border-yellow-200 text-yellow-700', dark: 'bg-yellow-900 border-yellow-700 text-yellow-200' },
                { label: 'Reservadas', count: estadisticas.reservadas, color: 'bg-purple-100 border-purple-200 text-purple-700', dark: 'bg-purple-900 border-purple-700 text-purple-200' },
                { label: 'Total', count: estadisticas.total, color: 'bg-blue-100 border-blue-200 text-blue-700', dark: 'bg-blue-900 border-blue-700 text-blue-200' },
              ].map((stat) => (
                <div key={stat.label} className={`p-4 rounded-lg ${isDarkMode ? stat.dark : stat.color} text-center border transition-all duration-300`}>
                  <div className="text-lg font-bold">{stat.count}</div>
                  <div className="text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filtros *//*}
          <div className="flex flex-wrap gap-2">
            {['TODOS', 'CONFIRMADA', 'RESERVADO', 'PENDIENTE', 'CANCELADA'].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado as EstadoReserva | 'TODOS')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                  filtroEstado === estado
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={`Filtrar por ${estado}`}
              >
                {estado} ({estado === 'TODOS' ? estadisticas.total : 
                 estado === 'CONFIRMADA' ? estadisticas.confirmadas :
                 estado === 'PENDIENTE' ? estadisticas.pendientes :
                 estado === 'CANCELADA' ? estadisticas.canceladas :
                 estado === 'RESERVADO' ? estadisticas.reservadas : 0})
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {estado}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error *//*}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isDarkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg mb-6`}
          >
            <div className="flex items-center gap-2">
              <span>❌</span>
              <strong>Error:</strong> {error}
              <button 
                onClick={() => dispatch(listarMisReservas())}
                className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-all duration-300"
              >
                Reintentar
              </button>
            </div>
          </motion.div>
        )}

        {/* Contenido principal *//*}
        {cargando ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-3xl shadow-xl p-8`}
          >
            <div className="space-y-4">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-4 bg-gray-300 rounded col-span-2"></div>
                      <div className="h-4 bg-gray-300 rounded col-span-1"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="text-center text-gray-500">Cargando tus reservas...</div>
            </div>
          </motion.div>
        ) : !Array.isArray(reservasFiltradas) || reservasFiltradas.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-3xl shadow-xl p-8 text-center`}
          >
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold mb-3">
              {filtroEstado === 'TODOS' ? 'No tienes reservas aún' : `No tienes reservas ${getEstadoTexto(filtroEstado).toLowerCase()}`}
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>¡Explora nuestros tours y comienza tu aventura!</p>
            <Link 
              to="/tours" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md"
            >
              <span className="mr-2">🌍</span>
              Explorar Tours
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl overflow-hidden`}
          >
            {/* Vista de tabla para pantallas grandes *//*}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Tour</th>
                    <th className={`px-6 py-4 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Fecha</th>
                    <th className={`px-6 py-4 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Pasajeros</th>
                    <th className={`px-6 py-4 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Total</th>
                    <th className={`px-6 py-4 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Estado</th>
                    <th className={`px-6 py-4 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Acciones</th>
                  </tr>
                </thead>
                <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                  {reservasFiltradas.map((reserva, index) => {
                    const { total, detalle } = getTotalPasajeros(reserva);
                    return (
                      <motion.tr 
                        key={`${reserva.id_reserva}-${renderKey}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={index % 2 === 0 ? (isDarkMode ? 'bg-gray-800' : 'bg-white') : (isDarkMode ? 'bg-gray-900' : 'bg-gray-50')}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">🌍</div>
                            <div>
                              <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{getNombreTour(reserva)}</div>
                              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{getHorarioTour(reserva)}</div>
                              <div className="text-xs text-indigo-400 font-semibold">#{reserva.id_reserva}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            <div className="font-medium">{formatearFecha(getFechaTour(reserva))}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-indigo-400 font-medium">{total} pasajeros</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{detalle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>S/ {reserva.total_pagar.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEstadoClase(reserva.estado)}`}>
                            <span className="mr-1">{getEstadoIcono(reserva.estado)}</span>
                            {getEstadoTexto(reserva.estado)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/reservas/${reserva.id_reserva}`}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-sm"
                          >
                            <span className="mr-1">👁️</span>
                            Ver Detalle
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Vista de tarjetas para pantallas pequeñas *//*}
            <div className="md:hidden space-y-4 p-4">
              {reservasFiltradas.map((reserva, index) => {
                const { total, detalle } = getTotalPasajeros(reserva);
                return (
                  <motion.div 
                    key={`${reserva.id_reserva}-${renderKey}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-lg p-4 shadow-md border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'}`}
                    onClick={() => setModalReserva(reserva)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🌍</div>
                        <div>
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{getNombreTour(reserva)}</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{getHorarioTour(reserva)}</div>
                          <div className="text-xs text-indigo-400 font-semibold">#{reserva.id_reserva}</div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEstadoClase(reserva.estado)}`}>
                        <span className="mr-1">{getEstadoIcono(reserva.estado)}</span>
                        {getEstadoTexto(reserva.estado)}
                      </span>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fecha: {formatearFecha(getFechaTour(reserva))}</div>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="text-indigo-400 font-medium">{total} pasajeros</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{detalle}</div>
                    </div>
                    <div className={`mt-2 text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>S/ {reserva.total_pagar.toFixed(2)}</div>
                    <Link
                      to={`/reservas/${reserva.id_reserva}`}
                      className="mt-3 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 w-full justify-center shadow-sm"
                    >
                      <span className="mr-1">👁️</span>
                      Ver Detalle
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Modal de vista previa *//*}
            <AnimatePresence>
              {modalReserva && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setModalReserva(null)}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-2xl p-6 max-w-md w-full`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-bold mb-4">{getNombreTour(modalReserva)}</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>ID: #{modalReserva.id_reserva}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Fecha: {formatearFecha(getFechaTour(modalReserva))}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Horario: {getHorarioTour(modalReserva)}</p>
                    <p className="text-sm text-indigo-400 font-medium">{getTotalPasajeros(modalReserva).total} pasajeros</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{getTotalPasajeros(modalReserva).detalle}</p>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>S/ {modalReserva.total_pagar.toFixed(2)}</p>
                    <p className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEstadoClase(modalReserva.estado)} mt-2`}>
                      <span className="mr-1">{getEstadoIcono(modalReserva.estado)}</span>
                      {getEstadoTexto(modalReserva.estado)}
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => setModalReserva(null)}
                        className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-all duration-300`}
                      >
                        Cerrar
                      </button>
                      <Link
                        to={`/reservas/${modalReserva.id_reserva}`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                      >
                        Ver Detalle
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer *//*}
            <div className={`px-6 py-3 text-sm text-center ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
              Mostrando {reservasFiltradas.length} de {estadisticas.total} reservas
            </div>
          </motion.div>
        )}

        {/* Debug info *//*}
        {import.meta.env.DEV && (
          <details className="mt-6">
            <summary className={`cursor-pointer p-3 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
              🔍 Información de Debug
            </summary>
            <div className={`mt-2 p-4 rounded-lg text-xs ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Estado:</h4>
                  <div>Render Key: {renderKey}</div>
                  <div>Autenticado: {autenticado ? '✅' : '❌'}</div>
                  <div>Cargando: {cargando ? '⏳' : '✅'}</div>
                  <div>Error: {error || '✅ Ninguno'}</div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Datos:</h4>
                  <div>Reservas: {reservas?.length || 0}</div>
                  <div>Filtradas: {reservasFiltradas?.length || 0}</div>
                  <div>Filtro: {filtroEstado}</div>
                  <div>Modo Oscuro: {isDarkMode ? '🌙 Activado' : '☀️ Desactivado'}</div>
                </div>
              </div>
            </div>
          </details>
        )}
      </div>
    </motion.div>
  );
};

export default PaginaReservasUsuario;*/

import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [renderKey, setRenderKey] = useState(0);
  const [modalReserva, setModalReserva] = useState<ReservaExtendida | null>(null);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas: reservasOriginales, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  const reservas = reservasOriginales as ReservaExtendida[];
  const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | 'TODOS'>('TODOS');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (autenticado) {
      dispatch(listarMisReservas())
        .unwrap()
        .then(() => setRenderKey(prev => prev + 1))
        .catch((err) => console.error("❌ Error al cargar reservas:", err));
    }
  }, [dispatch, autenticado]);

  const formatearFecha = (fechaStr?: string): string => {
    if (!fechaStr) return 'N/A';
    if (fechaStr.includes('/')) {
      const [day, month, year] = fechaStr.split('/');
      const fecha = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });
      }
    }
    const fecha = new Date(fechaStr);
    return isNaN(fecha.getTime()) ? 'Fecha inválida' : fecha.toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatearHora = (horaStr?: string): string => horaStr?.split(':').slice(0, 2).join(':') || 'N/A';

  const getEstadoClase = (estado: EstadoReserva): string => ({
    'CONFIRMADA': 'bg-green-100 text-green-700 border-green-200',
    'CANCELADA': 'bg-red-100 text-red-700 border-red-200',
    'PENDIENTE': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'PROCESADO': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'ANULADO': 'bg-gray-100 text-gray-700 border-gray-200',
    'RESERVADO': 'bg-purple-100 text-purple-700 border-purple-200',
  })[estado] || 'bg-gray-100 text-gray-700 border-gray-200';

  const getEstadoTexto = (estado: EstadoReserva): string => ({
    'CONFIRMADA': 'Confirmada',
    'CANCELADA': 'Cancelada',
    'PENDIENTE': 'Pendiente',
    'PROCESADO': 'Procesado',
    'ANULADO': 'Anulado',
    'RESERVADO': 'Reservado'
  })[estado] || estado;

  const getNombreTour = (reserva: ReservaExtendida): string => 
    reserva.nombre_tour || reserva.instancia?.nombre_tour || 'Tour no especificado';

  const getHorarioTour = (reserva: ReservaExtendida): string => {
    const horaInicio = formatearHora(reserva.hora_inicio_tour || reserva.instancia?.hora_inicio);
    const horaFin = formatearHora(reserva.hora_fin_tour);
    return horaInicio && horaFin ? `${horaInicio} - ${horaFin}` : horaInicio || 'N/A';
  };

  const getTotalPasajeros = (reserva: ReservaExtendida): { total: number; detalle: string } => {
    let total = 0;
    const detalles: string[] = [];
    
    if (reserva.cantidad_pasajes?.length) {
      const totalPasajes = reserva.cantidad_pasajes.reduce((sum, p) => sum + p.cantidad, 0);
      total += totalPasajes;
      detalles.push(`${reserva.cantidad_pasajes.map(p => `${p.cantidad} ${p.nombre_tipo || 'Pasajero'}`).join(', ')}`);
    }
    
    if (reserva.paquetes?.length) {
      const totalPaquetes = reserva.paquetes.reduce((sum, p) => sum + (p.cantidad_total || p.cantidad * 2), 0);
      total += totalPaquetes;
      detalles.push(`${reserva.paquetes.map(p => `${p.cantidad} ${p.nombre_paquete} (${p.cantidad_total || p.cantidad * 2} pasajeros)`).join(', ')}`);
    }
    
    return { total, detalle: detalles.length ? detalles.join(' | ') : 'Sin detalle' };
  };

  const getFechaTour = (reserva: ReservaExtendida): string => 
    reserva.fecha_tour || reserva.instancia?.fecha_especifica || 'N/A';

  const getFechaReserva = (reserva: ReservaExtendida): string => 
    reserva.fecha_reserva || reserva.fecha_creacion || 'N/A';

  const reservasFiltradas = useMemo(() => {
    if (!Array.isArray(reservas)) return [];
    return filtroEstado === 'TODOS' ? reservas : reservas.filter(r => r.estado === filtroEstado);
  }, [reservas, filtroEstado, renderKey]);

  const estadisticas = useMemo(() => {
    if (!Array.isArray(reservas)) {
      return { total: 0, confirmadas: 0, pendientes: 0, canceladas: 0, reservadas: 0 };
    }
    return {
      total: reservas.length,
      confirmadas: reservas.filter(r => r.estado === 'CONFIRMADA').length,
      pendientes: reservas.filter(r => r.estado === 'PENDIENTE').length,
      canceladas: reservas.filter(r => r.estado === 'CANCELADA').length,
      reservadas: reservas.filter(r => r.estado === 'RESERVADO').length,
    };
  }, [reservas, renderKey]);

  if (!autenticado) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="min-h-screen flex items-center justify-center p-4 bg-transparent"
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center border border-ocean-100">
          <h2 className="text-2xl font-bold text-ocean-600 mb-3">Sesión requerida</h2>
          <p className="text-gray-500 mb-6">Inicia sesión para ver tus reservas</p>
          <Link 
            to="/ingresar" 
            className="inline-flex items-center px-6 py-3 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Iniciar Sesión
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      key={renderKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-transparent"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-ocean-100"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ocean-600">Mis Reservas</h1>
              <p className="text-gray-500 text-sm mt-1">Planifica tus aventuras con estilo</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
              {[
                { label: 'Confirmadas', count: estadisticas.confirmadas, color: 'bg-green-100 border-green-200 text-green-700' },
                { label: 'Pendientes', count: estadisticas.pendientes, color: 'bg-yellow-100 border-yellow-200 text-yellow-700' },
                { label: 'Reservadas', count: estadisticas.reservadas, color: 'bg-purple-100 border-purple-200 text-purple-700' },
                { label: 'Total', count: estadisticas.total, color: 'bg-cyan-100 border-cyan-200 text-cyan-700' },
              ].map((stat) => (
                <div key={stat.label} className={`p-3 rounded-lg ${stat.color} text-center border shadow-sm hover:shadow-md transition-all duration-300`}>
                  <div className="text-lg font-bold">{stat.count}</div>
                  <div className="text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {['TODOS', 'CONFIRMADA', 'RESERVADO', 'PENDIENTE', 'CANCELADA'].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado as EstadoReserva | 'TODOS')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  filtroEstado === estado
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-ocean-100 text-ocean-600 hover:bg-ocean-200'
                }`}
              >
                {estado} ({estado === 'TODOS' ? estadisticas.total : 
                 estado === 'CONFIRMADA' ? estadisticas.confirmadas :
                 estado === 'PENDIENTE' ? estadisticas.pendientes :
                 estado === 'CANCELADA' ? estadisticas.canceladas :
                 estado === 'RESERVADO' ? estadisticas.reservadas : 0})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-red-200 text-red-700 border px-4 py-3 rounded-lg mb-6"
          >
            <div className="flex items-center gap-2">
              <strong>Error:</strong> {error}
              <button 
                onClick={() => dispatch(listarMisReservas())}
                className="ml-auto bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 transition-all duration-300"
              >
                Reintentar
              </button>
            </div>
          </motion.div>
        )}

        {/* Contenido principal */}
        {cargando ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="space-y-4">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-4 bg-ocean-100 rounded w-3/4"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-4 bg-ocean-100 rounded col-span-2"></div>
                      <div className="h-4 bg-ocean-100 rounded col-span-1"></div>
                    </div>
                    <div className="h-4 bg-ocean-100 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="text-center text-gray-500">Cargando tus reservas...</div>
            </div>
          </motion.div>
        ) : !Array.isArray(reservasFiltradas) || reservasFiltradas.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 text-center border border-ocean-100"
          >
            <h3 className="text-xl font-semibold text-ocean-600 mb-3">
              {filtroEstado === 'TODOS' ? 'No tienes reservas aún' : `No tienes reservas ${getEstadoTexto(filtroEstado).toLowerCase()}`}
            </h3>
            <p className="text-gray-500 mb-6">¡Explora nuestros tours y comienza tu aventura!</p>
            <Link 
              to="/tours" 
              className="inline-flex items-center px-6 py-3 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Explorar Tours
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-ocean-100"
          >
            {/* Vista de tabla para pantallas grandes */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-ocean-100">
                <thead className="bg-ocean-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ocean-600 uppercase tracking-wider">Tour</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ocean-600 uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ocean-600 uppercase tracking-wider">Pasajeros</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ocean-600 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ocean-600 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ocean-600 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-ocean-100">
                  {reservasFiltradas.map((reserva, index) => {
                    const { total, detalle } = getTotalPasajeros(reserva);
                    return (
                      <motion.tr 
                        key={`${reserva.id_reserva}-${renderKey}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-ocean-50'}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-ocean-600">{getNombreTour(reserva)}</div>
                            <div className="text-sm text-gray-500">{getHorarioTour(reserva)}</div>
                            <div className="text-xs text-cyan-500 font-semibold">#{reserva.id_reserva}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-ocean-600">
                            <div className="font-medium">{formatearFecha(getFechaTour(reserva))}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-cyan-500 font-medium">{total} pasajeros</div>
                          <div className="text-xs text-gray-500">{detalle}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-600">S/ {reserva.total_pagar.toFixed(2)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEstadoClase(reserva.estado)}`}>
                            {getEstadoTexto(reserva.estado)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/reservas/${reserva.id_reserva}`}
                            className="inline-flex items-center px-4 py-2 bg-cyan-500 text-white text-sm font-medium rounded-full hover:bg-cyan-600 transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            Ver Detalle
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Vista de tarjetas para pantallas pequeñas */}
            <div className="lg:hidden space-y-4 p-4">
              {reservasFiltradas.map((reserva, index) => {
                const { total, detalle } = getTotalPasajeros(reserva);
                return (
                  <motion.div 
                    key={`${reserva.id_reserva}-${renderKey}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative rounded-xl p-4 shadow-md border border-ocean-100 bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-102"
                    onClick={() => setModalReserva(reserva)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-ocean-600">{getNombreTour(reserva)}</div>
                        <div className="text-xs text-gray-500">{getHorarioTour(reserva)}</div>
                        <div className="text-xs text-cyan-500 font-semibold">#{reserva.id_reserva}</div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEstadoClase(reserva.estado)}`}>
                        {getEstadoTexto(reserva.estado)}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="font-medium text-ocean-600">Fecha: {formatearFecha(getFechaTour(reserva))}</div>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="text-cyan-500 font-medium">{total} pasajeros</div>
                      <div className="text-xs text-gray-500">{detalle}</div>
                    </div>
                    <div className="mt-2 text-sm font-bold text-green-600">S/ {reserva.total_pagar.toFixed(2)}</div>
                    <Link
                      to={`/reservas/${reserva.id_reserva}`}
                      className="mt-3 inline-flex items-center px-4 py-2 bg-cyan-500 text-white text-sm font-medium rounded-full hover:bg-cyan-600 transition-all duration-300 w-full justify-center shadow-sm hover:shadow-md"
                    >
                      Ver Detalle
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Modal de vista previa */}
            <AnimatePresence>
              {modalReserva && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setModalReserva(null)}
                >
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    className="bg-white rounded-xl p-6 max-w-md w-full border border-ocean-100 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-bold text-ocean-600 mb-3">{getNombreTour(modalReserva)}</h3>
                    <p className="text-sm text-gray-500">ID: #{modalReserva.id_reserva}</p>
                    <p className="text-sm text-gray-500">Fecha: {formatearFecha(getFechaTour(modalReserva))}</p>
                    <p className="text-sm text-gray-500">Horario: {getHorarioTour(modalReserva)}</p>
                    <p className="text-sm text-cyan-500 font-medium">{getTotalPasajeros(modalReserva).total} pasajeros</p>
                    <p className="text-sm text-gray-500">{getTotalPasajeros(modalReserva).detalle}</p>
                    <p className="text-sm font-bold text-green-600">S/ {modalReserva.total_pagar.toFixed(2)}</p>
                    <p className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEstadoClase(modalReserva.estado)} mt-2`}>
                      {getEstadoTexto(modalReserva.estado)}
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => setModalReserva(null)}
                        className="px-4 py-2 rounded-full bg-ocean-100 text-ocean-600 hover:bg-ocean-200 transition-all duration-300"
                      >
                        Cerrar
                      </button>
                      <Link
                        to={`/reservas/${modalReserva.id_reserva}`}
                        className="px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-all duration-300"
                      >
                        Ver Detalle
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="px-6 py-3 text-sm text-center bg-ocean-50 text-ocean-600">
              Mostrando {reservasFiltradas.length} de {estadisticas.total} reservas
            </div>
          </motion.div>
        )}

        {/* Debug info */}
        {import.meta.env.DEV && (
          <details className="mt-6">
            <summary className="cursor-pointer p-3 rounded-lg text-sm font-medium bg-ocean-100 text-ocean-600">
              Información de Debug
            </summary>
            <div className="mt-2 p-4 rounded-lg text-xs bg-ocean-50 text-ocean-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Estado:</h4>
                  <div>Render Key: {renderKey}</div>
                  <div>Autenticado: {autenticado ? 'Sí' : 'No'}</div>
                  <div>Cargando: {cargando ? 'Sí' : 'No'}</div>
                  <div>Error: {error || 'Ninguno'}</div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Datos:</h4>
                  <div>Reservas: {reservas?.length || 0}</div>
                  <div>Filtradas: {reservasFiltradas?.length || 0}</div>
                  <div>Filtro: {filtroEstado}</div>
                </div>
              </div>
            </div>
          </details>
        )}
      </div>
    </motion.div>
  );
};

export default PaginaReservasUsuario;