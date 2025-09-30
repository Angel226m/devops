/*import React, { useState, useEffect, useCallback } from 'react';
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

const ToursDisponiblesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Estados para el modal
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
      console.log("Autenticación completada");
      setIsAuthReady(true);

      if (selectedSede?.id_sede) {
        console.log("Sede seleccionada:", selectedSede.id_sede);
        setSedeError(false);
        return true;
      } else {
        console.log("No hay sede seleccionada");
        setSedeError(true);
        return false;
      }
    } else {
      console.log("Esperando autenticación");
      return false;
    }
  }, [isAuthenticated, selectedSede]);

  useEffect(() => {
    checkAuthAndSede();
  }, [checkAuthAndSede]);

  const safeGetStringValue = (obj: any): string => {
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'string') return obj;

    if (isStringWithValidity(obj)) {
      return obj.Valid ? obj.String : '';
    }

    return String(obj);
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

  const fetchData = useCallback(async () => {
    try {
      if (!checkAuthAndSede()) {
        console.log("No se puede cargar datos sin autenticación o sede");
        setLoading(false);
        return;
      }

      console.log("Iniciando carga de datos...");
      setLoading(true);
      setLoadError(null);

      const fetchTiposTour = async () => {
        console.log("Cargando tipos de tour...");
        try {
          const response = await axios.get(endpoints.tiposTour.vendedorList);
          console.log('Respuesta de tipos tour:', response.data);

          const tiposTourArray = getDataArray<TipoTour>(response);

          const tiposTourSede = tiposTourArray.filter(tipo => 
            tipo.id_sede === selectedSede!.id_sede
          );

          setTiposTour(tiposTourSede);
          console.log(`Se cargaron ${tiposTourSede.length} tipos de tour`);
          return true;
        } catch (error) {
          console.error('Error al cargar tipos de tour:', error);
          setLoadError("Error al cargar tipos de tour. Intente recargar la página.");
          return false;
        }
      };

      const fetchInstanciasTour = async () => {
        console.log("Cargando instancias de tour...");
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
          console.log('Respuesta de instancias tour:', response.data);

          const instanciasArray = getDataArray<InstanciaTour>(response);
          console.log(`Se encontraron ${instanciasArray.length} instancias`);

          if (instanciasArray.length === 0) {
            setInstanciasTour([]);
            setFilteredInstancias([]);
            return true;
          }

          const instanciasEnriquecidas = await Promise.all(
            instanciasArray.map(async (instancia: InstanciaTour, index) => {
              try {
                console.log(`[${index + 1}/${instanciasArray.length}] Procesando instancia ID ${instancia.id_instancia}...`);
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
                        console.log(`URL de imagen del tipo de tour ${tipoTourId}:`, tipoTourData.url_imagen);

                        try {
                          const galeriaResponse = await axios.get(
                            endpoints.galeriaTour.vendedorListByTipoTour(tipoTourId)
                          );

                          const galeriaData = getDataArray<GaleriaTour>(galeriaResponse);
                          instancia.tour_programado.galeria_imagenes = galeriaData;
                          console.log(`Se cargaron ${galeriaData.length} imágenes para el tipo de tour ${tipoTourId}`);
                        } catch (err) {
                          console.error(`Error al cargar galería para tipo tour ${tipoTourId}:`, err);
                          instancia.tour_programado.galeria_imagenes = [];
                        }

                        try {
                          const tiposPasajeResponse = await axios.get(
                            endpoints.tipoPasaje.vendedorListByTipoTour(tipoTourId)
                          );

                          const tiposPasajeData = getDataArray<TipoPasaje>(tiposPasajeResponse);
                          instancia.tour_programado.tipos_pasaje = tiposPasajeData;
                          console.log(`Se cargaron ${tiposPasajeData.length} tipos de pasaje para el tipo de tour ${tipoTourId}`);
                        } catch (err) {
                          console.error(`Error al cargar tipos de pasaje para tipo tour ${tipoTourId}:`, err);
                          instancia.tour_programado.tipos_pasaje = [];
                        }

                        try {
                          const paquetesResponse = await axios.get(
                            endpoints.paquetePasajes.vendedorListByTipoTour(tipoTourId)
                          );

                          const paquetesData = getDataArray<PaquetePasajes>(paquetesResponse);
                          instancia.tour_programado.paquetes_pasajes = paquetesData;
                          console.log(`Se cargaron ${paquetesData.length} paquetes para el tipo de tour ${tipoTourId}`);
                        } catch (err) {
                          console.error(`Error al cargar paquetes de pasajes para tipo tour ${tipoTourId}:`, err);
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
          console.log("Datos de instancias enriquecidas cargados correctamente");
          return true;
        } catch (error) {
          console.error('Error al cargar instancias de tour:', error);
          setLoadError("Error al cargar instancias de tour. Intente recargar la página.");
          return false;
        }
      };

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

  useEffect(() => {
    if (isAuthReady && selectedSede && !dataLoaded) {
      console.log("Autenticación completa, iniciando carga de datos...");
      fetchData();
    }
  }, [isAuthReady, selectedSede, dataLoaded, fetchData]);

  useEffect(() => {
    if (dataLoaded && !sedeError) {
      console.log("Filtros cambiados, recargando datos...");
      fetchData();
    }
  }, [selectedDate, selectedTipoTour, fetchData, dataLoaded, sedeError]);

  const handleForceReload = () => {
    console.log("Recargando datos manualmente...");
    fetchData();
  };

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
    console.log('Crear reserva para:', instancia);
    navigate(`/vendedor/reservas/nueva?instanciaId=${instancia.id_instancia}`);
  };

  // Modificar para abrir el modal en lugar de navegar
  const handleViewDetails = (instancia: InstanciaTour) => {
    console.log('Ver detalles de:', instancia);
    setSelectedTour(instancia);
    setModalOpen(true);
    setCurrentImageIndex(0); // Reiniciar el índice de imagen al abrir
    // Scroll a inicio del modal (importante para móviles)
    document.body.style.overflow = 'hidden'; // Prevenir scroll en la página principal
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTour(null);
    document.body.style.overflow = 'auto'; // Restaurar scroll
  };

  // Navegación de imágenes en el modal
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
        if (isValid(date)) {
          return format(date, 'hh:mm a', { locale: es });
        }
      }

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

  const calcularDuracion = (instancia: InstanciaTour): string => {
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

        const inicio = parse(instancia.hora_inicio, 'HH:mm:ss', new Date());
        const fin = parse(instancia.hora_fin, 'HH:mm:ss', new Date());

        if (isValid(inicio) && isValid(fin)) {
          let minutes = differenceInMinutes(fin, inicio);
          if (minutes < 0) {
            minutes += 24 * 60;
          }

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
      if (!instancia.tour_programado) {
        console.log("No hay tour_programado en la instancia");
        return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
      }

      if (instancia.tour_programado.tipo_tour && instancia.tour_programado.tipo_tour.url_imagen) {
        const urlImagen = instancia.tour_programado.tipo_tour.url_imagen;
        console.log("Usando url_imagen del tipo_tour:", urlImagen);

        if (typeof urlImagen === 'string') {
          return urlImagen;
        }

        if (typeof urlImagen === 'object' && urlImagen !== null) {
          if ('String' in urlImagen && 'Valid' in urlImagen) {
            const validObj = urlImagen as unknown as StringWithValidity;
            if (validObj.Valid) {
              return validObj.String;
            }
          }
        }
      }

      const galeria = instancia.tour_programado.galeria_imagenes || [];

      if (galeria.length > 0) {
        const imagenPortada = galeria.find(img => img.es_portada);
        if (imagenPortada && imagenPortada.imagen_url) {
          console.log("Usando imagen de portada de galería:", imagenPortada.imagen_url);
          return imagenPortada.imagen_url;
        }

        if (galeria[0] && galeria[0].imagen_url) {
          console.log("Usando primera imagen de galería:", galeria[0].imagen_url);
          return galeria[0].imagen_url;
        }
      }

      console.log("No se encontró imagen, usando imagen por defecto");
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

  // Componente de Modal para detalles del tour
  const DetallesModal = () => {
    if (!selectedTour) return null;

    const instancia = selectedTour;
    const imagenes = getImagenesGaleria(instancia);
    const currentImage = imagenes.length > 0 ? imagenes[currentImageIndex] : null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 overflow-y-auto backdrop-blur-sm" onClick={handleCloseModal}>
        <div 
          className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón de cerrar *//*}
          <button 
            onClick={handleCloseModal}
            className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-700 text-xl" />
          </button>

          {/* Galería de imágenes *//*}
          <div className="relative h-80 md:h-96 bg-gray-200">
            {imagenes.length > 0 ? (
              <>
                <img 
                  src={currentImage?.imagen_url || getImagenTour(instancia)} 
                  alt={currentImage?.descripcion || getNombreTipoTour(instancia)}
                  className="w-full h-full object-cover"
                />
                {imagenes.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-3 shadow-lg"
                    >
                      <FaInfoCircle className="rotate-180 text-gray-800" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNextImage(); }} 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-3 shadow-lg"
                    >
                      <FaInfoCircle className="text-gray-800" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {imagenes.map((_, idx) => (
                        <button 
                          key={idx} 
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                          className={`w-3 h-3 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                          aria-label={`Ver imagen ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaShip className="text-6xl text-gray-400" />
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Encabezado *//*}
            <div className="mb-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <FaMapMarkerAlt className="mr-2 text-green-500" />
                <span>{safeGetStringValue(instancia.nombre_sede)}</span>
                <span className="mx-2">•</span>
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <span>{renderFechaInstancia(instancia)}</span>
                <span className="mx-2">•</span>
                <FaShip className="mr-2 text-purple-500" />
                <span>{safeGetStringValue(instancia.nombre_embarcacion)}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{getNombreTipoTour(instancia)}</h2>
              <div className="flex items-center mt-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mr-2">
                  {instancia.estado}
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  🕒 {calcularDuracion(instancia)}
                </span>
              </div>
            </div>

            {/* Información principal *//*}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <FaInfoCircle className="mr-2" /> Información del Tour
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {getDescripcionTipoTour(instancia)}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Hora de salida</div>
                    <div className="font-bold text-lg text-blue-800">{safeGetStringValue(instancia.hora_inicio_str || formatearHora(instancia.hora_inicio))}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Hora de regreso</div>
                    <div className="font-bold text-lg text-blue-800">{safeGetStringValue(instancia.hora_fin_str || formatearHora(instancia.hora_fin))}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Cupo disponible</div>
                    <div className="font-bold text-lg text-green-600">{instancia.cupo_disponible} de {instancia.tour_programado?.cupo_maximo || '?'}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Precio desde</div>
                    <div className="font-bold text-lg text-green-600">S/ {precioMinimo(instancia).toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Tipos de pasaje *//*}
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                  <FaTicketAlt className="mr-2" /> Tipos de Pasaje
                </h3>
                <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                  {instancia.tour_programado?.tipos_pasaje && instancia.tour_programado.tipos_pasaje.length > 0 ? (
                    instancia.tour_programado.tipos_pasaje.map(tipo => (
                      <div key={tipo.id_tipo_pasaje} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-800">{safeGetStringValue(tipo.nombre)}</div>
                          <div className="text-sm text-gray-500">Edad: {tipo.edad}</div>
                        </div>
                        <div className="font-bold text-green-600 text-xl">S/ {tipo.costo.toFixed(2)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No hay información de tipos de pasaje disponible
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Paquetes de pasajes *//*}
            {instancia.tour_programado?.paquetes_pasajes && instancia.tour_programado.paquetes_pasajes.length > 0 && (
              <div className="mb-8 bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
                  <FaBox className="mr-2" /> Paquetes Disponibles
                </h3>
                <div className="space-y-4">
                  {instancia.tour_programado.paquetes_pasajes.map(paquete => (
                    <div key={paquete.id_paquete} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold text-gray-800 text-lg">{safeGetStringValue(paquete.nombre)}</div>
                        <div className="font-bold text-green-600 text-xl">S/ {paquete.precio_total.toFixed(2)}</div>
                      </div>
                      <p className="text-gray-600 mb-2">{safeGetStringValue(paquete.descripcion)}</p>
                      <div className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full inline-block">
                        {paquete.cantidad_total} pasajes incluidos
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción *//*}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                onClick={(e) => { e.stopPropagation(); handleCreateReserva(instancia); }}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                variant="success"
              >
                <FaCalendarAlt className="mr-3" /> 🎫 Reservar Ahora
              </Button>
              <Button 
                onClick={handleCloseModal}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <FaTimes className="mr-3" /> Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthReady || sedeError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
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
                    
                    <div className="mt-8 border-t border-gray-200 pt-6 w-full">
                      <h3 className="font-semibold text-gray-700 mb-4">¿Qué puede hacer?</h3>
                      <ul className="text-left space-y-3 text-gray-600">
                        <li className="flex items-start">
                          <span className="mr-3 mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          <span>Verificar que ha iniciado sesión correctamente</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-3 mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          <span>Contactar al administrador para que le asigne una sede</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-3 mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          <span>Intentar recargar la página para actualizar su sesión</span>
                        </li>
                      </ul>
                    </div>
                    
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
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">🏖 Tours Disponibles</h1>
              <p className="text-gray-600 flex items-center text-lg">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <span className="font-semibold">{formatearFecha(selectedDate)}</span>
                <span className="mx-2">•</span>
                <FaMapMarkerAlt className="mr-2 text-green-500" />
                <span className="font-semibold">{safeGetStringValue(selectedSede?.nombre)}</span>
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

        {loadError && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 text-red-700 flex items-start shadow-lg">
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

        <div className="bg-white rounded-2xl shadow-lg p-8 overflow-x-auto border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            Seleccionar Fecha
          </h3>
          <div className="flex space-x-3">
            {nextDates.map((date, index) => {
              const esSeleccionado = selectedDate === date;
              const esHoy = date === currentDate;
              const esMañana = date === format(addDays(new Date(), 1), 'yyyy-MM-dd');

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-4 py-4 rounded-2xl font-medium whitespace-nowrap min-w-[120px] transition-all duration-200 transform hover:scale-105 ${
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

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaSearch className="mr-2 text-blue-500" />
            Filtros de Búsqueda
          </h3>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar por nombre, descripción, embarcación..."
                className="pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-4.5 text-gray-400 text-xl" />
            </div>

            <div className="md:w-1/3">
              <select
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium bg-white text-lg"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full p-12 text-center">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
              <p className="text-xl font-semibold text-gray-700 mb-2">Cargando tours disponibles...</p>
              <p className="text-gray-500">Esto puede tomar unos momentos</p>
            </div>
          ) : filteredInstancias.length === 0 ? (
            <div className="col-span-full">
              <div className="text-center p-12 bg-white rounded-2xl shadow-lg border border-gray-100">
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
              <Card key={instancia.id_instancia} className="rounded-2xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:scale-[1.02]">
                <div className="flex flex-col h-full">
                  {/* Imagen principal del tour - simplificada *//*}
                  <div className="w-full h-56 overflow-hidden relative">
                    <img 
                      src={getImagenTour(instancia)} 
                      alt={safeGetStringValue(getNombreTipoTour(instancia))}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      onError={(e) => {
                        console.log("Error al cargar imagen, usando fallback");
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ✅ {instancia.estado}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    {/* Título y breve descripción *//*}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{safeGetStringValue(getNombreTipoTour(instancia))}</h3>
                    
                    {/* Información esencial *//*}
                    <div className="grid grid-cols-2 gap-4 my-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg mr-3">
                          <FaClock className="text-blue-600" /> 
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Salida</p>
                          <p className="font-bold">{safeGetStringValue(instancia.hora_inicio_str || formatearHora(instancia.hora_inicio))}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg mr-3">
                          <FaUserFriends className="text-green-600" /> 
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Disponibles</p>
                          <p className="font-bold">{instancia.cupo_disponible}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-lg mr-3">
                          <FaCalendarCheck className="text-amber-600" /> 
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Fecha</p>
                          <p className="font-bold">{renderFechaInstancia(instancia)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-lg mr-3">
                          <FaClock className="text-purple-600" /> 
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Duración</p>
                          <p className="font-bold">{calcularDuracion(instancia)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Precio *//*}
                    <div className="bg-green-50 p-3 rounded-xl border border-green-200 flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">Desde:</span>
                      <span className="font-bold text-xl text-green-600">S/ {precioMinimo(instancia).toFixed(2)}</span>
                    </div>

                                      {/* Botones de acción *//*}
                    <div className="mt-auto pt-4 grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => handleCreateReserva(instancia)}
                        className="py-3 text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-200"
                        variant="success"
                      >
                        <FaCalendarAlt className="mr-2" /> Reservar
                      </Button>
                      <Button 
                        onClick={() => handleViewDetails(instancia)}
                        className="py-3 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <FaInfoCircle className="mr-2" /> Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Modal de detalles *//*}
        {modalOpen && <DetallesModal />}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 border border-gray-200">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
              <p className="text-xl font-semibold text-gray-700 mb-2">Cargando información de tours...</p>
              <p className="text-sm text-gray-500 leading-relaxed">Esto puede tomar unos momentos mientras obtenemos todos los datos.</p>
              <div className="mt-4 bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">⏳ Procesando datos...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Añadir estilo global para la animación de fadeIn
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default ToursDisponiblesPage;*/
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Printer, ArrowLeft, Users, MapPin, Clock, CreditCard, FileText, Calendar, Building, Package, Copy, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { RootState, AppDispatch } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { obtenerDetalleReservaPorId, limpiarReservaDetalle } from '../../../store/slices/sliceReserva';
import Cargador from '../../componentes/comunes/Cargador';
import Alerta from '../../componentes/comunes/Alerta';

interface CantidadPasaje {
  id_tipo_pasaje?: number;
  nombre_tipo?: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
}

interface PaqueteReserva {
  id_paquete: number;
  nombre_paquete?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  cantidad_total?: number;
  desglose_pasajes?: { tipo: string; cantidad: number }[];
}

interface ReservaDetallada {
  id: number;
  id_vendedor?: number | null;
  id_cliente: number;
  id_instancia?: number;
  id_sede?: number;
  total_pagar: number;
  cantidad_pasajes?: CantidadPasaje[];
  paquetes?: PaqueteReserva[];
  notas?: string;
  fecha_reserva: string;
  fecha_actualizacion: string;
  fecha_expiracion?: string;
  metodo_pago?: string;
  estado: EstadoReserva;
  fecha_cancelacion?: string;
  nombre_cliente?: string;
  nombre_vendedor?: string;
  nombre_tour?: string;
  descripcion_tour?: string;
  fecha_tour?: string;
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  duracion_tour?: number;
  cliente?: {
    nombres: string;
    apellidos: string;
    email: string;
    telefono?: string;
    tipo_documento?: string;
    numero_documento?: string;
  };
  sede?: {
    nombre: string;
    direccion?: string;
    telefono?: string;
  };
}

type EstadoReserva = 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE' | 'PROCESADO' | 'ANULADO' | 'RESERVADO';

const PaginaDetalleReserva = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { reservaDetalle, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  const reserva = reservaDetalle as ReservaDetallada | null;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id && !isNaN(parseInt(id)) && autenticado) {
      dispatch(obtenerDetalleReservaPorId(parseInt(id)));
    } else if (!autenticado) {
      navigate(`/ingresar?redirect=/mis-reservas/${id}`);
    } else {
      navigate('/mis-reservas');
    }
    return () => {
      dispatch(limpiarReservaDetalle());
    };
  }, [id, dispatch, autenticado, navigate]);

  // ✅ Función mejorada para formatear fechas
  const formatearFecha = (fechaStr?: string, formato: 'completo' | 'corto' | 'relativo' = 'completo'): string => {
    if (!fechaStr) return 'No disponible';
    
    try {
      let fecha: Date;
      
      if (fechaStr.includes('/')) {
        const [day, month, year] = fechaStr.split('/').map(Number);
        if (year && month && day) {
          fecha = new Date(year, month - 1, day);
        } else {
          return 'Fecha inválida';
        }
      } else if (fechaStr.includes('-')) {
        const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
        if (year && month && day) {
          fecha = new Date(year, month - 1, day);
        } else {
          return 'Fecha inválida';
        }
      } else {
        fecha = new Date(fechaStr);
      }
      
      if (isNaN(fecha.getTime())) {
        return 'Fecha inválida';
      }
      
      switch (formato) {
        case 'relativo':
          return formatDistanceToNow(fecha, { addSuffix: true, locale: es });
        case 'completo':
          return format(fecha, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
        case 'corto':
          return format(fecha, 'd MMM yyyy', { locale: es });
        default:
          return format(fecha, 'd MMMM yyyy', { locale: es });
      }
      
    } catch (error) {
      console.error('Error al formatear fecha:', fechaStr, error);
      return 'Fecha inválida';
    }
  };

  const formatearHora = (horaStr?: string): string => {
    if (!horaStr) return 'N/A';
    return horaStr.includes(':') ? horaStr.split(':').slice(0, 2).join(':') : horaStr;
  };

  const getEstadoClase = (estado: EstadoReserva): string => ({
    CONFIRMADA: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELADA: 'bg-red-50 text-red-700 border-red-200',
    PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
    PROCESADO: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    ANULADO: 'bg-gray-50 text-gray-700 border-gray-200',
    RESERVADO: 'bg-teal-50 text-teal-700 border-teal-200',
  })[estado] || 'bg-gray-50 text-gray-700 border-gray-200';

  const getEstadoTexto = (estado: EstadoReserva): string => ({
    CONFIRMADA: 'Confirmada',
    CANCELADA: 'Cancelada',
    PENDIENTE: 'Pendiente',
    PROCESADO: 'Procesado',
    ANULADO: 'Anulado',
    RESERVADO: 'Reservado',
  })[estado] || estado;

  const calcularTotalPasajeros = useMemo(() => {
    if (!reserva) return 0;
    const totalIndividuales = (reserva.cantidad_pasajes || []).reduce((sum, p) => sum + (p.cantidad || 0), 0);
    const totalPaquetes = (reserva.paquetes || []).reduce((sum, paquete) => {
      return sum + ((paquete.cantidad_total || (paquete.desglose_pasajes?.reduce((s, d) => s + (d.cantidad || 0), 0) || 0)) * (paquete.cantidad || 0));
    }, 0);
    return totalIndividuales + totalPaquetes;
  }, [reserva]);

  const getDesglosePasajeros = useMemo(() => {
    if (!reserva) return {};
    const desglose: Record<string, { individuales: number; paquetes: number; total: number }> = {};
    (reserva.cantidad_pasajes || []).forEach(p => {
      const tipo = p.nombre_tipo || 'Pasajero';
      desglose[tipo] = desglose[tipo] || { individuales: 0, paquetes: 0, total: 0 };
      desglose[tipo].individuales += p.cantidad || 0;
      desglose[tipo].total += p.cantidad || 0;
    });
    (reserva.paquetes || []).forEach(paquete => {
      if (paquete.desglose_pasajes?.length) {
        paquete.desglose_pasajes.forEach(d => {
          const tipo = d.tipo || 'Pasajero';
          desglose[tipo] = desglose[tipo] || { individuales: 0, paquetes: 0, total: 0 };
          const total = (d.cantidad || 0) * (paquete.cantidad || 0);
          desglose[tipo].paquetes += total;
          desglose[tipo].total += total;
        });
      } else if (paquete.cantidad_total) {
        const tipo = 'Pasajero';
        desglose[tipo] = desglose[tipo] || { individuales: 0, paquetes: 0, total: 0 };
        desglose[tipo].paquetes += paquete.cantidad_total * (paquete.cantidad || 0);
        desglose[tipo].total += paquete.cantidad_total * (paquete.cantidad || 0);
      }
    });
    return desglose;
  }, [reserva]);

  const copiarDetalles = () => {
    if (!reserva) return;
    const texto = `
🎫 RESERVA #${reserva.id}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏝️ Tour: ${reserva.nombre_tour || 'N/A'}
📅 Fecha: ${formatearFecha(reserva.fecha_tour, 'completo')}
🕐 Horario: ${formatearHora(reserva.hora_inicio_tour)} - ${formatearHora(reserva.hora_fin_tour)}
👥 Total Pasajeros: ${calcularTotalPasajeros}
💰 Total a Pagar: S/ ${reserva.total_pagar.toFixed(2)}
✅ Estado: ${getEstadoTexto(reserva.estado)}
💳 Método de Pago: ${reserva.metodo_pago || 'N/A'}
👤 Cliente: ${reserva.nombre_cliente || `${reserva.cliente?.nombres} ${reserva.cliente?.apellidos}`}
🏢 Sede: ${reserva.sede?.nombre || 'N/A'}
    `.trim();
    navigator.clipboard.writeText(texto).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ✅ PDF MEJORADO CON TEMA OCEÁNICO
  const generarPDF = () => {
    if (!reserva) return;
    const doc = new jsPDF();
    let y = 20;
    const hoy = format(new Date(), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });

    // 🎨 COLORES OCEÁNICOS
    const colorPrimario = [14, 116, 144]; // Teal oscuro
    const colorSecundario = [20, 184, 166]; // Teal claro
    const colorAcento = [6, 182, 212]; // Cyan

    // ✅ ENCABEZADO PROFESIONAL
    doc.setFillColor(...colorPrimario);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPROBANTE DE RESERVA', 105, 18, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Reserva #${reserva.id} - ${getEstadoTexto(reserva.estado)}`, 105, 28, { align: 'center' });
    doc.text(`Generado: ${hoy}`, 105, 35, { align: 'center' });

    y = 50;

    // ✅ RESUMEN EN RECUADRO
    doc.setFillColor(240, 253, 250);
    doc.roundedRect(15, y, 180, 50, 3, 3, 'FD');
    
    doc.setTextColor(...colorPrimario);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMEN DE LA RESERVA', 20, y + 8);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const col1X = 20;
    const col2X = 110;
    let lineY = y + 18;
    
    doc.text(`Tour: ${reserva.nombre_tour || 'N/A'}`, col1X, lineY);
    doc.text(`Fecha: ${formatearFecha(reserva.fecha_tour, 'corto')}`, col2X, lineY);
    lineY += 7;
    
    doc.text(`Horario: ${formatearHora(reserva.hora_inicio_tour)} - ${formatearHora(reserva.hora_fin_tour)}`, col1X, lineY);
    doc.text(`Pasajeros: ${calcularTotalPasajeros} personas`, col2X, lineY);
    lineY += 7;
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colorSecundario);
    doc.text(`Total: S/ ${reserva.total_pagar.toFixed(2)}`, col1X, lineY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Pago: ${reserva.metodo_pago || 'N/A'}`, col2X, lineY);

    y = lineY + 15;

    // ✅ DETALLES DEL TOUR
    if (reserva.nombre_tour) {
      doc.setFillColor(...colorPrimario);
      doc.rect(15, y, 180, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DETALLES DEL TOUR', 20, y + 6);
      
      y += 14;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      if (reserva.descripcion_tour) {
        const lines = doc.splitTextToSize(reserva.descripcion_tour, 170);
        lines.forEach((line: string) => {
          doc.text(line, 20, y);
          y += 5;
        });
        y += 3;
      }
      
      y += 5;
    }

    // ✅ DESGLOSE DE PASAJEROS
    doc.setFillColor(...colorPrimario);
    doc.rect(15, y, 180, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DESGLOSE DE PASAJEROS', 20, y + 6);
    
    y += 14;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    // Pasajes Individuales
    if (reserva.cantidad_pasajes?.length) {
      doc.setFont('helvetica', 'bold');
      doc.text('• Pasajes Individuales:', 20, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      reserva.cantidad_pasajes.forEach(p => {
        const precio = p.precio_unitario ? `S/ ${p.precio_unitario.toFixed(2)}` : 'Precio no disponible';
        const subtotal = p.subtotal ? `S/ ${p.subtotal.toFixed(2)}` : 'N/A';
        doc.text(`  - ${p.nombre_tipo || 'Pasajero'}: ${p.cantidad} x ${precio} = ${subtotal}`, 25, y);
        y += 5;
      });
      y += 3;
    }

    // Paquetes
    if (reserva.paquetes?.length) {
      doc.setFont('helvetica', 'bold');
      doc.text('• Paquetes:', 20, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      reserva.paquetes.forEach(p => {
        const totalPas = p.cantidad_total || p.desglose_pasajes?.reduce((s, d) => s + (d.cantidad || 0), 0) || 0;
        doc.text(`  - ${p.nombre_paquete || 'Paquete'}: ${p.cantidad} unidad(es) x ${totalPas} persona(s) = S/ ${p.subtotal.toFixed(2)}`, 25, y);
        y += 5;
      });
      y += 5;
    }

    // ✅ INFORMACIÓN DEL CLIENTE
    if (reserva.cliente || reserva.nombre_cliente) {
      doc.setFillColor(...colorPrimario);
      doc.rect(15, y, 180, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMACIÓN DEL CLIENTE', 20, y + 6);
      
      y += 14;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const nombreCliente = reserva.nombre_cliente || `${reserva.cliente?.nombres} ${reserva.cliente?.apellidos}`;
      doc.text(`Nombre: ${nombreCliente}`, 20, y);
      y += 6;
      
      if (reserva.cliente?.email) {
        doc.text(`Email: ${reserva.cliente.email}`, 20, y);
        y += 6;
      }
      
      if (reserva.cliente?.telefono) {
        doc.text(`Teléfono: ${reserva.cliente.telefono}`, 20, y);
        y += 6;
      }
      
      y += 5;
    }

    // ✅ TOTAL DESTACADO
    doc.setFillColor(...colorSecundario);
    doc.roundedRect(15, y, 180, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL A PAGAR: S/ ${reserva.total_pagar.toFixed(2)}`, 105, y + 8, { align: 'center' });

    y += 18;

    // ✅ NOTAS ADICIONALES
    if (reserva.notas) {
      doc.setTextColor(...colorPrimario);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Notas adicionales:', 20, y);
      y += 6;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(reserva.notas, 170);
      lines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += 5;
      });
    }

    // ✅ PIE DE PÁGINA
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    const pie1 = `Documento generado el ${hoy}`;
    const pie2 = 'Este documento no constituye un recibo fiscal oficial';
    doc.text(pie1, 105, 280, { align: 'center' });
    doc.text(pie2, 105, 285, { align: 'center' });

    doc.save(`Reserva_${reserva.id}_${Date.now()}.pdf`);
  };

  if (!autenticado) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-teal-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Inicia sesión</h2>
          <p className="text-gray-600 mb-6">Inicia sesión para ver tus reservas</p>
          <Link
            to={`/ingresar?redirect=/mis-reservas/${id}`}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-full hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Users className="h-4 w-4 mr-2" />
            Iniciar Sesión
          </Link>
        </div>
      </motion.div>
    );
  }

  if (cargando) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-12"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <Cargador tamanio="lg" color="text-teal-600" />
            <p className="mt-4 text-gray-600 text-lg">Cargando detalles de tu reserva...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !reserva) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-12"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <Alerta mensaje={error || 'No se pudo cargar la reserva'} tipo="error" />
            <div className="text-center mt-6">
              <Link
                to="/mis-reservas"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-full hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Mis Reservas
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-12"
    >
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-full-width { width: 100% !important; max-width: 100% !important; }
        }
      `}</style>
      
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 🎨 ENCABEZADO MEJORADO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-xl p-6 mb-6 text-white"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {reserva.nombre_tour || 'Tour'} #{reserva.id}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-teal-50">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatearFecha(reserva.fecha_tour, 'completo')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatearHora(reserva.hora_inicio_tour)} - {formatearHora(reserva.hora_fin_tour)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm opacity-90">Total</div>
                  <div className="text-3xl font-bold">S/ {reserva.total_pagar.toFixed(2)}</div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getEstadoClase(reserva.estado)}`}>
                  {getEstadoTexto(reserva.estado)}
                </span>
              </div>
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <Users className="h-4 w-4 mx-auto mb-1" />
                <div className="text-sm opacity-90">Pasajeros</div>
                <div className="text-xl font-bold">{calcularTotalPasajeros}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <Calendar className="h-4 w-4 mx-auto mb-1" />
                <div className="text-sm opacity-90">Reservado</div>
                <div className="text-sm font-semibold">{formatearFecha(reserva.fecha_reserva, 'corto')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <CreditCard className="h-4 w-4 mx-auto mb-1" />
                <div className="text-sm opacity-90">Pago</div>
                <div className="text-sm font-semibold">{reserva.metodo_pago || 'N/A'}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <MapPin className="h-4 w-4 mx-auto mb-1" />
                <div className="text-sm opacity-90">Sede</div>
                <div className="text-sm font-semibold truncate">{reserva.sede?.nombre || 'N/A'}</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COLUMNA PRINCIPAL */}
            <div className="lg:col-span-2 space-y-6">
              {/* Detalles del Tour */}
              {reserva.descripcion_tour && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-4 w-4 text-teal-600 mr-2" />
                    Detalles del Tour
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{reserva.descripcion_tour}</p>
                </motion.div>
              )}

              {/* Desglose de Pasajeros */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="h-4 w-4 text-teal-600 mr-2" />
                  Desglose de Pasajeros
                </h3>
                
                {Object.keys(getDesglosePasajeros).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {Object.entries(getDesglosePasajeros).map(([tipo, datos]) => (
                      <div key={tipo} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-2xl font-bold text-teal-700">{datos.total}</div>
                            <div className="text-sm font-semibold text-teal-600">{tipo}</div>
                            {datos.individuales > 0 && (
                              <div className="text-xs text-gray-600 mt-1">Individual: {datos.individuales}</div>
                            )}
                            {datos.paquetes > 0 && (
                              <div className="text-xs text-gray-600">Paquetes: {datos.paquetes}</div>
                            )}
                          </div>
                          <Users className="h-8 w-8 text-teal-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pasajes Individuales */}
                {reserva.cantidad_pasajes && reserva.cantidad_pasajes.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="h-4 w-4 text-cyan-600 mr-2" />
                      Pasajes Individuales
                    </h4>
                    <div className="space-y-3">
                      {reserva.cantidad_pasajes.map((pasaje, index) => (
                        <div key={index} className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-gray-900">{pasaje.nombre_tipo || 'Pasajero'}</div>
                              <div className="text-sm text-gray-600">Cantidad: {pasaje.cantidad}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-cyan-700">
                                S/ {pasaje.subtotal?.toFixed(2) || 'N/A'}
                              </div>
                              {pasaje.precio_unitario && (
                                <div className="text-xs text-gray-600">
                                  {pasaje.cantidad} x S/ {pasaje.precio_unitario.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paquetes */}
                {reserva.paquetes && reserva.paquetes.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Package className="h-4 w-4 text-teal-600 mr-2" />
                      Paquetes Adquiridos
                    </h4>
                    <div className="space-y-3">
                      {reserva.paquetes.map((paquete, index) => {
                        const totalPas = paquete.cantidad_total || 
                          paquete.desglose_pasajes?.reduce((s, d) => s + (d.cantidad || 0), 0) || 0;
                        return (
                          <div key={index} className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <div className="font-semibold text-gray-900">{paquete.nombre_paquete || 'Paquete'}</div>
                                <div className="text-sm text-gray-600">
                                  {paquete.cantidad} unidad{paquete.cantidad > 1 ? 'es' : ''} × {totalPas} persona{totalPas > 1 ? 's' : ''}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-teal-700">
                                  S/ {paquete.subtotal.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-600">
                                  Unitario: S/ {paquete.precio_unitario.toFixed(2)}
                                </div>
                              </div>
                            </div>
                            {paquete.desglose_pasajes && paquete.desglose_pasajes.length > 0 && (
                              <details className="mt-2">
                                <summary className="text-sm text-teal-700 cursor-pointer hover:text-teal-800 font-medium">
                                  Ver desglose
                                </summary>
                                <div className="mt-2 space-y-1 text-sm text-gray-600 ml-4">
                                  {paquete.desglose_pasajes.map((d, i) => (
                                    <div key={i}>• {d.tipo}: {d.cantidad}</div>
                                  ))}
                                </div>
                              </details>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Información Adicional */}
              {(reserva.notas || reserva.metodo_pago) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-4 w-4 text-teal-600 mr-2" />
                    Información Adicional
                  </h3>
                  <div className="space-y-4">
                    {reserva.notas && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Notas de la Reserva:</h4>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <p className="text-gray-800">{reserva.notas}</p>
                        </div>
                      </div>
                    )}
                    {reserva.metodo_pago && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Método de Pago:</h4>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-emerald-600" />
                          <p className="text-gray-800 font-medium">{reserva.metodo_pago}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
              {/* Cliente */}
              {reserva.cliente && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="h-4 w-4 text-teal-600 mr-2" />
                    Cliente
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Nombre</div>
                      <div className="font-semibold text-gray-900">
                        {reserva.nombre_cliente || `${reserva.cliente.nombres} ${reserva.cliente.apellidos}`}
                      </div>
                    </div>
                    {reserva.cliente.email && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Email</div>
                        <div className="text-gray-900">{reserva.cliente.email}</div>
                      </div>
                    )}
                    {reserva.cliente.telefono && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Teléfono</div>
                        <div className="text-gray-900">{reserva.cliente.telefono}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Sede */}
              {reserva.sede && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Building className="h-4 w-4 text-teal-600 mr-2" />
                    Sede
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Nombre</div>
                      <div className="font-semibold text-gray-900">{reserva.sede.nombre}</div>
                    </div>
                    {reserva.sede.direccion && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Dirección</div>
                        <div className="text-gray-900">{reserva.sede.direccion}</div>
                      </div>
                    )}
                    {reserva.sede.telefono && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Teléfono</div>
                        <div className="text-gray-900">{reserva.sede.telefono}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Fechas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-4 w-4 text-teal-600 mr-2" />
                  Fechas Importantes
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Reserva Creada</div>
                    <div className="text-gray-900">{formatearFecha(reserva.fecha_reserva, 'corto')}</div>
                  </div>
                  {reserva.fecha_actualizacion && reserva.fecha_actualizacion !== 'Fecha inválida' && (
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Última Actualización</div>
                      <div className="text-gray-900">{formatearFecha(reserva.fecha_actualizacion, 'corto')}</div>
                    </div>
                  )}
                  {reserva.fecha_expiracion && (
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Fecha de Expiración</div>
                      <div className="text-amber-600 font-semibold">{formatearFecha(reserva.fecha_expiracion, 'corto')}</div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Acciones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100 no-print"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </button>
                  <button
                    onClick={generarPDF}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </button>
                  <button
                    onClick={copiarDetalles}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Detalles
                  </button>
                  <Link
                    to="/mis-reservas"
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 font-medium"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Mis Reservas
                  </Link>
                  <Link
                    to="/tours"
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Explorar Tours
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Notificación de copiado */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3"
              >
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">¡Detalles copiados al portapapeles!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PaginaDetalleReserva;