 
// Importaciones
/*import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../store';
import { listarTiposPasajePorTipoTour } from '../../../store/slices/sliceTipoPasaje';
import { listarPaquetesPasajesPorTipoTour } from '../../../store/slices/slicePaquetePasajes';
import { listarInstanciasTourDisponibles, listarInstanciasTourPorFecha } from '../../../store/slices/sliceInstanciaTour';
import { iniciarSesion } from '../../../store/slices/sliceAutenticacion';
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
        : 'bg-gradient-to-br from-sky-50 to-white border-sky-200 hover:border-sky-300 hover:shadow-sm'
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
            className="w-8 h-8 flex items-center justify-center bg-sky-100 hover:bg-sky-200 text-blue-700 rounded-l-md border border-sky-300 transition-colors"
          >
            -
          </button>
          <span className="w-10 text-center py-1 border-t border-b border-sky-300 bg-white text-blue-800 font-medium">
            {cantidad}
          </span>
          <button
            type="button"
            onClick={() => setCantidad(Math.min(10, cantidad + 1))}
            className="w-8 h-8 flex items-center justify-center bg-sky-100 hover:bg-sky-200 text-blue-700 rounded-r-md border border-sky-300 transition-colors"
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

// Componente de botón de pago (Mercado Pago)
const BotonPagoMercadoPago = ({ onClick, disabled, loading }: { onClick: () => void, disabled: boolean, loading: boolean }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center ${
        (disabled || loading) ? 'opacity-70 cursor-not-allowed hover:transform-none' : ''
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando...
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7H4C2.9 7 2 7.9 2 9V15C2 16.1 2.9 17 4 17H20C21.1 17 22 16.1 22 15V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
            <path d="M16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13Z" fill="currentColor"/>
            <path d="M8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z" fill="currentColor"/>
          </svg>
          Pagar con Mercado Pago
        </span>
      )}
    </button>
  );
};

// Componente Modal de Login/Registro
const ModalLoginRegistro = ({ 
  isOpen, 
  onClose, 
  onLogin,
  onRegister,
  cargando,
  error
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onLogin: (email: string, password: string, recordarme: boolean) => void;
  onRegister: () => void;
  cargando: boolean;
  error: string | null;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Iniciar sesión</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">Inicia sesión para completar tu reserva y realizar el pago.</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ejemplo@correo.com"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>
          
          <div className="flex items-center mb-4">
            <input
              id="recordarme"
              type="checkbox"
              checked={recordarme}
              onChange={(e) => setRecordarme(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="recordarme" className="ml-2 block text-sm text-gray-700">
              Recordar mi sesión
            </label>
          </div>
          
          <button
            onClick={() => onLogin(email, password, recordarme)}
            disabled={cargando}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center ${cargando ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {cargando ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              ¿No tienes una cuenta?{' '}
              <button 
                onClick={onRegister}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
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
  const [modalLoginVisible, setModalLoginVisible] = useState(false);
  const [loadingMercadoPago, setLoadingMercadoPago] = useState(false);
  
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
  
  // Obtener estado de autenticación
  const { usuario, autenticado, cargando: cargandoAuth, error: errorAuth } = useSelector(
    (state: RootState) => state.autenticacion
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
  
  // Calcular fecha mínima (exactamente 24 horas después de la hora actual)
  const fechaMinima = useMemo(() => {
    const ahora = new Date();
    const manana = new Date(ahora);
    manana.setHours(ahora.getHours() + 24); // Añadir 24 horas exactas
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
    
    // Verificar que la fecha es al menos 24 horas después
    const fechaSeleccionada = new Date(nuevaFecha);
    const ahora = new Date();
    
    // Calcular la diferencia en milisegundos
    const diferenciaTiempo = fechaSeleccionada.getTime() - ahora.getTime();
    const diferenciaHoras = diferenciaTiempo / (1000 * 3600);
    
    if (diferenciaHoras < 24) {
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
  
  // Manejar click en continuar a pago
  const handleContinuarAPago = () => {
    // Verificar que haya selección
    if (!haySeleccion) {
      mostrarAlertaTemp('Por favor seleccione al menos un pasaje o paquete', 'warning');
      return;
    }
    
    // Verificar cupo disponible
    if (!verificarCupoDisponible()) {
      return;
    }
    
    // Si no está autenticado, mostrar modal de login
    if (!autenticado) {
      setModalLoginVisible(true);
      return;
    }
    
    // Si está autenticado, ir al paso de confirmación
    setPasoActual(3);
  };
  
  // Manejar inicio de sesión
  const handleLogin = (email: string, password: string, recordarme: boolean) => {
    // Usar la acción de Redux para iniciar sesión
    dispatch(iniciarSesion({
      correo: email,
      contrasena: password,
      recordarme
    }));
  };
  
  // Efecto para controlar el resultado del inicio de sesión
  useEffect(() => {
    // Si se completó la autenticación, cerrar el modal y continuar
    if (autenticado && modalLoginVisible) {
      setModalLoginVisible(false);
      setPasoActual(3);
      mostrarAlertaTemp('Sesión iniciada correctamente', 'success');
    }
  }, [autenticado, modalLoginVisible]);
  
  // Manejar registro
  const handleRegister = () => {
    // Guardar los datos de la reserva en sessionStorage para recuperarlos después del registro
    const datosReserva = {
      tourId: tour.id,
      fecha,
      horario,
      instanciaId: instanciaSeleccionada,
      seleccionPasajes,
      seleccionPaquetes
    };
    sessionStorage.setItem('datosReservaTemp', JSON.stringify(datosReserva));
    
    // Redireccionar a la página de registro
    navigate('/registrarse', { 
      state: { 
        returnUrl: window.location.pathname
      } 
    });
  };
  
  // Manejar pago con Mercado Pago
  const handlePagoMercadoPago = () => {
    setLoadingMercadoPago(true);
    
    // Aquí implementarías la integración real con Mercado Pago
    // Este es solo un ejemplo de simulación
    setTimeout(() => {
      setLoadingMercadoPago(false);
      
      // Redireccionar a la página de confirmación de reserva
      navigate('/reserva-exitosa', { 
        state: { 
          tourId: tour.id,
          tourNombre: tour.nombre,
          fecha,
          horario,
          totalPasajeros: calcularTotalPasajeros(),
          total: calcularTotal(),
          reservaId: Math.floor(Math.random() * 1000000) // ID ficticio para la demo
        } 
      });
    }, 2000);
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
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-sky-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white">
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
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-sky-200 overflow-hidden">
      {/* Modal de Login/Registro *//*}
      <ModalLoginRegistro 
        isOpen={modalLoginVisible}
        onClose={() => setModalLoginVisible(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        cargando={cargandoAuth}
        error={errorAuth}
      />
      
      {/* Encabezado *//*}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white">
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
      <div className="bg-gray-50 border-b border-gray-200">
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
            
            <div className={`flex-1 h-0.5 mx-2 ${pasoActual >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            
            <div className={`flex flex-col items-center ${pasoActual >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 ${
                pasoActual >= 2 ? 'bg-blue-100 text-blue-600 border-2 border-blue-500' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="text-sm font-medium">2</span>
              </div>
              <span className="text-xs">Pasajeros</span>
            </div>
            
            <div className={`flex-1 h-0.5 mx-2 ${pasoActual >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            
            <div className={`flex flex-col items-center ${pasoActual >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 ${
                pasoActual >= 3 ? 'bg-blue-100 text-blue-600 border-2 border-blue-500' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="text-sm font-medium">3</span>
              </div>
              <span className="text-xs">Pago</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cuerpo del formulario *//*}
      <div className="p-6">
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-colors"
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
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-colors"
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
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow flex items-center"
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
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
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
                    <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full flex items-center justify-center mr-2 shadow-sm">
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
                    <span className="inline-block px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
                      {t('tour.combinar')}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Selector de pasajes individuales *//*}
              <div className="space-y-4">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center mr-2 shadow-sm">
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
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total pasajeros:</span>
                  <span className="text-blue-700">{calcularTotalPasajeros()}</span>
                </div>
                <div className="flex justify-between font-bold mt-1 pt-1 border-t border-gray-200">
                  <span>Total a pagar:</span>
                  <span className="text-green-600">S/ {calcularTotal().toFixed(2)}</span>
                </div>
              </div>
              
              {/* Botones de navegación *//*}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setPasoActual(1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors hover:bg-gray-50 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Volver
                </button>
                
                <button
                  type="button"
                  onClick={handleContinuarAPago}
                  disabled={!haySeleccion}
                  className={`px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow flex items-center ${
                    !haySeleccion ? 'opacity-70 cursor-not-allowed hover:bg-blue-600' : ''
                  }`}
                >
                  {autenticado ? 'Continuar a pago' : 'Iniciar sesión para reservar'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* PASO 3: Pago *//*}
          {pasoActual === 3 && (
            <div className="space-y-6 animate__animated animate__fadeIn">
              <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Confirma y realiza el pago</h4>
              
              {/* Información del usuario *//*}
              {autenticado && usuario && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <h5 className="font-medium text-blue-800">Información del cliente</h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex">
                      <span className="text-gray-600 w-24">Nombre:</span>
                      <span className="text-gray-800 font-medium">{usuario.nombres} {usuario.apellidos}</span>
                    </div>
                    <div className="flex">
                             <span className="text-gray-600 w-24">Email:</span>
                      <span className="text-gray-800">{usuario.correo}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-24">Teléfono:</span>
                      <span className="text-gray-800">{usuario.numero_celular || "No especificado"}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Resumen de la reserva *//*}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-blue-200">
                  <h5 className="font-medium text-blue-800">Detalles de la reserva</h5>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0 md:pr-4">
                      <h6 className="text-sm font-medium text-gray-600 mb-2">Fecha y Horario</h6>
                      
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800">{formatearFecha(fecha)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800">{horario}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h6 className="text-sm font-medium text-gray-600 mb-2">Tour</h6>
                      
                      <div className="flex items-start mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                        </svg>
                        <span className="text-gray-800 font-medium">{tour.nombre}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800">Duración: {tour.duracion} horas</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h6 className="text-sm font-medium text-gray-600 mb-3">Detalle de la selección</h6>
                    
                    {/* Paquetes seleccionados *//*}
                    {Object.entries(seleccionPaquetes)
                      .filter(([_, cantidad]) => cantidad > 0)
                      .map(([idPaquete, cantidad]) => {
                        const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === Number(idPaquete));
                        if (!paquete) return null;
                        
                        return (
                          <div key={`paquete-${idPaquete}`} className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                            <div className="flex items-start">
                              <div className="bg-teal-100 text-teal-700 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">P</div>
                              <div>
                                <span className="text-gray-800 font-medium">{cantidad}x {paquete.nombre}</span>
                                <p className="text-xs text-gray-500">{paquete.cantidad_total * cantidad} pasajeros en total</p>
                              </div>
                            </div>
                            <span className="font-medium text-gray-800">S/ {(paquete.precio_total * cantidad).toFixed(2)}</span>
                          </div>
                        );
                      })}
                    
                    {/* Pasajes individuales *//*}
                    {Object.entries(seleccionPasajes)
                      .filter(([_, cantidad]) => cantidad > 0)
                      .map(([idTipoPasaje, cantidad]) => {
                        const tipoPasaje = tiposPasajeDelTour.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
                        if (!tipoPasaje) return null;
                        
                        return (
                          <div key={`pasaje-${idTipoPasaje}`} className="flex justify-between items-center mb-2">
                            <div className="flex items-start">
                              <div className="bg-blue-100 text-blue-700 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">I</div>
                              <div>
                                <span className="text-gray-800">{cantidad}x {tipoPasaje.nombre}</span>
                                {tipoPasaje.edad && (
                                  <p className="text-xs text-gray-500">{tipoPasaje.edad}</p>
                                )}
                              </div>
                            </div>
                            <span className="font-medium text-gray-800">S/ {(tipoPasaje.costo * cantidad).toFixed(2)}</span>
                          </div>
                        );
                      })}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-800">S/ {calcularTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">IGV (18%):</span>
                      <span className="text-gray-800">S/ {(calcularTotal() * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
                      <span className="text-gray-800">Total a pagar:</span>
                      <span className="text-green-600">S/ {calcularTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Métodos de pago *//*}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 border-b border-green-200">
                  <h5 className="font-medium text-green-800">Métodos de pago</h5>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-4">Selecciona tu método de pago preferido:</p>
                  
                  <div className="space-y-2">
                    {/* Mercado Pago (opción principal) *//*}
                    <div className="p-3 border border-blue-300 rounded-lg bg-blue-50 flex justify-between items-center">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="mercadopago"
                          name="metodoPago"
                          checked={true}
                          readOnly
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="mercadopago" className="ml-2 flex items-center">
                          <img src="https://www.mercadopago.com/org-img/MP3/API/logos/mp-logo.svg" alt="Mercado Pago" className="h-8 mr-2" />
                          <span className="font-medium text-gray-800">Mercado Pago</span>
                        </label>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Recomendado</span>
                    </div>
                    
                    {/* Otros métodos de pago (deshabilitados) *//*}
                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center opacity-60">
                      <input
                        type="radio"
                        id="yape"
                        name="metodoPago"
                        disabled
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="yape" className="ml-2 flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-purple-700 font-bold text-sm">YP</span>
                        </div>
                        <span className="text-gray-800">Yape</span>
                      </label>
                    </div>
                    
                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center opacity-60">
                      <input
                        type="radio"
                        id="transferencia"
                        name="metodoPago"
                        disabled
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="transferencia" className="ml-2 flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-800">Transferencia Bancaria</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <BotonPagoMercadoPago 
                      onClick={handlePagoMercadoPago}
                      disabled={false}
                      loading={loadingMercadoPago}
                    />
                  </div>
                </div>
              </div>
              
              {/* Políticas y términos *//*}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
                <p className="mb-2">Al realizar el pago, aceptas nuestras políticas:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cancelación gratuita hasta 48 horas antes del tour.</li>
                  <li>Cancelaciones entre 24-48 horas: reembolso del 50%.</li>
                  <li>Cancelaciones con menos de 24 horas: sin reembolso.</li>
                  <li>El pago se procesa de forma segura a través de Mercado Pago.</li>
                </ul>
              </div>
              
              {/* Botones de navegación *//*}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setPasoActual(2)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors hover:bg-gray-50 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Volver
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Información sobre métodos de pago (visible en pasos 1 y 2) *//*}
        {pasoActual < 3 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              <h5 className="font-medium text-gray-700">Aceptamos</h5>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 flex items-center">
                <img src="https://www.mercadopago.com/org-img/MP3/API/logos/mp-logo.svg" alt="Mercado Pago" className="h-4 mr-1" />
                Mercado Pago
              </div>
              <div className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-1 text-blue-500">
                  <path d="M11.343 18.031c-1.171 0-2.102-.376-2.792-1.128-.692-.754-1.038-1.726-1.038-2.917 0-1.189.356-2.159 1.067-2.912.71-.752 1.675-1.128 2.891-1.128 1.041 0 1.887.295 2.533.886.645.59.972 1.306.982 2.147l.003.222H12.52l-.01-.135c-.059-.683-.534-1.038-1.426-1.038-.637 0-1.12.272-1.452.817-.332.544-.498 1.228-.498 2.054 0 .847.162 1.535.486 2.065.323.53.81.795 1.465.795.883 0 1.357-.33 1.42-.99l.012-.132h2.473l-.02.202c-.082.819-.394 1.48-.937 1.983-.662.62-1.553.93-2.672.93zm8.178-3.215h-1.506v2.91h-2.523v-8.75h4.029c.813 0 1.513.146 2.099.437.586.291 1.037.7 1.352 1.227.316.527.473 1.133.473 1.815 0 .683-.157 1.288-.473 1.815-.314.527-.766.936-1.352 1.227-.586.291-1.286.437-2.099.437zm-.362-3.855h-1.143v1.937h1.143c.413 0 .738-.101.974-.301.236-.201.354-.479.354-.833 0-.339-.118-.613-.354-.815-.236-.201-.56-.302-.974-.302zM2.5 17.727V8.976h2.523v6.77h3.608v1.98z" fill="currentColor"/>
                </svg>
                Yape
              </div>
              <div className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4h14a3 3 0 013 3v10a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3zm14 2H5a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V7a1 1 0 00-1-1zm-3 5a1 1 0 01-1 1H9a1 1 0 110-2h6a1 1 0 011 1z" clipRule="evenodd" />
                </svg>
                Tarjetas
              </div>
              <div className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.07 4.93C17.22 3 14.66 1.96 12 2c-2.66-.04-5.21 1-7.06 2.93C3 6.78 1.96 9.34 2 12c-.04 2.66 1 5.21 2.93 7.06C6.78 21 9.34 22.04 12 22c2.66.04 5.21-1 7.06-2.93C21 17.22 22.04 14.66 22 12c.04-2.66-1-5.22-2.93-7.07zM11 19.93c-3.79-.38-6.75-3.55-6.75-7.43 0-3.87 2.96-7.05 6.75-7.43v14.86z" />
                </svg>
                Plin
              </div>
            </div>
          </div>
        )}
        
        {/* Notas importantes *//*}
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>• El pago se realiza por el monto total de la reserva.</p>
          <p>• Las reservas requieren un mínimo de 24 horas de anticipación.</p>
          <p>• Los precios están expresados en Soles Peruanos (S/).</p>
          <p>• Recibirás un correo de confirmación con los detalles de tu reserva.</p>
        </div>
      </div>
      
      {/* Footer con información de contacto *//*}
      <div className="bg-gray-50 p-4 border-t border-gray-200 text-xs text-gray-500 flex flex-wrap justify-between">
        <div>
          <span className="font-medium">Atención:</span> +51 987 654 321
        </div>
        <div>
          <span className="font-medium">Email:</span> reservas@tours-peru.com
        </div>
        <div>
          <span className="font-medium">Horario:</span> Lun-Vie 9am-6pm
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
        : 'bg-gradient-to-br from-sky-50 to-white border-sky-200 hover:border-sky-300 hover:shadow-sm'
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
            className="w-8 h-8 flex items-center justify-center bg-sky-100 hover:bg-sky-200 text-blue-700 rounded-l-md border border-sky-300 transition-colors"
          >
            -
          </button>
          <span className="w-10 text-center py-1 border-t border-b border-sky-300 bg-white text-blue-800 font-medium">
            {cantidad}
          </span>
          <button
            type="button"
            onClick={() => setCantidad(Math.min(10, cantidad + 1))}
            className="w-8 h-8 flex items-center justify-center bg-sky-100 hover:bg-sky-200 text-blue-700 rounded-r-md border border-sky-300 transition-colors"
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
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-sky-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white">
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
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-sky-200 overflow-hidden">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white">
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
      <div className="bg-gray-50 border-b border-gray-200">
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
            
            <div className={`flex-1 h-0.5 mx-2 ${pasoActual >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            
            <div className={`flex flex-col items-center ${pasoActual >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 ${
                pasoActual >= 2 ? 'bg-blue-100 text-blue-600 border-2 border-blue-500' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="text-sm font-medium">2</span>
              </div>
              <span className="text-xs">Pasajeros</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cuerpo del formulario */}
      <div className="p-6">
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-colors"
                  />
                  
                  {/* Mensaje de ayuda para fechas disponibles */}
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
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-colors"
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
              
              {/* Botón para continuar */}
              {fecha && horario && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setPasoActual(2)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow flex items-center"
                  >
                    Continuar
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Mostrar fecha y hora seleccionadas */}
              {fecha && horario && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
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
          
          {/* PASO 2: Selección de pasajeros */}
          {pasoActual === 2 && (
            <div className="space-y-6 animate__animated animate__fadeIn">
              <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Selecciona tus pasajes</h4>
              
              {/* Paquetes de pasajes */}
              {paquetesPasajesDelTour.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center mb-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full flex items-center justify-center mr-2 shadow-sm">
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
                    <span className="inline-block px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
                      {t('tour.combinar')}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Selector de pasajes individuales */}
              <div className="space-y-4">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center mr-2 shadow-sm">
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
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total pasajeros:</span>
                  <span className="text-blue-700">{calcularTotalPasajeros()}</span>
                </div>
                <div className="flex justify-between font-bold mt-1 pt-1 border-t border-gray-200">
                  <span>Total a pagar:</span>
                  <span className="text-green-600">S/ {calcularTotal().toFixed(2)}</span>
                </div>
              </div>
              
              {/* Botones de navegación */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setPasoActual(1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors hover:bg-gray-50 flex items-center"
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
                  className={`px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow flex items-center ${
                    !haySeleccion || cargando ? 'opacity-70 cursor-not-allowed hover:bg-green-600' : ''
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
              
              {/* Información de Mercado Pago */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7H4C2.9 7 2 7.9 2 9V15C2 16.1 2.9 17 4 17H20C21.1 17 22 16.1 22 15V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
                    <path d="M16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13Z" fill="currentColor"/>
                    <path d="M8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z" fill="currentColor"/>
                  </svg>
                  <h5 className="font-medium text-gray-700">Pago seguro con Mercado Pago</h5>
                </div>
                <p className="text-sm text-gray-600 ml-8">Podrás pagar con tarjeta de crédito, débito, Yape, Plin y más.</p>
                
                <div className="flex items-center mt-2 ml-8">
                  <img src="https://www.mercadopago.com/org-img/MP3/API/logos/mp-logo.svg" alt="Mercado Pago" className="h-6 mr-2" />
                  <img src="https://cdn.visa.com/v2/assets/images/logos/visa/logo.png" alt="Visa" className="h-5 mr-2" />
                  <img src="https://www.mastercard.com.pe/content/dam/public/mastercardcom/lac/pe/home/consumers/find-a-card/images/black-mc-logo.svg" alt="Mastercard" className="h-5 mr-2" />
                  <img src="https://www.bcp.com.bo/Content/core/images/footer/yape.svg" alt="Yape" className="h-5 mr-2" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Notas importantes */}
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>• El pago se realiza por el monto total de la reserva.</p>
          <p>• Las reservas requieren un mínimo de 24 horas de anticipación.</p>
          <p>• Los precios están expresados en Soles Peruanos (S/).</p>
          <p>• Recibirás un correo de confirmación con los detalles de tu reserva.</p>
        </div>
      </div>
      
      {/* Footer con información de contacto */}
      <div className="bg-gray-50 p-4 border-t border-gray-200 text-xs text-gray-500 flex flex-wrap justify-between">
        <div>
          <span className="font-medium">Atención:</span> +51 987 654 321
        </div>
        <div>
          <span className="font-medium">Email:</span> reservas@tours-peru.com
        </div>
        <div>
          <span className="font-medium">Horario:</span> Lun-Vie 9am-6pm
        </div>
      </div>
    </div>
  );
};

export default FormularioReservacion;