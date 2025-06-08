import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  createTourProgramado, 
  updateTourProgramado,
  fetchTourProgramadoById,
  clearError,
  clearCreatedId
} from '../../../../infrastructure/store/slices/tourProgramadoSlice';

// Importar acciones de instanciaTour
import {
  generarInstancias
} from '../../../../infrastructure/store/slices/instanciaTourSlice';

import { fetchTiposTourPorSede } from '../../../../infrastructure/store/slices/tipoTourSlice';
import { fetchEmbarcacionesPorSede } from '../../../../infrastructure/store/slices/embarcacionSlice';
import { 
  fetchHorariosTourPorTipoTour
} from '../../../../infrastructure/store/slices/horarioTourSlice';
import { fetchUsuariosPorRol } from '../../../../infrastructure/store/slices/usuarioSlice';
import { RootState, AppDispatch } from '../../../../infrastructure/store/index';
import { 
  FaSave, 
  FaTimes, 
  FaClock, 
  FaShip, 
  FaUserFriends, 
  FaUserTie,
  FaArrowLeft,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCalendarCheck,
  FaCalculator,
  FaBug,
  FaCheckCircle,
  FaCalendarAlt
} from 'react-icons/fa';
import { format, addMonths, parseISO, eachDayOfInterval, getDay, isValid } from 'date-fns';

// Función para asegurar que los valores sean texto
const asegurarTexto = (valor: any): string => {
  if (valor === null || valor === undefined) return '';
  if (typeof valor === 'string') return valor;
  if (typeof valor === 'number') return valor.toString();
  if (typeof valor === 'object') {
    try {
      if (valor.String !== undefined) return valor.String || '';
      if (valor.Valid !== undefined) return valor.Valid ? valor.String || '' : '';
      if (typeof valor.toString === 'function' && valor.toString !== Object.prototype.toString) {
        return valor.toString();
      }
      return JSON.stringify(valor);
    } catch (e) {
      console.error('Error al convertir objeto a texto:', e);
      return '';
    }
  }
  return String(valor);
};

// Función para asegurar que un valor sea número
const asegurarNumero = (valor: any): number => {
  if (valor === null || valor === undefined) return 0;
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'string') {
    const parsed = parseInt(valor, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Función para asegurar que un valor sea booleano
const asegurarBooleano = (valor: any): boolean => {
  if (typeof valor === 'boolean') return valor;
  if (valor === 1 || valor === '1' || valor === 'true') return true;
  if (valor === 0 || valor === '0' || valor === 'false') return false;
  return Boolean(valor);
};

// Función para obtener el nombre del día
const obtenerNombreDia = (numeroDay: number): string => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[numeroDay] || 'Desconocido';
};

// Función para analizar el horario de tour y obtener información detallada
const analizarHorarioTour = (horarioTour: any): { diasActivos: number[], diasNombres: string[], detalleCompleto: string } => {
  const diasActivos: number[] = [];
  const diasNombres: string[] = [];
  
  console.log('🔍 ANALIZANDO HORARIO DE TOUR:', horarioTour);
  
  // Verificar cada día de la semana de forma más robusta
  const diasSemana = [
    { campo: 'disponible_domingo', numero: 0, nombre: 'Domingo', abrev: 'D' },
    { campo: 'disponible_lunes', numero: 1, nombre: 'Lunes', abrev: 'L' },
    { campo: 'disponible_martes', numero: 2, nombre: 'Martes', abrev: 'M' },
    { campo: 'disponible_miercoles', numero: 3, nombre: 'Miércoles', abrev: 'X' },
    { campo: 'disponible_jueves', numero: 4, nombre: 'Jueves', abrev: 'J' },
    { campo: 'disponible_viernes', numero: 5, nombre: 'Viernes', abrev: 'V' },
    { campo: 'disponible_sabado', numero: 6, nombre: 'Sábado', abrev: 'S' }
  ];
  
  diasSemana.forEach(dia => {
    const valor = horarioTour[dia.campo];
    console.log(`   ${dia.nombre} (${dia.campo}):`, valor, typeof valor);
    
    // Verificar múltiples formatos posibles (boolean, number, string)
    if (asegurarBooleano(valor)) {
      diasActivos.push(dia.numero);
      diasNombres.push(dia.nombre);
      console.log(`   ✅ ${dia.nombre} ACTIVO`);
    } else {
      console.log(`   ❌ ${dia.nombre} INACTIVO`);
    }
  });
  
  const detalleCompleto = `Horario del Tour: ${asegurarTexto(horarioTour.hora_inicio)} - ${asegurarTexto(horarioTour.hora_fin)} | Días operativos: ${diasNombres.join(', ') || 'NINGUNO'}`;
  
  console.log('📊 RESULTADO ANÁLISIS HORARIO DE TOUR:');
  console.log('   Días operativos (números):', diasActivos);
  console.log('   Días operativos (nombres):', diasNombres);
  console.log('   Detalle completo:', detalleCompleto);
  
  return { diasActivos, diasNombres, detalleCompleto };
};

// Función para calcular cuántos tours se van a crear
const calcularToursACrear = (horarioTour: any, vigenciaDesde: string, vigenciaHasta: string): { cantidad: number, detalle: string, error?: string } => {
  try {
    console.log('🚀 INICIANDO CÁLCULO DE TOURS PROGRAMADOS');
    console.log('📅 Parámetros recibidos:', { 
      horarioTourId: horarioTour?.id_horario,
      vigenciaDesde, 
      vigenciaHasta 
    });
    
    if (!horarioTour) {
      const error = 'No se ha seleccionado un horario de tour válido';
      console.log('❌ ERROR:', error);
      return { cantidad: 0, detalle: '', error };
    }

    if (!vigenciaDesde || !vigenciaHasta) {
      const error = 'Faltan fechas de vigencia (desde/hasta)';
      console.log('❌ ERROR:', error);
      return { cantidad: 0, detalle: '', error };
    }

    // Validar y parsear fechas
    const fechaInicio = parseISO(vigenciaDesde);
    const fechaFin = parseISO(vigenciaHasta);
    
    console.log('📅 Fechas parseadas:', { fechaInicio, fechaFin });
    
    if (!isValid(fechaInicio) || !isValid(fechaFin)) {
      const error = `Fechas no válidas: desde=${vigenciaDesde}, hasta=${vigenciaHasta}`;
      console.log('❌ ERROR:', error);
      return { cantidad: 0, detalle: '', error };
    }

    if (fechaFin < fechaInicio) {
      const error = 'La fecha de fin debe ser posterior a la fecha de inicio';
      console.log('❌ ERROR:', error);
      return { cantidad: 0, detalle: '', error };
    }
    
    // Analizar horario de tour
    const { diasActivos, diasNombres, detalleCompleto } = analizarHorarioTour(horarioTour);
    
    if (diasActivos.length === 0) {
      const error = `El horario de tour seleccionado (${asegurarTexto(horarioTour.hora_inicio)} - ${asegurarTexto(horarioTour.hora_fin)}) no tiene días operativos configurados. Debe activar al menos un día de la semana en el horario del tour.`;
      console.log('❌ ERROR:', error);
      return { cantidad: 0, detalle: detalleCompleto, error };
    }
    
    // Obtener todos los días en el rango
    const todasLasFechas = eachDayOfInterval({ start: fechaInicio, end: fechaFin });
    console.log(`📊 Total de fechas en el período: ${todasLasFechas.length}`);
    
    // Contar fechas que coinciden con los días operativos del tour
    const fechasCoincidentes = todasLasFechas.filter(fecha => {
      const diaSemana = getDay(fecha);
      const coincide = diasActivos.includes(diaSemana);
      if (coincide) {
        console.log(`   ✅ ${format(fecha, 'yyyy-MM-dd')} (${obtenerNombreDia(diaSemana)}) - TOUR PROGRAMADO`);
      }
      return coincide;
    });
    
    console.log(`🎯 RESULTADO FINAL: ${fechasCoincidentes.length} tours programados serán creados`);
    
    const detalle = `${detalleCompleto} | ${fechasCoincidentes.length} fechas válidas encontradas en el período`;
    
    return { 
      cantidad: fechasCoincidentes.length, 
      detalle,
      error: fechasCoincidentes.length === 0 ? 
        `No hay fechas que coincidan con los días operativos del tour (${diasNombres.join(', ')}) en el período seleccionado.` : 
        undefined
    };
  } catch (error) {
    console.error('💥 ERROR CRÍTICO calculando tours:', error);
    return { 
      cantidad: 0, 
      detalle: '', 
      error: `Error técnico al calcular tours: ${error instanceof Error ? error.message : 'Error desconocido'}` 
    };
  }
};

// Componente Toast para notificaciones
const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'warning'; onClose: () => void }> = ({ 
  message, 
  type, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastColors = () => {
    switch(type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getToastIcon = () => {
    switch(type) {
      case 'success':
        return <FaSave className="mr-2" />;
      case 'error':
        return <FaExclamationTriangle className="mr-2" />;
      case 'warning':
        return <FaInfoCircle className="mr-2" />;
      default:
        return <FaInfoCircle className="mr-2" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 ${getToastColors()} px-4 py-3 rounded-lg shadow-lg z-50 flex items-center max-w-md`}
    >
      {getToastIcon()}
      <span className="text-sm">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-4 text-white hover:text-gray-200"
      >
        &times;
      </button>
    </motion.div>
  );
};

interface TourProgramadoFormProps {
  isEditing?: boolean;
}

const TourProgramadoForm: React.FC<TourProgramadoFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const searchParams = new URLSearchParams(location.search);
  const tipoIdFromQuery = searchParams.get('tipo');
  
  const { currentTour, loading, error, createdTourId } = useSelector((state: RootState) => state.tourProgramado);
  const { tiposTour, loading: loadingTiposTour } = useSelector((state: RootState) => state.tipoTour);
  const { embarcaciones, loading: loadingEmbarcaciones } = useSelector((state: RootState) => state.embarcacion);
  const { horariosTour, loading: loadingHorarios } = useSelector((state: RootState) => state.horarioTour);
  const { usuarios, loading: loadingUsuarios } = useSelector((state: RootState) => state.usuario);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  const { cantidadGenerada, loading: loadingInstancias } = useSelector((state: RootState) => state.instanciaTour);
  
  // Estado inicial del formulario
  const initialFormState = {
    id_tipo_tour: 0,
    id_embarcacion: 0,
    id_horario: 0,
    id_sede: selectedSede?.id_sede || 0,
    id_chofer: undefined as number | undefined,
    fecha: format(new Date(), 'yyyy-MM-dd'),
    vigencia_desde: format(new Date(), 'yyyy-MM-dd'),
    vigencia_hasta: format(addMonths(new Date(), 3), 'yyyy-MM-dd'),
    cupo_maximo: 0,
    cupo_disponible: 0,
    es_excepcion: false,
    notas_excepcion: '',
    generar_instancias: true // Nuevo campo para controlar la generación de instancias
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [showWarnings, setShowWarnings] = useState(false);
  const [isEmbarcacionManual, setIsEmbarcacionManual] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [choferesLoaded, setChoferesLoaded] = useState(false);
  const [toursACrear, setToursACrear] = useState(0);
  const [detalleCalculo, setDetalleCalculo] = useState('');
  const [generandoInstancias, setGenerandoInstancias] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  // Fecha actual y máxima para datepicker
  const today = format(new Date(), 'yyyy-MM-dd');
  const oneYearFromNow = format(addMonths(new Date(), 12), 'yyyy-MM-dd');
  
  // Mostrar notificación
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ show: true, message, type });
  }, []);

  // Ocultar notificación
  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);
  
  // Calcular tours a crear cuando cambian los parámetros
  useEffect(() => {
    console.log('🔄 EFECTO DE CÁLCULO DISPARADO');
    console.log('   isEditing:', isEditing);
    console.log('   formData.id_horario:', formData.id_horario);
    console.log('   formData.id_tipo_tour:', formData.id_tipo_tour);
    console.log('   horariosTour.length:', horariosTour.length);
    
    // DEBUGGING: Mostrar todos los horarios cargados
    console.log('🕐 HORARIOS TOUR CARGADOS:');
    horariosTour.forEach((h, index) => {
      console.log(`   ${index + 1}. ID: ${h.id_horario}, Tipo: ${h.id_tipo_tour}, Hora: ${h.hora_inicio}-${h.hora_fin}`);
    });
    
    if (formData.id_horario > 0 && formData.vigencia_desde && formData.vigencia_hasta && !isEditing) {
      // VERIFICACIÓN CORREGIDA: Buscar por ID y tipo de tour
      const horarioTourSeleccionado = horariosTour.find(h => 
        h.id_horario === formData.id_horario && 
        h.id_tipo_tour === formData.id_tipo_tour
      );
      
      console.log('🎯 Horario de tour seleccionado encontrado:', horarioTourSeleccionado);
      
      if (!horarioTourSeleccionado) {
        console.log('❌ DEBUGGING - Buscando horario ID:', formData.id_horario, 'para tipo:', formData.id_tipo_tour);
        console.log('❌ DEBUGGING - Horarios disponibles:');
        horariosTour.forEach(h => {
          console.log(`     ID: ${h.id_horario}, Tipo: ${h.id_tipo_tour}, Compatible: ${h.id_tipo_tour === formData.id_tipo_tour}`);
        });
      }
      
      if (horarioTourSeleccionado) {
        const resultado = calcularToursACrear(horarioTourSeleccionado, formData.vigencia_desde, formData.vigencia_hasta);
        console.log('📊 Resultado del cálculo:', resultado);
        
        setToursACrear(resultado.cantidad);
        setDetalleCalculo(resultado.detalle);
        
        // Limpiar errores previos
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.vigencia_general;
          delete newErrors.id_horario;
          return newErrors;
        });
        
        // Mostrar error si hay problemas
        if (resultado.error) {
          setFormErrors(prev => ({
            ...prev,
            vigencia_general: resultado.error!
          }));
        }
      } else {
        console.log('❌ No se encontró el horario de tour seleccionado en la lista');
        setToursACrear(0);
        setDetalleCalculo('');
        
        // NO limpiar automáticamente, solo mostrar error
        setFormErrors(prev => ({
          ...prev,
          id_horario: `El horario seleccionado no pertenece al tipo de tour actual. Seleccione un horario válido.`
        }));
      }
    } else {
      console.log('⏸️ Condiciones no cumplidas para el cálculo');
      setToursACrear(0);
      setDetalleCalculo('');
    }
  }, [formData.id_horario, formData.id_tipo_tour, formData.vigencia_desde, formData.vigencia_hasta, horariosTour, isEditing]);

  // Cargar datos iniciales
  useEffect(() => {
    if (selectedSede?.id_sede) {
      dispatch(fetchTiposTourPorSede(selectedSede.id_sede))
        .then(() => console.log("Tipos de tour cargados correctamente"))
        .catch(err => console.error("Error al cargar tipos de tour:", err));
      
      dispatch(fetchEmbarcacionesPorSede(selectedSede.id_sede))
        .then(() => console.log("Embarcaciones cargadas correctamente"))
        .catch(err => console.error("Error al cargar embarcaciones:", err));
      
      dispatch(fetchUsuariosPorRol('CHOFER'))
        .then(() => {
          console.log("Choferes cargados correctamente");
          setChoferesLoaded(true);
        })
        .catch(err => {
          console.error("Error al cargar choferes:", err);
          showToast("Error al cargar lista de choferes", "error");
        });
      
      setDataLoaded(true);
    } else {
      showToast("No hay sede seleccionada", "error");
    }
    
    if (isEditing && id) {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        dispatch(fetchTourProgramadoById(numericId))
          .then(() => console.log("Tour cargado correctamente"))
          .catch(err => {
            console.error("Error al cargar tour:", err);
            showToast("Error al cargar datos del tour", "error");
          });
      } else {
        showToast("ID de tour inválido", "error");
        navigate('/admin/tours');
      }
    }
    
    if (tipoIdFromQuery && !isEditing) {
      const tipoId = parseInt(tipoIdFromQuery);
      if (!isNaN(tipoId)) {
        setFormData(prev => ({ ...prev, id_tipo_tour: tipoId }));
        
        dispatch(fetchHorariosTourPorTipoTour(tipoId))
          .then(() => console.log("Horarios de tour cargados correctamente"))
          .catch(err => {
            console.error("Error al cargar horarios de tour:", err);
            showToast("Error al cargar horarios de tour disponibles", "error");
          });
      }
    }
    
    return () => {
      dispatch(clearError());
      dispatch(clearCreatedId());
    };
  }, [dispatch, id, isEditing, selectedSede, tipoIdFromQuery, showToast, navigate]);
  
  // Actualizar formulario cuando se carga el tour para edición
  useEffect(() => {
    if (isEditing && currentTour && dataLoaded) {
      console.log("Actualizando formulario con datos del tour:", currentTour);
      
      let chofer: number | undefined = undefined;
      if (currentTour.id_chofer && typeof currentTour.id_chofer === 'object' && 'Int64' in currentTour.id_chofer) {
        chofer = currentTour.id_chofer.Valid ? currentTour.id_chofer.Int64 : undefined;
      } else if (typeof currentTour.id_chofer === 'number') {
        chofer = currentTour.id_chofer;
      }
      
      const updatedFormData = {
        id_tipo_tour: asegurarNumero(currentTour.id_tipo_tour),
        id_embarcacion: asegurarNumero(currentTour.id_embarcacion),
        id_horario: asegurarNumero(currentTour.id_horario),
        id_sede: asegurarNumero(currentTour.id_sede || selectedSede?.id_sede),
        id_chofer: chofer,
        fecha: currentTour.fecha ? currentTour.fecha.split('T')[0] : today,
        vigencia_desde: currentTour.vigencia_desde ? currentTour.vigencia_desde.split('T')[0] : today,
        vigencia_hasta: currentTour.vigencia_hasta ? currentTour.vigencia_hasta.split('T')[0] : format(addMonths(new Date(), 3), 'yyyy-MM-dd'),
        cupo_maximo: asegurarNumero(currentTour.cupo_maximo),
        cupo_disponible: asegurarNumero(currentTour.cupo_disponible),
        es_excepcion: asegurarBooleano(currentTour.es_excepcion),
        notas_excepcion: currentTour.notas_excepcion?.String || '',
        generar_instancias: false // En modo edición, no generar instancias por defecto
      };
      
      setFormData(updatedFormData);
      
      if (currentTour.id_tipo_tour) {
        dispatch(fetchHorariosTourPorTipoTour(asegurarNumero(currentTour.id_tipo_tour)))
          .then(() => console.log("Horarios de tour cargados correctamente para edición"))
          .catch(err => {
            console.error("Error al cargar horarios de tour para edición:", err);
            showToast("Error al cargar horarios de tour disponibles", "error");
          });
      }
      
      const embarcacion = embarcaciones.find(e => e.id_embarcacion === currentTour.id_embarcacion);
      if (embarcacion && embarcacion.capacidad) {
        const capacidad = asegurarNumero(embarcacion.capacidad);
        
        if (capacidad > 0 && currentTour.cupo_maximo !== capacidad) {
          setIsEmbarcacionManual(true);
        }
      }
    }
  }, [currentTour, dispatch, isEditing, dataLoaded, embarcaciones, selectedSede, showToast, today]);
  
  // Cuando cambia el tipo de tour, cargar horarios correspondientes
  useEffect(() => {
    if (formData.id_tipo_tour > 0) {
      console.log('🔄 Cargando horarios de tour para tipo:', formData.id_tipo_tour);
      
      // Limpiar horario seleccionado al cambiar tipo de tour
      if (formData.id_horario > 0) {
        setFormData(prev => ({ ...prev, id_horario: 0 }));
      }
      
      dispatch(fetchHorariosTourPorTipoTour(formData.id_tipo_tour))
        .then(() => console.log("Horarios de tour actualizados"))
        .catch(err => {
          console.error("Error al actualizar horarios de tour:", err);
          showToast("Error al cargar horarios de tour", "error");
        });
    }
  }, [dispatch, formData.id_tipo_tour, showToast]);
  
  
// Redirigir después de crear exitosamente - CORREGIDO
useEffect(() => {
  if (createdTourId && !generandoInstancias) {
    console.log("🎉 Tour programado creado con ID:", createdTourId);
    
    // Extraer el ID de manera segura del objeto createdTourId
    let tourId: number;
    
    if (typeof createdTourId === 'object' && createdTourId !== null) {
      // Si es un objeto, intenta obtener la propiedad id
      tourId = (createdTourId as any).id || 0;
      console.log("ID extraído del objeto:", tourId);
    } else if (typeof createdTourId === 'number') {
      // Si ya es un número, úsalo directamente
      tourId = createdTourId;
      console.log("ID ya es un número:", tourId);
    } else {
      // Caso de fallback, probablemente nunca se llegue aquí
      tourId = 0;
      console.log("No se pudo extraer un ID válido");
    }
    
    // Verificar si se deben generar instancias - SOLO UNA VEZ
    if (formData.generar_instancias && !isEditing && tourId > 0) {
      console.log("🔄 Generando instancias para el tour programado ID:", tourId);
      setGenerandoInstancias(true);
      
      // Usar el ID numérico extraído
      dispatch(generarInstancias(tourId))
        .unwrap()
        .then((cantidad) => {
          console.log("✅ Instancias generadas:", cantidad);
          showToast(`Tour programado creado y ${cantidad} instancias generadas exitosamente`, 'success');
          
          // Después de generar instancias, navegar inmediatamente para evitar múltiples generaciones
          navigate(`/admin/tours`);
        })
        .catch(error => {
          console.error("❌ Error al generar instancias:", error);
          showToast(`Tour creado pero hubo un problema al generar instancias: ${error}`, 'warning');
          
          // Navegar aunque haya error
          navigate(`/admin/tours`);
        })
        .finally(() => {
          setGenerandoInstancias(false);
        });
    } else {
      if (toursACrear > 1) {
        showToast(`${toursACrear} tours programados creados exitosamente`, 'success');
      } else {
        showToast('Tour programado guardado exitosamente', 'success');
      }
      
      // Navegar inmediatamente
      navigate(`/admin/tours`);
    }

    // Limpiar el ID creado para evitar duplicación
    dispatch(clearCreatedId());
  }
}, [createdTourId, navigate, showToast, toursACrear, formData.generar_instancias, isEditing, dispatch, generandoInstancias]);
useEffect(() => {
  if (formData.id_embarcacion > 0 && !isEmbarcacionManual) {
    const embarcacionSeleccionada = embarcaciones.find(e => e.id_embarcacion === formData.id_embarcacion);
    if (embarcacionSeleccionada && embarcacionSeleccionada.capacidad) {
      const capacidad = asegurarNumero(embarcacionSeleccionada.capacidad);

      console.log("Capacidad detectada:", capacidad, "para embarcación:", embarcacionSeleccionada.nombre);

      if (capacidad > 0) {
        setFormData(prev => ({
            ...prev, 
            cupo_maximo: capacidad,
            cupo_disponible: isEditing ? prev.cupo_disponible : capacidad
          }));
        }
      }
    }
  }, [formData.id_embarcacion, embarcaciones, isEmbarcacionManual, isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'id_chofer') {
      const choferValue = value === '' ? undefined : parseInt(value);
      setFormData(prev => ({ ...prev, [name]: choferValue }));
      
      if (choferValue !== undefined) {
        setFormErrors(prev => ({ ...prev, id_chofer: '' }));
      }
    } else if (name === 'id_embarcacion') {
      const embarcacionId = parseInt(value);
      setFormData(prev => ({ ...prev, id_embarcacion: embarcacionId }));
      
      if (embarcacionId > 0) {
        setIsEmbarcacionManual(false);
      }
      
      setFormErrors(prev => ({ ...prev, id_embarcacion: '' }));
    } else if (name === 'cupo_maximo') {
      const cupoValue = parseInt(value);
      if (!isNaN(cupoValue)) {
        setIsEmbarcacionManual(true);
        setFormData(prev => ({ 
          ...prev, 
          [name]: cupoValue,
          ...(isEditing ? {} : { cupo_disponible: cupoValue })
        }));
      }
      
      setFormErrors(prev => ({ ...prev, cupo_maximo: '' }));
    } else if (name === 'id_horario') {
      const horarioId = parseInt(value);
      setFormData(prev => ({ ...prev, id_horario: horarioId }));
      
      // Limpiar errores de horario al cambiar
      setFormErrors(prev => ({ ...prev, id_horario: '', vigencia_general: '' }));
    } else if (type === 'number') {
      const numValue = parseInt(value);
      setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    } else if (name === 'vigencia_desde' || name === 'vigencia_hasta') {
      setFormData(prev => ({ ...prev, [name]: value }));
      setFormErrors(prev => ({ ...prev, [name]: '', vigencia_general: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (name in formErrors) {
        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };
  
  const handleRestablecerCupo = () => {
    if (formData.id_embarcacion > 0) {
      const embarcacionSeleccionada = embarcaciones.find(e => e.id_embarcacion === formData.id_embarcacion);
      if (embarcacionSeleccionada && embarcacionSeleccionada.capacidad) {
        const capacidad = asegurarNumero(embarcacionSeleccionada.capacidad);
        
        if (capacidad > 0) {
          setFormData(prev => ({ 
            ...prev, 
            cupo_maximo: capacidad,
            ...(isEditing ? {} : { cupo_disponible: capacidad })
          }));
          setIsEmbarcacionManual(false);
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.id_tipo_tour <= 0) newErrors.id_tipo_tour = 'Seleccione un tipo de tour';
    if (formData.id_embarcacion <= 0) newErrors.id_embarcacion = 'Seleccione una embarcación';
    if (formData.id_horario <= 0) newErrors.id_horario = 'Seleccione un horario de tour';
    
    // VALIDACIÓN MEJORADA: Verificar que el horario pertenece al tipo de tour
    if (formData.id_horario > 0 && formData.id_tipo_tour > 0) {
      const horarioValid = horariosTour.find(h => 
        h.id_horario === formData.id_horario && 
        h.id_tipo_tour === formData.id_tipo_tour
      );
      
      if (!horarioValid) {
        newErrors.id_horario = `El horario seleccionado no pertenece al tipo de tour "${tiposTour.find(t => t.id_tipo_tour === formData.id_tipo_tour)?.nombre || 'seleccionado'}"`;
      }
    }
    
    if (!formData.vigencia_desde) {
      newErrors.vigencia_desde = 'Seleccione una fecha de inicio de vigencia';
    }
    
    if (!formData.vigencia_hasta) {
      newErrors.vigencia_hasta = 'Seleccione una fecha de fin de vigencia';
    } else if (formData.vigencia_desde && formData.vigencia_hasta < formData.vigencia_desde) {
      newErrors.vigencia_hasta = 'La fecha de fin de vigencia debe ser posterior a la fecha de inicio';
    }
    
    if (formData.cupo_maximo <= 0) {
      newErrors.cupo_maximo = 'El cupo máximo debe ser mayor a 0';
    }
    
    if (formData.id_chofer === undefined) {
      newErrors.id_chofer = 'Seleccione un chofer';
    }
    
    if (formData.es_excepcion && !formData.notas_excepcion.trim()) {
      newErrors.notas_excepcion = 'Debe proporcionar una explicación para la excepción';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const verificarConflictos = (): string[] => {
    const warnings: string[] = [];
    
    if (isEmbarcacionManual && formData.id_embarcacion > 0) {
      const embarcacion = embarcaciones.find(e => e.id_embarcacion === formData.id_embarcacion);
      if (embarcacion && embarcacion.capacidad) {
        const capacidad = asegurarNumero(embarcacion.capacidad);
        
        if (capacidad > 0) {
          const diferencia = Math.abs(formData.cupo_maximo - capacidad);
          const porcentajeDiferencia = (diferencia / capacidad) * 100;
          
          if (porcentajeDiferencia > 20) {
            warnings.push(`El cupo máximo (${formData.cupo_maximo}) difiere significativamente de la capacidad de la embarcación (${capacidad}).`);
          }
        }
      }
    }
    
    if (formData.es_excepcion) {
      warnings.push("Este tour se está marcando como excepción. No seguirá la programación regular.");
    }
    
    if (!isEditing && toursACrear > 50) {
      warnings.push(`Se van a crear ${toursACrear} tours programados. Esto podría tardar un momento.`);
    }
    
    return warnings;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Por favor, corrija los errores en el formulario', 'error');
      return;
    }
    
    const warnings = verificarConflictos();
    setValidationWarnings(warnings);
    
    if (warnings.length > 0) {
      setShowWarnings(true);
      return;
    }
    
    await proceedWithSubmit();
  };
  
  const proceedWithSubmit = async () => {
    try {
      const datosFormateados = {
        id_tipo_tour: asegurarNumero(formData.id_tipo_tour),
        id_embarcacion: asegurarNumero(formData.id_embarcacion),
        id_horario: asegurarNumero(formData.id_horario),
        id_sede: asegurarNumero(formData.id_sede),
        id_chofer: formData.id_chofer !== undefined ? asegurarNumero(formData.id_chofer) : undefined,
        cupo_maximo: asegurarNumero(formData.cupo_maximo),
        cupo_disponible: asegurarNumero(formData.cupo_disponible),
        fecha: format(new Date(), 'yyyy-MM-dd'),
        vigencia_desde: formData.vigencia_desde,
        vigencia_hasta: formData.vigencia_hasta,
        es_excepcion: formData.es_excepcion,
        notas_excepcion: formData.notas_excepcion
      };
      
      console.log("Datos que se enviarán al backend:", datosFormateados);
      
      if (isEditing && id) {
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
          throw new Error("ID del tour no es válido");
        }
        
        await dispatch(updateTourProgramado({ 
          id: numericId, 
          tourProgramado: datosFormateados 
        })).unwrap();
        
        // Si estamos en modo edición y se solicita generar instancias
        if (formData.generar_instancias) {
          setGenerandoInstancias(true);
          
          try {
            const cantidad = await dispatch(generarInstancias(numericId)).unwrap();
            showToast(`Tour actualizado y ${cantidad} instancias generadas exitosamente`, 'success');
          } catch (error) {
            console.error("Error al generar instancias:", error);
            showToast('Tour actualizado pero hubo un problema al generar instancias', 'warning');
          } finally {
            setGenerandoInstancias(false);
          }
        } else {
          showToast('Tour actualizado exitosamente', 'success');
        }
        
        setTimeout(() => {
          navigate(`/admin/tours`);
        }, 1500);
      } else {
        const submissionData = {
          ...datosFormateados,
          cupo_disponible: asegurarNumero(formData.cupo_maximo)
        };
        
        await dispatch(createTourProgramado(submissionData)).unwrap();
        // Las instancias se generarán en el useEffect cuando detecte createdTourId
      }
    } catch (err) {
      console.error('Error al guardar el tour programado:', err);
      let errorMsg = 'Error al guardar el tour programado';
      
      if (err && typeof err === 'object' && 'message' in err) {
        errorMsg += `: ${(err as any).message}`;
      }
      
      showToast(errorMsg, 'error');
    }
  };
  
  const handleContinuarPeseLasAdvertencias = () => {
    setShowWarnings(false);
    showToast('Continuando a pesar de las advertencias', 'warning');
    proceedWithSubmit();
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  const isInitialLoading = loading && isEditing && !currentTour;
  const isDataLoading = loadingTiposTour || loadingEmbarcaciones || loadingHorarios || loadingUsuarios;
  
  // Asegurar que las condiciones de disabled sean booleanas
  const isFormDisabled = Boolean(loading || isDataLoading || generandoInstancias || loadingInstancias);
  const hasValidationError = Boolean(formErrors.vigencia_general && !isEditing);
  const isSubmitDisabled = Boolean(isFormDisabled || hasValidationError);
  
  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="w-16 h-16 relative">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-lg text-blue-800 font-medium animate-pulse">Cargando datos del tour...</p>
      </div>
    );
  }

  const choferes = usuarios.filter(u => u.rol === 'CHOFER');
  const choferesDisponibles = choferes.length > 0;
  
  // Obtener horario de tour seleccionado para mostrar información
  const horarioTourSeleccionado = horariosTour.find(h => 
    h.id_horario === formData.id_horario && 
    h.id_tipo_tour === formData.id_tipo_tour
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-8">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button 
            onClick={handleCancel}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-1" /> Volver
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            {isEditing ? 'Editar Tour Programado' : 'Crear Nuevo Tour Programado'}
          </h1>
          <p className="text-gray-500 mt-1">
            Complete todos los campos requeridos marcados con <span className="text-red-500">*</span>
          </p>
        </div>
        
        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 mr-2 text-red-500" />
              <p className="font-medium">{asegurarTexto(error)}</p>
            </div>
          </motion.div>
        )}
        
        {choferesLoaded && !choferesDisponibles && (
          <motion.div 
            className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              <p className="font-medium">
                No se encontraron choferes disponibles. Debe crear usuarios con rol "CHOFER" antes de programar tours.
              </p>
            </div>
          </motion.div>
        )}
        
        {isDataLoading && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow-sm mb-6 flex items-center">
            <div className="w-5 h-5 mr-3 relative">
              <div className="absolute top-0 left-0 w-full h-full border-2 border-blue-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p>Cargando datos necesarios...</p>
          </div>
        )}
        
        {/* Error de validación general */}
        {formErrors.vigencia_general && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start">
              <FaExclamationTriangle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 mb-2">Problema con la configuración del tour:</p>
                <p className="text-sm">{formErrors.vigencia_general}</p>
                {detalleCalculo && (
                  <div className="mt-3 p-3 bg-red-100 rounded text-xs">
                    <p className="font-medium text-red-700 mb-1">Información del horario:</p>
                    <p className="text-red-600">{detalleCalculo}</p>
                  </div>
                )}
                {horarioTourSeleccionado && (
                  <div className="mt-3 p-3 bg-blue-50 rounded text-xs">
                    <p className="font-medium text-blue-700 mb-1">💡 Para solucionar:</p>
                    <ul className="text-blue-600 space-y-1">
                      <li>• Verifique que el horario tenga días operativos activos</li>
                      <li>• Configure los días de la semana en el horario de tour</li>
                      <li>• Ajuste el período de vigencia si es necesario</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Panel de debugging */}
        {process.env.NODE_ENV === 'development' && horarioTourSeleccionado && (
          <motion.div 
            className="bg-gray-50 border-l-4 border-gray-400 text-gray-700 p-4 rounded-md shadow-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start">
              <FaBug className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="w-full">
                <p className="font-medium text-gray-800 mb-2">🔍 Panel de Debugging (Desarrollo)</p>
                <div className="text-xs space-y-1">
                  <p><strong>ID Horario:</strong> {horarioTourSeleccionado.id_horario}</p>
                  <p><strong>Tipo Tour:</strong> {horarioTourSeleccionado.id_tipo_tour}</p>
                  <p><strong>Horario:</strong> {asegurarTexto(horarioTourSeleccionado.hora_inicio)} - {asegurarTexto(horarioTourSeleccionado.hora_fin)}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 bg-white p-2 rounded">
                    <p><strong>L:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_lunes))}</p>
                    <p><strong>M:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_martes))}</p>
                    <p><strong>X:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_miercoles))}</p>
                    <p><strong>J:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_jueves))}</p>
                    <p><strong>V:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_viernes))}</p>
                    <p><strong>S:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_sabado))}</p>
                    <p><strong>D:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_domingo))}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {showWarnings && validationWarnings.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto">
              <h3 className="text-lg font-medium text-amber-600 flex items-center mb-4">
                <FaExclamationTriangle className="mr-2" />
                Se han detectado posibles conflictos
              </h3>
              <div className="mb-4">
                <ul className="list-disc pl-5 space-y-2">
                  {validationWarnings.map((warning, index) => (
                    <li key={index} className="text-gray-700">{warning}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowWarnings(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                >
                  Volver y revisar
                </button>
                <button
                  type="button"
                  onClick={handleContinuarPeseLasAdvertencias}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-amber-700 focus:outline-none transition-colors duration-200"
                >
                  Continuar de todas formas
                </button>
              </div>
            </div>
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="flex">
                <FaInfoCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">Sistema de Tours Programados</h4>
                  <div className="space-y-3 text-sm text-blue-700">
                    <p><strong>Conceptos clave:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• <strong>Horario de Tour:</strong> Horarios fijos del servicio (ej: 8-10, 11-13, 14-16)</li>
                      <li>• <strong>Chofer:</strong> Conductor asignado (con horario de disponibilidad independiente)</li>
                      <li>• <strong>Período de vigencia:</strong> Cuándo está disponible para reservas</li>
                      <li>• <strong>Instancias:</strong> Ocurrencias específicas del tour en fechas concretas</li>
                    </ul>
                    
                    <div className="bg-white/50 p-3 rounded border-l-4 border-blue-300">
                      <p className="font-medium text-blue-800 mb-2">Ejemplo:</p>
                      <ul className="ml-4 space-y-1">
                        <li>• Horario Tour: Lunes y Miércoles 10:00-12:00</li>
                        <li>• Chofer: Roberto (disponible L-V 8:00-16:00)</li>
                        <li>• Vigencia: 1 Jun - 30 Sep 2025</li>
                      </ul>
                      <p className="mt-2 font-medium text-green-700">
                        → Se crearán instancias para <strong>todos</strong> los lunes y miércoles del período
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!isEditing && toursACrear > 0 && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <FaCheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-green-800 font-medium">
                      Se crearán <strong>{toursACrear}</strong> tours programados
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      {detalleCalculo || 'Basado en el horario del tour y período de vigencia'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Tour <span className="text-red-500">*</span>
                </label>
                <select
                  name="id_tipo_tour"
                  value={formData.id_tipo_tour}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${formErrors.id_tipo_tour ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                  disabled={Boolean(isEditing || loadingTiposTour)}
                >
                  <option value={0}>
                    {loadingTiposTour ? 'Cargando tipos de tour...' : 'Seleccione un tipo de tour'}
                  </option>
                  {tiposTour.map((tipo: any) => (
                    <option key={tipo.id_tipo_tour} value={tipo.id_tipo_tour}>
                      {asegurarTexto(tipo.nombre)}
                    </option>
                  ))}
                </select>
                {formErrors.id_tipo_tour && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.id_tipo_tour}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Embarcación <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaShip className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="id_embarcacion"
                    value={formData.id_embarcacion}
                    onChange={handleChange}
                    className={`w-full pl-10 rounded-md border ${formErrors.id_embarcacion ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                    disabled={Boolean(loadingEmbarcaciones)}
                  >
                    <option value={0}>
                      {loadingEmbarcaciones ? 'Cargando embarcaciones...' : 'Seleccione una embarcación'}
                    </option>
                    {embarcaciones.map((emb: any) => (
                      <option key={emb.id_embarcacion} value={emb.id_embarcacion}>
                        {asegurarTexto(emb.nombre)} ({asegurarTexto(emb.capacidad)} personas)
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.id_embarcacion && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.id_embarcacion}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario del Tour <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="id_horario"
                    value={formData.id_horario}
                    onChange={handleChange}
                    className={`w-full pl-10 rounded-md border ${formErrors.id_horario ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                    disabled={Boolean(formData.id_tipo_tour <= 0 || loadingHorarios)}
                  >
                    <option value={0}>
                      {formData.id_tipo_tour <= 0 
                        ? 'Primero seleccione un tipo de tour' 
                        : loadingHorarios
                          ? 'Cargando horarios...'
                          : 'Seleccione el horario del tour'}
                    </option>
                    // En la función que muestra los horarios en el selector
{horariosTour
  .filter(h => h.id_tipo_tour === formData.id_tipo_tour)
  .map((h: any) => {
    // Formatear correctamente las horas
    const horaInicio = asegurarTexto(h.hora_inicio).padStart(5, '0');
    const horaFin = asegurarTexto(h.hora_fin).padStart(5, '0');
    
    return (
      <option key={h.id_horario} value={h.id_horario}>
        {horaInicio} - {horaFin}
        {asegurarBooleano(h.disponible_lunes) ? ' | L' : ''}
        {asegurarBooleano(h.disponible_martes) ? ' | M' : ''}
        {asegurarBooleano(h.disponible_miercoles) ? ' | X' : ''}
        {asegurarBooleano(h.disponible_jueves) ? ' | J' : ''}
        {asegurarBooleano(h.disponible_viernes) ? ' | V' : ''}
        {asegurarBooleano(h.disponible_sabado) ? ' | S' : ''}
        {asegurarBooleano(h.disponible_domingo) ? ' | D' : ''}
      </option>
    );
  })}
                  </select>
                </div>
                {formErrors.id_horario && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.id_horario}</p>
                )}
                {formData.id_tipo_tour > 0 && horariosTour.filter(h => h.id_tipo_tour === formData.id_tipo_tour).length === 0 && !loadingHorarios && (
                  <p className="mt-1 text-sm text-amber-600">
                    No hay horarios disponibles para este tipo de tour. Debe crear horarios primero.
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Horarios fijos del servicio de tour
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chofer Asignado <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserTie className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="id_chofer"
                    value={formData.id_chofer === undefined ? '' : formData.id_chofer}
                    onChange={handleChange}
                    className={`w-full pl-10 rounded-md border ${formErrors.id_chofer ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                    disabled={Boolean(loadingUsuarios)}
                  >
                    <option value="">
                      {loadingUsuarios ? 'Cargando choferes...' : 'Seleccione un chofer'}
                    </option>
                    {choferes.map((chofer: any) => (
                      <option key={chofer.id_usuario} value={chofer.id_usuario}>
                        {asegurarTexto(chofer.nombres || chofer.nombre)} {asegurarTexto(chofer.apellidos || chofer.apellido)}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.id_chofer && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.id_chofer}</p>
                )}
                {choferes.length === 0 && !loadingUsuarios && (
                  <p className="mt-1 text-sm text-amber-600">
                    No hay choferes disponibles. Debe crear usuarios con rol "CHOFER" primero.
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Conductor asignado (horario independiente del tour)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disponible desde <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarCheck className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="vigencia_desde"
                    value={formData.vigencia_desde ? formData.vigencia_desde.split('T')[0] : ''}
                    onChange={handleChange}
                    className={`w-full pl-10 rounded-md border ${formErrors.vigencia_desde ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                    min={today}
                    max={formData.vigencia_hasta ? formData.vigencia_hasta.split('T')[0] : oneYearFromNow}
                  />
                </div>
                {formErrors.vigencia_desde && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.vigencia_desde}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Fecha desde la cual se pueden hacer reservas
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disponible hasta <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarCheck className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="vigencia_hasta"
                    value={formData.vigencia_hasta ? formData.vigencia_hasta.split('T')[0] : ''}
                    onChange={handleChange}
                    className={`w-full pl-10 rounded-md border ${formErrors.vigencia_hasta ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                    min={formData.vigencia_desde ? formData.vigencia_desde.split('T')[0] : today}
                    max={oneYearFromNow}
                  />
                </div>
                {formErrors.vigencia_hasta && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.vigencia_hasta}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Fecha hasta la cual este tour estará disponible
                </p>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Cupo Máximo <span className="text-red-500">*</span>
                  </label>
                  {isEmbarcacionManual && formData.id_embarcacion > 0 && (
                    <button 
                      type="button"
                      onClick={handleRestablecerCupo}
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      Restablecer según embarcación
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserFriends className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="cupo_maximo"
                    value={formData.cupo_maximo}
                    onChange={handleChange}
                    min={1}
                    className={`w-full pl-10 rounded-md border ${formErrors.cupo_maximo ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200 ${isEmbarcacionManual ? 'bg-yellow-50' : ''}`}
                  />
                </div>
                {formErrors.cupo_maximo && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.cupo_maximo}</p>
                )}
                {isEmbarcacionManual && (
                  <p className="mt-1 text-xs text-amber-600">
                    El cupo máximo ha sido modificado manualmente y difiere de la capacidad de la embarcación.
                  </p>
                )}
              </div>
              
              {/* Opción para generar instancias */}
              <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="generar_instancias"
                      name="generar_instancias"
                      type="checkbox"
                      checked={formData.generar_instancias}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="generar_instancias" className="font-medium text-gray-700">
                      Generar instancias automáticamente
                    </label>
                    <p className="text-gray-500">
                      {isEditing 
                        ? "Genera las instancias específicas para este tour (fechas concretas según los días operativos)"
                        : "Crear automáticamente todas las fechas específicas según los días seleccionados en el horario"}
                    </p>
                    <div className="mt-2 text-xs bg-green-100 p-2 rounded text-green-700">
                      <div className="flex items-center mb-1">
                        <FaCalendarAlt className="mr-1 text-green-600" />
                        <span className="font-medium">¿Qué son las instancias?</span>
                      </div>
                      <p>
                        Las instancias son las fechas específicas en las que se realizará este tour.
                        Por ejemplo, si el horario indica "Lunes y Miércoles" y la vigencia es del 1 al 30 de junio,
                        se crearán instancias para cada lunes y miércoles de junio.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="es_excepcion"
                    name="es_excepcion"
                    checked={formData.es_excepcion}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="es_excepcion" className="ml-2 block text-sm text-gray-700">
                    Marcar como excepción (fuera de programación regular)
                  </label>
                </div>
              </div>
              
              {formData.es_excepcion && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas de Excepción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="notas_excepcion"
                    value={formData.notas_excepcion}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full rounded-md border ${formErrors.notas_excepcion ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                    placeholder="Explique por qué este tour es una excepción"
                  ></textarea>
                  {formErrors.notas_excepcion && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.notas_excepcion}</p>
                  )}
                </div>
              )}
              
              {isEditing && (
                <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-800">Información de reservas</h4>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Cupo máximo:</span>
                      <span className="ml-2 text-sm font-medium">{formData.cupo_maximo}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Cupo disponible:</span>
                      <span className="ml-2 text-sm font-medium">{formData.cupo_disponible}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Reservas actuales:</span>
                      <span className="ml-2 text-sm font-medium">{formData.cupo_maximo - formData.cupo_disponible}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Estado:</span>
                      <span className="ml-2 text-sm font-medium">
                        {currentTour?.estado || 'No disponible'}
                      </span>
                    </div>
                  </div>
                  {formData.cupo_maximo !== formData.cupo_disponible && (
                    <p className="mt-2 text-xs text-amber-600">
                      Nota: Este tour ya tiene reservas. Modificar el cupo máximo podría afectar a las reservas existentes.
                    </p>
                  )}
                </div>
              )}

              {/* Información sobre instancias generadas */}
              {cantidadGenerada !== null && (
                <div className="md:col-span-2 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-green-800 font-medium">
                        Se han generado {cantidadGenerada} instancias correctamente
                      </p>
                      <p className="text-green-600 text-sm mt-1">
                        Las instancias representan las fechas específicas en las que operará este tour
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                disabled={isFormDisabled}
              >
                <FaTimes className="mr-2 -ml-1 h-4 w-4" />
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-200"
                disabled={isSubmitDisabled}
              >
                {loading || generandoInstancias ? (
                  <>
                    <div className="w-4 h-4 mr-2 -ml-1 relative">
                      <div className="absolute top-0 left-0 w-full h-full border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    {generandoInstancias 
                      ? 'Generando instancias...' 
                      : (!isEditing && toursACrear > 1 
                          ? `Creando ${toursACrear} tours...` 
                          : 'Guardando...')}
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 -ml-1 h-4 w-4" />
                    {isEditing 
                      ? (formData.generar_instancias ? 'Actualizar y generar instancias' : 'Actualizar Tour') 
                      : (toursACrear > 1 
                          ? `Crear ${toursACrear} Tours y sus instancias` 
                          : 'Crear Tour y sus instancias')}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TourProgramadoForm;










/*import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  createTourProgramado, 
  updateTourProgramado,
  fetchTourProgramadoById,
  clearError,
  clearCreatedId
} from '../../../../infrastructure/store/slices/tourProgramadoSlice';
import { fetchTiposTourPorSede } from '../../../../infrastructure/store/slices/tipoTourSlice';
import { fetchEmbarcacionesPorSede } from '../../../../infrastructure/store/slices/embarcacionSlice';
import { 
  fetchHorariosTourPorTipoTour
} from '../../../../infrastructure/store/slices/horarioTourSlice';
import { fetchUsuariosPorRol } from '../../../../infrastructure/store/slices/usuarioSlice';
import { RootState, AppDispatch } from '../../../../infrastructure/store/index';
import { 
  FaSave, 
  FaTimes, 
  FaClock, 
  FaShip, 
  FaUserFriends, 
  FaUserTie,
  FaArrowLeft,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCalendarCheck,
  FaCalculator,
  FaBug,
  FaCheckCircle
} from 'react-icons/fa';
import { format, addMonths, parseISO, eachDayOfInterval, getDay, isValid } from 'date-fns';

// Función para asegurar que los valores sean texto
const asegurarTexto = (valor: any): string => {
  if (valor === null || valor === undefined) return '';
  if (typeof valor === 'string') return valor;
  if (typeof valor === 'number') return valor.toString();
  if (typeof valor === 'object') {
    try {
      if (valor.String !== undefined) return valor.String || '';
      if (valor.Valid !== undefined) return valor.Valid ? valor.String || '' : '';
      if (typeof valor.toString === 'function' && valor.toString !== Object.prototype.toString) {
        return valor.toString();
      }
      return JSON.stringify(valor);
    } catch (e) {
      console.error('Error al convertir objeto a texto:', e);
      return '';
    }
  }
  return String(valor);
};

// Función para asegurar que un valor sea número
const asegurarNumero = (valor: any): number => {
  if (valor === null || valor === undefined) return 0;
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'string') {
    const parsed = parseInt(valor, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Función para asegurar que un valor sea booleano
const asegurarBooleano = (valor: any): boolean => {
  if (typeof valor === 'boolean') return valor;
  if (valor === 1 || valor === '1' || valor === 'true') return true;
  if (valor === 0 || valor === '0' || valor === 'false') return false;
  return Boolean(valor);
};

// Función para obtener el nombre del día
const obtenerNombreDia = (numeroDay: number): string => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[numeroDay] || 'Desconocido';
};

// Función para analizar el horario de tour y obtener información detallada
const analizarHorarioTour = (horarioTour: any): { diasActivos: number[], diasNombres: string[], detalleCompleto: string } => {
  const diasActivos: number[] = [];
  const diasNombres: string[] = [];
  
  console.log('🔍 ANALIZANDO HORARIO DE TOUR:', horarioTour);
  
  // Verificar cada día de la semana de forma más robusta
  const diasSemana = [
    { campo: 'disponible_domingo', numero: 0, nombre: 'Domingo', abrev: 'D' },
    { campo: 'disponible_lunes', numero: 1, nombre: 'Lunes', abrev: 'L' },
    { campo: 'disponible_martes', numero: 2, nombre: 'Martes', abrev: 'M' },
    { campo: 'disponible_miercoles', numero: 3, nombre: 'Miércoles', abrev: 'X' },
    { campo: 'disponible_jueves', numero: 4, nombre: 'Jueves', abrev: 'J' },
    { campo: 'disponible_viernes', numero: 5, nombre: 'Viernes', abrev: 'V' },
    { campo: 'disponible_sabado', numero: 6, nombre: 'Sábado', abrev: 'S' }
  ];
  
  diasSemana.forEach(dia => {
    const valor = horarioTour[dia.campo];
    console.log(`   ${dia.nombre} (${dia.campo}):`, valor, typeof valor);
    
    // Verificar múltiples formatos posibles (boolean, number, string)
    if (asegurarBooleano(valor)) {
      diasActivos.push(dia.numero);
      diasNombres.push(dia.nombre);
      console.log(`   ✅ ${dia.nombre} ACTIVO`);
    } else {
      console.log(`   ❌ ${dia.nombre} INACTIVO`);
    }
  });
  
  const detalleCompleto = `Horario del Tour: ${asegurarTexto(horarioTour.hora_inicio)} - ${asegurarTexto(horarioTour.hora_fin)} | Días operativos: ${diasNombres.join(', ') || 'NINGUNO'}`;
  
  console.log('📊 RESULTADO ANÁLISIS HORARIO DE TOUR:');
  console.log('   Días operativos (números):', diasActivos);
  console.log('   Días operativos (nombres):', diasNombres);
  console.log('   Detalle completo:', detalleCompleto);
  
  return { diasActivos, diasNombres, detalleCompleto };
};

// Función para calcular cuántos tours se van a crear
const calcularToursACrear = (horarioTour: any, vigenciaDesde: string, vigenciaHasta: string): { cantidad: number, detalle: string, error?: string } => {
  try {
    console.log('🚀 INICIANDO CÁLCULO DE TOURS PROGRAMADOS');
    console.log('📅 Parámetros recibidos:', { 
      horarioTourId: horarioTour?.id_horario,
      vigenciaDesde, 
      vigenciaHasta 
    });
    
    if (!horarioTour) {
      const error = 'No se ha seleccionado un horario de tour válido';
      console.log('❌ ERROR:', error);
      return { cantidad: 0, detalle: '', error };
    }

    if (!vigenciaDesde || !vigenciaHasta) {
      const error = 'Faltan fechas de vigencia (desde/hasta)';
      console.log('❌ ERROR:', error);
      return { cantidad: 0, detalle: '', error };
    }

    // Validar y parsear fechas
    const fechaInicio = parseISO(vigenciaDesde);
    const fechaFin = parseISO(vigenciaHasta);
    
    console.log('📅 Fechas parseadas:', { fechaInicio, fechaFin });
    
    if (!isValid(fechaInicio) || !isValid(fechaFin)) {
      const error = `Fechas no válidas: desde=${vigenciaDesde}, hasta=${vigenciaHasta}`;
      console.log('❌ ERROR:', error);
      return { cantidad: 0, detalle: '', error };
    }

    if (fechaFin < fechaInicio) {
      const error = 'La fecha de fin debe ser posterior a la fecha de inicio';
      console.log('❌ ERROR:', error);
      return { cantidad: 0, detalle: '', error };
    }
    
    // Analizar horario de tour
    const { diasActivos, diasNombres, detalleCompleto } = analizarHorarioTour(horarioTour);
    
    if (diasActivos.length === 0) {
      const error = `El horario de tour seleccionado (${asegurarTexto(horarioTour.hora_inicio)} - ${asegurarTexto(horarioTour.hora_fin)}) no tiene días operativos configurados. Debe activar al menos un día de la semana en el horario del tour.`;
      console.log('❌ ERROR:', error);
      return { cantidad: 0, detalle: detalleCompleto, error };
    }
    
    // Obtener todos los días en el rango
    const todasLasFechas = eachDayOfInterval({ start: fechaInicio, end: fechaFin });
    console.log(`📊 Total de fechas en el período: ${todasLasFechas.length}`);
    
    // Contar fechas que coinciden con los días operativos del tour
    const fechasCoincidentes = todasLasFechas.filter(fecha => {
      const diaSemana = getDay(fecha);
      const coincide = diasActivos.includes(diaSemana);
      if (coincide) {
        console.log(`   ✅ ${format(fecha, 'yyyy-MM-dd')} (${obtenerNombreDia(diaSemana)}) - TOUR PROGRAMADO`);
      }
      return coincide;
    });
    
    console.log(`🎯 RESULTADO FINAL: ${fechasCoincidentes.length} tours programados serán creados`);
    
    const detalle = `${detalleCompleto} | ${fechasCoincidentes.length} fechas válidas encontradas en el período`;
    
    return { 
      cantidad: fechasCoincidentes.length, 
      detalle,
      error: fechasCoincidentes.length === 0 ? 
        `No hay fechas que coincidan con los días operativos del tour (${diasNombres.join(', ')}) en el período seleccionado.` : 
        undefined
    };
  } catch (error) {
    console.error('💥 ERROR CRÍTICO calculando tours:', error);
    return { 
      cantidad: 0, 
      detalle: '', 
      error: `Error técnico al calcular tours: ${error instanceof Error ? error.message : 'Error desconocido'}` 
    };
  }
};

// Componente Toast para notificaciones
const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'warning'; onClose: () => void }> = ({ 
  message, 
  type, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastColors = () => {
    switch(type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getToastIcon = () => {
    switch(type) {
      case 'success':
        return <FaSave className="mr-2" />;
      case 'error':
        return <FaExclamationTriangle className="mr-2" />;
      case 'warning':
        return <FaInfoCircle className="mr-2" />;
      default:
        return <FaInfoCircle className="mr-2" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 ${getToastColors()} px-4 py-3 rounded-lg shadow-lg z-50 flex items-center max-w-md`}
    >
      {getToastIcon()}
      <span className="text-sm">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-4 text-white hover:text-gray-200"
      >
        &times;
      </button>
    </motion.div>
  );
};

interface TourProgramadoFormProps {
  isEditing?: boolean;
}

const TourProgramadoForm: React.FC<TourProgramadoFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const searchParams = new URLSearchParams(location.search);
  const tipoIdFromQuery = searchParams.get('tipo');
  
  const { currentTour, loading, error, createdTourId } = useSelector((state: RootState) => state.tourProgramado);
  const { tiposTour, loading: loadingTiposTour } = useSelector((state: RootState) => state.tipoTour);
  const { embarcaciones, loading: loadingEmbarcaciones } = useSelector((state: RootState) => state.embarcacion);
  const { horariosTour, loading: loadingHorarios } = useSelector((state: RootState) => state.horarioTour);
  const { usuarios, loading: loadingUsuarios } = useSelector((state: RootState) => state.usuario);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  // Estado inicial del formulario
  const initialFormState = {
    id_tipo_tour: 0,
    id_embarcacion: 0,
    id_horario: 0,
    id_sede: selectedSede?.id_sede || 0,
    id_chofer: undefined as number | undefined,
    fecha: format(new Date(), 'yyyy-MM-dd'),
    vigencia_desde: format(new Date(), 'yyyy-MM-dd'),
    vigencia_hasta: format(addMonths(new Date(), 3), 'yyyy-MM-dd'),
    cupo_maximo: 0,
    cupo_disponible: 0,
    es_excepcion: false,
    notas_excepcion: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [showWarnings, setShowWarnings] = useState(false);
  const [isEmbarcacionManual, setIsEmbarcacionManual] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [choferesLoaded, setChoferesLoaded] = useState(false);
  const [toursACrear, setToursACrear] = useState(0);
  const [detalleCalculo, setDetalleCalculo] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  // Fecha actual y máxima para datepicker
  const today = format(new Date(), 'yyyy-MM-dd');
  const oneYearFromNow = format(addMonths(new Date(), 12), 'yyyy-MM-dd');
  
  // Mostrar notificación
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ show: true, message, type });
  }, []);

  // Ocultar notificación
  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);
  
  // Calcular tours a crear cuando cambian los parámetros
  useEffect(() => {
    console.log('🔄 EFECTO DE CÁLCULO DISPARADO');
    console.log('   isEditing:', isEditing);
    console.log('   formData.id_horario:', formData.id_horario);
    console.log('   formData.id_tipo_tour:', formData.id_tipo_tour);
    console.log('   horariosTour.length:', horariosTour.length);
    
    // DEBUGGING: Mostrar todos los horarios cargados
    console.log('🕐 HORARIOS TOUR CARGADOS:');
    horariosTour.forEach((h, index) => {
      console.log(`   ${index + 1}. ID: ${h.id_horario}, Tipo: ${h.id_tipo_tour}, Hora: ${h.hora_inicio}-${h.hora_fin}`);
    });
    
    if (formData.id_horario > 0 && formData.vigencia_desde && formData.vigencia_hasta && !isEditing) {
      // VERIFICACIÓN CORREGIDA: Buscar por ID y tipo de tour
      const horarioTourSeleccionado = horariosTour.find(h => 
        h.id_horario === formData.id_horario && 
        h.id_tipo_tour === formData.id_tipo_tour
      );
      
      console.log('🎯 Horario de tour seleccionado encontrado:', horarioTourSeleccionado);
      
      if (!horarioTourSeleccionado) {
        console.log('❌ DEBUGGING - Buscando horario ID:', formData.id_horario, 'para tipo:', formData.id_tipo_tour);
        console.log('❌ DEBUGGING - Horarios disponibles:');
        horariosTour.forEach(h => {
          console.log(`     ID: ${h.id_horario}, Tipo: ${h.id_tipo_tour}, Compatible: ${h.id_tipo_tour === formData.id_tipo_tour}`);
        });
      }
      
      if (horarioTourSeleccionado) {
        const resultado = calcularToursACrear(horarioTourSeleccionado, formData.vigencia_desde, formData.vigencia_hasta);
        console.log('📊 Resultado del cálculo:', resultado);
        
        setToursACrear(resultado.cantidad);
        setDetalleCalculo(resultado.detalle);
        
        // Limpiar errores previos
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.vigencia_general;
          delete newErrors.id_horario;
          return newErrors;
        });
        
        // Mostrar error si hay problemas
        if (resultado.error) {
          setFormErrors(prev => ({
            ...prev,
            vigencia_general: resultado.error!
          }));
        }
      } else {
        console.log('❌ No se encontró el horario de tour seleccionado en la lista');
        setToursACrear(0);
        setDetalleCalculo('');
        
        // NO limpiar automáticamente, solo mostrar error
        setFormErrors(prev => ({
          ...prev,
          id_horario: `El horario seleccionado no pertenece al tipo de tour actual. Seleccione un horario válido.`
        }));
      }
    } else {
      console.log('⏸️ Condiciones no cumplidas para el cálculo');
      setToursACrear(0);
      setDetalleCalculo('');
    }
  }, [formData.id_horario, formData.id_tipo_tour, formData.vigencia_desde, formData.vigencia_hasta, horariosTour, isEditing]);

  // Cargar datos iniciales
  useEffect(() => {
    if (selectedSede?.id_sede) {
      dispatch(fetchTiposTourPorSede(selectedSede.id_sede))
        .then(() => console.log("Tipos de tour cargados correctamente"))
        .catch(err => console.error("Error al cargar tipos de tour:", err));
      
      dispatch(fetchEmbarcacionesPorSede(selectedSede.id_sede))
        .then(() => console.log("Embarcaciones cargadas correctamente"))
        .catch(err => console.error("Error al cargar embarcaciones:", err));
      
      dispatch(fetchUsuariosPorRol('CHOFER'))
        .then(() => {
          console.log("Choferes cargados correctamente");
          setChoferesLoaded(true);
        })
        .catch(err => {
          console.error("Error al cargar choferes:", err);
          showToast("Error al cargar lista de choferes", "error");
        });
      
      setDataLoaded(true);
    } else {
      showToast("No hay sede seleccionada", "error");
    }
    
    if (isEditing && id) {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        dispatch(fetchTourProgramadoById(numericId))
          .then(() => console.log("Tour cargado correctamente"))
          .catch(err => {
            console.error("Error al cargar tour:", err);
            showToast("Error al cargar datos del tour", "error");
          });
      } else {
        showToast("ID de tour inválido", "error");
        navigate('/admin/tours');
      }
    }
    
    if (tipoIdFromQuery && !isEditing) {
      const tipoId = parseInt(tipoIdFromQuery);
      if (!isNaN(tipoId)) {
        setFormData(prev => ({ ...prev, id_tipo_tour: tipoId }));
        
        dispatch(fetchHorariosTourPorTipoTour(tipoId))
          .then(() => console.log("Horarios de tour cargados correctamente"))
          .catch(err => {
            console.error("Error al cargar horarios de tour:", err);
            showToast("Error al cargar horarios de tour disponibles", "error");
          });
      }
    }
    
    return () => {
      dispatch(clearError());
      dispatch(clearCreatedId());
    };
  }, [dispatch, id, isEditing, selectedSede, tipoIdFromQuery, showToast, navigate]);
  
  // Actualizar formulario cuando se carga el tour para edición
  useEffect(() => {
    if (isEditing && currentTour && dataLoaded) {
      console.log("Actualizando formulario con datos del tour:", currentTour);
      
      let chofer: number | undefined = undefined;
      if (currentTour.id_chofer && typeof currentTour.id_chofer === 'object' && 'Int64' in currentTour.id_chofer) {
        chofer = currentTour.id_chofer.Valid ? currentTour.id_chofer.Int64 : undefined;
      } else if (typeof currentTour.id_chofer === 'number') {
        chofer = currentTour.id_chofer;
      }
      
      const updatedFormData = {
        id_tipo_tour: asegurarNumero(currentTour.id_tipo_tour),
        id_embarcacion: asegurarNumero(currentTour.id_embarcacion),
        id_horario: asegurarNumero(currentTour.id_horario),
        id_sede: asegurarNumero(currentTour.id_sede || selectedSede?.id_sede),
        id_chofer: chofer,
        fecha: currentTour.fecha ? currentTour.fecha.split('T')[0] : today,
        vigencia_desde: currentTour.vigencia_desde ? currentTour.vigencia_desde.split('T')[0] : today,
        vigencia_hasta: currentTour.vigencia_hasta ? currentTour.vigencia_hasta.split('T')[0] : format(addMonths(new Date(), 3), 'yyyy-MM-dd'),
        cupo_maximo: asegurarNumero(currentTour.cupo_maximo),
        cupo_disponible: asegurarNumero(currentTour.cupo_disponible),
        es_excepcion: asegurarBooleano(currentTour.es_excepcion),
        notas_excepcion: currentTour.notas_excepcion?.String || ''
      };
      
      setFormData(updatedFormData);
      
      if (currentTour.id_tipo_tour) {
        dispatch(fetchHorariosTourPorTipoTour(asegurarNumero(currentTour.id_tipo_tour)))
          .then(() => console.log("Horarios de tour cargados correctamente para edición"))
          .catch(err => {
            console.error("Error al cargar horarios de tour para edición:", err);
            showToast("Error al cargar horarios de tour disponibles", "error");
          });
      }
      
      const embarcacion = embarcaciones.find(e => e.id_embarcacion === currentTour.id_embarcacion);
      if (embarcacion && embarcacion.capacidad) {
        const capacidad = asegurarNumero(embarcacion.capacidad);
        
        if (capacidad > 0 && currentTour.cupo_maximo !== capacidad) {
          setIsEmbarcacionManual(true);
        }
      }
    }
  }, [currentTour, dispatch, isEditing, dataLoaded, embarcaciones, selectedSede, showToast, today]);
  
  // Cuando cambia el tipo de tour, cargar horarios correspondientes
  useEffect(() => {
    if (formData.id_tipo_tour > 0) {
      console.log('🔄 Cargando horarios de tour para tipo:', formData.id_tipo_tour);
      
      // Limpiar horario seleccionado al cambiar tipo de tour
      if (formData.id_horario > 0) {
        setFormData(prev => ({ ...prev, id_horario: 0 }));
      }
      
      dispatch(fetchHorariosTourPorTipoTour(formData.id_tipo_tour))
        .then(() => console.log("Horarios de tour actualizados"))
        .catch(err => {
          console.error("Error al actualizar horarios de tour:", err);
          showToast("Error al cargar horarios de tour", "error");
        });
    }
  }, [dispatch, formData.id_tipo_tour, showToast]);
  
  // Redirigir después de crear exitosamente
  useEffect(() => {
    if (createdTourId) {
      if (toursACrear > 1) {
        showToast(`${toursACrear} tours programados creados exitosamente`, 'success');
      } else {
        showToast('Tour programado guardado exitosamente', 'success');
      }
      
      setTimeout(() => {
        navigate(`/admin/tours`);
      }, 1500);
    }
  }, [createdTourId, navigate, showToast, toursACrear]);

  // Actualizar cupo máximo automáticamente
  useEffect(() => {
    if (formData.id_embarcacion > 0 && !isEmbarcacionManual) {
      const embarcacionSeleccionada = embarcaciones.find(e => e.id_embarcacion === formData.id_embarcacion);
      if (embarcacionSeleccionada && embarcacionSeleccionada.capacidad) {
        const capacidad = asegurarNumero(embarcacionSeleccionada.capacidad);
        
        console.log("Capacidad detectada:", capacidad, "para embarcación:", embarcacionSeleccionada.nombre);
        
        if (capacidad > 0) {
          setFormData(prev => ({ 
            ...prev, 
            cupo_maximo: capacidad,
            cupo_disponible: isEditing ? prev.cupo_disponible : capacidad
          }));
        }
      }
    }
  }, [formData.id_embarcacion, embarcaciones, isEmbarcacionManual, isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'id_chofer') {
      const choferValue = value === '' ? undefined : parseInt(value);
      setFormData(prev => ({ ...prev, [name]: choferValue }));
      
      if (choferValue !== undefined) {
        setFormErrors(prev => ({ ...prev, id_chofer: '' }));
      }
    } else if (name === 'id_embarcacion') {
      const embarcacionId = parseInt(value);
      setFormData(prev => ({ ...prev, id_embarcacion: embarcacionId }));
      
      if (embarcacionId > 0) {
        setIsEmbarcacionManual(false);
      }
      
      setFormErrors(prev => ({ ...prev, id_embarcacion: '' }));
    } else if (name === 'cupo_maximo') {
      const cupoValue = parseInt(value);
      if (!isNaN(cupoValue)) {
        setIsEmbarcacionManual(true);
        setFormData(prev => ({ 
          ...prev, 
          [name]: cupoValue,
          ...(isEditing ? {} : { cupo_disponible: cupoValue })
        }));
      }
      
      setFormErrors(prev => ({ ...prev, cupo_maximo: '' }));
    } else if (name === 'id_horario') {
      const horarioId = parseInt(value);
      setFormData(prev => ({ ...prev, id_horario: horarioId }));
      
      // Limpiar errores de horario al cambiar
      setFormErrors(prev => ({ ...prev, id_horario: '', vigencia_general: '' }));
    } else if (type === 'number') {
      const numValue = parseInt(value);
      setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    } else if (name === 'vigencia_desde' || name === 'vigencia_hasta') {
      setFormData(prev => ({ ...prev, [name]: value }));
      setFormErrors(prev => ({ ...prev, [name]: '', vigencia_general: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (name in formErrors) {
        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };
  
  const handleRestablecerCupo = () => {
    if (formData.id_embarcacion > 0) {
      const embarcacionSeleccionada = embarcaciones.find(e => e.id_embarcacion === formData.id_embarcacion);
      if (embarcacionSeleccionada && embarcacionSeleccionada.capacidad) {
        const capacidad = asegurarNumero(embarcacionSeleccionada.capacidad);
        
        if (capacidad > 0) {
          setFormData(prev => ({ 
            ...prev, 
            cupo_maximo: capacidad,
            ...(isEditing ? {} : { cupo_disponible: capacidad })
          }));
          setIsEmbarcacionManual(false);
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.id_tipo_tour <= 0) newErrors.id_tipo_tour = 'Seleccione un tipo de tour';
    if (formData.id_embarcacion <= 0) newErrors.id_embarcacion = 'Seleccione una embarcación';
    if (formData.id_horario <= 0) newErrors.id_horario = 'Seleccione un horario de tour';
    
    // VALIDACIÓN MEJORADA: Verificar que el horario pertenece al tipo de tour
    if (formData.id_horario > 0 && formData.id_tipo_tour > 0) {
      const horarioValid = horariosTour.find(h => 
        h.id_horario === formData.id_horario && 
        h.id_tipo_tour === formData.id_tipo_tour
      );
      
      if (!horarioValid) {
        newErrors.id_horario = `El horario seleccionado no pertenece al tipo de tour "${tiposTour.find(t => t.id_tipo_tour === formData.id_tipo_tour)?.nombre || 'seleccionado'}"`;
      }
    }
    
    if (!formData.vigencia_desde) {
      newErrors.vigencia_desde = 'Seleccione una fecha de inicio de vigencia';
    }
    
    if (!formData.vigencia_hasta) {
      newErrors.vigencia_hasta = 'Seleccione una fecha de fin de vigencia';
    } else if (formData.vigencia_desde && formData.vigencia_hasta < formData.vigencia_desde) {
      newErrors.vigencia_hasta = 'La fecha de fin de vigencia debe ser posterior a la fecha de inicio';
    }
    
    if (formData.cupo_maximo <= 0) {
      newErrors.cupo_maximo = 'El cupo máximo debe ser mayor a 0';
    }
    
    if (formData.id_chofer === undefined) {
      newErrors.id_chofer = 'Seleccione un chofer';
    }
    
    if (formData.es_excepcion && !formData.notas_excepcion.trim()) {
      newErrors.notas_excepcion = 'Debe proporcionar una explicación para la excepción';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const verificarConflictos = (): string[] => {
    const warnings: string[] = [];
    
    if (isEmbarcacionManual && formData.id_embarcacion > 0) {
      const embarcacion = embarcaciones.find(e => e.id_embarcacion === formData.id_embarcacion);
      if (embarcacion && embarcacion.capacidad) {
        const capacidad = asegurarNumero(embarcacion.capacidad);
        
        if (capacidad > 0) {
          const diferencia = Math.abs(formData.cupo_maximo - capacidad);
          const porcentajeDiferencia = (diferencia / capacidad) * 100;
          
          if (porcentajeDiferencia > 20) {
            warnings.push(`El cupo máximo (${formData.cupo_maximo}) difiere significativamente de la capacidad de la embarcación (${capacidad}).`);
          }
        }
      }
    }
    
    if (formData.es_excepcion) {
      warnings.push("Este tour se está marcando como excepción. No seguirá la programación regular.");
    }
    
    if (!isEditing && toursACrear > 50) {
      warnings.push(`Se van a crear ${toursACrear} tours programados. Esto podría tardar un momento.`);
    }
    
    return warnings;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Por favor, corrija los errores en el formulario', 'error');
      return;
    }
    
    const warnings = verificarConflictos();
    setValidationWarnings(warnings);
    
    if (warnings.length > 0) {
      setShowWarnings(true);
      return;
    }
    
    await proceedWithSubmit();
  };
  
  const proceedWithSubmit = async () => {
    try {
      const datosFormateados = {
        id_tipo_tour: asegurarNumero(formData.id_tipo_tour),
        id_embarcacion: asegurarNumero(formData.id_embarcacion),
        id_horario: asegurarNumero(formData.id_horario),
        id_sede: asegurarNumero(formData.id_sede),
        id_chofer: formData.id_chofer !== undefined ? asegurarNumero(formData.id_chofer) : undefined,
        cupo_maximo: asegurarNumero(formData.cupo_maximo),
        cupo_disponible: asegurarNumero(formData.cupo_disponible),
        fecha: format(new Date(), 'yyyy-MM-dd'),
        vigencia_desde: formData.vigencia_desde,
        vigencia_hasta: formData.vigencia_hasta,
        es_excepcion: formData.es_excepcion,
        notas_excepcion: formData.notas_excepcion
      };
      
      console.log("Datos que se enviarán al backend:", datosFormateados);
      
      if (isEditing && id) {
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
          throw new Error("ID del tour no es válido");
        }
        
        await dispatch(updateTourProgramado({ 
          id: numericId, 
          tourProgramado: datosFormateados 
        })).unwrap();
        showToast('Tour actualizado exitosamente', 'success');
        setTimeout(() => {
          navigate(`/admin/tours`);
        }, 1500);
      } else {
        const submissionData = {
          ...datosFormateados,
          cupo_disponible: asegurarNumero(formData.cupo_maximo)
        };
        
        await dispatch(createTourProgramado(submissionData)).unwrap();
      }
    } catch (err) {
      console.error('Error al guardar el tour programado:', err);
      let errorMsg = 'Error al guardar el tour programado';
      
      if (err && typeof err === 'object' && 'message' in err) {
        errorMsg += `: ${(err as any).message}`;
      }
      
      showToast(errorMsg, 'error');
    }
  };
  
  const handleContinuarPeseLasAdvertencias = () => {
    setShowWarnings(false);
    showToast('Continuando a pesar de las advertencias', 'warning');
    proceedWithSubmit();
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  const isInitialLoading = loading && isEditing && !currentTour;
  const isDataLoading = loadingTiposTour || loadingEmbarcaciones || loadingHorarios || loadingUsuarios;
  
  // Asegurar que las condiciones de disabled sean booleanas
  const isFormDisabled = Boolean(loading || isDataLoading);
  const hasValidationError = Boolean(formErrors.vigencia_general && !isEditing);
  const isSubmitDisabled = Boolean(isFormDisabled || hasValidationError);
  
  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="w-16 h-16 relative">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-lg text-blue-800 font-medium animate-pulse">Cargando datos del tour...</p>
      </div>
    );
  }

  const choferes = usuarios.filter(u => u.rol === 'CHOFER');
  const choferesDisponibles = choferes.length > 0;
  
  // Obtener horario de tour seleccionado para mostrar información
  const horarioTourSeleccionado = horariosTour.find(h => 
    h.id_horario === formData.id_horario && 
    h.id_tipo_tour === formData.id_tipo_tour
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-8">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button 
            onClick={handleCancel}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-1" /> Volver
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            {isEditing ? 'Editar Tour Programado' : 'Crear Nuevo Tour Programado'}
          </h1>
          <p className="text-gray-500 mt-1">
            Complete todos los campos requeridos marcados con <span className="text-red-500">*</span>
          </p>
        </div>
        
        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 mr-2 text-red-500" />
              <p className="font-medium">{asegurarTexto(error)}</p>
            </div>
          </motion.div>
        )}
        
        {choferesLoaded && !choferesDisponibles && (
          <motion.div 
            className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              <p className="font-medium">
                No se encontraron choferes disponibles. Debe crear usuarios con rol "CHOFER" antes de programar tours.
              </p>
            </div>
          </motion.div>
        )}
        
        {isDataLoading && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow-sm mb-6 flex items-center">
            <div className="w-5 h-5 mr-3 relative">
              <div className="absolute top-0 left-0 w-full h-full border-2 border-blue-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p>Cargando datos necesarios...</p>
          </div>
        )}
        
        {/* Error de validación general *//*}
        {formErrors.vigencia_general && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start">
              <FaExclamationTriangle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 mb-2">Problema con la configuración del tour:</p>
                <p className="text-sm">{formErrors.vigencia_general}</p>
                {detalleCalculo && (
                  <div className="mt-3 p-3 bg-red-100 rounded text-xs">
                    <p className="font-medium text-red-700 mb-1">Información del horario:</p>
                    <p className="text-red-600">{detalleCalculo}</p>
                  </div>
                )}
                {horarioTourSeleccionado && (
                  <div className="mt-3 p-3 bg-blue-50 rounded text-xs">
                    <p className="font-medium text-blue-700 mb-1">💡 Para solucionar:</p>
                    <ul className="text-blue-600 space-y-1">
                      <li>• Verifique que el horario tenga días operativos activos</li>
                      <li>• Configure los días de la semana en el horario de tour</li>
                      <li>• Ajuste el período de vigencia si es necesario</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Panel de debugging *//*}
        {process.env.NODE_ENV === 'development' && horarioTourSeleccionado && (
          <motion.div 
            className="bg-gray-50 border-l-4 border-gray-400 text-gray-700 p-4 rounded-md shadow-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start">
              <FaBug className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="w-full">
                <p className="font-medium text-gray-800 mb-2">🔍 Panel de Debugging (Desarrollo)</p>
                <div className="text-xs space-y-1">
                  <p><strong>ID Horario:</strong> {horarioTourSeleccionado.id_horario}</p>
                  <p><strong>Tipo Tour:</strong> {horarioTourSeleccionado.id_tipo_tour}</p>
                  <p><strong>Horario:</strong> {asegurarTexto(horarioTourSeleccionado.hora_inicio)} - {asegurarTexto(horarioTourSeleccionado.hora_fin)}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 bg-white p-2 rounded">
                    <p><strong>L:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_lunes))}</p>
                    <p><strong>M:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_martes))}</p>
                    <p><strong>X:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_miercoles))}</p>
                    <p><strong>J:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_jueves))}</p>
                    <p><strong>V:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_viernes))}</p>
                    <p><strong>S:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_sabado))}</p>
                    <p><strong>D:</strong> {String(asegurarBooleano(horarioTourSeleccionado.disponible_domingo))}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {showWarnings && validationWarnings.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto">
              <h3 className="text-lg font-medium text-amber-600 flex items-center mb-4">
                <FaExclamationTriangle className="mr-2" />
                Se han detectado posibles conflictos
              </h3>
              <div className="mb-4">
                <ul className="list-disc pl-5 space-y-2">
                  {validationWarnings.map((warning, index) => (
                    <li key={index} className="text-gray-700">{warning}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowWarnings(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                >
                  Volver y revisar
                </button>
                <button
                  type="button"
                  onClick={handleContinuarPeseLasAdvertencias}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-amber-700 focus:outline-none transition-colors duration-200"
                >
                  Continuar de todas formas
                </button>
              </div>
            </div>
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="flex">
                <FaInfoCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">Sistema de Tours Programados</h4>
                  <div className="space-y-3 text-sm text-blue-700">
                    <p><strong>Conceptos clave:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• <strong>Horario de Tour:</strong> Horarios fijos del servicio (ej: 8-10, 11-13, 14-16)</li>
                      <li>• <strong>Chofer:</strong> Conductor asignado (con horario de disponibilidad independiente)</li>
                      <li>• <strong>Período de vigencia:</strong> Cuándo está disponible para reservas</li>
                    </ul>
                    
                    <div className="bg-white/50 p-3 rounded border-l-4 border-blue-300">
                      <p className="font-medium text-blue-800 mb-2">Ejemplo:</p>
                      <ul className="ml-4 space-y-1">
                        <li>• Horario Tour: Lunes y Miércoles 10:00-12:00</li>
                        <li>• Chofer: Roberto (disponible L-V 8:00-16:00)</li>
                        <li>• Vigencia: 1 Jun - 30 Sep 2025</li>
                      </ul>
                      <p className="mt-2 font-medium text-green-700">
                        → Se crearán tours para <strong>todos</strong> los lunes y miércoles del período
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!isEditing && toursACrear > 0 && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <FaCheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-green-800 font-medium">
                      Se crearán <strong>{toursACrear}</strong> tours programados
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      {detalleCalculo || 'Basado en el horario del tour y período de vigencia'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Tour <span className="text-red-500">*</span>
                </label>
                <select
                  name="id_tipo_tour"
                  value={formData.id_tipo_tour}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${formErrors.id_tipo_tour ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                  disabled={Boolean(isEditing || loadingTiposTour)}
                >
                  <option value={0}>
                    {loadingTiposTour ? 'Cargando tipos de tour...' : 'Seleccione un tipo de tour'}
                  </option>
                  {tiposTour.map((tipo: any) => (
                    <option key={tipo.id_tipo_tour} value={tipo.id_tipo_tour}>
                      {asegurarTexto(tipo.nombre)}
                    </option>
                  ))}
                </select>
                {formErrors.id_tipo_tour && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.id_tipo_tour}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Embarcación <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaShip className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="id_embarcacion"
                    value={formData.id_embarcacion}
                    onChange={handleChange}
                    className={`w-full pl-10 rounded-md border ${formErrors.id_embarcacion ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                    disabled={Boolean(loadingEmbarcaciones)}
                  >
                    <option value={0}>
                      {loadingEmbarcaciones ? 'Cargando embarcaciones...' : 'Seleccione una embarcación'}
                    </option>
                    {embarcaciones.map((emb: any) => (
                      <option key={emb.id_embarcacion} value={emb.id_embarcacion}>
                        {asegurarTexto(emb.nombre)} ({asegurarTexto(emb.capacidad)} personas)
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.id_embarcacion && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.id_embarcacion}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario del Tour <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="id_horario"
                    value={formData.id_horario}
                    onChange={handleChange}
                    className={`w-full pl-10 rounded-md border ${formErrors.id_horario ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                    disabled={Boolean(formData.id_tipo_tour <= 0 || loadingHorarios)}
                  >
                    <option value={0}>
                      {formData.id_tipo_tour <= 0 
                        ? 'Primero seleccione un tipo de tour' 
                        : loadingHorarios
                          ? 'Cargando horarios...'
                          : 'Seleccione el horario del tour'}
                    </option>
                    {horariosTour
                      .filter(h => h.id_tipo_tour === formData.id_tipo_tour)
                      .map((h: any) => (
                        <option key={h.id_horario} value={h.id_horario}>
                          {asegurarTexto(h.hora_inicio)} - {asegurarTexto(h.hora_fin)} 
                          {asegurarBooleano(h.disponible_lunes) ? ' | L' : ''}
                          {asegurarBooleano(h.disponible_martes) ? ' | M' : ''}
                          {asegurarBooleano(h.disponible_miercoles) ? ' | X' : ''}
                          {asegurarBooleano(h.disponible_jueves) ? ' | J' : ''}
                          {asegurarBooleano(h.disponible_viernes) ? ' | V' : ''}
                          {asegurarBooleano(h.disponible_sabado) ? ' | S' : ''}
                          {asegurarBooleano(h.disponible_domingo) ? ' | D' : ''}
                        </option>
                      ))}
                  </select>
                </div>
                {formErrors.id_horario && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.id_horario}</p>
                )}
                {formData.id_tipo_tour > 0 && horariosTour.filter(h => h.id_tipo_tour === formData.id_tipo_tour).length === 0 && !loadingHorarios && (
                  <p className="mt-1 text-sm text-amber-600">
                    No hay horarios disponibles para este tipo de tour. Debe crear horarios primero.
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Horarios fijos del servicio de tour
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chofer Asignado <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserTie className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="id_chofer"
                    value={formData.id_chofer === undefined ? '' : formData.id_chofer}
                    onChange={handleChange}
                    className={`w-full pl-10 rounded-md border ${formErrors.id_chofer ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                    disabled={Boolean(loadingUsuarios)}
                  >
                    <option value="">
                      {loadingUsuarios ? 'Cargando choferes...' : 'Seleccione un chofer'}
                    </option>
                    {choferes.map((chofer: any) => (
                      <option key={chofer.id_usuario} value={chofer.id_usuario}>
                        {asegurarTexto(chofer.nombres || chofer.nombre)} {asegurarTexto(chofer.apellidos || chofer.apellido)}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.id_chofer && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.id_chofer}</p>
                )}
                {choferes.length === 0 && !loadingUsuarios && (
                  <p className="mt-1 text-sm text-amber-600">
                    No hay choferes disponibles. Debe crear usuarios con rol "CHOFER" primero.
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Conductor asignado (horario independiente del tour)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disponible desde <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarCheck className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="vigencia_desde"
                    value={formData.vigencia_desde ? formData.vigencia_desde.split('T')[0] : ''}
                    onChange={handleChange}
                    className={`w-full pl-10 rounded-md border ${formErrors.vigencia_desde ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                    min={today}
                    max={formData.vigencia_hasta ? formData.vigencia_hasta.split('T')[0] : oneYearFromNow}
                  />
                </div>
                {formErrors.vigencia_desde && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.vigencia_desde}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Fecha desde la cual se pueden hacer reservas
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disponible hasta <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarCheck className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="vigencia_hasta"
                    value={formData.vigencia_hasta ? formData.vigencia_hasta.split('T')[0] : ''}
                    onChange={handleChange}
                    className={`w-full pl-10 rounded-md border ${formErrors.vigencia_hasta ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                    min={formData.vigencia_desde ? formData.vigencia_desde.split('T')[0] : today}
                    max={oneYearFromNow}
                  />
                </div>
                {formErrors.vigencia_hasta && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.vigencia_hasta}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Fecha hasta la cual este tour estará disponible
                </p>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Cupo Máximo <span className="text-red-500">*</span>
                  </label>
                  {isEmbarcacionManual && formData.id_embarcacion > 0 && (
                    <button 
                      type="button"
                      onClick={handleRestablecerCupo}
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      Restablecer según embarcación
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserFriends className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="cupo_maximo"
                    value={formData.cupo_maximo}
                    onChange={handleChange}
                    min={1}
                    className={`w-full pl-10 rounded-md border ${formErrors.cupo_maximo ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200 ${isEmbarcacionManual ? 'bg-yellow-50' : ''}`}
                  />
                </div>
                {formErrors.cupo_maximo && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.cupo_maximo}</p>
                )}
                {isEmbarcacionManual && (
                  <p className="mt-1 text-xs text-amber-600">
                    El cupo máximo ha sido modificado manualmente y difiere de la capacidad de la embarcación.
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="es_excepcion"
                    name="es_excepcion"
                    checked={formData.es_excepcion}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="es_excepcion" className="ml-2 block text-sm text-gray-700">
                    Marcar como excepción (fuera de programación regular)
                  </label>
                </div>
              </div>
              
              {formData.es_excepcion && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas de Excepción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="notas_excepcion"
                    value={formData.notas_excepcion}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full rounded-md border ${formErrors.notas_excepcion ? 'border-red-500' : 'border-gray-300'} py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200`}
                    placeholder="Explique por qué este tour es una excepción"
                  ></textarea>
                  {formErrors.notas_excepcion && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.notas_excepcion}</p>
                  )}
                </div>
              )}
              
              {isEditing && (
                <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-800">Información de reservas</h4>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Cupo máximo:</span>
                      <span className="ml-2 text-sm font-medium">{formData.cupo_maximo}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Cupo disponible:</span>
                      <span className="ml-2 text-sm font-medium">{formData.cupo_disponible}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Reservas actuales:</span>
                      <span className="ml-2 text-sm font-medium">{formData.cupo_maximo - formData.cupo_disponible}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Estado:</span>
                      <span className="ml-2 text-sm font-medium">
                        {currentTour?.estado || 'No disponible'}
                      </span>
                    </div>
                  </div>
                  {formData.cupo_maximo !== formData.cupo_disponible && (
                    <p className="mt-2 text-xs text-amber-600">
                      Nota: Este tour ya tiene reservas. Modificar el cupo máximo podría afectar a las reservas existentes.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
              >
                <FaTimes className="mr-2 -ml-1 h-4 w-4" />
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-200"
                disabled={isSubmitDisabled}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 -ml-1 relative">
                      <div className="absolute top-0 left-0 w-full h-full border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    {!isEditing && toursACrear > 1 ? `Creando ${toursACrear} tours...` : 'Guardando...'}
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 -ml-1 h-4 w-4" />
                    {isEditing ? 'Actualizar Tour' : (toursACrear > 1 ? `Crear ${toursACrear} Tours` : 'Crear Tour')}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TourProgramadoForm;*/