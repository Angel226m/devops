 /*
import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../store';
import { listarTiposPasajePorTipoTour } from '../../../store/slices/sliceTipoPasaje';
import { listarPaquetesPasajesPorTipoTour } from '../../../store/slices/slicePaquetePasajes';
import { listarInstanciasTourDisponibles, listarInstanciasTourPorFecha } from '../../../store/slices/sliceInstanciaTour';
import SelectorPasaje from './SelectorPasaje';

// Componente Cargador con animación mejorada
const Cargador = () => (
  <div className="flex justify-center items-center">
    <div className="relative">
      <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
      <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
    </div>
  </div>
);

// Componente para seleccionar la cantidad de un paquete (estilo peruano)
const SelectorPaquete = ({ 
  paquete, 
  cantidad, 
  setCantidad 
}: { 
  paquete: any; 
  cantidad: number; 
  setCantidad: (cantidad: number) => void;
}) => {
  return (
    <div className={`p-4 border rounded-lg transition-all duration-300 ${
      cantidad > 0 
        ? 'bg-gradient-to-br from-teal-50 to-white border-teal-400 shadow-md' 
        : 'bg-gradient-to-br from-cyan-50 to-white border-sky-200 hover:border-cyan-300 hover:shadow-sm'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-blue-800 text-lg">{paquete.nombre}</div>
          <div className="text-sm text-blue-600 mt-1">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
              {paquete.cantidad_total} pasajeros
            </span>
          </div>
        </div>
        <div className="font-bold text-teal-600 text-xl">S/ {paquete.precio_total.toFixed(2)}</div>
      </div>
      
      {paquete.descripcion && (
        <div className="text-sm mt-2 text-gray-600">{paquete.descripcion}</div>
      )}
      
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-blue-700">Cantidad:</span>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setCantidad(Math.max(0, cantidad - 1))}
            className="w-8 h-8 flex items-center justify-center bg-cyan-100 hover:bg-cyan-200 text-blue-700 rounded-l-md border border-cyan-300 transition-colors"
          >
            -
          </button>
          <span className="w-10 text-center py-1 border-t border-b border-cyan-300 bg-white text-blue-800 font-medium">
            {cantidad}
          </span>
          <button
            type="button"
            onClick={() => setCantidad(Math.min(10, cantidad + 1))}
            className="w-8 h-8 flex items-center justify-center bg-cyan-100 hover:bg-cyan-200 text-blue-700 rounded-r-md border border-cyan-300 transition-colors"
          >
            +
          </button>
        </div>
      </div>
      
      {cantidad > 0 && (
        <div className="mt-3 text-right">
          <span className="bg-teal-50 text-teal-700 font-medium px-2 py-1 rounded-md inline-block">
            Subtotal: S/ {(paquete.precio_total * cantidad).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

// Componente de alerta personalizada (estilo peruano)
const Alerta = ({ tipo, mensaje, onCerrar }: { tipo: string; mensaje: string; onCerrar?: () => void }) => {
  return (
    <div className={`mb-4 p-4 rounded-md shadow-sm ${
      tipo === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : 
      tipo === 'warning' ? 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500' : 
      tipo === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 
      'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
    }`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {tipo === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {tipo === 'warning' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {tipo === 'success' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {tipo === 'info' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
          <div>{mensaje}</div>
        </div>
        {onCerrar && (
          <button 
            type="button" 
            onClick={onCerrar}
            className="text-gray-500 hover:text-gray-700 ml-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Tipo para selección de pasajes
type SeleccionPasajes = Record<number, number>;

// Tipo para selección de paquetes
type SeleccionPaquetes = Record<number, number>;

interface FormularioReservacionProps {
  tour: {
    id: number;
    nombre: string;
    precio?: number;
    duracion: number;
    horarios: string[];
  };
}

const FormularioReservacion = ({ tour }: FormularioReservacionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [fecha, setFecha] = useState('');
  const [horario, setHorario] = useState('');
  const [seleccionPasajes, setSeleccionPasajes] = useState<SeleccionPasajes>({});
  const [seleccionPaquetes, setSeleccionPaquetes] = useState<SeleccionPaquetes>({});
  const [cargando, setCargando] = useState(false);
  const [instanciaSeleccionada, setInstanciaSeleccionada] = useState<number | null>(null);
  const [alerta, setAlerta] = useState<{mostrar: boolean, mensaje: string, tipo: string}>({
    mostrar: false,
    mensaje: '',
    tipo: 'info'
  });
  const [pasoActual, setPasoActual] = useState(1); // Para navegación por pasos
  
  // Referencias para rastrear el estado
  const seleccionInicializada = useRef(false);
  const tourAnteriorId = useRef<number | null>(null);
  const datosYaSolicitados = useRef(false);
  const instanciasDisponiblesCargadas = useRef(false);
  
  // Obtener datos de Redux
  const { tiposPasaje, cargando: cargandoTiposPasaje } = useSelector(
    (state: RootState) => state.tipoPasaje
  );
  
  const { paquetesPasajes, cargando: cargandoPaquetes } = useSelector(
    (state: RootState) => state.paquetePasajes
  );
  
  const { instanciasTour, cargando: cargandoInstancias } = useSelector(
    (state: RootState) => state.instanciaTour
  );
  
  // Verificar que tiposPasaje y paquetesPasajes sean arrays
  const tiposPasajeArray = Array.isArray(tiposPasaje) ? tiposPasaje : [];
  const paquetesPasajesArray = Array.isArray(paquetesPasajes) ? paquetesPasajes : [];
  const instanciasTourArray = Array.isArray(instanciasTour) ? instanciasTour : [];
  
  // Filtrar solo los elementos que corresponden al tour actual
  const tiposPasajeDelTour = tiposPasajeArray.filter(tp => tp.id_tipo_tour === tour.id);
  const paquetesPasajesDelTour = paquetesPasajesArray.filter(pp => pp.id_tipo_tour === tour.id);
  
  // Mostrar alerta
  const mostrarAlertaTemp = (mensaje: string, tipo: string = 'info') => {
    setAlerta({
      mostrar: true,
      mensaje,
      tipo
    });
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      setAlerta(prev => ({...prev, mostrar: false}));
    }, 5000);
  };
  
  // Filtrar instancias que corresponden al tour actual
  const instanciasDelTour = useMemo(() => {
    return instanciasTourArray.filter(inst => {
      // Para el tour con ID 43 (Avistamiento de Ballenas Jorobadas)
      if (tour.id === 43) {
        return inst.nombre_tipo_tour && inst.nombre_tipo_tour.includes("Ballenas");
      } 
      // Para otros tours
      else if (inst.nombre_tipo_tour) {
        return !inst.nombre_tipo_tour.includes("Ballenas");
      }
      return false;
    });
  }, [instanciasTourArray, tour.id]);
  
  // Cargar datos cuando el componente se monta o cuando cambia el ID del tour
  useEffect(() => {
    // Cargar solo una vez o cuando cambie el ID del tour
    if (tour.id && (!datosYaSolicitados.current || tourAnteriorId.current !== tour.id)) {
      console.log("Cargando tipos de pasaje y paquetes para el tour:", tour.id, "(primera vez)");
      
      // Cargar tipos de pasaje para este tour
      dispatch(listarTiposPasajePorTipoTour(tour.id));
      
      // Cargar paquetes de pasajes para este tour
      dispatch(listarPaquetesPasajesPorTipoTour(tour.id));
      
      // Marcar como ya solicitado y actualizar el ID del tour
      datosYaSolicitados.current = true;
      tourAnteriorId.current = tour.id;
      
      // Reiniciar la selección si cambia el tour
      if (seleccionInicializada.current) {
        seleccionInicializada.current = false;
        setSeleccionPasajes({});
        setSeleccionPaquetes({});
        setFecha('');
        setHorario('');
        setInstanciaSeleccionada(null);
        setPasoActual(1);
      }
    }
  }, [dispatch, tour.id]);
  
  // Cargar instancias disponibles al montar el componente
  useEffect(() => {
    if (!instanciasDisponiblesCargadas.current) {
      dispatch(listarInstanciasTourDisponibles());
      instanciasDisponiblesCargadas.current = true;
    }
  }, [dispatch]);
  
  // Inicializar la selección de pasajes cuando los datos estén disponibles
  useEffect(() => {
    // Solo inicializar si tenemos tipos de pasaje y no se ha inicializado aún
    if (tiposPasajeDelTour.length > 0 && !seleccionInicializada.current) {
      console.log("Inicializando selección de pasajes con:", tiposPasajeDelTour.length, "tipos");
      
      // Inicializar con 1 para el primer tipo (adulto generalmente) y 0 para el resto
      const seleccionInicial: SeleccionPasajes = {};
      tiposPasajeDelTour.forEach((tipo, index) => {
        seleccionInicial[tipo.id_tipo_pasaje] = index === 0 ? 1 : 0;
      });
      
      setSeleccionPasajes(seleccionInicial);
      
      // Inicializar todos los paquetes con cantidad 0
      const paquetesIniciales: SeleccionPaquetes = {};
      paquetesPasajesDelTour.forEach(paquete => {
        paquetesIniciales[paquete.id_paquete] = 0;
      });
      setSeleccionPaquetes(paquetesIniciales);
      
      seleccionInicializada.current = true;
    }
  }, [tiposPasajeDelTour, paquetesPasajesDelTour]);
  
  // Cargar instancias por fecha cuando cambia la fecha seleccionada
  useEffect(() => {
    if (fecha) {
      dispatch(listarInstanciasTourPorFecha(fecha));
    }
  }, [dispatch, fecha]);
  
  // Filtrar por fecha cuando se selecciona una fecha
  const instanciasPorFechaSeleccionada = useMemo(() => {
    if (!fecha) return [];
    
    return instanciasDelTour.filter(inst => {
      // Convertir ambas fechas a formato YYYY-MM-DD para comparar
      const fechaInstancia = inst.fecha_especifica.split('T')[0];
      const fechaSeleccionada = fecha.split('T')[0]; // Ya está en formato YYYY-MM-DD
      
      return fechaInstancia === fechaSeleccionada;
    });
  }, [instanciasDelTour, fecha]);
  
  // Determinar fechas disponibles (fechas con instancias programadas)
  const fechasDisponibles = useMemo(() => {
    return [...new Set(instanciasDelTour.map(inst => inst.fecha_especifica.split('T')[0]))];
  }, [instanciasDelTour]);
  
  // Preparar opciones de horario para la fecha seleccionada
  const opcionesHorario = useMemo(() => {
    return instanciasPorFechaSeleccionada.map(inst => ({
      id: inst.id_instancia,
      horaInicio: inst.hora_inicio_str || "",
      horaFin: inst.hora_fin_str || "",
      texto: `${inst.hora_inicio_str || ""} - ${inst.hora_fin_str || ""}`,
      cupoDisponible: inst.cupo_disponible
    }));
  }, [instanciasPorFechaSeleccionada]);
  
  // Calcular fecha mínima (24 horas después de la hora actual)
  const fechaMinima = useMemo(() => {
    const ahora = new Date();
    
    // Si es antes de las 00:00, la fecha mínima es mañana
    // Si es después de las 00:00, permitimos reservar para pasado mañana
    if (ahora.getHours() >= 0) {
      const manana = new Date(ahora);
      manana.setDate(ahora.getDate() + 1);
      return manana.toISOString().split('T')[0];
    } else {
      const pasadoManana = new Date(ahora);
      pasadoManana.setDate(ahora.getDate() + 2);
      return pasadoManana.toISOString().split('T')[0];
    }
  }, []);
  
  // Fecha máxima (3 meses adelante)
  const fechaMaxima = useMemo(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 3); // Añadir 3 meses
    return fecha.toISOString().split('T')[0];
  }, []);
  
  // Manejar cambio de fecha
  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = e.target.value;
    
    // Verificar que la fecha cumple con el requisito de 24 horas
    const fechaSeleccionada = new Date(nuevaFecha);
    const ahora = new Date();
    
    // Establecer ambas fechas a medianoche para comparar solo días
    const fechaSeleccionadaMedanoche = new Date(fechaSeleccionada);
    fechaSeleccionadaMedanoche.setHours(0, 0, 0, 0);
    
    const ahoraMedanoche = new Date(ahora);
    ahoraMedanoche.setHours(0, 0, 0, 0);
    
    // Calcular diferencia en días
    const diferenciaDias = Math.floor(
      (fechaSeleccionadaMedanoche.getTime() - ahoraMedanoche.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Permitir reservar si la fecha es mañana o después
    if (diferenciaDias < 1) {
      mostrarAlertaTemp("Las reservas deben hacerse con al menos 24 horas de anticipación.", "warning");
      return;
    }
    
    setFecha(nuevaFecha);
    setHorario(''); // Resetear el horario cuando cambia la fecha
    setInstanciaSeleccionada(null);
  };
  
  // Manejar cambio de horario
  const handleHorarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoHorario = e.target.value;
    setHorario(nuevoHorario);
    
    // Encontrar la instancia correspondiente al horario seleccionado
    const idInstancia = e.target.options[e.target.selectedIndex].getAttribute('data-instancia-id');
    setInstanciaSeleccionada(idInstancia ? parseInt(idInstancia) : null);
    
    // Si el horario es válido, avanzar al siguiente paso
    if (nuevoHorario && idInstancia) {
      setPasoActual(2);
    }
  };
  
  // Manejar cambio en la cantidad de un tipo de pasaje
  const handleCantidadPasajeChange = (idTipoPasaje: number, cantidad: number) => {
    setSeleccionPasajes(prev => ({
      ...prev,
      [idTipoPasaje]: cantidad
    }));
  };
  
  // Manejar cambio en la cantidad de un paquete
  const handleCantidadPaqueteChange = (idPaquete: number, cantidad: number) => {
    setSeleccionPaquetes(prev => ({
      ...prev,
      [idPaquete]: cantidad
    }));
  };
  
  // Calcular total de pasajeros (combinando paquetes y pasajes individuales)
  const calcularTotalPasajeros = () => {
    // Calcular pasajeros de pasajes individuales
    const pasajerosIndividuales = Object.values(seleccionPasajes).reduce((total, cantidad) => 
      total + cantidad, 0);
      
    // Calcular pasajeros de paquetes
    const pasajerosPaquetes = Object.entries(seleccionPaquetes).reduce((total, [idPaquete, cantidad]) => {
      const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === Number(idPaquete));
      return total + (paquete ? paquete.cantidad_total * cantidad : 0);
    }, 0);
    
    return pasajerosIndividuales + pasajerosPaquetes;
  };
  
  // Calcular total basado en pasajes seleccionados y paquetes
  const calcularTotal = () => {
    // Calcular total de pasajes individuales
    const totalPasajesIndividuales = Object.entries(seleccionPasajes).reduce((total, [idTipoPasaje, cantidad]) => {
      const tipoPasaje = tiposPasajeDelTour.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
      return total + (tipoPasaje ? tipoPasaje.costo * cantidad : 0);
    }, 0);
    
    // Calcular total de paquetes
    const totalPaquetes = Object.entries(seleccionPaquetes).reduce((total, [idPaquete, cantidad]) => {
      const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === Number(idPaquete));
      return total + (paquete ? paquete.precio_total * cantidad : 0);
    }, 0);
    
    return totalPasajesIndividuales + totalPaquetes;
  };
  
  // Verificar cupo disponible
  const verificarCupoDisponible = () => {
    const totalPasajeros = calcularTotalPasajeros();
    
    // Encontrar la instancia seleccionada
    const instancia = instanciasPorFechaSeleccionada.find(inst => inst.id_instancia === instanciaSeleccionada);
    
    if (instancia && totalPasajeros > instancia.cupo_disponible) {
      mostrarAlertaTemp(`No hay suficiente cupo. Disponible: ${instancia.cupo_disponible}, Solicitado: ${totalPasajeros}`, 'error');
      return false;
    }
    
    return true;
  };
  
  // Verificar si hay alguna selección (paquetes o pasajes individuales)
  const haySeleccion = Object.values(seleccionPasajes).some(cantidad => cantidad > 0) || 
                       Object.values(seleccionPaquetes).some(cantidad => cantidad > 0);
  
  // Ir a la página de confirmación y pago
  const irAPago = () => {
    // Verificar que haya selección
    if (!haySeleccion) {
      mostrarAlertaTemp('Por favor seleccione al menos un pasaje o paquete', 'warning');
      return;
    }
    
    // Verificar cupo disponible
    if (!verificarCupoDisponible()) {
      return;
    }
    
    // Guardar información de la reserva en sessionStorage
    const datosReserva = {
      tourId: tour.id,
      tourNombre: tour.nombre,
      fecha,
      horario,
      instanciaId: instanciaSeleccionada,
      seleccionPasajes,
      seleccionPaquetes,
      totalPasajeros: calcularTotalPasajeros(),
      total: calcularTotal()
    };
    
    sessionStorage.setItem('datosReservaPendiente', JSON.stringify(datosReserva));
    
    // Redirigir a la página de pago
    navigate('/proceso-pago', {
      state: datosReserva
    });
  };
  
  // Formatear la fecha para mostrar en formato peruano
  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-PE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Mostrar cargador mientras se cargan los datos
  if ((cargandoTiposPasaje || cargandoPaquetes) && !seleccionInicializada.current) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-cyan-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-5 text-white">
          <h3 className="text-xl font-bold">{t('tour.cargandoReserva')}</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center h-64">
            <Cargador />
            <p className="mt-4 text-blue-600">{t('general.cargando')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Contenido principal del formulario
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-cyan-200 overflow-hidden">
      {/* Encabezado *//*}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-5 text-white">
        <h3 className="text-xl font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t('tour.reservarAhora')}
        </h3>
        
        {tiposPasajeDelTour.length > 0 && (
          <div className="flex items-center mt-2">
            <span className="text-2xl font-bold">S/ {tiposPasajeDelTour[0].costo.toFixed(2)}</span>
            <span className="text-sm opacity-90 ml-1">/ {t('tour.porPersona')}</span>
          </div>
        )}
      </div>
      
      {/* Pasos de la reserva *//*}
      <div className="bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 border-b border-cyan-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className={`flex flex-col items-center ${pasoActual >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 ${
                pasoActual >= 1 ? 'bg-blue-100 text-blue-600 border-2 border-blue-500' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="text-sm font-medium">1</span>
              </div>
              <span className="text-xs">Fecha y hora</span>
            </div>
            
            <div className={`flex-1 h-0.5 mx-2 ${pasoActual >= 2 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
            
            <div className={`flex flex-col items-center ${pasoActual >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 ${
                pasoActual >= 2 ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="text-sm font-medium">2</span>
              </div>
              <span className="text-xs">Pasajeros</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cuerpo del formulario *//*}
      <div className="p-6 bg-gradient-to-b from-white to-sky-50">
        {/* Alerta personalizada *//*}
        {alerta.mostrar && (
          <Alerta 
            tipo={alerta.tipo} 
            mensaje={alerta.mensaje} 
            onCerrar={() => setAlerta(prev => ({...prev, mostrar: false}))} 
          />
        )}
        
        {/* Aviso de 24 horas *//*}
        <div className="mb-5 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 text-blue-800 text-sm flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <span className="font-medium">Importante:</span> Las reservas deben realizarse con al menos 24 horas de anticipación. Se requiere el pago completo al momento de reservar.
          </div>
        </div>
        
        <div className="space-y-6">
          {/* PASO 1: Selección de fecha y hora *//*}
          {pasoActual === 1 && (
            <div className="space-y-6 animate__animated animate__fadeIn">
              <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Selecciona fecha y horario</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('tour.fecha')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    min={fechaMinima}
                    max={fechaMaxima}
                    value={fecha}
                    onChange={handleFechaChange}
                    required
                    className="w-full px-4 py-2.5 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-colors"
                  />
                  
                  {/* Mensaje de ayuda para fechas disponibles *//*}
                  {cargandoInstancias ? (
                    <p className="text-xs text-blue-500 mt-1">
                      {t('tour.cargandoFechas')}
                    </p>
                  ) : fechasDisponibles.length > 0 ? (
                    <p className="text-xs text-blue-500 mt-1">
                      {t('tour.hayFechasDisponibles')}: {fechasDisponibles.slice(0, 3).join(', ')}
                      {fechasDisponibles.length > 3 ? ` y ${fechasDisponibles.length - 3} más` : ''}
                    </p>
                  ) : (
                    <p className="text-xs text-amber-500 mt-1">
                      {t('tour.sinFechasDisponibles')}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="horario" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('tour.horario')} <span className="text-red-500">*</span>
                  </label>
                  
                  {fecha ? (
                    opcionesHorario.length > 0 ? (
                      <select
                        id="horario"
                        value={horario}
                        onChange={handleHorarioChange}
                        required
                        className="w-full px-4 py-2.5 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-colors"
                      >
                        <option value="">{t('tour.seleccionarHorario')}</option>
                        {opcionesHorario.map((opcion) => (
                          <option
                            key={opcion.id}
                            value={opcion.texto}
                            data-instancia-id={opcion.id}
                            disabled={opcion.cupoDisponible <= 0}
                          >
                            {opcion.texto} {opcion.cupoDisponible <= 0 ? 
                              `(${t('tour.sinCupo')})` : 
                              `(${t('tour.disponible')}: ${opcion.cupoDisponible})`
                            }
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="bg-amber-50 p-3 rounded-lg text-amber-800 text-sm border border-amber-200">
                        {t('tour.sinHorariosDisponiblesParaFecha')}
                      </div>
                    )
                  ) : (
                    <select
                      id="horario"
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm"
                    >
                      <option value="">{t('tour.seleccionePrimeroFecha')}</option>
                    </select>
                  )}
                </div>
              </div>
              
              {/* Botón para continuar *//*}
              {fecha && horario && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setPasoActual(2)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow flex items-center"
                  >
                    Continuar
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Mostrar fecha y hora seleccionadas *//*}
              {fecha && horario && (
                <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-800 mb-1">Selección actual:</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-blue-600">Fecha:</span>
                      <span className="ml-2 text-blue-800">{formatearFecha(fecha)}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Horario:</span>
                      <span className="ml-2 text-blue-800">{horario}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* PASO 2: Selección de pasajeros *//*}
          {pasoActual === 2 && (
            <div className="space-y-6 animate__animated animate__fadeIn">
              <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Selecciona tus pasajes</h4>
              
              {/* Paquetes de pasajes *//*}
              {paquetesPasajesDelTour.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center mb-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full flex items-center justify-center mr-2 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-800">
                      {t('tour.paquetesPromocion')}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paquetesPasajesDelTour.map((paquete) => (
                      <SelectorPaquete
                        key={paquete.id_paquete}
                        paquete={paquete}
                        cantidad={seleccionPaquetes[paquete.id_paquete] || 0}
                        setCantidad={(cantidad) => handleCantidadPaqueteChange(paquete.id_paquete, cantidad)}
                      />
                    ))}
                  </div>
                  
                  <div className="text-center text-sm text-blue-600 my-3">
                    <span className="inline-block px-3 py-1 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full border border-blue-200">
                      {t('tour.combinar')}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Selector de pasajes individuales *//*}
              <div className="space-y-4">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center mr-2 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-800">
                    {t('tour.pasajesIndividuales')}
                  </h4>
                </div>
                
                {tiposPasajeDelTour.length > 0 ? (
                  <div className="space-y-3">
                    {tiposPasajeDelTour.map((tipoPasaje) => (
                      <SelectorPasaje
                        key={tipoPasaje.id_tipo_pasaje}
                        tipo={tipoPasaje.nombre}
                        precio={tipoPasaje.costo}
                        cantidad={seleccionPasajes[tipoPasaje.id_tipo_pasaje] || 0}
                        setCantidad={(cantidad) => handleCantidadPasajeChange(tipoPasaje.id_tipo_pasaje, cantidad)}
                        min={0}
                        max={20}
                        edad={tipoPasaje.edad || undefined}
                        colorScheme="blue"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-700 border border-blue-200">
                    {t('tour.noHayTiposPasajeDisponibles')}
                  </div>
                )}
              </div>
              
              {/* Total seleccionado *//*}
              <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 mt-4 shadow-sm">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total pasajeros:</span>
                  <span className="text-blue-700">{calcularTotalPasajeros()}</span>
                </div>
                <div className="flex justify-between font-bold mt-1 pt-1 border-t border-cyan-200">
                  <span>Total a pagar:</span>
                  <span className="text-teal-600">S/ {calcularTotal().toFixed(2)}</span>
                </div>
              </div>
              
              {/* Botones de navegación *//*}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setPasoActual(1)}
                  className="px-4 py-2 border border-cyan-300 text-blue-700 font-medium rounded-lg transition-colors hover:bg-cyan-50 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Volver
                </button>
                
                <button
                  type="button"
                  onClick={irAPago}
                  disabled={!haySeleccion || cargando}
                  className={`px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md flex items-center ${
                    !haySeleccion || cargando ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {cargando ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      Continuar a pago
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              
              {/* Información de métodos de pago con logos actualizados *//*}
              <div className="mt-6 pt-4 border-t border-cyan-200">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-cyan-600 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7H4C2.9 7 2 7.9 2 9V15C2 16.1 2.9 17 4 17H20C21.1 17 22 16.1 22 15V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
                    <path d="M16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13Z" fill="currentColor"/>
                    <path d="M8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z" fill="currentColor"/>
                  </svg>
                  <h5 className="font-medium text-gray-700">Pago seguro con Mercado Pago</h5>
                </div>
                
                <div className="bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 p-4 rounded-lg border border-cyan-200 mt-2">
                  <p className="text-sm text-gray-600 mb-3">Elige entre múltiples métodos de pago seguros:</p>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                      <img src="https://woocommerce.com/wp-content/uploads/2021/05/tw-mercado-pago-v2@2x.png" alt="Mercado Pago" className="h-8" />
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                      <img src="https://images.freeimages.com/vme/images/7/1/715862/visa_logo_preview.jpg?h=350" alt="Visa" className="h-7" />
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                      <img src="https://images.freeimages.com/vme/images/9/9/99813/mastercard_logo_preview.jpg?h=350" alt="Mastercard" className="h-7" />
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                      <img src="https://logosenvector.com/logo/img/yape-bcp-4390.jpg" alt="Yape" className="h-7" />
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                      <img src="https://images.seeklogo.com/logo-png/38/1/plin-logo-png_seeklogo-386806.png" alt="Plin" className="h-7" />
                    </div>
                  </div>
                  
                  <p className="text-xs text-teal-700 mt-3 italic text-center">
                    Todos los pagos son procesados con cifrado de extremo a extremo para tu seguridad
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Notas importantes *//*}
        <div className="mt-5 text-xs text-gray-500 space-y-1 bg-white/70 p-3 rounded-lg border border-gray-200">
          <p>• El pago se realiza por el monto total de la reserva.</p>
          <p>• Las reservas requieren un mínimo de 24 horas de anticipación.</p>
          <p>• Los precios están expresados en Soles Peruanos (S/).</p>
          <p>• Recibirás un correo de confirmación con los detalles de tu reserva.</p>
        </div>
      </div>
      
      {/* Footer con información de contacto *//*}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-t border-cyan-200 text-xs text-gray-600 flex flex-wrap justify-between">
        <div>
          <span className="font-medium text-blue-700">Atención:</span> +51 987 654 321
        </div>
        <div>
          <span className="font-medium text-blue-700">Email:</span> reservas@tours-peru.com
        </div>
        <div>
          <span className="font-medium text-blue-700">Horario:</span> Lun-Vie 9am-6pm
        </div>
      </div>
    </div>
  );
};

export default FormularioReservacion;*/

 
import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../store';
import { listarTiposPasajePorTipoTour } from '../../../store/slices/sliceTipoPasaje';
import { listarPaquetesPasajesPorTipoTour } from '../../../store/slices/slicePaquetePasajes';
import { listarInstanciasTourDisponibles, listarInstanciasTourPorFecha } from '../../../store/slices/sliceInstanciaTour';
import SelectorPasaje from './SelectorPasaje';

// Componente Cargador con animación mejorada
const Cargador = () => (
  <div className="flex justify-center items-center">
    <div className="relative">
      <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
      <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
    </div>
  </div>
);

// Componente para seleccionar la cantidad de un paquete (estilo peruano)
const SelectorPaquete = ({ 
  paquete, 
  cantidad, 
  setCantidad 
}: { 
  paquete: any; 
  cantidad: number; 
  setCantidad: (cantidad: number) => void;
}) => {
  return (
    <div className={`p-4 border rounded-lg transition-all duration-300 ${
      cantidad > 0 
        ? 'bg-gradient-to-br from-teal-50 to-white border-teal-400 shadow-md' 
        : 'bg-gradient-to-br from-cyan-50 to-white border-sky-200 hover:border-cyan-300 hover:shadow-sm'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-blue-800 text-lg">{paquete.nombre}</div>
          <div className="text-sm text-blue-600 mt-1">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
              {paquete.cantidad_total} pasajeros
            </span>
          </div>
        </div>
        <div className="font-bold text-teal-600 text-xl">S/ {paquete.precio_total.toFixed(2)}</div>
      </div>
      
      {paquete.descripcion && (
        <div className="text-sm mt-2 text-gray-600">{paquete.descripcion}</div>
      )}
      
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-blue-700">Cantidad:</span>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setCantidad(Math.max(0, cantidad - 1))}
            className="w-8 h-8 flex items-center justify-center bg-cyan-100 hover:bg-cyan-200 text-blue-700 rounded-l-md border border-cyan-300 transition-colors"
          >
            -
          </button>
          <span className="w-10 text-center py-1 border-t border-b border-cyan-300 bg-white text-blue-800 font-medium">
            {cantidad}
          </span>
          <button
            type="button"
            onClick={() => setCantidad(Math.min(10, cantidad + 1))}
            className="w-8 h-8 flex items-center justify-center bg-cyan-100 hover:bg-cyan-200 text-blue-700 rounded-r-md border border-cyan-300 transition-colors"
          >
            +
          </button>
        </div>
      </div>
      
      {cantidad > 0 && (
        <div className="mt-3 text-right">
          <span className="bg-teal-50 text-teal-700 font-medium px-2 py-1 rounded-md inline-block">
            Subtotal: S/ {(paquete.precio_total * cantidad).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

// Componente para seleccionar horario (nuevo componente)
const SelectorHorario = ({ 
  horario, 
  seleccionado, 
  cupoDisponible, 
  onClick 
}: { 
  horario: { id: number; texto: string; horaInicio: string; horaFin: string; }; 
  seleccionado: boolean; 
  cupoDisponible: number;
  onClick: () => void;
}) => {
  const sinCupo = cupoDisponible <= 0;
  
  return (
    <div
      onClick={!sinCupo ? onClick : undefined}
      className={`p-3 border rounded-lg transition-all duration-200 mb-2 cursor-pointer ${
        sinCupo 
          ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed' 
          : seleccionado 
            ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-400 shadow-sm'
            : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${
            seleccionado ? 'bg-blue-500 ring-2 ring-blue-200' : 'border-2 border-gray-300'
          }`}></div>
          <span className={`font-medium ${seleccionado ? 'text-blue-700' : 'text-gray-700'}`}>
            {horario.texto}
          </span>
        </div>
        
        <div className={`text-sm ${sinCupo ? 'text-red-500' : seleccionado ? 'text-teal-600' : 'text-blue-600'}`}>
          {sinCupo ? 'Sin cupo' : `${cupoDisponible} disponibles`}
        </div>
      </div>
    </div>
  );
};

// Componente de alerta personalizada (estilo peruano)
const Alerta = ({ tipo, mensaje, onCerrar }: { tipo: string; mensaje: string; onCerrar?: () => void }) => {
  return (
    <div className={`mb-4 p-4 rounded-md shadow-sm ${
      tipo === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : 
      tipo === 'warning' ? 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500' : 
      tipo === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 
      'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
    }`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {tipo === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {tipo === 'warning' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {tipo === 'success' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {tipo === 'info' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
          <div>{mensaje}</div>
        </div>
        {onCerrar && (
          <button 
            type="button" 
            onClick={onCerrar}
            className="text-gray-500 hover:text-gray-700 ml-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Tipo para selección de pasajes
type SeleccionPasajes = Record<number, number>;

// Tipo para selección de paquetes
type SeleccionPaquetes = Record<number, number>;

// Tipo para las opciones de horario
type OpcionHorario = {
  id: number;
  horaInicio: string;
  horaFin: string;
  texto: string;
  cupoDisponible: number;
};

interface FormularioReservacionProps {
  tour: {
    id: number;
    nombre: string;
    precio?: number;
    duracion: number;
    horarios: string[];
  };
}

const FormularioReservacion = ({ tour }: FormularioReservacionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [fecha, setFecha] = useState('');
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<OpcionHorario | null>(null);
  const [seleccionPasajes, setSeleccionPasajes] = useState<SeleccionPasajes>({});
  const [seleccionPaquetes, setSeleccionPaquetes] = useState<SeleccionPaquetes>({});
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState<{mostrar: boolean, mensaje: string, tipo: string}>({
    mostrar: false,
    mensaje: '',
    tipo: 'info'
  });
  const [pasoActual, setPasoActual] = useState(1); // Para navegación por pasos
  
  // Referencias para rastrear el estado
  const seleccionInicializada = useRef(false);
  const tourAnteriorId = useRef<number | null>(null);
  const datosYaSolicitados = useRef(false);
  const instanciasDisponiblesCargadas = useRef(false);
  
  // Obtener datos de Redux
  const { tiposPasaje, cargando: cargandoTiposPasaje } = useSelector(
    (state: RootState) => state.tipoPasaje
  );
  
  const { paquetesPasajes, cargando: cargandoPaquetes } = useSelector(
    (state: RootState) => state.paquetePasajes
  );
  
  const { instanciasTour, cargando: cargandoInstancias } = useSelector(
    (state: RootState) => state.instanciaTour
  );
  
  // Verificar que tiposPasaje y paquetesPasajes sean arrays
  const tiposPasajeArray = Array.isArray(tiposPasaje) ? tiposPasaje : [];
  const paquetesPasajesArray = Array.isArray(paquetesPasajes) ? paquetesPasajes : [];
  const instanciasTourArray = Array.isArray(instanciasTour) ? instanciasTour : [];
  
  // Filtrar solo los elementos que corresponden al tour actual
  const tiposPasajeDelTour = tiposPasajeArray.filter(tp => tp.id_tipo_tour === tour.id);
  const paquetesPasajesDelTour = paquetesPasajesArray.filter(pp => pp.id_tipo_tour === tour.id);
  
  // Mostrar alerta
  const mostrarAlertaTemp = (mensaje: string, tipo: string = 'info') => {
    setAlerta({
      mostrar: true,
      mensaje,
      tipo
    });
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      setAlerta(prev => ({...prev, mostrar: false}));
    }, 5000);
  };
  
  // Filtrar instancias que corresponden al tour actual
  const instanciasDelTour = useMemo(() => {
    return instanciasTourArray.filter(inst => {
      // Para el tour con ID 43 (Avistamiento de Ballenas Jorobadas)
      if (tour.id === 43) {
        return inst.nombre_tipo_tour && inst.nombre_tipo_tour.includes("Ballenas");
      } 
      // Para otros tours
      else if (inst.nombre_tipo_tour) {
        return !inst.nombre_tipo_tour.includes("Ballenas");
      }
      return false;
    });
  }, [instanciasTourArray, tour.id]);
  
  // Cargar datos cuando el componente se monta o cuando cambia el ID del tour
  useEffect(() => {
    // Cargar solo una vez o cuando cambie el ID del tour
    if (tour.id && (!datosYaSolicitados.current || tourAnteriorId.current !== tour.id)) {
      console.log("Cargando tipos de pasaje y paquetes para el tour:", tour.id, "(primera vez)");
      
      // Cargar tipos de pasaje para este tour
      dispatch(listarTiposPasajePorTipoTour(tour.id));
      
      // Cargar paquetes de pasajes para este tour
      dispatch(listarPaquetesPasajesPorTipoTour(tour.id));
      
      // Marcar como ya solicitado y actualizar el ID del tour
      datosYaSolicitados.current = true;
      tourAnteriorId.current = tour.id;
      
      // Reiniciar la selección si cambia el tour
      if (seleccionInicializada.current) {
        seleccionInicializada.current = false;
        setSeleccionPasajes({});
        setSeleccionPaquetes({});
        setFecha('');
        setHorarioSeleccionado(null);
        setPasoActual(1);
      }
    }
  }, [dispatch, tour.id]);
  
  // Cargar instancias disponibles al montar el componente
  useEffect(() => {
    if (!instanciasDisponiblesCargadas.current) {
      dispatch(listarInstanciasTourDisponibles());
      instanciasDisponiblesCargadas.current = true;
    }
  }, [dispatch]);
  
  // Inicializar la selección de pasajes cuando los datos estén disponibles
  useEffect(() => {
    // Solo inicializar si tenemos tipos de pasaje y no se ha inicializado aún
    if (tiposPasajeDelTour.length > 0 && !seleccionInicializada.current) {
      console.log("Inicializando selección de pasajes con:", tiposPasajeDelTour.length, "tipos");
      
      // Inicializar con 1 para el primer tipo (adulto generalmente) y 0 para el resto
      const seleccionInicial: SeleccionPasajes = {};
      tiposPasajeDelTour.forEach((tipo, index) => {
        seleccionInicial[tipo.id_tipo_pasaje] = index === 0 ? 1 : 0;
      });
      
      setSeleccionPasajes(seleccionInicial);
      
      // Inicializar todos los paquetes con cantidad 0
      const paquetesIniciales: SeleccionPaquetes = {};
      paquetesPasajesDelTour.forEach(paquete => {
        paquetesIniciales[paquete.id_paquete] = 0;
      });
      setSeleccionPaquetes(paquetesIniciales);
      
      seleccionInicializada.current = true;
    }
  }, [tiposPasajeDelTour, paquetesPasajesDelTour]);
  
  // Cargar instancias por fecha cuando cambia la fecha seleccionada
  useEffect(() => {
    if (fecha) {
      dispatch(listarInstanciasTourPorFecha(fecha));
    }
  }, [dispatch, fecha]);
  
  // Filtrar por fecha cuando se selecciona una fecha
  const instanciasPorFechaSeleccionada = useMemo(() => {
    if (!fecha) return [];
    
    return instanciasDelTour.filter(inst => {
      // Convertir ambas fechas a formato YYYY-MM-DD para comparar
      const fechaInstancia = inst.fecha_especifica.split('T')[0];
      const fechaSeleccionada = fecha.split('T')[0]; // Ya está en formato YYYY-MM-DD
      
      return fechaInstancia === fechaSeleccionada;
    });
  }, [instanciasDelTour, fecha]);
  
  // Agrupar y ordenar horarios por hora de inicio
  const horariosDisponibles = useMemo(() => {
    if (!instanciasPorFechaSeleccionada.length) return [];
    
    // Crear objetos de horario bien formados y ordenarlos por hora de inicio
    const horarios = instanciasPorFechaSeleccionada.map(inst => ({
      id: inst.id_instancia,
      horaInicio: inst.hora_inicio_str || "",
      horaFin: inst.hora_fin_str || "",
      texto: `${inst.hora_inicio_str || ""} - ${inst.hora_fin_str || ""}`,
      cupoDisponible: inst.cupo_disponible
    }));
    
    // Ordenar por hora de inicio
    return horarios.sort((a, b) => {
      // Convertir a hora militar para comparar correctamente
      const horaA = a.horaInicio.split(':').map(Number);
      const horaB = b.horaInicio.split(':').map(Number);
      
      // Comparar horas
      if (horaA[0] !== horaB[0]) {
        return horaA[0] - horaB[0];
      }
      
      // Si las horas son iguales, comparar minutos
      return horaA[1] - horaB[1];
    });
  }, [instanciasPorFechaSeleccionada]);
  
  // Determinar fechas disponibles (fechas con instancias programadas)
  const fechasDisponibles = useMemo(() => {
    // Obtener todas las fechas únicas
    const fechasUnicas = [...new Set(instanciasDelTour.map(inst => inst.fecha_especifica.split('T')[0]))];
    
    // Filtrar solo fechas futuras (a partir de mañana)
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    manana.setHours(0, 0, 0, 0);
    
    return fechasUnicas
      .filter(fechaStr => {
        const fecha = new Date(fechaStr);
        return fecha >= manana;
      })
      .sort(); // Ordenar cronológicamente
  }, [instanciasDelTour]);
  
  // Calcular fecha mínima (mañana)
  const fechaMinima = useMemo(() => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana.toISOString().split('T')[0];
  }, []);
  
  // Fecha máxima (3 meses adelante)
  const fechaMaxima = useMemo(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 3); // Añadir 3 meses
    return fecha.toISOString().split('T')[0];
  }, []);
  
  // Manejar cambio de fecha
  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = e.target.value;
    
    // Verificar que la fecha es futura
    const fechaSeleccionada = new Date(nuevaFecha);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // La reserva debe ser para mañana o después
    if (fechaSeleccionada <= hoy) {
      mostrarAlertaTemp("Las reservas deben hacerse para mañana o días posteriores.", "warning");
      return;
    }
    
    setFecha(nuevaFecha);
    setHorarioSeleccionado(null); // Resetear el horario cuando cambia la fecha
  };
  
  // Manejar selección de horario
  const handleHorarioSelect = (horario: OpcionHorario) => {
    setHorarioSeleccionado(horario);
    
    // Si se seleccionó un horario válido, avanzar al siguiente paso
    if (horario) {
      setPasoActual(2);
    }
  };
  
  // Manejar cambio en la cantidad de un tipo de pasaje
  const handleCantidadPasajeChange = (idTipoPasaje: number, cantidad: number) => {
    setSeleccionPasajes(prev => ({
      ...prev,
      [idTipoPasaje]: cantidad
    }));
  };
  
  // Manejar cambio en la cantidad de un paquete
  const handleCantidadPaqueteChange = (idPaquete: number, cantidad: number) => {
    setSeleccionPaquetes(prev => ({
      ...prev,
      [idPaquete]: cantidad
    }));
  };
  
  // Calcular total de pasajeros (combinando paquetes y pasajes individuales)
  const calcularTotalPasajeros = () => {
    // Calcular pasajeros de pasajes individuales
    const pasajerosIndividuales = Object.values(seleccionPasajes).reduce((total, cantidad) => 
      total + cantidad, 0);
      
    // Calcular pasajeros de paquetes
    const pasajerosPaquetes = Object.entries(seleccionPaquetes).reduce((total, [idPaquete, cantidad]) => {
      const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === Number(idPaquete));
      return total + (paquete ? paquete.cantidad_total * cantidad : 0);
    }, 0);
    
    return pasajerosIndividuales + pasajerosPaquetes;
  };
  
  // Calcular total basado en pasajes seleccionados y paquetes
  const calcularTotal = () => {
    // Calcular total de pasajes individuales
    const totalPasajesIndividuales = Object.entries(seleccionPasajes).reduce((total, [idTipoPasaje, cantidad]) => {
      const tipoPasaje = tiposPasajeDelTour.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
      return total + (tipoPasaje ? tipoPasaje.costo * cantidad : 0);
    }, 0);
    
    // Calcular total de paquetes
    const totalPaquetes = Object.entries(seleccionPaquetes).reduce((total, [idPaquete, cantidad]) => {
      const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === Number(idPaquete));
      return total + (paquete ? paquete.precio_total * cantidad : 0);
    }, 0);
    
    return totalPasajesIndividuales + totalPaquetes;
  };
  
  // Verificar cupo disponible
  const verificarCupoDisponible = () => {
    const totalPasajeros = calcularTotalPasajeros();
    
    if (!horarioSeleccionado) {
      mostrarAlertaTemp("Por favor seleccione un horario válido", 'error');
      return false;
    }
    
    if (totalPasajeros > horarioSeleccionado.cupoDisponible) {
      mostrarAlertaTemp(`No hay suficiente cupo. Disponible: ${horarioSeleccionado.cupoDisponible}, Solicitado: ${totalPasajeros}`, 'error');
      return false;
    }
    
    return true;
  };
  
  // Verificar si hay alguna selección (paquetes o pasajes individuales)
  const haySeleccion = Object.values(seleccionPasajes).some(cantidad => cantidad > 0) || 
                       Object.values(seleccionPaquetes).some(cantidad => cantidad > 0);
  
  // Ir a la página de confirmación y pago
  const irAPago = () => {
    // Verificar que haya selección
    if (!haySeleccion) {
      mostrarAlertaTemp('Por favor seleccione al menos un pasaje o paquete', 'warning');
      return;
    }
    
    // Verificar cupo disponible
    if (!verificarCupoDisponible()) {
      return;
    }
    
    // Guardar información de la reserva en sessionStorage
    const datosReserva = {
      tourId: tour.id,
      tourNombre: tour.nombre,
      fecha,
      horario: horarioSeleccionado?.texto || "",
      instanciaId: horarioSeleccionado?.id,
      seleccionPasajes,
      seleccionPaquetes,
      totalPasajeros: calcularTotalPasajeros(),
      total: calcularTotal()
    };
    
    sessionStorage.setItem('datosReservaPendiente', JSON.stringify(datosReserva));
    
    // Redirigir a la página de pago
    navigate('/proceso-pago', {
      state: datosReserva
    });
  };
  
  // Formatear la fecha para mostrar en formato peruano
  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-PE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Mostrar cargador mientras se cargan los datos
  if ((cargandoTiposPasaje || cargandoPaquetes) && !seleccionInicializada.current) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-cyan-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-5 text-white">
          <h3 className="text-xl font-bold">{t('tour.cargandoReserva')}</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center h-64">
            <Cargador />
            <p className="mt-4 text-blue-600">{t('general.cargando')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Contenido principal del formulario
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-cyan-200 overflow-hidden">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-5 text-white">
        <h3 className="text-xl font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t('tour.reservarAhora')}
        </h3>
        
        {tiposPasajeDelTour.length > 0 && (
          <div className="flex items-center mt-2">
            <span className="text-2xl font-bold">S/ {tiposPasajeDelTour[0].costo.toFixed(2)}</span>
            <span className="text-sm opacity-90 ml-1">/ {t('tour.porPersona')}</span>
          </div>
        )}
      </div>
      
      {/* Pasos de la reserva */}
      <div className="bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 border-b border-cyan-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className={`flex flex-col items-center ${pasoActual >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 ${
                pasoActual >= 1 ? 'bg-blue-100 text-blue-600 border-2 border-blue-500' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="text-sm font-medium">1</span>
              </div>
              <span className="text-xs">Fecha y hora</span>
            </div>
            
            <div className={`flex-1 h-0.5 mx-2 ${pasoActual >= 2 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
            
            <div className={`flex flex-col items-center ${pasoActual >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 ${
                pasoActual >= 2 ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="text-sm font-medium">2</span>
              </div>
              <span className="text-xs">Pasajeros</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cuerpo del formulario */}
      <div className="p-6 bg-gradient-to-b from-white to-sky-50">
        {/* Alerta personalizada */}
        {alerta.mostrar && (
          <Alerta 
            tipo={alerta.tipo} 
            mensaje={alerta.mensaje} 
            onCerrar={() => setAlerta(prev => ({...prev, mostrar: false}))} 
          />
        )}
        
        {/* Aviso de 24 horas */}
        <div className="mb-5 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 text-blue-800 text-sm flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <span className="font-medium">Importante:</span> Las reservas deben realizarse con al menos 24 horas de anticipación. Se requiere el pago completo al momento de reservar.
          </div>
        </div>
        
        <div className="space-y-6">
          {/* PASO 1: Selección de fecha y hora */}
          {pasoActual === 1 && (
            <div className="space-y-6 animate__animated animate__fadeIn">
              <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Selecciona fecha y horario</h4>
              
              <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tour.fecha')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="fecha"
                  min={fechaMinima}
                  max={fechaMaxima}
                  value={fecha}
                  onChange={handleFechaChange}
                  required
                  className="w-full px-4 py-2.5 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-colors"
                />
                
                {/* Mensaje de ayuda para fechas disponibles */}
                {cargandoInstancias ? (
                  <p className="text-xs text-blue-500 mt-1">
                    {t('tour.cargandoFechas')}
                  </p>
                ) : fechasDisponibles.length > 0 ? (
                  <p className="text-xs text-blue-500 mt-1">
                    {t('tour.hayFechasDisponibles')}: {fechasDisponibles.slice(0, 3).map(f => new Date(f).toLocaleDateString()).join(', ')}
                    {fechasDisponibles.length > 3 ? ` y ${fechasDisponibles.length - 3} más` : ''}
                  </p>
                ) : (
                  <p className="text-xs text-amber-500 mt-1">
                    {t('tour.sinFechasDisponibles')}
                  </p>
                )}
              </div>
              
              {/* Selector de horarios mejorado */}
              {fecha && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tour.horarioDisponible')} <span className="text-red-500">*</span>
                  </label>
                  
                  {horariosDisponibles.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {horariosDisponibles.map((horario) => (
                        <SelectorHorario
                          key={horario.id}
                          horario={horario}
                          seleccionado={horarioSeleccionado?.id === horario.id}
                          cupoDisponible={horario.cupoDisponible}
                          onClick={() => handleHorarioSelect(horario)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-amber-50 p-4 rounded-lg text-amber-800 text-sm border border-amber-200 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {t('tour.sinHorariosDisponiblesParaFecha')}
                    </div>
                  )}
                </div>
              )}
              
              {/* Botón para continuar */}
              {fecha && horarioSeleccionado && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setPasoActual(2)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow flex items-center"
                  >
                    Continuar
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Mostrar fecha y hora seleccionadas */}
              {fecha && horarioSeleccionado && (
                <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-800 mb-1">Selección actual:</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-blue-600">Fecha:</span>
                      <span className="ml-2 text-blue-800">{formatearFecha(fecha)}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Horario:</span>
                      <span className="ml-2 text-blue-800">{horarioSeleccionado.texto}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-blue-600">Cupos disponibles:</span>
                      <span className="ml-2 text-blue-800">{horarioSeleccionado.cupoDisponible}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* PASO 2: Selección de pasajeros */}
          {pasoActual === 2 && (
            <div className="space-y-6 animate__animated animate__fadeIn">
              <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Selecciona tus pasajes</h4>
              
              {/* Paquetes de pasajes */}
              {paquetesPasajesDelTour.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center mb-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full flex items-center justify-center mr-2 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-800">
                      {t('tour.paquetesPromocion')}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paquetesPasajesDelTour.map((paquete) => (
                      <SelectorPaquete
                        key={paquete.id_paquete}
                        paquete={paquete}
                        cantidad={seleccionPaquetes[paquete.id_paquete] || 0}
                        setCantidad={(cantidad) => handleCantidadPaqueteChange(paquete.id_paquete, cantidad)}
                      />
                    ))}
                  </div>
                  
                  <div className="text-center text-sm text-blue-600 my-3">
                    <span className="inline-block px-3 py-1 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full border border-blue-200">
                      {t('tour.combinar')}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Selector de pasajes individuales */}
              <div className="space-y-4">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center mr-2 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-800">
                    {t('tour.pasajesIndividuales')}
                  </h4>
                </div>
                
                {tiposPasajeDelTour.length > 0 ? (
                  <div className="space-y-3">
                    {tiposPasajeDelTour.map((tipoPasaje) => (
                      <SelectorPasaje
                        key={tipoPasaje.id_tipo_pasaje}
                        tipo={tipoPasaje.nombre}
                        precio={tipoPasaje.costo}
                        cantidad={seleccionPasajes[tipoPasaje.id_tipo_pasaje] || 0}
                        setCantidad={(cantidad) => handleCantidadPasajeChange(tipoPasaje.id_tipo_pasaje, cantidad)}
                        min={0}
                        max={20}
                        edad={tipoPasaje.edad || undefined}
                        colorScheme="blue"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-700 border border-blue-200">
                    {t('tour.noHayTiposPasajeDisponibles')}
                  </div>
                )}
              </div>

              {/* Total seleccionado */}
              <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 mt-4 shadow-sm">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total pasajeros:</span>
                  <span className="text-blue-700">{calcularTotalPasajeros()}</span>
                </div>
                <div className="flex justify-between font-bold mt-1 pt-1 border-t border-cyan-200">
                  <span>Total a pagar:</span>
                  <span className="text-teal-600">S/ {calcularTotal().toFixed(2)}</span>
                </div>
              </div>
              
              {/* Botones de navegación */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setPasoActual(1)}
                  className="px-4 py-2 border border-cyan-300 text-blue-700 font-medium rounded-lg transition-colors hover:bg-cyan-50 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Volver
                </button>
                
                <button
                  type="button"
                  onClick={irAPago}
                  disabled={!haySeleccion || cargando}
                  className={`px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md flex items-center ${
                    !haySeleccion || cargando ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {cargando ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      Continuar a pago
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              
              {/* Información de métodos de pago con logos actualizados */}
              <div className="mt-6 pt-4 border-t border-cyan-200">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-cyan-600 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7H4C2.9 7 2 7.9 2 9V15C2 16.1 2.9 17 4 17H20C21.1 17 22 16.1 22 15V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
                    <path d="M16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13Z" fill="currentColor"/>
                    <path d="M8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z" fill="currentColor"/>
                  </svg>
                  <h5 className="font-medium text-gray-700">Pago seguro con Mercado Pago</h5>
                </div>
                
                <div className="bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 p-4 rounded-lg border border-cyan-200 mt-2">
                  <p className="text-sm text-gray-600 mb-3">Elige entre múltiples métodos de pago seguros:</p>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                      <img src="https://woocommerce.com/wp-content/uploads/2021/05/tw-mercado-pago-v2@2x.png" alt="Mercado Pago" className="h-8" />
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                      <img src="https://images.freeimages.com/vme/images/7/1/715862/visa_logo_preview.jpg?h=350" alt="Visa" className="h-7" />
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                      <img src="https://images.freeimages.com/vme/images/9/9/99813/mastercard_logo_preview.jpg?h=350" alt="Mastercard" className="h-7" />
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                      <img src="https://logosenvector.com/logo/img/yape-bcp-4390.jpg" alt="Yape" className="h-7" />
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                      <img src="https://images.seeklogo.com/logo-png/38/1/plin-logo-png_seeklogo-386806.png" alt="Plin" className="h-7" />
                    </div>
                  </div>
                  
                  <p className="text-xs text-teal-700 mt-3 italic text-center">
                    Todos los pagos son procesados con cifrado de extremo a extremo para tu seguridad
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Notas importantes */}
        <div className="mt-5 text-xs text-gray-500 space-y-1 bg-white/70 p-3 rounded-lg border border-gray-200">
          <p>• El pago se realiza por el monto total de la reserva.</p>
          <p>• Las reservas requieren un mínimo de 24 horas de anticipación.</p>
          <p>• Los precios están expresados en Soles Peruanos (S/).</p>
          <p>• Recibirás un correo de confirmación con los detalles de tu reserva.</p>
        </div>
      </div>
      
      {/* Footer con información de contacto */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-t border-cyan-200 text-xs text-gray-600 flex flex-wrap justify-between">
        <div>
          <span className="font-medium text-blue-700">Atención:</span> +51 987 654 321
        </div>
        <div>
          <span className="font-medium text-blue-700">Email:</span> reservas@tours-peru.com
        </div>
        <div>
          <span className="font-medium text-blue-700">Horario:</span> Lun-Vie 9am-6pm
        </div>
      </div>
    </div>
  );
};

export default FormularioReservacion; 