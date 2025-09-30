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

  // ✅ FUNCIÓN PROFESIONAL PARA FORMATEAR FECHAS - CORREGIDA
  const formatearFecha = (fechaStr?: string): string => {
    if (!fechaStr) return 'N/A';
    
    try {
      // Si la fecha viene en formato DD/MM/YYYY
      if (fechaStr.includes('/')) {
        const [day, month, year] = fechaStr.split('/');
        if (year && month && day) {
          // Crear fecha específica sin problemas de zona horaria
          const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          if (!isNaN(fecha.getTime())) {
            return fecha.toLocaleDateString('es-PE', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
          }
        }
      }
      
      // Si la fecha viene en formato ISO (YYYY-MM-DD) o similar
      if (fechaStr.includes('-')) {
        const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
        if (year && month && day && !isNaN(year) && !isNaN(month) && !isNaN(day)) {
          // Crear fecha específica evitando problemas de zona horaria
          const fecha = new Date(year, month - 1, day);
          return fecha.toLocaleDateString('es-PE', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }
      }
      
      // Intento de fallback con Date constructor
      const fecha = new Date(fechaStr);
      if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString('es-PE', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      
      console.warn('📅 Formato de fecha no reconocido:', fechaStr);
      return 'Fecha inválida';
      
    } catch (error) {
      console.error('📅 Error al formatear fecha:', fechaStr, error);
      return 'Fecha inválida';
    }
  };

  // ✅ FUNCIÓN PROFESIONAL PARA FORMATEAR FECHAS CORTAS
  const formatearFechaCorta = (fechaStr?: string): string => {
    if (!fechaStr) return 'N/A';
    
    try {
      // Si la fecha viene en formato DD/MM/YYYY
      if (fechaStr.includes('/')) {
        const [day, month, year] = fechaStr.split('/');
        if (year && month && day) {
          const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          if (!isNaN(fecha.getTime())) {
            return fecha.toLocaleDateString('es-PE', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
          }
        }
      }
      
      // Si la fecha viene en formato ISO (YYYY-MM-DD) o similar
      if (fechaStr.includes('-')) {
        const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
        if (year && month && day && !isNaN(year) && !isNaN(month) && !isNaN(day)) {
          const fecha = new Date(year, month - 1, day);
          return fecha.toLocaleDateString('es-PE', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        }
      }
      
      // Fallback
      const fecha = new Date(fechaStr);
      if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString('es-PE', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      return 'Fecha inválida';
      
    } catch (error) {
      console.error('📅 Error al formatear fecha corta:', fechaStr, error);
      return 'Fecha inválida';
    }
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
        {/* Header *//*}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-ocean-100"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ocean-600">Mis Reservas</h1>
              <p className="text-gray-500 text-sm mt-1">Gestiona tus aventuras y experiencias</p>
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

          {/* Filtros *//*}
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

        {/* Error *//*}
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

        {/* Contenido principal *//*}
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
            {/* Vista de tabla para pantallas grandes *//*}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-ocean-100">
                <thead className="bg-ocean-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ocean-600 uppercase tracking-wider">Tour</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ocean-600 uppercase tracking-wider">Fecha del Tour</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ocean-600 uppercase tracking-wider">Pasajeros</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ocean-600 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ocean-600 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ocean-600 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-ocean-100">
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
                            <div className="font-medium">{formatearFechaCorta(getFechaTour(reserva))}</div>
                            <div className="text-xs text-gray-500">Reservado: {formatearFechaCorta(getFechaReserva(reserva))}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-cyan-500 font-medium">{total} pasajeros</div>
                          <div className="text-xs text-gray-500 max-w-xs truncate" title={detalle}>{detalle}</div>
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

            {/* Vista de tarjetas para pantallas pequeñas *//*}
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
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-ocean-600">{getNombreTour(reserva)}</div>
                        <div className="text-xs text-gray-500">{getHorarioTour(reserva)}</div>
                        <div className="text-xs text-cyan-500 font-semibold">#{reserva.id_reserva}</div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEstadoClase(reserva.estado)}`}>
                        {getEstadoTexto(reserva.estado)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fecha del tour:</span>
                        <span className="font-medium text-ocean-600">{formatearFechaCorta(getFechaTour(reserva))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pasajeros:</span>
                        <span className="text-cyan-500 font-medium">{total} personas</span>
                      </div>
                      <div className="text-xs text-gray-500">{detalle}</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="text-lg font-bold text-green-600">S/ {reserva.total_pagar.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/reservas/${reserva.id_reserva}`}
                      className="block w-full text-center px-4 py-2 bg-cyan-500 text-white text-sm font-medium rounded-full hover:bg-cyan-600 transition-all duration-300 shadow-sm hover:shadow-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ver Detalle Completo
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Modal de vista previa mejorado *//*}
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
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-ocean-600 flex-1 pr-4">{getNombreTour(modalReserva)}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEstadoClase(modalReserva.estado)}`}>
                        {getEstadoTexto(modalReserva.estado)}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ID de Reserva:</span>
                        <span className="text-sm font-medium text-cyan-500">#{modalReserva.id_reserva}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Fecha del Tour:</span>
                        <span className="text-sm font-medium text-ocean-600">{formatearFecha(getFechaTour(modalReserva))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Horario:</span>
                        <span className="text-sm font-medium text-gray-700">{getHorarioTour(modalReserva)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pasajeros:</span>
                        <span className="text-sm font-medium text-cyan-500">{getTotalPasajeros(modalReserva).total} personas</span>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        {getTotalPasajeros(modalReserva).detalle}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-gray-600">Total Pagado:</span>
                        <span className="text-lg font-bold text-green-600">S/ {modalReserva.total_pagar.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
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
                        Ver Detalle Completo
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer *//*}
            <div className="px-6 py-3 text-sm text-center bg-ocean-50 text-ocean-600">
              Mostrando {reservasFiltradas.length} de {estadisticas.total} reservas
            </div>
          </motion.div>
        )}

        {/* Debug info - Solo en desarrollo *//*}
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

  // ✅ FUNCIÓN PROFESIONAL PARA FORMATEAR FECHAS - CORREGIDA
  const formatearFecha = (fechaStr?: string): string => {
    if (!fechaStr) return 'N/A';
    
    try {
      // Si la fecha viene en formato DD/MM/YYYY
      if (fechaStr.includes('/')) {
        const [day, month, year] = fechaStr.split('/');
        if (year && month && day) {
          // Crear fecha específica sin problemas de zona horaria
          const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          if (!isNaN(fecha.getTime())) {
            return fecha.toLocaleDateString('es-PE', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
          }
        }
      }
      
      // Si la fecha viene en formato ISO (YYYY-MM-DD) o similar
      if (fechaStr.includes('-')) {
        const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
        if (year && month && day && !isNaN(year) && !isNaN(month) && !isNaN(day)) {
          // Crear fecha específica evitando problemas de zona horaria
          const fecha = new Date(year, month - 1, day);
          return fecha.toLocaleDateString('es-PE', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }
      }
      
      // Intento de fallback con Date constructor
      const fecha = new Date(fechaStr);
      if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString('es-PE', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      
      console.warn('📅 Formato de fecha no reconocido:', fechaStr);
      return 'Fecha inválida';
      
    } catch (error) {
      console.error('📅 Error al formatear fecha:', fechaStr, error);
      return 'Fecha inválida';
    }
  };

  // ✅ FUNCIÓN PROFESIONAL PARA FORMATEAR FECHAS CORTAS
  const formatearFechaCorta = (fechaStr?: string): string => {
    if (!fechaStr) return 'N/A';
    
    try {
      // Si la fecha viene en formato DD/MM/YYYY
      if (fechaStr.includes('/')) {
        const [day, month, year] = fechaStr.split('/');
        if (year && month && day) {
          const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          if (!isNaN(fecha.getTime())) {
            return fecha.toLocaleDateString('es-PE', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
          }
        }
      }
      
      // Si la fecha viene en formato ISO (YYYY-MM-DD) o similar
      if (fechaStr.includes('-')) {
        const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
        if (year && month && day && !isNaN(year) && !isNaN(month) && !isNaN(day)) {
          const fecha = new Date(year, month - 1, day);
          return fecha.toLocaleDateString('es-PE', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        }
      }
      
      // Fallback
      const fecha = new Date(fechaStr);
      if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString('es-PE', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      return 'Fecha inválida';
      
    } catch (error) {
      console.error('📅 Error al formatear fecha corta:', fechaStr, error);
      return 'Fecha inválida';
    }
  };

  const formatearHora = (horaStr?: string): string => horaStr?.split(':').slice(0, 2).join(':') || 'N/A';

  const getEstadoClase = (estado: EstadoReserva): string => ({
    'CONFIRMADA': 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-300 shadow-sm',
    'CANCELADA': 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-300 shadow-sm',
    'PENDIENTE': 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-300 shadow-sm',
    'PROCESADO': 'bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-700 border-cyan-300 shadow-sm',
    'ANULADO': 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-300 shadow-sm',
    'RESERVADO': 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-300 shadow-sm',
  })[estado] || 'bg-gray-100 text-gray-700 border-gray-200';

  const getEstadoTexto = (estado: EstadoReserva): string => ({
    'CONFIRMADA': 'Confirmada',
    'CANCELADA': 'Cancelada',
    'PENDIENTE': 'Pendiente',
    'PROCESADO': 'Procesado',
    'ANULADO': 'Anulado',
    'RESERVADO': 'Reservado'
  })[estado] || estado;

  const getEstadoIcono = (estado: EstadoReserva): string => ({
    'CONFIRMADA': '✓',
    'CANCELADA': '✕',
    'PENDIENTE': '⏱',
    'PROCESADO': '✓',
    'ANULADO': '✕',
    'RESERVADO': '📅'
  })[estado] || '•';

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
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-lg w-full text-center border-2 border-cyan-100 relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-100 rounded-full -mr-20 -mt-20 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100 rounded-full -ml-16 -mb-16 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl shadow-lg">
              🔒
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 mb-4">
              Sesión Requerida
            </h2>
            <p className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed">
              Para ver y gestionar tus reservas, necesitas iniciar sesión en tu cuenta
            </p>
            <Link 
              to="/ingresar" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Iniciar Sesión</span>
              <span>→</span>
            </Link>
          </div>
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
      className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Mejorado */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white via-cyan-50/30 to-purple-50/30 rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-cyan-100 relative overflow-hidden"
        >
          {/* Decoración de fondo sutil */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-100/30 to-transparent rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                    📋
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">
                      Mis Reservas
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      Gestiona tus aventuras y experiencias
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Estadísticas mejoradas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full lg:w-auto">
                {[
                  { label: 'Confirmadas', count: estadisticas.confirmadas, color: 'from-green-400 to-green-600', icon: '✓', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
                  { label: 'Pendientes', count: estadisticas.pendientes, color: 'from-yellow-400 to-yellow-600', icon: '⏱', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
                  { label: 'Reservadas', count: estadisticas.reservadas, color: 'from-purple-400 to-purple-600', icon: '📅', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
                  { label: 'Total', count: estadisticas.total, color: 'from-cyan-400 to-cyan-600', icon: '📊', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
                ].map((stat) => (
                  <motion.div 
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className={`${stat.bgColor} p-4 rounded-2xl text-center border-2 ${stat.borderColor} shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm`}
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className={`text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                      {stat.count}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-gray-600 mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Filtros mejorados con scroll horizontal */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-transparent">
              {[
                { estado: 'TODOS', icon: '🔍', color: 'from-gray-400 to-gray-600' },
                { estado: 'CONFIRMADA', icon: '✓', color: 'from-green-400 to-green-600' },
                { estado: 'RESERVADO', icon: '📅', color: 'from-purple-400 to-purple-600' },
                { estado: 'PENDIENTE', icon: '⏱', color: 'from-yellow-400 to-yellow-600' },
                { estado: 'CANCELADA', icon: '✕', color: 'from-red-400 to-red-600' }
              ].map((filtro) => (
                <motion.button
                  key={filtro.estado}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFiltroEstado(filtro.estado as EstadoReserva | 'TODOS')}
                  className={`flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg border-2 ${
                    filtroEstado === filtro.estado
                      ? `bg-gradient-to-r ${filtro.color} text-white border-transparent`
                      : 'bg-white text-gray-700 border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  <span className="mr-2">{filtro.icon}</span>
                  <span className="whitespace-nowrap">
                    {filtro.estado} ({filtro.estado === 'TODOS' ? estadisticas.total : 
                     filtro.estado === 'CONFIRMADA' ? estadisticas.confirmadas :
                     filtro.estado === 'PENDIENTE' ? estadisticas.pendientes :
                     filtro.estado === 'CANCELADA' ? estadisticas.canceladas :
                     filtro.estado === 'RESERVADO' ? estadisticas.reservadas : 0})
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error mejorado */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 text-red-700 rounded-2xl px-6 py-4 mb-6 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <strong className="block mb-1">Error al cargar reservas</strong>
                <span className="text-sm">{error}</span>
              </div>
              <button 
                onClick={() => dispatch(listarMisReservas())}
                className="ml-auto bg-red-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                🔄 Reintentar
              </button>
            </div>
          </motion.div>
        )}

        {/* Contenido principal */}
        {cargando ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border border-cyan-100"
          >
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-4">
                    <div className="rounded-2xl bg-gradient-to-br from-cyan-100 to-purple-100 h-24 w-24"></div>
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gradient-to-r from-cyan-100 to-purple-100 rounded-full w-3/4"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-4 bg-gradient-to-r from-cyan-100 to-purple-100 rounded-full col-span-2"></div>
                          <div className="h-4 bg-gradient-to-r from-cyan-100 to-purple-100 rounded-full col-span-1"></div>
                        </div>
                        <div className="h-4 bg-gradient-to-r from-cyan-100 to-purple-100 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center text-gray-600 mt-6 flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-4 border-cyan-500 border-t-transparent"></div>
                <span className="font-medium">Cargando tus reservas...</span>
              </div>
            </div>
          </motion.div>
        ) : !Array.isArray(reservasFiltradas) || reservasFiltradas.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white via-cyan-50/30 to-purple-50/30 rounded-3xl shadow-2xl p-8 sm:p-12 text-center border-2 border-cyan-100 relative overflow-hidden"
          >
            {/* Decoración */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-100/30 to-transparent rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-5xl shadow-xl">
                📭
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 mb-4">
                {filtroEstado === 'TODOS' ? 'No tienes reservas aún' : `No tienes reservas ${getEstadoTexto(filtroEstado).toLowerCase()}`}
              </h3>
              <p className="text-gray-600 mb-8 text-base sm:text-lg max-w-md mx-auto">
                ¡Explora nuestros increíbles tours y comienza tu próxima aventura!
              </p>
              <Link 
                to="/tours" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>🌍</span>
                <span>Explorar Tours</span>
                <span>→</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-cyan-100"
          >
            {/* Vista de tabla para pantallas grandes - MEJORADA */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-cyan-100">
                <thead className="bg-gradient-to-r from-cyan-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-700 uppercase tracking-wider">Tour</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-700 uppercase tracking-wider">Fecha del Tour</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-700 uppercase tracking-wider">Pasajeros</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-700 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-700 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-700 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-cyan-50">
                  {reservasFiltradas.map((reserva, index) => {
                    const { total, detalle } = getTotalPasajeros(reserva);
                    return (
                      <motion.tr 
                        key={`${reserva.id_reserva}-${renderKey}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-purple-50/50 transition-all duration-300 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg shadow-md flex-shrink-0">
                              🎫
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">{getNombreTour(reserva)}</div>
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <span>🕐</span>
                                <span>{getHorarioTour(reserva)}</span>
                              </div>
                              <div className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">
                                ID: #{reserva.id_reserva}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                              <span>📅</span>
                              <span>{formatearFechaCorta(getFechaTour(reserva))}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Reservado: {formatearFechaCorta(getFechaReserva(reserva))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 flex items-center gap-1">
                              <span>👥</span>
                              <span>{total} pasajeros</span>
                            </div>
                            <div className="text-xs text-gray-500 max-w-xs truncate mt-1" title={detalle}>
                              {detalle}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700 flex items-center gap-1">
                            <span>💰</span>
                            <span>S/ {reserva.total_pagar.toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border-2 ${getEstadoClase(reserva.estado)}`}>
                            <span>{getEstadoIcono(reserva.estado)}</span>
                            <span>{getEstadoTexto(reserva.estado)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/reservas/${reserva.id_reserva}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-semibold rounded-full hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            <span>Ver Detalle</span>
                            <span>→</span>
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Vista de tarjetas para pantallas pequeñas - MEJORADA */}
            <div className="lg:hidden space-y-4 p-4 sm:p-6">
              {reservasFiltradas.map((reserva, index) => {
                const { total, detalle } = getTotalPasajeros(reserva);
                return (
                  <motion.div 
                    key={`${reserva.id_reserva}-${renderKey}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative rounded-2xl p-5 sm:p-6 shadow-lg border-2 border-cyan-100 bg-gradient-to-br from-white to-cyan-50/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                    onClick={() => setModalReserva(reserva)}
                  >
                    {/* Badge de estado - posición mejorada */}
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getEstadoClase(reserva.estado)}`}>
                        <span>{getEstadoIcono(reserva.estado)}</span>
                        <span>{getEstadoTexto(reserva.estado)}</span>
                      </span>
                    </div>

                    {/* Header de la tarjeta */}
                    <div className="flex items-start gap-3 mb-4 pr-24">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg flex-shrink-0">
                        🎫
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2">
                          {getNombreTour(reserva)}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <span>🕐</span>
                          <span>{getHorarioTour(reserva)}</span>
                        </div>
                        <div className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 mt-1">
                          ID: #{reserva.id_reserva}
                        </div>
                      </div>
                    </div>
                    
                    {/* Información detallada */}
                    <div className="space-y-3 mb-5 bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <span>📅</span>
                          <span className="font-medium">Fecha del tour:</span>
                        </span>
                        <span className="font-bold text-gray-900">{formatearFechaCorta(getFechaTour(reserva))}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <span>👥</span>
                          <span className="font-medium">Pasajeros:</span>
                        </span>
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">
                          {total} personas
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                        {detalle}
                      </div>
                      <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                        <span className="text-gray-600 flex items-center gap-2">
                          <span>💰</span>
                          <span className="font-medium">Total:</span>
                        </span>
                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                          S/ {reserva.total_pagar.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Botón de acción */}
                    <Link
                      to={`/reservas/${reserva.id_reserva}`}
                      className="block w-full text-center px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-bold rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ver Detalle Completo →
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Modal de vista previa - MEJORADO */}
            <AnimatePresence>
              {modalReserva && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  onClick={() => setModalReserva(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-gradient-to-br from-white to-cyan-50/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-cyan-200 shadow-2xl relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Decoración de fondo */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-100/40 to-transparent rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-100/40 to-transparent rounded-full -ml-16 -mb-16"></div>
                    
                    <div className="relative z-10">
                      {/* Header del modal */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg flex-shrink-0">
                          🎫
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                            {getNombreTour(modalReserva)}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getEstadoClase(modalReserva.estado)}`}>
                            <span>{getEstadoIcono(modalReserva.estado)}</span>
                            <span>{getEstadoTexto(modalReserva.estado)}</span>
                          </span>
                        </div>
                      </div>
                      
                      {/* Información detallada */}
                      <div className="space-y-4 mb-6 bg-white/70 rounded-2xl p-5 backdrop-blur-sm shadow-inner">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 flex items-center gap-2">
                            <span>🆔</span>
                            <span className="font-medium">ID de Reserva:</span>
                          </span>
                          <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">
                            #{modalReserva.id_reserva}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 flex items-center gap-2">
                            <span>📅</span>
                            <span className="font-medium">Fecha del Tour:</span>
                          </span>
                          <span className="text-sm font-bold text-gray-900 text-right">
                            {formatearFecha(getFechaTour(modalReserva))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 flex items-center gap-2">
                            <span>🕐</span>
                            <span className="font-medium">Horario:</span>
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {getHorarioTour(modalReserva)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 flex items-center gap-2">
                            <span>👥</span>
                            <span className="font-medium">Pasajeros:</span>
                          </span>
                          <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">
                            {getTotalPasajeros(modalReserva).total} personas
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {getTotalPasajeros(modalReserva).detalle}
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                          <span className="text-base text-gray-700 flex items-center gap-2">
                            <span>💰</span>
                            <span className="font-semibold">Total Pagado:</span>
                          </span>
                          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                            S/ {modalReserva.total_pagar.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Botones de acción */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setModalReserva(null)}
                          className="flex-1 px-5 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-300 border-2 border-gray-200"
                        >
                          Cerrar
                        </button>
                        <Link
                          to={`/reservas/${modalReserva.id_reserva}`}
                          className="flex-1 px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Ver Detalle Completo →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer - MEJORADO */}
            <div className="px-6 py-4 text-sm text-center bg-gradient-to-r from-cyan-50 to-purple-50 text-gray-700 font-medium border-t-2 border-cyan-100">
              <span className="inline-flex items-center gap-2">
                <span>📊</span>
                <span>Mostrando <strong className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">{reservasFiltradas.length}</strong> de <strong className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">{estadisticas.total}</strong> reservas</span>
              </span>
            </div>
          </motion.div>
        )}

        {/* Debug info - Solo en desarrollo */}
        {import.meta.env.DEV && (
          <details className="mt-6">
            <summary className="cursor-pointer p-4 rounded-2xl text-sm font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md">
              🔧 Información de Debug
            </summary>
            <div className="mt-3 p-5 rounded-2xl text-xs bg-white border-2 border-gray-200 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl">
                  <h4 className="font-bold mb-3 text-cyan-700 flex items-center gap-2">
                    <span>⚙️</span>
                    <span>Estado:</span>
                  </h4>
                  <div className="space-y-2 text-gray-700">
                    <div><strong>Render Key:</strong> {renderKey}</div>
                    <div><strong>Autenticado:</strong> {autenticado ? '✅ Sí' : '❌ No'}</div>
                    <div><strong>Cargando:</strong> {cargando ? '⏳ Sí' : '✅ No'}</div>
                    <div><strong>Error:</strong> {error || '✅ Ninguno'}</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                  <h4 className="font-bold mb-3 text-purple-700 flex items-center gap-2">
                    <span>📊</span>
                    <span>Datos:</span>
                  </h4>
                  <div className="space-y-2 text-gray-700">
                    <div><strong>Reservas:</strong> {reservas?.length || 0}</div>
                    <div><strong>Filtradas:</strong> {reservasFiltradas?.length || 0}</div>
                    <div><strong>Filtro:</strong> {filtroEstado}</div>
                  </div>
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