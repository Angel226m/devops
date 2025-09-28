 /*import { useEffect, useState, useMemo } from 'react';
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
   useEffect(() => {
    console.log("🎯 PaginaReservasUsuario: Componente montado correctamente");
  }, []);

  console.log("🎯 PaginaReservasUsuario: Renderizando componente");
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas: reservasOriginales, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  const reservas = reservasOriginales as ReservaExtendida[];
  const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | 'TODOS'>('TODOS');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (autenticado) {
      dispatch(listarMisReservas()).unwrap().catch((err) => console.error("Error al cargar reservas:", err));
    }
  }, [dispatch, autenticado]);

  const formatearFecha = (fechaStr?: string, formato: 'corto' = 'corto'): string => {
    if (!fechaStr) return t('reservas.fechaNoDisponible');
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return t('reservas.fechaInvalida');
    return fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearHora = (horaStr?: string): string => horaStr?.split(':').slice(0, 2).join(':') || '';

  const getEstadoClase = (estado: EstadoReserva): string => ({
    'CONFIRMADA': 'bg-emerald-50 text-emerald-700',
    'CANCELADA': 'bg-rose-50 text-rose-700',
    'PENDIENTE': 'bg-amber-50 text-amber-700',
    'PROCESADO': 'bg-blue-50 text-blue-700',
    'ANULADO': 'bg-gray-50 text-gray-700',
    'RESERVADO': 'bg-indigo-50 text-indigo-700',
  })[estado] || 'bg-indigo-50 text-indigo-700';

  const getEstadoIcono = (estado: EstadoReserva) => ({
    'CONFIRMADA': <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>,
    'CANCELADA': <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    'PENDIENTE': <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l2 2" /></svg>,
    'PROCESADO': <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    'ANULADO': <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    'RESERVADO': <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  })[estado];

  const getEstadoTexto = (estado: EstadoReserva): string => t(`reserva.estados.${estado.toLowerCase()}`);

  const getNombreTour = (reserva: ReservaExtendida): string => reserva.nombre_tour || reserva.instancia?.nombre_tour || t('reservas.tourNoEspecificado');

  const getHorarioTour = (reserva: ReservaExtendida): string => {
    const horaInicio = formatearHora(reserva.hora_inicio_tour || reserva.instancia?.hora_inicio);
    const horaFin = formatearHora(reserva.hora_fin_tour);
    return horaInicio && horaFin ? `${horaInicio} - ${horaFin}` : horaInicio || t('reservas.horarioNoEspecificado');
  };

  const getTotalPasajeros = (reserva: ReservaExtendida): { total: number; detalle: string } => {
    let total = 0;
    const detalles: string[] = [];
    if (reserva.cantidad_pasajes?.length) {
      total += reserva.cantidad_pasajes.reduce((sum, p) => sum + p.cantidad, 0);
      detalles.push(`Pasajes: ${reserva.cantidad_pasajes.map(p => `${p.cantidad} ${p.nombre_tipo || 'Pasajero'}`).join(', ')}`);
    }
    if (reserva.paquetes?.length) {
      total += reserva.paquetes.reduce((sum, p) => sum + (p.cantidad_total || 0), 0);
      detalles.push(`Paquetes: ${reserva.paquetes.map(p => `${p.cantidad} ${p.nombre_paquete}`).join(', ')}`);
    }
    const tipo = detalles.length ? (detalles.length > 1 ? 'Pasajes y Paquetes' : detalles[0].split(': ')[0]) : '';
    return { total, detalle: detalles.length ? `${tipo} (${detalles.join('; ')})` : 'Sin pasajeros' };
  };

  const getFechaTour = (reserva: ReservaExtendida): string => reserva.fecha_tour || reserva.instancia?.fecha_especifica || '';

  const getFechaReserva = (reserva: ReservaExtendida): string => reserva.fecha_reserva || reserva.fecha_creacion || '';

  const reservasFiltradas = useMemo(() => filtroEstado === 'TODOS' ? reservas : reservas.filter(r => r.estado === filtroEstado), [reservas, filtroEstado]);

  const estadisticas = useMemo(() => ({
    total: reservas.length,
    confirmadas: reservas.filter(r => r.estado === 'CONFIRMADA').length,
    pendientes: reservas.filter(r => r.estado === 'PENDIENTE').length,
    canceladas: reservas.filter(r => r.estado === 'CANCELADA').length,
    reservadas: reservas.filter(r => r.estado === 'RESERVADO').length,
  }), [reservas]);

  if (!autenticado) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100"
      >
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-sm">
          <svg className="h-12 w-12 mx-auto text-indigo-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('reservas.noSesion')}</h2>
          <p className="text-sm text-gray-600 mb-4">{t('reservas.iniciarSesionParaVerReservas')}</p>
          <Link to="/login" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            {t('auth.iniciarSesion')}
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow p-4 mb-4 border border-indigo-100"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h1 className="text-xl font-semibold text-gray-900">{t('menu.misReservas')}</h1>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: t('reserva.estados.confirmada'), value: estadisticas.confirmadas, color: 'emerald' },
                { label: t('reserva.estados.pendiente'), value: estadisticas.pendientes, color: 'amber' },
                { label: t('reserva.estados.reservado'), value: estadisticas.reservadas, color: 'indigo' },
                { label: t('reservas.total'), value: estadisticas.total, color: 'blue' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-700 text-xs font-medium text-center`}
                >
                  {stat.value} <span className="text-gray-600 text-[10px]">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-4">
            <Alerta mensaje={error} tipo="error" />
          </motion.div>
        )}

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow p-4 mb-4 border border-indigo-100"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-base font-medium text-gray-800">{t('reservas.filtrarPorEstado')}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {['TODOS', 'CONFIRMADA', 'RESERVADO', 'PENDIENTE', 'CANCELADA'].map((estado) => (
                <motion.button
                  key={estado}
                  onClick={() => setFiltroEstado(estado as EstadoReserva | 'TODOS')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filtroEstado === estado
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-pressed={filtroEstado === estado}
                >
                  {estado === 'TODOS' ? t('reservas.todos') : t(`reserva.estados.${estado.toLowerCase()}`)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {cargando ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-48 bg-white rounded-xl shadow border border-indigo-100"
            >
              <Cargador tamanio="md" color="text-indigo-600" />
            </motion.div>
          ) : reservasFiltradas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow p-6 text-center border border-indigo-100"
            >
              <svg className="h-16 w-16 mx-auto text-indigo-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filtroEstado === 'TODOS' ? t('reservas.sinReservas') : t('reservas.sinReservasEstado', { estado: getEstadoTexto(filtroEstado) })}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{t('reservas.explorarTours')}</p>
              <Link to="/tours" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('reservas.verTours')}
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow overflow-hidden border border-indigo-100"
            >
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-indigo-50">
                  <tr>
                    {[
                      { key: 'tour', label: t('reservas.tour') },
                      { key: 'fecha', label: t('reservas.fecha') },
                      { key: 'pasajeros', label: t('reservas.pasajeros') },
                      { key: 'total', label: t('reservas.total') },
                      { key: 'estado', label: t('reservas.estado') },
                      { key: 'acciones', label: t('reservas.acciones') },
                    ].map(({ key, label }) => (
                      <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wide">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reservasFiltradas.map((reserva, index) => {
                    const { total, detalle } = getTotalPasajeros(reserva);
                    return (
                      <motion.tr
                        key={reserva.id_reserva}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-indigo-50 transition-colors duration-200"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{getNombreTour(reserva)}</div>
                              <div className="text-xs text-gray-500">{getHorarioTour(reserva)}</div>
                              <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block mt-1">#{reserva.id_reserva}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{formatearFecha(getFechaTour(reserva))}</div>
                          <div className="text-xs text-gray-500">{t('reservas.reservadoEl')} {formatearFecha(getFechaReserva(reserva))}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-indigo-700">{total}</div>
                          <div className="text-xs text-gray-500">{detalle}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="text-sm font-medium text-emerald-700">S/ {reserva.total_pagar.toFixed(2)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 inline-flex items-center text-xs font-medium rounded ${getEstadoClase(reserva.estado)}`}>
                            {getEstadoIcono(reserva.estado)} <span className="ml-1">{getEstadoTexto(reserva.estado)}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/reservas/${reserva.id_reserva}`}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {t('reservas.verDetalles')}
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
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
  useEffect(() => {
    console.log("🎯 PaginaReservasUsuario: Componente montado correctamente");
  }, []);

  console.log("🎯 PaginaReservasUsuario: Renderizando componente");
  
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas: reservasOriginales, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  const reservas = reservasOriginales as ReservaExtendida[];
  const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | 'TODOS'>('TODOS');

  // 🔍 DEBUG LOGS PRINCIPALES
  console.log("🔍 Debug PaginaReservasUsuario - Estado principal:", {
    reservasOriginales: reservasOriginales,
    reservasLength: reservasOriginales?.length,
    reservas: reservas,
    reservasAsArray: Array.isArray(reservas),
    cargando: cargando,
    error: error,
    autenticado: autenticado,
    filtroEstado: filtroEstado
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (autenticado) {
      console.log("🚀 Despachando listarMisReservas...");
      dispatch(listarMisReservas())
        .unwrap()
        .then((result) => {
          console.log("✅ listarMisReservas exitoso:", result);
          console.log("✅ Número de reservas recibidas:", result?.length);
          console.log("✅ Tipo de datos recibidos:", typeof result, Array.isArray(result));
          console.log("✅ Primera reserva (si existe):", result?.[0]);
        })
        .catch((err) => {
          console.error("❌ Error al cargar reservas:", err);
        });
    }
  }, [dispatch, autenticado]);

  const formatearFecha = (fechaStr?: string, formato: 'corto' = 'corto'): string => {
    if (!fechaStr) return 'Fecha no disponible';
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return 'Fecha inválida';
    return fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearHora = (horaStr?: string): string => horaStr?.split(':').slice(0, 2).join(':') || '';

  const getEstadoClase = (estado: EstadoReserva): string => ({
    'CONFIRMADA': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    'CANCELADA': 'bg-red-100 text-red-800 border border-red-200',
    'PENDIENTE': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    'PROCESADO': 'bg-blue-100 text-blue-800 border border-blue-200',
    'ANULADO': 'bg-gray-100 text-gray-800 border border-gray-200',
    'RESERVADO': 'bg-purple-100 text-purple-800 border border-purple-200',
  })[estado] || 'bg-gray-100 text-gray-800 border border-gray-200';

  const getEstadoIcono = (estado: EstadoReserva) => ({
    'CONFIRMADA': '✅',
    'CANCELADA': '❌',
    'PENDIENTE': '⏳',
    'PROCESADO': '✅',
    'ANULADO': '❌',
    'RESERVADO': '📅',
  })[estado] || '📅';

  const getEstadoTexto = (estado: EstadoReserva): string => {
    try {
      const traducciones = {
        'CONFIRMADA': 'Confirmada',
        'CANCELADA': 'Cancelada',
        'PENDIENTE': 'Pendiente',
        'PROCESADO': 'Procesado',
        'ANULADO': 'Anulado',
        'RESERVADO': 'Reservado'
      };
      return traducciones[estado] || estado;
    } catch (error) {
      console.warn("⚠️ Error en traducción de estado:", estado, error);
      return estado;
    }
  };

  const getNombreTour = (reserva: ReservaExtendida): string => 
    reserva.nombre_tour || reserva.instancia?.nombre_tour || 'Tour no especificado';

  const getHorarioTour = (reserva: ReservaExtendida): string => {
    const horaInicio = formatearHora(reserva.hora_inicio_tour || reserva.instancia?.hora_inicio);
    const horaFin = formatearHora(reserva.hora_fin_tour);
    return horaInicio && horaFin ? `${horaInicio} - ${horaFin}` : horaInicio || 'Horario no especificado';
  };

  const getTotalPasajeros = (reserva: ReservaExtendida): { total: number; detalle: string } => {
    let total = 0;
    const detalles: string[] = [];
    
    if (reserva.cantidad_pasajes?.length) {
      total += reserva.cantidad_pasajes.reduce((sum, p) => sum + p.cantidad, 0);
      detalles.push(`Pasajes: ${reserva.cantidad_pasajes.map(p => `${p.cantidad} ${p.nombre_tipo || 'Pasajero'}`).join(', ')}`);
    }
    
    if (reserva.paquetes?.length) {
      total += reserva.paquetes.reduce((sum, p) => sum + (p.cantidad_total || 0), 0);
      detalles.push(`Paquetes: ${reserva.paquetes.map(p => `${p.cantidad} ${p.nombre_paquete}`).join(', ')}`);
    }
    
    const tipo = detalles.length ? (detalles.length > 1 ? 'Mixto' : detalles[0].split(': ')[0]) : '';
    return { total, detalle: detalles.length ? `${tipo}` : 'Sin pasajeros' };
  };

  const getFechaTour = (reserva: ReservaExtendida): string => 
    reserva.fecha_tour || reserva.instancia?.fecha_especifica || '';

  const getFechaReserva = (reserva: ReservaExtendida): string => 
    reserva.fecha_reserva || reserva.fecha_creacion || '';

  const reservasFiltradas = useMemo(() => {
    console.log("🔍 Calculando reservasFiltradas:", { 
      filtroEstado, 
      reservasLength: reservas?.length,
      tipoReservas: typeof reservas,
      esArray: Array.isArray(reservas)
    });
    
    if (!Array.isArray(reservas)) {
      console.warn("⚠️ reservas no es un array:", reservas);
      return [];
    }
    
    const filtradas = filtroEstado === 'TODOS' ? reservas : reservas.filter(r => r.estado === filtroEstado);
    console.log("✅ reservasFiltradas calculadas:", filtradas.length);
    return filtradas;
  }, [reservas, filtroEstado]);

  const estadisticas = useMemo(() => {
    if (!Array.isArray(reservas)) {
      console.warn("⚠️ No se pueden calcular estadísticas, reservas no es array");
      return {
        total: 0,
        confirmadas: 0,
        pendientes: 0,
        canceladas: 0,
        reservadas: 0,
      };
    }
    
    const stats = {
      total: reservas.length,
      confirmadas: reservas.filter(r => r.estado === 'CONFIRMADA').length,
      pendientes: reservas.filter(r => r.estado === 'PENDIENTE').length,
      canceladas: reservas.filter(r => r.estado === 'CANCELADA').length,
      reservadas: reservas.filter(r => r.estado === 'RESERVADO').length,
    };
    
    console.log("📊 Estadísticas calculadas:", stats);
    return stats;
  }, [reservas]);

  // 🔍 LOG FINAL ANTES DEL RENDER
  console.log("🔍 Estado final antes del render:", {
    autenticado,
    cargando,
    error,
    reservasFiltradas: reservasFiltradas?.length,
    estadisticas,
    tipoReservasFiltradas: typeof reservasFiltradas,
    esArrayReservasFiltradas: Array.isArray(reservasFiltradas)
  });

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-sm">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Sesión requerida</h2>
          <p className="text-sm text-gray-600 mb-4">Inicia sesión para ver tus reservas</p>
          <Link 
            to="/ingresar" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con estadísticas */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-indigo-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📋</div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Reservas</h1>
            </div>
            
            {/* Estadísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-emerald-50 text-center">
                <div className="text-lg font-bold text-emerald-700">{estadisticas.confirmadas}</div>
                <div className="text-xs text-emerald-600">Confirmadas</div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50 text-center">
                <div className="text-lg font-bold text-yellow-700">{estadisticas.pendientes}</div>
                <div className="text-xs text-yellow-600">Pendientes</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 text-center">
                <div className="text-lg font-bold text-purple-700">{estadisticas.reservadas}</div>
                <div className="text-xs text-purple-600">Reservadas</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-center">
                <div className="text-lg font-bold text-blue-700">{estadisticas.total}</div>
                <div className="text-xs text-blue-600">Total</div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {['TODOS', 'CONFIRMADA', 'RESERVADO', 'PENDIENTE', 'CANCELADA'].map((estado) => (
              <button
                key={estado}
                onClick={() => {
                  console.log("🔄 Cambiando filtro a:", estado);
                  setFiltroEstado(estado as EstadoReserva | 'TODOS');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filtroEstado === estado
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <span>❌</span>
              <strong>Error:</strong> {error}
              <button 
                onClick={() => {
                  console.log("🔄 Reintentando cargar reservas...");
                  dispatch(listarMisReservas());
                }}
                className="ml-auto bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {cargando ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <div className="text-gray-600">Cargando reservas...</div>
          </div>
        ) : reservasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filtroEstado === 'TODOS' ? 'No tienes reservas aún' : `No tienes reservas ${getEstadoTexto(filtroEstado).toLowerCase()}`}
            </h3>
            <p className="text-gray-600 mb-6">¡Explora nuestros tours y haz tu primera reserva!</p>
            <Link 
              to="/tours" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <span className="mr-2">🌍</span>
              Explorar Tours
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasajeros</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservasFiltradas.map((reserva, index) => {
                    const { total, detalle } = getTotalPasajeros(reserva);
                    return (
                      <tr key={reserva.id_reserva} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">🌍</div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{getNombreTour(reserva)}</div>
                              <div className="text-sm text-gray-500">{getHorarioTour(reserva)}</div>
                              <div className="text-xs text-indigo-600 font-semibold">#{reserva.id_reserva}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">🗓️ {formatearFecha(getFechaTour(reserva))}</div>
                            <div className="text-gray-500">📅 {formatearFecha(getFechaReserva(reserva))}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-indigo-700 font-medium">👥 {total}</div>
                          <div className="text-xs text-gray-500">{detalle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-emerald-700">💰 S/ {reserva.total_pagar.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEstadoClase(reserva.estado)}`}>
                            <span className="mr-1">{getEstadoIcono(reserva.estado)}</span>
                            {getEstadoTexto(reserva.estado)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/reservas/${reserva.id_reserva}`}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            onClick={() => console.log("🔗 Navegando a detalle de reserva:", reserva.id_reserva)}
                          >
                            <span className="mr-1">👁️</span>
                            Ver Detalle
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

        {/* Debug info (colapsable) */}
        <details className="mt-6">
          <summary className="cursor-pointer bg-gray-100 p-3 rounded-lg text-sm font-medium">
            🔍 Información de Debug (Click para expandir)
          </summary>
          <div className="mt-2 p-4 bg-gray-50 rounded-lg text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Estado:</h4>
                <div>Autenticado: {autenticado ? '✅' : '❌'}</div>
                <div>Cargando: {cargando ? '⏳' : '✅'}</div>
                <div>Error: {error || '✅ Ninguno'}</div>
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
      </div>
    </div>
  );
};

export default PaginaReservasUsuario;