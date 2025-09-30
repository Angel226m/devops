 /*
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../infrastructure/store';
import Card from '../components/Card';
import Button from '../components/Button';
import { FaShip, FaClock, FaUserFriends, FaMoneyBillWave, FaCalendarAlt, FaSearch, FaMapMarkerAlt, FaCalendarCheck, FaTicketAlt, FaBox, FaInfoCircle, FaSync, FaStar, FaTimes } from 'react-icons/fa';
import { format, parse, isValid, differenceInMinutes, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from '../../../infrastructure/api/axiosClient';
import { endpoints } from '../../../infrastructure/api/endpoints';
import { useNavigate } from 'react-router-dom';

interface StringWithValidity {
  String: string;
  Valid: boolean;
}

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
  id_chofer: { Int64: number; Valid: boolean } | null;
  fecha: string;
  vigencia_desde: string;
  vigencia_hasta: string;
  cupo_maximo: number;
  cupo_disponible: number;
  estado: "PROGRAMADO" | "EN_CURSO" | "COMPLETADO" | "CANCELADO";
  eliminado: boolean;
  es_excepcion: boolean;
  notas_excepcion: { String: string; Valid: boolean } | null;
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
  descripcion: string | null;
  duracion_minutos: number;
  url_imagen: string | null;
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

const isStringWithValidity = (obj: any): obj is StringWithValidity => {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'String' in obj &&
    'Valid' in obj &&
    typeof obj.Valid === 'boolean'
  );
};

const MisReservasPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<InstanciaTour | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getCurrentDate = () => {
    const now = new Date();
    return format(now, 'yyyy-MM-dd');
  };

  const currentDate = getCurrentDate();
  const currentUser = "Angel226m";

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

  const safeGetStringValue = (obj: any): string => {
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'string') return obj;
    if (isStringWithValidity(obj)) return obj.Valid ? obj.String : '';
    return String(obj);
  };

  const safeFormatDate = (dateString: string | undefined | null, formatStr: string, defaultValue: string = '-'): string => {
    if (!dateString) return defaultValue;
    try {
      if (dateString.includes('T')) {
        const date = parseISO(dateString);
        if (isValid(date)) return format(date, formatStr, { locale: es });
      }
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      if (isValid(date)) return format(date, formatStr, { locale: es });
    } catch (error) {
      console.error(`Error al formatear fecha: ${dateString}`, error);
    }
    return defaultValue;
  };

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

  const getDataArray = <T,>(response: any): T[] => {
    try {
      if (Array.isArray(response.data)) return response.data;
      if (response.data && Array.isArray(response.data.data)) return response.data.data;
      if (response.data && typeof response.data === 'object') {
        const arrayProps = Object.keys(response.data).filter(key => Array.isArray(response.data[key]));
        if (arrayProps.length > 0) return response.data[arrayProps[0]];
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
        if (response.data.data && !Array.isArray(response.data.data)) return response.data.data as T;
        return response.data as T;
      }
      if (Array.isArray(response.data) && response.data.length === 1) return response.data[0] as T;
      if (Array.isArray(response.data)) return response.data[0] as T;
    } catch (error) {
      console.error('Error al procesar datos de objeto:', error);
    }
    return null;
  };

  const fetchData = useCallback(async () => {
    try {
      if (!checkAuthAndSede()) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setLoadError(null);

      const fetchTiposTour = async () => {
        try {
          const response = await axios.get(endpoints.tiposTour.vendedorList);
          const tiposTourArray = getDataArray<TipoTour>(response);
          const tiposTourSede = tiposTourArray.filter(tipo => tipo.id_sede === selectedSede!.id_sede);
          setTiposTour(tiposTourSede);
          return true;
        } catch (error) {
          console.error('Error al cargar tipos de tour:', error);
          setLoadError("Error al cargar tipos de tour. Intente recargar la página.");
          return false;
        }
      };

      const fetchInstanciasTour = async () => {
        try {
          const filtro: FiltrosInstanciaTour = {
            fecha_inicio: selectedDate,
            fecha_fin: selectedDate,
            estado: 'PROGRAMADO',
            id_sede: selectedSede!.id_sede
          };
          if (selectedTipoTour) filtro.id_tipo_tour = selectedTipoTour;
          const response = await axios.post(endpoints.instanciaTour.vendedorFiltrar, filtro);
          const instanciasArray = getDataArray<InstanciaTour>(response);
          if (instanciasArray.length === 0) {
            setInstanciasTour([]);
            setFilteredInstancias([]);
            return true;
          }
          const instanciasEnriquecidas = await Promise.all(
            instanciasArray.map(async (instancia: InstanciaTour, index) => {
              try {
                const tourResponse = await axios.get(endpoints.tourProgramado.vendedorGetById(instancia.id_tour_programado));
                const tourData = getSingleObject<TourProgramado>(tourResponse);
                if (tourData) {
                  instancia.tour_programado = { ...tourData };
                  if (instancia.tour_programado.id_tipo_tour) {
                    const tipoTourId = instancia.tour_programado.id_tipo_tour;
                    try {
                      const tipoTourResponse = await axios.get(endpoints.tiposTour.vendedorGetById(tipoTourId));
                      const tipoTourData = getSingleObject<TipoTour>(tipoTourResponse);
                      if (tipoTourData) {
                        instancia.tour_programado.tipo_tour = tipoTourData;
                        try { instancia.tour_programado.galeria_imagenes = getDataArray<GaleriaTour>(await axios.get(endpoints.galeriaTour.vendedorListByTipoTour(tipoTourId))); }
                        catch (err) { console.error(`Error al cargar galería para tipo tour ${tipoTourId}:`, err); instancia.tour_programado.galeria_imagenes = []; }
                        try { instancia.tour_programado.tipos_pasaje = getDataArray<TipoPasaje>(await axios.get(endpoints.tipoPasaje.vendedorListByTipoTour(tipoTourId))); }
                        catch (err) { console.error(`Error al cargar tipos de pasaje para tipo tour ${tipoTourId}:`, err); instancia.tour_programado.tipos_pasaje = []; }
                        try { instancia.tour_programado.paquetes_pasajes = getDataArray<PaquetePasajes>(await axios.get(endpoints.paquetePasajes.vendedorListByTipoTour(tipoTourId))); }
                        catch (err) { console.error(`Error al cargar paquetes de pasajes para tipo tour ${tipoTourId}:`, err); instancia.tour_programado.paquetes_pasajes = []; }
                      }
                    } catch (err) { console.error(`Error al cargar tipo de tour ${tipoTourId}:`, err); }
                  }
                }
              } catch (err) { console.error('Error al obtener detalles adicionales:', err); }
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

      const tiposTourLoaded = await fetchTiposTour();
      if (tiposTourLoaded) await fetchInstanciasTour();
      setDataLoaded(true);
    } catch (error) {
      console.error('Error general al cargar datos:', error);
      setLoadError("Error al cargar datos. Intente recargar la página.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedSede, selectedTipoTour, checkAuthAndSede]);

  useEffect(() => {
    if (isAuthReady && selectedSede && !dataLoaded) fetchData();
  }, [isAuthReady, selectedSede, dataLoaded, fetchData]);

  useEffect(() => {
    if (dataLoaded && !sedeError) fetchData();
  }, [selectedDate, selectedTipoTour, fetchData, dataLoaded, sedeError]);

  const handleForceReload = () => fetchData();

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInstancias(instanciasTour);
      return;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = instanciasTour.filter(instancia => {
      const nombreTipoTour = safeGetStringValue(instancia.nombre_tipo_tour).toLowerCase();
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

  const handleCreateReserva = (instancia: InstanciaTour) => {
    navigate(`/vendedor/reservas/nueva?instanciaId=${instancia.id_instancia}`);
  };

  const handleViewDetails = (instancia: InstanciaTour) => {
    setSelectedTour(instancia);
    setModalOpen(true);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTour(null);
    document.body.style.overflow = 'auto';
  };

  const handleNextImage = () => {
    if (!selectedTour || !selectedTour.tour_programado?.galeria_imagenes) return;
    const totalImages = selectedTour.tour_programado.galeria_imagenes.length;
    if (totalImages <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const handlePrevImage = () => {
    if (!selectedTour || !selectedTour.tour_programado?.galeria_imagenes) return;
    const totalImages = selectedTour.tour_programado.galeria_imagenes.length;
    if (totalImages <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  const formatearHora = (hora: string): string => {
    if (!hora) return '-';
    try {
      if (hora.includes('T')) {
        const date = new Date(hora);
        if (isValid(date)) return format(date, 'hh:mm a', { locale: es });
      }
      const parsedHora = parse(hora, 'HH:mm:ss', new Date());
      if (isValid(parsedHora)) return format(parsedHora, 'hh:mm a', { locale: es });
    } catch (error) {
      console.error(`Error al formatear hora: ${hora}`, error);
    }
    return hora;
  };

  const formatearFecha = (fecha: string): string => safeFormatDate(fecha, 'EEEE dd MMMM yyyy');
  const formatearFechaCorta = (fecha: string): string => safeFormatDate(fecha, 'EEE dd MMM');

  const calcularDuracion = (instancia: InstanciaTour): string => {
    const duracionMinutos = instancia.tour_programado?.tipo_tour?.duracion_minutos;
    if (duracionMinutos) {
      if (duracionMinutos >= 60) {
        const horas = Math.floor(duracionMinutos / 60);
        const minutos = duracionMinutos % 60;
        return `${horas}h ${minutos > 0 ? `${minutos}min` : ''}`;
      } else return `${duracionMinutos} minutos`;
    }
    if (instancia.hora_inicio && instancia.hora_fin) {
      try {
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
            } else return `${minutes} minutos`;
          }
        }
        const inicio = parse(instancia.hora_inicio, 'HH:mm:ss', new Date());
        const fin = parse(instancia.hora_fin, 'HH:mm:ss', new Date());
        if (isValid(inicio) && isValid(fin)) {
          let minutes = differenceInMinutes(fin, inicio);
          if (minutes < 0) minutes += 24 * 60;
          if (minutes >= 60) {
            const horas = Math.floor(minutes / 60);
            const minutos = minutes % 60;
            return `${horas}h ${minutos > 0 ? `${minutos}min` : ''}`;
          } else return `${minutes} minutos`;
        }
      } catch (e) { console.error('Error al calcular duración:', e); }
    }
    return 'Duración no disponible';
  };

  const precioMinimo = (instancia: InstanciaTour): number => {
    if (!instancia.tour_programado?.tipos_pasaje?.length) return 0;
    const precios = instancia.tour_programado.tipos_pasaje.map(tp => tp.costo);
    return precios.length > 0 ? Math.min(...precios) : 0;
  };

  const getImagenTour = (instancia: InstanciaTour): string => {
    try {
      if (!instancia.tour_programado) return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
      if (instancia.tour_programado.tipo_tour && instancia.tour_programado.tipo_tour.url_imagen) {
        const urlImagen = instancia.tour_programado.tipo_tour.url_imagen;
        if (typeof urlImagen === 'string') return urlImagen;
        if (typeof urlImagen === 'object' && urlImagen !== null && 'String' in urlImagen && 'Valid' in urlImagen) {
          const validObj = urlImagen as unknown as StringWithValidity;
          if (validObj.Valid) return validObj.String;
        }
      }
      const galeria = instancia.tour_programado.galeria_imagenes || [];
      if (galeria.length > 0) {
        const imagenPortada = galeria.find(img => img.es_portada);
        if (imagenPortada && imagenPortada.imagen_url) return imagenPortada.imagen_url;
        if (galeria[0] && galeria[0].imagen_url) return galeria[0].imagen_url;
      }
      return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
    } catch (error) {
      console.error("Error al obtener imagen del tour:", error);
      return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
    }
  };

  const getImagenesGaleria = (instancia: InstanciaTour): GaleriaTour[] => {
    const galeria = instancia.tour_programado?.galeria_imagenes || [];
    return galeria.filter(img => img && img.imagen_url && typeof img.imagen_url === 'string' && img.imagen_url.trim() !== '');
  };

  const getNombreTipoTour = (instancia: InstanciaTour): string => {
    return safeGetStringValue(instancia.nombre_tipo_tour) || safeGetStringValue(instancia.tour_programado?.tipo_tour?.nombre) || 'Tour';
  };

  const getDescripcionTipoTour = (instancia: InstanciaTour): string => {
    if (instancia.tour_programado?.tipo_tour?.descripcion) return safeGetStringValue(instancia.tour_programado.tipo_tour.descripcion);
    if (instancia.tour_programado?.notas_excepcion) return safeGetStringValue(instancia.tour_programado.notas_excepcion);
    return 'Sin descripción disponible';
  };

  const renderFechaCorta = (fecha: string): React.ReactNode => {
    try {
      const parsedFecha = parse(fecha, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedFecha)) return <span className="text-xs">{fecha}</span>;
      const esHoy = fecha === currentDate;
      const esMañana = fecha === format(addDays(new Date(), 1), 'yyyy-MM-dd');
      return (
        <div className="flex flex-col items-center text-center">
          <span className={`text-xs uppercase font-bold mb-1 ${esHoy ? 'text-teal-600' : esMañana ? 'text-teal-600' : 'text-gray-600'}`}>
            {esHoy ? 'HOY' : esMañana ? 'MAÑANA' : format(parsedFecha, 'EEE', { locale: es })}
          </span>
          <span className={`text-lg font-bold ${esHoy ? 'text-teal-700' : esMañana ? 'text-teal-700' : 'text-gray-700'}`}>
            {format(parsedFecha, 'dd', { locale: es })}
          </span>
          <span className={`text-xs mt-1 capitalize ${esHoy ? 'text-teal-600' : esMañana ? 'text-teal-600' : 'text-gray-500'}`}>
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
      if (!instancia.fecha_especifica) return <span>Fecha no disponible</span>;
      const fecha = instancia.fecha_especifica;
      const parsedFecha = parse(fecha, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedFecha)) return <span>{fecha}</span>;
      return <span>{format(parsedFecha, 'dd MMM yyyy', { locale: es })}</span>;
    } catch (error) {
      console.error(`Error al renderizar fecha de instancia`, error);
      return <span>Fecha no disponible</span>;
    }
  };

  const DetallesModal = () => {
    if (!selectedTour) return null;
    const instancia = selectedTour;
    const imagenes = getImagenesGaleria(instancia);
    const currentImage = imagenes.length > 0 ? imagenes[currentImageIndex] : null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 overflow-y-auto" onClick={handleCloseModal}>
        <div className="relative bg-white rounded-lg overflow-hidden w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <button onClick={handleCloseModal} className="absolute top-3 right-3 text-teal-600 hover:text-teal-800">
            <FaTimes className="text-xl" />
          </button>
          <div className="relative h-64 bg-gray-200">
            {imagenes.length > 0 ? (
              <>
                <img src={currentImage?.imagen_url || getImagenTour(instancia)} alt={currentImage?.descripcion || getNombreTipoTour(instancia)} className="w-full h-full object-cover" />
                {imagenes.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">
                      <FaInfoCircle className="rotate-180 text-teal-600" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleNextImage(); }} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">
                      <FaInfoCircle className="text-teal-600" />
                    </button>
                  </>
                )}
              </>
            ) : <div className="w-full h-full flex items-center justify-center"><FaShip className="text-gray-400 text-4xl" /></div>}
          </div>
          <div className="p-6">
            <div className="mb-4">
              <div className="text-sm text-gray-500 flex items-center mb-2">
                <FaMapMarkerAlt className="mr-1 text-teal-600" /><span>{safeGetStringValue(instancia.nombre_sede)}</span>
                <span className="mx-1">•</span>
                <FaCalendarAlt className="mr-1 text-teal-600" /><span>{renderFechaInstancia(instancia)}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{getNombreTipoTour(instancia)}</h2>
              <div className="flex items-center mt-2">
                <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-semibold">{instancia.estado}</span>
                <span className="ml-2 text-teal-700 text-xs">🕒 {calcularDuracion(instancia)}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-teal-800 flex items-center mb-2"><FaInfoCircle className="mr-1" /> Información</h3>
                <p className="text-gray-700 text-sm">{getDescripcionTipoTour(instancia)}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div><span className="text-xs text-gray-500">Salida:</span> <span className="font-bold">{safeGetStringValue(instancia.hora_inicio_str || formatearHora(instancia.hora_inicio))}</span></div>
                  <div><span className="text-xs text-gray-500">Regreso:</span> <span className="font-bold">{safeGetStringValue(instancia.hora_fin_str || formatearHora(instancia.hora_fin))}</span></div>
                  <div><span className="text-xs text-gray-500">Cupo:</span> <span className="font-bold">{instancia.cupo_disponible} de {instancia.tour_programado?.cupo_maximo || '?'}</span></div>
                  <div><span className="text-xs text-gray-500">Precio:</span> <span className="font-bold">S/ {precioMinimo(instancia).toFixed(2)}</span></div>
                </div>
              </div>
              {instancia.tour_programado?.tipos_pasaje && instancia.tour_programado.tipos_pasaje.length > 0 && (
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-teal-800 flex items-center mb-2"><FaTicketAlt className="mr-1" /> Pasajes</h3>
                  <div className="space-y-2">
                    {instancia.tour_programado.tipos_pasaje.map(tipo => (
                      <div key={tipo.id_tipo_pasaje} className="flex justify-between text-sm">
                        <span>{safeGetStringValue(tipo.nombre)} ({tipo.edad})</span>
                        <span className="font-bold">S/ {tipo.costo.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex space-x-2">
              <Button onClick={(e) => { e.stopPropagation(); handleCreateReserva(instancia); }} className="flex-1 py-2 text-sm bg-teal-600 text-white hover:bg-teal-700" variant="success">
                <FaCalendarAlt className="mr-1" /> Reservar
              </Button>
              <Button onClick={handleCloseModal} className="flex-1 py-2 text-sm bg-gray-200 text-gray-800 hover:bg-gray-300">
                <FaTimes className="mr-1" /> Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthReady || sedeError) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow">
            {!isAuthReady ? (
              <>
                <div className="animate-spin h-12 w-12 border-t-4 border-teal-600 rounded-full mx-auto mb-4"></div>
                <h2 className="text-lg font-bold text-gray-700 text-center">Verificando sesión...</h2>
                <p className="text-gray-500 text-center mt-2">Por favor espere.</p>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <FaShip className="text-4xl text-gray-400 mb-4" />
                  <h2 className="text-xl font-bold text-gray-800 text-center">No hay sede seleccionada</h2>
                  <p className="text-gray-600 text-center mt-2">Contacte al administrador para asignar una sede.</p>
                  <button onClick={handleForceReload} className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                    <FaSync className="mr-1" /> Actualizar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-4 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h1 className="text-2xl font-bold text-gray-800">Mis Reservas</h1>
          <p className="text-gray-600 text-sm">Gestiona tus aventuras y experiencias</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
            <div className="text-center"><span className="font-bold text-teal-600">✓ {39}</span> Confirmadas</div>
            <div className="text-center"><span className="font-bold text-teal-600">⏱ {0}</span> Pendientes</div>
            <div className="text-center"><span className="font-bold text-teal-600">📅 {0}</span> Reservadas</div>
            <div className="text-center"><span className="font-bold text-teal-600">📊 {68}</span> Total</div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <button className="bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">🔍 TODOS (68)</button>
            <button className="bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">✓ CONFIRMADA (39)</button>
            <button className="bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">📅 RESERVADO (0)</button>
            <button className="bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">⏱ PENDIENTE (0)</button>
            <button className="bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">✕ CANCELADA (29)</button>
          </div>
        </div>

        {loadError && (
          <div className="bg-teal-50 p-4 rounded-lg flex items-center">
            <span className="text-teal-700 text-sm">{loadError}</span>
            <button onClick={handleForceReload} className="ml-2 text-teal-600 hover:text-teal-800"><FaSync /></button>
          </div>
        )}

        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <input
              type="text"
              placeholder="Buscar..."
              className="border border-teal-200 rounded px-3 py-2 flex-1 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border border-teal-200 rounded px-3 py-2 text-sm"
              value={selectedTipoTour || ''}
              onChange={(e) => setSelectedTipoTour(e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <option value="">Todos los tours</option>
              {tiposTour.map(tipo => <option key={tipo.id_tipo_tour} value={tipo.id_tipo_tour}>{safeGetStringValue(tipo.nombre)}</option>)}
            </select>
            <button onClick={handleForceReload} className="bg-teal-600 text-white px-3 py-2 rounded hover:bg-teal-700 text-sm"><FaSync /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center p-4"><div className="animate-spin h-8 w-8 border-t-4 border-teal-600 rounded-full inline-block"></div> Cargando...</div>
          ) : filteredInstancias.length === 0 ? (
            <div className="col-span-full text-center p-4 bg-white rounded-lg">
              <FaShip className="text-gray-400 text-2xl mb-2" />
              <p className="text-sm">No hay reservas disponibles</p>
              <button onClick={() => setSelectedDate(nextDates[0])} className="mt-2 text-teal-600 hover:text-teal-800 text-sm">Ver hoy</button>
            </div>
          ) : (
            filteredInstancias.map(instancia => (
              <Card key={instancia.id_instancia} className="rounded-lg overflow-hidden bg-white border border-gray-100">
                <div className="flex flex-col h-full">
                  <div className="w-full h-32 overflow-hidden">
                    <img src={getImagenTour(instancia)} alt={getNombreTipoTour(instancia)} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen'} />
                    <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs px-2 py-1 rounded">{instancia.estado}</div>
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-sm font-bold text-gray-800">{getNombreTipoTour(instancia)}</h3>
                    <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
                      <div><FaClock className="inline mr-1 text-teal-600" /> {formatearHora(instancia.hora_inicio)}</div>
                      <div><FaUserFriends className="inline mr-1 text-teal-600" /> {instancia.cupo_disponible}</div>
                      <div><FaCalendarCheck className="inline mr-1 text-teal-600" /> {renderFechaInstancia(instancia)}</div>
                      <div><span className="text-xs text-gray-500">Precio:</span> <span className="font-bold">S/ {precioMinimo(instancia).toFixed(2)}</span></div>
                    </div>
                    <div className="mt-auto pt-2 flex space-x-1">
                      <Button onClick={() => handleCreateReserva(instancia)} className="py-1 px-2 text-xs bg-teal-600 text-white hover:bg-teal-700" variant="success">Reservar</Button>
                      <Button onClick={() => handleViewDetails(instancia)} className="py-1 px-2 text-xs bg-teal-600 text-white hover:bg-teal-700"><FaInfoCircle /></Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {modalOpen && <DetallesModal />}
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
`;
document.head.appendChild(style);

export default MisReservasPage;*/

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../infrastructure/store';
import Card from '../components/Card';
import Button from '../components/Button';
import { FaShip, FaClock, FaUserFriends, FaMoneyBillWave, FaCalendarAlt, FaSearch, FaMapMarkerAlt, FaCalendarCheck, FaTicketAlt, FaBox, FaInfoCircle, FaSync, FaStar, FaTimes, FaExclamationTriangle, FaBan, FaCheckCircle } from 'react-icons/fa';
import { format, parse, isValid, differenceInMinutes, addDays, parseISO, addHours, isBefore, isAfter, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from '../../../infrastructure/api/axiosClient';
import { endpoints } from '../../../infrastructure/api/endpoints';
import { useNavigate } from 'react-router-dom';

interface StringWithValidity {
  String: string;
  Valid: boolean;
}

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
  estado_disponibilidad?: 'DISPONIBLE' | 'ADVERTENCIA' | 'BLOQUEADO';
  minutos_para_inicio?: number;
}

interface TourProgramado {
  id_tour_programado: number;
  id_tipo_tour: number;
  id_embarcacion: number;
  id_horario: number;
  id_sede: number;
  id_chofer: { Int64: number; Valid: boolean } | null;
  fecha: string;
  vigencia_desde: string;
  vigencia_hasta: string;
  cupo_maximo: number;
  cupo_disponible: number;
  estado: "PROGRAMADO" | "EN_CURSO" | "COMPLETADO" | "CANCELADO";
  eliminado: boolean;
  es_excepcion: boolean;
  notas_excepcion: { String: string; Valid: boolean } | null;
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
  descripcion: string | null;
  duracion_minutos: number;
  url_imagen: string | null;
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

const isStringWithValidity = (obj: any): obj is StringWithValidity => {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'String' in obj &&
    'Valid' in obj &&
    typeof obj.Valid === 'boolean'
  );
};

const MisReservasPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<InstanciaTour | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tourToConfirm, setTourToConfirm] = useState<InstanciaTour | null>(null);

  // Obtener la fecha y hora actual de Perú (UTC-5)
  const getCurrentDateTimePeru = () => {
    const now = new Date();
    // Ajustar a hora de Perú (UTC-5)
    const peruTime = new Date(now.getTime() - (5 * 60 * 60 * 1000));
    return peruTime;
  };

  const getCurrentDate = () => {
    const peruTime = getCurrentDateTimePeru();
    return format(peruTime, 'yyyy-MM-dd');
  };

  const currentDate = getCurrentDate();
  const currentUser = "Angel226m";

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

  const safeGetStringValue = (obj: any): string => {
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'string') return obj;
    if (isStringWithValidity(obj)) return obj.Valid ? obj.String : '';
    return String(obj);
  };

  const safeFormatDate = (dateString: string | undefined | null, formatStr: string, defaultValue: string = '-'): string => {
    if (!dateString) return defaultValue;
    try {
      if (dateString.includes('T')) {
        const date = parseISO(dateString);
        if (isValid(date)) return format(date, formatStr, { locale: es });
      }
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      if (isValid(date)) return format(date, formatStr, { locale: es });
    } catch (error) {
      console.error(`Error al formatear fecha: ${dateString}`, error);
    }
    return defaultValue;
  };

  // Función mejorada para formatear hora en formato peruano (12 horas)
  const formatearHoraPeru = (hora: string, fecha?: string): string => {
    if (!hora) return '-';
    try {
      let dateToFormat: Date;
      
      if (hora.includes('T')) {
        dateToFormat = new Date(hora);
      } else {
        // Si tenemos la fecha, la combinamos con la hora
        if (fecha) {
          const fechaBase = parse(fecha, 'yyyy-MM-dd', new Date());
          const [hours, minutes, seconds] = hora.split(':').map(Number);
          dateToFormat = new Date(fechaBase);
          dateToFormat.setHours(hours, minutes, seconds || 0);
        } else {
          dateToFormat = parse(hora, 'HH:mm:ss', new Date());
        }
      }
      
      if (isValid(dateToFormat)) {
        // Formato peruano: 02:30 PM
        return format(dateToFormat, 'hh:mm a', { locale: es }).toUpperCase();
      }
    } catch (error) {
      console.error(`Error al formatear hora: ${hora}`, error);
    }
    return hora;
  };

  // Función para calcular el estado de disponibilidad del tour
  const calcularEstadoDisponibilidad = (instancia: InstanciaTour): {
    estado: 'DISPONIBLE' | 'ADVERTENCIA' | 'BLOQUEADO';
    minutos: number;
    mensaje: string;
  } => {
    try {
      const ahora = getCurrentDateTimePeru();
      const fechaTour = parse(instancia.fecha_especifica, 'yyyy-MM-dd', new Date());
      
      // Si el tour NO es de hoy, está disponible
      if (!isSameDay(fechaTour, ahora)) {
        return {
          estado: 'DISPONIBLE',
          minutos: 0,
          mensaje: 'Disponible para reservar'
        };
      }

      // Si es de hoy, verificamos la hora
      let horaTour: Date;
      if (instancia.hora_inicio.includes('T')) {
        horaTour = new Date(instancia.hora_inicio);
      } else {
        const [hours, minutes, seconds] = instancia.hora_inicio.split(':').map(Number);
        horaTour = new Date(fechaTour);
        horaTour.setHours(hours, minutes, seconds || 0);
      }

      const minutosParaInicio = differenceInMinutes(horaTour, ahora);
      const horaBloqueo = addHours(horaTour, 3); // 3 horas después del inicio

      // Si ya pasaron 3 horas del inicio, está BLOQUEADO
      if (isAfter(ahora, horaBloqueo)) {
        return {
          estado: 'BLOQUEADO',
          minutos: minutosParaInicio,
          mensaje: 'Tour no disponible - Ya pasaron 3 horas desde el inicio'
        };
      }

      // Si ya pasó la hora de inicio pero aún no las 3 horas, ADVERTENCIA
      if (isBefore(ahora, horaBloqueo) && minutosParaInicio < 0) {
        const minutosRestantes = differenceInMinutes(horaBloqueo, ahora);
        return {
          estado: 'ADVERTENCIA',
          minutos: minutosParaInicio,
          mensaje: `⚠️ El tour ya inició. Quedan ${minutosRestantes} minutos para verificar disponibilidad antes de que se bloquee.`
        };
      }

      // Si falta menos de 30 minutos para el inicio, ADVERTENCIA
      if (minutosParaInicio <= 30 && minutosParaInicio > 0) {
        return {
          estado: 'ADVERTENCIA',
          minutos: minutosParaInicio,
          mensaje: `⚠️ Faltan ${minutosParaInicio} minutos para el inicio. Verifica disponibilidad antes de reservar.`
        };
      }

      // En cualquier otro caso, está DISPONIBLE
      return {
        estado: 'DISPONIBLE',
        minutos: minutosParaInicio,
        mensaje: 'Disponible para reservar'
      };

    } catch (error) {
      console.error('Error al calcular estado de disponibilidad:', error);
      return {
        estado: 'DISPONIBLE',
        minutos: 0,
        mensaje: 'Disponible para reservar'
      };
    }
  };

  // Generar las próximas 7 fechas
  useEffect(() => {
    const dates = [];
    try {
      const baseDate = getCurrentDateTimePeru();
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

  const getDataArray = <T,>(response: any): T[] => {
    try {
      if (Array.isArray(response.data)) return response.data;
      if (response.data && Array.isArray(response.data.data)) return response.data.data;
      if (response.data && typeof response.data === 'object') {
        const arrayProps = Object.keys(response.data).filter(key => Array.isArray(response.data[key]));
        if (arrayProps.length > 0) return response.data[arrayProps[0]];
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
        if (response.data.data && !Array.isArray(response.data.data)) return response.data.data as T;
        return response.data as T;
      }
      if (Array.isArray(response.data) && response.data.length === 1) return response.data[0] as T;
      if (Array.isArray(response.data)) return response.data[0] as T;
    } catch (error) {
      console.error('Error al procesar datos de objeto:', error);
    }
    return null;
  };

  const fetchData = useCallback(async () => {
    try {
      if (!checkAuthAndSede()) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setLoadError(null);

      const fetchTiposTour = async () => {
        try {
          const response = await axios.get(endpoints.tiposTour.vendedorList);
          const tiposTourArray = getDataArray<TipoTour>(response);
          const tiposTourSede = tiposTourArray.filter(tipo => tipo.id_sede === selectedSede!.id_sede);
          setTiposTour(tiposTourSede);
          return true;
        } catch (error) {
          console.error('Error al cargar tipos de tour:', error);
          setLoadError("Error al cargar tipos de tour. Intente recargar la página.");
          return false;
        }
      };

      const fetchInstanciasTour = async () => {
        try {
          const filtro: FiltrosInstanciaTour = {
            fecha_inicio: selectedDate,
            fecha_fin: selectedDate,
            estado: 'PROGRAMADO',
            id_sede: selectedSede!.id_sede
          };
          if (selectedTipoTour) filtro.id_tipo_tour = selectedTipoTour;
          const response = await axios.post(endpoints.instanciaTour.vendedorFiltrar, filtro);
          const instanciasArray = getDataArray<InstanciaTour>(response);
          if (instanciasArray.length === 0) {
            setInstanciasTour([]);
            setFilteredInstancias([]);
            return true;
          }
          const instanciasEnriquecidas = await Promise.all(
            instanciasArray.map(async (instancia: InstanciaTour, index) => {
              try {
                const tourResponse = await axios.get(endpoints.tourProgramado.vendedorGetById(instancia.id_tour_programado));
                const tourData = getSingleObject<TourProgramado>(tourResponse);
                if (tourData) {
                  instancia.tour_programado = { ...tourData };
                  if (instancia.tour_programado.id_tipo_tour) {
                    const tipoTourId = instancia.tour_programado.id_tipo_tour;
                    try {
                      const tipoTourResponse = await axios.get(endpoints.tiposTour.vendedorGetById(tipoTourId));
                      const tipoTourData = getSingleObject<TipoTour>(tipoTourResponse);
                      if (tipoTourData) {
                        instancia.tour_programado.tipo_tour = tipoTourData;
                        try { instancia.tour_programado.galeria_imagenes = getDataArray<GaleriaTour>(await axios.get(endpoints.galeriaTour.vendedorListByTipoTour(tipoTourId))); }
                        catch (err) { console.error(`Error al cargar galería para tipo tour ${tipoTourId}:`, err); instancia.tour_programado.galeria_imagenes = []; }
                        try { instancia.tour_programado.tipos_pasaje = getDataArray<TipoPasaje>(await axios.get(endpoints.tipoPasaje.vendedorListByTipoTour(tipoTourId))); }
                        catch (err) { console.error(`Error al cargar tipos de pasaje para tipo tour ${tipoTourId}:`, err); instancia.tour_programado.tipos_pasaje = []; }
                        try { instancia.tour_programado.paquetes_pasajes = getDataArray<PaquetePasajes>(await axios.get(endpoints.paquetePasajes.vendedorListByTipoTour(tipoTourId))); }
                        catch (err) { console.error(`Error al cargar paquetes de pasajes para tipo tour ${tipoTourId}:`, err); instancia.tour_programado.paquetes_pasajes = []; }
                      }
                    } catch (err) { console.error(`Error al cargar tipo de tour ${tipoTourId}:`, err); }
                  }
                }

                // Calcular el estado de disponibilidad
                const estadoDisp = calcularEstadoDisponibilidad(instancia);
                instancia.estado_disponibilidad = estadoDisp.estado;
                instancia.minutos_para_inicio = estadoDisp.minutos;

              } catch (err) { console.error('Error al obtener detalles adicionales:', err); }
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

      const tiposTourLoaded = await fetchTiposTour();
      if (tiposTourLoaded) await fetchInstanciasTour();
      setDataLoaded(true);
    } catch (error) {
      console.error('Error general al cargar datos:', error);
      setLoadError("Error al cargar datos. Intente recargar la página.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedSede, selectedTipoTour, checkAuthAndSede]);

  useEffect(() => {
    if (isAuthReady && selectedSede && !dataLoaded) fetchData();
  }, [isAuthReady, selectedSede, dataLoaded, fetchData]);

  useEffect(() => {
    if (dataLoaded && !sedeError) fetchData();
  }, [selectedDate, selectedTipoTour, fetchData, dataLoaded, sedeError]);

  const handleForceReload = () => fetchData();

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInstancias(instanciasTour);
      return;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = instanciasTour.filter(instancia => {
      const nombreTipoTour = safeGetStringValue(instancia.nombre_tipo_tour).toLowerCase();
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

  const handleCreateReserva = (instancia: InstanciaTour) => {
    const estadoDisp = calcularEstadoDisponibilidad(instancia);

    // Si está bloqueado, no permitir
    if (estadoDisp.estado === 'BLOQUEADO') {
      alert('❌ Este tour ya no está disponible. Han pasado más de 3 horas desde su inicio.');
      return;
    }

    // Si está en advertencia, mostrar modal de confirmación
    if (estadoDisp.estado === 'ADVERTENCIA') {
      setTourToConfirm(instancia);
      setShowConfirmModal(true);
      return;
    }

    // Si está disponible, ir directamente
    navigate(`/vendedor/reservas/nueva?instanciaId=${instancia.id_instancia}`);
  };

  const confirmarReservaConAdvertencia = () => {
    if (tourToConfirm) {
      navigate(`/vendedor/reservas/nueva?instanciaId=${tourToConfirm.id_instancia}`);
      setShowConfirmModal(false);
      setTourToConfirm(null);
    }
  };

  const handleViewDetails = (instancia: InstanciaTour) => {
    setSelectedTour(instancia);
    setModalOpen(true);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTour(null);
    document.body.style.overflow = 'auto';
  };

  const handleNextImage = () => {
    if (!selectedTour || !selectedTour.tour_programado?.galeria_imagenes) return;
    const totalImages = selectedTour.tour_programado.galeria_imagenes.length;
    if (totalImages <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const handlePrevImage = () => {
    if (!selectedTour || !selectedTour.tour_programado?.galeria_imagenes) return;
    const totalImages = selectedTour.tour_programado.galeria_imagenes.length;
    if (totalImages <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  const formatearHora = (hora: string, fecha?: string): string => {
    return formatearHoraPeru(hora, fecha);
  };

  const formatearFecha = (fecha: string): string => safeFormatDate(fecha, 'EEEE dd MMMM yyyy');
  const formatearFechaCorta = (fecha: string): string => safeFormatDate(fecha, 'EEE dd MMM');

  const calcularDuracion = (instancia: InstanciaTour): string => {
    const duracionMinutos = instancia.tour_programado?.tipo_tour?.duracion_minutos;
    if (duracionMinutos) {
      if (duracionMinutos >= 60) {
        const horas = Math.floor(duracionMinutos / 60);
        const minutos = duracionMinutos % 60;
        return `${horas}h ${minutos > 0 ? `${minutos}min` : ''}`;
      } else return `${duracionMinutos} minutos`;
    }
    if (instancia.hora_inicio && instancia.hora_fin) {
      try {
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
            } else return `${minutes} minutos`;
          }
        }
        const inicio = parse(instancia.hora_inicio, 'HH:mm:ss', new Date());
        const fin = parse(instancia.hora_fin, 'HH:mm:ss', new Date());
        if (isValid(inicio) && isValid(fin)) {
          let minutes = differenceInMinutes(fin, inicio);
          if (minutes < 0) minutes += 24 * 60;
          if (minutes >= 60) {
            const horas = Math.floor(minutes / 60);
            const minutos = minutes % 60;
            return `${horas}h ${minutos > 0 ? `${minutos}min` : ''}`;
          } else return `${minutes} minutos`;
        }
      } catch (e) { console.error('Error al calcular duración:', e); }
    }
    return 'Duración no disponible';
  };

  const precioMinimo = (instancia: InstanciaTour): number => {
    if (!instancia.tour_programado?.tipos_pasaje?.length) return 0;
    const precios = instancia.tour_programado.tipos_pasaje.map(tp => tp.costo);
    return precios.length > 0 ? Math.min(...precios) : 0;
  };

  const getImagenTour = (instancia: InstanciaTour): string => {
    try {
      if (!instancia.tour_programado) return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
      if (instancia.tour_programado.tipo_tour && instancia.tour_programado.tipo_tour.url_imagen) {
        const urlImagen = instancia.tour_programado.tipo_tour.url_imagen;
        if (typeof urlImagen === 'string') return urlImagen;
        if (typeof urlImagen === 'object' && urlImagen !== null && 'String' in urlImagen && 'Valid' in urlImagen) {
          const validObj = urlImagen as unknown as StringWithValidity;
          if (validObj.Valid) return validObj.String;
        }
      }
      const galeria = instancia.tour_programado.galeria_imagenes || [];
      if (galeria.length > 0) {
        const imagenPortada = galeria.find(img => img.es_portada);
        if (imagenPortada && imagenPortada.imagen_url) return imagenPortada.imagen_url;
        if (galeria[0] && galeria[0].imagen_url) return galeria[0].imagen_url;
      }
      return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
    } catch (error) {
      console.error("Error al obtener imagen del tour:", error);
      return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
    }
  };

  const getImagenesGaleria = (instancia: InstanciaTour): GaleriaTour[] => {
    const galeria = instancia.tour_programado?.galeria_imagenes || [];
    return galeria.filter(img => img && img.imagen_url && typeof img.imagen_url === 'string' && img.imagen_url.trim() !== '');
  };

  const getNombreTipoTour = (instancia: InstanciaTour): string => {
    return safeGetStringValue(instancia.nombre_tipo_tour) || safeGetStringValue(instancia.tour_programado?.tipo_tour?.nombre) || 'Tour';
  };

  const getDescripcionTipoTour = (instancia: InstanciaTour): string => {
    if (instancia.tour_programado?.tipo_tour?.descripcion) return safeGetStringValue(instancia.tour_programado.tipo_tour.descripcion);
    if (instancia.tour_programado?.notas_excepcion) return safeGetStringValue(instancia.tour_programado.notas_excepcion);
    return 'Sin descripción disponible';
  };

  const renderFechaCorta = (fecha: string): React.ReactNode => {
    try {
      const parsedFecha = parse(fecha, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedFecha)) return <span className="text-xs">{fecha}</span>;
      const esHoy = fecha === currentDate;
      const esMañana = fecha === format(addDays(getCurrentDateTimePeru(), 1), 'yyyy-MM-dd');
      return (
        <div className="flex flex-col items-center text-center">
          <span className={`text-xs uppercase font-bold mb-1 ${esHoy ? 'text-teal-600' : esMañana ? 'text-teal-600' : 'text-gray-600'}`}>
            {esHoy ? 'HOY' : esMañana ? 'MAÑANA' : format(parsedFecha, 'EEE', { locale: es })}
          </span>
          <span className={`text-lg font-bold ${esHoy ? 'text-teal-700' : esMañana ? 'text-teal-700' : 'text-gray-700'}`}>
            {format(parsedFecha, 'dd', { locale: es })}
          </span>
          <span className={`text-xs mt-1 capitalize ${esHoy ? 'text-teal-600' : esMañana ? 'text-teal-600' : 'text-gray-500'}`}>
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
      if (!instancia.fecha_especifica) return <span>Fecha no disponible</span>;
      const fecha = instancia.fecha_especifica;
      const parsedFecha = parse(fecha, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedFecha)) return <span>{fecha}</span>;
      return <span>{format(parsedFecha, 'dd MMM yyyy', { locale: es })}</span>;
    } catch (error) {
      console.error(`Error al renderizar fecha de instancia`, error);
      return <span>Fecha no disponible</span>;
    }
  };

  // Badge de estado de disponibilidad
  const renderEstadoBadge = (instancia: InstanciaTour) => {
    const estadoDisp = calcularEstadoDisponibilidad(instancia);
    
    if (estadoDisp.estado === 'BLOQUEADO') {
      return (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center">
          <FaBan className="mr-1" /> BLOQUEADO
        </div>
      );
    }
    
    if (estadoDisp.estado === 'ADVERTENCIA') {
      return (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center">
          <FaExclamationTriangle className="mr-1" /> VERIFICAR
        </div>
      );
    }
    
    return (
      <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs px-2 py-1 rounded flex items-center">
        <FaCheckCircle className="mr-1" /> {instancia.estado}
      </div>
    );
  };

  // Modal de confirmación para tours con advertencia
  const ConfirmacionModal = () => {
    if (!tourToConfirm) return null;
    const estadoDisp = calcularEstadoDisponibilidad(tourToConfirm);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4" onClick={() => setShowConfirmModal(false)}>
        <div className="relative bg-white rounded-lg overflow-hidden w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-3xl mr-3" />
              <h2 className="text-xl font-bold text-gray-800">Confirmar Reserva</h2>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="text-sm text-gray-700">{estadoDisp.mensaje}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800 mb-2">Detalles del Tour:</p>
              <div className="space-y-1 text-sm text-gray-600">
                <div><strong>Tour:</strong> {getNombreTipoTour(tourToConfirm)}</div>
                <div><strong>Hora de salida:</strong> {formatearHora(tourToConfirm.hora_inicio, tourToConfirm.fecha_especifica)}</div>
                <div><strong>Fecha:</strong> {renderFechaInstancia(tourToConfirm)}</div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
              <p className="text-xs text-blue-800">
                <strong>Importante:</strong> Por favor, verifique la disponibilidad con el cliente antes de confirmar esta reserva. 
                El tour está próximo a iniciar o ya ha iniciado.
              </p>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={confirmarReservaConAdvertencia} 
                className="flex-1 py-2 text-sm bg-yellow-600 text-white hover:bg-yellow-700" 
                variant="warning"
              >
                <FaCheckCircle className="mr-1" /> Continuar con Reserva
              </Button>
              <Button 
                onClick={() => {
                  setShowConfirmModal(false);
                  setTourToConfirm(null);
                }} 
                className="flex-1 py-2 text-sm bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                <FaTimes className="mr-1" /> Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DetallesModal = () => {
    if (!selectedTour) return null;
    const instancia = selectedTour;
    const imagenes = getImagenesGaleria(instancia);
    const currentImage = imagenes.length > 0 ? imagenes[currentImageIndex] : null;
    const estadoDisp = calcularEstadoDisponibilidad(instancia);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 overflow-y-auto" onClick={handleCloseModal}>
        <div className="relative bg-white rounded-lg overflow-hidden w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <button onClick={handleCloseModal} className="absolute top-3 right-3 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 z-10">
            <FaTimes className="text-xl" />
          </button>
          <div className="relative h-64 bg-gray-200">
            {imagenes.length > 0 ? (
              <>
                <img src={currentImage?.imagen_url || getImagenTour(instancia)} alt={currentImage?.descripcion || getNombreTipoTour(instancia)} className="w-full h-full object-cover" />
                {imagenes.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100">
                      ←
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleNextImage(); }} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100">
                      →
                    </button>
                  </>
                )}
              </>
            ) : <div className="w-full h-full flex items-center justify-center"><FaShip className="text-gray-400 text-4xl" /></div>}
          </div>
          <div className="p-6">
            {/* Mensaje de advertencia o bloqueo */}
            {estadoDisp.estado !== 'DISPONIBLE' && (
              <div className={`mb-4 p-3 rounded-lg border-l-4 ${
                estadoDisp.estado === 'BLOQUEADO' 
                  ? 'bg-red-50 border-red-500' 
                  : 'bg-yellow-50 border-yellow-500'
              }`}>
                <p className={`text-sm ${
                  estadoDisp.estado === 'BLOQUEADO' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {estadoDisp.mensaje}
                </p>
              </div>
            )}

            <div className="mb-4">
              <div className="text-sm text-gray-500 flex items-center mb-2">
                <FaMapMarkerAlt className="mr-1 text-teal-600" /><span>{safeGetStringValue(instancia.nombre_sede)}</span>
                <span className="mx-1">•</span>
                <FaCalendarAlt className="mr-1 text-teal-600" /><span>{renderFechaInstancia(instancia)}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{getNombreTipoTour(instancia)}</h2>
              <div className="flex items-center mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  estadoDisp.estado === 'BLOQUEADO' 
                    ? 'bg-red-100 text-red-700'
                    : estadoDisp.estado === 'ADVERTENCIA'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-teal-100 text-teal-700'
                }`}>
                  {estadoDisp.estado === 'BLOQUEADO' ? 'NO DISPONIBLE' : instancia.estado}
                </span>
                <span className="ml-2 text-teal-700 text-xs">🕒 {calcularDuracion(instancia)}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-teal-800 flex items-center mb-2"><FaInfoCircle className="mr-1" /> Información</h3>
                <p className="text-gray-700 text-sm">{getDescripcionTipoTour(instancia)}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div><span className="text-xs text-gray-500">Salida:</span> <span className="font-bold">{formatearHora(instancia.hora_inicio, instancia.fecha_especifica)}</span></div>
                  <div><span className="text-xs text-gray-500">Regreso:</span> <span className="font-bold">{formatearHora(instancia.hora_fin, instancia.fecha_especifica)}</span></div>
                  <div><span className="text-xs text-gray-500">Cupo:</span> <span className="font-bold">{instancia.cupo_disponible} de {instancia.tour_programado?.cupo_maximo || '?'}</span></div>
                  <div><span className="text-xs text-gray-500">Precio:</span> <span className="font-bold">S/ {precioMinimo(instancia).toFixed(2)}</span></div>
                </div>
              </div>
              {instancia.tour_programado?.tipos_pasaje && instancia.tour_programado.tipos_pasaje.length > 0 && (
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-teal-800 flex items-center mb-2"><FaTicketAlt className="mr-1" /> Pasajes</h3>
                  <div className="space-y-2">
                    {instancia.tour_programado.tipos_pasaje.map(tipo => (
                      <div key={tipo.id_tipo_pasaje} className="flex justify-between text-sm">
                        <span>{safeGetStringValue(tipo.nombre)} ({tipo.edad})</span>
                        <span className="font-bold">S/ {tipo.costo.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex space-x-2">
              <Button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleCreateReserva(instancia); 
                }} 
                className={`flex-1 py-2 text-sm ${
                  estadoDisp.estado === 'BLOQUEADO'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : estadoDisp.estado === 'ADVERTENCIA'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-teal-600 hover:bg-teal-700'
                } text-white`}
                disabled={estadoDisp.estado === 'BLOQUEADO'}
              >
                {estadoDisp.estado === 'BLOQUEADO' ? (
                  <><FaBan className="mr-1" /> No Disponible</>
                ) : estadoDisp.estado === 'ADVERTENCIA' ? (
                  <><FaExclamationTriangle className="mr-1" /> Reservar (Verificar)</>
                ) : (
                  <><FaCalendarAlt className="mr-1" /> Reservar</>
                )}
              </Button>
              <Button onClick={handleCloseModal} className="flex-1 py-2 text-sm bg-gray-200 text-gray-800 hover:bg-gray-300">
                <FaTimes className="mr-1" /> Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthReady || sedeError) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow">
            {!isAuthReady ? (
              <>
                <div className="animate-spin h-12 w-12 border-t-4 border-teal-600 rounded-full mx-auto mb-4"></div>
                <h2 className="text-lg font-bold text-gray-700 text-center">Verificando sesión...</h2>
                <p className="text-gray-500 text-center mt-2">Por favor espere.</p>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <FaShip className="text-4xl text-gray-400 mb-4" />
                  <h2 className="text-xl font-bold text-gray-800 text-center">No hay sede seleccionada</h2>
                  <p className="text-gray-600 text-center mt-2">Contacte al administrador para asignar una sede.</p>
                  <button onClick={handleForceReload} className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                    <FaSync className="mr-1" /> Actualizar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-4 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h1 className="text-2xl font-bold text-gray-800">Mis Reservas</h1>
          <p className="text-gray-600 text-sm">Gestiona tus aventuras y experiencias</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
            <div className="text-center"><span className="font-bold text-teal-600">✓ {39}</span> Confirmadas</div>
            <div className="text-center"><span className="font-bold text-teal-600">⏱ {0}</span> Pendientes</div>
            <div className="text-center"><span className="font-bold text-teal-600">📅 {0}</span> Reservadas</div>
            <div className="text-center"><span className="font-bold text-teal-600">📊 {68}</span> Total</div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <button className="bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">🔍 TODOS (68)</button>
            <button className="bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">✓ CONFIRMADA (39)</button>
            <button className="bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">📅 RESERVADO (0)</button>
            <button className="bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">⏱ PENDIENTE (0)</button>
            <button className="bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">✕ CANCELADA (29)</button>
          </div>
        </div>

        {loadError && (
          <div className="bg-teal-50 p-4 rounded-lg flex items-center">
            <span className="text-teal-700 text-sm">{loadError}</span>
            <button onClick={handleForceReload} className="ml-2 text-teal-600 hover:text-teal-800"><FaSync /></button>
          </div>
        )}

        {/* Selector de fechas mejorado */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Seleccionar Fecha:</h3>
          <div className="grid grid-cols-7 gap-2">
            {nextDates.map((fecha) => (
              <button
                key={fecha}
                onClick={() => setSelectedDate(fecha)}
                className={`p-2 rounded-lg border transition-all ${
                  selectedDate === fecha
                    ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                    : 'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                {renderFechaCorta(fecha)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <input
              type="text"
              placeholder="Buscar tours..."
              className="border border-teal-200 rounded px-3 py-2 flex-1 text-sm focus:outline-none focus:border-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border border-teal-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
              value={selectedTipoTour || ''}
              onChange={(e) => setSelectedTipoTour(e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <option value="">Todos los tours</option>
              {tiposTour.map(tipo => <option key={tipo.id_tipo_tour} value={tipo.id_tipo_tour}>{safeGetStringValue(tipo.nombre)}</option>)}
            </select>
            <button onClick={handleForceReload} className="bg-teal-600 text-white px-3 py-2 rounded hover:bg-teal-700 text-sm flex items-center">
              <FaSync className="mr-1" /> Actualizar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center p-8 bg-white rounded-lg shadow">
              <div className="animate-spin h-12 w-12 border-t-4 border-teal-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando tours disponibles...</p>
            </div>
          ) : filteredInstancias.length === 0 ? (
            <div className="col-span-full text-center p-8 bg-white rounded-lg shadow">
              <FaShip className="text-gray-400 text-4xl mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay tours disponibles</h3>
              <p className="text-sm text-gray-500 mb-4">No se encontraron tours para la fecha seleccionada</p>
              <button 
                onClick={() => setSelectedDate(currentDate)} 
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm"
              >
                Ver tours de hoy
              </button>
            </div>
          ) : (
            filteredInstancias.map(instancia => {
              const estadoDisp = calcularEstadoDisponibilidad(instancia);
              return (
                <Card key={instancia.id_instancia} className="rounded-lg overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col h-full">
                    <div className="relative w-full h-40 overflow-hidden">
                      <img 
                        src={getImagenTour(instancia)} 
                        alt={getNombreTipoTour(instancia)} 
                        className="w-full h-full object-cover" 
                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen'} 
                      />
                      {renderEstadoBadge(instancia)}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-base font-bold text-gray-800 mb-2">{getNombreTipoTour(instancia)}</h3>
                      
                      {/* Mensaje de advertencia o bloqueo en la tarjeta */}
                      {estadoDisp.estado !== 'DISPONIBLE' && (
                        <div className={`text-xs p-2 rounded mb-2 ${
                          estadoDisp.estado === 'BLOQUEADO' 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}>
                          {estadoDisp.estado === 'BLOQUEADO' 
                            ? '🚫 No disponible' 
                            : '⚠️ Verificar disponibilidad'}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="flex items-center">
                          <FaClock className="mr-1 text-teal-600 flex-shrink-0" /> 
                          <span className="font-semibold">{formatearHora(instancia.hora_inicio, instancia.fecha_especifica)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUserFriends className="mr-1 text-teal-600 flex-shrink-0" /> 
                          <span>{instancia.cupo_disponible} cupos</span>
                        </div>
                        <div className="flex items-center col-span-2">
                          <FaCalendarCheck className="mr-1 text-teal-600 flex-shrink-0" /> 
                          <span>{renderFechaInstancia(instancia)}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Desde: </span>
                          <span className="font-bold text-teal-700">S/ {precioMinimo(instancia).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-2 flex space-x-2">
                        <Button 
                          onClick={() => handleCreateReserva(instancia)} 
                          className={`flex-1 py-2 px-3 text-xs font-semibold ${
                            estadoDisp.estado === 'BLOQUEADO'
                              ? 'bg-gray-400 cursor-not-allowed'
                              : estadoDisp.estado === 'ADVERTENCIA'
                              ? 'bg-yellow-600 hover:bg-yellow-700'
                              : 'bg-teal-600 hover:bg-teal-700'
                          } text-white rounded transition-colors`}
                          disabled={estadoDisp.estado === 'BLOQUEADO'}
                        >
                          {estadoDisp.estado === 'BLOQUEADO' ? (
                            <><FaBan className="inline mr-1" /> Bloqueado</>
                          ) : estadoDisp.estado === 'ADVERTENCIA' ? (
                            <><FaExclamationTriangle className="inline mr-1" /> Verificar</>
                          ) : (
                            <><FaCalendarAlt className="inline mr-1" /> Reservar</>
                          )}
                        </Button>
                        <Button 
                          onClick={() => handleViewDetails(instancia)} 
                          className="py-2 px-3 text-xs bg-gray-100 text-teal-700 hover:bg-gray-200 rounded border border-teal-200"
                        >
                          <FaInfoCircle className="text-base" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {modalOpen && <DetallesModal />}
        {showConfirmModal && <ConfirmacionModal />}
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
`;
document.head.appendChild(style);

export default MisReservasPage;