/*import { useState, useEffect, useRef, useCallback } from 'react';
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

// Interfaz para el logger mejorado
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: string;
  message: string;
  data?: any;
}

// 🔧 CONSTANTES ACTUALIZADAS
const IS_PRODUCTION = false;
const IS_SANDBOX = true;
const CACHE_DURATION_MS = 15 * 60 * 1000;
const ACTUAL_ENV = process.env.NODE_ENV;

// 📊 Logger mejorado
class PaymentLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private createEntry(level: LogEntry['level'], category: string, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : undefined
    };
  }

  info(category: string, message: string, data?: any) {
    const entry = this.createEntry('info', category, message, data);
    this.logs.push(entry);
    console.log(`🔵 [${category}] ${message}`, data || '');
    this.trimLogs();
  }

  warn(category: string, message: string, data?: any) {
    const entry = this.createEntry('warn', category, message, data);
    this.logs.push(entry);
    console.warn(`🟡 [${category}] ${message}`, data || '');
    this.trimLogs();
  }

  error(category: string, message: string, data?: any) {
    const entry = this.createEntry('error', category, message, data);
    this.logs.push(entry);
    console.error(`🔴 [${category}] ${message}`, data || '');
    this.trimLogs();
  }

  debug(category: string, message: string, data?: any) {
    const entry = this.createEntry('debug', category, message, data);
    this.logs.push(entry);
    console.debug(`🟣 [${category}] ${message}`, data || '');
    this.trimLogs();
  }

  private trimLogs() {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs() {
    this.logs = [];
  }
}

const PaginaProcesoPago = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, autenticado } = useSelector((state: RootState) => state.autenticacion);
  
  const datosReserva = location.state || JSON.parse(sessionStorage.getItem('datosReservaPendiente') || '{}');
  
  // 📊 Logger mejorado
  const loggerRef = useRef(new PaymentLogger());
  const logger = loggerRef.current;
  
  // Estados principales
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
  const [procesandoPago, setProcesandoPago] = useState(false);
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
  
  // Estados para manejo de usuario
  const [editandoUsuario, setEditandoUsuario] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState({
    nombres: usuario?.nombres || '',
    apellidos: usuario?.apellidos || '',
    correo: usuario?.correo || '',
    numero_celular: usuario?.numero_celular || '',
    numero_documento: usuario?.numero_documento || ''
  });

  // Estados para UI mejorada
  const [mostrandoLogs, setMostrandoLogs] = useState(false);
  const [validacionFormulario, setValidacionFormulario] = useState<{[key: string]: string}>({});

  const mercadoPagoButtonRef = useRef<HTMLDivElement>(null);
  
  const subtotal = Number(datosReserva.total || 0);
  const igv = subtotal * 0.18;
  const total = subtotal;

  // 🚀 Inicialización mejorada
  useEffect(() => {
    logger.info('INIT', 'Inicializando componente de pago', {
      NODE_ENV: ACTUAL_ENV,
      IS_SANDBOX,
      IS_PRODUCTION,
      modoCheckout,
      datosReserva: {
        ...datosReserva,
        // No loggear datos sensibles
        usuario: undefined
      }
    });
    
    window.scrollTo(0, 0);
  }, []);

  // 📝 Validación mejorada del formulario
  const validarFormulario = useCallback(() => {
    const errores: {[key: string]: string} = {};

    if (modoCheckout === 'api') {
      if (!cardForm.cardNumber.replace(/\s/g, '')) {
        errores.cardNumber = 'El número de tarjeta es requerido';
      } else if (cardForm.cardNumber.replace(/\s/g, '').length < 13) {
        errores.cardNumber = 'Número de tarjeta incompleto';
      }

      if (!cardForm.cardholderName.trim()) {
        errores.cardholderName = 'El nombre del titular es requerido';
      }

      if (!cardForm.expiryMonth) {
        errores.expiryMonth = 'El mes es requerido';
      }

      if (!cardForm.expiryYear) {
        errores.expiryYear = 'El año es requerido';
      }

      if (!cardForm.securityCode) {
        errores.securityCode = 'El CVV es requerido';
      } else if (cardForm.securityCode.length < 3) {
        errores.securityCode = 'CVV incompleto';
      }

      if (!cardForm.identificationNumber.trim()) {
        errores.identificationNumber = 'El número de documento es requerido';
      }
    }

    setValidacionFormulario(errores);
    return Object.keys(errores).length === 0;
  }, [cardForm, modoCheckout]);

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosUsuario(prev => ({
      ...prev,
      [name]: value
    }));
    
    logger.debug('USER_FORM', 'Campo de usuario actualizado', { campo: name, valor: value?.length > 0 ? '[PRESENTE]' : '[VACÍO]' });
  };
  
  const guardarCambiosUsuario = () => {
    setEditandoUsuario(false);
    logger.info('USER_FORM', 'Cambios de usuario guardados');
    
    // Aquí podrías agregar una llamada a la API para guardar los cambios
    // await actualizarDatosUsuario(datosUsuario);
    
    alert('Cambios guardados correctamente.');
  };

  const handleCardFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let valorFormateado = value;
    
    // Formateo automático del número de tarjeta
    if (name === 'cardNumber') {
      valorFormateado = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    
    // Limitar longitud del CVV
    if (name === 'securityCode') {
      valorFormateado = value.replace(/\D/g, '').slice(0, 4);
    }
    
    // Limitar número de documento
    if (name === 'identificationNumber') {
      valorFormateado = value.replace(/\D/g, '').slice(0, 12);
    }
    
    setCardForm(prev => ({
      ...prev,
      [name]: valorFormateado
    }));

    // Limpiar error específico cuando el usuario empiece a escribir
    if (validacionFormulario[name]) {
      setValidacionFormulario(prev => {
        const nuevo = {...prev};
        delete nuevo[name];
        return nuevo;
      });
    }

    if (name === 'cardNumber') {
      const numeroLimpio = valorFormateado.replace(/\s/g, '');
      if (numeroLimpio.length >= 6) {
        identifyPaymentMethod(numeroLimpio);
      }
    }

    logger.debug('CARD_FORM', 'Campo de tarjeta actualizado', { 
      campo: name, 
      longitud: valorFormateado.length,
      esNumeroTarjeta: name === 'cardNumber'
    });
  };

  const limpiarDatosReservaEnProgreso = useCallback(() => {
    const instanciaId = datosReserva.instanciaId;
    if (instanciaId) {
      localStorage.removeItem(`reserva_en_proceso_${instanciaId}`);
      logger.info('CLEANUP', 'Datos de reserva en progreso limpiados', { instanciaId });
    }
    sessionStorage.removeItem('pagoIniciado');
    sessionStorage.removeItem('reservaEnProceso');
    logger.info('CLEANUP', 'Sessions storage limpiado');
  }, [datosReserva.instanciaId, logger]);

  const analizarErrorMercadoPago = useCallback((error: any) => {
    let mensajeUsuario = "Ocurrió un error al procesar el pago. Por favor, intenta nuevamente.";
    
    logger.error('ERROR_ANALYSIS', 'Analizando error de MercadoPago', { 
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        cause: error.response?.data?.cause
      }
    });
    
    if (error.response && error.response.data) {
      const respuesta = error.response.data;
      
      if (respuesta.cause && Array.isArray(respuesta.cause)) {
        const causa = respuesta.cause[0];
        logger.error('ERROR_ANALYSIS', 'Causa específica encontrada', { causa });
        
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
          case "3034":
            mensajeUsuario = "La tarjeta no tiene suficiente saldo disponible.";
            break;
          case "4001":
            mensajeUsuario = "Los datos de la tarjeta son incorrectos.";
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
    
    logger.error('ERROR_ANALYSIS', 'Mensaje final para usuario', { mensajeUsuario });
    return mensajeUsuario;
  }, [logger]);

  const obtenerClavePublica = useCallback(async () => {
    try {
      const cachedKey = localStorage.getItem('mp_public_key');
      const cachedTimestamp = localStorage.getItem('mp_public_key_timestamp');
      
      if (cachedKey && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        if (Date.now() - timestamp < CACHE_DURATION_MS) {
          logger.info('PUBLIC_KEY', 'Usando clave pública desde cache');
          setPublicKey(cachedKey);
          return cachedKey;
        }
      }
      
      logger.info('PUBLIC_KEY', 'Solicitando clave pública al backend');
      const response = await clienteAxios.get(endpoints.mercadoPago.publicKey);
      
      logger.debug('PUBLIC_KEY', 'Respuesta de public key', { 
        hasPublicKey: !!response.data?.public_key,
        keyPrefix: response.data?.public_key?.substring(0, 20) + '...'
      });
      
      if (response.data && response.data.public_key) {
        const newKey = response.data.public_key;
        
        if (newKey.includes("TEST-4e0f5e55-d687-4b7e-83db-12a20d3d6beb")) {
          logger.info('PUBLIC_KEY', 'Clave pública de TEST confirmada (Checkout API)');
        } else {
          logger.warn('PUBLIC_KEY', 'Esta no es la clave de TEST esperada', {
            esperada: 'TEST-4e0f5e55-d687-4b7e-83db-12a20d3d6beb',
            recibida: newKey
          });
        }
        
        localStorage.setItem('mp_public_key', newKey);
        localStorage.setItem('mp_public_key_timestamp', Date.now().toString());
        
        setPublicKey(newKey);
        return newKey;
      }
      throw new Error('No se pudo obtener la clave pública de Mercado Pago');
    } catch (error) {
      logger.error('PUBLIC_KEY', 'Error al obtener clave pública', error);
      setError('No se pudo conectar con el servidor de pagos. Por favor, intenta nuevamente.');
      return null;
    }
  }, [logger]);

  const obtenerMetodosPago = useCallback(async () => {
    try {
      logger.info('PAYMENT_METHODS', 'Obteniendo métodos de pago');
      const response = await clienteAxios.get(endpoints.mercadoPago.paymentMethods);
      
      if (response.data && response.data.data) {
        setPaymentMethods(response.data.data);
        logger.info('PAYMENT_METHODS', 'Métodos de pago obtenidos', { cantidad: response.data.data.length });
      }
    } catch (error) {
      logger.error('PAYMENT_METHODS', 'Error al obtener métodos de pago', error);
    }
  }, [logger]);

  const identifyPaymentMethod = useCallback(async (cardNumber: string) => {
    if (mp && cardNumber.length >= 6) {
      try {
        const bin = cardNumber.substring(0, 6);
        logger.debug('PAYMENT_METHOD_ID', 'Identificando método de pago', { bin });
        
        const response = await mp.getPaymentMethods({ bin });
        
        logger.debug('PAYMENT_METHOD_ID', 'Respuesta de identificación', { 
          resultados: response.results?.length || 0
        });
        
        if (response.results && response.results.length > 0) {
          const method = response.results[0];
          logger.info('PAYMENT_METHOD_ID', 'Método identificado', { 
            id: method.id,
            tipo: method.payment_type_id 
          });
          
          setCardForm(prev => ({
            ...prev,
            paymentMethodId: method.id
          }));

          if (method.payment_type_id === 'credit_card') {
            await obtenerEmisores(method.id);
          }
        } else {
          logger.warn('PAYMENT_METHOD_ID', 'No se encontraron métodos para este BIN', { bin });
        }
      } catch (error) {
        logger.error('PAYMENT_METHOD_ID', 'Error al identificar método de pago', error);
      }
    }
  }, [mp, logger]);

  const obtenerEmisores = useCallback(async (paymentMethodId: string) => {
    try {
      logger.info('CARD_ISSUERS', 'Obteniendo emisores', { paymentMethodId });
      const response = await clienteAxios.get(
        `${endpoints.mercadoPago.cardIssuers}?payment_method_id=${paymentMethodId}`
      );
      
      if (response.data && response.data.data) {
        setCardIssuers(response.data.data);
        logger.info('CARD_ISSUERS', 'Emisores obtenidos', { cantidad: response.data.data.length });
      }
    } catch (error) {
      logger.error('CARD_ISSUERS', 'Error al obtener emisores', error);
    }
  }, [logger]);

  // 💳 Procesamiento de pago con Checkout API mejorado
  const procesarPagoConCheckoutAPI = useCallback(async () => {
    if (cargandoPago || procesandoPago) {
      logger.warn('CHECKOUT_API', 'Intento de procesamiento mientras ya está en curso');
      return;
    }
    
    // Validar formulario antes de procesar
    if (!validarFormulario()) {
      logger.warn('CHECKOUT_API', 'Validación de formulario falló');
      setError('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }
    
    setCargandoPago(true);
    setProcesandoPago(true);
    setError(null);
    setPagoIniciado(true);
    
    const inicioTiempo = Date.now();
    
    try {
        logger.info('CHECKOUT_API', 'Iniciando procesamiento de pago', {
          tieneMP: !!mp,
          tieneToken: !!cardForm.cardNumber
        });
        
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

        logger.debug('CHECKOUT_API', 'Creando token de tarjeta', {
          tieneNumero: !!tokenData.cardNumber,
          tieneNombre: !!tokenData.cardholderName,
          tieneFecha: !!(tokenData.cardExpirationMonth && tokenData.cardExpirationYear),
          tieneCVV: !!tokenData.securityCode
        });

        const cardToken = await mp.createCardToken(tokenData);
        logger.info('CHECKOUT_API', 'Token de tarjeta creado exitosamente', { tokenId: cardToken.id });

        // Obtener ID de reserva
        const reservaEnProceso = JSON.parse(sessionStorage.getItem('reservaEnProceso') || '{}');
        
        let reservaIdFinal;
        
        if (reservaEnProceso.id) {
            reservaIdFinal = reservaEnProceso.id;
            logger.info('CHECKOUT_API', 'Usando ID de reserva en proceso', { reservaId: reservaIdFinal });
        } else if (datosReserva.reservaId) {
            reservaIdFinal = datosReserva.reservaId;
            logger.info('CHECKOUT_API', 'Usando ID de reserva de datos', { reservaId: reservaIdFinal });
        } else {
            logger.error('CHECKOUT_API', 'No se encontró ID de reserva válido', {
              reservaEnProceso,
              datosReserva: { ...datosReserva, usuario: '[REDACTED]' }
            });
            throw new Error("No se encontró ID de reserva válido");
        }

        const paymentData = {
            token: cardToken.id,
            transaction_amount: total,
            payment_method_id: cardForm.paymentMethodId || 'visa',
            issuer_id: cardForm.issuerId || undefined,
            installments: 1,
            reserva_id: reservaIdFinal,
            email: datosUsuario.correo,
            first_name: datosUsuario.nombres,
            last_name: datosUsuario.apellidos,
            identification_type: cardForm.identificationType,
            identification_number: cardForm.identificationNumber
        };

        logger.info('CHECKOUT_API', 'Enviando datos de pago', {
          tieneToken: !!paymentData.token,
          monto: paymentData.transaction_amount,
          metodoPago: paymentData.payment_method_id,
          reservaId: paymentData.reserva_id
        });

        const response = await clienteAxios.post(endpoints.mercadoPago.processCardPayment, paymentData);

        const tiempoTranscurrido = Date.now() - inicioTiempo;
        logger.info('CHECKOUT_API', 'Respuesta del pago recibida', {
          success: !!response.data?.success,
          tiempoMs: tiempoTranscurrido,
          status: response.data?.data?.status
        });

        if (response.data && response.data.success) {
            const paymentResult = response.data.data;
            
            logger.info('CHECKOUT_API', 'Pago procesado exitosamente', {
              paymentId: paymentResult.payment_id,
              status: paymentResult.status,
              reservaId: paymentResult.reserva_id
            });
            
            navegarSegunEstadoPago(
                paymentResult.status,
                paymentResult.payment_id?.toString() || null,
                paymentResult.reserva_id || reservaIdFinal
            );
        } else {
            throw new Error('Error al procesar el pago: Respuesta no exitosa');
        }

    } catch (error: any) {
        const tiempoTranscurrido = Date.now() - inicioTiempo;
        logger.error('CHECKOUT_API', 'Error en el procesamiento', {
          error: error.message,
          tiempoMs: tiempoTranscurrido,
          detalles: error.response?.data
        });
        setError(analizarErrorMercadoPago(error));
    } finally {
        setCargandoPago(false);
        setProcesandoPago(false);
        logger.info('CHECKOUT_API', 'Procesamiento finalizado');
    }
}, [mp, cardForm, total, datosUsuario, datosReserva, analizarErrorMercadoPago, validarFormulario, logger, cargandoPago, procesandoPago]);

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
    
    logger.info('NAVIGATION', 'Navegando según estado de pago', {
      estado,
      paymentId,
      reservationId,
      datosBase: { ...datosBase, tourNombre: '[REDACTED]' }
    });
    
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
  }, [navigate, datosReserva, total, limpiarDatosReservaEnProgreso, logger]);

  const verificarYConfirmarReserva = useCallback(async (idReserva: number, status: string, paymentId?: string) => {
    try {
      logger.info('VERIFY_RESERVATION', 'Verificando y confirmando reserva', {
        idReserva,
        status,
        tienePaymentId: !!paymentId
      });
      
      let url = `/api/v1/reservas/verificar-confirmar-pago?id_reserva=${idReserva}`;
      if (status) url += `&status=${status}`;
      if (paymentId) url += `&payment_id=${paymentId}`;
      
      const response = await clienteAxios.get(url);
      logger.debug('VERIFY_RESERVATION', 'Respuesta de verificación', {
        success: !!response.data?.success,
        estado: response.data?.data?.estado
      });
      
      if (response.data.success) {
        const reserva = response.data.data;
        if (reserva.estado === "CONFIRMADA") {
          setEstadoPagoVerificado(true);
          logger.info('VERIFY_RESERVATION', 'Reserva confirmada exitosamente');
          return {
            success: true,
            status: "approved",
            reserva: reserva
          };
        }
        
        if (reserva.estado === "CANCELADA" || reserva.estado === "ANULADA") {
          setEstadoPagoVerificado(true);
          logger.warn('VERIFY_RESERVATION', 'Reserva cancelada o anulada', { estado: reserva.estado });
          return {
            success: true,
            status: "rejected",
            reserva: reserva
          };
        }
        
        logger.info('VERIFY_RESERVATION', 'Reserva en estado intermedio', { estado: reserva.estado });
        return {
          success: false,
          status: reserva.estado,
          reserva: reserva
        };
      }
      
      return { success: false, status: null };
    } catch (error) {
      logger.error('VERIFY_RESERVATION', 'Error al verificar y confirmar reserva', error);
      return { success: false, status: null };
    }
  }, [logger]);

  const verificarPagoUnificado = useCallback(async (idReserva: number, preferenceId: string, paymentId?: string) => {
    try {
      logger.debug('VERIFY_PAYMENT', 'Iniciando verificación unificada', {
        idReserva,
        preferenceId,
        tienePaymentId: !!paymentId,
        estadoPagoVerificado,
        intentosVerificacion
      });
      
      if (estadoPagoVerificado) {
        logger.info('VERIFY_PAYMENT', 'Pago ya verificado, omitiendo verificación');
        return { success: true, status: null };
      }
      
      if (intentosVerificacion >= maxIntentosVerificacion) {
        logger.warn('VERIFY_PAYMENT', 'Máximo de intentos alcanzado', { intentosVerificacion });
        return { success: false, status: null };
      }
      
      setIntentosVerificacion(prev => prev + 1);
      
      if (idReserva) {
        const resultado = await verificarYConfirmarReserva(idReserva, "approved", paymentId);
        if (resultado.success && resultado.status) {
          logger.info('VERIFY_PAYMENT', 'Verificación exitosa, navegando');
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
      
      logger.debug('VERIFY_PAYMENT', 'Verificando pago general', { url });
      const response = await clienteAxios.get(url);
      
      if (response.data && response.data.data && response.data.data.status) {
        setEstadoPagoVerificado(true);
        
        const { status, payment_id, reservation_id } = response.data.data;
        
        logger.info('VERIFY_PAYMENT', 'Estado de pago obtenido', { status, payment_id, reservation_id });
        
        if (reservation_id) {
          try {
            await verificarYConfirmarReserva(reservation_id, status, payment_id);
          } catch (err) {
            logger.error('VERIFY_PAYMENT', 'Error al confirmar reserva explícitamente', err);
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
      logger.error('VERIFY_PAYMENT', 'Error en verificación unificada', error);
      return { success: false, status: null };
    }
  }, [estadoPagoVerificado, intentosVerificacion, maxIntentosVerificacion, verificarYConfirmarReserva, navegarSegunEstadoPago, logger]);

  const crearPreferenciaReal = useCallback(async () => {
    try {
      if (preferencia) {
        logger.info('PREFERENCE_CREATION', 'Reutilizando preferencia existente', {
          preferenciaId: preferencia.preference_id || preferencia.id
        });
        return preferencia;
      }
      
      if (datosReserva.reservaId) {
        logger.info('PREFERENCE_CREATION', 'Obteniendo preferencia para reserva existente', {
          reservaId: datosReserva.reservaId
        });
        
        const endpoint = endpoints.mercadoPago.pagarReserva(datosReserva.reservaId);
        logger.debug('PREFERENCE_CREATION', 'Endpoint utilizado', { endpoint });
        
        const response = await clienteAxios.post(endpoint);
        logger.info('PREFERENCE_CREATION', 'Respuesta para reserva existente', {
          hasData: !!response.data?.data,
          success: !!response.data?.success
        });
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else {
          logger.error('PREFERENCE_CREATION', 'Respuesta sin datos de preferencia', response.data);
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
              logger.info('PREFERENCE_CREATION', 'Usando preferencia del cache');
              return reservaCache.data;
            } else {
              logger.info('PREFERENCE_CREATION', 'Preferencia en cache expirada, eliminando');
              localStorage.removeItem(cacheKey);
            }
          } catch (e) {
            logger.error('PREFERENCE_CREATION', 'Error al parsear preferencia en cache', e);
            localStorage.removeItem(cacheKey);
          }
        }
        
        logger.info('PREFERENCE_CREATION', 'Creando nueva reserva', {
          instanciaId: datosReserva.instanciaId
        });
        
        if (!datosReserva.instanciaId) {
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
        
        logger.debug('PREFERENCE_CREATION', 'Pasajes procesados', {
          cantidadPasajes: pasajes.length,
          tienenPrecio: pasajes.every(p => p.precio_unitario > 0)
        });
        
        if (pasajes.length === 0) {
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
        
        logger.debug('PREFERENCE_CREATION', 'Paquetes procesados', {
          cantidadPaquetes: paquetes.length
        });
        
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
        
        logger.info('PREFERENCE_CREATION', 'Validando datos para envío', {
          tieneEmail: !!datosParaEnviar.email,
          tieneNombre: !!datosParaEnviar.nombre,
          tieneApellido: !!datosParaEnviar.apellido,
          monto: datosParaEnviar.monto,
          cantidadPasajes: datosParaEnviar.cantidad_pasajes.length,
          cantidadPaquetes: datosParaEnviar.paquetes.length
        });
        
        if (!datosParaEnviar.email) {
          throw new Error("El email es obligatorio");
        }
        
        if (!datosParaEnviar.nombre) {
          throw new Error("El nombre es obligatorio");
        }
        
        if (!datosParaEnviar.apellido) {
          throw new Error("El apellido es obligatorio");
        }
        
        const reservaTemporalId = `reserva_temp_${datosReserva.instanciaId}_${Date.now()}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          temporalId: reservaTemporalId,
          timestamp: ahora,
          sessionId: sessionId
        }));
        
        try {
          logger.info('PREFERENCE_CREATION', 'Enviando solicitud de creación');
          const response = await clienteAxios.post(endpoints.mercadoPago.reservar, datosParaEnviar);
          logger.info('PREFERENCE_CREATION', 'Respuesta recibida', {
            hasData: !!response.data?.data,
            hasReservaId: !!response.data?.data?.id_reserva
          });
          
          if (response.data && response.data.data) {
            if (response.data.data.id_reserva) {
              logger.info('PREFERENCE_CREATION', 'Reserva creada exitosamente', {
                reservaId: response.data.data.id_reserva
              });
              
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
            logger.error('PREFERENCE_CREATION', 'Respuesta sin datos de preferencia', response.data);
            throw new Error("La respuesta del servidor no contiene datos de preferencia");
          }
        } catch (error: any) {
          localStorage.removeItem(cacheKey);
          
          logger.error('PREFERENCE_CREATION', 'Error al crear preferencia', {
            status: error.response?.status,
            message: error.message,
            hasResponseData: !!error.response?.data
          });
          
          const mensajeError = analizarErrorMercadoPago(error);
          throw new Error(mensajeError);
        }
      } else {
        logger.error('PREFERENCE_CREATION', 'No hay ID de reserva ni de instancia');
        throw new Error("No se encontró ID de reserva o instancia");
      }
    } catch (error: any) {
      logger.error('PREFERENCE_CREATION', 'Error completo al crear preferencia', {
        message: error.message,
        stack: error.stack?.substring(0, 500)
      });
      
      setError(analizarErrorMercadoPago(error));
      throw error;
    }
  }, [datosReserva, datosUsuario, usuario, total, preferencia, analizarErrorMercadoPago, subtotal, logger]);
  
  const obtenerOCrearPreferencia = useCallback(async () => {
    if (preferencia && preferencia.id) {
      logger.info('GET_CREATE_PREFERENCE', 'Retornando preferencia existente');
      return preferencia;
    }
    
    const cacheKey = `reserva_en_proceso_${datosReserva.instanciaId}`;
    const reservaCache = localStorage.getItem(cacheKey);
    
    if (reservaCache) {
      try {
        const datosCacheados = JSON.parse(reservaCache);
        if (datosCacheados.data && datosCacheados.timestamp && 
            (Date.now() - datosCacheados.timestamp < CACHE_DURATION_MS)) {
          logger.info('GET_CREATE_PREFERENCE', 'Usando preferencia cacheada');
          setPreferencia(datosCacheados.data);
          return datosCacheados.data;
        }
      } catch (e) {
        logger.error('GET_CREATE_PREFERENCE', 'Error al parsear preferencia cacheada', e);
      }
    }
    
    logger.info('GET_CREATE_PREFERENCE', 'Creando nueva preferencia');
    return await crearPreferenciaReal();
  }, [preferencia, datosReserva.instanciaId, crearPreferenciaReal, logger]);
  
  const cargarMercadoPagoSDK = useCallback(() => {
    if (window.MercadoPago) {
      logger.info('SDK_LOAD', 'SDK de MercadoPago ya está cargado');
      setSdkCargado(true);
      return Promise.resolve();
    }
    
    logger.info('SDK_LOAD', 'Cargando SDK de MercadoPago');
    
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      
      script.onload = () => {
        logger.info('SDK_LOAD', 'SDK de MercadoPago v2 cargado correctamente');
        setSdkCargado(true);
        
        // Suprimir errores conocidos de MercadoPago
        window.addEventListener('error', function(event) {
          const target = event.target as HTMLElement;
          
          if (target && 'src' in target) {
            const src = (target as HTMLImageElement | HTMLScriptElement).src;
            
            if (src && 
                typeof src === 'string' && 
                src.includes('mercadopago.com') && 
                src.includes('jms/lgz/background/session/')) {
              logger.debug('SDK_LOAD', 'Ignorando error conocido de MercadoPago', { src });
              event.preventDefault();
              return false;
            }
          }
        }, true);
        
        resolve();
      };
      
      script.onerror = () => {
        logger.error('SDK_LOAD', 'Error al cargar el SDK de MercadoPago v2');
        setError("No se pudo cargar el procesador de pagos. Verifica tu conexión a internet.");
        reject();
      };
      
      document.head.appendChild(script);
    });
  }, [logger]);

  const inicializarMercadoPagoSDK = useCallback(async () => {
    try {
      if (!publicKey) {
        const key = await obtenerClavePublica();
        if (!key) return;
      }

      if (window.MercadoPago && publicKey) {
        logger.info('SDK_INIT', 'Inicializando MercadoPago SDK v2');
        const mercadoPago = new window.MercadoPago(publicKey, {
          locale: 'es-PE'
        });
        
        setMp(mercadoPago);
        logger.info('SDK_INIT', 'MercadoPago SDK v2 inicializado para Checkout API');
        
        await obtenerMetodosPago();
      }
    } catch (error) {
      logger.error('SDK_INIT', 'Error al inicializar MercadoPago SDK v2', error);
    }
  }, [publicKey, obtenerClavePublica, obtenerMetodosPago, logger]);

  const renderizarBotonMercadoPago = useCallback(() => {
    if (!preferencia) {
      logger.debug('BUTTON_RENDER', 'No hay preferencia para renderizar el botón');
      return;
    }
    
    if (!mercadoPagoButtonRef.current) {
      logger.debug('BUTTON_RENDER', 'No se encontró la referencia al contenedor del botón');
      return;
    }
    
    if (!window.MercadoPago) {
      logger.debug('BUTTON_RENDER', 'El SDK de MercadoPago no está disponible');
      return;
    }
    
    if (!publicKey) {
      logger.debug('BUTTON_RENDER', 'No hay clave pública disponible');
      return;
    }
    
    try {
      const preferenceId = preferencia.preference_id || preferencia.id;
      
      if (!preferenceId) {
        logger.error('BUTTON_RENDER', 'No se encontró ID de preferencia válido');
        return;
      }
      
      logger.info('BUTTON_RENDER', 'Renderizando botón de MercadoPago', { preferenceId });
      
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
              logger.error('BUTTON_RENDER', 'Error en MercadoPago Checkout', error);
              setError(`Error en el procesamiento del pago: ${error.message || 'Error desconocido'}`);
            },
            onReady: () => {
              logger.info('BUTTON_RENDER', 'MercadoPago Checkout listo');
              setCargandoMercadoPago(false);
            }
          }
        });
        
        logger.info('BUTTON_RENDER', 'Botón de MercadoPago renderizado correctamente');
      } else {
        logger.debug('BUTTON_RENDER', 'El contenedor ya tiene elementos, no se renderizará nuevamente');
      }
    } catch (error) {
      logger.error('BUTTON_RENDER', 'Error al renderizar el botón de MercadoPago', error);
      setError("Error al inicializar el botón de pago. Por favor, actualiza la página.");
    }
  }, [preferencia, publicKey, logger]);

  const iniciarProcesoPago = useCallback(async () => {
    try {
      setCargandoMercadoPago(true);
      setError(null);
      
      logger.info('PAYMENT_PROCESS', 'Iniciando proceso de pago');
      
      await cargarMercadoPagoSDK();
      
      if (!publicKey) {
        const key = await obtenerClavePublica();
        if (!key) {
          throw new Error('No se pudo obtener la clave pública de Mercado Pago');
        }
      }
      
      logger.info('PAYMENT_PROCESS', 'Obteniendo o creando preferencia');
      const nuevaPreferencia = await obtenerOCrearPreferencia();
      
      if (!preferencia) {
        setPreferencia(nuevaPreferencia);
      }

      await inicializarMercadoPagoSDK();
      
      logger.info('PAYMENT_PROCESS', 'Proceso de pago iniciado exitosamente');
      return nuevaPreferencia;
    } catch (error: any) {
      logger.error('PAYMENT_PROCESS', 'Error al iniciar el proceso de pago', error);
      setError(analizarErrorMercadoPago(error));
      return null;
    } finally {
      setCargandoMercadoPago(false);
    }
  }, [cargarMercadoPagoSDK, obtenerOCrearPreferencia, obtenerClavePublica, publicKey, preferencia, analizarErrorMercadoPago, inicializarMercadoPagoSDK, logger]);

  const procesarPagoDirecto = async () => {
    if (cargandoPago || procesandoPago) {
      logger.warn('DIRECT_PAYMENT', 'Intento de procesamiento mientras ya está en curso');
      return;
    }
    
    setCargandoPago(true);
    setProcesandoPago(true);
    setError(null);
    setPagoIniciado(true);
    sessionStorage.setItem('pagoIniciado', 'true');
    
    const inicioTiempo = Date.now();
    
    try {
      logger.info('DIRECT_PAYMENT', 'Iniciando procesamiento de pago directo', { modoCheckout });

      if (modoCheckout === 'api') {
        await procesarPagoConCheckoutAPI();
        return;
      }
      
      if (preferencia) {
        logger.info('DIRECT_PAYMENT', 'Usando preferencia existente', {
          tienePreferencia: !!preferencia,
          IS_SANDBOX,
          tieneSandboxUrl: !!preferencia.sandbox_init_point,
          tieneInitPoint: !!preferencia.init_point
        });
        
        let url;
        
        if (IS_SANDBOX && preferencia.sandbox_init_point) {
          url = preferencia.sandbox_init_point;
          logger.info('DIRECT_PAYMENT', 'Usando sandbox_init_point (CORRECTO)', { url });
        } else if (preferencia.sandbox_init_point) {
          url = preferencia.sandbox_init_point;
          logger.info('DIRECT_PAYMENT', 'Forzando uso de sandbox_init_point', { url });
        } else if (preferencia.init_point) {
          url = preferencia.init_point;
          logger.warn('DIRECT_PAYMENT', 'Usando init_point como fallback', { url });
        } else {
          logger.error('DIRECT_PAYMENT', 'No se encontró ninguna URL válida');
          throw new Error("No se encontró URL de pago válida en la preferencia");
        }
        
        if (url.includes('sandbox.mercadopago.com')) {
          logger.info('DIRECT_PAYMENT', 'URL confirmada como SANDBOX');
        } else if (url.includes('www.mercadopago.com')) {
          logger.warn('DIRECT_PAYMENT', 'ADVERTENCIA: URL es de PRODUCCIÓN');
        }
        
        if (url) {
          const urlConParametros = `${url}&source=website&version=v2`;
          logger.info('DIRECT_PAYMENT', 'Redirigiendo a MercadoPago', { url: urlConParametros });
          window.location.href = urlConParametros;
        } else {
          throw new Error("No se encontró URL de pago válida en la preferencia");
        }
        return;
      }
      
      logger.info('DIRECT_PAYMENT', 'No hay preferencia, iniciando proceso completo');
      const nuevaPreferencia = await iniciarProcesoPago();
      
      if (nuevaPreferencia) {
        let url;
        
        if (nuevaPreferencia.sandbox_init_point) {
          url = nuevaPreferencia.sandbox_init_point;
          logger.info('DIRECT_PAYMENT', 'Nueva preferencia - Usando sandbox_init_point', { url });
        } else {
          url = nuevaPreferencia.init_point;
          logger.warn('DIRECT_PAYMENT', 'Nueva preferencia - Usando init_point como fallback', { url });
        }
        
        if (url) {
          logger.info('DIRECT_PAYMENT', 'Redirigiendo a nueva preferencia', { url });
          window.location.href = url;
        } else {
          throw new Error("No se encontró URL de pago en la nueva preferencia");
        }
        return;
      }
      
      setError("No se pudo generar el pago. Por favor, intenta nuevamente.");
      
    } catch (error: any) {
      const tiempoTranscurrido = Date.now() - inicioTiempo;
      logger.error('DIRECT_PAYMENT', 'Error al procesar el pago directo', {
        error: error.message,
        tiempoMs: tiempoTranscurrido
      });
      setError(analizarErrorMercadoPago(error));
    } finally {
      setCargandoPago(false);
      setProcesandoPago(false);
    }
  };
  
  // 🔄 Efectos mejorados
  useEffect(() => {
    const iniciarMercadoPago = async () => {
      try {
        if (preferencia) {
          logger.info('INIT_EFFECT', 'Ya existe una preferencia, no se creará otra');
          setCargandoMercadoPago(false);
          return;
        }
        
        setCargandoMercadoPago(true);
        
        if (!publicKey) {
          await obtenerClavePublica();
        }
        
        await iniciarProcesoPago();
        
      } catch (error) {
        logger.error('INIT_EFFECT', 'Error al inicializar Mercado Pago', error);
      } finally {
        setCargandoMercadoPago(false);
      }
    };
    
    iniciarMercadoPago();
  }, [obtenerClavePublica, iniciarProcesoPago, publicKey, preferencia, logger]);

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
      logger.info('VERIFICATION_EFFECT', 'Iniciando verificación periódica del estado de pago');
      
      const reservaEnProceso = JSON.parse(sessionStorage.getItem('reservaEnProceso') || '{}');
      const idReserva = reservaEnProceso.id || datosReserva.reservaId || datosReserva.instanciaId;
      
      verificarPagoUnificado(idReserva, preferencia.id).then(result => {
        if (result.success && result.status) {
          logger.info('VERIFICATION_EFFECT', 'Estado de pago verificado inmediatamente', { status: result.status });
          navegarSegunEstadoPago(result.status, result.payment_id || null, result.reservation_id || null);
        }
      });
      
      const intervalId = setInterval(async () => {
        const result = await verificarPagoUnificado(idReserva, preferencia.id);
        if (result.success && result.status) {
          clearInterval(intervalId);
          logger.info('VERIFICATION_EFFECT', 'Estado de pago verificado en intervalo', { status: result.status });
          navegarSegunEstadoPago(result.status, result.payment_id || null, result.reservation_id || null);
        }
      }, 3000);
      
      return () => {
        clearInterval(intervalId);
        logger.info('VERIFICATION_EFFECT', 'Verificación periódica detenida');
      };
    }
  }, [preferencia, IS_SANDBOX, verificarPagoUnificado, navegarSegunEstadoPago, estadoPagoVerificado, pagoIniciado, datosReserva, logger]);

   useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const paymentId = params.get('payment_id');
    const externalReference = params.get('external_reference');
    const errorMessage = params.get('error');
    const preferenceId = params.get('preference_id');
    
    if (status || paymentId) {
      logger.info('URL_PARAMS_EFFECT', 'Retornando de MercadoPago', {
        status,
        tienePaymentId: !!paymentId,
        tieneExternalRef: !!externalReference,
        tieneError: !!errorMessage
      });
      
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
        logger.debug('URL_PARAMS_EFFECT', 'ID de reserva extraído de external_reference', { reservaId });
      } else {
        const reservaEnProceso = JSON.parse(sessionStorage.getItem('reservaEnProceso') || '{}');
        reservaId = reservaEnProceso.id || datosReserva.reservaId || datosReserva.instanciaId;
        logger.debug('URL_PARAMS_EFFECT', 'ID de reserva obtenido de session/datos', { reservaId });
      }
      
      if (reservaId) {
        verificarYConfirmarReserva(reservaId, status || "approved", paymentId || undefined)
          .then(result => {
            if (result.success && result.status) {
              logger.info('URL_PARAMS_EFFECT', 'Verificación exitosa, navegando', { status: result.status });
              navegarSegunEstadoPago(result.status, paymentId || null, reservaId);
            } else {
              if (status) {
                logger.info('URL_PARAMS_EFFECT', 'Navegando con status de URL', { status });
                navegarSegunEstadoPago(status, paymentId || null, reservaId);
              }
            }
          })
          .catch(error => {
            logger.error('URL_PARAMS_EFFECT', 'Error al verificar y confirmar reserva', error);
            if (status) {
              navegarSegunEstadoPago(status, paymentId || null, reservaId);
            }
          });
      } else {
        if (status) {
          logger.info('URL_PARAMS_EFFECT', 'Navegando sin reservaId', { status });
          navegarSegunEstadoPago(status, paymentId || null, null);
        }
      }
    }
  }, [location.search, navegarSegunEstadoPago, datosReserva, verificarYConfirmarReserva, logger]);
  
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
      logger.error('DATE_FORMAT', 'Error al formatear fecha', { fechaStr, error });
      return 'Fecha no válida';
    }
  };
  
  useEffect(() => {
    return () => {
      if (!estadoPagoVerificado) {
        logger.info('CLEANUP_EFFECT', 'Limpiando datos temporales al desmontar');
        sessionStorage.removeItem('pagoIniciado');
      }
    };
  }, [estadoPagoVerificado, logger]);

  // 🎨 Componente de logs mejorado
  const LogViewer = () => {
    const logs = logger.getLogs();
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white flex justify-between items-center">
            <h3 className="text-lg font-semibold">📊 Registro de Actividad</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const dataStr = logger.exportLogs();
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `logs-pago-${new Date().toISOString().split('T')[0]}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm"
              >
                💾 Exportar
              </button>
              <button
                onClick={() => logger.clearLogs()}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm"
              >
                🗑️ Limpiar
              </button>
              <button
                onClick={() => setMostrandoLogs(false)}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-sm"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-4 h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center">No hay registros disponibles</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className={`p-3 rounded-lg text-sm font-mono border-l-4 ${
                    log.level === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
                    log.level === 'warn' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                    log.level === 'info' ? 'bg-blue-50 border-blue-500 text-blue-800' :
                    'bg-gray-50 border-gray-500 text-gray-800'
                  }`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-xs uppercase tracking-wider">
                        {log.category}
                      </span>
                      <span className="text-xs opacity-75">
                        {new Date(log.timestamp).toLocaleTimeString('es-PE')}
                      </span>
                    </div>
                    <div className="mb-1">{log.message}</div>
                    {log.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs opacity-75 hover:opacity-100">
                          Ver datos
                        </summary>
                        <pre className="mt-1 text-xs bg-black bg-opacity-10 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 🎯 Indicador de estado mejorado
  const EstadoIndicator = () => (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            cargandoPago || procesandoPago ? 'bg-orange-500' :
            error ? 'bg-red-500' :
            estadoPagoVerificado ? 'bg-green-500' :
            'bg-blue-500'
          }`}></div>
          <span className="font-medium text-gray-700">
            {cargandoPago || procesandoPago ? 'Procesando pago...' :
             error ? 'Error detectado' :
             estadoPagoVerificado ? 'Pago verificado' :
             'Sistema listo'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {ACTUAL_ENV === 'development' && (
            <button
              onClick={() => setMostrandoLogs(!mostrandoLogs)}
              className="px-3 py-1 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors"
              title="Ver registros de actividad"
            >
              📊 Logs
            </button>
          )}
          
          <div className="text-xs text-gray-500">
            {IS_SANDBOX ? '🧪 Test' : '🔐 Producción'} | {modoCheckout.toUpperCase()}
          </div>
        </div>
      </div>
      
      {intentosVerificacion > 0 && !estadoPagoVerificado && (
        <div className="mt-2 text-sm text-indigo-600">
          <div className="flex items-center">
            <div className="animate-spin h-3 w-3 border border-indigo-500 border-t-transparent rounded-full mr-2"></div>
            Verificando pago ({intentosVerificacion}/{maxIntentosVerificacion})
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-white via-blue-50 to-cyan-50 min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Header mejorado *//*}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{t('pago.titulo', 'Proceso de Pago')}</h1>
              <p className="mt-1 opacity-90">{t('pago.subtitulo', 'Completa tu reserva realizando el pago')}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {IS_SANDBOX && (
                <div className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-lg text-sm font-medium">
                  🧪 Modo Test
                </div>
              )}
              
              {(cargandoPago || procesandoPago) && (
                <div className="bg-orange-500 text-orange-100 px-3 py-1 rounded-lg text-sm font-medium flex items-center">
                  <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-2"></div>
                  Procesando
                </div>
              )}
            </div>
          </div>
          
          {/* Indicador de progreso mejorado *//*}
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  estadoPagoVerificado ? 'bg-green-500' : 'bg-white'
                }`}>
                  {estadoPagoVerificado ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className={`font-bold text-sm ${estadoPagoVerificado ? 'text-white' : 'text-blue-600'}`}>2</span>
                  )}
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

        {/* Indicador de estado *//*}
        <EstadoIndicator />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Detalles de la reserva mejorados *//*}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-cyan-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Detalles de la reserva
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">{datosReserva.tourNombre}</h3>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-teal-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{formatearFecha(datosReserva.fecha)}</span>
                      </div>
                      <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-teal-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{datosReserva.horario}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium border border-blue-200 ml-4 flex-shrink-0">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                      {datosReserva.totalPasajeros} {datosReserva.totalPasajeros === 1 ? 'pasajero' : 'pasajeros'}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">Resumen de costos</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-800 font-medium">S/ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">IGV (18%):</span>
                        <span className="text-gray-800 font-medium">S/ {igv.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                        <span className="text-gray-800">Total a pagar:</span>
                        <span className="text-teal-600">S/ {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Datos del cliente mejorados *//*}
            {usuario && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200 hover:shadow-md transition-shadow">
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
                    className={`text-sm flex items-center px-3 py-1 rounded-lg transition-colors ${
                      editandoUsuario 
                        ? 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100' 
                        : 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    {editandoUsuario ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelar
                      </>
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
                  {/* Campos del usuario con validación visual *//*}
                  {Object.entries({
                    nombres: 'Nombre',
                    apellidos: 'Apellidos', 
                    correo: 'Email',
                    numero_celular: 'Teléfono',
                    numero_documento: 'Documento'
                  }).map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input 
                        type={key === 'correo' ? 'email' : 'text'}
                        name={key}
                        value={datosUsuario[key as keyof typeof datosUsuario] || ''}
                        onChange={handleUsuarioChange}
                        disabled={!editandoUsuario}
                        className={`w-full px-3 py-2 border rounded-md transition-colors ${
                          editandoUsuario 
                            ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  ))}
                </div>
                
                {editandoUsuario && (
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditandoUsuario(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={guardarCambiosUsuario}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all"
                    >
                      Guardar cambios
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Panel de pago mejorado *//*}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-cyan-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Opciones de pago
              </h2>
              
              {/* Indicador de modo test mejorado *//*}
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
                  <div className="mt-2 ml-11 text-xs text-yellow-600 bg-yellow-100 p-2 rounded">
                    <strong>Datos de prueba:</strong><br />
                    Tarjeta: 4509 9535 6623 3704<br />
                    Titular: APRO | CVV: 123 | Mes/Año: 11/25
                  </div>
                </div>
              )}
              
              {/* Error mejorado *//*}
              {error && (
                <div className="mt-4 mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium">Error en el procesamiento</div>
                      <div className="mt-1">{error}</div>
                      <button
                        onClick={() => setError(null)}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Selector de modo mejorado *//*}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de pago</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setModoCheckout('api')}
                    className={`flex flex-col items-center p-3 rounded-lg font-medium transition-all ${
                      modoCheckout === 'api'
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">💳</span>
                    <span className="text-sm">Tarjeta</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setModoCheckout('pro')}
                    className={`flex flex-col items-center p-3 rounded-lg font-medium transition-all ${
                      modoCheckout === 'pro'
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">🌐</span>
                    <span className="text-sm">Checkout</span>
                  </button>
                </div>
              </div>

              {/* Formulario de tarjeta mejorado *//*}
              {modoCheckout === 'api' && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Datos de la tarjeta
                    </h3>
                    
                    {/* Número de tarjeta *//*}
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
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          validacionFormulario.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        maxLength={19}
                        required
                      />
                      {validacionFormulario.cardNumber && (
                        <p className="mt-1 text-xs text-red-600">{validacionFormulario.cardNumber}</p>
                      )}
                      {cardForm.paymentMethodId && !validacionFormulario.cardNumber && (
                        <div className="mt-1 text-xs text-green-600 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {cardForm.paymentMethodId.toUpperCase()} detectada
                        </div>
                      )}
                    </div>

                    {/* Nombre del titular *//*}
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
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          validacionFormulario.cardholderName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      />
                      {validacionFormulario.cardholderName && (
                        <p className="mt-1 text-xs text-red-600">{validacionFormulario.cardholderName}</p>
                      )}
                    </div>

                    {/* Fecha y CVV *//*}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mes *
                        </label>
                        <select
                          name="expiryMonth"
                          value={cardForm.expiryMonth}
                          onChange={handleCardFormChange}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            validacionFormulario.expiryMonth ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          required
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                        {validacionFormulario.expiryMonth && (
                          <p className="mt-1 text-xs text-red-600">{validacionFormulario.expiryMonth}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Año *
                        </label>
                        <select
                          name="expiryYear"
                          value={cardForm.expiryYear}
                          onChange={handleCardFormChange}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            validacionFormulario.expiryYear ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
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
                        {validacionFormulario.expiryYear && (
                          <p className="mt-1 text-xs text-red-600">{validacionFormulario.expiryYear}</p>
                        )}
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
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            validacionFormulario.securityCode ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          required
                        />
                        {validacionFormulario.securityCode && (
                          <p className="mt-1 text-xs text-red-600">{validacionFormulario.securityCode}</p>
                        )}
                      </div>
                    </div>

                    {/* Documento *//*}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                      
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de documento *
                        </label>
                        <input
                          type="text"
                          name="identificationNumber"
                          value={cardForm.identificationNumber}
                          onChange={handleCardFormChange}
                          placeholder="12345678"
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            validacionFormulario.identificationNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          required
                        />
                        {validacionFormulario.identificationNumber && (
                          <p className="mt-1 text-xs text-red-600">{validacionFormulario.identificationNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Botones de pago mejorados *//*}
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
                    {/* Botón de MercadoPago Pro *//*}
                    {modoCheckout === 'pro' && (
                      <div 
                        className="mercado-pago-button w-full min-h-[60px] bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-dashed border-blue-200 mb-4 flex items-center justify-center"
                        ref={mercadoPagoButtonRef}
                      >
                        <div className="text-center">
                          <div className="animate-pulse">
                            <span className="text-sm text-blue-500 block">🔄 Cargando opciones de pago...</span>
                            <span className="text-xs text-blue-400">MercadoPago Checkout Pro</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Botón principal de pago *//*}
                    <button
                      type="button"
                      onClick={modoCheckout === 'api' ? procesarPagoConCheckoutAPI : procesarPagoDirecto}
                      disabled={
                        cargandoPago || 
                        procesandoPago || 
                        (modoCheckout === 'api' && Object.keys(validacionFormulario).length > 0) ||
                        (modoCheckout === 'api' && (!cardForm.cardNumber || !cardForm.cardholderName || !cardForm.expiryMonth || !cardForm.expiryYear || !cardForm.securityCode || !cardForm.identificationNumber))
                      }
                      className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl ${
                        cargandoPago || procesandoPago || (modoCheckout === 'api' && (Object.keys(validacionFormulario).length > 0 || !cardForm.cardNumber || !cardForm.cardholderName || !cardForm.expiryMonth || !cardForm.expiryYear || !cardForm.securityCode || !cardForm.identificationNumber))
                          ? 'opacity-70 cursor-not-allowed' 
                          : 'hover:from-blue-700 hover:to-teal-700 transform hover:-translate-y-0.5'
                      }`}
                    >
                      {cargandoPago || procesandoPago ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {procesandoPago ? 'Procesando pago...' : 'Conectando...'}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          {modoCheckout === 'api' ? 'Pagar con tarjeta' : 'Continuar al pago'} S/ {total.toFixed(2)}
                          {IS_SANDBOX && <span className="ml-2 text-xs opacity-75">(Test)</span>}
                        </span>
                      )}
                    </button>
                    
                    {/* Estado de verificación *//*}
                    {intentosVerificacion > 0 && !estadoPagoVerificado && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-center text-blue-600">
                          <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium">
                            Verificando estado del pago ({intentosVerificacion}/{maxIntentosVerificacion})
                          </span>
                        </div>
                        <div className="mt-2 bg-blue-100 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(intentosVerificacion / maxIntentosVerificacion) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Términos y condiciones *//*}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-center text-gray-500 leading-relaxed">
                        Al hacer clic en "Pagar", aceptas nuestros{' '}
                        <a href="#" className="text-blue-600 hover:underline font-medium">
                          términos y condiciones
                        </a>{' '}
                        y{' '}
                        <a href="#" className="text-blue-600 hover:underline font-medium">
                          política de privacidad
                        </a>.
                        <br />
                        <span className="text-gray-400">Transacción procesada de forma segura</span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Panel de seguridad mejorado *//*}
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

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-800">Soporte 24/7</h3>
                    <p className="text-sm text-orange-600">
                      Atención personalizada ante cualquier consulta
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer con botones mejorado *//*}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 border-2 border-cyan-300 text-cyan-700 font-medium rounded-lg transition-all duration-200 hover:bg-cyan-50 hover:border-cyan-400 flex items-center justify-center shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver atrás
          </button>
          
          {/* Info de desarrollo *//*}
          {ACTUAL_ENV === 'development' && (
            <div className="text-xs text-gray-500 text-center sm:text-right bg-gray-100 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-left">
                <div>ENV: <span className="font-mono">{ACTUAL_ENV}</span></div>
                <div>Test: <span className="font-mono">{IS_SANDBOX ? 'Activo' : 'Inactivo'}</span></div>
                <div>Modo: <span className="font-mono">{modoCheckout}</span></div>
                <div>SDK: <span className="font-mono">{sdkCargado ? 'OK' : 'Cargando'}</span></div>
                {preferencia && (
                  <div className="col-span-2">
                    Pref ID: <span className="font-mono text-xs">{preferencia.preference_id || preferencia.id}</span>
                  </div>
                )}
                {cardForm.paymentMethodId && (
                  <div className="col-span-2">
                    Method: <span className="font-mono">{cardForm.paymentMethodId}</span>
                  </div>
                )}
                <div className="col-span-2">
                  Logs: <span className="font-mono">{logger.getLogs().length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de logs *//*}
      {mostrandoLogs && <LogViewer />}
    </div>
  );
};

export default PaginaProcesoPago;*/

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
  cantidad: number;
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

// Interfaz para el logger mejorado
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: string;
  message: string;
  data?: any;
}

// 🔧 CONSTANTES ACTUALIZADAS
const IS_PRODUCTION = false;
const IS_SANDBOX = true;
const CACHE_DURATION_MS = 15 * 60 * 1000;
const ACTUAL_ENV = process.env.NODE_ENV;

// 📊 Logger mejorado (mantienes igual)
class PaymentLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private createEntry(level: LogEntry['level'], category: string, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : undefined
    };
  }

  info(category: string, message: string, data?: any) {
    const entry = this.createEntry('info', category, message, data);
    this.logs.push(entry);
    console.log(`🔵 [${category}] ${message}`, data || '');
    this.trimLogs();
  }

  warn(category: string, message: string, data?: any) {
    const entry = this.createEntry('warn', category, message, data);
    this.logs.push(entry);
    console.warn(`🟡 [${category}] ${message}`, data || '');
    this.trimLogs();
  }

  error(category: string, message: string, data?: any) {
    const entry = this.createEntry('error', category, message, data);
    this.logs.push(entry);
    console.error(`🔴 [${category}] ${message}`, data || '');
    this.trimLogs();
  }

  debug(category: string, message: string, data?: any) {
    const entry = this.createEntry('debug', category, message, data);
    this.logs.push(entry);
    console.debug(`🟣 [${category}] ${message}`, data || '');
    this.trimLogs();
  }

  private trimLogs() {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs() {
    this.logs = [];
  }
}

const PaginaProcesoPago = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, autenticado } = useSelector((state: RootState) => state.autenticacion);
  
  const datosReserva = location.state || JSON.parse(sessionStorage.getItem('datosReservaPendiente') || '{}');
  
  // 📊 Logger mejorado
  const loggerRef = useRef(new PaymentLogger());
  const logger = loggerRef.current;
  
  // Estados principales (mantener todos iguales)
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
  const [procesandoPago, setProcesandoPago] = useState(false);
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
  
  // Estados para manejo de usuario
  const [editandoUsuario, setEditandoUsuario] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState({
    nombres: usuario?.nombres || '',
    apellidos: usuario?.apellidos || '',
    correo: usuario?.correo || '',
    numero_celular: usuario?.numero_celular || '',
    numero_documento: usuario?.numero_documento || ''
  });

  // Estados para UI mejorada
  const [mostrandoLogs, setMostrandoLogs] = useState(false);
  const [validacionFormulario, setValidacionFormulario] = useState<{[key: string]: string}>({});

  const mercadoPagoButtonRef = useRef<HTMLDivElement>(null);
  
  const subtotal = Number(datosReserva.total || 0);
  const igv = subtotal * 0.18;
  const total = subtotal;

  // 🚀 Inicialización mejorada
  useEffect(() => {
    logger.info('INIT', 'Inicializando componente de pago', {
      NODE_ENV: ACTUAL_ENV,
      IS_SANDBOX,
      IS_PRODUCTION,
      modoCheckout,
      datosReserva: {
        ...datosReserva,
        // No loggear datos sensibles
        usuario: undefined
      }
    });
    
    window.scrollTo(0, 0);
  }, []);

  // Todas las funciones helper (mantener iguales): validarFormulario, handleUsuarioChange, etc.
  const validarFormulario = useCallback(() => {
    const errores: {[key: string]: string} = {};

    if (modoCheckout === 'api') {
      if (!cardForm.cardNumber.replace(/\s/g, '')) {
        errores.cardNumber = 'El número de tarjeta es requerido';
      } else if (cardForm.cardNumber.replace(/\s/g, '').length < 13) {
        errores.cardNumber = 'Número de tarjeta incompleto';
      }

      if (!cardForm.cardholderName.trim()) {
        errores.cardholderName = 'El nombre del titular es requerido';
      }

      if (!cardForm.expiryMonth) {
        errores.expiryMonth = 'El mes es requerido';
      }

      if (!cardForm.expiryYear) {
        errores.expiryYear = 'El año es requerido';
      }

      if (!cardForm.securityCode) {
        errores.securityCode = 'El CVV es requerido';
      } else if (cardForm.securityCode.length < 3) {
        errores.securityCode = 'CVV incompleto';
      }

      if (!cardForm.identificationNumber.trim()) {
        errores.identificationNumber = 'El número de documento es requerido';
      }
    }

    setValidacionFormulario(errores);
    return Object.keys(errores).length === 0;
  }, [cardForm, modoCheckout]);

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosUsuario(prev => ({
      ...prev,
      [name]: value
    }));
    
    logger.debug('USER_FORM', 'Campo de usuario actualizado', { campo: name, valor: value?.length > 0 ? '[PRESENTE]' : '[VACÍO]' });
  };
  
  const guardarCambiosUsuario = () => {
    setEditandoUsuario(false);
    logger.info('USER_FORM', 'Cambios de usuario guardados');
    
    alert('Cambios guardados correctamente.');
  };

  const handleCardFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let valorFormateado = value;
    
    if (name === 'cardNumber') {
      valorFormateado = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    
    if (name === 'securityCode') {
      valorFormateado = value.replace(/\D/g, '').slice(0, 4);
    }
    
    if (name === 'identificationNumber') {
      valorFormateado = value.replace(/\D/g, '').slice(0, 12);
    }
    
    setCardForm(prev => ({
      ...prev,
      [name]: valorFormateado
    }));

    if (validacionFormulario[name]) {
      setValidacionFormulario(prev => {
        const nuevo = {...prev};
        delete nuevo[name];
        return nuevo;
      });
    }

    if (name === 'cardNumber') {
      const numeroLimpio = valorFormateado.replace(/\s/g, '');
      if (numeroLimpio.length >= 6) {
        identifyPaymentMethod(numeroLimpio);
      }
    }

    logger.debug('CARD_FORM', 'Campo de tarjeta actualizado', { 
      campo: name, 
      longitud: valorFormateado.length,
      esNumeroTarjeta: name === 'cardNumber'
    });
  };

  // Mantener todas las funciones helper iguales: limpiarDatosReservaEnProgreso, analizarErrorMercadoPago, obtenerClavePublica, etc.

  const limpiarDatosReservaEnProgreso = useCallback(() => {
    const instanciaId = datosReserva.instanciaId;
    if (instanciaId) {
      localStorage.removeItem(`reserva_en_proceso_${instanciaId}`);
      logger.info('CLEANUP', 'Datos de reserva en progreso limpiados', { instanciaId });
    }
    sessionStorage.removeItem('pagoIniciado');
    sessionStorage.removeItem('reservaEnProceso');
    logger.info('CLEANUP', 'Sessions storage limpiado');
  }, [datosReserva.instanciaId, logger]);

  const analizarErrorMercadoPago = useCallback((error: any) => {
    let mensajeUsuario = "Ocurrió un error al procesar el pago. Por favor, intenta nuevamente.";
    
    logger.error('ERROR_ANALYSIS', 'Analizando error de MercadoPago', { 
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        cause: error.response?.data?.cause
      }
    });
    
    if (error.response && error.response.data) {
      const respuesta = error.response.data;
      
      if (respuesta.cause && Array.isArray(respuesta.cause)) {
        const causa = respuesta.cause[0];
        logger.error('ERROR_ANALYSIS', 'Causa específica encontrada', { causa });
        
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
          case "3034":
            mensajeUsuario = "La tarjeta no tiene suficiente saldo disponible.";
            break;
          case "4001":
            mensajeUsuario = "Los datos de la tarjeta son incorrectos.";
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
    
    logger.error('ERROR_ANALYSIS', 'Mensaje final para usuario', { mensajeUsuario });
    return mensajeUsuario;
  }, [logger]);

  const obtenerClavePublica = useCallback(async () => {
    try {
      const cachedKey = localStorage.getItem('mp_public_key');
      const cachedTimestamp = localStorage.getItem('mp_public_key_timestamp');
      
      if (cachedKey && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        if (Date.now() - timestamp < CACHE_DURATION_MS) {
          logger.info('PUBLIC_KEY', 'Usando clave pública desde cache');
          setPublicKey(cachedKey);
          return cachedKey;
        }
      }
      
      logger.info('PUBLIC_KEY', 'Solicitando clave pública al backend');
      const response = await clienteAxios.get(endpoints.mercadoPago.publicKey);
      
      logger.debug('PUBLIC_KEY', 'Respuesta de public key', { 
        hasPublicKey: !!response.data?.public_key,
        keyPrefix: response.data?.public_key?.substring(0, 20) + '...'
      });
      
      if (response.data && response.data.public_key) {
        const newKey = response.data.public_key;
        
        localStorage.setItem('mp_public_key', newKey);
        localStorage.setItem('mp_public_key_timestamp', Date.now().toString());
        
        setPublicKey(newKey);
        return newKey;
      }
      throw new Error('No se pudo obtener la clave pública de Mercado Pago');
    } catch (error) {
      logger.error('PUBLIC_KEY', 'Error al obtener clave pública', error);
      setError('No se pudo conectar con el servidor de pagos. Por favor, intenta nuevamente.');
      return null;
    }
  }, [logger]);

  const obtenerMetodosPago = useCallback(async () => {
    try {
      logger.info('PAYMENT_METHODS', 'Obteniendo métodos de pago');
      const response = await clienteAxios.get(endpoints.mercadoPago.paymentMethods);
      
      if (response.data && response.data.data) {
        setPaymentMethods(response.data.data);
        logger.info('PAYMENT_METHODS', 'Métodos de pago obtenidos', { cantidad: response.data.data.length });
      }
    } catch (error) {
      logger.error('PAYMENT_METHODS', 'Error al obtener métodos de pago', error);
    }
  }, [logger]);

  const identifyPaymentMethod = useCallback(async (cardNumber: string) => {
    if (mp && cardNumber.length >= 6) {
      try {
        const bin = cardNumber.substring(0, 6);
        logger.debug('PAYMENT_METHOD_ID', 'Identificando método de pago', { bin });
        
        const response = await mp.getPaymentMethods({ bin });
        
        logger.debug('PAYMENT_METHOD_ID', 'Respuesta de identificación', { 
          resultados: response.results?.length || 0
        });
        
        if (response.results && response.results.length > 0) {
          const method = response.results[0];
          logger.info('PAYMENT_METHOD_ID', 'Método identificado', { 
            id: method.id,
            tipo: method.payment_type_id 
          });
          
          setCardForm(prev => ({
            ...prev,
            paymentMethodId: method.id
          }));

          if (method.payment_type_id === 'credit_card') {
            await obtenerEmisores(method.id);
          }
        } else {
          logger.warn('PAYMENT_METHOD_ID', 'No se encontraron métodos para este BIN', { bin });
        }
      } catch (error) {
        logger.error('PAYMENT_METHOD_ID', 'Error al identificar método de pago', error);
      }
    }
  }, [mp, logger]);

  const obtenerEmisores = useCallback(async (paymentMethodId: string) => {
    try {
      logger.info('CARD_ISSUERS', 'Obteniendo emisores', { paymentMethodId });
      const response = await clienteAxios.get(
        `${endpoints.mercadoPago.cardIssuers}?payment_method_id=${paymentMethodId}`
      );
      
      if (response.data && response.data.data) {
        setCardIssuers(response.data.data);
        logger.info('CARD_ISSUERS', 'Emisores obtenidos', { cantidad: response.data.data.length });
      }
    } catch (error) {
      logger.error('CARD_ISSUERS', 'Error al obtener emisores', error);
    }
  }, [logger]);

  // 💳 Procesamiento de pago con Checkout API (mantener igual)
  const procesarPagoConCheckoutAPI = useCallback(async () => {
    if (cargandoPago || procesandoPago) {
      logger.warn('CHECKOUT_API', 'Intento de procesamiento mientras ya está en curso');
      return;
    }
    
    if (!validarFormulario()) {
      logger.warn('CHECKOUT_API', 'Validación de formulario falló');
      setError('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }
    
    setCargandoPago(true);
    setProcesandoPago(true);
    setError(null);
    setPagoIniciado(true);
    
    const inicioTiempo = Date.now();
    
    try {
        logger.info('CHECKOUT_API', 'Iniciando procesamiento de pago', {
          tieneMP: !!mp,
          tieneToken: !!cardForm.cardNumber
        });
        
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

        logger.debug('CHECKOUT_API', 'Creando token de tarjeta', {
          tieneNumero: !!tokenData.cardNumber,
          tieneNombre: !!tokenData.cardholderName,
          tieneFecha: !!(tokenData.cardExpirationMonth && tokenData.cardExpirationYear),
          tieneCVV: !!tokenData.securityCode
        });

        const cardToken = await mp.createCardToken(tokenData);
        logger.info('CHECKOUT_API', 'Token de tarjeta creado exitosamente', { tokenId: cardToken.id });

        const reservaEnProceso = JSON.parse(sessionStorage.getItem('reservaEnProceso') || '{}');
        
        let reservaIdFinal;
        
        if (reservaEnProceso.id) {
            reservaIdFinal = reservaEnProceso.id;
            logger.info('CHECKOUT_API', 'Usando ID de reserva en proceso', { reservaId: reservaIdFinal });
        } else if (datosReserva.reservaId) {
            reservaIdFinal = datosReserva.reservaId;
            logger.info('CHECKOUT_API', 'Usando ID de reserva de datos', { reservaId: reservaIdFinal });
        } else {
            logger.error('CHECKOUT_API', 'No se encontró ID de reserva válido', {
              reservaEnProceso,
              datosReserva: { ...datosReserva, usuario: '[REDACTED]' }
            });
            throw new Error("No se encontró ID de reserva válido");
        }

        const paymentData = {
            token: cardToken.id,
            transaction_amount: total,
            payment_method_id: cardForm.paymentMethodId || 'visa',
            issuer_id: cardForm.issuerId || undefined,
            installments: 1,
            reserva_id: reservaIdFinal,
            email: datosUsuario.correo,
            first_name: datosUsuario.nombres,
            last_name: datosUsuario.apellidos,
            identification_type: cardForm.identificationType,
            identification_number: cardForm.identificationNumber
        };

        logger.info('CHECKOUT_API', 'Enviando datos de pago', {
          tieneToken: !!paymentData.token,
          monto: paymentData.transaction_amount,
          metodoPago: paymentData.payment_method_id,
          reservaId: paymentData.reserva_id
        });

        const response = await clienteAxios.post(endpoints.mercadoPago.processCardPayment, paymentData);

        const tiempoTranscurrido = Date.now() - inicioTiempo;
        logger.info('CHECKOUT_API', 'Respuesta del pago recibida', {
          success: !!response.data?.success,
          tiempoMs: tiempoTranscurrido,
          status: response.data?.data?.status
        });

        if (response.data && response.data.success) {
            const paymentResult = response.data.data;
            
            logger.info('CHECKOUT_API', 'Pago procesado exitosamente', {
              paymentId: paymentResult.payment_id,
              status: paymentResult.status,
              reservaId: paymentResult.reserva_id
            });
            
            navegarSegunEstadoPago(
                paymentResult.status,
                paymentResult.payment_id?.toString() || null,
                paymentResult.reserva_id || reservaIdFinal
            );
        } else {
            throw new Error('Error al procesar el pago: Respuesta no exitosa');
        }

    } catch (error: any) {
        const tiempoTranscurrido = Date.now() - inicioTiempo;
        logger.error('CHECKOUT_API', 'Error en el procesamiento', {
          error: error.message,
          tiempoMs: tiempoTranscurrido,
          detalles: error.response?.data
        });
        setError(analizarErrorMercadoPago(error));
    } finally {
        setCargandoPago(false);
        setProcesandoPago(false);
        logger.info('CHECKOUT_API', 'Procesamiento finalizado');
    }
}, [mp, cardForm, total, datosUsuario, datosReserva, analizarErrorMercadoPago, validarFormulario, logger, cargandoPago, procesandoPago]);

  // Funciones de navegación y verificación (mantener iguales)
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
    
    logger.info('NAVIGATION', 'Navegando según estado de pago', {
      estado,
      paymentId,
      reservationId,
      datosBase: { ...datosBase, tourNombre: '[REDACTED]' }
    });
    
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
  }, [navigate, datosReserva, total, limpiarDatosReservaEnProgreso, logger]);

  const verificarYConfirmarReserva = useCallback(async (idReserva: number, status: string, paymentId?: string) => {
    try {
      logger.info('VERIFY_RESERVATION', 'Verificando y confirmando reserva', {
        idReserva,
        status,
        tienePaymentId: !!paymentId
      });
      
      let url = `/api/v1/reservas/verificar-confirmar-pago?id_reserva=${idReserva}`;
      if (status) url += `&status=${status}`;
      if (paymentId) url += `&payment_id=${paymentId}`;
      
      const response = await clienteAxios.get(url);
      logger.debug('VERIFY_RESERVATION', 'Respuesta de verificación', {
        success: !!response.data?.success,
        estado: response.data?.data?.estado
      });
      
      if (response.data.success) {
        const reserva = response.data.data;
        if (reserva.estado === "CONFIRMADA") {
          setEstadoPagoVerificado(true);
          logger.info('VERIFY_RESERVATION', 'Reserva confirmada exitosamente');
          return {
            success: true,
            status: "approved",
            reserva: reserva
          };
        }
        
        if (reserva.estado === "CANCELADA" || reserva.estado === "ANULADA") {
          setEstadoPagoVerificado(true);
          logger.warn('VERIFY_RESERVATION', 'Reserva cancelada o anulada', { estado: reserva.estado });
          return {
            success: true,
            status: "rejected",
            reserva: reserva
          };
        }
        
        logger.info('VERIFY_RESERVATION', 'Reserva en estado intermedio', { estado: reserva.estado });
        return {
          success: false,
          status: reserva.estado,
          reserva: reserva
        };
      }
      
      return { success: false, status: null };
    } catch (error) {
      logger.error('VERIFY_RESERVATION', 'Error al verificar y confirmar reserva', error);
      return { success: false, status: null };
    }
  }, [logger]);

  const verificarPagoUnificado = useCallback(async (idReserva: number, preferenceId: string, paymentId?: string) => {
    try {
      logger.debug('VERIFY_PAYMENT', 'Iniciando verificación unificada', {
        idReserva,
        preferenceId,
        tienePaymentId: !!paymentId,
        estadoPagoVerificado,
        intentosVerificacion
      });
      
      if (estadoPagoVerificado) {
        logger.info('VERIFY_PAYMENT', 'Pago ya verificado, omitiendo verificación');
        return { success: true, status: null };
      }
      
      if (intentosVerificacion >= maxIntentosVerificacion) {
        logger.warn('VERIFY_PAYMENT', 'Máximo de intentos alcanzado', { intentosVerificacion });
        return { success: false, status: null };
      }
      
      setIntentosVerificacion(prev => prev + 1);
      
      if (idReserva) {
        const resultado = await verificarYConfirmarReserva(idReserva, "approved", paymentId);
        if (resultado.success && resultado.status) {
          logger.info('VERIFY_PAYMENT', 'Verificación exitosa, navegando');
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
      
      logger.debug('VERIFY_PAYMENT', 'Verificando pago general', { url });
      const response = await clienteAxios.get(url);
      
      if (response.data && response.data.data && response.data.data.status) {
        setEstadoPagoVerificado(true);
        
        const { status, payment_id, reservation_id } = response.data.data;
        
        logger.info('VERIFY_PAYMENT', 'Estado de pago obtenido', { status, payment_id, reservation_id });
        
        if (reservation_id) {
          try {
            await verificarYConfirmarReserva(reservation_id, status, payment_id);
          } catch (err) {
            logger.error('VERIFY_PAYMENT', 'Error al confirmar reserva explícitamente', err);
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
      logger.error('VERIFY_PAYMENT', 'Error en verificación unificada', error);
      return { success: false, status: null };
    }
  }, [estadoPagoVerificado, intentosVerificacion, maxIntentosVerificacion, verificarYConfirmarReserva, navegarSegunEstadoPago, logger]);

  // 🔧 FUNCIÓN PRINCIPAL CORREGIDA - crearPreferenciaReal
  const crearPreferenciaReal = useCallback(async () => {
    try {
      if (preferencia) {
        logger.info('PREFERENCE_CREATION', 'Reutilizando preferencia existente', {
          preferenciaId: preferencia.preference_id || preferencia.id
        });
        return preferencia;
      }
      
      if (datosReserva.reservaId) {
        logger.info('PREFERENCE_CREATION', 'Obteniendo preferencia para reserva existente', {
          reservaId: datosReserva.reservaId
        });
        
        const endpoint = endpoints.mercadoPago.pagarReserva(datosReserva.reservaId);
        logger.debug('PREFERENCE_CREATION', 'Endpoint utilizado', { endpoint });
        
        const response = await clienteAxios.post(endpoint);
        logger.info('PREFERENCE_CREATION', 'Respuesta para reserva existente', {
          hasData: !!response.data?.data,
          success: !!response.data?.success
        });
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else {
          logger.error('PREFERENCE_CREATION', 'Respuesta sin datos de preferencia', response.data);
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
              logger.info('PREFERENCE_CREATION', 'Usando preferencia del cache');
              return reservaCache.data;
            } else {
              logger.info('PREFERENCE_CREATION', 'Preferencia en cache expirada, eliminando');
              localStorage.removeItem(cacheKey);
            }
          } catch (e) {
            logger.error('PREFERENCE_CREATION', 'Error al parsear preferencia en cache', e);
            localStorage.removeItem(cacheKey);
          }
        }
        
        logger.info('PREFERENCE_CREATION', 'Creando nueva reserva', {
          instanciaId: datosReserva.instanciaId
        });
        
        if (!datosReserva.instanciaId) {
          throw new Error("No se encontró ID de instancia");
        }
        
        let pasajes: Pasaje[] = [];
        
        // ✅ PROCESAMIENTO DE PASAJES INDIVIDUALES
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
        
        logger.debug('PREFERENCE_CREATION', 'Pasajes procesados', {
          cantidadPasajes: pasajes.length,
          tienenPrecio: pasajes.every(p => p.precio_unitario > 0)
        });
        
        // ✅ PROCESAMIENTO DE PAQUETES
        let paquetes: Paquete[] = [];
        
        if (datosReserva.paquetes && Array.isArray(datosReserva.paquetes)) {
          paquetes = datosReserva.paquetes
            .filter((p: any) => p.cantidadPaquetes > 0)  // ✅ NUEVA VALIDACIÓN
            .map((p: any) => ({
              id_paquete: p.idPaquetePasajes,
              cantidad: p.cantidadPaquetes,  // ✅ NUEVO CAMPO
              precio: p.precioUnitario
            }));
        } else if (datosReserva.seleccionPaquetes) {
          paquetes = Object.entries(datosReserva.seleccionPaquetes)
            .filter(([_, cantidadValue]) => {
              const cantidad = Number(cantidadValue);
              return !isNaN(cantidad) && cantidad > 0;  // ✅ CORREGIDO: != 0 a > 0
            })
            .map(([paqueteId, cantidadValue]) => ({
              id_paquete: parseInt(paqueteId),
              cantidad: Number(cantidadValue),  // ✅ NUEVO CAMPO
              precio: 0
            }));
        }
        
        logger.debug('PREFERENCE_CREATION', 'Paquetes procesados', {
          cantidadPaquetes: paquetes.length,
          paquetes: paquetes
        });
        
        // 🔧 ✅ VALIDACIÓN CORREGIDA: PASAJES O PAQUETES
        if (pasajes.length === 0 && paquetes.length === 0) {
          throw new Error("Debe seleccionar al menos un pasaje o paquete");
        }
        
        const sessionId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // ✅ DATOS CORREGIDOS PARA EL BACKEND
        const datosParaEnviar = {
          id_instancia: Number(datosReserva.instanciaId),
          id_tour_programado: Number(datosReserva.instanciaId), 
          id_cliente: usuario?.id_cliente ? Number(usuario.id_cliente) : 0,
          
          // ✅ ENVIAR PASAJES INDIVIDUALES
          cantidad_pasajes: pasajes.map(p => ({
            id_tipo_pasaje: p.id_tipo_pasaje,
            cantidad: p.cantidad
          })),
          
          // ✅ ENVIAR PAQUETES CORRECTAMENTE
          paquetes: paquetes.map(p => ({
            id_paquete: p.id_paquete,
            cantidad: p.cantidad || 1  // ✅ INCLUIR CANTIDAD
          })),
          
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
        
        logger.info('PREFERENCE_CREATION', 'Validando datos para envío', {
          tieneEmail: !!datosParaEnviar.email,
          tieneNombre: !!datosParaEnviar.nombre,
          tieneApellido: !!datosParaEnviar.apellido,
          monto: datosParaEnviar.monto,
          cantidadPasajes: datosParaEnviar.cantidad_pasajes.length,
          cantidadPaquetes: datosParaEnviar.paquetes.length,  // ✅ LOG CORREGIDO
          hayPasajes: datosParaEnviar.cantidad_pasajes.length > 0,
          hayPaquetes: datosParaEnviar.paquetes.length > 0
        });
        
        if (!datosParaEnviar.email) {
          throw new Error("El email es obligatorio");
        }
        
        if (!datosParaEnviar.nombre) {
          throw new Error("El nombre es obligatorio");
        }
        
        if (!datosParaEnviar.apellido) {
          throw new Error("El apellido es obligatorio");
        }
        
        const reservaTemporalId = `reserva_temp_${datosReserva.instanciaId}_${Date.now()}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          temporalId: reservaTemporalId,
          timestamp: ahora,
          sessionId: sessionId
        }));
        
        try {
          logger.info('PREFERENCE_CREATION', 'Enviando solicitud de creación');
          logger.debug('PREFERENCE_CREATION', 'Datos enviados al backend', datosParaEnviar);
          
          const response = await clienteAxios.post(endpoints.mercadoPago.reservar, datosParaEnviar);
          logger.info('PREFERENCE_CREATION', 'Respuesta recibida', {
            hasData: !!response.data?.data,
            hasReservaId: !!response.data?.data?.id_reserva
          });
          
          if (response.data && response.data.data) {
            if (response.data.data.id_reserva) {
              logger.info('PREFERENCE_CREATION', 'Reserva creada exitosamente', {
                reservaId: response.data.data.id_reserva
              });
              
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
            logger.error('PREFERENCE_CREATION', 'Respuesta sin datos de preferencia', response.data);
            throw new Error("La respuesta del servidor no contiene datos de preferencia");
          }
        } catch (error: any) {
          localStorage.removeItem(cacheKey);
          
          logger.error('PREFERENCE_CREATION', 'Error al crear preferencia', {
            status: error.response?.status,
            message: error.message,
            hasResponseData: !!error.response?.data,
            responseData: error.response?.data
          });
          
          const mensajeError = analizarErrorMercadoPago(error);
          throw new Error(mensajeError);
        }
      } else {
        logger.error('PREFERENCE_CREATION', 'No hay ID de reserva ni de instancia');
        throw new Error("No se encontró ID de reserva o instancia");
      }
    } catch (error: any) {
      logger.error('PREFERENCE_CREATION', 'Error completo al crear preferencia', {
        message: error.message,
        stack: error.stack?.substring(0, 500)
      });
      
      setError(analizarErrorMercadoPago(error));
      throw error;
    }
  }, [datosReserva, datosUsuario, usuario, total, preferencia, analizarErrorMercadoPago, subtotal, logger]);
  
  // Mantener todas las demás funciones iguales: obtenerOCrearPreferencia, cargarMercadoPagoSDK, etc.

  const obtenerOCrearPreferencia = useCallback(async () => {
    if (preferencia && preferencia.id) {
      logger.info('GET_CREATE_PREFERENCE', 'Retornando preferencia existente');
      return preferencia;
    }
    
    const cacheKey = `reserva_en_proceso_${datosReserva.instanciaId}`;
    const reservaCache = localStorage.getItem(cacheKey);
    
    if (reservaCache) {
      try {
        const datosCacheados = JSON.parse(reservaCache);
        if (datosCacheados.data && datosCacheados.timestamp && 
            (Date.now() - datosCacheados.timestamp < CACHE_DURATION_MS)) {
          logger.info('GET_CREATE_PREFERENCE', 'Usando preferencia cacheada');
          setPreferencia(datosCacheados.data);
          return datosCacheados.data;
        }
      } catch (e) {
        logger.error('GET_CREATE_PREFERENCE', 'Error al parsear preferencia cacheada', e);
      }
    }
    
    logger.info('GET_CREATE_PREFERENCE', 'Creando nueva preferencia');
    return await crearPreferenciaReal();
  }, [preferencia, datosReserva.instanciaId, crearPreferenciaReal, logger]);
  
  const cargarMercadoPagoSDK = useCallback(() => {
    if (window.MercadoPago) {
      logger.info('SDK_LOAD', 'SDK de MercadoPago ya está cargado');
      setSdkCargado(true);
      return Promise.resolve();
    }
    
    logger.info('SDK_LOAD', 'Cargando SDK de MercadoPago');
    
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      
      script.onload = () => {
        logger.info('SDK_LOAD', 'SDK de MercadoPago v2 cargado correctamente');
        setSdkCargado(true);
        resolve();
      };
      
      script.onerror = () => {
        logger.error('SDK_LOAD', 'Error al cargar el SDK de MercadoPago v2');
        setError("No se pudo cargar el procesador de pagos. Verifica tu conexión a internet.");
        reject();
      };
      
      document.head.appendChild(script);
    });
  }, [logger]);

  const inicializarMercadoPagoSDK = useCallback(async () => {
    try {
      if (!publicKey) {
        const key = await obtenerClavePublica();
        if (!key) return;
      }

      if (window.MercadoPago && publicKey) {
        logger.info('SDK_INIT', 'Inicializando MercadoPago SDK v2');
        const mercadoPago = new window.MercadoPago(publicKey, {
          locale: 'es-PE'
        });
        
        setMp(mercadoPago);
        logger.info('SDK_INIT', 'MercadoPago SDK v2 inicializado para Checkout API');
        
        await obtenerMetodosPago();
      }
    } catch (error) {
      logger.error('SDK_INIT', 'Error al inicializar MercadoPago SDK v2', error);
    }
  }, [publicKey, obtenerClavePublica, obtenerMetodosPago, logger]);

  // Mantener todas las demás funciones y useEffects iguales

  const renderizarBotonMercadoPago = useCallback(() => {
    if (!preferencia || !mercadoPagoButtonRef.current || !window.MercadoPago || !publicKey) return;
    
    try {
      const preferenceId = preferencia.preference_id || preferencia.id;
      if (!preferenceId) return;
      
      logger.info('BUTTON_RENDER', 'Renderizando botón de MercadoPago', { preferenceId });
      
      if (mercadoPagoButtonRef.current) {
        mercadoPagoButtonRef.current.innerHTML = '';
      }
      
      const mp = new window.MercadoPago(publicKey, { locale: 'es-PE' });
      
      if (mercadoPagoButtonRef.current && mercadoPagoButtonRef.current.childElementCount === 0) {
        mp.checkout({
          preference: { id: preferenceId },
          render: { container: '.mercado-pago-button', label: 'Pagar', type: 'wallet' },
          theme: { elementsColor: '#0062cc', headerColor: '#0062cc' },
          autoOpen: false,
          callbacks: {
            onError: (error: any) => {
              logger.error('BUTTON_RENDER', 'Error en MercadoPago Checkout', error);
              setError(`Error en el procesamiento del pago: ${error.message || 'Error desconocido'}`);
            },
            onReady: () => {
              logger.info('BUTTON_RENDER', 'MercadoPago Checkout listo');
              setCargandoMercadoPago(false);
            }
          }
        });
      }
    } catch (error) {
      logger.error('BUTTON_RENDER', 'Error al renderizar el botón de MercadoPago', error);
      setError("Error al inicializar el botón de pago. Por favor, actualiza la página.");
    }
  }, [preferencia, publicKey, logger]);

  const iniciarProcesoPago = useCallback(async () => {
    try {
      setCargandoMercadoPago(true);
      setError(null);
      
      logger.info('PAYMENT_PROCESS', 'Iniciando proceso de pago');
      
      await cargarMercadoPagoSDK();
      
      if (!publicKey) {
        const key = await obtenerClavePublica();
        if (!key) {
          throw new Error('No se pudo obtener la clave pública de Mercado Pago');
        }
      }
      
      logger.info('PAYMENT_PROCESS', 'Obteniendo o creando preferencia');
      const nuevaPreferencia = await obtenerOCrearPreferencia();
      
      if (!preferencia) {
        setPreferencia(nuevaPreferencia);
      }

      await inicializarMercadoPagoSDK();
      
      logger.info('PAYMENT_PROCESS', 'Proceso de pago iniciado exitosamente');
      return nuevaPreferencia;
    } catch (error: any) {
      logger.error('PAYMENT_PROCESS', 'Error al iniciar el proceso de pago', error);
      setError(analizarErrorMercadoPago(error));
      return null;
    } finally {
      setCargandoMercadoPago(false);
    }
  }, [cargarMercadoPagoSDK, obtenerOCrearPreferencia, obtenerClavePublica, publicKey, preferencia, analizarErrorMercadoPago, inicializarMercadoPagoSDK, logger]);

  const procesarPagoDirecto = async () => {
    if (cargandoPago || procesandoPago) {
      logger.warn('DIRECT_PAYMENT', 'Intento de procesamiento mientras ya está en curso');
      return;
    }
    
    setCargandoPago(true);
    setProcesandoPago(true);
    setError(null);
    setPagoIniciado(true);
    sessionStorage.setItem('pagoIniciado', 'true');
    
    const inicioTiempo = Date.now();
    
    try {
      logger.info('DIRECT_PAYMENT', 'Iniciando procesamiento de pago directo', { modoCheckout });

      if (modoCheckout === 'api') {
        await procesarPagoConCheckoutAPI();
        return;
      }
      
      if (preferencia) {
        logger.info('DIRECT_PAYMENT', 'Usando preferencia existente', {
          tienePreferencia: !!preferencia,
          IS_SANDBOX,
          tieneSandboxUrl: !!preferencia.sandbox_init_point,
          tieneInitPoint: !!preferencia.init_point
        });
        
        let url;
        
        if (IS_SANDBOX && preferencia.sandbox_init_point) {
          url = preferencia.sandbox_init_point;
        } else if (preferencia.sandbox_init_point) {
          url = preferencia.sandbox_init_point;
        } else if (preferencia.init_point) {
          url = preferencia.init_point;
        } else {
          throw new Error("No se encontró URL de pago válida en la preferencia");
        }
        
        if (url) {
          const urlConParametros = `${url}&source=website&version=v2`;
          logger.info('DIRECT_PAYMENT', 'Redirigiendo a MercadoPago', { url: urlConParametros });
          window.location.href = urlConParametros;
        }
        return;
      }
      
      logger.info('DIRECT_PAYMENT', 'No hay preferencia, iniciando proceso completo');
      const nuevaPreferencia = await iniciarProcesoPago();
      
      if (nuevaPreferencia) {
        let url = nuevaPreferencia.sandbox_init_point || nuevaPreferencia.init_point;
        if (url) {
          logger.info('DIRECT_PAYMENT', 'Redirigiendo a nueva preferencia', { url });
          window.location.href = url;
        }
      }
      
    } catch (error: any) {
      const tiempoTranscurrido = Date.now() - inicioTiempo;
      logger.error('DIRECT_PAYMENT', 'Error al procesar el pago directo', {
        error: error.message,
        tiempoMs: tiempoTranscurrido
      });
      setError(analizarErrorMercadoPago(error));
    } finally {
      setCargandoPago(false);
      setProcesandoPago(false);
    }
  };

  // Mantener todos los useEffects iguales

  useEffect(() => {
    const iniciarMercadoPago = async () => {
      try {
        if (preferencia) {
          logger.info('INIT_EFFECT', 'Ya existe una preferencia, no se creará otra');
          setCargandoMercadoPago(false);
          return;
        }
        
        setCargandoMercadoPago(true);
        
        if (!publicKey) {
          await obtenerClavePublica();
        }
        
        await iniciarProcesoPago();
        
      } catch (error) {
        logger.error('INIT_EFFECT', 'Error al inicializar Mercado Pago', error);
      } finally {
        setCargandoMercadoPago(false);
      }
    };
    
    iniciarMercadoPago();
  }, [obtenerClavePublica, iniciarProcesoPago, publicKey, preferencia, logger]);

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
      logger.info('VERIFICATION_EFFECT', 'Iniciando verificación periódica del estado de pago');
      
      const reservaEnProceso = JSON.parse(sessionStorage.getItem('reservaEnProceso') || '{}');
      const idReserva = reservaEnProceso.id || datosReserva.reservaId || datosReserva.instanciaId;
      
      const intervalId = setInterval(async () => {
        const result = await verificarPagoUnificado(idReserva, preferencia.id);
        if (result.success && result.status) {
          clearInterval(intervalId);
          logger.info('VERIFICATION_EFFECT', 'Estado de pago verificado en intervalo', { status: result.status });
          navegarSegunEstadoPago(result.status, result.payment_id || null, result.reservation_id || null);
        }
      }, 3000);
      
      return () => {
        clearInterval(intervalId);
        logger.info('VERIFICATION_EFFECT', 'Verificación periódica detenida');
      };
    }
  }, [preferencia, IS_SANDBOX, verificarPagoUnificado, navegarSegunEstadoPago, estadoPagoVerificado, pagoIniciado, datosReserva, logger]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const paymentId = params.get('payment_id');
    const externalReference = params.get('external_reference');
    const errorMessage = params.get('error');
    
    if (status || paymentId) {
      logger.info('URL_PARAMS_EFFECT', 'Retornando de MercadoPago', {
        status,
        tienePaymentId: !!paymentId,
        tieneExternalRef: !!externalReference,
        tieneError: !!errorMessage
      });
      
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
        logger.debug('URL_PARAMS_EFFECT', 'ID de reserva extraído de external_reference', { reservaId });
      } else {
        const reservaEnProceso = JSON.parse(sessionStorage.getItem('reservaEnProceso') || '{}');
        reservaId = reservaEnProceso.id || datosReserva.reservaId || datosReserva.instanciaId;
        logger.debug('URL_PARAMS_EFFECT', 'ID de reserva obtenido de session/datos', { reservaId });
      }
      
      if (reservaId) {
        verificarYConfirmarReserva(reservaId, status || "approved", paymentId || undefined)
          .then(result => {
            if (result.success && result.status) {
              logger.info('URL_PARAMS_EFFECT', 'Verificación exitosa, navegando', { status: result.status });
              navegarSegunEstadoPago(result.status, paymentId || null, reservaId);
            } else {
              if (status) {
                logger.info('URL_PARAMS_EFFECT', 'Navegando con status de URL', { status });
                navegarSegunEstadoPago(status, paymentId || null, reservaId);
              }
            }
          })
          .catch(error => {
            logger.error('URL_PARAMS_EFFECT', 'Error al verificar y confirmar reserva', error);
            if (status) {
              navegarSegunEstadoPago(status, paymentId || null, reservaId);
            }
          });
      } else {
        if (status) {
          logger.info('URL_PARAMS_EFFECT', 'Navegando sin reservaId', { status });
          navegarSegunEstadoPago(status, paymentId || null, null);
        }
      }
    }
  }, [location.search, navegarSegunEstadoPago, datosReserva, verificarYConfirmarReserva, logger]);
  
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
      logger.error('DATE_FORMAT', 'Error al formatear fecha', { fechaStr, error });
      return 'Fecha no válida';
    }
  };
  
  useEffect(() => {
    return () => {
      if (!estadoPagoVerificado) {
        logger.info('CLEANUP_EFFECT', 'Limpiando datos temporales al desmontar');
        sessionStorage.removeItem('pagoIniciado');
      }
    };
  }, [estadoPagoVerificado, logger]);

  // 🎨 Componente de logs mejorado
  const LogViewer = () => {
    const logs = logger.getLogs();
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white flex justify-between items-center">
            <h3 className="text-lg font-semibold">📊 Registro de Actividad</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const dataStr = logger.exportLogs();
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `logs-pago-${new Date().toISOString().split('T')[0]}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm"
              >
                💾 Exportar
              </button>
              <button
                onClick={() => logger.clearLogs()}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm"
              >
                🗑️ Limpiar
              </button>
              <button
                onClick={() => setMostrandoLogs(false)}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-sm"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-4 h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center">No hay registros disponibles</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className={`p-3 rounded-lg text-sm font-mono border-l-4 ${
                    log.level === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
                    log.level === 'warn' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                    log.level === 'info' ? 'bg-blue-50 border-blue-500 text-blue-800' :
                    'bg-gray-50 border-gray-500 text-gray-800'
                  }`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-xs uppercase tracking-wider">
                        {log.category}
                      </span>
                      <span className="text-xs opacity-75">
                        {new Date(log.timestamp).toLocaleTimeString('es-PE')}
                      </span>
                    </div>
                    <div className="mb-1">{log.message}</div>
                    {log.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs opacity-75 hover:opacity-100">
                          Ver datos
                        </summary>
                        <pre className="mt-1 text-xs bg-black bg-opacity-10 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 🎯 Indicador de estado mejorado
  const EstadoIndicator = () => (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            cargandoPago || procesandoPago ? 'bg-orange-500' :
            error ? 'bg-red-500' :
            estadoPagoVerificado ? 'bg-green-500' :
            'bg-blue-500'
          }`}></div>
          <span className="font-medium text-gray-700">
            {cargandoPago || procesandoPago ? 'Procesando pago...' :
             error ? 'Error detectado' :
             estadoPagoVerificado ? 'Pago verificado' :
             'Sistema listo'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {ACTUAL_ENV === 'development' && (
            <button
              onClick={() => setMostrandoLogs(!mostrandoLogs)}
              className="px-3 py-1 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors"
              title="Ver registros de actividad"
            >
              📊 Logs
            </button>
          )}
          
          <div className="text-xs text-gray-500">
            {IS_SANDBOX ? '🧪 Test' : '🔐 Producción'} | {modoCheckout.toUpperCase()}
          </div>
        </div>
      </div>
      
      {intentosVerificacion > 0 && !estadoPagoVerificado && (
        <div className="mt-2 text-sm text-indigo-600">
          <div className="flex items-center">
            <div className="animate-spin h-3 w-3 border border-indigo-500 border-t-transparent rounded-full mr-2"></div>
            Verificando pago ({intentosVerificacion}/{maxIntentosVerificacion})
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-white via-blue-50 to-cyan-50 min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Header mejorado */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{t('pago.titulo', 'Proceso de Pago')}</h1>
              <p className="mt-1 opacity-90">{t('pago.subtitulo', 'Completa tu reserva realizando el pago')}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {IS_SANDBOX && (
                <div className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-lg text-sm font-medium">
                  🧪 Modo Test
                </div>
              )}
              
              {(cargandoPago || procesandoPago) && (
                <div className="bg-orange-500 text-orange-100 px-3 py-1 rounded-lg text-sm font-medium flex items-center">
                  <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-2"></div>
                  Procesando
                </div>
              )}
            </div>
          </div>
          
          {/* Indicador de progreso mejorado */}
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  estadoPagoVerificado ? 'bg-green-500' : 'bg-white'
                }`}>
                  {estadoPagoVerificado ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className={`font-bold text-sm ${estadoPagoVerificado ? 'text-white' : 'text-blue-600'}`}>2</span>
                  )}
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

        {/* Indicador de estado */}
        <EstadoIndicator />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Detalles de la reserva mejorados */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-cyan-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Detalles de la reserva
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">{datosReserva.tourNombre}</h3>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-teal-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{formatearFecha(datosReserva.fecha)}</span>
                      </div>
                      <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-teal-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{datosReserva.horario}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium border border-blue-200 ml-4 flex-shrink-0">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                      {datosReserva.totalPasajeros} {datosReserva.totalPasajeros === 1 ? 'pasajero' : 'pasajeros'}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">Resumen de costos</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-800 font-medium">S/ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">IGV (18%):</span>
                        <span className="text-gray-800 font-medium">S/ {igv.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                        <span className="text-gray-800">Total a pagar:</span>
                        <span className="text-teal-600">S/ {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resto del JSX del componente completo con todas las secciones de formulario, datos de usuario, etc. */}
            {/* Continúo con la UI completa... */}

            {/* Datos del cliente */}
            {usuario && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200 hover:shadow-md transition-shadow">
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
                    className={`text-sm flex items-center px-3 py-1 rounded-lg transition-colors ${
                      editandoUsuario 
                        ? 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100' 
                        : 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    {editandoUsuario ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelar
                      </>
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
                  {Object.entries({
                    nombres: 'Nombre',
                    apellidos: 'Apellidos', 
                    correo: 'Email',
                    numero_celular: 'Teléfono',
                    numero_documento: 'Documento'
                  }).map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input 
                        type={key === 'correo' ? 'email' : 'text'}
                        name={key}
                        value={datosUsuario[key as keyof typeof datosUsuario] || ''}
                        onChange={handleUsuarioChange}
                        disabled={!editandoUsuario}
                        className={`w-full px-3 py-2 border rounded-md transition-colors ${
                          editandoUsuario 
                            ? 'border-cyan-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  ))}
                </div>
                
                {editandoUsuario && (
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditandoUsuario(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={guardarCambiosUsuario}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all"
                    >
                      Guardar cambios
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Panel de pago */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-cyan-200 hover:shadow-md transition-shadow">
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
                  <div className="mt-2 ml-11 text-xs text-yellow-600 bg-yellow-100 p-2 rounded">
                    <strong>Datos de prueba:</strong><br />
                    Tarjeta: 4509 9535 6623 3704<br />
                    Titular: APRO | CVV: 123 | Mes/Año: 11/25
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mt-4 mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium">Error en el procesamiento</div>
                      <div className="mt-1">{error}</div>
                      <button
                        onClick={() => setError(null)}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Selector de modo */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de pago</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setModoCheckout('api')}
                    className={`flex flex-col items-center p-3 rounded-lg font-medium transition-all ${
                      modoCheckout === 'api'
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">💳</span>
                    <span className="text-sm">Tarjeta</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setModoCheckout('pro')}
                    className={`flex flex-col items-center p-3 rounded-lg font-medium transition-all ${
                      modoCheckout === 'pro'
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">🌐</span>
                    <span className="text-sm">Checkout</span>
                  </button>
                </div>
              </div>

              {/* Resto del formulario de tarjeta y botones de pago */}
              {/* ... resto del JSX de la UI ... */}

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
                        <div className="animate-pulse">
                          <span className="text-sm text-blue-500 block">🔄 Cargando opciones de pago...</span>
                          <span className="text-xs text-blue-400">MercadoPago Checkout Pro</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={modoCheckout === 'api' ? procesarPagoConCheckoutAPI : procesarPagoDirecto}
                    disabled={cargandoPago || procesandoPago}
                    className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl ${
                      cargandoPago || procesandoPago
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:from-blue-700 hover:to-teal-700 transform hover:-translate-y-0.5'
                    }`}
                  >
                    {cargandoPago || procesandoPago ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {procesandoPago ? 'Procesando pago...' : 'Conectando...'}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        {modoCheckout === 'api' ? 'Pagar con tarjeta' : 'Continuar al pago'} S/ {total.toFixed(2)}
                        {IS_SANDBOX && <span className="ml-2 text-xs opacity-75">(Test)</span>}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {mostrandoLogs && <LogViewer />}
    </div>
  );
};

export default PaginaProcesoPago;