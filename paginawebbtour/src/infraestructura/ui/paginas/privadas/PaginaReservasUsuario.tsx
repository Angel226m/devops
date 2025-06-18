// ui/paginas/privadas/PaginaReservasUsuario.tsx
/*import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../store';
import { listarMisReservas } from '../../../store/slices/sliceReserva';
import Cargador from '../../componentes/comunes/Cargador';
import Alerta from '../../componentes/comunes/Alerta';

// Define los tipos aquí ya que no se puede encontrar el módulo
type EstadoReserva = 'RESERVADO' | 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE' | 'PROCESADO' | 'ANULADO';

// Definición de tipos para las reservas
interface CantidadPasaje {
  id_tipo_pasaje: number;
  cantidad: number;
  precio_unitario: number;
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

const PaginaReservasUsuario = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas: reservasOriginales, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  
  // Tratar las reservas como ReservaExtendida
  const reservas = reservasOriginales as ReservaExtendida[];
  
  // Estado para filtros
  const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | 'TODOS'>('TODOS');
  const [reservasFiltradas, setReservasFiltradas] = useState<ReservaExtendida[]>(reservas);

  // Cargar reservas al montar el componente
  useEffect(() => {
    if (autenticado) {
      dispatch(listarMisReservas());
    }
  }, [dispatch, autenticado]);

  // Aplicar filtros cuando cambian las reservas o el filtro
  useEffect(() => {
    if (filtroEstado === 'TODOS') {
      setReservasFiltradas(reservas);
    } else {
      setReservasFiltradas(reservas.filter(r => r.estado === filtroEstado));
    }
  }, [reservas, filtroEstado]);

  // Función para obtener la clase de color según el estado
  const getEstadoClase = (estado: EstadoReserva) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'RESERVADO':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    }
  };

  // Obtener texto traducido para el estado
  const getEstadoTexto = (estado: EstadoReserva) => {
    return t(`reserva.estados.${estado.toLowerCase()}`);
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fechaStr?: string) => {
    if (!fechaStr) return '';
    
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-PE', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return fechaStr;
    }
  };

  // Obtener nombre del tour
  const getNombreTour = (reserva: ReservaExtendida) => {
    return reserva.nombre_tour || 
           (reserva.instancia && reserva.instancia.nombre_tour) || 
           t('reservas.tourNoEspecificado');
  };

  // Obtener horario del tour
  const getHorarioTour = (reserva: ReservaExtendida) => {
    if (reserva.hora_inicio_tour && reserva.hora_fin_tour) {
      return `${reserva.hora_inicio_tour} - ${reserva.hora_fin_tour}`;
    }
    
    if (reserva.instancia && reserva.instancia.hora_inicio) {
      return reserva.instancia.hora_inicio;
    }
    
    return '';
  };

  // Obtener total de pasajeros
  const getTotalPasajeros = (reserva: ReservaExtendida) => {
    if (reserva.cantidad_pasajes && reserva.cantidad_pasajes.length > 0) {
      return reserva.cantidad_pasajes.reduce((total: number, p: CantidadPasaje) => total + p.cantidad, 0);
    }
    return 0;
  };

  if (!autenticado) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">{t('reservas.noSesion')}</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('reservas.iniciarSesionParaVerReservas')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado *//*}
        <div className="bg-gradient-to-r from-ocean-600 to-cyan-500 text-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">{t('menu.misReservas')}</h1>
          <p className="opacity-90">{t('reservas.gestionReservas')}</p>
        </div>
        
        {/* Alertas y mensajes *//*}
        {error && (
          <Alerta 
            mensaje={error} 
            tipo="error" 
          />
        )}
        
        {/* Filtros *//*}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('reservas.filtrarPorEstado')}
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltroEstado('TODOS')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filtroEstado === 'TODOS' 
                    ? 'bg-ocean-500 text-white' 
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {t('reservas.todos')}
              </button>
              <button
                onClick={() => setFiltroEstado('CONFIRMADA')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filtroEstado === 'CONFIRMADA' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                }`}
              >
                {t('reserva.estados.confirmada')}
              </button>
              <button
                onClick={() => setFiltroEstado('RESERVADO')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filtroEstado === 'RESERVADO' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                }`}
              >
                {t('reserva.estados.reservado')}
              </button>
              <button
                onClick={() => setFiltroEstado('PENDIENTE')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filtroEstado === 'PENDIENTE' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                }`}
              >
                {t('reserva.estados.pendiente')}
              </button>
              <button
                onClick={() => setFiltroEstado('CANCELADA')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filtroEstado === 'CANCELADA' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                }`}
              >
                {t('reserva.estados.cancelada')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Lista de reservas *//*}
        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <Cargador tamanio="lg" color="text-blue-600" />
          </div>
        ) : reservasFiltradas.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              {filtroEstado === 'TODOS' 
                ? t('reservas.sinReservas') 
                : t('reservas.sinReservasEstado', { estado: getEstadoTexto(filtroEstado) })}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('reservas.explorarTours')}
            </p>
            <div className="mt-6">
              <Link 
                to="/tours" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ocean-600 hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500"
              >
                {t('reservas.verTours')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('reservas.tour')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('reservas.fecha')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('reservas.pasajeros')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('reservas.total')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('reservas.estado')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('reservas.acciones')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {reservasFiltradas.map(reserva => (
                    <tr key={reserva.id_reserva} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{getNombreTour(reserva)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {getHorarioTour(reserva)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatearFecha(reserva.fecha_tour || (reserva.instancia && reserva.instancia.fecha_especifica))}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t('reservas.reservadoEl')} {formatearFecha(reserva.fecha_reserva || reserva.fecha_creacion)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {getTotalPasajeros(reserva)} {t('reservas.pasajeros')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">S/ {reserva.total_pagar.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClase(reserva.estado)}`}>
                          {getEstadoTexto(reserva.estado)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/reservas/${reserva.id_reserva}`} 
                          className="text-ocean-600 hover:text-ocean-900 dark:text-ocean-400 dark:hover:text-ocean-300"
                        >
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
  );
};

export default PaginaReservasUsuario;*/


// ui/paginas/privadas/PaginaReservasUsuario.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../store';
import { listarMisReservas } from '../../../store/slices/sliceReserva';
import Cargador from '../../componentes/comunes/Cargador';
import Alerta from '../../componentes/comunes/Alerta';

// Define los tipos aquí ya que no se puede encontrar el módulo
type EstadoReserva = 'RESERVADO' | 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE' | 'PROCESADO' | 'ANULADO';

// Definición de tipos para las reservas
interface CantidadPasaje {
  id_tipo_pasaje: number;
  cantidad: number;
  precio_unitario: number;
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

const PaginaReservasUsuario = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas: reservasOriginales, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  
  // Tratar las reservas como ReservaExtendida
  const reservas = reservasOriginales as ReservaExtendida[];
  
  // Estado para filtros
  const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | 'TODOS'>('TODOS');
  const [reservasFiltradas, setReservasFiltradas] = useState<ReservaExtendida[]>(reservas);

  // Cargar reservas al montar el componente
  useEffect(() => {
    if (autenticado) {
      dispatch(listarMisReservas());
    }
  }, [dispatch, autenticado]);

  // Aplicar filtros cuando cambian las reservas o el filtro
  useEffect(() => {
    if (filtroEstado === 'TODOS') {
      setReservasFiltradas(reservas);
    } else {
      setReservasFiltradas(reservas.filter(r => r.estado === filtroEstado));
    }
  }, [reservas, filtroEstado]);

  // Función para obtener la clase de color según el estado
  const getEstadoClase = (estado: EstadoReserva) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'bg-teal-100 text-teal-800 border border-teal-200';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'PENDIENTE':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'RESERVADO':
      default:
        return 'bg-sky-100 text-sky-800 border border-sky-200';
    }
  };

  // Obtener texto traducido para el estado
  const getEstadoTexto = (estado: EstadoReserva) => {
    return t(`reserva.estados.${estado.toLowerCase()}`);
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fechaStr?: string) => {
    if (!fechaStr) return '';
    
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-PE', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return fechaStr;
    }
  };

  // Obtener nombre del tour
  const getNombreTour = (reserva: ReservaExtendida) => {
    return reserva.nombre_tour || 
           (reserva.instancia && reserva.instancia.nombre_tour) || 
           t('reservas.tourNoEspecificado');
  };

  // Obtener horario del tour
  const getHorarioTour = (reserva: ReservaExtendida) => {
    if (reserva.hora_inicio_tour && reserva.hora_fin_tour) {
      return `${reserva.hora_inicio_tour} - ${reserva.hora_fin_tour}`;
    }
    
    if (reserva.instancia && reserva.instancia.hora_inicio) {
      return reserva.instancia.hora_inicio;
    }
    
    return '';
  };

  // Obtener total de pasajeros
  const getTotalPasajeros = (reserva: ReservaExtendida) => {
    if (reserva.cantidad_pasajes && reserva.cantidad_pasajes.length > 0) {
      return reserva.cantidad_pasajes.reduce((total: number, p: CantidadPasaje) => total + p.cantidad, 0);
    }
    return 0;
  };

  if (!autenticado) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md border border-blue-100">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-sky-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{t('reservas.noSesion')}</h2>
          <p className="mt-2 text-gray-600">{t('reservas.iniciarSesionParaVerReservas')}</p>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {t('auth.iniciarSesion')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Encabezado */}
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-8 border border-blue-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full p-3 mr-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('menu.misReservas')}</h1>
                <p className="mt-1 text-gray-600 text-lg">{t('reservas.gestionReservas')}</p>
              </div>
            </div>
          </div>
          
          {/* Alertas y mensajes */}
          {error && (
            <div className="mb-6">
              <Alerta 
                mensaje={error} 
                tipo="error" 
              />
            </div>
          )}
          
          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-blue-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-800">
                  {t('reservas.filtrarPorEstado')}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFiltroEstado('TODOS')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                    filtroEstado === 'TODOS' 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${filtroEstado === 'TODOS' ? 'text-white' : 'text-gray-500'} mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  {t('reservas.todos')}
                </button>
                <button
                  onClick={() => setFiltroEstado('CONFIRMADA')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                    filtroEstado === 'CONFIRMADA' 
                      ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md' 
                      : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${filtroEstado === 'CONFIRMADA' ? 'text-white' : 'text-teal-500'} mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('reserva.estados.confirmada')}
                </button>
                <button
                  onClick={() => setFiltroEstado('RESERVADO')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                    filtroEstado === 'RESERVADO' 
                      ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-md' 
                      : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${filtroEstado === 'RESERVADO' ? 'text-white' : 'text-sky-500'} mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t('reserva.estados.reservado')}
                </button>
                <button
                  onClick={() => setFiltroEstado('PENDIENTE')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                    filtroEstado === 'PENDIENTE' 
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md' 
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${filtroEstado === 'PENDIENTE' ? 'text-white' : 'text-amber-500'} mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('reserva.estados.pendiente')}
                </button>
                <button
                  onClick={() => setFiltroEstado('CANCELADA')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                    filtroEstado === 'CANCELADA' 
                      ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md' 
                      : 'bg-red-50 text-red-800 hover:bg-red-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${filtroEstado === 'CANCELADA' ? 'text-white' : 'text-red-500'} mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t('reserva.estados.cancelada')}
                </button>
              </div>
            </div>
          </div>
          
          {/* Lista de reservas */}
          {cargando ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-md border border-blue-100">
              <Cargador tamanio="lg" color="text-blue-600" />
            </div>
          ) : reservasFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-10 text-center border border-blue-100">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-sky-50 border border-sky-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                {filtroEstado === 'TODOS' 
                  ? t('reservas.sinReservas') 
                  : t('reservas.sinReservasEstado', { estado: getEstadoTexto(filtroEstado) })}
              </h3>
              <p className="mt-3 text-gray-600 max-w-md mx-auto">
                {t('reservas.explorarTours')}
              </p>
              <div className="mt-8">
                <Link 
                  to="/tours" 
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('reservas.verTours')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {t('reservas.tour')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {t('reservas.fecha')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {t('reservas.pasajeros')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {t('reservas.total')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {t('reservas.estado')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center justify-end">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {t('reservas.acciones')}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reservasFiltradas.map(reserva => (
                      <tr key={reserva.id_reserva} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-8 h-8 rounded-md bg-sky-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">{getNombreTour(reserva)}</div>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {getHorarioTour(reserva)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">
                            {formatearFecha(reserva.fecha_tour || (reserva.instancia && reserva.instancia.fecha_especifica))}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {t('reservas.reservadoEl')} {formatearFecha(reserva.fecha_reserva || reserva.fecha_creacion)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-100">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {getTotalPasajeros(reserva)} {t('reservas.pasajeros')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-100">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              S/ {reserva.total_pagar.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getEstadoClase(reserva.estado)}`}>
                            {reserva.estado === 'CONFIRMADA' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {reserva.estado === 'RESERVADO' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                            {reserva.estado === 'PENDIENTE' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {reserva.estado === 'CANCELADA' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                            {getEstadoTexto(reserva.estado)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <Link 
                            to={`/reservas/${reserva.id_reserva}`} 
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all inline-flex items-center border border-blue-100 shadow-sm hover:shadow"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export default PaginaReservasUsuario;