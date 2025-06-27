 import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../infrastructure/store';
import axios from '../../../infrastructure/api/axiosClient';
import { endpoints } from '../../../infrastructure/api/endpoints';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  FaArrowLeft, FaArrowRight, FaCheck, FaEdit, FaPlus, FaSearch, 
  FaShip, FaUser, FaUserPlus, FaTicketAlt, FaMoneyBill, FaTrash, 
  FaInfoCircle, FaClock, FaUserFriends, FaCalendarAlt, FaCalendarCheck, 
  FaBox, FaMapMarkerAlt
} from 'react-icons/fa';
import { format, parse, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

// Interfaces necesarias
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

interface Cliente {
  id_cliente?: number;
  tipo_documento: string;
  numero_documento: string;
  nombres?: string;
  apellidos?: string;
  razon_social?: string;
  direccion_fiscal?: string;
  correo?: string;
  numero_celular?: string;
  eliminado?: boolean;
}

interface PasajeCantidad {
  id_tipo_pasaje: number;
  nombre?: string;
  costo?: number;
  cantidad: number;
  subtotal?: number;
}

interface PaqueteSeleccionado {
  id_paquete: number;
  nombre?: string;
  precio_total?: number;
  cantidad_total?: number;
  cantidad: number;
  subtotal?: number;
}

interface ReservaData {
  id_vendedor?: number;
  id_cliente: number;
  id_instancia: number;
  id_paquete?: number;
  total_pagar: number;
  notas?: string;
  estado: string;
  pasajes?: PasajeCantidad[];
}

// Componente principal
const NuevaReservaPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  // Obtener el instanciaId de la URL
  const queryParams = new URLSearchParams(location.search);
  const instanciaId = queryParams.get('instanciaId');

  // Estados
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instanciaTour, setInstanciaTour] = useState<InstanciaTour | null>(null);
  
  // Estados para búsqueda de cliente
  const [documentoSearch, setDocumentoSearch] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('DNI');
  const [searchLoading, setSearchLoading] = useState(false);
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null);
  const [modoRegistroCliente, setModoRegistroCliente] = useState(false);
  
  // Estado para nuevo cliente
  const [nuevoCliente, setNuevoCliente] = useState<Cliente>({
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    correo: '',
    numero_celular: ''
  });
  
  // Estados para pasajes y paquetes
  const [pasajesSeleccionados, setPasajesSeleccionados] = useState<PasajeCantidad[]>([]);
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<PaqueteSeleccionado | null>(null);
  const [usarPaquete, setUsarPaquete] = useState(false);
  
  // Estado para notas de reserva
  const [notasReserva, setNotasReserva] = useState('');
  
  // Resumen
  const [totalReserva, setTotalReserva] = useState(0);
  const [reservaCreada, setReservaCreada] = useState(false);
  const [reservaId, setReservaId] = useState<number | null>(null);

  // Función para cargar la instancia del tour
  const cargarInstanciaTour = useCallback(async () => {
    if (!instanciaId) {
      setError('No se ha especificado una instancia de tour');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(endpoints.instanciaTour.vendedorGetById(parseInt(instanciaId)));
      
      if (!response.data) {
        throw new Error('No se pudo obtener la información de la instancia del tour');
      }
      
      let instancia: InstanciaTour;
      
      if (response.data.data && typeof response.data.data === 'object') {
        instancia = response.data.data;
      } else if (typeof response.data === 'object') {
        instancia = response.data;
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
      
      // Cargar información adicional del tour programado
      const tourResponse = await axios.get(endpoints.tourProgramado.vendedorGetById(instancia.id_tour_programado));
      
      let tourProgramado: TourProgramado;
      if (tourResponse.data.data && typeof tourResponse.data.data === 'object') {
        tourProgramado = tourResponse.data.data;
      } else if (typeof tourResponse.data === 'object') {
        tourProgramado = tourResponse.data;
      } else {
        throw new Error('Formato de respuesta inesperado para tour programado');
      }
      
      instancia.tour_programado = tourProgramado;
      
      // Cargar tipos de pasaje
      if (tourProgramado.id_tipo_tour) {
        const tiposPasajeResponse = await axios.get(
          endpoints.tipoPasaje.vendedorListByTipoTour(tourProgramado.id_tipo_tour)
        );
        
        let tiposPasaje: TipoPasaje[] = [];
        if (tiposPasajeResponse.data.data && Array.isArray(tiposPasajeResponse.data.data)) {
          tiposPasaje = tiposPasajeResponse.data.data;
        } else if (Array.isArray(tiposPasajeResponse.data)) {
          tiposPasaje = tiposPasajeResponse.data;
        }
        
        instancia.tour_programado.tipos_pasaje = tiposPasaje;
        
        // Cargar paquetes de pasajes
        const paquetesResponse = await axios.get(
          endpoints.paquetePasajes.vendedorListByTipoTour(tourProgramado.id_tipo_tour)
        );
        
        let paquetes: PaquetePasajes[] = [];
        if (paquetesResponse.data.data && Array.isArray(paquetesResponse.data.data)) {
          paquetes = paquetesResponse.data.data;
        } else if (Array.isArray(paquetesResponse.data)) {
          paquetes = paquetesResponse.data;
        }
        
        instancia.tour_programado.paquetes_pasajes = paquetes;
      }
      
      setInstanciaTour(instancia);
      
      // Inicializar pasajes seleccionados con cantidad 0
      if (instancia.tour_programado?.tipos_pasaje) {
        setPasajesSeleccionados(
          instancia.tour_programado.tipos_pasaje.map(tipo => ({
            id_tipo_pasaje: tipo.id_tipo_pasaje,
            nombre: tipo.nombre,
            costo: tipo.costo,
            cantidad: 0,
            subtotal: 0
          }))
        );
      }
      
    } catch (error) {
      console.error('Error al cargar instancia del tour:', error);
      setError('Error al cargar la información del tour. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [instanciaId]);

  // Cargar datos iniciales
  useEffect(() => {
    if (isAuthenticated && selectedSede) {
      cargarInstanciaTour();
    }
  }, [isAuthenticated, selectedSede, cargarInstanciaTour]);

  // Funciones para búsqueda de cliente
  const buscarCliente = async () => {
    if (!documentoSearch.trim()) {
      setError('Ingrese un número de documento');
      return;
    }
    
    try {
      setSearchLoading(true);
      setError(null);
      setClienteEncontrado(null);
      
      // Corregido: usar vendedorByDocumento en lugar de vendedorGetByDocumento
      const response = await axios.get(endpoints.cliente.vendedorByDocumento, {
        params: {
          tipo: tipoDocumento,
          numero: documentoSearch
        }
      });
      
      if (response.data && response.data.data) {
        setClienteEncontrado(response.data.data);
        // Actualizar el estado de nuevo cliente con los datos encontrados (para edición)
        setNuevoCliente({
          ...response.data.data,
          tipo_documento: response.data.data.tipo_documento || tipoDocumento,
          numero_documento: response.data.data.numero_documento || documentoSearch
        });
      } else {
        // Cliente no encontrado, preparar para registro
        setClienteEncontrado(null);
        setNuevoCliente({
          tipo_documento: tipoDocumento,
          numero_documento: documentoSearch,
          nombres: '',
          apellidos: '',
          correo: '',
          numero_celular: ''
        });
      }
    } catch (error) {
      console.error('Error al buscar cliente:', error);
      setError('Error al buscar cliente. Verifique los datos e intente nuevamente.');
      setClienteEncontrado(null);
    } finally {
      setSearchLoading(false);
    }
  };

  // Función para crear/actualizar cliente
 const guardarCliente = async () => {
  try {
    setSearchLoading(true);
    setError(null);
    
    // Validación básica
    if (tipoDocumento === 'DNI' || tipoDocumento === 'CE' || tipoDocumento === 'Pasaporte') {
      if (!nuevoCliente.nombres || !nuevoCliente.apellidos) {
        setError('Debe ingresar nombres y apellidos');
        setSearchLoading(false);
        return;
      }
    } else if (tipoDocumento === 'RUC') {
      if (!nuevoCliente.razon_social || !nuevoCliente.direccion_fiscal) {
        setError('Debe ingresar razón social y dirección fiscal');
        setSearchLoading(false);
        return;
      }
    }
    
    let response;
    if (clienteEncontrado?.id_cliente) {
      // Corregido: Usar el endpoint correcto para actualizar cliente
      // Si vendedorUpdate no existe, usar el endpoint correcto según tu API
      response = await axios.put(
        endpoints.cliente.byId(clienteEncontrado.id_cliente), // o vendedorUpdateCliente si existe
        nuevoCliente
      );
    } else {
      // Crear nuevo cliente
      response = await axios.post(endpoints.cliente.vendedorCreate, nuevoCliente);
    }
    
    if (response.data && response.data.data) {
      setClienteEncontrado(response.data.data);
      setModoRegistroCliente(false);
    } else {
      throw new Error('No se pudo guardar la información del cliente');
    }
  } catch (error) {
    console.error('Error al guardar cliente:', error);
    setError('Error al guardar la información del cliente. Intente nuevamente.');
  } finally {
    setSearchLoading(false);
  }
};

  // Funciones para manejar pasajes
  const actualizarCantidadPasaje = (id: number, cantidad: number) => {
    setPasajesSeleccionados(prevState => 
      prevState.map(pasaje => {
        if (pasaje.id_tipo_pasaje === id) {
          const newCantidad = Math.max(0, cantidad);
          return {
            ...pasaje,
            cantidad: newCantidad,
            subtotal: newCantidad * (pasaje.costo || 0)
          };
        }
        return pasaje;
      })
    );
  };

  // Funciones para manejar paquetes
  const seleccionarPaquete = (paquete: PaquetePasajes, cantidad: number = 1) => {
    setPaqueteSeleccionado({
      id_paquete: paquete.id_paquete,
      nombre: paquete.nombre,
      precio_total: paquete.precio_total,
      cantidad_total: paquete.cantidad_total,
      cantidad: cantidad,
      subtotal: paquete.precio_total * cantidad
    });
    setUsarPaquete(true);
  };

  const quitarPaquete = () => {
    setPaqueteSeleccionado(null);
    setUsarPaquete(false);
  };

  const actualizarCantidadPaquete = (cantidad: number) => {
    if (paqueteSeleccionado) {
      const newCantidad = Math.max(1, cantidad);
      setPaqueteSeleccionado({
        ...paqueteSeleccionado,
        cantidad: newCantidad,
        subtotal: newCantidad * (paqueteSeleccionado.precio_total || 0)
      });
    }
  };

  // Calcular total de la reserva
  useEffect(() => {
    let total = 0;
    
    if (usarPaquete && paqueteSeleccionado) {
      total = paqueteSeleccionado.subtotal || 0;
    } else {
      pasajesSeleccionados.forEach(pasaje => {
        total += pasaje.subtotal || 0;
      });
    }
    
    setTotalReserva(total);
  }, [pasajesSeleccionados, paqueteSeleccionado, usarPaquete]);

  // Validar que se pueda avanzar al siguiente paso
  const validarPasoActual = (): boolean => {
    switch (currentStep) {
      case 1: // Verificación de instancia
        return !!instanciaTour;
      
      case 2: // Selección de cliente
        return !!clienteEncontrado && !!clienteEncontrado.id_cliente;
      
      case 3: // Selección de pasajes/paquetes
        if (usarPaquete) {
          return !!paqueteSeleccionado && (paqueteSeleccionado.cantidad > 0);
        } else {
          return pasajesSeleccionados.some(p => p.cantidad > 0);
        }
      
      case 4: // Confirmación
        return totalReserva > 0;
      
      default:
        return false;
    }
  };

  // Función para avanzar al siguiente paso
  const avanzarPaso = () => {
    if (validarPasoActual()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Función para retroceder al paso anterior
  const retrocederPaso = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

 // Crear reserva
const crearReserva = async () => {
  if (!instanciaTour || !clienteEncontrado?.id_cliente) {
    setError('Información incompleta para crear la reserva');
    return;
  }
  
  try {
    setLoading(true);
    setError(null);
    
    const reservaData: ReservaData = {
      id_vendedor: user?.id_usuario,
      id_cliente: clienteEncontrado.id_cliente,
      id_instancia: instanciaTour.id_instancia,
      total_pagar: totalReserva,
      notas: notasReserva || undefined,
      estado: 'RESERVADO'
    };
    
    if (usarPaquete && paqueteSeleccionado) {
      reservaData.id_paquete = paqueteSeleccionado.id_paquete;
    } else {
      // Filtrar solo pasajes con cantidad > 0
      reservaData.pasajes = pasajesSeleccionados
        .filter(p => p.cantidad > 0)
        .map(p => ({
          id_tipo_pasaje: p.id_tipo_pasaje,
          cantidad: p.cantidad
        }));
    }
    
    // Usar URL directa en lugar de endpoints
    const response = await axios.post('/vendedor/reservas', reservaData);
    
    if (response.data && response.data.data) {
      setReservaCreada(true);
      setReservaId(response.data.data.id_reserva);
    } else {
      throw new Error('No se pudo crear la reserva');
    }
  } catch (error) {
    console.error('Error al crear reserva:', error);
    setError('Error al crear la reserva. Por favor, intente nuevamente.');
  } finally {
    setLoading(false);
  }
};

  // Formatear hora
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

  // Formatear fecha
  const formatearFecha = (fecha: string): string => {
    if (!fecha) return '-';

    try {
      const parsedFecha = parse(fecha, 'yyyy-MM-dd', new Date());
      if (isValid(parsedFecha)) {
        return format(parsedFecha, 'EEEE dd MMMM yyyy', { locale: es });
      }
    } catch (error) {
      console.error(`Error al formatear fecha: ${fecha}`, error);
    }

    return fecha;
  };

  // Componente para el paso 1: Verificación de instancia del tour
  const renderPaso1 = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalles del Tour</h2>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Cargando información del tour...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => navigate('/vendedor/tours')}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-bold py-2 px-4 rounded"
          >
            Volver a Tours
          </button>
        </div>
      ) : instanciaTour ? (
        <div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div className="h-64 overflow-hidden rounded-lg bg-gray-200">
                <img 
                  src={instanciaTour.tour_programado?.tipo_tour?.url_imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen'} 
                  alt={instanciaTour.nombre_tipo_tour || "Tour"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                  }}
                />
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{instanciaTour.nombre_tipo_tour}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <FaShip className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Embarcación</p>
                    <p className="font-semibold">{instanciaTour.nombre_embarcacion}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <FaCalendarCheck className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-semibold">{formatearFecha(instanciaTour.fecha_especifica)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <FaClock className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hora de salida</p>
                    <p className="font-semibold">{formatearHora(instanciaTour.hora_inicio)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <FaUserFriends className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cupo disponible</p>
                    <p className="font-semibold">{instanciaTour.cupo_disponible} de {instanciaTour.tour_programado?.cupo_maximo}</p>
                  </div>
                </div>
              </div>
              
              {instanciaTour.tour_programado?.tipo_tour?.descripcion && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Descripción:</h4>
                  <p className="text-gray-600">{instanciaTour.tour_programado.tipo_tour.descripcion}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {instanciaTour.estado}
                </div>
                {instanciaTour.cupo_disponible <= 5 && (
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    ¡Últimos {instanciaTour.cupo_disponible} lugares!
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {instanciaTour.cupo_disponible <= 0 && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-bold">¡Este tour no tiene cupos disponibles!</p>
              <p className="mt-1">No es posible crear una reserva para este tour. Por favor, seleccione otro tour o fecha.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <p>No se encontró información para este tour. Por favor, seleccione otro tour.</p>
        </div>
      )}
    </div>
  );

  // Componente para el paso 2: Selección/Registro de cliente
  const renderPaso2 = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Selección de Cliente</h2>
      
      {!modoRegistroCliente ? (
        <div>
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
            <p>Busque al cliente por su documento de identidad. Si no existe, podrá registrarlo.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tipo de Documento
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
              >
                <option value="DNI">DNI</option>
                <option value="CE">Carné de Extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="RUC">RUC</option>
              </select>
            </div>
            
            <div className="w-full md:w-2/4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Número de Documento
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={`Ingrese ${tipoDocumento === 'RUC' ? 'RUC' : 'número de documento'}`}
                value={documentoSearch}
                onChange={(e) => setDocumentoSearch(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-1/4 flex items-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                onClick={buscarCliente}
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                ) : (
                  <FaSearch className="mr-2" />
                )}
                Buscar
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          
          {clienteEncontrado ? (
            <div className="mt-6">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                <p className="font-bold">Cliente encontrado</p>
                <p>Se ha encontrado un cliente con el documento ingresado.</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-3">Información del Cliente</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tipo de Documento</p>
                    <p className="font-semibold">{clienteEncontrado.tipo_documento}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Número de Documento</p>
                    <p className="font-semibold">{clienteEncontrado.numero_documento}</p>
                  </div>
                  
                  {(clienteEncontrado.tipo_documento === 'DNI' || 
                    clienteEncontrado.tipo_documento === 'CE' || 
                    clienteEncontrado.tipo_documento === 'Pasaporte') ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Nombres</p>
                        <p className="font-semibold">{clienteEncontrado.nombres}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Apellidos</p>
                        <p className="font-semibold">{clienteEncontrado.apellidos}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Razón Social</p>
                        <p className="font-semibold">{clienteEncontrado.razon_social}</p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Dirección Fiscal</p>
                        <p className="font-semibold">{clienteEncontrado.direccion_fiscal}</p>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500">Correo Electrónico</p>
                    <p className="font-semibold">{clienteEncontrado.correo || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-semibold">{clienteEncontrado.numero_celular || '-'}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                    onClick={() => setModoRegistroCliente(true)}
                  >
                    <FaEdit className="mr-2" />
                    Editar Información
                  </button>
                </div>
              </div>
            </div>
          ) : documentoSearch ? (
            <div className="mt-6">
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
                <p className="font-bold">Cliente no encontrado</p>
                <p>No se encontró un cliente con el documento {documentoSearch}. Puede registrarlo ahora.</p>
              </div>
              
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                onClick={() => setModoRegistroCliente(true)}
              >
                <FaUserPlus className="mr-2" />
                Registrar Nuevo Cliente
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
            <p className="font-bold">{clienteEncontrado?.id_cliente ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</p>
            <p>Complete la información del cliente para continuar.</p>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tipo de Documento *
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={nuevoCliente.tipo_documento}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, tipo_documento: e.target.value})}
                  disabled={!!clienteEncontrado?.id_cliente} // No permitir cambiar si es edición
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">Carné de Extranjería</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="RUC">RUC</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Número de Documento *
                </label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={nuevoCliente.numero_documento}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, numero_documento: e.target.value})}
                  disabled={!!clienteEncontrado?.id_cliente} // No permitir cambiar si es edición
                />
              </div>
              
              {(nuevoCliente.tipo_documento === 'DNI' || 
                nuevoCliente.tipo_documento === 'CE' || 
                nuevoCliente.tipo_documento === 'Pasaporte') ? (
                <>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={nuevoCliente.nombres || ''}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, nombres: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={nuevoCliente.apellidos || ''}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, apellidos: e.target.value})}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Razón Social *
                    </label>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={nuevoCliente.razon_social || ''}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, razon_social: e.target.value})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Dirección Fiscal *
                    </label>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={nuevoCliente.direccion_fiscal || ''}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, direccion_fiscal: e.target.value})}
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={nuevoCliente.correo || ''}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, correo: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={nuevoCliente.numero_celular || ''}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, numero_celular: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setModoRegistroCliente(false)}
              >
                Cancelar
              </button>
              
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={guardarCliente}
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2 inline-block"></div>
                ) : null}
                {clienteEncontrado?.id_cliente ? 'Actualizar Cliente' : 'Registrar Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Componente para el paso 3: Selección de pasajes
  const renderPaso3 = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Selección de Pasajes</h2>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
        <p>Seleccione los pasajes o un paquete para la reserva.</p>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Opciones de Reserva</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <button
            className={`flex-1 p-4 rounded-lg flex items-center justify-center ${!usarPaquete ? 'bg-blue-100 border-2 border-blue-500 text-blue-700 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setUsarPaquete(false)}
          >
            <FaTicketAlt className="mr-2" />
            Pasajes Individuales
          </button>
          
          <button
            className={`flex-1 p-4 rounded-lg flex items-center justify-center ${usarPaquete ? 'bg-green-100 border-2 border-green-500 text-green-700 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setUsarPaquete(true)}
            disabled={!instanciaTour?.tour_programado?.paquetes_pasajes?.length}
          >
            <FaBox className="mr-2" />
            Paquete de Pasajes
          </button>
        </div>
        
        {usarPaquete ? (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Paquetes Disponibles</h3>
            
            {instanciaTour?.tour_programado?.paquetes_pasajes?.length ? (
              <div className="space-y-4">
                {instanciaTour.tour_programado.paquetes_pasajes.map(paquete => (
                  <div 
                    key={paquete.id_paquete}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      paqueteSeleccionado?.id_paquete === paquete.id_paquete 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    onClick={() => seleccionarPaquete(paquete)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{paquete.nombre}</h4>
                      <span className="text-lg font-bold text-green-600">S/ {paquete.precio_total.toFixed(2)}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{paquete.descripcion}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        Incluye {paquete.cantidad_total} pasajes
                      </span>
                      
                      {paqueteSeleccionado?.id_paquete === paquete.id_paquete && (
                        <div className="flex items-center">
                          <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-1 rounded-l"
                            onClick={(e) => {
                              e.stopPropagation();
                              actualizarCantidadPaquete(paqueteSeleccionado.cantidad - 1);
                            }}
                            disabled={paqueteSeleccionado.cantidad <= 1}
                          >
                            -
                          </button>
                          
                          <span className="bg-white px-3 py-1 border-t border-b">
                            {paqueteSeleccionado.cantidad}
                          </span>
                          
                          <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-1 rounded-r"
                            onClick={(e) => {
                              e.stopPropagation();
                              actualizarCantidadPaquete(paqueteSeleccionado.cantidad + 1);
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {paqueteSeleccionado && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Subtotal:</span>
                      <span className="font-bold text-xl text-green-600">
                        S/ {paqueteSeleccionado.subtotal?.toFixed(2)}
                      </span>
                    </div>
                    
                    <button
                      className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-1 px-3 rounded text-sm flex items-center"
                      onClick={quitarPaquete}
                    >
                      <FaTrash className="mr-1" />
                      Quitar Selección
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                <p>No hay paquetes disponibles para este tour.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Pasajes Individuales</h3>
            
            {instanciaTour?.tour_programado?.tipos_pasaje?.length ? (
              <div>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-12 gap-4 font-bold text-gray-700">
                    <div className="col-span-6">Tipo de Pasaje</div>
                    <div className="col-span-2 text-center">Precio</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {pasajesSeleccionados.map(pasaje => (
                    <div key={pasaje.id_tipo_pasaje} className="grid grid-cols-12 gap-4 items-center border-b border-gray-200 py-3">
                      <div className="col-span-6">
                        <p className="font-semibold text-gray-800">{pasaje.nombre}</p>
                        <p className="text-sm text-gray-500">
                          {instanciaTour.tour_programado?.tipos_pasaje?.find(
                            tp => tp.id_tipo_pasaje === pasaje.id_tipo_pasaje
                          )?.edad || ''}
                        </p>
                      </div>
                      
                      <div className="col-span-2 text-center font-medium">
                        S/ {pasaje.costo?.toFixed(2)}
                      </div>
                      
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center">
                          <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-1 rounded-l"
                            onClick={() => actualizarCantidadPasaje(pasaje.id_tipo_pasaje, pasaje.cantidad - 1)}
                            disabled={pasaje.cantidad <= 0}
                          >
                            -
                          </button>
                          
                          <span className="bg-white px-3 py-1 border-t border-b min-w-[40px] text-center">
                            {pasaje.cantidad}
                          </span>
                          
                          <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-1 rounded-r"
                            onClick={() => actualizarCantidadPasaje(pasaje.id_tipo_pasaje, pasaje.cantidad + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-2 text-right font-bold text-green-600">
                        S/ {pasaje.subtotal?.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total:</span>
                    <span className="font-bold text-xl text-green-600">
                      S/ {totalReserva.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                <p>No hay tipos de pasaje disponibles para este tour.</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Notas adicionales (opcional)
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            placeholder="Ingrese cualquier información adicional para esta reserva..."
            value={notasReserva}
            onChange={(e) => setNotasReserva(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );

  // Componente para el paso 4: Confirmación de reserva
  const renderPaso4 = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmación de Reserva</h2>
      
      {!reservaCreada ? (
        <>
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
            <p>Revise la información antes de confirmar la reserva.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                <FaShip className="mr-2 text-blue-500" />
                Información del Tour
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Tour</p>
                  <p className="font-semibold">{instanciaTour?.nombre_tipo_tour}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-semibold">{formatearFecha(instanciaTour?.fecha_especifica || '')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Hora de salida</p>
                  <p className="font-semibold">{formatearHora(instanciaTour?.hora_inicio || '')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Embarcación</p>
                  <p className="font-semibold">{instanciaTour?.nombre_embarcacion}</p>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                <FaUser className="mr-2 text-green-500" />
                Información del Cliente
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-semibold">
                    {clienteEncontrado?.tipo_documento === 'RUC' 
                      ? clienteEncontrado?.razon_social 
                      : `${clienteEncontrado?.nombres} ${clienteEncontrado?.apellidos}`}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">{clienteEncontrado?.tipo_documento}</p>
                  <p className="font-semibold">{clienteEncontrado?.numero_documento}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Contacto</p>
                  <p className="font-semibold">{clienteEncontrado?.correo || 'No especificado'}</p>
                  <p className="font-semibold">{clienteEncontrado?.numero_celular || 'No especificado'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
              <FaTicketAlt className="mr-2 text-purple-500" />
              Detalle de Pasajes
            </h3>
            
            {usarPaquete && paqueteSeleccionado ? (
              <div className="mb-4">
                <div className="bg-gray-100 p-3 rounded-lg mb-3 grid grid-cols-12 gap-4 font-bold">
                  <div className="col-span-8">Paquete</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>
                
                <div className="p-3 grid grid-cols-12 gap-4 border-b border-gray-200">
                  <div className="col-span-8">
                    <p className="font-semibold">{paqueteSeleccionado.nombre}</p>
                    <p className="text-sm text-gray-500">Incluye {paqueteSeleccionado.cantidad_total} pasajes</p>
                  </div>
                  
                  <div className="col-span-2 text-center">{paqueteSeleccionado.cantidad}</div>
                  
                  <div className="col-span-2 text-right font-bold">
                    S/ {paqueteSeleccionado.subtotal?.toFixed(2)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <div className="bg-gray-100 p-3 rounded-lg mb-3 grid grid-cols-12 gap-4 font-bold">
                  <div className="col-span-8">Tipo de Pasaje</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>
                
                {pasajesSeleccionados.filter(p => p.cantidad > 0).map(pasaje => (
                  <div key={pasaje.id_tipo_pasaje} className="p-3 grid grid-cols-12 gap-4 border-b border-gray-200">
                    <div className="col-span-8">
                      <p className="font-semibold">{pasaje.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {instanciaTour?.tour_programado?.tipos_pasaje?.find(
                          tp => tp.id_tipo_pasaje === pasaje.id_tipo_pasaje
                        )?.edad || ''}
                      </p>
                    </div>
                    
                    <div className="col-span-2 text-center">{pasaje.cantidad}</div>
                    
                    <div className="col-span-2 text-right font-bold">
                      S/ {pasaje.subtotal?.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {notasReserva && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-700">Notas:</p>
                <p className="text-gray-600">{notasReserva}</p>
              </div>
            )}
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex justify-between items-center">
                           <div>
                <p className="text-gray-700 font-medium">Total a pagar:</p>
                <p className="text-3xl font-bold text-green-600">S/ {totalReserva.toFixed(2)}</p>
              </div>
              
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center transition-all transform hover:scale-105"
                onClick={crearReserva}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                ) : (
                  <FaCheck className="mr-2" />
                )}
                Confirmar Reserva
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="text-green-600 text-3xl" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">¡Reserva Creada Exitosamente!</h3>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto mb-6">
            <p className="text-gray-700 mb-2">Número de Reserva: <span className="font-bold">#{reservaId}</span></p>
            <p className="text-gray-700 mb-2">Total: <span className="font-bold">S/ {totalReserva.toFixed(2)}</span></p>
            <p className="text-gray-700">Estado: <span className="font-bold text-green-600">RESERVADO</span></p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center justify-center"
              onClick={() => navigate(`/vendedor/reservas/${reservaId}`)}
            >
              <FaInfoCircle className="mr-2" />
              Ver Detalles de Reserva
            </button>
            
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center justify-center"
              onClick={() => navigate('/vendedor/tours')}
            >
              <FaShip className="mr-2" />
              Reservar Otro Tour
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Renderizado principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/vendedor/tours')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Volver a Tours
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800">Nueva Reserva</h1>
          
          <div></div> {/* Espacio vacío para mantener el alineamiento */}
        </div>
        
        {/* Stepper */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap justify-between">
            <div className={`step flex-1 flex flex-col items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2 ${currentStep >= 1 ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                1
              </div>
              <span className="text-sm text-center">Detalles del Tour</span>
            </div>
            
            <div className="flex-1 hidden md:block h-0.5 self-center bg-gray-300 mx-4"></div>
            
            <div className={`step flex-1 flex flex-col items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2 ${currentStep >= 2 ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                2
              </div>
              <span className="text-sm text-center">Cliente</span>
            </div>
            
            <div className="flex-1 hidden md:block h-0.5 self-center bg-gray-300 mx-4"></div>
            
            <div className={`step flex-1 flex flex-col items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2 ${currentStep >= 3 ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                3
              </div>
              <span className="text-sm text-center">Pasajes</span>
            </div>
            
            <div className="flex-1 hidden md:block h-0.5 self-center bg-gray-300 mx-4"></div>
            
            <div className={`step flex-1 flex flex-col items-center ${currentStep >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2 ${currentStep >= 4 ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                4
              </div>
              <span className="text-sm text-center">Confirmación</span>
            </div>
          </div>
        </div>
        
        {/* Contenido del paso actual */}
        {currentStep === 1 && renderPaso1()}
        {currentStep === 2 && renderPaso2()}
        {currentStep === 3 && renderPaso3()}
        {currentStep === 4 && renderPaso4()}
        
        {/* Botones de navegación entre pasos */}
        {!reservaCreada && (
          <div className="flex justify-between mt-6">
            <button
              className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg flex items-center ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={retrocederPaso}
              disabled={currentStep === 1}
            >
              <FaArrowLeft className="mr-2" /> Anterior
            </button>
            
            {currentStep < 4 ? (
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center ${!validarPasoActual() ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={avanzarPaso}
                disabled={!validarPasoActual()}
              >
                Siguiente <FaArrowRight className="ml-2" />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default NuevaReservaPage;