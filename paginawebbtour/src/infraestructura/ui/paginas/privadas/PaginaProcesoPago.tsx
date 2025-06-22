 
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { RootState } from '../../../store';
import { clienteAxios } from '../../../api/clienteAxios';
import { endpoints } from '../../../api/endpoints';
import Cargador from '../../componentes/comunes/Cargador';

// Definición de MercadoPago en window para TypeScript
declare global {
  interface Window {
    MercadoPago: any;
  }
}

// Interfaces para tipificar los datos
interface Pasaje {
  id_tipo_pasaje: number;
  cantidad: number;
  precio_unitario: number;
}

// Cambiado de id_paquete_pasajes a id_paquete para coincidir con el backend
interface Paquete {
  id_paquete: number;
  precio: number;
}

// Interfaces para los datos que vienen del datosReserva
interface PasajeDatosReserva {
  idTipoPasaje: number;
  cantidad: number;
  precioUnitario: number;
}

interface PaqueteDatosReserva {
  idPaquetePasajes: number;
  precio: number;
  seleccionado: boolean;
}

// Tipos para los estados de pago simulados
type EstadoPagoSimulado = 'approved' | 'pending' | 'rejected';

// Constantes de configuración
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_SANDBOX = !IS_PRODUCTION;
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutos en milisegundos

const PaginaProcesoPago = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, autenticado } = useSelector((state: RootState) => state.autenticacion);
  
  // Recuperar datos de la reserva del state o de sessionStorage
  const datosReserva = location.state || JSON.parse(sessionStorage.getItem('datosReservaPendiente') || '{}');
  
  // Estados para el flujo de pago
  const [cargandoPago, setCargandoPago] = useState(false);
  const [cargandoMercadoPago, setCargandoMercadoPago] = useState(true);
  const [metodoPago, setMetodoPago] = useState('mercadopago');
  const [error, setError] = useState<string | null>(null);
  const [preferencia, setPreferencia] = useState<any>(null);
  const [sdkCargado, setSdkCargado] = useState(false);
  const [usarModoSimulado, setUsarModoSimulado] = useState(process.env.NODE_ENV === 'development');
  const [publicKey, setPublicKey] = useState('');
  const [estadoSimuladoSeleccionado, setEstadoSimuladoSeleccionado] = useState<EstadoPagoSimulado>('approved');
  const [intentosVerificacion, setIntentosVerificacion] = useState(0);
  const [estadoPagoVerificado, setEstadoPagoVerificado] = useState(false);
  const [pagoIniciado, setPagoIniciado] = useState(false);
  const maxIntentosVerificacion = 10; // Máximo número de intentos de verificación
  
  // Estados para datos de usuario
  const [editandoUsuario, setEditandoUsuario] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState({
    nombres: usuario?.nombres || '',
    apellidos: usuario?.apellidos || '',
    correo: usuario?.correo || '',
    numero_celular: usuario?.numero_celular || '',
    numero_documento: usuario?.numero_documento || ''
  });

  // Referencia al contenedor del botón
  const mercadoPagoButtonRef = useRef<HTMLDivElement>(null);
  
  // Calcular subtotal, IGV y total
  const subtotal = Number(datosReserva.total || 0);
  const igv = subtotal * 0.18;
  const total = subtotal; // Ya incluye IGV en este caso

  // Manejar cambios en los campos de usuario
  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Guardar cambios del usuario
  const guardarCambiosUsuario = () => {
    // Aquí puedes implementar la lógica para guardar los cambios en la base de datos
    // Por ahora solo cerramos el modo de edición
    setEditandoUsuario(false);
    
    // Muestra un mensaje de éxito
    alert('Cambios guardados correctamente.');
  };

  // Función para limpiar los datos de reserva en progreso
  const limpiarDatosReservaEnProgreso = useCallback(() => {
    const instanciaId = datosReserva.instanciaId;
    if (instanciaId) {
      localStorage.removeItem(`reserva_en_proceso_${instanciaId}`);
    }
    sessionStorage.removeItem('pagoIniciado');
    sessionStorage.removeItem('reservaEnProceso');
  }, [datosReserva.instanciaId]);

  // Obtener la clave pública desde el backend
  const obtenerClavePublica = useCallback(async () => {
    try {
      // Verificar si tenemos la clave en cache
      const cachedKey = localStorage.getItem('mp_public_key');
      const cachedTimestamp = localStorage.getItem('mp_public_key_timestamp');
      
      // Si tenemos una clave en cache y no está expirada, usarla
      if (cachedKey && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        if (Date.now() - timestamp < CACHE_DURATION_MS) {
          console.log("Usando clave pública desde cache");
          setPublicKey(cachedKey);
          return cachedKey;
        }
      }
      
      // Si no hay cache válido, solicitar al backend
      const response = await clienteAxios.get(endpoints.mercadoPago.publicKey);
      if (response.data && response.data.public_key) {
        const newKey = response.data.public_key;
        
        // Guardar en cache
        localStorage.setItem('mp_public_key', newKey);
        localStorage.setItem('mp_public_key_timestamp', Date.now().toString());
        
        setPublicKey(newKey);
        return newKey;
      }
      throw new Error('No se pudo obtener la clave pública de Mercado Pago');
    } catch (error) {
      console.error('Error al obtener clave pública:', error);
      setError('No se pudo conectar con el servidor de pagos. Por favor, intenta nuevamente.');
      return null;
    }
  }, []);

  // Crear una preferencia simulada (para pruebas)
  const crearPreferenciaSimulada = useCallback(() => {
    const preferencia = {
      id: `TEST-${Date.now()}`,
      preference_id: `TEST-${Date.now()}`,
      init_point: "https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=123456789",
      sandbox_init_point: "https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=123456789"
    };
    
    console.log("Preferencia simulada creada:", preferencia);
    return preferencia;
  }, []);

  // FUNCIÓN: Navegar según el estado del pago - Definida ANTES de verificarEstadoPago
  const navegarSegunEstadoPago = useCallback((estado: string, paymentId: string | null, reservationId: number | null) => {
    // Datos base para cualquier estado
    const datosBase = {
      reservaId: reservationId || datosReserva.reservaId || datosReserva.instanciaId,
      paymentId: paymentId || `unknown_${Date.now()}`,
      metodoPago: 'mercadopago',
      fechaPago: new Date().toISOString(),
      tourNombre: datosReserva.tourNombre,
      total: total,
      fecha: datosReserva.fecha,
      horario: datosReserva.horario,
      totalPasajeros: datosReserva.totalPasajeros
    };
    
    console.log(`Navegando según estado de pago: ${estado}, Payment ID: ${paymentId}, Reservation ID: ${reservationId}`);
    
    // Limpiar datos de reserva en progreso
    limpiarDatosReservaEnProgreso();
    
    // Navegar según el estado
    switch (estado) {
      case 'approved':
      case 'success':
        navigate('/reserva-exitosa', {
          state: {
            ...datosBase,
            estado: 'CONFIRMADA',
            mensaje: 'Tu pago ha sido procesado exitosamente'
          }
        });
        break;
      case 'pending':
        navigate('/reserva-exitosa', {
          state: {
            ...datosBase,
            estado: 'PENDIENTE',
            mensaje: 'Tu pago está pendiente de confirmación'
          }
        });
        break;
      case 'failure':
      case 'rejected':
      default: // IMPORTANTE: Por defecto, tratar como rechazo para mayor seguridad
        navigate('/pago-fallido', {
          state: {
            ...datosBase,
            estado: 'RECHAZADO',
            mensaje: 'El pago no pudo ser procesado'
          }
        });
        break;
    }
  }, [navigate, datosReserva, total, limpiarDatosReservaEnProgreso]);

  // NUEVO: Función para verificar y confirmar reserva después del pago
  const verificarYConfirmarReserva = useCallback(async (idReserva: number, status: string, paymentId?: string) => {
    try {
      console.log(`Verificando y confirmando reserva ID=${idReserva}, status=${status}, paymentId=${paymentId || 'no disponible'}`);
      
      // Construir URL para el nuevo endpoint de verificación
      let url = `/api/v1/reservas/verificar-confirmar-pago?id_reserva=${idReserva}`;
      if (status) url += `&status=${status}`;
      if (paymentId) url += `&payment_id=${paymentId}`;
      
      // Verificar la reserva con el backend
      const response = await clienteAxios.get(url);
      console.log("Respuesta de verificación-confirmación:", response.data);
      
      if (response.data.success) {
        // Si la respuesta es exitosa y la reserva está confirmada, marcar como verificado
        const reserva = response.data.data;
        if (reserva.estado === "CONFIRMADA") {
          setEstadoPagoVerificado(true);
          return {
            success: true,
            status: "approved",
            reserva: reserva
          };
        }
        
        // Si la reserva está cancelada
        if (reserva.estado === "CANCELADA" || reserva.estado === "ANULADA") {
          setEstadoPagoVerificado(true);
          return {
            success: true,
            status: "rejected",
            reserva: reserva
          };
        }
        
        // Si no es ninguno de los anteriores, seguir intentando
        return {
          success: false,
          status: reserva.estado,
          reserva: reserva
        };
      }
      
      return { success: false, status: null };
    } catch (error) {
      console.error("Error al verificar y confirmar reserva:", error);
      return { success: false, status: null };
    }
  }, []);

  // Crear preferencia real usando el backend
  const crearPreferenciaReal = useCallback(async () => {
    try {
      // Verificar si ya existe una preferencia para evitar duplicados
      if (preferencia) {
        console.log("Ya existe una preferencia, se usará la existente:", preferencia);
        return preferencia;
      }
      
      // Verificamos qué tipo de reserva tenemos
      if (datosReserva.reservaId) {
        // Si ya tenemos una reserva, usamos el endpoint para pagar una reserva existente
        console.log("Obteniendo preferencia para reserva existente:", datosReserva.reservaId);
        
        const endpoint = endpoints.mercadoPago.pagarReserva(datosReserva.reservaId);
        console.log("Endpoint utilizado:", endpoint);
        
        const response = await clienteAxios.post(endpoint);
        console.log("Respuesta del servidor para reserva existente:", response.data);
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else {
          console.error("Respuesta sin datos de preferencia:", response.data);
          throw new Error("La respuesta del servidor no contiene datos de preferencia");
        }
      } else if (datosReserva.instanciaId) {
        // Verificar si ya existe una reserva en proceso para esta instancia
        const cacheKey = `reserva_en_proceso_${datosReserva.instanciaId}`;
        const reservaExistente = localStorage.getItem(cacheKey);
        const ahora = Date.now();
        
        if (reservaExistente) {
          try {
            const reservaCache = JSON.parse(reservaExistente);
            if (reservaCache.timestamp && (ahora - reservaCache.timestamp < CACHE_DURATION_MS)) {
              // Si la preferencia en cache no está expirada, usarla
              console.log("Usando preferencia existente del cache:", reservaCache.data);
              return reservaCache.data;
            } else {
              // Si está expirada, eliminarla
              console.log("Preferencia en cache expirada, se creará una nueva");
              localStorage.removeItem(cacheKey);
            }
          } catch (e) {
            console.error("Error al parsear preferencia en cache:", e);
            localStorage.removeItem(cacheKey);
          }
        }
        
        // Si es una nueva reserva, creamos una reserva con Mercado Pago
        console.log("Creando nueva reserva con Mercado Pago para instancia:", datosReserva.instanciaId);
        console.log("Datos de reserva completos:", JSON.stringify(datosReserva, null, 2));
        
        // Verificación de datos esenciales
        if (!datosReserva.instanciaId) {
          console.error("Error: No hay ID de instancia");
          throw new Error("No se encontró ID de instancia");
        }
        
        // Preparar los datos de pasajes en el formato correcto
        let pasajes: Pasaje[] = [];
        
        // Si tenemos cantidadesPasajes (formato array), usar ese
        if (datosReserva.cantidadesPasajes && Array.isArray(datosReserva.cantidadesPasajes)) {
          pasajes = datosReserva.cantidadesPasajes
            .filter((p: PasajeDatosReserva) => p.cantidad > 0)
            .map((p: PasajeDatosReserva) => ({
              id_tipo_pasaje: p.idTipoPasaje,
              cantidad: p.cantidad,
              precio_unitario: p.precioUnitario
            }));
        } 
        // Si tenemos seleccionPasajes (formato objeto), convertir a array
        else if (datosReserva.seleccionPasajes) {
          // Precios por tipo de pasaje (en producción, estos deberían venir del backend)
          const precios: Record<string, number> = {
            "1": 120, // Adulto
            "2": 80,  // Niño
            "3": 100  // Estudiante
          };
          
          // Asegurarse que Object.entries() devuelva el tipo correcto
          pasajes = Object.entries(datosReserva.seleccionPasajes)
            .filter(([_, cantidadValue]) => {
              // Asegurarse que cantidad sea un número y mayor que 0
              const cantidad = Number(cantidadValue);
              return !isNaN(cantidad) && cantidad > 0;
            })
            .map(([tipoId, cantidadValue]) => {
              // Convertir explícitamente a número
              const cantidad = Number(cantidadValue);
              const precio = precios[tipoId] || 100;
              
              return {
                id_tipo_pasaje: parseInt(tipoId),
                cantidad: cantidad,
                precio_unitario: precio
              };
            });
        }
        
        console.log("Pasajes formateados:", JSON.stringify(pasajes, null, 2));
        
        // Verificar que haya pasajes
        if (pasajes.length === 0) {
          console.error("Error: No hay pasajes seleccionados");
          throw new Error("Debe seleccionar al menos un pasaje");
        }
        
        // Preparar los datos de paquetes en el formato correcto
        let paquetes: Paquete[] = [];
        
        // Si tenemos paquetes (formato array), usar ese
        if (datosReserva.paquetes && Array.isArray(datosReserva.paquetes)) {
          paquetes = datosReserva.paquetes
            .filter((p: PaqueteDatosReserva) => p.seleccionado)
            .map((p: PaqueteDatosReserva) => ({
              // Usar id_paquete en lugar de id_paquete_pasajes
              id_paquete: p.idPaquetePasajes,
              precio: p.precio
            }));
        } 
        // Si tenemos seleccionPaquetes (formato objeto), convertir a array
        else if (datosReserva.seleccionPaquetes) {
          // Precios por tipo de paquete (en producción, estos deberían venir del backend)
          const preciosPaquetes: Record<string, number> = {
            "1": 250, // Paquete familiar
            "2": 200, // Paquete estándar
            "3": 300  // Paquete premium
          };
          
          paquetes = Object.entries(datosReserva.seleccionPaquetes)
            .filter(([_, seleccionadoValue]) => {
              // Verificar que sea verdadero (true o 1)
              return seleccionadoValue === true || seleccionadoValue === 1 || Number(seleccionadoValue) > 0;
            })
            .map(([paqueteId, _]) => ({
              // Usar id_paquete en lugar de id_paquete_pasajes
              id_paquete: parseInt(paqueteId),
              precio: preciosPaquetes[paqueteId] || 200 // Precio por defecto
            }));
        }
        
        console.log("Paquetes formateados:", JSON.stringify(paquetes, null, 2));
        
        // Generar un ID de sesión único para evitar duplicados
        const sessionId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Datos para enviar al backend - CAMBIADO PARA COINCIDIR CON EL BACKEND
        const datosParaEnviar = {
          id_instancia: Number(datosReserva.instanciaId),
          id_tour_programado: Number(datosReserva.instanciaId), 
          id_cliente: usuario?.id_cliente ? Number(usuario.id_cliente) : 0, 
          cantidad_pasajes: pasajes, // CAMBIO AQUÍ: de "pasajes" a "cantidad_pasajes"
          paquetes: paquetes,
          monto: parseFloat((datosReserva.total || total).toFixed(2)),
          total_pagar: parseFloat((datosReserva.total || total).toFixed(2)),
          tour_nombre: datosReserva.tourNombre || "Tour",
          email: usuario?.correo || datosUsuario.correo || "",
          nombre: usuario?.nombres || datosUsuario.nombres || "",
          apellido: usuario?.apellidos || datosUsuario.apellidos || "",
          telefono: usuario?.numero_celular || datosUsuario.numero_celular || "",
          documento: usuario?.numero_documento || datosUsuario.numero_documento || "",
          session_id: sessionId // Añadir el ID de sesión para evitar duplicados
        };
        
        // Validación de datos críticos
        if (!datosParaEnviar.email) {
          console.error("Error: No hay email");
          throw new Error("El email es obligatorio");
        }
        
        if (!datosParaEnviar.nombre) {
          console.error("Error: No hay nombre");
          throw new Error("El nombre es obligatorio");
        }
        
        if (!datosParaEnviar.apellido) {
          console.error("Error: No hay apellido");
          throw new Error("El apellido es obligatorio");
        }
        
        // Log detallado de los datos que se enviarán
        console.log("DATOS QUE SE ENVIARÁN A /mercadopago/reservar:", JSON.stringify(datosParaEnviar, null, 2));
        console.log("Endpoint utilizado:", endpoints.mercadoPago.reservar);
        console.log("Headers:", JSON.stringify(clienteAxios.defaults.headers, null, 2));
        
        // Marcar esta reserva como "en proceso" antes de enviar la solicitud
        const reservaTemporalId = `reserva_temp_${datosReserva.instanciaId}_${Date.now()}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          temporalId: reservaTemporalId,
          timestamp: ahora,
          sessionId: sessionId
        }));
        
        try {
          console.log("Iniciando solicitud POST...");
          const response = await clienteAxios.post(endpoints.mercadoPago.reservar, datosParaEnviar);
          console.log("Respuesta del servidor:", JSON.stringify(response.data, null, 2));
          
          if (response.data && response.data.data) {
            // Si se creó una reserva, guardar su ID y la preferencia en cache
            if (response.data.data.id_reserva) {
              console.log("ID de reserva creada:", response.data.data.id_reserva);
              
              // Guardar en localStorage para futuras referencias
              localStorage.setItem(cacheKey, JSON.stringify({
                data: response.data.data,
                timestamp: ahora,
                sessionId: sessionId
              }));
              
              // Guardar también en sessionStorage para el flujo principal
              sessionStorage.setItem('reservaEnProceso', JSON.stringify({
                id: response.data.data.id_reserva,
                tour: datosReserva.tourNombre,
                fecha: datosReserva.fecha,
                timestamp: ahora,
                sessionId: sessionId
              }));
            }
            return response.data.data;
          } else {
            console.error("Respuesta sin datos de preferencia:", response.data);
            throw new Error("La respuesta del servidor no contiene datos de preferencia");
          }
        } catch (error: any) {
          // Eliminar la marca de "en proceso" si hay error
          localStorage.removeItem(cacheKey);
          
          console.error("ERROR DETALLADO AL CREAR PREFERENCIA:", error);
          
          if (error.response) {
            console.error("Status del error:", error.response.status);
            console.error("Headers de la respuesta:", JSON.stringify(error.response.headers, null, 2));
            console.error("Datos de la respuesta de error:", JSON.stringify(error.response.data, null, 2));
            
            // Intentar extraer un mensaje más específico
            const mensajeError = error.response.data?.error || 
                                error.response.data?.message || 
                                error.response.data?.details || 
                                "Error desconocido";
            
            throw new Error(`Error del servidor (${error.response.status}): ${mensajeError}`);
          } else if (error.request) {
            console.error("Error: No se recibió respuesta del servidor");
            console.error("Detalles de la solicitud:", JSON.stringify(error.request, null, 2));
            throw new Error("No se recibió respuesta del servidor. Verifica tu conexión a internet.");
          } else {
            console.error("Error al configurar la solicitud:", error.message);
            throw error;
          }
        }
      } else {
        console.error("Error: No hay ID de reserva ni de instancia");
        throw new Error("No se encontró ID de reserva o instancia");
      }
    } catch (error: any) {
      // Log completo del error
      console.error("ERROR COMPLETO AL CREAR PREFERENCIA REAL:", error);
      console.error("Mensaje:", error.message);
      console.error("Stack:", error.stack);
      
      // Mostrar mensaje de error más detallado
      if (error.response && error.response.data) {
        const mensaje = error.response.data.message || error.response.data.error || "Error desconocido del servidor";
        const detalles = error.response.data.details || "";
        const mensajeCompleto = `Error del servidor: ${mensaje}${detalles ? ` (${detalles})` : ""}`;
        console.error("Mensaje de error formateado:", mensajeCompleto);
        setError(mensajeCompleto);
      } else {
        const mensajeGeneral = `Error al crear preferencia: ${error.message || "Error desconocido"}`;
        console.error("Mensaje de error general:", mensajeGeneral);
        setError(mensajeGeneral);
      }
      
      throw error;
    }
  }, [datosReserva, datosUsuario, usuario, total, preferencia]);
  
  // Cargar el SDK de Mercado Pago
  const cargarMercadoPagoSDK = useCallback(() => {
    if (window.MercadoPago) {
      console.log("SDK de MercadoPago ya está cargado");
      setSdkCargado(true);
      return Promise.resolve();
    }
    
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      
      script.onload = () => {
        console.log("SDK de MercadoPago cargado correctamente");
        setSdkCargado(true);
        resolve();
      };
      
      script.onerror = () => {
        console.error("Error al cargar el SDK de MercadoPago");
        setError("No se pudo cargar el procesador de pagos. Verifica tu conexión a internet.");
        reject();
      };
      
      document.head.appendChild(script);
    });
  }, []);

  // FUNCIÓN: Verificar estado de pago - Definida DESPUÉS de navegarSegunEstadoPago
  const verificarEstadoPago = useCallback(async (preferenceId: string, paymentId?: string) => {
    try {
      // Si ya verificamos el estado del pago con éxito, no seguir intentando
      if (estadoPagoVerificado) {
        return { success: true, status: null };
      }
      
      // Si superamos el número máximo de intentos, no seguir intentando
      if (intentosVerificacion >= maxIntentosVerificacion) {
        console.log(`Máximo de intentos de verificación (${maxIntentosVerificacion}) alcanzado`);
        return { success: false, status: null };
      }
      
      console.log(`Verificando estado de pago (intento ${intentosVerificacion + 1}/${maxIntentosVerificacion})...`);
      setIntentosVerificacion(prev => prev + 1);
      
      // Si estamos en modo simulado, usar la simulación
      if (usarModoSimulado) {
        // En modo simulado, simular que obtenemos un resultado después de algunos intentos
        if (intentosVerificacion >= 3) {
          setEstadoPagoVerificado(true);
          
          // Navegar según el estado simulado
          navegarSegunEstadoPago(
            estadoSimuladoSeleccionado, 
            `sim_${Date.now()}`, 
            datosReserva.reservaId || datosReserva.instanciaId
          );
          
          return { 
            success: true, 
            status: estadoSimuladoSeleccionado 
          };
        }
        
        // En los primeros intentos, seguir esperando
        return { success: false, status: null };
      }
      
      // Obtener ID de reserva
      const reservaEnProceso = JSON.parse(sessionStorage.getItem('reservaEnProceso') || '{}');
      const idReserva = reservaEnProceso.id || datosReserva.reservaId;
      
      if (idReserva) {
        // Intentar verificar y confirmar la reserva directamente
        const resultado = await verificarYConfirmarReserva(idReserva, "approved", paymentId);
        if (resultado.success && resultado.status) {
          // Si la verificación fue exitosa, navegar según el estado
          navegarSegunEstadoPago(
            resultado.status,
            paymentId || null,
            idReserva
          );
          
          return {
            success: true,
            status: resultado.status,
            payment_id: paymentId,
            reservation_id: idReserva
          };
        }
      }
      
      // Si no se pudo verificar con la nueva función, usar el método antiguo
      let url = `${endpoints.mercadoPago.verificarPago}?preference_id=${preferenceId}`;
      if (paymentId) {
        url += `&payment_id=${paymentId}`;
      }
      
      console.log("URL de verificación:", url);
      
      // Realizar la solicitud al backend
      const response = await clienteAxios.get(url);
      console.log("Respuesta de verificación:", response.data);
      
      if (response.data && response.data.data && response.data.data.status) {
        // Si tenemos un estado, marcar como verificado
        setEstadoPagoVerificado(true);
        
        // Obtener los datos relevantes
        const { status, payment_id, reservation_id } = response.data.data;
        
        // Si tenemos un ID de reserva, intentar confirmarla explícitamente
        if (reservation_id) {
          try {
            await verificarYConfirmarReserva(reservation_id, status, payment_id);
          } catch (err) {
            console.error("Error al confirmar reserva explícitamente:", err);
            // Continuar aunque falle esta confirmación explícita
          }
        }
        
        // Navegar automáticamente según el estado
        navegarSegunEstadoPago(status, payment_id, reservation_id);
        
        return { 
          success: true, 
          status,
          payment_id,
          reservation_id
        };
      } else {
        // Si no tenemos un estado, seguir intentando
        return { success: false, status: null };
      }
    } catch (error) {
      console.error("Error al verificar estado del pago:", error);
      return { success: false, status: null };
    }
  }, [intentosVerificacion, estadoPagoVerificado, maxIntentosVerificacion, navegarSegunEstadoPago, usarModoSimulado, estadoSimuladoSeleccionado, datosReserva, verificarYConfirmarReserva]);

  // Renderizar el botón de Mercado Pago
  const renderizarBotonMercadoPago = useCallback(() => {
    if (!preferencia) {
      console.log("No hay preferencia para renderizar el botón");
      return;
    }
    
    if (!mercadoPagoButtonRef.current) {
      console.log("No se encontró la referencia al contenedor del botón");
      return;
    }
    
    if (!window.MercadoPago) {
      console.log("El SDK de MercadoPago no está disponible");
      return;
    }
    
    if (!publicKey) {
      console.log("No hay clave pública disponible");
      return;
    }
    
    try {
      // Obtener el ID de preferencia
      const preferenceId = preferencia.preference_id || preferencia.id;
      
      if (!preferenceId) {
        console.error("No se encontró ID de preferencia válido");
        return;
      }
      
      console.log("Renderizando botón con preferenceId:", preferenceId);
      
      // Inicializar MercadoPago
      const mp = new window.MercadoPago(publicKey, {
        locale: 'es-PE'
      });
      
      // Limpiar el contenedor
      if (mercadoPagoButtonRef.current.innerHTML.trim() !== '') {
        console.log("El botón ya está renderizado, no se volverá a renderizar");
        return;
      }
      
      // Renderizar el botón
      mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '.mercado-pago-button',
          label: 'Pagar con Mercado Pago',
        }
      });
      
      console.log("Botón de MercadoPago renderizado correctamente");
    } catch (error) {
      console.error("Error al renderizar el botón de MercadoPago:", error);
      setError("Error al inicializar el botón de pago. Por favor, actualiza la página.");
    }
  }, [preferencia, publicKey]);

  // Iniciar el proceso de pago
  const iniciarProcesoPago = useCallback(async () => {
    try {
      setCargandoMercadoPago(true);
      setError(null);
      
      // Si ya tenemos una preferencia, no crear otra
      if (preferencia) {
        console.log("Ya existe una preferencia, no se creará otra:", preferencia);
        setCargandoMercadoPago(false);
        return preferencia;
      }
      
      // 1. Cargar el SDK si no está cargado
      await cargarMercadoPagoSDK();
      
      // 2. Obtener la clave pública si no la tenemos
      if (!publicKey) {
        const key = await obtenerClavePublica();
        if (!key && !usarModoSimulado) {
          throw new Error('No se pudo obtener la clave pública de Mercado Pago');
        }
      }
      
      // 3. Crear preferencia (simulada o real)
      let nuevaPreferencia;
      
      if (usarModoSimulado) {
        console.log("Usando modo simulado para crear preferencia");
        nuevaPreferencia = crearPreferenciaSimulada();
      } else {
        console.log("Usando modo real para crear preferencia");
        nuevaPreferencia = await crearPreferenciaReal();
      }
      
      // 4. Actualizar el estado solo si no tenemos una preferencia ya
      if (!preferencia) {
        setPreferencia(nuevaPreferencia);
      }
      
      return nuevaPreferencia;
    } catch (error: any) {
      console.error("Error al iniciar el proceso de pago:", error);
      if (!error.message || !error.message.includes('Error al crear preferencia')) {
        setError("No se pudo iniciar el proceso de pago. Por favor, intenta nuevamente.");
      }
      return null;
    } finally {
      setCargandoMercadoPago(false);
    }
  }, [cargarMercadoPagoSDK, crearPreferenciaSimulada, crearPreferenciaReal, obtenerClavePublica, publicKey, usarModoSimulado, preferencia]);

  // Función para procesar pago directo
  const procesarPagoDirecto = async () => {
    if (cargandoPago) return;
    
    setCargandoPago(true);
    setError(null);
    setPagoIniciado(true);
    sessionStorage.setItem('pagoIniciado', 'true');
    
    try {
      console.log("Procesando pago directo...");
      
      // Si estamos en modo simulado, manejar directamente
      if (usarModoSimulado) {
        // Simular diferentes resultados de pago basado en la selección
        console.log(`Usando estado simulado: ${estadoSimuladoSeleccionado}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Construir los datos base
        const datosBase = {
          reservaId: datosReserva.reservaId || datosReserva.instanciaId,
          paymentId: `sim_${Date.now()}`,
          metodoPago: 'mercadopago',
          fechaPago: new Date().toISOString(),
          tourNombre: datosReserva.tourNombre,
          total: total,
          fecha: datosReserva.fecha,
          horario: datosReserva.horario,
          totalPasajeros: datosReserva.totalPasajeros
        };
        
        // Limpiar datos de reserva en progreso
        limpiarDatosReservaEnProgreso();
        
        // Navegar según el estado simulado
        switch (estadoSimuladoSeleccionado) {
          case 'approved':
            navigate('/reserva-exitosa', {
              state: {
                ...datosBase,
                estado: 'CONFIRMADA',
                mensaje: 'Tu pago ha sido procesado exitosamente'
              }
            });
            break;
          case 'pending':
            navigate('/reserva-exitosa', {
              state: {
                ...datosBase,
                estado: 'PENDIENTE',
                mensaje: 'Tu pago está pendiente de confirmación'
              }
            });
            break;
          case 'rejected':
            navigate('/pago-fallido', {
              state: {
                ...datosBase,
                estado: 'RECHAZADO',
                mensaje: 'El pago no pudo ser procesado'
              }
            });
            break;
        }
        return;
      }
      
      // Si tenemos una preferencia con URL de pago, redirigir a ella
      if (preferencia) {
        // Determinar qué URL usar según el entorno
        const url = IS_SANDBOX
          ? (preferencia.sandbox_init_point || preferencia.init_point)
          : preferencia.init_point;
        
        console.log("Redirigiendo a URL de pago:", url);
        
        if (url) {
          // En modo real, redirigir a la URL de pago
          window.location.href = url;
        } else {
          throw new Error("No se encontró URL de pago en la preferencia");
        }
        return;
      }
      
      // Si no tenemos preferencia, intentar crearla
      const nuevaPreferencia = await iniciarProcesoPago();
      
      // Verificar si ahora tenemos preferencia
      if (nuevaPreferencia) {
        const url = IS_SANDBOX
          ? (nuevaPreferencia.sandbox_init_point || nuevaPreferencia.init_point)
          : nuevaPreferencia.init_point;
        
        if (url) {
          // En modo real, redirigir a la URL de pago
          window.location.href = url;
        } else {
          throw new Error("No se encontró URL de pago en la preferencia");
        }
        return;
      }
      
      setError("No se pudo generar el pago. Por favor, intenta nuevamente.");
      
    } catch (error: any) {
      console.error('Error al procesar el pago:', error);
      if (!error.message || !error.message.includes('Error al crear preferencia')) {
        setError('No se pudo procesar el pago. Por favor, inténtalo nuevamente.');
      }
    } finally {
      setCargandoPago(false);
    }
  };
  
  // Iniciar el proceso cuando el componente se monta
  useEffect(() => {
    const iniciarMercadoPago = async () => {
      try {
        // Evitar iniciar el proceso si ya tenemos una preferencia
        if (preferencia) {
          console.log("Ya existe una preferencia, no se creará otra");
          setCargandoMercadoPago(false);
          return;
        }
        
        setCargandoMercadoPago(true);
        
        // 1. Obtener clave pública
        if (!publicKey) {
          await obtenerClavePublica();
        }
        
        // 2. Iniciar proceso de pago
        await iniciarProcesoPago();
        
      } catch (error) {
        console.error('Error al inicializar Mercado Pago:', error);
      } finally {
        setCargandoMercadoPago(false);
      }
    };
    
    iniciarMercadoPago();
  }, [obtenerClavePublica, iniciarProcesoPago, publicKey, preferencia]);

  // Renderizar el botón cuando la preferencia cambia
  useEffect(() => {
    if (preferencia && sdkCargado && publicKey) {
      // Usar debounce para evitar múltiples renderizados
      const debouncedRender = debounce(() => {
        renderizarBotonMercadoPago();
      }, 500);
      
      debouncedRender();
      
      return () => {
        debouncedRender.cancel();
      };
    }
  }, [preferencia, sdkCargado, publicKey, renderizarBotonMercadoPago]);
  
  // EFECTO: Verificar periódicamente el estado del pago en modo sandbox
  useEffect(() => {
    // Solo activar en modo sandbox y cuando tenemos una preferencia Y después de un intento de pago
    if (IS_SANDBOX && preferencia && preferencia.id && !estadoPagoVerificado && pagoIniciado) {
      console.log("Iniciando verificación periódica del estado de pago...");
      
      // Verificar inmediatamente
      verificarEstadoPago(preferencia.id).then(result => {
        if (result.success && result.status) {
          console.log(`Estado de pago verificado: ${result.status}`);
          navegarSegunEstadoPago(result.status, result.payment_id || null, result.reservation_id || null);
        }
      });
      
      // Configurar verificación periódica
      const intervalId = setInterval(async () => {
        const result = await verificarEstadoPago(preferencia.id);
        if (result.success && result.status) {
          clearInterval(intervalId);
          console.log(`Estado de pago verificado en intervalo: ${result.status}`);
          navegarSegunEstadoPago(result.status, result.payment_id || null, result.reservation_id || null);
        }
      }, 3000); // Verificar cada 3 segundos
      
      // Limpiar intervalo al desmontar
      return () => {
        clearInterval(intervalId);
        console.log("Verificación periódica detenida");
      };
    }
  }, [preferencia, IS_SANDBOX, verificarEstadoPago, navegarSegunEstadoPago, estadoPagoVerificado, pagoIniciado]);
  
  // Verificar si estamos regresando de un pago en Mercado Pago
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const paymentId = params.get('payment_id');
    const externalReference = params.get('external_reference');
    const errorMessage = params.get('error');
    const preferenceId = params.get('preference_id');
    
    if (status || paymentId) {
      console.log(`Retornando de MercadoPago con estado: ${status}, payment_id: ${paymentId}`);
      
      // Si hay un mensaje de error específico, mostrarlo
      if (errorMessage) {
        if (errorMessage.includes("insufficient_amount")) {
          setError("Tu tarjeta no tiene saldo suficiente para completar esta compra.");
        } else if (errorMessage.includes("cc_rejected")) {
          setError("La tarjeta fue rechazada. Por favor, intenta con otro método de pago.");
        } else {
          setError(`Error en el pago: ${errorMessage}`);
        }
      }
      
      // Extraer ID de reserva
      let reservaId;
      if (externalReference && externalReference.startsWith('RESERVA-')) {
        reservaId = parseInt(externalReference.replace('RESERVA-', ''));
      } else {
        // Intentar obtener ID de reserva de sessionStorage
        const reservaEnProceso = JSON.parse(sessionStorage.getItem('reservaEnProceso') || '{}');
        reservaId = reservaEnProceso.id || datosReserva.reservaId || datosReserva.instanciaId;
      }
      
      // Si tenemos ID de reserva, verificar y confirmar la reserva
      if (reservaId) {
        verificarYConfirmarReserva(reservaId, status || "approved", paymentId || undefined)
          .then(result => {
            if (result.success && result.status) {
              // Si la verificación fue exitosa, navegar según el estado
              navegarSegunEstadoPago(result.status, paymentId || null, reservaId);
            } else {
              // Si no fue exitosa pero hay status en la URL, navegar directamente
              if (status) {
                navegarSegunEstadoPago(status, paymentId || null, reservaId);
              }
            }
          })
          .catch(error => {
            console.error("Error al verificar y confirmar reserva:", error);
            // En caso de error, si hay status en la URL, navegar directamente
            if (status) {
              navegarSegunEstadoPago(status, paymentId || null, reservaId);
            }
          });
      } else {
        // Si no tenemos ID de reserva pero hay status, navegar directamente
        if (status) {
          navegarSegunEstadoPago(status, paymentId || null, null);
        }
      }
    }
  }, [location.search, navegarSegunEstadoPago, datosReserva, verificarYConfirmarReserva]);
  
  // Formatear fecha para mostrar
  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return '';
    
    try {
      const fecha = new Date(fechaStr);
      if (isNaN(fecha.getTime())) {
        return 'Fecha no válida';
      }
      
      return fecha.toLocaleDateString('es-PE', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return 'Fecha no válida';
    }
  };
  
  // Limpiar al desmontar el componente
  useEffect(() => {
    return () => {
      // Limpiar los datos temporales si el usuario abandona la página
      if (!estadoPagoVerificado) {
        console.log("Limpiando datos temporales al desmontar");
        sessionStorage.removeItem('pagoIniciado');
      }
    };
  }, [estadoPagoVerificado]);
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-white via-blue-50 to-cyan-50 min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold">{t('pago.titulo', 'Proceso de Pago')}</h1>
          <p className="mt-1 opacity-90">{t('pago.subtitulo', 'Completa tu reserva realizando el pago')}</p>
          
          {/* Paso de proceso */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between max-w-md">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs mt-1">Selección</span>
              </div>
              
              <div className="flex-1 h-0.5 mx-2 bg-white/40"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <span className="text-xs mt-1">Pago</span>
              </div>
              
              <div className="flex-1 h-0.5 mx-2 bg-white/40"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <span className="text-xs mt-1">Confirmación</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información de la reserva */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos del tour */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-cyan-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Detalles de la reserva
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{datosReserva.tourNombre}</h3>
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{formatearFecha(datosReserva.fecha)}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{datosReserva.horario}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-200">
                    {datosReserva.totalPasajeros} pasajeros
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-800">S/ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">IGV (18%):</span>
                      <span className="text-gray-800">S/ {igv.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-200">
                      <span className="text-gray-800">Total a pagar:</span>
                      <span className="text-teal-600 text-lg">S/ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Información del cliente */}
            {usuario && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyan-100">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Datos del cliente
                  </h2>
                  
                  <button 
                    type="button"
                    onClick={() => setEditandoUsuario(!editandoUsuario)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    {editandoUsuario ? (
                      <>Cancelar</>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Editar
                      </>
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input 
                      type="text" 
                      name="nombres"
                      value={datosUsuario.nombres}
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                    <input 
                      type="text" 
                      name="apellidos"
                      value={datosUsuario.apellidos}
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      name="correo"
                      value={datosUsuario.correo}
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input 
                      type="text" 
                      name="numero_celular"
                      value={datosUsuario.numero_celular} 
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                    <input 
                      type="text" 
                      name="numero_documento"
                      value={datosUsuario.numero_documento} 
                      onChange={handleUsuarioChange}
                      disabled={!editandoUsuario}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editandoUsuario 
                          ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                                </div>
                
                {editandoUsuario && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={guardarCambiosUsuario}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Guardar cambios
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Opciones de pago */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-cyan-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Opciones de pago
              </h2>
              
              {/* Muestra error si existe */}
              {error && (
                <div className="mt-4 mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {/* Opciones de modo (solo para desarrollo) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-yellow-50 border rounded border-yellow-200 text-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
                    <span className="font-medium text-yellow-800">Modo de prueba</span>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={usarModoSimulado} 
                        onChange={(e) => setUsarModoSimulado(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">Usar modo simulado</span>
                    </label>
                  </div>
                </div>
              )}
              
              {/* NUEVO: Simulador de resultados de pago */}
              {process.env.NODE_ENV === 'development' && usarModoSimulado && (
                <div className="mb-4 p-3 bg-purple-50 border rounded border-purple-200 text-sm">
                  <div className="font-medium text-purple-800 mb-2">Simular resultado del pago:</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEstadoSimuladoSeleccionado('approved')}
                      className={`p-2 rounded text-center text-sm ${
                        estadoSimuladoSeleccionado === 'approved' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-white text-green-800 border border-green-200'
                      }`}
                    >
                      Aprobado
                    </button>
                    <button
                      type="button"
                      onClick={() => setEstadoSimuladoSeleccionado('pending')}
                      className={`p-2 rounded text-center text-sm ${
                        estadoSimuladoSeleccionado === 'pending' 
                          ? 'bg-yellow-600 text-white' 
                          : 'bg-white text-yellow-800 border border-yellow-200'
                      }`}
                    >
                      Pendiente
                    </button>
                    <button
                      type="button"
                      onClick={() => setEstadoSimuladoSeleccionado('rejected')}
                      className={`p-2 rounded text-center text-sm ${
                        estadoSimuladoSeleccionado === 'rejected' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-white text-red-800 border border-red-200'
                      }`}
                    >
                      Rechazado
                    </button>
                  </div>
                </div>
              )}
              
              {/* Tarjetas de prueba (solo en desarrollo) */}
              {process.env.NODE_ENV === 'development' && !usarModoSimulado && (
                <div className="mb-4 p-3 bg-blue-50 border rounded border-blue-200 text-sm">
                  <div className="font-medium text-blue-800 mb-2">Tarjetas de prueba:</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-2 bg-white rounded border border-blue-100">
                      <div className="text-gray-700 font-medium">Mastercard (aprobada)</div>
                      <div className="text-gray-600">5031 7557 3453 0604</div>
                      <div className="text-gray-500 text-xs">
                        <span>CVV: 123</span> | <span>Fecha: 11/25</span> | <span>Nombre: APRO</span>
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded border border-blue-100">
                      <div className="text-gray-700 font-medium">Visa (rechazada)</div>
                      <div className="text-gray-600">4509 9535 6623 3704</div>
                      <div className="text-gray-500 text-xs">
                        <span>CVV: 123</span> | <span>Fecha: 11/25</span> | <span>Nombre: RECH</span>
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded border border-blue-100">
                      <div className="text-gray-700 font-medium">Visa (pendiente)</div>
                      <div className="text-gray-600">4075 5957 1648 3764</div>
                      <div className="text-gray-500 text-xs">
                        <span>CVV: 123</span> | <span>Fecha: 11/25</span> | <span>Nombre: CONT</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Sección de pago */}
              <div>
                {cargandoMercadoPago ? (
                  <div className="w-full py-6 flex justify-center items-center bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                    <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-blue-500 rounded-full mr-2"></div>
                    <span className="text-blue-500">Cargando opciones de pago...</span>
                  </div>
                ) : (
                  <>
                    {/* Contenedor para el botón de Mercado Pago */}
                    <div 
                      className="mercado-pago-button w-full min-h-[60px] bg-blue-50 rounded-lg border border-blue-200 mb-4 flex items-center justify-center"
                      ref={mercadoPagoButtonRef}
                    >
                      <span className="text-sm text-blue-500">Opciones de pago con Mercado Pago</span>
                    </div>
                    
                    {/* Botón alternativo para pago directo */}
                    <button
                      type="button"
                      onClick={procesarPagoDirecto}
                      disabled={cargandoPago}
                      className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center ${
                        cargandoPago ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-600 hover:to-teal-600'
                      }`}
                    >
                      {cargandoPago ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando pago...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Pagar S/ {total.toFixed(2)}
                        </span>
                      )}
                    </button>
                    
                    {/* NUEVO: Indicador de verificación */}
                    {intentosVerificacion > 0 && !estadoPagoVerificado && (
                      <div className="mt-2 text-xs text-center text-blue-500">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin h-3 w-3 border-t-1 border-b-1 border-blue-500 rounded-full mr-1"></div>
                          Verificando estado del pago ({intentosVerificacion}/{maxIntentosVerificacion})...
                        </div>
                      </div>
                    )}
                    
                    <p className="mt-2 text-xs text-center text-gray-500">
                      Al hacer clic en "Pagar", aceptas nuestros <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a>.
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {/* Información de seguridad */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-cyan-200">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800">Pago 100% seguro</h3>
              </div>
              <p className="text-xs text-gray-600 ml-10">
                Tu información de pago se procesa de forma segura.
              </p>
              
              <div className="flex items-center mt-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800">Datos protegidos</h3>
              </div>
              <p className="text-xs text-gray-600 ml-10">
                No almacenamos tus datos de tarjeta. Todas las transacciones son procesadas por Mercado Pago con la mayor seguridad.
              </p>
            </div>
          </div>
        </div>
        
        {/* Botón para volver */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-cyan-300 text-cyan-700 font-medium rounded-lg transition-colors hover:bg-cyan-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaProcesoPago; 