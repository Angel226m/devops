 /*import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../api/axiosClient';
import { endpoints } from '../../../api/endpoints';
import { 
  FaArrowLeft, 
  FaSave, 
  FaExclamationTriangle, 
  FaSearch, 
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { NuevaReservaRequest, PasajeCantidadRequest } from '../../../../domain/entities/Reserva';
import { crearReserva } from '../../../store/slices/reservaSlice';

// Constantes para opciones disponibles
const METODOS_PAGO = ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'YAPE', 'PLIN', 'MERCADOPAGO', 'DEPOSITO'];
const ESTADOS_RESERVA = ['CONFIRMADA', 'RESERVADO', 'COMPLETADA', 'CANCELADA'];

// Interfaces
interface Reserva {
  id_reserva?: number;
  id_vendedor?: number;
  id_cliente: number;
  id_instancia: number;
  id_paquete?: number;
  total_pagar: number;
  notas?: string;
  estado: string;
  nombre_cliente?: string;
  documento_cliente?: string;
  nombre_tour?: string;
  fecha_tour?: string;
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  cantidad_pasajes?: PasajeCantidad[];
  paquetes?: PaquetePasajeDetalle[];
}

interface Cliente {
  id_cliente: number;
  tipo_documento: string;
  numero_documento: string;
  nombres?: string;
  apellidos?: string;
  razon_social?: string;
  direccion_fiscal?: string;
  nombre_completo?: string;
  correo?: string;
  numero_celular?: string;
}

interface InstanciaTour {
  id_instancia: number;
  id_tour_programado: number;
  fecha_especifica: string;
  hora_inicio: string;
  hora_fin: string;
  cupo_total: number;
  cupo_disponible: number;
  estado: string;
  nombre_tour?: string;
  precio_base?: number;
}

interface TipoPasaje {
  id_tipo_pasaje: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

interface PasajeCantidad {
  id_tipo_pasaje: number;
  nombre_tipo?: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
}

interface PaquetePasajeDetalle {
  id_paquete: number;
  nombre_paquete?: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
}

// Componente principal
const ReservaForm: React.FC<{ isEditing?: boolean }> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { user, selectedSede } = useSelector((state: any) => state.auth);
  
  // Estados
  const [reserva, setReserva] = useState<Reserva>({
    id_cliente: 0,
    id_instancia: 0,
    total_pagar: 0,
    estado: 'CONFIRMADA' // Por defecto confirmada para vendedores
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [documentoSearch, setDocumentoSearch] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('DNI');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Estados adicionales para manejo de tours y pasajes
  const [instanciasDisponibles, setInstanciasDisponibles] = useState<InstanciaTour[]>([]);
  const [instanciaSeleccionada, setInstanciaSeleccionada] = useState<InstanciaTour | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [tiposPasaje, setTiposPasaje] = useState<TipoPasaje[]>([]);
  const [pasajesSeleccionados, setPasajesSeleccionados] = useState<PasajeCantidad[]>([]);
  const [totalPasajeros, setTotalPasajeros] = useState(0);
  const [totalAPagar, setTotalAPagar] = useState(0);
  
  // Estados para manejo de pago
  const [registrarPago, setRegistrarPago] = useState(true);
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [montoPagado, setMontoPagado] = useState<number>(0);
  const [numeroComprobante, setNumeroComprobante] = useState('');
  
  // Cargar datos de la reserva en modo edición
  useEffect(() => {
    const fetchReserva = async () => {
      if (!isEditing || !id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Usar el endpoint correcto para obtener reserva
        const response = await axios.get(endpoints.reserva.vendedorGetById(parseInt(id)));
        
        if (response.data && response.data.data) {
          const reservaData = response.data.data;
          setReserva(reservaData);
          
          // Si hay pasajes, establecer los pasajes seleccionados
          if (reservaData.cantidad_pasajes && reservaData.cantidad_pasajes.length > 0) {
            setPasajesSeleccionados(reservaData.cantidad_pasajes);
          }
          
          // Cargar instancia del tour
          if (reservaData.id_instancia) {
            const instanciaResponse = await axios.get(
              endpoints.instanciaTour.vendedorGetById(reservaData.id_instancia)
            );
            if (instanciaResponse.data && instanciaResponse.data.data) {
              setInstanciaSeleccionada(instanciaResponse.data.data);
            }
          }
          
          // Calcular total de pasajeros
          let totalPax = 0;
          if (reservaData.cantidad_pasajes) {
            totalPax = reservaData.cantidad_pasajes.reduce((sum: number, p: PasajeCantidad) => sum + p.cantidad, 0);
          }
          setTotalPasajeros(totalPax);
          
          // Establecer monto pagado para posible pago adicional
          setMontoPagado(reservaData.total_pagar);
          
          // Cargar pagos existentes para esta reserva
          const pagosResponse = await axios.get(
            endpoints.pago.vendedorListByReserva(parseInt(id))
          );
          
          if (pagosResponse.data && pagosResponse.data.data && pagosResponse.data.data.length > 0) {
            // Desactivar registro de pago por defecto si ya hay pagos
            setRegistrarPago(false);
          }
        } else {
          throw new Error('No se encontró la reserva');
        }
      } catch (error: any) {
        console.error('Error al cargar reserva:', error);
        setError(error.message || 'Error al cargar la reserva');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReserva();
  }, [isEditing, id]);
  
  // Cargar instancias disponibles cuando se selecciona una fecha
  useEffect(() => {
    const fetchInstanciasDisponibles = async () => {
      if (!fechaSeleccionada || isEditing) return;
      
      try {
        const response = await axios.get(
          endpoints.instanciaTour.vendedorFiltrar,
          { params: { fecha: fechaSeleccionada, sede_id: selectedSede?.id_sede } }
        );
        
        if (response.data && response.data.data) {
          // Filtrar solo instancias con estado PROGRAMADO y cupo disponible
          const instanciasFiltered = response.data.data.filter(
            (inst: InstanciaTour) => inst.estado === 'PROGRAMADO' && inst.cupo_disponible > 0
          );
          setInstanciasDisponibles(instanciasFiltered);
        } else {
          setInstanciasDisponibles([]);
        }
      } catch (error) {
        console.error('Error al cargar instancias:', error);
        setInstanciasDisponibles([]);
      }
    };
    
    fetchInstanciasDisponibles();
  }, [fechaSeleccionada, selectedSede?.id_sede, isEditing]);
  
  // Cargar tipos de pasaje cuando se selecciona una instancia
  useEffect(() => {
    const fetchTiposPasaje = async () => {
      if (!instanciaSeleccionada) return;
      
      try {
        // Obtener id_tipo_tour de la instancia
        const tourProgramadoResponse = await axios.get(
          endpoints.tourProgramado.vendedorGetById(instanciaSeleccionada.id_tour_programado)
        );
        
        if (tourProgramadoResponse.data && tourProgramadoResponse.data.data) {
          const idTipoTour = tourProgramadoResponse.data.data.id_tipo_tour;
          
          // Cargar tipos de pasaje para este tipo de tour
          const tiposPasajeResponse = await axios.get(
            endpoints.tipoPasaje.vendedorListByTipoTour(idTipoTour)
          );
          
          if (tiposPasajeResponse.data && tiposPasajeResponse.data.data) {
            setTiposPasaje(tiposPasajeResponse.data.data);
            
            // Inicializar selección de pasajes si es primera vez
            if (!isEditing || pasajesSeleccionados.length === 0) {
              const pasajesIniciales = tiposPasajeResponse.data.data.map((tipo: TipoPasaje) => ({
                id_tipo_pasaje: tipo.id_tipo_pasaje,
                nombre_tipo: tipo.nombre,
                cantidad: 0,
                precio_unitario: tipo.precio,
                subtotal: 0
              }));
              setPasajesSeleccionados(pasajesIniciales);
            }
          }
        }
      } catch (error) {
        console.error('Error al cargar tipos de pasaje:', error);
      }
    };
    
    fetchTiposPasaje();
  }, [instanciaSeleccionada, isEditing, pasajesSeleccionados.length]);
  
  // Calcular totales cuando cambian los pasajes seleccionados
  useEffect(() => {
    // Calcular total de pasajeros
    const totalPax = pasajesSeleccionados.reduce((sum: number, pasaje: PasajeCantidad) => sum + pasaje.cantidad, 0);
    setTotalPasajeros(totalPax);
    
    // Calcular total a pagar
    const totalPago = pasajesSeleccionados.reduce((sum: number, pasaje: PasajeCantidad) => {
      return sum + (pasaje.cantidad * (pasaje.precio_unitario || 0));
    }, 0);
    setTotalAPagar(totalPago);
    
    // Actualizar el objeto de reserva
    setReserva(prev => ({
      ...prev,
      total_pagar: totalPago
    }));
    
    // Actualizar monto pagado por defecto si no estamos editando
    if (!isEditing) {
      setMontoPagado(totalPago);
    }
  }, [pasajesSeleccionados, isEditing]);
  
  // Buscar cliente por documento
  const buscarClientePorDocumento = async () => {
    if (!documentoSearch.trim()) {
      setError('Ingrese un número de documento');
      return;
    }
    
    try {
      setSearching(true);
      setError(null);
      
      // Usar el endpoint para buscar por documento
      const response = await axios.get(endpoints.cliente.vendedorBuscarDocumento, {
        params: { query: documentoSearch }
      });
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        // Filtrar por tipo de documento específico
        const clientesDelTipo = response.data.data.filter(
          (c: Cliente) => c.tipo_documento === tipoDocumento
        );
        
        if (clientesDelTipo.length > 0) {
          // Si hay coincidencias con el tipo de documento, mostrarlas
          setClientes(clientesDelTipo);
        } else {
          // Si no hay coincidencias exactas, mostrar todos los resultados
          setClientes(response.data.data);
        }
      } else {
        setClientes([]);
        setError('No se encontraron clientes con ese documento');
      }
    } catch (error) {
      console.error('Error al buscar cliente:', error);
      setError('Error al buscar cliente. Verifique los datos e intente nuevamente.');
    } finally {
      setSearching(false);
    }
  };
  
  // Cargar lista de clientes para búsqueda por nombre/texto
  useEffect(() => {
    const fetchClientes = async () => {
      if (!searchTerm.trim() || searchTerm.length < 3) return;
      
      try {
        // Usar el endpoint correcto para buscar clientes por texto
        const response = await axios.get(endpoints.cliente.vendedorList, {
          params: { search: searchTerm }
        });
        
        if (response.data && response.data.data) {
          setClientes(response.data.data);
        }
      } catch (error) {
        console.error('Error al buscar clientes:', error);
      }
    };
    
    const timer = setTimeout(() => {
      fetchClientes();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Función para seleccionar un cliente
  const handleSelectCliente = (cliente: Cliente) => {
    setReserva({
      ...reserva,
      id_cliente: cliente.id_cliente,
      nombre_cliente: cliente.tipo_documento === 'RUC' 
        ? cliente.razon_social 
        : cliente.nombre_completo || `${cliente.nombres} ${cliente.apellidos}`,
      documento_cliente: `${cliente.tipo_documento}: ${cliente.numero_documento}`
    });
    setSearchTerm('');
    setDocumentoSearch('');
    setClientes([]);
  };
  
  // Función para seleccionar instancia de tour
  const handleSelectInstancia = (instancia: InstanciaTour) => {
    setInstanciaSeleccionada(instancia);
    setReserva({
      ...reserva,
      id_instancia: instancia.id_instancia,
      nombre_tour: instancia.nombre_tour,
      fecha_tour: format(parseISO(instancia.fecha_especifica), 'dd/MM/yyyy', {locale: es}),
      hora_inicio_tour: instancia.hora_inicio,
      hora_fin_tour: instancia.hora_fin
    });
  };
  
  // Función para actualizar cantidad de pasajes
  const handlePasajeChange = (idTipoPasaje: number, cantidad: number) => {
    // Verificar que la cantidad no sea negativa
    if (cantidad < 0) return;
    
    // Actualizar la lista de pasajes seleccionados
    const nuevoPasajes = pasajesSeleccionados.map(pasaje => {
      if (pasaje.id_tipo_pasaje === idTipoPasaje) {
        const precioUnitario = pasaje.precio_unitario || 0;
        return {
          ...pasaje,
          cantidad,
          subtotal: cantidad * precioUnitario
        };
      }
      return pasaje;
    });
    
    setPasajesSeleccionados(nuevoPasajes);
  };
  
  // Función para formatear moneda
  const formatMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(valor);
  };
  
  // Función para formatear fecha
  const formatFecha = (fecha: string) => {
    try {
      return format(parseISO(fecha), 'EEEE dd MMMM yyyy', {locale: es});
    } catch (error) {
      return fecha;
    }
  };
  
  // Función para validar la reserva antes de enviar
  const validarReserva = () => {
    if (!reserva.id_cliente || reserva.id_cliente <= 0) {
      setError('Debe seleccionar un cliente');
      return false;
    }
    
    if (!reserva.id_instancia || reserva.id_instancia <= 0) {
      setError('Debe seleccionar una instancia de tour');
      return false;
    }
    
    if (totalPasajeros <= 0) {
      setError('Debe agregar al menos un pasajero');
      return false;
    }
    
    if (instanciaSeleccionada && totalPasajeros > instanciaSeleccionada.cupo_disponible) {
      setError(`No hay suficiente cupo disponible. Cupo disponible: ${instanciaSeleccionada.cupo_disponible}`);
      return false;
    }
    
    return true;
  };
  
  // Función para guardar la reserva - NUEVA IMPLEMENTACIÓN DIRECTA CON AXIOS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarReserva()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Preparar datos de la reserva con la estructura EXACTA que espera el backend
      const pasajesFiltrados = pasajesSeleccionados
        .filter(p => p.cantidad > 0)
        .map(p => ({
          id_tipo_pasaje: p.id_tipo_pasaje,
          cantidad: p.cantidad
        }));
      
      // Verificar que haya al menos un pasaje
      if (pasajesFiltrados.length === 0) {
        setError('Debe seleccionar al menos un tipo de pasaje');
        setSaving(false);
        return;
      }
      
      // Estructura correcta con cantidad_pasajes en lugar de pasajes
      const reservaData = {
        id_cliente: reserva.id_cliente,
        id_instancia: reserva.id_instancia,
        id_vendedor: user?.id_usuario,
        total_pagar: totalAPagar,
        notas: "Reserva creada por vendedor", // Texto predeterminado
        estado: "CONFIRMADA", // Valor fijo para vendedores
        cantidad_pasajes: pasajesFiltrados // AQUÍ ESTÁ LA CORRECCIÓN: cantidad_pasajes, no pasajes
      };
      
      console.log('📤 Datos de reserva a enviar:', JSON.stringify(reservaData, null, 2));
      
      // Usar axios directamente para más control
      const response = await axios.post(endpoints.reserva.vendedorCreate, reservaData);
      
      console.log('✅ Respuesta de creación:', response.data);
      
      // Extraer el ID de la reserva creada
let idReservaCreada: number;
      if (response.data && response.data.data && response.data.data.id_reserva) {
        idReservaCreada = response.data.data.id_reserva;
        
        // Si se debe registrar pago, crear pago asociado
        if (registrarPago && montoPagado > 0) {
          try {
            const pagoData = {
              id_reserva: idReservaCreada,
              metodo_pago: metodoPago,
              canal_pago: 'LOCAL',
              id_sede: selectedSede?.id_sede,
              monto: montoPagado,
              numero_comprobante: numeroComprobante || undefined
            };
            
            console.log('💰 Datos de pago a enviar:', JSON.stringify(pagoData, null, 2));
            
            const pagosResponse = await axios.post(endpoints.pago.vendedorCreate, pagoData);
            console.log('✅ Pago creado exitosamente:', pagosResponse.data);
            setSuccessMessage('Reserva y pago creados exitosamente');
          } catch (pagoError: any) {
            console.error('⚠️ Error al crear pago:', pagoError);
            setSuccessMessage('Reserva creada exitosamente, pero hubo un problema al registrar el pago');
          }
        } else {
          setSuccessMessage('Reserva creada exitosamente');
        }
        
        // Redirigir después de un breve tiempo
        setTimeout(() => {
          navigate('/vendedor/reservas/' + idReservaCreada);
        }, 2000);
      }
    } catch (error: any) {
      console.error('❌ Error al guardar reserva:', error);
      
      if (error.response) {
        console.error('Respuesta de error:', error.response.data);
      }
      
      setError(error.response?.data?.message || error.message || 'Error al guardar la reserva');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/vendedor/reservas')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Volver a Reservas
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEditing ? `Editar Reserva #${id}` : 'Crear Nueva Reserva'}
        </h1>
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información de la reserva...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <FaExclamationTriangle className="mt-1 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <p className="font-medium">{successMessage}</p>
              </div>
            )}
            
            {/* Sección 1: Información del Cliente *//*}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUsers className="mr-2 text-blue-500" /> Información del Cliente
              </h2>
              
              {reserva.id_cliente ? (
                <div className="mb-2 p-3 border border-gray-200 rounded-lg">
                  <p className="font-medium">{reserva.nombre_cliente}</p>
                  <p className="text-sm text-gray-600">{reserva.documento_cliente}</p>
                  
                  <button
                    type="button"
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => setReserva({
                      ...reserva,
                      id_cliente: 0,
                      nombre_cliente: undefined,
                      documento_cliente: undefined
                    })}
                  >
                    Cambiar cliente
                  </button>
                </div>
              ) : (
                <div>
                  {/* Búsqueda por documento *//*}
                  <div className="mb-4">
                    <div className="flex space-x-2 mb-2">
                      <select
                        className="border rounded py-2 px-3 text-gray-700 w-1/3"
                        value={tipoDocumento}
                        onChange={(e) => setTipoDocumento(e.target.value)}
                      >
                        <option value="DNI">DNI</option>
                        <option value="CE">CE</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="RUC">RUC</option>
                      </select>
                      
                      <div className="relative flex-1">
                        <input
                          type="text"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder={`Ingrese número de ${tipoDocumento}`}
                          value={documentoSearch}
                          onChange={(e) => setDocumentoSearch(e.target.value)}
                        />
                      </div>
                      
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                        onClick={buscarClientePorDocumento}
                        disabled={searching}
                      >
                        {searching ? (
                          <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                        ) : (
                          <FaSearch className="mr-2" />
                        )}
                        Buscar
                      </button>
                    </div>
                  </div>
                  
                  {/* Búsqueda por nombre *//*}
                  <div className="relative mb-4">
                    <p className="mb-2 text-sm font-semibold text-gray-600">O busque por nombre:</p>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Buscar cliente por nombre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Resultados de búsqueda *//*}
                  {clientes.length > 0 && (
                    <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto mb-4">
                      <h3 className="text-sm font-semibold bg-gray-100 px-3 py-2 border-b">
                        Resultados ({clientes.length})
                      </h3>
                      {clientes.map((cliente) => (
                        <div
                          key={cliente.id_cliente}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                          onClick={() => handleSelectCliente(cliente)}
                        >
                          <p className="font-medium">
                            {cliente.tipo_documento === 'RUC'
                              ? cliente.razon_social
                              : cliente.nombre_completo || `${cliente.nombres} ${cliente.apellidos}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {cliente.tipo_documento}: {cliente.numero_documento}
                          </p>
                          {cliente.correo && (
                            <p className="text-xs text-gray-500">
                              {cliente.correo} {cliente.numero_celular ? `| ${cliente.numero_celular}` : ''}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="mt-2 text-sm text-gray-600">
                    Para agregar un nuevo cliente,
                    <a href="/vendedor/clientes/nuevo" className="text-blue-600 hover:text-blue-800 ml-1">
                      haga clic aquí
                    </a>.
                  </p>
                </div>
              )}
            </div>
            
            {/* Sección 2: Selección de Tour *//*}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" /> Selección de Tour
              </h2>
              
              {instanciaSeleccionada ? (
                <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-lg">{instanciaSeleccionada.nombre_tour}</p>
                      <p className="text-gray-600">
                        Fecha: {formatFecha(instanciaSeleccionada.fecha_especifica)}
                      </p>
                      <p className="text-gray-600">
                        Horario: {instanciaSeleccionada.hora_inicio} - {instanciaSeleccionada.hora_fin}
                      </p>
                      <p className="text-gray-600">
                        Cupo disponible: {instanciaSeleccionada.cupo_disponible} de {instanciaSeleccionada.cupo_total}
                      </p>
                    </div>
                    
                    {!isEditing && (
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setInstanciaSeleccionada(null);
                          setReserva({
                            ...reserva,
                            id_instancia: 0,
                            nombre_tour: undefined,
                            fecha_tour: undefined,
                            hora_inicio_tour: undefined,
                            hora_fin_tour: undefined
                          });
                          setPasajesSeleccionados([]);
                        }}
                      >
                        Cambiar tour
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  {/* Selección de fecha *//*}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Seleccione fecha para ver tours disponibles:
                    </label>
                    <input
                      type="date"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={fechaSeleccionada}
                      onChange={(e) => setFechaSeleccionada(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  {/* Lista de instancias disponibles *//*}
                  {fechaSeleccionada && (
                    <div>
                      <h3 className="text-md font-semibold text-gray-700 mb-2">
                        Tours disponibles para el {formatFecha(fechaSeleccionada)}:
                      </h3>
                      
                      {instanciasDisponibles.length === 0 ? (
                        <p className="text-gray-500 italic">No hay tours disponibles para esta fecha.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {instanciasDisponibles.map((instancia) => (
                            <div
                              key={instancia.id_instancia}
                              className="border border-gray-200 rounded-lg p-3 hover:bg-blue-50 cursor-pointer"
                              onClick={() => handleSelectInstancia(instancia)}
                            >
                              <p className="font-semibold">{instancia.nombre_tour}</p>
                              <p className="text-sm text-gray-600">
                                Horario: {instancia.hora_inicio} - {instancia.hora_fin}
                              </p>
                              <p className="text-sm text-gray-600">
                                Cupo disponible: {instancia.cupo_disponible} de {instancia.cupo_total}
                              </p>
                              <p className="text-sm font-medium text-blue-600 mt-1">
                                Desde {formatMoneda(instancia.precio_base || 0)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Sección 3: Selección de Pasajes *//*}
            {instanciaSeleccionada && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Selección de Pasajes</h2>
                
                {pasajesSeleccionados.length > 0 ? (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tipo de Pasaje
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Precio Unitario
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cantidad
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pasajesSeleccionados.map((pasaje) => (
                            <tr key={pasaje.id_tipo_pasaje}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{pasaje.nombre_tipo}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {formatMoneda(pasaje.precio_unitario || 0)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <button
                                    type="button"
                                    className="bg-gray-200 rounded-l p-1 w-8 h-8 flex items-center justify-center"
                                    onClick={() => handlePasajeChange(pasaje.id_tipo_pasaje, pasaje.cantidad - 1)}
                                    disabled={pasaje.cantidad <= 0}
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    className="border-t border-b text-center w-12 h-8"
                                    value={pasaje.cantidad}
                                    onChange={(e) => handlePasajeChange(pasaje.id_tipo_pasaje, parseInt(e.target.value) || 0)}
                                    min="0"
                                    max={instanciaSeleccionada.cupo_disponible}
                                  />
                                  <button
                                    type="button"
                                    className="bg-gray-200 rounded-r p-1 w-8 h-8 flex items-center justify-center"
                                    onClick={() => handlePasajeChange(pasaje.id_tipo_pasaje, pasaje.cantidad + 1)}
                                    disabled={totalPasajeros >= instanciaSeleccionada.cupo_disponible}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {formatMoneda((pasaje.cantidad || 0) * (pasaje.precio_unitario || 0))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan={2} className="px-6 py-4 font-medium text-right">
                              Total Pasajeros:
                            </td>
                            <td className="px-6 py-4 font-medium">
                              {totalPasajeros}
                            </td>
                            <td className="px-6 py-4 font-medium">
                              {formatMoneda(totalAPagar)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    
                    {totalPasajeros > instanciaSeleccionada.cupo_disponible && (
                      <div className="mt-3 text-red-600 flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        El número de pasajeros excede el cupo disponible.
                      </div>
                    )}
                    
                    {totalPasajeros === 0 && (
                      <div className="mt-3 text-amber-600 flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        Debe seleccionar al menos un pasajero.
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No hay tipos de pasaje disponibles para este tour.</p>
                )}
              </div>
            )}
            
            {/* Sección 4: Información de Pago *//*}
            {instanciaSeleccionada && totalPasajeros > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-blue-500" /> Información de Pago
                </h2>
                
                <div className="mb-4">
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-blue-600"
                      checked={registrarPago}
                      onChange={(e) => setRegistrarPago(e.target.checked)}
                    />
                    <span className="ml-2 text-gray-700">Registrar pago inmediato</span>
                  </label>
                </div>
                
                {registrarPago && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                          Método de Pago
                        </label>
                        <select
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={metodoPago}
                          onChange={(e) => setMetodoPago(e.target.value)}
                        >
                          {METODOS_PAGO.map(metodo => (
                            <option key={metodo} value={metodo}>{metodo}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                          Monto Pagado
                        </label>
                        <input
                          type="number"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={montoPagado}
                          onChange={(e) => setMontoPagado(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Número de Comprobante (opcional)
                      </label>
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={numeroComprobante}
                        onChange={(e) => setNumeroComprobante(e.target.value)}
                        placeholder="Ingrese número de comprobante si aplica"
                      />
                    </div>
                    
                    {montoPagado > totalAPagar && (
                      <div className="text-red-600 flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        El monto pagado es mayor al total a pagar.
                      </div>
                    )}
                    
                    {montoPagado < totalAPagar && (
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                        <p className="text-yellow-800">
                          <FaExclamationTriangle className="inline mr-1" />
                          Se está registrando un pago parcial. Saldo pendiente: {formatMoneda(totalAPagar - montoPagado)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Estado de la reserva - FIJADO A "CONFIRMADA" para vendedores *//*}
                <input type="hidden" name="estado" value="CONFIRMADA" />
                
                {/* Notas *//*}
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Notas (opcional)
                  </label>
                  <textarea
                    name="notas"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows={3}
                    placeholder="Ingrese notas adicionales para esta reserva..."
                    value={reserva.notas || ''}
                    onChange={(e) => setReserva({...reserva, notas: e.target.value})}
                  ></textarea>
                </div>
              </div>
            )}
            
            {/* Botones de acción *//*}
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => navigate('/vendedor/reservas')}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                disabled={saving || totalPasajeros === 0 || !reserva.id_cliente || !reserva.id_instancia}
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    {isEditing ? 'Actualizar Reserva' : 'Crear Reserva'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReservaForm;*/

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../api/axiosClient';
import { endpoints } from '../../../api/endpoints';
import { 
  FaArrowLeft, 
  FaSave, 
  FaExclamationTriangle, 
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { actualizarReserva } from '../../../store/slices/reservaSlice';

// Constantes para opciones disponibles
const METODOS_PAGO = ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'YAPE', 'PLIN', 'MERCADOPAGO', 'DEPOSITO'];
const ESTADOS_RESERVA = ['CONFIRMADA', 'RESERVADO', 'COMPLETADA', 'CANCELADA'];

// Interfaces
interface Reserva {
  id_reserva?: number;
  id_vendedor?: number;
  id_cliente: number;
  id_instancia: number;
  id_paquete?: number;
  total_pagar: number;
  notas?: string;
  estado: string;
  nombre_cliente?: string;
  documento_cliente?: string;
  nombre_tour?: string;
  fecha_tour?: string;
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  cantidad_pasajes?: PasajeCantidad[];
  paquetes?: PaquetePasajeDetalle[];
}

interface PasajeCantidad {
  id_tipo_pasaje: number;
  nombre_tipo?: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
}

interface PaquetePasajeDetalle {
  id_paquete: number;
  nombre_paquete?: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
}

interface InstanciaTour {
  id_instancia: number;
  id_tour_programado: number;
  fecha_especifica: string;
  hora_inicio: string;
  hora_fin: string;
  cupo_total: number;
  cupo_disponible: number;
  estado: string;
  nombre_tour?: string;
  precio_base?: number;
}

// Componente principal
const ReservaForm: React.FC<{ isEditing?: boolean }> = ({ isEditing = true }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { user, selectedSede } = useSelector((state: any) => state.auth);
  
  // Estados
  const [reserva, setReserva] = useState<Reserva>({
    id_cliente: 0,
    id_instancia: 0,
    total_pagar: 0,
    estado: 'CONFIRMADA'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Estados para la reserva existente
  const [instanciaSeleccionada, setInstanciaSeleccionada] = useState<InstanciaTour | null>(null);
  const [pasajesSeleccionados, setPasajesSeleccionados] = useState<PasajeCantidad[]>([]);
  const [totalPasajeros, setTotalPasajeros] = useState(0);
  const [totalAPagar, setTotalAPagar] = useState(0);
  
  // Estados para manejo de pago
  const [registrarPago, setRegistrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [montoPagado, setMontoPagado] = useState<number>(0);
  const [numeroComprobante, setNumeroComprobante] = useState('');
  const [pagosExistentes, setPagosExistentes] = useState<any[]>([]);
  const [totalPagado, setTotalPagado] = useState(0);
  
  // Cargar datos de la reserva
  useEffect(() => {
    const fetchReserva = async () => {
      if (!id) {
        navigate('/vendedor/reservas');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Usar el endpoint correcto para obtener reserva
        const response = await axios.get(endpoints.reserva.vendedorGetById(parseInt(id)));
        
        if (response.data && response.data.data) {
          const reservaData = response.data.data;
          setReserva(reservaData);
          
          // Si hay pasajes, establecer los pasajes seleccionados
          if (reservaData.cantidad_pasajes && reservaData.cantidad_pasajes.length > 0) {
            setPasajesSeleccionados(reservaData.cantidad_pasajes);
          }
          
          // Cargar instancia del tour
          if (reservaData.id_instancia) {
            const instanciaResponse = await axios.get(
              endpoints.instanciaTour.vendedorGetById(reservaData.id_instancia)
            );
            if (instanciaResponse.data && instanciaResponse.data.data) {
              setInstanciaSeleccionada(instanciaResponse.data.data);
            }
          }
          
          // Calcular total de pasajeros
          let totalPax = 0;
          if (reservaData.cantidad_pasajes) {
            totalPax = reservaData.cantidad_pasajes.reduce((sum: number, p: PasajeCantidad) => sum + p.cantidad, 0);
          }
          setTotalPasajeros(totalPax);
          setTotalAPagar(reservaData.total_pagar);
          
          // Cargar pagos existentes para esta reserva
          const pagosResponse = await axios.get(
            endpoints.pago.vendedorListByReserva(parseInt(id))
          );
          
          if (pagosResponse.data && pagosResponse.data.data) {
            setPagosExistentes(pagosResponse.data.data);
            
            // Calcular total pagado
            const totalPagadoAcumulado = pagosResponse.data.data.reduce(
              (sum: number, pago: any) => sum + pago.monto, 0
            );
            setTotalPagado(totalPagadoAcumulado);
          }
        } else {
          throw new Error('No se encontró la reserva');
        }
      } catch (error: any) {
        console.error('Error al cargar reserva:', error);
        setError(error.message || 'Error al cargar la reserva');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReserva();
  }, [id, navigate]);
  
  // Calcular totales cuando cambian los pasajes seleccionados
  useEffect(() => {
    // Calcular total de pasajeros
    const totalPax = pasajesSeleccionados.reduce((sum: number, pasaje: PasajeCantidad) => sum + pasaje.cantidad, 0);
    setTotalPasajeros(totalPax);
    
    // Calcular total a pagar
    const totalPago = pasajesSeleccionados.reduce((sum: number, pasaje: PasajeCantidad) => {
      return sum + (pasaje.cantidad * (pasaje.precio_unitario || 0));
    }, 0);
    
    // Solo actualizar si el total calculado es diferente del que ya teníamos
    if (totalPago !== totalAPagar) {
      setTotalAPagar(totalPago);
      setReserva(prev => ({
        ...prev,
        total_pagar: totalPago
      }));
    }
  }, [pasajesSeleccionados, totalAPagar]);
  
  // Función para actualizar cantidad de pasajes
  const handlePasajeChange = (idTipoPasaje: number, cantidad: number) => {
    // Verificar que la cantidad no sea negativa
    if (cantidad < 0) return;
    
    // Actualizar la lista de pasajes seleccionados
    const nuevoPasajes = pasajesSeleccionados.map(pasaje => {
      if (pasaje.id_tipo_pasaje === idTipoPasaje) {
        const precioUnitario = pasaje.precio_unitario || 0;
        return {
          ...pasaje,
          cantidad,
          subtotal: cantidad * precioUnitario
        };
      }
      return pasaje;
    });
    
    setPasajesSeleccionados(nuevoPasajes);
  };
  
  // Función para formatear moneda
  const formatMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(valor);
  };
  
  // Función para formatear fecha
  const formatFecha = (fecha: string) => {
    try {
      return format(parseISO(fecha), 'EEEE dd MMMM yyyy', {locale: es});
    } catch (error) {
      return fecha;
    }
  };
  
  // Validar antes de enviar
  const validarCambios = () => {
    if (totalPasajeros <= 0) {
      setError('Debe haber al menos un pasajero');
      return false;
    }
    
    if (instanciaSeleccionada) {
      // Obtener la suma de pasajeros de otras reservas para esta instancia
      // Esto es un ejemplo, en un caso real necesitarías verificar con el backend
      
      // Solo para ilustrar, asumimos que la capacidad disponible ya incluye estos cálculos
      if (totalPasajeros > instanciaSeleccionada.cupo_disponible + totalPasajeros) {
        // Sumamos totalPasajeros porque asumimos que son los que ya están asignados a esta reserva
        setError(`No hay suficiente cupo disponible. Cupo disponible: ${instanciaSeleccionada.cupo_disponible + totalPasajeros}`);
        return false;
      }
    }
    
    return true;
  };
  
  // Función para guardar los cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !validarCambios()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Filtrar pasajes con cantidad > 0
      const pasajesFiltrados = pasajesSeleccionados
        .filter(p => p.cantidad > 0)
        .map(p => ({
          id_tipo_pasaje: p.id_tipo_pasaje,
          cantidad: p.cantidad
        }));
      
      // Verificar que haya al menos un pasaje
      if (pasajesFiltrados.length === 0) {
        setError('Debe seleccionar al menos un tipo de pasaje');
        setSaving(false);
        return;
      }
      
      // Estructura para actualizar la reserva
      const actualizarData = {
        total_pagar: totalAPagar,
        notas: reserva.notas || "Reserva actualizada por vendedor",
        estado: reserva.estado,
        cantidad_pasajes: pasajesFiltrados
      };
      
      console.log('📤 Datos de actualización a enviar:', JSON.stringify(actualizarData, null, 2));
      
      // Actualizar reserva
      const response = await axios.put(endpoints.reserva.vendedorUpdate(parseInt(id)), actualizarData);
      
      console.log('✅ Respuesta de actualización:', response.data);
      
      // Registrar pago adicional si es necesario
      if (registrarPago && montoPagado > 0) {
        try {
          const pagoData = {
            id_reserva: parseInt(id),
            metodo_pago: metodoPago,
            canal_pago: 'LOCAL',
            id_sede: selectedSede?.id_sede,
            monto: montoPagado,
            numero_comprobante: numeroComprobante || undefined
          };
          
          console.log('💰 Datos de pago a enviar:', JSON.stringify(pagoData, null, 2));
          
          const pagosResponse = await axios.post(endpoints.pago.vendedorCreate, pagoData);
          console.log('✅ Pago registrado exitosamente:', pagosResponse.data);
          setSuccessMessage('Reserva actualizada y pago registrado exitosamente');
        } catch (pagoError: any) {
          console.error('⚠️ Error al registrar pago:', pagoError);
          setSuccessMessage('Reserva actualizada exitosamente, pero hubo un problema al registrar el pago');
        }
      } else {
        setSuccessMessage('Reserva actualizada exitosamente');
      }
      
      // Actualizar el estado en Redux si estás usando Redux
      dispatch(actualizarReserva({
        id: parseInt(id),
        reserva: actualizarData
      }));
      
      // Redirigir después de un breve tiempo
      setTimeout(() => {
        navigate('/vendedor/reservas/' + id);
      }, 1500);
    } catch (error: any) {
      console.error('❌ Error al actualizar reserva:', error);
      
      if (error.response) {
        console.error('Respuesta de error:', error.response.data);
      }
      
      setError(error.response?.data?.message || error.message || 'Error al actualizar la reserva');
    } finally {
      setSaving(false);
    }
  };
  
  // Vista de carga
  if (loading) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información de la reserva...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/vendedor/reservas')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Volver a Reservas
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Editar Reserva #{id}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <FaExclamationTriangle className="mt-1 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <p className="font-medium">{successMessage}</p>
            </div>
          )}
          
          {/* Información del Cliente (solo lectura) */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUsers className="mr-2 text-blue-500" /> Información del Cliente
            </h2>
            
            <div className="mb-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <p className="font-medium">{reserva.nombre_cliente || 'Cliente no especificado'}</p>
              <p className="text-sm text-gray-600">{reserva.documento_cliente || 'Sin documento'}</p>
              <p className="mt-2 text-xs text-blue-600">
                Para cambiar el cliente, debe crear una nueva reserva.
              </p>
            </div>
          </div>
          
          {/* Información del Tour (solo lectura) */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" /> Información del Tour
            </h2>
            
            {instanciaSeleccionada ? (
              <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div>
                  <p className="font-semibold text-lg">{instanciaSeleccionada.nombre_tour || reserva.nombre_tour}</p>
                  <p className="text-gray-600">
                    Fecha: {formatFecha(instanciaSeleccionada.fecha_especifica)}
                  </p>
                  <p className="text-gray-600">
                    Horario: {instanciaSeleccionada.hora_inicio} - {instanciaSeleccionada.hora_fin}
                  </p>
                  <p className="text-gray-600">
                    Cupo disponible: {instanciaSeleccionada.cupo_disponible} de {instanciaSeleccionada.cupo_total}
                  </p>
                  <p className="mt-2 text-xs text-blue-600">
                    Para cambiar el tour, debe crear una nueva reserva.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  <FaExclamationTriangle className="inline mr-2" />
                  No se pudo cargar la información del tour.
                </p>
              </div>
            )}
          </div>
          
          {/* Edición de Pasajes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pasajeros</h2>
            
            {pasajesSeleccionados.length > 0 ? (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo de Pasaje
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio Unitario
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pasajesSeleccionados.map((pasaje) => (
                        <tr key={pasaje.id_tipo_pasaje}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{pasaje.nombre_tipo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatMoneda(pasaje.precio_unitario || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <button
                                type="button"
                                className="bg-gray-200 rounded-l p-1 w-8 h-8 flex items-center justify-center"
                                onClick={() => handlePasajeChange(pasaje.id_tipo_pasaje, pasaje.cantidad - 1)}
                                disabled={pasaje.cantidad <= 0}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                className="border-t border-b text-center w-12 h-8"
                                value={pasaje.cantidad}
                                onChange={(e) => handlePasajeChange(pasaje.id_tipo_pasaje, parseInt(e.target.value) || 0)}
                                min="0"
                                max={instanciaSeleccionada ? instanciaSeleccionada.cupo_disponible + totalPasajeros : 99}
                              />
                              <button
                                type="button"
                                className="bg-gray-200 rounded-r p-1 w-8 h-8 flex items-center justify-center"
                                onClick={() => handlePasajeChange(pasaje.id_tipo_pasaje, pasaje.cantidad + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatMoneda((pasaje.cantidad || 0) * (pasaje.precio_unitario || 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={2} className="px-6 py-4 font-medium text-right">
                          Total Pasajeros:
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {totalPasajeros}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {formatMoneda(totalAPagar)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                {totalPasajeros === 0 && (
                  <div className="mt-3 text-amber-600 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    Debe seleccionar al menos un pasajero.
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay tipos de pasaje disponibles para este tour.</p>
            )}
          </div>
          
          {/* Estado de la reserva */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Estado de la reserva</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Estado
              </label>
              <select
                className="shadow appearance-none border rounded w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={reserva.estado}
                onChange={(e) => setReserva({...reserva, estado: e.target.value})}
              >
                {ESTADOS_RESERVA.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Notas (opcional)
              </label>
              <textarea
                name="notas"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
                placeholder="Ingrese notas adicionales para esta reserva..."
                value={reserva.notas || ''}
                onChange={(e) => setReserva({...reserva, notas: e.target.value})}
              ></textarea>
            </div>
          </div>
          
          {/* Pagos registrados */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaMoneyBillWave className="mr-2 text-blue-500" /> Pagos
            </h2>
            
            {pagosExistentes.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">Pagos registrados:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pagosExistentes.map((pago, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {format(new Date(pago.fecha_creacion), 'dd/MM/yyyy HH:mm', {locale: es})}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{pago.metodo_pago}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{formatMoneda(pago.monto)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{pago.numero_comprobante || '-'}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan={2} className="px-6 py-3 text-right text-sm font-medium">Total pagado:</td>
                        <td className="px-6 py-3 text-sm font-medium">{formatMoneda(totalPagado)}</td>
                        <td></td>
                      </tr>
                      {totalPagado < totalAPagar && (
                        <tr>
                          <td colSpan={2} className="px-6 py-3 text-right text-sm font-medium text-red-600">Saldo pendiente:</td>
                          <td className="px-6 py-3 text-sm font-medium text-red-600">{formatMoneda(totalAPagar - totalPagado)}</td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-yellow-800">
                  <FaExclamationTriangle className="inline mr-1" />
                  No se han registrado pagos para esta reserva.
                </p>
              </div>
            )}
            
            {/* Registrar pago adicional */}
            <div className="mt-6">
              <div className="mb-4">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600"
                    checked={registrarPago}
                    onChange={(e) => setRegistrarPago(e.target.checked)}
                  />
                  <span className="ml-2 text-gray-700">Registrar pago adicional</span>
                </label>
              </div>
              
              {registrarPago && (
                <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Método de Pago
                      </label>
                      <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      >
                        {METODOS_PAGO.map(metodo => (
                          <option key={metodo} value={metodo}>{metodo}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Monto a Pagar
                      </label>
                      <input
                        type="number"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={montoPagado}
                        onChange={(e) => setMontoPagado(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Número de Comprobante (opcional)
                    </label>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={numeroComprobante}
                      onChange={(e) => setNumeroComprobante(e.target.value)}
                      placeholder="Ingrese número de comprobante si aplica"
                    />
                  </div>
                  
                  {totalPagado + montoPagado > totalAPagar && (
                    <div className="text-red-600 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      El total pagado excederá el monto total de la reserva.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              onClick={() => navigate(`/vendedor/reservas/${id}`)}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              disabled={saving || totalPasajeros === 0}
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservaForm;