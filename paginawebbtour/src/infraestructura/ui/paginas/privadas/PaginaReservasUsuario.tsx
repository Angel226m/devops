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
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-ocean-600 to-cyan-500 text-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">{t('menu.misReservas')}</h1>
          <p className="opacity-90">{t('reservas.gestionReservas')}</p>
        </div>
        
        {/* Alertas y mensajes */}
        {error && (
          <Alerta 
            mensaje={error} 
            tipo="error" 
          />
        )}
        
        {/* Filtros */}
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
        
        {/* Lista de reservas */}
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

export default PaginaReservasUsuario;