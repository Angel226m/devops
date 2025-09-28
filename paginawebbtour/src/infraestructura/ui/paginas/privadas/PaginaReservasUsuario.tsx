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
  // ⭐ AGREGAMOS ESTADO LOCAL PARA FORZAR RENDER
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    console.log("🎯 PaginaReservasUsuario: Componente montado correctamente");
  }, []);

  console.log("🎯 PaginaReservasUsuario: Renderizando componente - render key:", renderKey);
  
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas: reservasOriginales, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  const reservas = reservasOriginales as ReservaExtendida[];
  const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | 'TODOS'>('TODOS');

  // 🔍 DEBUG LOGS PRINCIPALES
  console.log("🔍 Debug PaginaReservasUsuario - Estado principal:", {
    renderKey,
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
          
          // ⭐ FORZAR RE-RENDER
          setRenderKey(prev => prev + 1);
        })
        .catch((err) => {
          console.error("❌ Error al cargar reservas:", err);
        });
    }
  }, [dispatch, autenticado]);

  const formatearFecha = (fechaStr?: string): string => {
    if (!fechaStr) return 'Fecha no disponible';
    
    // Si viene en formato DD/MM/YYYY, convertir
    if (fechaStr.includes('/')) {
      const [day, month, year] = fechaStr.split('/');
      const fecha = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString('es-PE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    }
    
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
      detalles.push(`${reserva.cantidad_pasajes.map(p => `${p.cantidad} ${p.nombre_tipo || 'Pasajero'}`).join(', ')}`);
    }
    
    if (reserva.paquetes?.length) {
      const totalPaquetes = reserva.paquetes.reduce((sum, p) => sum + (p.cantidad || 0), 0);
      total += totalPaquetes;
      detalles.push(`${reserva.paquetes.map(p => `${p.cantidad} ${p.nombre_paquete}`).join(', ')}`);
    }
    
    return { 
      total, 
      detalle: detalles.length ? detalles.join(', ') : 'Sin detalle' 
    };
  };

  const getFechaTour = (reserva: ReservaExtendida): string => 
    reserva.fecha_tour || reserva.instancia?.fecha_especifica || '';

  const getFechaReserva = (reserva: ReservaExtendida): string => 
    reserva.fecha_reserva || reserva.fecha_creacion || '';

  const reservasFiltradas = useMemo(() => {
    console.log("🔍 Calculando reservasFiltradas:", { 
      renderKey,
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
  }, [reservas, filtroEstado, renderKey]); // ⭐ Agregamos renderKey como dependencia

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
  }, [reservas, renderKey]); // ⭐ Agregamos renderKey como dependencia

  // 🔍 LOG FINAL ANTES DEL RENDER
  console.log("🔍 Estado final antes del render:", {
    renderKey,
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
    <div key={renderKey} className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con estadísticas *//*}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-indigo-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📋</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Reservas</h1>
                <p className="text-sm text-gray-600">Gestiona todas tus reservas de tours</p>
              </div>
            </div>
            
            {/* Estadísticas *//*}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-emerald-50 text-center border border-emerald-100">
                <div className="text-lg font-bold text-emerald-700">{estadisticas.confirmadas}</div>
                <div className="text-xs text-emerald-600">Confirmadas</div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50 text-center border border-yellow-100">
                <div className="text-lg font-bold text-yellow-700">{estadisticas.pendientes}</div>
                <div className="text-xs text-yellow-600">Pendientes</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 text-center border border-purple-100">
                <div className="text-lg font-bold text-purple-700">{estadisticas.reservadas}</div>
                <div className="text-xs text-purple-600">Reservadas</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-center border border-blue-100">
                <div className="text-lg font-bold text-blue-700">{estadisticas.total}</div>
                <div className="text-xs text-blue-600">Total</div>
              </div>
            </div>
          </div>

          {/* Filtros *//*}
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

        {/* Error *//*}
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

        {/* Contenido principal *//*}
        {cargando ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <div className="text-gray-600">Cargando tus reservas...</div>
            <div className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</div>
          </div>
        ) : !Array.isArray(reservasFiltradas) || reservasFiltradas.length === 0 ? (
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
                      <tr key={`${reserva.id_reserva}-${renderKey}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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

            {/* Footer de la tabla *//*}
            <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 text-center">
              Mostrando {reservasFiltradas.length} de {estadisticas.total} reservas
            </div>
          </div>
        )}

        {/* Debug info (solo visible en desarrollo) *//*}
        {import.meta.env.DEV && (
          <details className="mt-6">
            <summary className="cursor-pointer bg-gray-100 p-3 rounded-lg text-sm font-medium">
              🔍 Información de Debug (Click para expandir)
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg text-xs">
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
                </div>
              </div>
            </div>
          </details>
        )}
      </div>
    </div>
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
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas: reservasOriginales, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  const reservas = reservasOriginales as ReservaExtendida[];
  const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | 'TODOS'>('TODOS');

  useEffect(() => {
    console.log("🎯 PaginaReservasUsuario: Componente montado correctamente");
    window.scrollTo(0, 0);
    if (autenticado) {
      console.log("🚀 Despachando listarMisReservas...");
      dispatch(listarMisReservas())
        .unwrap()
        .then((result) => {
          console.log("✅ listarMisReservas exitoso:", result);
          setRenderKey(prev => prev + 1);
        })
        .catch((err) => {
          console.error("❌ Error al cargar reservas:", err);
        });
    }
  }, [dispatch, autenticado]);

  const formatearFecha = (fechaStr?: string): string => {
    if (!fechaStr) return 'Fecha no disponible';
    if (fechaStr.includes('/')) {
      const [day, month, year] = fechaStr.split('/');
      const fecha = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString('es-PE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    }
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
      detalles.push(`${reserva.cantidad_pasajes.map(p => `${p.cantidad} ${p.nombre_tipo || 'Pasajero'}`).join(', ')}`);
    }
    if (reserva.paquetes?.length) {
      const totalPaquetes = reserva.paquetes.reduce((sum, p) => sum + (p.cantidad || 0), 0);
      total += totalPaquetes;
      detalles.push(`${reserva.paquetes.map(p => `${p.cantidad} ${p.nombre_paquete}`).join(', ')}`);
    }
    return { total, detalle: detalles.length ? detalles.join(', ') : 'Sin detalle' };
  };

  const getFechaTour = (reserva: ReservaExtendida): string => 
    reserva.fecha_tour || reserva.instancia?.fecha_especifica || '';

  const getFechaReserva = (reserva: ReservaExtendida): string => 
    reserva.fecha_reserva || reserva.fecha_creacion || '';

  const reservasFiltradas = useMemo(() => {
    if (!Array.isArray(reservas)) return [];
    return filtroEstado === 'TODOS' ? reservas : reservas.filter(r => r.estado === filtroEstado);
  }, [reservas, filtroEstado, renderKey]);

  const estadisticas = useMemo(() => {
    if (!Array.isArray(reservas)) {
      return {
        total: 0,
        confirmadas: 0,
        pendientes: 0,
        canceladas: 0,
        reservadas: 0,
      };
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Sesión requerida</h2>
          <p className="text-gray-600 mb-6">Inicia sesión para ver tus reservas</p>
          <Link 
            to="/ingresar" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300"
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
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl">📋</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
                <p className="text-sm text-gray-500">Administra tus aventuras con facilidad</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
              {[
                { label: 'Confirmadas', count: estadisticas.confirmadas, color: 'bg-green-100 border-green-200 text-green-700' },
                { label: 'Pendientes', count: estadisticas.pendientes, color: 'bg-yellow-100 border-yellow-200 text-yellow-700' },
                { label: 'Reservadas', count: estadisticas.reservadas, color: 'bg-purple-100 border-purple-200 text-purple-700' },
                { label: 'Total', count: estadisticas.total, color: 'bg-blue-100 border-blue-200 text-blue-700' },
              ].map((stat) => (
                <div key={stat.label} className={`p-4 rounded-lg ${stat.color} text-center border`}>
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            <div className="flex items-center gap-2">
              <span>❌</span>
              <strong>Error:</strong> {error}
              <button 
                onClick={() => dispatch(listarMisReservas())}
                className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-all duration-200"
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
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <div className="text-gray-700 font-medium">Cargando tus reservas...</div>
            <div className="text-sm text-gray-500 mt-2">Por favor, espera un momento</div>
          </motion.div>
        ) : !Array.isArray(reservasFiltradas) || reservasFiltradas.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {filtroEstado === 'TODOS' ? 'No tienes reservas aún' : `No tienes reservas ${getEstadoTexto(filtroEstado).toLowerCase()}`}
            </h3>
            <p className="text-gray-600 mb-6">¡Explora nuestros tours y comienza tu aventura!</p>
            <Link 
              to="/tours" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300"
            >
              <span className="mr-2">🌍</span>
              Explorar Tours
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Vista de tabla para pantallas grandes */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasajeros</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservasFiltradas.map((reserva, index) => {
                    const { total, detalle } = getTotalPasajeros(reserva);
                    return (
                      <tr key={`${reserva.id_reserva}-${renderKey}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                          <div className="text-sm font-bold text-green-700">💰 S/ {reserva.total_pagar.toFixed(2)}</div>
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
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200"
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

            {/* Vista de tarjetas para pantallas pequeñas */}
            <div className="md:hidden space-y-4 p-4">
              {reservasFiltradas.map((reserva) => {
                const { total, detalle } = getTotalPasajeros(reserva);
                return (
                  <motion.div 
                    key={`${reserva.id_reserva}-${renderKey}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🌍</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{getNombreTour(reserva)}</div>
                          <div className="text-xs text-gray-500">{getHorarioTour(reserva)}</div>
                          <div className="text-xs text-indigo-600 font-semibold">#{reserva.id_reserva}</div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEstadoClase(reserva.estado)}`}>
                        <span className="mr-1">{getEstadoIcono(reserva.estado)}</span>
                        {getEstadoTexto(reserva.estado)}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-900">
                      <div className="font-medium">🗓️ Tour: {formatearFecha(getFechaTour(reserva))}</div>
                      <div className="text-gray-500">📅 Reserva: {formatearFecha(getFechaReserva(reserva))}</div>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="text-indigo-700 font-medium">👥 {total} Pasajeros</div>
                      <div className="text-xs text-gray-500">{detalle}</div>
                    </div>
                    <div className="mt-2 text-sm font-bold text-green-700">💰 S/ {reserva.total_pagar.toFixed(2)}</div>
                    <Link
                      to={`/reservas/${reserva.id_reserva}`}
                      className="mt-3 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 w-full justify-center"
                    >
                      <span className="mr-1">👁️</span>
                      Ver Detalle
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 text-center">
              Mostrando {reservasFiltradas.length} de {estadisticas.total} reservas
            </div>
          </motion.div>
        )}

        {/* Debug info */}
        {import.meta.env.DEV && (
          <details className="mt-6">
            <summary className="cursor-pointer bg-gray-100 p-3 rounded-lg text-sm font-medium">
              🔍 Información de Debug
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg text-xs">
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