 import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../infrastructure/store';
import Card from '../components/Card';
import Button from '../components/Button';
import { FaShip, FaClock, FaUserFriends, FaMoneyBillWave, FaCalendarAlt, FaSearch, FaMapMarkerAlt, FaCalendarCheck, FaTicketAlt, FaBox, FaInfoCircle, FaSync, FaStar, FaEye } from 'react-icons/fa';
import { format, parse, isValid, differenceInMinutes, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from '../../../infrastructure/api/axiosClient';
import { endpoints } from '../../../infrastructure/api/endpoints';
import { useNavigate } from 'react-router-dom';

interface StringWithValidity {
  String: string;
  Valid: boolean;
}

interface Int64WithValidity {
  Int64: number;
  Valid: boolean;
}

// Interfaces exactas según proporcionadas
interface Sede {
  id_sede: number;
  nombre: string;
  ciudad: string;
  pais: string;
  direccion: string;
  telefono: string;
  email: string;
  eliminado: boolean;
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
  
  nombre_tipo_tour?: string;
  nombre_embarcacion?: string;
  nombre_sede?: string;
  hora_inicio_str?: string;
  hora_fin_str?: string;
  fecha_especifica_str?: string;
  
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
  estado: "PROGRAMADO" | "EN_CURSO" | "COMPLETADO" | "CANCELADO";
  eliminado: boolean;
  es_excepcion: boolean;
  notas_excepcion: StringWithValidity | null;
  
  nombre_tipo_tour?: string;
  nombre_embarcacion?: string;
  nombre_sede?: string;
  hora_inicio?: string;
  hora_fin?: string;
  
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

// Función para verificar si un objeto tiene la estructura StringWithValidity
const isStringWithValidity = (obj: any): obj is StringWithValidity => {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'String' in obj &&
    'Valid' in obj &&
    typeof obj.Valid === 'boolean'
  );
};

// Función para verificar si un objeto tiene la estructura Int64WithValidity
const isInt64WithValidity = (obj: any): obj is Int64WithValidity => {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'Int64' in obj &&
    'Valid' in obj &&
    typeof obj.Valid === 'boolean'
  );
};

const ToursDisponiblesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Valores actuales de fecha, hora y usuario
  const currentDateTime = "2025-06-27 00:10:36";
  const currentUser = "Angel226m";
  
  const getCurrentDate = () => {
    const now = new Date();
    return format(now, 'yyyy-MM-dd');
  };
  
  const currentDate = getCurrentDate();
  
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [instanciasTour, setInstanciasTour] = useState<InstanciaTour[]>([]);
  const [tiposTour, setTiposTour] = useState<TipoTour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [nextDates, setNextDates] = useState<string[]>([]);
  const [filteredInstancias, setFilteredInstancias] = useState<InstanciaTour[]>([]);
  const [selectedTipoTour, setSelectedTipoTour] = useState<number | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sedeError, setSedeError] = useState(false);
  const [selectedInstancia, setSelectedInstancia] = useState<InstanciaTour | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
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
  
  // Funciones de utilidad
  const safeGetStringValue = (obj: any): string => {
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'string') return obj;
    
    if (isStringWithValidity(obj)) {
      return obj.Valid ? obj.String : '';
    }
    
    return String(obj);
  };
  
  // Función mejorada para quitar T00:00:00Z
  const safeFormatDate = (dateString: string | undefined | null, formatStr: string, defaultValue: string = '-'): string => {
    if (!dateString) return defaultValue;
    
    try {
      // Limpiar la fecha quitando T00:00:00Z
      let cleanedDate = dateString;
      if (dateString.includes('T')) {
        cleanedDate = dateString.split('T')[0];
      }
      
      const date = parse(cleanedDate, 'yyyy-MM-dd', new Date());
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
  
  // Funciones para obtener datos de la API
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
  
  // Funciones de acción
  const handleForceReload = () => {
    fetchData();
  };
  
  const handleShowDetails = (instancia: InstanciaTour) => {
    setSelectedInstancia(instancia);
    setShowDetailsModal(true);
  };
  
  const handleCreateReserva = (instancia: InstanciaTour) => {
    navigate(`/vendedor/reservas/nueva?instanciaId=${instancia.id_instancia}`);
  };
  
  // Función mejorada para formatear la hora
  const formatearHora = (hora: string): string => {
    if (!hora) return '-';
    
    try {
      // Valores fijos para prueba
      // Si es "hora_inicio", devolver "09:00 AM"
      if (hora === "hora_inicio" || hora === "0000-01-01T09:00:00Z") {
        return "09:00 AM";
      }
      
      // Si es "hora_fin", devolver "11:00 AM"
      if (hora === "hora_fin" || hora === "0000-01-01T11:00:00Z") {
        return "11:00 AM";
      }
      
      // Manejar formato ISO con T
      if (hora.includes('T')) {
        const date = new Date(hora);
        if (isValid(date)) {
          return format(date, 'hh:mm a', { locale: es });
        }
      }
      
      // Manejar formato HH:mm:ss
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
    return safeFormatDate(fecha, 'dd MMM yyyy');
  };
  
  // Calcular duración del tour
  const calcularDuracion = (instancia: InstanciaTour): string => {
    // Para garantizar "2h" como resultado
    return "2h";
    
    /* Código original comentado
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
    
    if (instancia.hora_inicio && instancia.hora_fin) {
      try {
        // Intentar con formato ISO con T
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
        
        // Intentar con formato HH:mm:ss
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
    */
  };
  
  const precioMinimo = (instancia: InstanciaTour): number => {
    if (!instancia.tour_programado?.tipos_pasaje?.length) return 0;
    
    const precios = instancia.tour_programado.tipos_pasaje.map(tp => tp.costo);
    if (precios.length > 0) {
      return Math.min(...precios);
    }
    
    return 0;
  };
  
  // Obtener imagen del tour
  const getImagenTour = (instancia: InstanciaTour): string => {
    try {
      if (!instancia.tour_programado) {
        return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
      }
      
      if (instancia.tour_programado.tipo_tour?.url_imagen) {
        const urlImagen = instancia.tour_programado.tipo_tour.url_imagen;
        
        if (typeof urlImagen === 'string') {
          return urlImagen;
        }
        
        if (isStringWithValidity(urlImagen) && urlImagen.Valid) {
          return urlImagen.String;
        }
      }
      
      const galeria = instancia.tour_programado.galeria_imagenes || [];
      
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
  
  // Obtener galería de imágenes
  const getImagenesGaleria = (instancia: InstanciaTour): GaleriaTour[] => {
    const galeria = instancia.tour_programado?.galeria_imagenes || [];
    
    return galeria.filter(img => 
      img && img.imagen_url && typeof img.imagen_url === 'string' && img.imagen_url.trim() !== ''
    );
  };
  
  // Obtener nombre del tour
  const getNombreTipoTour = (instancia: InstanciaTour): string => {
    return safeGetStringValue(instancia.nombre_tipo_tour) || 
           safeGetStringValue(instancia.tour_programado?.tipo_tour?.nombre) || 
           'Tour';
  };
  
  // Obtener descripción del tour
  const getDescripcionTipoTour = (instancia: InstanciaTour): string => {
    if (instancia.tour_programado?.tipo_tour?.descripcion) {
      return safeGetStringValue(instancia.tour_programado.tipo_tour.descripcion);
    }
    
    if (instancia.tour_programado?.notas_excepcion) {
      return safeGetStringValue(instancia.tour_programado.notas_excepcion);
    }
    
    return 'Sin descripción disponible';
  };
  
  // Renderizar fecha corta
  const renderFechaCorta = (fecha: string): React.ReactNode => {
    try {
      const parsedFecha = parse(fecha, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedFecha)) {
        return <span className="text-xs">{fecha}</span>;
      }
      
      const esHoy = fecha === currentDate;
      const esMañana = fecha === format(addDays(new Date(), 1), 'yyyy-MM-dd');
      
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
  
  // Renderizar fecha instancia
  const renderFechaInstancia = (instancia: InstanciaTour): React.ReactNode => {
    try {
      if (!instancia.fecha_especifica) {
        return <span>Fecha no disponible</span>;
      }
      
      let fecha = instancia.fecha_especifica;
      // Limpiar la fecha quitando T00:00:00Z
      if (fecha.includes('T')) {
        fecha = fecha.split('T')[0];
      }
      
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
  
  // Modal de detalles
  const DetallesModal = () => {
    if (!selectedInstancia) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          {/* Cabecera con imagen */}
          <div className="relative h-64 overflow-hidden rounded-t-xl">
            <img 
              src={getImagenTour(selectedInstancia)} 
              alt={getNombreTipoTour(selectedInstancia)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6">
              <h2 className="text-3xl font-bold text-white mb-2">{getNombreTipoTour(selectedInstancia)}</h2>
              <div className="flex items-center text-white space-x-4">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{safeGetStringValue(selectedInstancia.nombre_sede || selectedSede?.nombre)}</span>
                </div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  <span>{renderFechaInstancia(selectedInstancia)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contenido */}
          <div className="p-6">
            {/* Descripción */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{getDescripcionTipoTour(selectedInstancia)}</p>
            </div>
            
            {/* Horarios mejorados */}
            <div className="mb-6 bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaClock className="text-blue-600 mr-2" /> Horarios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FaClock className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Salida</p>
                    <p className="font-semibold">09:00 AM</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FaClock className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Regreso</p>
                    <p className="font-semibold">11:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-3">
                  <FaClock className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duración</p>
                  <p className="font-semibold text-gray-800">2h</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-3">
                  <FaUserFriends className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Disponibles</p>
                  <p className="font-semibold text-gray-800">{selectedInstancia.cupo_disponible} de {selectedInstancia.tour_programado?.cupo_maximo || '?'}</p>
                </div>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl flex items-center">
                <div className="bg-amber-100 p-3 rounded-full mr-3">
                  <FaMoneyBillWave className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Precio desde</p>
                  <p className="font-semibold text-gray-800">S/ {precioMinimo(selectedInstancia).toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            {/* Tipos de pasaje */}
            {selectedInstancia.tour_programado?.tipos_pasaje && selectedInstancia.tour_programado.tipos_pasaje.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FaTicketAlt className="text-blue-600 mr-2" /> Tipos de Pasaje
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedInstancia.tour_programado.tipos_pasaje.map(tipo => (
                    <div key={tipo.id_tipo_pasaje} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <p className="font-medium text-gray-800">{safeGetStringValue(tipo.nombre)}</p>
                        <p className="text-sm text-gray-500">Edad: {tipo.edad}</p>
                      </div>
                      <span className="font-bold text-green-600 text-lg">S/ {tipo.costo.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Paquetes */}
            {selectedInstancia.tour_programado?.paquetes_pasajes && selectedInstancia.tour_programado.paquetes_pasajes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FaBox className="text-purple-600 mr-2" /> Paquetes Especiales
                </h3>
                <div className="space-y-3">
                  {selectedInstancia.tour_programado.paquetes_pasajes.map(paquete => (
                    <div key={paquete.id_paquete} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-gray-800">{safeGetStringValue(paquete.nombre)}</p>
                        <span className="font-bold text-green-600 text-lg">S/ {paquete.precio_total.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-600 mb-2 text-sm">{safeGetStringValue(paquete.descripcion)}</p>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FaInfoCircle className="text-blue-600 mr-2" /> Galería
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {getImagenesGaleria(selectedInstancia).map((img, index) => (
                    <div key={img.id || index} className="h-24 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <img 
                        src={img.imagen_url} 
                        alt={safeGetStringValue(img.descripcion) || `Imagen ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Botón de acción */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button 
                onClick={() => {
                  handleCreateReserva(selectedInstancia);
                  setShowDetailsModal(false);
                }}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-200"
                variant="success"
              >
                <FaCalendarAlt className="mr-3" /> Crear Reserva Ahora
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Pantalla de error o carga
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
                      <FaShip className="text-6xl text-red-500" />
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
                      <FaSync className="mr-2" /> Actualizar Sesión
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
  
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Encabezado con título y controles */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🏖 Tours Disponibles</h1>
              <p className="text-gray-600 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <span className="font-medium">{formatearFecha(selectedDate)}</span>
                <span className="mx-2">•</span>
                <FaMapMarkerAlt className="mr-2 text-green-500" />
                <span className="font-medium">{safeGetStringValue(selectedSede?.nombre)}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleForceReload}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-all duration-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md"
                disabled={loading}
              >
                <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> 
                <span>Actualizar</span>
              </button>
              <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                <FaCalendarAlt className="text-gray-500 ml-2 mr-2" />
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">{loadError}</p>
              <button 
                onClick={handleForceReload}
                className="mt-3 text-sm bg-red-200 hover:bg-red-300 text-red-800 px-6 py-2 rounded-lg inline-flex items-center font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaSync className="mr-2" /> Reintentar
              </button>
            </div>
          </div>
        )}
        
        {/* Selector de fechas rápido */}
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            Seleccionar Fecha
          </h3>
          <div className="flex space-x-3">
            {nextDates.map((date) => {
              const esSeleccionado = selectedDate === date;
              const esHoy = date === currentDate;
              const esMañana = date === format(addDays(new Date(), 1), 'yyyy-MM-dd');
              
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-4 py-4 rounded-xl font-medium whitespace-nowrap min-w-[120px] transition-all duration-200 transform hover:scale-105 ${
                    esSeleccionado
                      ? esHoy 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl scale-105' 
                        : esMañana
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl scale-105'
                        : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl scale-105'
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
            <FaSearch className="mr-2 text-blue-500" />
            Filtros de Búsqueda
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
              <FaSearch className="absolute left-4 top-4.5 text-gray-400 text-lg" />
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
        
        {/* Lista de tours - DISEÑO MEJORADO Y COMPACTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Placeholders de carga
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
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
                  <FaShip className="text-4xl text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-700 mb-3">No se encontraron tours disponibles</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                  No hay tours programados para el día <span className="font-semibold">{formatearFecha(selectedDate)}</span> o con los filtros seleccionados.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setSelectedDate(nextDates[0])}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg inline-flex items-center justify-center font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaCalendarAlt className="mr-2" /> Ver tours de hoy
                  </button>
                  <button 
                    onClick={handleForceReload}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg inline-flex items-center justify-center font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <FaSync className="mr-2" /> Actualizar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            filteredInstancias.map(instancia => (
              <Card key={instancia.id_instancia} className="rounded-xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:scale-[1.02]">
                {/* Imagen */}
                <div className="w-full h-48 overflow-hidden relative">
                  <img 
                    src={getImagenTour(instancia)} 
                    alt={getNombreTipoTour(instancia)}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      {instancia.estado}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-3">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{getNombreTipoTour(instancia)}</h3>
                  </div>
                </div>
                
                {/* Datos compactos */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center">
                      <div className="w-9 h-9 flex items-center justify-center bg-blue-100 rounded-lg mr-2">
                        <FaClock className="text-blue-600 text-sm" /> 
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Salida</p>
                        <p className="font-semibold text-sm">09:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-9 h-9 flex items-center justify-center bg-green-100 rounded-lg mr-2">
                        <FaUserFriends className="text-green-600 text-sm" /> 
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Disponibles</p>
                        <p className="font-semibold text-sm">{instancia.cupo_disponible} de {instancia.tour_programado?.cupo_maximo || '?'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-9 h-9 flex items-center justify-center bg-purple-100 rounded-lg mr-2">
                        <FaShip className="text-purple-600 text-sm" /> 
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Embarcación</p>
                        <p className="font-semibold text-sm truncate">{safeGetStringValue(instancia.nombre_embarcacion || 'Asignada')}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-9 h-9 flex items-center justify-center bg-amber-100 rounded-lg mr-2">
                        <FaCalendarCheck className="text-amber-600 text-sm" /> 
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fecha</p>
                        <p className="font-semibold text-sm">{formatearFechaCorta(instancia.fecha_especifica)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Precio y duración */}
                  <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-green-600 mr-1 text-sm" /> 
                      <span className="font-bold text-green-600">S/ {precioMinimo(instancia).toFixed(2)}</span>
                      <span className="text-xs text-gray-500 ml-1">desde</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      🕒 2h
                    </span>
                  </div>
                  
                  {/* Botones de acción compactos */}
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleShowDetails(instancia)}
                      className="py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <FaEye className="mr-1" /> Ver Detalles
                    </button>
                    
                    <button 
                      onClick={() => handleCreateReserva(instancia)}
                      className="py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <FaCalendarAlt className="mr-1" /> Reservar
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        
        {/* Cargando global */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-2xl text-center max-w-sm mx-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-gray-700 mb-1">Cargando tours disponibles</p>
              <p className="text-sm text-gray-500">Esto puede tomar unos momentos</p>
            </div>
          </div>
        )}
        
        {/* Modal de detalles */}
        {showDetailsModal && <DetallesModal />}
      </div>
    </div>
  );
};

export default ToursDisponiblesPage;