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




/*
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
      window.scrollTo(0, 0);

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
          {/* Encabezado *//*}
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
          
          {/* Alertas y mensajes *//*}
          {error && (
            <div className="mb-6">
              <Alerta 
                mensaje={error} 
                tipo="error" 
              />
            </div>
          )}
          
          {/* Filtros *//*}
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
          
          {/* Lista de reservas *//*}
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

export default PaginaReservasUsuario;*/
import { useEffect, useState, useMemo } from 'react';
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
      // Normalizar la fecha - manejar diferentes formatos
      let fecha: Date;
      
      // Si viene en formato ISO o con timezone
      if (fechaStr.includes('T') || fechaStr.includes('Z')) {
        fecha = new Date(fechaStr);
      } else {
        // Si viene solo la fecha (YYYY-MM-DD)
        const partes = fechaStr.split('-');
        if (partes.length === 3) {
          fecha = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
        } else {
          fecha = new Date(fechaStr);
        }
      }
      
      // Verificar si la fecha es válida
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
          
          // Para fechas más lejanas, usar formato corto
          opciones.year = 'numeric';
          opciones.month = 'short';
          opciones.day = 'numeric';
          break;
      }

      return fecha.toLocaleDateString('es-PE', opciones);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
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

  // Obtener fecha del tour
  const getFechaTour = (reserva: ReservaExtendida): string => {
    return reserva.fecha_tour || 
           (reserva.instancia && reserva.instancia.fecha_especifica) || 
           '';
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
          {/* Encabezado mejorado */}
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
              
              {/* Estadísticas rápidas */}
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
          
          {/* Alertas y mensajes */}
          {error && (
            <div className="mb-6">
              <Alerta 
                mensaje={error} 
                tipo="error" 
              />
            </div>
          )}
          
          {/* Filtros mejorados */}
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
          
          {/* Lista de reservas */}
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
                        {/* Tour */}
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
                        
                        {/* Fecha */}
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
                        
                        {/* Pasajeros */}
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
                        
                        {/* Total */}
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
                        
                        {/* Estado */}
                        <td className="px-6 py-6">
                          <span className={`px-4 py-2 inline-flex items-center text-sm leading-5 font-semibold rounded-xl ${getEstadoClase(reserva.estado)}`}>
                            {getEstadoIcono(reserva.estado)}
                            <span className="ml-2">{getEstadoTexto(reserva.estado)}</span>
                          </span>
                        </td>
                        
                        {/* Acciones */}
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

export default PaginaReservasUsuario;