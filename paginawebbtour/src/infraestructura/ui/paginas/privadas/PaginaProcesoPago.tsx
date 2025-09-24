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

interface Paquete {
  id_paquete: number;
  precio: number;
}

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

// Tipos para modos de checkout
type ModoCheckout = 'pro' | 'api';

// 🔧 CONSTANTES ACTUALIZADAS
const IS_PRODUCTION = false;
const IS_SANDBOX = true;
const CACHE_DURATION_MS = 15 * 60 * 1000;
const ACTUAL_ENV = process.env.NODE_ENV;

const PaginaProcesoPago = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, autenticado } = useSelector((state: RootState) => state.autenticacion);
  
  const datosReserva = location.state || JSON.parse(sessionStorage.getItem('datosReservaPendiente') || '{}');
  
  const [cargandoPago, setCargandoPago] = useState(false);
  const [cargandoMercadoPago, setCargandoMercadoPago] = useState(true);
  const [metodoPago, setMetodoPago] = useState('mercadopago');
  const [error, setError] = useState<string | null>(null);
  const [preferencia, setPreferencia] = useState<any>(null);
  const [sdkCargado, setSdkCargado] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [intentosVerificacion, setIntentosVerificacion] = useState(0);
  const [estadoPagoVerificado, setEstadoPagoVerificado] = useState(false);
  const [pagoIniciado, setPagoIniciado] = useState(false);
  const maxIntentosVerificacion = 10;
  
  const [modoCheckout, setModoCheckout] = useState<ModoCheckout>('api');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [cardIssuers, setCardIssuers] = useState<any[]>([]);
  const [installmentOptions, setInstallmentOptions] = useState<any[]>([]);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    securityCode: '',
    cardholderName: '',
    identificationType: 'DNI',
    identificationNumber: '',
    paymentMethodId: '',
    issuerId: ''
  });
  const [mp, setMp] = useState<any>(null);
  
  const [editandoUsuario, setEditandoUsuario] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState({
    nombres: usuario?.nombres || '',
    apellidos: usuario?.apellidos || '',
    correo: usuario?.correo || '',
    numero_celular: usuario?.numero_celular || '',
    numero_documento: usuario?.numero_documento || ''
  });

  const mercadoPagoButtonRef = useRef<HTMLDivElement>(null);
  
  const subtotal = Number(datosReserva.total || 0);
  const igv = subtotal * 0.18;
  const total = subtotal;

  useEffect(() => {
    console.log("🔧 ========== CONFIGURACIÓN DE ENTORNO ==========");
    console.log("   🌍 NODE_ENV actual:", ACTUAL_ENV);
    console.log("   🎯 IS_SANDBOX (forzado):", IS_SANDBOX);
    console.log("   🎯 IS_PRODUCTION (forzado):", IS_PRODUCTION);
    console.log("   🔄 Modo checkout actual:", modoCheckout);
    console.log("================================================");
    
    window.scrollTo(0, 0);
  }, []);

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const guardarCambiosUsuario = () => {
    setEditandoUsuario(false);
    alert('Cambios guardados correctamente.');
  };

  const handleCardFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setCardForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'cardNumber') {
      identifyPaymentMethod(value.replace(/\s/g, ''));
    }
  };

  const limpiarDatosReservaEnProgreso = useCallback(() => {
    const instanciaId = datosReserva.instanciaId;
    if (instanciaId) {
      localStorage.removeItem(`reserva_en_proceso_${instanciaId}`);
    }
    sessionStorage.removeItem('pagoIniciado');
    sessionStorage.removeItem('reservaEnProceso');
  }, [datosReserva.instanciaId]);

  const analizarErrorMercadoPago = useCallback((error: any) => {
    let mensajeUsuario = "Ocurrió un error al procesar el pago. Por favor, intenta nuevamente.";
    
    console.error("🔍 Analizando error completo:", error);
    
    if (error.response && error.response.data) {
      const respuesta = error.response.data;
      console.error("📋 Datos del error:", respuesta);
      
      if (respuesta.cause && Array.isArray(respuesta.cause)) {
        const causa = respuesta.cause[0];
        console.error("🎯 Causa específica:", causa);
        switch (causa.code) {
          case "2001":
            mensajeUsuario = "La tarjeta fue rechazada por fondos insuficientes.";
            break;
          case "2004":
          case "2005":
          case "2006":
            mensajeUsuario = "La tarjeta fue rechazada. Contacta a tu banco para más información.";
            break;
          case "3001":
            mensajeUsuario = "La operación no está permitida para este método de pago.";
            break;
          default:
            mensajeUsuario = `Error: ${causa.description || respuesta.message}`;
        }
      } else if (respuesta.message) {
        mensajeUsuario = respuesta.message;
      } else if (respuesta.error) {
        mensajeUsuario = respuesta.error;
      }
    } else if (error.message) {
      mensajeUsuario = error.message;
    }
    
    console.error("📝 Mensaje final para usuario:", mensajeUsuario);
    return mensajeUsuario;
  }, []);

  const obtenerClavePublica = useCallback(async () => {
    try {
      const cachedKey = localStorage.getItem('mp_public_key');
      const cachedTimestamp = localStorage.getItem('mp_public_key_timestamp');
      
      if (cachedKey && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        if (Date.now() - timestamp < CACHE_DURATION_MS) {
          console.log("📋 Usando clave pública desde cache");
          setPublicKey(cachedKey);
          return cachedKey;
        }
      }
      
      console.log("🔑 Solicitando clave pública al backend...");
      const response = await clienteAxios.get(endpoints.mercadoPago.publicKey);
      
      console.log("🔍 Respuesta de public key:", response.data);
      
      if (response.data && response.data.public_key) {
        const newKey = response.data.public_key;
        
        if (newKey.includes("TEST-4e0f5e55-d687-4b7e-83db-12a20d3d6beb")) {
          console.log("✅ Clave pública de TEST confirmada (Checkout API)");
        } else {
          console.log("❌ PROBLEMA: Esta no es la clave de TEST esperada");
          console.log("   Esperada: TEST-4e0f5e55-d687-4b7e-83db-12a20d3d6beb");
          console.log("   Recibida:", newKey);
        }
        
        localStorage.setItem('mp_public_key', newKey);
        localStorage.setItem('mp_public_key_timestamp', Date.now().toString());
        
        setPublicKey(newKey);
        return newKey;
      }
      throw new Error('No se pudo obtener la clave pública de Mercado Pago');
    } catch (error) {
      console.error('❌ Error al obtener clave pública:', error);
      setError('No se pudo conectar con el servidor de pagos. Por favor, intenta nuevamente.');
      return null;
    }
  }, []);

  const obtenerMetodosPago = useCallback(async () => {
    try {
      console.log("📋 Obteniendo métodos de pago...");
      const response = await clienteAxios.get(endpoints.mercadoPago.paymentMethods);
      
      if (response.data && response.data.data) {
        setPaymentMethods(response.data.data);
        console.log("✅ Métodos de pago obtenidos:", response.data.data.length);
      }
    } catch (error) {
      console.error("❌ Error al obtener métodos de pago:", error);
    }
  }, []);

  const identifyPaymentMethod = useCallback(async (cardNumber: string) => {
    if (mp && cardNumber.length >= 6) {
      try {
        console.log("🔍 Identificando método de pago para BIN:", cardNumber.substring(0, 6));
        
        const response = await mp.getPaymentMethods({ bin: cardNumber.substring(0, 6) });
        
        console.log("📋 Respuesta de identificación:", response);
        
        if (response.results && response.results.length > 0) {
          const method = response.results[0];
          console.log("✅ Método identificado:", method);
          
          setCardForm(prev => ({
            ...prev,
            paymentMethodId: method.id
          }));

          if (method.payment_type_id === 'credit_card') {
            await obtenerEmisores(method.id);
          }
        } else {
          console.log("⚠️ No se encontraron métodos para este BIN");
        }
      } catch (error) {
        console.error('❌ Error al identificar método de pago:', error);
      }
    }
  }, [mp]);

  const obtenerEmisores = useCallback(async (paymentMethodId: string) => {
    try {
      console.log("🏛️ Obteniendo emisores para:", paymentMethodId);
      const response = await clienteAxios.get(
        `${endpoints.mercadoPago.cardIssuers}?payment_method_id=${paymentMethodId}`
      );
      
      if (response.data && response.data.data) {
        setCardIssuers(response.data.data);
        console.log("✅ Emisores obtenidos:", response.data.data.length);
      }
    } catch (error) {
      console.error("❌ Error al obtener emisores:", error);
    }
  }, []);

  // 🔧 CORREGIDO: Procesar pago con Checkout API
  const procesarPagoConCheckoutAPI = useCallback(async () => {
    if (cargandoPago) return;
    
    setCargandoPago(true);
    setError(null);
    setPagoIniciado(true);
    
    try {
        console.log("💳 Procesando pago con Checkout API...");
        console.log("📋 Datos del formulario:", cardForm);
        
        if (!mp) {
            throw new Error('MercadoPago SDK no está inicializado');
        }

        const tokenData = {
            cardNumber: cardForm.cardNumber.replace(/\s/g, ''),
            cardholderName: cardForm.cardholderName,
            cardExpirationMonth: cardForm.expiryMonth,
            cardExpirationYear: cardForm.expiryYear,
            securityCode: cardForm.securityCode,
            identificationType: cardForm.identificationType,
            identificationNumber: cardForm.identificationNumber,
        };

        console.log("🎫 Creando token con datos:", tokenData);
        const cardToken = await mp.createCardToken(tokenData);
        console.log("✅ Token de tarjeta creado:", cardToken.id);

        // 🔧 OBTENER EL ID DE RESERVA CORRECTO
        const reservaEnProceso = JSON.parse(sessionStorage.getItem('reservaEnProceso') || '{}');
        
        let reservaIdFinal;
        
        if (reservaEnProceso.id) {
            reservaIdFinal = reservaEnProceso.id;
            console.log("✅ Usando ID de reserva en proceso:", reservaIdFinal);
        } else if (datosReserva.reservaId) {
            reservaIdFinal = datosReserva.reservaId;
            console.log("✅ Usando ID de reserva de datos:", reservaIdFinal);
        } else {
            console.error("❌ No se encontró ID de reserva válido");
            console.error("   - reservaEnProceso:", reservaEnProceso);
            console.error("   - datosReserva:", datosReserva);
            throw new Error("No se encontró ID de reserva válido");
        }
        
        console.log("🔍 ID de reserva final a usar:", reservaIdFinal);

        const paymentData = {
            token: cardToken.id,
            transaction_amount: total,
            payment_method_id: cardForm.paymentMethodId || 'visa',
            issuer_id: cardForm.issuerId || undefined,
            installments: 1,
            reserva_id: reservaIdFinal, // 🔧 USAR EL ID CORRECTO
            email: datosUsuario.correo,
            first_name: datosUsuario.nombres,
            last_name: datosUsuario.apellidos,
            identification_type: cardForm.identificationType,
            identification_number: cardForm.identificationNumber
        };

        console.log("📤 Enviando datos de pago completos:", paymentData);

        const response = await clienteAxios.post(endpoints.mercadoPago.processCardPayment, paymentData);

        console.log("📥 Respuesta del pago:", response.data);

        if (response.data && response.data.success) {
            const paymentResult = response.data.data;
            
            navegarSegunEstadoPago(
                paymentResult.status,
                paymentResult.payment_id?.toString() || null,
                paymentResult.reserva_id || reservaIdFinal
            );
        } else {
            throw new Error('Error al procesar el pago');
        }

    } catch (error: any) {
        console.error('❌ Error en el pago con Checkout API:', error);
        setError(analizarErrorMercadoPago(error));
    } finally {
        setCargandoPago(false);
    }
}, [mp, cardForm, total, datosUsuario, datosReserva, analizarErrorMercadoPago]);

  const navegarSegunEstadoPago = useCallback((estado: string, paymentId: string | null, reservationId: number | null) => {
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
    
    console.log(`🧭 Navegando según estado de pago: ${estado}, Payment ID: ${paymentId}, Reservation ID: ${reservationId}`);
    
    limpiarDatosReservaEnProgreso();
    
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
      default:
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

  const verificarYConfirmarReserva = useCallback(async (idReserva: number, status: string, paymentId?: string) => {
    try {
      console.log(`🔍 Verificando y confirmando reserva ID=${idReserva}, status=${status}, paymentId=${paymentId || 'no disponible'}`);
      
      let url = `/api/v1/reservas/verificar-confirmar-pago?id_reserva=${idReserva}`;
      if (status) url += `&status=${status}`;
      if (paymentId) url += `&payment_id=${paymentId}`;
      
      const response = await clienteAxios.get(url);
      console.log("✅ Respuesta de verificación-confirmación:", response.data);
      
      if (response.data.success) {
        const reserva = response.data.data;
        if (reserva.estado === "CONFIRMADA") {
          setEstadoPagoVerificado(true);
          return {
            success: true,
            status: "approved",
            reserva: reserva
          };
        }
        
        if (reserva.estado === "CANCELADA" || reserva.estado === "ANULADA") {
          setEstadoPagoVerificado(true);
          return {
            success: true,
            status: "rejected",
            reserva: reserva
          };
        }
        
        return {
          success: false,
          status: reserva.estado,
          reserva: reserva
        };
      }
      
      return { success: false, status: null };
    } catch (error) {
      console.error("❌ Error al verificar y confirmar reserva:", error);
      return { success: false, status: null };
    }
  }, []);

  const verificarPagoUnificado = useCallback(async (idReserva: number, preferenceId: string, paymentId?: string) => {
    try {
      console.log(`🔍 Verificando pago unificado: reserva=${idReserva}, preferencia=${preferenceId}, pago=${paymentId || 'no disponible'}`);
      
      if (estadoPagoVerificado) {
        return { success: true, status: null };
      }
      
      if (intentosVerificacion >= maxIntentosVerificacion) {
        console.log(`⏸️ Máximo de intentos alcanzado (${maxIntentosVerificacion})`);
        return { success: false, status: null };
      }
      
      setIntentosVerificacion(prev => prev + 1);
      
      if (idReserva) {
        const resultado = await verificarYConfirmarReserva(idReserva, "approved", paymentId);
        if (resultado.success && resultado.status) {
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
      
      let url = `${endpoints.mercadoPago.verificarPago}?preference_id=${preferenceId}`;
      if (paymentId) {
        url += `&payment_id=${paymentId}`;
      }
      
      console.log("🔗 URL de verificación general:", url);
      const response = await clienteAxios.get(url);
      
      if (response.data && response.data.data && response.data.data.status) {
        setEstadoPagoVerificado(true);
        
        const { status, payment_id, reservation_id } = response.data.data;
        
        if (reservation_id) {
          try {
            await verificarYConfirmarReserva(reservation_id, status, payment_id);
          } catch (err) {
            console.error("❌ Error al confirmar reserva explícitamente:", err);
          }
        }
        
        navegarSegunEstadoPago(status, payment_id, reservation_id);
        
        return { 
          success: true, 
          status,
          payment_id,
          reservation_id 
        };
      }
      
      return { success: false, status: null };
    } catch (error) {
      console.error("❌ Error en verificación unificada:", error);
      return { success: false, status: null };
    }
  }, [estadoPagoVerificado, intentosVerificacion, maxIntentosVerificacion, verificarYConfirmarReserva, navegarSegunEstadoPago]);

  const crearPreferenciaReal = useCallback(async () => {
    try {
      if (preferencia) {
        console.log("♻️ Ya existe una preferencia, reutilizando:", preferencia);
        return preferencia;
      }
      
      if (datosReserva.reservaId) {
        console.log("💳 Obteniendo preferencia para reserva existente:", datosReserva.reservaId);
        
        const endpoint = endpoints.mercadoPago.pagarReserva(datosReserva.reservaId);
        console.log("🔗 Endpoint utilizado:", endpoint);
        
        const response = await clienteAxios.post(endpoint);
        console.log("📥 Respuesta del servidor para reserva existente:", response.data);
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else {
          console.error("❌ Respuesta sin datos de preferencia:", response.data);
          throw new Error("La respuesta del servidor no contiene datos de preferencia");
        }
      } else if (datosReserva.instanciaId) {
        const cacheKey = `reserva_en_proceso_${datosReserva.instanciaId}`;
        const reservaExistente = localStorage.getItem(cacheKey);
        const ahora = Date.now();
        
        if (reservaExistente) {
          try {
            const reservaCache = JSON.parse(reservaExistente);
            if (reservaCache.timestamp && (ahora - reservaCache.timestamp < CACHE_DURATION_MS)) {
              console.log("📋 Usando preferencia del cache:", reservaCache.data);
              return reservaCache.data;
            } else {
              console.log("🗑️ Preferencia en cache expirada, eliminando");
              localStorage.removeItem(cacheKey);
            }
          } catch (e) {
            console.error("❌ Error al parsear preferencia en cache:", e);
            localStorage.removeItem(cacheKey);
          }
        }
        
        console.log("🆕 Creando nueva reserva con MercadoPago para instancia:", datosReserva.instanciaId);
        console.log("📊 Datos de reserva completos:", JSON.stringify(datosReserva, null, 2));
        
        if (!datosReserva.instanciaId) {
          console.error("❌ Error: No hay ID de instancia");
          throw new Error("No se encontró ID de instancia");
        }
        
        let pasajes: Pasaje[] = [];
        
        if (datosReserva.cantidadesPasajes && Array.isArray(datosReserva.cantidadesPasajes)) {
          pasajes = datosReserva.cantidadesPasajes
            .filter((p: PasajeDatosReserva) => p.cantidad > 0)
            .map((p: PasajeDatosReserva) => ({
              id_tipo_pasaje: p.idTipoPasaje,
              cantidad: p.cantidad,
              precio_unitario: p.precioUnitario
            }));
        } else if (datosReserva.seleccionPasajes) {
          pasajes = Object.entries(datosReserva.seleccionPasajes)
            .filter(([_, cantidadValue]) => {
              const cantidad = Number(cantidadValue);
              return !isNaN(cantidad) && cantidad > 0;
            })
            .map(([tipoId, cantidadValue]) => {
              const cantidad = Number(cantidadValue);
              
              return {
                id_tipo_pasaje: parseInt(tipoId),
                cantidad: cantidad,
                precio_unitario: cantidad > 0 ? (subtotal / datosReserva.totalPasajeros) : 0
              };
            });
        }
        
        console.log("🎫 Pasajes formateados:", JSON.stringify(pasajes, null, 2));
        
        if (pasajes.length === 0) {
          console.error("❌ Error: No hay pasajes seleccionados");
          throw new Error("Debe seleccionar al menos un pasaje");
        }
        
        let paquetes: Paquete[] = [];
        
        if (datosReserva.paquetes && Array.isArray(datosReserva.paquetes)) {
          paquetes = datosReserva.paquetes
            .filter((p: PaqueteDatosReserva) => p.seleccionado)
            .map((p: PaqueteDatosReserva) => ({
              id_paquete: p.idPaquetePasajes,
              precio: p.precio
            }));
        } else if (datosReserva.seleccionPaquetes) {
          paquetes = Object.entries(datosReserva.seleccionPaquetes)
            .filter(([_, seleccionadoValue]) => {
              return seleccionadoValue === true || seleccionadoValue === 1 || Number(seleccionadoValue) > 0;
            })
            .map(([paqueteId, _]) => ({
              id_paquete: parseInt(paqueteId),
              precio: 0
            }));
        }
        
        console.log("📦 Paquetes formateados:", JSON.stringify(paquetes, null, 2));
        
        const sessionId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        const datosParaEnviar = {
          id_instancia: Number(datosReserva.instanciaId),
          id_tour_programado: Number(datosReserva.instanciaId), 
          id_cliente: usuario?.id_cliente ? Number(usuario.id_cliente) : 0, 
          cantidad_pasajes: pasajes,
          paquetes: paquetes,
          monto: parseFloat((datosReserva.total || total).toFixed(2)),
          total_pagar: parseFloat((datosReserva.total || total).toFixed(2)),
          tour_nombre: datosReserva.tourNombre || "Tour",
          email: usuario?.correo || datosUsuario.correo || "",
          nombre: usuario?.nombres || datosUsuario.nombres || "",
          apellido: usuario?.apellidos || datosUsuario.apellidos || "",
          telefono: usuario?.numero_celular || datosUsuario.numero_celular || "",
          documento: usuario?.numero_documento || datosUsuario.numero_documento || "",
          session_id: sessionId
        };
        
        if (!datosParaEnviar.email) {
          console.error("❌ Error: No hay email");
          throw new Error("El email es obligatorio");
        }
        
        if (!datosParaEnviar.nombre) {
          console.error("❌ Error: No hay nombre");
          throw new Error("El nombre es obligatorio");
        }
        
        if (!datosParaEnviar.apellido) {
          console.error("❌ Error: No hay apellido");
          throw new Error("El apellido es obligatorio");
        }
        
        console.log("📤 DATOS QUE SE ENVIARÁN:", JSON.stringify(datosParaEnviar, null, 2));
        console.log("🔗 Endpoint:", endpoints.mercadoPago.reservar);
        
        const reservaTemporalId = `reserva_temp_${datosReserva.instanciaId}_${Date.now()}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          temporalId: reservaTemporalId,
          timestamp: ahora,
          sessionId: sessionId
        }));
        
        try {
          console.log("🚀 Iniciando solicitud POST...");
          const response = await clienteAxios.post(endpoints.mercadoPago.reservar, datosParaEnviar);
          console.log("📥 Respuesta del servidor:", JSON.stringify(response.data, null, 2));
          
          if (response.data && response.data.data) {
            if (response.data.data.id_reserva) {
              console.log("✅ ID de reserva creada:", response.data.data.id_reserva);
              
              localStorage.setItem(cacheKey, JSON.stringify({
                data: response.data.data,
                timestamp: ahora,
                sessionId: sessionId
              }));
              
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
            console.error("❌ Respuesta sin datos de preferencia:", response.data);
            throw new Error("La respuesta del servidor no contiene datos de preferencia");
          }
        } catch (error: any) {
          localStorage.removeItem(cacheKey);
          
          console.error("❌ ERROR DETALLADO AL CREAR PREFERENCIA:", error);
          
          if (error.response) {
            console.error("📊 Status del error:", error.response.status);
            console.error("📋 Headers:", JSON.stringify(error.response.headers, null, 2));
            console.error("💥 Datos del error:", JSON.stringify(error.response.data, null, 2));
            
            const mensajeError = analizarErrorMercadoPago(error);
            throw new Error(mensajeError);
          } else if (error.request) {
            console.error("❌ Error: No se recibió respuesta del servidor");
            console.error("🔗 Detalles de la solicitud:", JSON.stringify(error.request, null, 2));
            throw new Error("No se recibió respuesta del servidor. Verifica tu conexión a internet.");
          } else {
            console.error("⚙️ Error al configurar la solicitud:", error.message);
            throw error;
          }
        }
      } else {
        console.error("❌ Error: No hay ID de reserva ni de instancia");
        throw new Error("No se encontró ID de reserva o instancia");
      }
    } catch (error: any) {
      console.error("💥 ERROR COMPLETO AL CREAR PREFERENCIA REAL:", error);
      console.error("📝 Mensaje:", error.message);
      console.error("📚 Stack:", error.stack);
      
      setError(analizarErrorMercadoPago(error));
      
      throw error;
    }
  }, [datosReserva, datosUsuario, usuario, total, preferencia, analizarErrorMercadoPago, subtotal]);
  
  const obtenerOCrearPreferencia = useCallback(async () => {
    if (preferencia && preferencia.id) {
      return preferencia;
    }
    
    const cacheKey = `reserva_en_proceso_${datosReserva.instanciaId}`;
    const reservaCache = localStorage.getItem(cacheKey);
    
    if (reservaCache) {
      try {
        const datosCacheados = JSON.parse(reservaCache);
        if (datosCacheados.data && datosCacheados.timestamp && 
            (Date.now() - datosCacheados.timestamp < CACHE_DURATION_MS)) {
          setPreferencia(datosCacheados.data);
          return datosCacheados.data;
        }
      } catch (e) {
        console.error("❌ Error al parsear preferencia cacheada:", e);
      }
    }
    
    return await crearPreferenciaReal();
  }, [preferencia, datosReserva.instanciaId, crearPreferenciaReal]);
  
  const cargarMercadoPagoSDK = useCallback(() => {
    if (window.MercadoPago) {
      console.log("✅ SDK de MercadoPago ya está cargado");
      setSdkCargado(true);
      return Promise.resolve();
    }
    
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      
      script.onload = () => {
        console.log("✅ SDK de MercadoPago v2 cargado correctamente");
        setSdkCargado(true);
        
        window.addEventListener('error', function(event) {
          const target = event.target as HTMLElement;
          
          if (target && 'src' in target) {
            const src = (target as HTMLImageElement | HTMLScriptElement).src;
            
            if (src && 
                typeof src === 'string' && 
                src.includes('mercadopago.com') && 
                src.includes('jms/lgz/background/session/')) {
              console.log("🔇 Ignorando error conocido de MercadoPago:", src);
              event.preventDefault();
              return false;
            }
          }
        }, true);
        
        resolve();
      };
      
      script.onerror = () => {
        console.error("❌ Error al cargar el SDK de MercadoPago v2");
        setError("No se pudo cargar el procesador de pagos. Verifica tu conexión a internet.");
        reject();
      };
      
      document.head.appendChild(script);
    });
  }, []);

  const inicializarMercadoPagoSDK = useCallback(async () => {
    try {
      if (!publicKey) {
        const key = await obtenerClavePublica();
        if (!key) return;
      }

      if (window.MercadoPago && publicKey) {
        const mercadoPago = new window.MercadoPago(publicKey, {
          locale: 'es-PE'
        });
        
        setMp(mercadoPago);
        console.log("✅ MercadoPago SDK v2 inicializado para Checkout API");
        
        await obtenerMetodosPago();
      }
    } catch (error) {
      console.error("❌ Error al inicializar MercadoPago SDK v2:", error);
    }
  }, [publicKey, obtenerClavePublica, obtenerMetodosPago]);

  const renderizarBotonMercadoPago = useCallback(() => {
    if (!preferencia) {
      console.log("⏸️ No hay preferencia para renderizar el botón");
      return;
    }
    
    if (!mercadoPagoButtonRef.current) {
      console.log("⏸️ No se encontró la referencia al contenedor del botón");
      return;
    }
    
    if (!window.MercadoPago) {
      console.log("⏸️ El SDK de MercadoPago no está disponible");
      return;
    }
    
    if (!publicKey) {
      console.log("⏸️ No hay clave pública disponible");
      return;
    }
    
    try {
      const preferenceId = preferencia.preference_id || preferencia.id;
      
      if (!preferenceId) {
        console.error("❌ No se encontró ID de preferencia válido");
        return;
      }
      
      console.log("🎨 Renderizando botón con preferenceId:", preferenceId);
      
      if (mercadoPagoButtonRef.current) {
        mercadoPagoButtonRef.current.innerHTML = '';
      }
      
      const mp = new window.MercadoPago(publicKey, {
        locale: 'es-PE', 
        advancedOptions: {
          checkoutPro: {
            displayMode: 'redirect'
          }
        }
      });
      
      if (mercadoPagoButtonRef.current && mercadoPagoButtonRef.current.childElementCount === 0) {
        mp.checkout({
          preference: {
            id: preferenceId
          },
          render: {
            container: '.mercado-pago-button',
            label: 'Pagar',
            type: 'wallet',
          },
          theme: {
            elementsColor: '#0062cc',
            headerColor: '#0062cc'
          },
          autoOpen: false,
          callbacks: {
            onError: (error: any) => {
              console.error("❌ Error en MercadoPago Checkout:", error);
              setError(`Error en el procesamiento del pago: ${error.message || 'Error desconocido'}`);
            },
            onReady: () => {
              console.log("✅ MercadoPago Checkout listo");
              setCargandoMercadoPago(false);
            }
          }
        });
        
        console.log("✅ Botón de MercadoPago renderizado correctamente");
      } else {
        console.log("⏸️ El contenedor ya tiene elementos, no se renderizará nuevamente");
      }
    } catch (error) {
      console.error("❌ Error al renderizar el botón de MercadoPago:", error);
      setError("Error al inicializar el botón de pago. Por favor, actualiza la página.");
    }
  }, [preferencia, publicKey]);

  const iniciarProcesoPago = useCallback(async () => {
    try {
      setCargandoMercadoPago(true);
      setError(null);
      
      await cargarMercadoPagoSDK();
      
      if (!publicKey) {
        const key = await obtenerClavePublica();
        if (!key) {
          throw new Error('No se pudo obtener la clave pública de Mercado Pago');
        }
      }
      
      console.log("💳 Usando modo real para obtener o crear preferencia");
      const nuevaPreferencia = await obtenerOCrearPreferencia();
      
      if (!preferencia) {
        setPreferencia(nuevaPreferencia);
      }

      await inicializarMercadoPagoSDK();
      
      return nuevaPreferencia;
    } catch (error: any) {
      console.error("❌ Error al iniciar el proceso de pago:", error);
      setError(analizarErrorMercadoPago(error));
      return null;
    } finally {
      setCargandoMercadoPago(false);
    }
  }, [cargarMercadoPagoSDK, obtenerOCrearPreferencia, obtenerClavePublica, publicKey, preferencia, analizarErrorMercadoPago, inicializarMercadoPagoSDK]);

  const procesarPagoDirecto = async () => {
    if (cargandoPago) return;
    
    setCargandoPago(true);
    setError(null);
    setPagoIniciado(true);
    sessionStorage.setItem('pagoIniciado', 'true');
    
    try {
      console.log("🚀 Procesando pago directo...");

      if (modoCheckout === 'api') {
        await procesarPagoConCheckoutAPI();
        return;
      }
      
      if (preferencia) {
        console.log("🔍 ========== VERIFICACIÓN DE PREFERENCIA ==========");
        console.log("📋 Preferencia completa:", JSON.stringify(preferencia, null, 2));
        console.log("🎯 IS_SANDBOX (forzado):", IS_SANDBOX);
        console.log("🌐 preferencia.sandbox_init_point:", preferencia.sandbox_init_point);
        console.log("🌐 preferencia.init_point:", preferencia.init_point);
        
        let url;
        
        if (IS_SANDBOX && preferencia.sandbox_init_point) {
          url = preferencia.sandbox_init_point;
          console.log("✅ Usando sandbox_init_point (CORRECTO):", url);
        } else if (preferencia.sandbox_init_point) {
          url = preferencia.sandbox_init_point;
          console.log("✅ Forzando uso de sandbox_init_point:", url);
        } else if (preferencia.init_point) {
          url = preferencia.init_point;
          console.log("⚠️ Usando init_point como fallback:", url);
        } else {
          console.log("❌ No se encontró ninguna URL válida");
          throw new Error("No se encontró URL de pago válida en la preferencia");
        }
        
        console.log("🎯 URL FINAL seleccionada:", url);
        
        if (url.includes('sandbox.mercadopago.com')) {
          console.log("🎉 CONFIRMADO: URL es de SANDBOX");
        } else if (url.includes('www.mercadopago.com')) {
          console.log("🚨 ADVERTENCIA: URL es de PRODUCCIÓN - Esto no debería pasar");
        }
        
        console.log("================================================");
        
        if (url) {
          const urlConParametros = `${url}&source=website&version=v2`;
          console.log("🚀 Redirigiendo a:", urlConParametros);
          window.location.href = urlConParametros;
        } else {
          throw new Error("No se encontró URL de pago válida en la preferencia");
        }
        return;
      }
      
      const nuevaPreferencia = await iniciarProcesoPago();
      
      if (nuevaPreferencia) {
        let url;
        
        if (nuevaPreferencia.sandbox_init_point) {
          url = nuevaPreferencia.sandbox_init_point;
          console.log("✅ Nueva preferencia - Usando sandbox_init_point:", url);
        } else {
          url = nuevaPreferencia.init_point;
          console.log("⚠️ Nueva preferencia - Usando init_point como fallback:", url);
        }
        
        if (url) {
          console.log("🚀 Redirigiendo a nueva preferencia:", url);
          window.location.href = url;
        } else {
          throw new Error("No se encontró URL de pago en la nueva preferencia");
        }
        return;
      }
      
      setError("No se pudo generar el pago. Por favor, intenta nuevamente.");
      
    } catch (error: any) {
      console.error('❌ Error al procesar el pago:', error);
      setError(analizarErrorMercadoPago(error));
    } finally {
      setCargandoPago(false);
    }
  };
  
  useEffect(() => {
    const iniciarMercadoPago = async () => {
      try {
        if (preferencia) {
          console.log("♻️ Ya existe una preferencia, no se creará otra");
          setCargandoMercadoPago(false);
          return;
        }
        
        setCargandoMercadoPago(true);
        
        if (!publicKey) {
          await obtenerClavePublica();
        }
        
        await iniciarProcesoPago();
        
      } catch (error) {
        console.error('❌ Error al inicializar Mercado Pago:', error);
      } finally {
        setCargandoMercadoPago(false);
      }
    };
    
    iniciarMercadoPago();
  }, [obtenerClavePublica, iniciarProcesoPago, publicKey, preferencia]);

  useEffect(() => {
    if (preferencia && sdkCargado && publicKey && modoCheckout === 'pro') {
      const debouncedRender = debounce(() => {
        renderizarBotonMercadoPago();
      }, 500);
      
      debouncedRender();
      
      return () => {
        debouncedRender.cancel();
      };
    }
  }, [preferencia, sdkCargado, publicKey, renderizarBotonMercadoPago, modoCheckout]);
  
  useEffect(() => {
    if (IS_SANDBOX && preferencia && preferencia.id && !estadoPagoVerificado && pagoIniciado) {
      console.log("🔄 Iniciando verificación periódica del estado de pago...");
      
      const reservaEnProceso = JSON.parse(sessionStorage.getItem('reservaEnProceso') || '{}');
      const idReserva = reservaEnProceso.id || datosReserva.reservaId || datosReserva.instanciaId;
      
      verificarPagoUnificado(idReserva, preferencia.id).then(result => {
        if (result.success && result.status) {
          console.log(`✅ Estado de pago verificado: ${result.status}`);
          navegarSegunEstadoPago(result.status, result.payment_id || null, result.reservation_id || null);
        }
      });
      
      const intervalId = setInterval(async () => {
        const result = await verificarPagoUnificado(idReserva, preferencia.id);
        if (result.success && result.status) {
          clearInterval(intervalId);
          console.log(`✅ Estado de pago verificado en intervalo: ${result.status}`);
          navegarSegunEstadoPago(result.status, result.payment_id || null, result.reservation_id || null);
        }
      }, 3000);
      
      return () => {
        clearInterval(intervalId);
        console.log("⏹️ Verificación periódica detenida");
      };
    }
  }, [preferencia, IS_SANDBOX, verificarPagoUnificado, navegarSegunEstadoPago, estadoPagoVerificado, pagoIniciado, datosReserva]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const paymentId = params.get('payment_id');
    const externalReference = params.get('external_reference');
    const errorMessage = params.get('error');
    const preferenceId = params.get('preference_id');
    
    if (status || paymentId) {
      console.log(`🔙 Retornando de MercadoPago con estado: ${status}, payment_id: ${paymentId}`);
      
      if (errorMessage) {
        if (errorMessage.includes("insufficient_amount")) {
          setError("Tu tarjeta no tiene saldo suficiente para completar esta compra.");
        } else if (errorMessage.includes("cc_rejected")) {
          setError("La tarjeta fue rechazada. Por favor, intenta con otro método de pago.");
        } else {
          setError(`Error en el pago: ${errorMessage}`);
        }
      }
      
      let reservaId;
      if (externalReference && externalReference.startsWith('RESERVA-')) {
        reservaId = parseInt(externalReference.replace('RESERVA-', ''));
      } else {
        const reservaEnProceso = JSON.parse(sessionStorage.getItem('reservaEnProceso') || '{}');
        reservaId = reservaEnProceso.id || datosReserva.reservaId || datosReserva.instanciaId;
      }
      
      if (reservaId) {
        verificarYConfirmarReserva(reservaId, status || "approved", paymentId || undefined)
          .then(result => {
            if (result.success && result.status) {
              navegarSegunEstadoPago(result.status, paymentId || null, reservaId);
            } else {
              if (status) {
                navegarSegunEstadoPago(status, paymentId || null, reservaId);
              }
            }
          })
          .catch(error => {
            console.error("❌ Error al verificar y confirmar reserva:", error);
            if (status) {
              navegarSegunEstadoPago(status, paymentId || null, reservaId);
            }
          });
      } else {
        if (status) {
          navegarSegunEstadoPago(status, paymentId || null, null);
        }
      }
    }
  }, [location.search, navegarSegunEstadoPago, datosReserva, verificarYConfirmarReserva]);
  
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
      console.error("❌ Error al formatear fecha:", error);
      return 'Fecha no válida';
    }
  };
  
  useEffect(() => {
    return () => {
      if (!estadoPagoVerificado) {
        console.log("🧹 Limpiando datos temporales al desmontar");
        sessionStorage.removeItem('pagoIniciado');
      }
    };
  }, [estadoPagoVerificado]);
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-white via-blue-50 to-cyan-50 min-h-screen">
      <div className="flex flex-col space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{t('pago.titulo', 'Proceso de Pago')}</h1>
              <p className="mt-1 opacity-90">{t('pago.subtitulo', 'Completa tu reserva realizando el pago')}</p>
            </div>
            
            {IS_SANDBOX && (
              <div className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-lg text-sm font-medium">
                🧪 Modo Test
              </div>
            )}
          </div>
          
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
          <div className="lg:col-span-2 space-y-6">
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
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-cyan-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Opciones de pago
              </h2>
              
              {IS_SANDBOX && (
                <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center mr-3">
                      <span className="text-yellow-900 font-bold">🧪</span>
                    </div>
                    <span className="font-semibold text-yellow-800">Modo Test Activo</span>
                  </div>
                  <p className="text-sm text-yellow-700 ml-11">
                    Los pagos son simulaciones. Ningún cargo real será efectuado.
                  </p>
                  <div className="mt-2 ml-11 text-xs text-yellow-600">
                    Entorno: {ACTUAL_ENV} | Test Mode: {IS_SANDBOX ? 'Sí' : 'No'}
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mt-4 mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setModoCheckout('api')}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
                      modoCheckout === 'api'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    💳 Checkout API
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setModoCheckout('pro')}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
                      modoCheckout === 'pro'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🌐 Pro
                  </button>
                </div>
              </div>

              {modoCheckout === 'api' && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Datos de la tarjeta
                    </h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de tarjeta *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardForm.cardNumber}
                        onChange={handleCardFormChange}
                        placeholder="4509 9535 6623 3704"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength={19}
                        required
                      />
                      {cardForm.paymentMethodId && (
                        <div className="mt-1 text-xs text-green-600">
                          ✅ {cardForm.paymentMethodId.toUpperCase()} detectada
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del titular *
                      </label>
                      <input
                        type="text"
                        name="cardholderName"
                        value={cardForm.cardholderName}
                        onChange={handleCardFormChange}
                        placeholder="APRO"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mes *
                        </label>
                        <select
                          name="expiryMonth"
                          value={cardForm.expiryMonth}
                          onChange={handleCardFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Año *
                        </label>
                        <select
                          name="expiryYear"
                          value={cardForm.expiryYear}
                          onChange={handleCardFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">AA</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <option key={year} value={String(year).slice(-2)}>
                                {String(year).slice(-2)}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="securityCode"
                          value={cardForm.securityCode}
                          onChange={handleCardFormChange}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo Doc.
                        </label>
                        <select
                          name="identificationType"
                          value={cardForm.identificationType}
                          onChange={handleCardFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="DNI">DNI</option>
                          <option value="CE">CE</option>
                          <option value="PPN">Pasaporte</option>
                        </select>
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de documento *
                        </label>
                        <input
                          type="text"
                          name="identificationNumber"
                          value={cardForm.identificationNumber}
                          onChange={handleCardFormChange}
                          placeholder="12345678"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                {cargandoMercadoPago ? (
                  <div className="w-full py-8 flex flex-col justify-center items-center bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                    <div className="animate-spin h-8 w-8 border-t-3 border-b-3 border-blue-500 rounded-full mb-3"></div>
                    <span className="text-blue-600 font-medium">Conectando con MercadoPago...</span>
                    <span className="text-blue-500 text-sm mt-1">
                      {IS_SANDBOX ? '🧪 Modo test activo' : '🔐 Modo producción'}
                    </span>
                  </div>
                ) : (
                  <>
                    {modoCheckout === 'pro' && (
                      <div 
                        className="mercado-pago-button w-full min-h-[60px] bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-dashed border-blue-200 mb-4 flex items-center justify-center"
                        ref={mercadoPagoButtonRef}
                      >
                        <div className="text-center">
                          <span className="text-sm text-blue-500 block">🔄 Cargando opciones de pago...</span>
                          <span className="text-xs text-blue-400">MercadoPago Checkout Pro</span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={modoCheckout === 'api' ? procesarPagoConCheckoutAPI : procesarPagoDirecto}
                      disabled={cargandoPago || (modoCheckout === 'api' && (!cardForm.cardNumber || !cardForm.cardholderName || !cardForm.expiryMonth || !cardForm.expiryYear || !cardForm.securityCode || !cardForm.identificationNumber))}
                      className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl ${
                        cargandoPago || (modoCheckout === 'api' && (!cardForm.cardNumber || !cardForm.cardholderName || !cardForm.expiryMonth || !cardForm.expiryYear || !cardForm.securityCode || !cardForm.identificationNumber))
                          ? 'opacity-70 cursor-not-allowed' 
                          : 'hover:from-blue-700 hover:to-teal-700 transform hover:-translate-y-0.5'
                      }`}
                    >
                      {cargandoPago ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando pago...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          {modoCheckout === 'api' ? 'Pagar con tarjeta' : 'Pagar'} S/ {total.toFixed(2)}
                          {IS_SANDBOX && <span className="ml-2 text-xs opacity-75">(Test)</span>}
                        </span>
                      )}
                    </button>
                    
                    {intentosVerificacion > 0 && !estadoPagoVerificado && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-center text-blue-600">
                          <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium">
                            Verificando estado del pago ({intentosVerificacion}/{maxIntentosVerificacion})
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <p className="mt-4 text-xs text-center text-gray-500 leading-relaxed">
                      Al hacer clic en "Pagar", aceptas nuestros{' '}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        términos y condiciones
                      </a>{' '}
                      y{' '}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        política de privacidad
                      </a>.
                    </p>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-800">Pago 100% seguro</h3>
                    <p className="text-sm text-emerald-600">
                      Protegido por tecnología SSL de última generación
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Datos protegidos</h3>
                    <p className="text-sm text-blue-600">
                      No almacenamos información de tarjetas de crédito
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800">Procesado por MercadoPago</h3>
                    <p className="text-sm text-purple-600">
                      Plataforma líder en pagos online de Latinoamérica
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border-2 border-cyan-300 text-cyan-700 font-medium rounded-lg transition-all duration-200 hover:bg-cyan-50 hover:border-cyan-400 flex items-center shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver atrás
          </button>
          
          {ACTUAL_ENV === 'development' && (
            <div className="text-xs text-gray-500 text-right">
              <div>ENV: {ACTUAL_ENV}</div>
              <div>Test Mode: {IS_SANDBOX ? 'Activo' : 'Inactivo'}</div>
              <div>Modo: {modoCheckout}</div>
              {preferencia && (
                <div>Pref ID: {preferencia.preference_id || preferencia.id}</div>
              )}
              {cardForm.paymentMethodId && (
                <div>Method: {cardForm.paymentMethodId}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginaProcesoPago;