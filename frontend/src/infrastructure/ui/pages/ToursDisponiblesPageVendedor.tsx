import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../infrastructure/store';
import { 
  FiAnchor, 
  FiCalendar, 
  FiUsers, 
  FiDollarSign, 
  FiClock, 
  FiSearch, 
  FiMapPin, 
  FiAlertCircle,
  FiRefreshCw, 
  FiInfo, 
  FiChevronRight,
  FiImage
} from 'react-icons/fi';
import { 
  format, 
  parse, 
  isValid, 
  differenceInMinutes, 
  addDays, 
  parseISO, 
  isToday, 
  isTomorrow
} from 'date-fns';
import { es } from 'date-fns/locale';
import axios from '../../../infrastructure/api/axiosClient';
import { endpoints } from '../../../infrastructure/api/endpoints';

// Interfaces correctamente definidas
interface StringWithValidity {
  String: string;
  Valid: boolean;
}

interface Int64WithValidity {
  Int64: number;
  Valid: boolean;
}

interface InstanciaTour {
  id_instancia: number;
  id_tour_programado: number;
  fecha_especifica: string;
  hora_inicio: string;
  hora_fin: string;
  id_chofer: number | null;
  id_embarcacion: number;
  cupo_disponible: number;
  estado: 'PROGRAMADO' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';
  eliminado: boolean;
  
  // Campos adicionales
  nombre_tipo_tour?: string;
  nombre_embarcacion?: string;
  nombre_sede?: string;
  hora_inicio_str?: string;
  hora_fin_str?: string;
  fecha_especifica_str?: string;
  
  // Relación con tour programado
  tour_programado?: TourProgramado;
}

interface TourProgramado {
  id_tour_programado: number;
  id_tipo_tour: number;
  id_embarcacion: number;
  id_horario: number;
  id_sede: number;
  id_chofer: Int64WithValidity | null;
  fecha: string;
  vigencia_desde: string;
  vigencia_hasta: string;
  cupo_maximo: number;
  cupo_disponible: number;
  estado: string;
  eliminado: boolean;
  es_excepcion: boolean;
  notas_excepcion: StringWithValidity | null;
  
  // Campos relacionados
  nombre_tipo_tour?: string;
  nombre_embarcacion?: string;
  nombre_sede?: string;
  hora_inicio?: string;
  hora_fin?: string;
  
  // Relaciones
  tipo_tour?: TipoTour;
  galeria_imagenes?: GaleriaTour[];
  tipos_pasaje?: TipoPasaje[];
  paquetes_pasajes?: PaquetePasajes[];
}

interface TipoTour {
  id_tipo_tour: number;
  id_sede: number;
  nombre: string;
  descripcion: StringWithValidity | string | null;
  duracion_minutos: number;
  url_imagen: StringWithValidity | string | null;
  eliminado: boolean;
  nombre_sede?: string;
}

interface TipoPasaje {
  id_tipo_pasaje: number;
  id_sede: number;
  id_tipo_tour: number;
  nombre: string;
  costo: number;
  edad: string;
  eliminado: boolean;
}

interface PaquetePasajes {
  id_paquete: number;
  id_sede: number;
  id_tipo_tour: number;
  nombre: string;
  descripcion: string;
  precio_total: number;
  cantidad_total: number;
  eliminado: boolean;
}

interface GaleriaTour {
  id: number;
  tipo_tour_id: number;
  imagen_url: string;
  descripcion?: string;
  es_portada: boolean;
}

interface FiltrosInstanciaTour {
  id_tour_programado?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: string;
  id_embarcacion?: number;
  id_sede?: number;
  id_tipo_tour?: number;
}

// Funciones de utilidad con mejor tipado
const isStringWithValidity = (obj: any): obj is StringWithValidity => {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'String' in obj &&
    'Valid' in obj &&
    typeof obj.Valid === 'boolean'
  );
};

const isInt64WithValidity = (obj: any): obj is Int64WithValidity => {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'Int64' in obj &&
    'Valid' in obj &&
    typeof obj.Valid === 'boolean'
  );
};

// Componente principal
const ToursDisponiblesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Valores actuales con fecha actualizada
  const currentDateTime = "2025-06-26 05:39:32";
  const currentUser = "Angel226m";
  
  // Estado
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [instanciasTour, setInstanciasTour] = useState<InstanciaTour[]>([]);
  const [tiposTour, setTiposTour] = useState<TipoTour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [nextDates, setNextDates] = useState<string[]>([]);
  const [filteredInstancias, setFilteredInstancias] = useState<InstanciaTour[]>([]);
  const [selectedTipoTour, setSelectedTipoTour] = useState<number | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sedeError, setSedeError] = useState(false);
  const [selectedInstancia, setSelectedInstancia] = useState<InstanciaTour | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Verificar autenticación y sede
  const checkAuthAndSede = useCallback(() => {
    if (isAuthenticated) {
      setIsAuthReady(true);
      
      if (selectedSede?.id_sede) {
        setSedeError(false);
        return true;
      } else {
        setSedeError(true);
        return false;
      }
    } else {
      return false;
    }
  }, [isAuthenticated, selectedSede]);
  
  useEffect(() => {
    checkAuthAndSede();
  }, [checkAuthAndSede]);
  
  // Función mejorada para manejar diferentes tipos de valores de string
  const safeGetStringValue = (obj: any): string => {
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'string') return obj;
    
    if (isStringWithValidity(obj)) {
      return obj.Valid ? obj.String : '';
    }
    
    return String(obj);
  };
  
  // Función mejorada para manejar diferentes tipos de valores numéricos
  const safeGetNumberValue = (obj: any): number | null => {
    if (obj === null || obj === undefined) return null;
    if (typeof obj === 'number') return obj;
    
    if (isInt64WithValidity(obj)) {
      return obj.Valid ? obj.Int64 : null;
    }
    
    return null;
  };
  
  const safeFormatDate = (dateString: string | undefined | null, formatStr: string, defaultValue: string = '-'): string => {
    if (!dateString) return defaultValue;
    
    try {
      if (dateString.includes('T')) {
        const date = parseISO(dateString);
        if (isValid(date)) {
          return format(date, formatStr, { locale: es });
        }
      }
      
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      if (isValid(date)) {
        return format(date, formatStr, { locale: es });
      }
    } catch (error) {
      console.error(`Error al formatear fecha: ${dateString}`, error);
    }
    
    return defaultValue;
  };
  
  // Generar próximos días
  useEffect(() => {
    const dates = [];
    try {
      const baseDate = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = addDays(baseDate, i);
        dates.push(format(date, 'yyyy-MM-dd'));
      }
      
      setNextDates(dates);
    } catch (error) {
      console.error("Error al generar fechas:", error);
      const today = new Date();
      const fallbackDates = [];
      for (let i = 0; i < 7; i++) {
        const date = addDays(today, i);
        fallbackDates.push(format(date, 'yyyy-MM-dd'));
      }
      setNextDates(fallbackDates);
    }
  }, []);
  
  // Funciones para obtener datos
  const getDataArray = <T,>(response: any): T[] => {
    try {
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      if (response.data && typeof response.data === 'object') {
        const arrayProps = Object.keys(response.data).filter(key => 
          Array.isArray(response.data[key])
        );
        
        if (arrayProps.length > 0) {
          return response.data[arrayProps[0]];
        }
      }
    } catch (error) {
      console.error('Error al procesar datos de array:', error);
    }
    
    return [];
  };
  
  const getSingleObject = <T,>(response: any): T | null => {
    try {
      if (!response.data) return null;
      
      if (typeof response.data === 'object' && !Array.isArray(response.data)) {
        if (response.data.data && !Array.isArray(response.data.data)) {
          return response.data.data as T;
        }
        return response.data as T;
      }
      
      if (Array.isArray(response.data) && response.data.length === 1) {
        return response.data[0] as T;
      }
      
      if (Array.isArray(response.data)) {
        return response.data[0] as T;
      }
    } catch (error) {
      console.error('Error al procesar datos de objeto:', error);
    }
    
    return null;
  };
  
  // Cargar datos
  const fetchData = useCallback(async () => {
    try {
      if (!checkAuthAndSede()) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setLoadError(null);
      
      // Cargar tipos de tour
      const fetchTiposTour = async () => {
        try {
          const response = await axios.get(endpoints.tiposTour.vendedorList);
          
          const tiposTourArray = getDataArray<TipoTour>(response);
          const tiposTourSede = tiposTourArray.filter(tipo => 
            tipo.id_sede === selectedSede!.id_sede
          );
          
          setTiposTour(tiposTourSede);
          return true;
        } catch (error) {
          console.error('Error al cargar tipos de tour:', error);
          setLoadError("Error al cargar tipos de tour. Intente recargar la página.");
          return false;
        }
      };
      
      // Cargar instancias de tour
      const fetchInstanciasTour = async () => {
        try {
          const filtro: FiltrosInstanciaTour = {
            fecha_inicio: selectedDate,
            fecha_fin: selectedDate,
            estado: 'PROGRAMADO',
            id_sede: selectedSede!.id_sede
          };
          
          if (selectedTipoTour) {
            filtro.id_tipo_tour = selectedTipoTour;
          }
          
          const response = await axios.post(endpoints.instanciaTour.vendedorFiltrar, filtro);
          
          const instanciasArray = getDataArray<InstanciaTour>(response);
          
          if (instanciasArray.length === 0) {
            setInstanciasTour([]);
            setFilteredInstancias([]);
            return true;
          }
          
          // Enriquecer instancias
          const instanciasEnriquecidas = await Promise.all(
            instanciasArray.map(async (instancia: InstanciaTour) => {
              try {
                const tourResponse = await axios.get(
                  endpoints.tourProgramado.vendedorGetById(instancia.id_tour_programado)
                );
                
                const tourData = getSingleObject<TourProgramado>(tourResponse);
                
                if (tourData) {
                  const tourDataSafe = { ...tourData };
                  
                  instancia.tour_programado = tourDataSafe;
                  
                  if (instancia.tour_programado.id_tipo_tour) {
                    const tipoTourId = instancia.tour_programado.id_tipo_tour;
                    
                    try {
                      const tipoTourResponse = await axios.get(
                        endpoints.tiposTour.vendedorGetById(tipoTourId)
                      );
                      
                      const tipoTourData = getSingleObject<TipoTour>(tipoTourResponse);
                      
                      if (tipoTourData) {
                        instancia.tour_programado.tipo_tour = tipoTourData;
                        
                        // Cargar galería
                        try {
                          const galeriaResponse = await axios.get(
                            endpoints.galeriaTour.vendedorListByTipoTour(tipoTourId)
                          );
                          
                          const galeriaData = getDataArray<GaleriaTour>(galeriaResponse);
                          instancia.tour_programado.galeria_imagenes = galeriaData;
                        } catch (err) {
                          instancia.tour_programado.galeria_imagenes = [];
                        }
                        
                        // Cargar tipos de pasaje
                        try {
                          const tiposPasajeResponse = await axios.get(
                            endpoints.tipoPasaje.vendedorListByTipoTour(tipoTourId)
                          );
                          
                          const tiposPasajeData = getDataArray<TipoPasaje>(tiposPasajeResponse);
                          instancia.tour_programado.tipos_pasaje = tiposPasajeData;
                        } catch (err) {
                          instancia.tour_programado.tipos_pasaje = [];
                        }
                        
                        // Cargar paquetes
                        try {
                          const paquetesResponse = await axios.get(
                            endpoints.paquetePasajes.vendedorListByTipoTour(tipoTourId)
                          );
                          
                          const paquetesData = getDataArray<PaquetePasajes>(paquetesResponse);
                          instancia.tour_programado.paquetes_pasajes = paquetesData;
                        } catch (err) {
                          instancia.tour_programado.paquetes_pasajes = [];
                        }
                      }
                    } catch (err) {
                      console.error(`Error al cargar tipo de tour ${tipoTourId}:`, err);
                    }
                  }
                }
              } catch (err) {
                console.error('Error al obtener detalles adicionales:', err);
              }
              return instancia;
            })
          );
          
          setInstanciasTour(instanciasEnriquecidas);
          setFilteredInstancias(instanciasEnriquecidas);
          return true;
        } catch (error) {
          console.error('Error al cargar instancias de tour:', error);
          setLoadError("Error al cargar instancias de tour. Intente recargar la página.");
          return false;
        }
      };
      
      // Ejecutar cargas
      const tiposTourLoaded = await fetchTiposTour();
      if (tiposTourLoaded) {
        await fetchInstanciasTour();
      }
      
      setDataLoaded(true);
      
    } catch (error) {
      console.error('Error general al cargar datos:', error);
      setLoadError("Error al cargar datos. Intente recargar la página.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedSede, selectedTipoTour, checkAuthAndSede]);
  
  // Cargar datos iniciales
  useEffect(() => {
    if (isAuthReady && selectedSede && !dataLoaded) {
      fetchData();
    }
  }, [isAuthReady, selectedSede, dataLoaded, fetchData]);
  
  // Recargar cuando cambian filtros
  useEffect(() => {
    if (dataLoaded && !sedeError) {
      fetchData();
    }
  }, [selectedDate, selectedTipoTour, fetchData, dataLoaded, sedeError]);
  
  // Filtrar por búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInstancias(instanciasTour);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = instanciasTour.filter(instancia => {
      const nombreTipoTour = safeGetStringValue(instancia.nombre_tipo_tour || 
                            instancia.tour_programado?.tipo_tour?.nombre).toLowerCase();
      const descripcionTipoTour = safeGetStringValue(instancia.tour_programado?.tipo_tour?.descripcion).toLowerCase();
      const nombreSede = safeGetStringValue(instancia.nombre_sede).toLowerCase();
      const nombreEmbarcacion = safeGetStringValue(instancia.nombre_embarcacion).toLowerCase();
      
      return nombreTipoTour.includes(lowerSearchTerm) || 
             descripcionTipoTour.includes(lowerSearchTerm) || 
             nombreSede.includes(lowerSearchTerm) ||
             nombreEmbarcacion.includes(lowerSearchTerm);
    });
    
    setFilteredInstancias(filtered);
  }, [searchTerm, instanciasTour]);
  
  // Funciones para UI
  const handleForceReload = () => {
    fetchData();
  };
  
  const handleSelectInstancia = (instancia: InstanciaTour) => {
    setSelectedInstancia(instancia);
    setShowDetailModal(true);
  };
  
  const handleProceedToReservation = (instancia: InstanciaTour) => {
    // Aquí solo navegar a la página de nueva reserva con el ID de la instancia
    navigate(`/vendedor/reservas/nueva?instanciaId=${instancia.id_instancia}`);
  };
  
  // Función mejorada para formatear la hora
  const formatearHora = (hora: string): string => {
    if (!hora) return '-';
    
    try {
      // Si es formato ISO con T
      if (hora.includes('T')) {
        const date = new Date(hora);
        if (isValid(date)) {
          return format(date, 'hh:mm a', { locale: es });
        }
      }
      
      // Si es formato HH:mm:ss
      const parsedHora = parse(hora, 'HH:mm:ss', new Date());
      if (isValid(parsedHora)) {
        return format(parsedHora, 'hh:mm a', { locale: es });
      }
    } catch (error) {
      console.error(`Error al formatear hora: ${hora}`, error);
    }
    
    return hora;
  };
  
  const formatearFecha = (fecha: string): string => {
    return safeFormatDate(fecha, 'EEEE dd MMMM yyyy');
  };
  
  const formatearFechaCorta = (fecha: string): string => {
    return safeFormatDate(fecha, 'EEE dd MMM');
  };
  
  // Función mejorada para calcular la duración
  const calcularDuracion = (instancia: InstanciaTour): string => {
    // Primero intentar con la duración del tipo de tour
    const duracionMinutos = instancia.tour_programado?.tipo_tour?.duracion_minutos;
    
    if (duracionMinutos) {
      if (duracionMinutos >= 60) {
        const horas = Math.floor(duracionMinutos / 60);
        const minutos = duracionMinutos % 60;
        return `${horas}h ${minutos > 0 ? `${minutos}min` : ''}`;
      } else {
        return `${duracionMinutos} minutos`;
      }
    }
    
    // Si no hay duración en tipo_tour, calcular de las horas
    if (instancia.hora_inicio && instancia.hora_fin) {
      try {
        // Intentar como formato ISO
        if (instancia.hora_inicio.includes('T') && instancia.hora_fin.includes('T')) {
          const inicio = new Date(instancia.hora_inicio);
          const fin = new Date(instancia.hora_fin);
          
          if (isValid(inicio) && isValid(fin)) {
            let minutes = differenceInMinutes(fin, inicio);
            if (minutes < 0) minutes += 24 * 60;
            
            if (minutes >= 60) {
              const horas = Math.floor(minutes / 60);
              const minutos = minutes % 60;
              return `${horas}h ${minutos > 0 ? `${minutos}min` : ''}`;
            } else {
              return `${minutes} minutos`;
            }
          }
        }
        
        // Intentar como formato HH:mm:ss
        const inicio = parse(instancia.hora_inicio, 'HH:mm:ss', new Date());
        const fin = parse(instancia.hora_fin, 'HH:mm:ss', new Date());
        
        if (isValid(inicio) && isValid(fin)) {
          let minutes = differenceInMinutes(fin, inicio);
          if (minutes < 0) minutes += 24 * 60;
          
          if (minutes >= 60) {
            const horas = Math.floor(minutes / 60);
            const minutos = minutes % 60;
            return `${horas}h ${minutos > 0 ? `${minutos}min` : ''}`;
          } else {
            return `${minutes} minutos`;
          }
        }
      } catch (e) {
        console.error('Error al calcular duración:', e);
      }
    }
    
    return 'Duración no disponible';
  };
  
  const precioMinimo = (instancia: InstanciaTour): number => {
    if (!instancia.tour_programado?.tipos_pasaje?.length) return 0;
    
    const precios = instancia.tour_programado.tipos_pasaje.map(tp => tp.costo);
    if (precios.length > 0) {
      return Math.min(...precios);
    }
    
    return 0;
  };
  
  const getImagenTour = (instancia: InstanciaTour): string => {
    try {
      // Verificar tipo_tour
      if (instancia.tour_programado?.tipo_tour?.url_imagen) {
        const urlImagen = instancia.tour_programado.tipo_tour.url_imagen;
        
        if (typeof urlImagen === 'string') {
          return urlImagen;
        }
        
        if (isStringWithValidity(urlImagen) && urlImagen.Valid) {
          return urlImagen.String;
        }
      }
      
      // Verificar galería
      const galeria = instancia.tour_programado?.galeria_imagenes || [];
      
      if (galeria.length > 0) {
        const imagenPortada = galeria.find(img => img.es_portada);
        if (imagenPortada?.imagen_url) {
          return imagenPortada.imagen_url;
        }
        
        if (galeria[0]?.imagen_url) {
          return galeria[0].imagen_url;
        }
      }
      
      return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
    } catch (error) {
      console.error("Error al obtener imagen del tour:", error);
      return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
    }
  };
  
  const getImagenesGaleria = (instancia: InstanciaTour): GaleriaTour[] => {
    const galeria = instancia.tour_programado?.galeria_imagenes || [];
    
    return galeria.filter(img => 
      img && 
      img.imagen_url && 
      typeof img.imagen_url === 'string' && 
      img.imagen_url.trim() !== ''
    );
  };
  
  const getNombreTipoTour = (instancia: InstanciaTour): string => {
    return safeGetStringValue(instancia.nombre_tipo_tour) || 
           safeGetStringValue(instancia.tour_programado?.tipo_tour?.nombre) || 
           'Tour';
  };
  
  const getDescripcionTipoTour = (instancia: InstanciaTour): string => {
    if (instancia.tour_programado?.tipo_tour?.descripcion) {
      return safeGetStringValue(instancia.tour_programado.tipo_tour.descripcion);
    }
    
    if (instancia.tour_programado?.notas_excepcion) {
      return safeGetStringValue(instancia.tour_programado.notas_excepcion);
    }
    
    return 'Sin descripción disponible';
  };
  
  // Renderizado de fechas
  const renderFechaCorta = (fecha: string): React.ReactNode => {
    try {
      const parsedFecha = parse(fecha, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedFecha)) {
        return <span className="text-xs">{fecha}</span>;
      }
      
      const esHoy = isToday(parsedFecha);
      const esMañana = isTomorrow(parsedFecha);
      
      return (
        <div className="flex flex-col items-center text-center">
          <span className={`text-xs uppercase font-bold mb-1 ${esHoy ? 'text-green-600' : esMañana ? 'text-blue-600' : 'text-gray-600'}`}>
            {esHoy ? 'HOY' : esMañana ? 'MAÑANA' : format(parsedFecha, 'EEE', { locale: es })}
          </span>
          <span className={`text-lg font-bold ${esHoy ? 'text-green-700' : esMañana ? 'text-blue-700' : 'text-gray-700'}`}>
            {format(parsedFecha, 'dd', { locale: es })}
          </span>
          <span className={`text-xs mt-1 capitalize ${esHoy ? 'text-green-600' : esMañana ? 'text-blue-600' : 'text-gray-500'}`}>
            {format(parsedFecha, 'MMM', { locale: es })}
          </span>
        </div>
      );
    } catch (error) {
      console.error(`Error al renderizar fecha corta: ${fecha}`, error);
      return <span>{fecha}</span>;
    }
  };
  
  const renderFechaInstancia = (instancia: InstanciaTour): React.ReactNode => {
    try {
      if (!instancia.fecha_especifica) {
        return <span>Fecha no disponible</span>;
      }
      
      const fecha = instancia.fecha_especifica;
      const parsedFecha = parse(fecha, 'yyyy-MM-dd', new Date());
      
      if (!isValid(parsedFecha)) {
        return <span>{fecha}</span>;
      }
      
      return (
        <span>{format(parsedFecha, 'dd MMM yyyy', { locale: es })}</span>
      );
    } catch (error) {
      console.error(`Error al renderizar fecha de instancia`, error);
      return <span>Fecha no disponible</span>;
    }
  };
  
  // Si la autenticación no está lista o hay error de sede
  if (!isAuthReady || sedeError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              {!isAuthReady ? (
                <>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
                  <h2 className="mt-6 text-2xl font-bold text-gray-700">Verificando sesión...</h2>
                  <p className="mt-3 text-gray-500">Por favor espere mientras verificamos su cuenta.</p>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center">
                    <div className="bg-red-100 p-4 rounded-full">
                      <FiAlertCircle className="text-6xl text-red-500" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-800">No hay sede seleccionada</h2>
                    <p className="mt-4 text-gray-600 max-w-md mx-auto leading-relaxed">
                      Su cuenta no tiene una sede asignada. Contacte con el administrador del sistema para 
                      que le asigne una sede y pueda acceder a los tours disponibles.
                    </p>
                    
                    <button 
                      onClick={handleForceReload}
                      className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-8 rounded-lg font-semibold flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FiRefreshCw className="mr-2" /> Actualizar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Modal para detalles del tour
  const TourDetailModal = () => {
    if (!selectedInstancia) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          {/* Imagen de cabecera */}
          <div className="relative h-64 overflow-hidden rounded-t-lg">
            <img 
              src={getImagenTour(selectedInstancia)} 
              alt={getNombreTipoTour(selectedInstancia)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6">
              <h2 className="text-3xl font-bold text-white">{getNombreTipoTour(selectedInstancia)}</h2>
              <p className="text-white text-opacity-90 flex items-center">
                <FiMapPin className="mr-2" />
                {safeGetStringValue(selectedInstancia.nombre_sede || selectedSede?.nombre)}
                <span className="mx-2">•</span>
                <FiCalendar className="mr-2" />
                {renderFechaInstancia(selectedInstancia)}
              </p>
            </div>
          </div>
          
          {/* Contenido */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <FiClock className="text-blue-600 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Duración</p>
                  <p className="font-semibold">{calcularDuracion(selectedInstancia)}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <FiUsers className="text-green-600 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Disponibilidad</p>
                  <p className="font-semibold">{selectedInstancia.cupo_disponible} de {selectedInstancia.tour_programado?.cupo_maximo || '?'}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                <FiDollarSign className="text-amber-600 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Precio desde</p>
                  <p className="font-semibold">S/ {precioMinimo(selectedInstancia).toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{getDescripcionTipoTour(selectedInstancia)}</p>
            </div>
            
            {/* Información de horarios */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FiClock className="mr-2 text-blue-600" /> Horarios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FiClock className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hora de salida</p>
                    <p className="font-semibold">{formatearHora(selectedInstancia.hora_inicio)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FiClock className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hora de regreso</p>
                    <p className="font-semibold">{formatearHora(selectedInstancia.hora_fin)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tipos de pasaje */}
            {selectedInstancia.tour_programado?.tipos_pasaje && selectedInstancia.tour_programado.tipos_pasaje.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FiDollarSign className="mr-2 text-green-600" /> Tipos de Pasaje
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedInstancia.tour_programado.tipos_pasaje.map(tipo => (
                    <div key={tipo.id_tipo_pasaje} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{safeGetStringValue(tipo.nombre)}</p>
                        <p className="text-sm text-gray-500">Edad: {tipo.edad}</p>
                      </div>
                      <span className="font-bold text-green-600">S/ {tipo.costo.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Paquetes */}
            {selectedInstancia.tour_programado?.paquetes_pasajes && selectedInstancia.tour_programado.paquetes_pasajes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FiDollarSign className="mr-2 text-purple-600" /> Paquetes Especiales
                </h3>
                <div className="space-y-3">
                  {selectedInstancia.tour_programado.paquetes_pasajes.map(paquete => (
                    <div key={paquete.id_paquete} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium">{safeGetStringValue(paquete.nombre)}</p>
                        <span className="font-bold text-green-600">S/ {paquete.precio_total.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{safeGetStringValue(paquete.descripcion)}</p>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                        Incluye {paquete.cantidad_total} pasajes
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Galería */}
            {getImagenesGaleria(selectedInstancia).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FiImage className="mr-2 text-blue-600" /> Galería
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {getImagenesGaleria(selectedInstancia).map((img, index) => (
                    <div key={img.id || index} className="h-32 rounded-lg overflow-hidden shadow-md">
                      <img 
                        src={img.imagen_url} 
                        alt={safeGetStringValue(img.descripcion) || `Imagen ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Botón de acción */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  handleProceedToReservation(selectedInstancia);
                  setShowDetailModal(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors shadow-md hover:shadow-lg"
              >
                <FiChevronRight className="mr-2" /> Continuar a Reserva
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Encabezado */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🏖️ Tours Disponibles</h1>
              <p className="text-gray-600 flex items-center">
                <FiCalendar className="mr-2 text-blue-500" />
                <span className="font-medium">{formatearFecha(selectedDate)}</span>
                <span className="mx-2">•</span>
                <FiMapPin className="mr-2 text-green-500" />
                <span className="font-medium">{safeGetStringValue(selectedSede?.nombre)}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleForceReload}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-all duration-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md"
                disabled={loading}
              >
                <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> 
                <span>Actualizar</span>
              </button>
              
              <div className="flex items-center bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                <FiCalendar className="text-gray-500 ml-2 mr-2" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-0 px-2 py-1 focus:ring-0 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Mensaje de error */}
        {loadError && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200 text-red-700 flex items-start shadow-lg">
            <div className="bg-red-200 p-2 rounded-full mr-4 flex-shrink-0">
              <FiAlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">{loadError}</p>
              <button 
                onClick={handleForceReload}
                className="mt-3 text-sm bg-red-200 hover:bg-red-300 text-red-800 px-6 py-2 rounded-lg inline-flex items-center font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FiRefreshCw className="mr-2" /> Reintentar
              </button>
            </div>
          </div>
        )}
        
        {/* Selector de fechas rápido */}
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiCalendar className="mr-2 text-blue-500" />
            Seleccionar Fecha
          </h3>
          <div className="flex space-x-3">
            {nextDates.map((date) => {
              const esSeleccionado = selectedDate === date;
              const fechaObj = parse(date, 'yyyy-MM-dd', new Date());
              const esHoy = isToday(fechaObj);
              const esMañana = isTomorrow(fechaObj);
              
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-4 py-4 rounded-xl font-medium whitespace-nowrap min-w-[120px] transition-all duration-200 ${
                    esSeleccionado
                      ? esHoy 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl' 
                        : esMañana
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl'
                        : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl'
                      : esHoy
                      ? 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100'
                      : esMañana
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 hover:bg-blue-100'
                      : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
                  } shadow-md hover:shadow-lg`}
                >
                  {renderFechaCorta(date)}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Filtros y búsqueda */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiSearch className="mr-2 text-blue-500" />
            Buscar Tours
          </h3>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar por nombre, descripción, embarcación..."
                className="pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-4 top-4.5 text-gray-400 text-lg" />
            </div>
            
            <div className="md:w-1/3">
              <select
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium bg-white"
                value={selectedTipoTour || ''}
                onChange={(e) => setSelectedTipoTour(e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <option value="">🎯 Todos los tipos de tour</option>
                {tiposTour.map(tipo => (
                  <option key={tipo.id_tipo_tour} value={tipo.id_tipo_tour}>
                    {safeGetStringValue(tipo.nombre)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Lista de tours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Placeholders de carga
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                  
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : filteredInstancias.length === 0 ? (
            <div className="col-span-full">
              <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiAnchor className="text-4xl text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-700 mb-3">No se encontraron tours disponibles</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                  No hay tours programados para el día <span className="font-semibold">{formatearFecha(selectedDate)}</span> o con los filtros seleccionados.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => {
                      setSelectedDate(nextDates[0]);
                      setSearchTerm('');
                      setSelectedTipoTour(undefined);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg inline-flex items-center justify-center font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FiCalendar className="mr-2" /> Ver tours de hoy
                  </button>
                  <button 
                    onClick={handleForceReload}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg inline-flex items-center justify-center font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <FiRefreshCw className="mr-2" /> Actualizar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            filteredInstancias.map(instancia => (
              <div 
                key={instancia.id_instancia} 
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {/* Imagen */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getImagenTour(instancia)} 
                    alt={getNombreTipoTour(instancia)}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex justify-between items-end">
                      <div className="text-white">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 inline-block">
                          <FiMapPin className="inline mr-1" /> 
                          <span className="font-semibold">{safeGetStringValue(instancia.nombre_sede || selectedSede?.nombre)}</span>
                        </div>
                      </div>
                      <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm">
                        <FiClock className="inline mr-1" /> {formatearHora(instancia.hora_inicio)}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                      {instancia.estado}
                    </div>
                  </div>
                </div>
                
                {/* Contenido */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{getNombreTipoTour(instancia)}</h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {getDescripcionTipoTour(instancia)}
                  </p>
                  
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-700">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg mr-2">
                        <FiClock className="text-blue-600" /> 
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duración</p>
                        <p className="font-semibold">{calcularDuracion(instancia)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg mr-2">
                        <FiUsers className="text-green-600" /> 
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Disponibles</p>
                        <p className="font-semibold">{instancia.cupo_disponible} cupos</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-5">
                    <span className="flex items-center text-gray-800 font-bold text-xl">
                      <FiDollarSign className="text-green-600 mr-1" /> 
                      <span className="text-green-600">S/ {precioMinimo(instancia).toFixed(2)}</span>
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {renderFechaInstancia(instancia)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleSelectInstancia(instancia)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                  >
                    <FiInfo className="mr-2" /> Ver Detalles
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Modal de detalles */}
      {showDetailModal && <TourDetailModal />}
      
      {/* Overlay de carga global */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
            <p className="text-xl font-semibold text-gray-700 mb-2">Cargando tours disponibles...</p>
            <p className="text-sm text-gray-500">Esto puede tomar unos momentos</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToursDisponiblesPage;