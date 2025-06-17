import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
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
  id_paquete_pasajes: number;
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

// Constantes de configuración
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_SANDBOX = !IS_PRODUCTION;

// Clave pública hardcodeada (solo en caso de que falle la carga desde el backend)
const DEFAULT_PUBLIC_KEY = "TEST-77110b60-f2cc-454f-ad25-5d08b927ac85";

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
  const [publicKey, setPublicKey] = useState(DEFAULT_PUBLIC_KEY);
  
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

  // Obtener la clave pública desde el backend
  const obtenerClavePublica = useCallback(async () => {
    try {
      const response = await clienteAxios.get(endpoints.mercadoPago.publicKey);
      if (response.data && response.data.public_key) {
        setPublicKey(response.data.public_key);
        return response.data.public_key;
      }
      
      // Si no hay clave pública en la respuesta, usar la predeterminada
      console.warn("No se pudo obtener la clave pública del backend, usando valor predeterminado");
      return DEFAULT_PUBLIC_KEY;
    } catch (error) {
      console.error('Error al obtener clave pública:', error);
      // No establecer error, simplemente usar la clave predeterminada
      console.warn("Usando clave pública predeterminada debido a error");
      return DEFAULT_PUBLIC_KEY;
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

  // Crear preferencia real usando el backend
  const crearPreferenciaReal = useCallback(async () => {
    try {
      // Verificamos qué tipo de reserva tenemos
      if (datosReserva.reservaId) {
        // Si ya tenemos una reserva, usamos el endpoint para pagar una reserva existente
        console.log("Obteniendo preferencia para reserva existente:", datosReserva.reservaId);
        
        const endpoint = endpoints.mercadoPago.pagarReserva(datosReserva.reservaId);
        const response = await clienteAxios.post(endpoint);
        
        console.log("Respuesta del servidor:", response.data);
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else {
          throw new Error("La respuesta del servidor no contiene datos de preferencia");
        }
      } else if (datosReserva.instanciaId) {
        // Si es una nueva reserva, creamos una reserva con Mercado Pago
        console.log("Creando nueva reserva con Mercado Pago para instancia:", datosReserva.instanciaId);
        console.log("Datos de reserva completos:", JSON.stringify(datosReserva, null, 2));
        
        // Preparar los pasajes en el formato correcto
        let pasajes: Pasaje[] = [];
        
        // Verificar si tenemos cantidadesPasajes (formato array)
        if (datosReserva.cantidadesPasajes && Array.isArray(datosReserva.cantidadesPasajes)) {
          pasajes = datosReserva.cantidadesPasajes
            .filter((p: PasajeDatosReserva) => p.cantidad > 0)
            .map((p: PasajeDatosReserva) => ({
              id_tipo_pasaje: p.idTipoPasaje,
              cantidad: p.cantidad,
              precio_unitario: p.precioUnitario
            }));
        } 
        // Si tenemos seleccionPasajes (formato objeto)
        else if (datosReserva.seleccionPasajes) {
          Object.entries(datosReserva.seleccionPasajes).forEach(([tipoId, cantidad]) => {
            if (Number(cantidad) > 0) {
              pasajes.push({
                id_tipo_pasaje: parseInt(tipoId),
                cantidad: Number(cantidad),
                precio_unitario: 120 // Valor por defecto, idealmente debería venir de algún lado
              });
            }
          });
        }
        
        console.log("Pasajes formateados:", pasajes);
        
        // Validar que haya al menos un pasaje
        if (pasajes.length === 0) {
          console.error("Error: No hay pasajes seleccionados");
          throw new Error("Debe seleccionar al menos un pasaje");
        }
        
        // Preparar los paquetes en el formato correcto
        let paquetes: Paquete[] = [];
        
        // Verificar si tenemos paquetes (formato array)
        if (datosReserva.paquetes && Array.isArray(datosReserva.paquetes)) {
          paquetes = datosReserva.paquetes
            .filter((p: PaqueteDatosReserva) => p.seleccionado)
            .map((p: PaqueteDatosReserva) => ({
              id_paquete_pasajes: p.idPaquetePasajes,
              precio: p.precio
            }));
        } 
        // Si tenemos seleccionPaquetes (formato objeto)
        else if (datosReserva.seleccionPaquetes) {
          Object.entries(datosReserva.seleccionPaquetes).forEach(([paqueteId, seleccionado]) => {
            if (seleccionado) {
              paquetes.push({
                id_paquete_pasajes: parseInt(paqueteId),
                precio: 200 // Valor por defecto, idealmente debería venir de algún lado
              });
            }
          });
        }
        
        console.log("Paquetes formateados:", paquetes);
        
        // Datos para enviar al backend
        const datosParaEnviar = {
          id_instancia: datosReserva.instanciaId,
          id_cliente: usuario?.id_cliente || 0,
          pasajes: pasajes,
          paquetes: paquetes,
          monto: parseFloat((datosReserva.total || total).toFixed(2)),
          tour_nombre: datosReserva.tourNombre || "Tour",
          email: usuario?.correo || datosUsuario.correo || "",
          nombre: usuario?.nombres || datosUsuario.nombres || "",
          apellido: usuario?.apellidos || datosUsuario.apellidos || "",
          telefono: usuario?.numero_celular || datosUsuario.numero_celular || "",
          documento: usuario?.numero_documento || datosUsuario.numero_documento || ""
        };
        
        // Validar datos requeridos
        if (!datosParaEnviar.email) {
          throw new Error("El email es obligatorio");
        }
        
        if (!datosParaEnviar.nombre) {
          throw new Error("El nombre es obligatorio");
        }
        
        if (!datosParaEnviar.apellido) {
          throw new Error("El apellido es obligatorio");
        }
        
        // Log para depuración
        console.log("Datos para enviar a /mercadopago/reservar:", JSON.stringify(datosParaEnviar, null, 2));
        
        try {
          const response = await clienteAxios.post(endpoints.mercadoPago.reservar, datosParaEnviar);
          
          if (response.data && response.data.data) {
            // Si se creó una reserva, guardar su ID
            if (response.data.data.id_reserva) {
              sessionStorage.setItem('reservaEnProceso', JSON.stringify({
                id: response.data.data.id_reserva,
                tour: datosReserva.tourNombre,
                fecha: datosReserva.fecha
              }));
            }
            return response.data.data;
          } else {
            throw new Error("La respuesta del servidor no contiene datos de preferencia");
          }
        } catch (error: any) {
          console.error("ERROR COMPLETO AL CREAR PREFERENCIA REAL:", error);
          
          if (error.response && error.response.data) {
            console.error("Respuesta del servidor:", error.response.data);
            const mensajeError = error.response.data.error || error.response.data.message || "Error desconocido";
            const detallesError = error.response.data.details || "";
            throw new Error(`${mensajeError}${detallesError ? `: ${detallesError}` : ""}`);
          }
          
          throw error;
        }
      } else {
        throw new Error("No se encontró ID de reserva o instancia");
      }
    } catch (error: any) {
      console.error("ERROR COMPLETO AL CREAR PREFERENCIA REAL:", error);
      console.log("Mensaje:", error.message);
      console.log("Stack:", error.stack);
      
      // Mostrar mensaje de error más detallado
      const mensajeErrorGeneral = `Error al crear preferencia: ${error.message || "Error desconocido"}`;
      console.log("Mensaje de error general:", mensajeErrorGeneral);
      setError(mensajeErrorGeneral);
      
      throw error;
    }
  }, [datosReserva, datosUsuario, usuario, total]);

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
      mercadoPagoButtonRef.current.innerHTML = '';
      
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
      
      // 1. Cargar el SDK si no está cargado
      await cargarMercadoPagoSDK();
      
      // 2. Obtener la clave pública si no la tenemos
      if (!publicKey) {
        const key = await obtenerClavePublica();
        if (!key) {
          console.warn("No se pudo obtener clave pública, usando valor predeterminado");
        }
      }
      
      // 3. Crear preferencia (simulada o real)
      let nuevaPreferencia;
      
      if (usarModoSimulado) {
        console.log("Usando modo simulado para crear preferencia");
        nuevaPreferencia = crearPreferenciaSimulada();
      } else {
        console.log("Usando modo real para crear preferencia");
        try {
          nuevaPreferencia = await crearPreferenciaReal();
        } catch (error) {
          // Si falla el modo real y estamos en desarrollo, usar simulado como fallback
          if (process.env.NODE_ENV === 'development') {
            console.warn("Error en modo real, cambiando a simulado:", error);
            setUsarModoSimulado(true);
            nuevaPreferencia = crearPreferenciaSimulada();
          } else {
            throw error;
          }
        }
      }
      
      // 4. Actualizar el estado
      setPreferencia(nuevaPreferencia);
      
    } catch (error: any) {
      console.error("Error al iniciar el proceso de pago:", error);
      if (!error.message || !error.message.includes('Error al crear preferencia')) {
        setError("No se pudo iniciar el proceso de pago. Por favor, intenta nuevamente.");
      }
    } finally {
      setCargandoMercadoPago(false);
    }
  }, [cargarMercadoPagoSDK, crearPreferenciaSimulada, crearPreferenciaReal, obtenerClavePublica, publicKey, usarModoSimulado]);

  // Función para procesar pago directo
  const procesarPagoDirecto = async () => {
    if (cargandoPago) return;
    
    setCargandoPago(true);
    setError(null);
    
    try {
      console.log("Procesando pago directo...");
      
      // Si tenemos una preferencia con URL de pago, redirigir a ella
      if (preferencia) {
        // Determinar qué URL usar según el entorno
        const url = IS_SANDBOX
          ? (preferencia.sandbox_init_point || preferencia.init_point)
          : preferencia.init_point;
        
        console.log("Redirigiendo a URL de pago:", url);
        
        if (usarModoSimulado) {
          // En modo simulado, redirigir a página de éxito directamente
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          navigate('/reserva-exitosa', {
            state: {
              reservaId: datosReserva.reservaId || datosReserva.instanciaId,
              estado: 'CONFIRMADA',
              metodoPago: 'mercadopago',
              fechaPago: new Date().toISOString(),
              tourNombre: datosReserva.tourNombre,
              total: total,
              fecha: datosReserva.fecha,
              horario: datosReserva.horario,
              totalPasajeros: datosReserva.totalPasajeros,
              mensaje: 'Tu pago ha sido procesado exitosamente'
            }
          });
        } else if (url) {
          // En modo real, redirigir a la URL de pago
          window.location.href = url;
        } else {
          throw new Error("No se encontró URL de pago en la preferencia");
        }
        return;
      }
      
      // Si no tenemos preferencia, intentar crearla
      await iniciarProcesoPago();
      
      // Verificar si ahora tenemos preferencia
      if (preferencia) {
        const url = IS_SANDBOX
          ? (preferencia.sandbox_init_point || preferencia.init_point)
          : preferencia.init_point;
        
        if (usarModoSimulado) {
          // En modo simulado, redirigir a página de éxito directamente
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          navigate('/reserva-exitosa', {
            state: {
              reservaId: datosReserva.reservaId || datosReserva.instanciaId,
              estado: 'CONFIRMADA',
              metodoPago: 'mercadopago',
              fechaPago: new Date().toISOString(),
              tourNombre: datosReserva.tourNombre,
              total: total,
              fecha: datosReserva.fecha,
              horario: datosReserva.horario,
              totalPasajeros: datosReserva.totalPasajeros,
              mensaje: 'Tu pago ha sido procesado exitosamente'
            }
          });
        } else if (url) {
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
        // 1. Obtener clave pública
        if (!publicKey) {
          await obtenerClavePublica();
        }
        
        // 2. Iniciar proceso de pago
        await iniciarProcesoPago();
        
      } catch (error) {
        console.error('Error al inicializar Mercado Pago:', error);
      }
    };
    
    iniciarMercadoPago();
  }, [obtenerClavePublica, iniciarProcesoPago, publicKey]);

  // Renderizar el botón cuando la preferencia cambia
  useEffect(() => {
    if (preferencia && sdkCargado && publicKey) {
      // Pequeño retraso para asegurar que el DOM está listo
      const timeoutId = setTimeout(() => {
        renderizarBotonMercadoPago();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [preferencia, sdkCargado, publicKey, renderizarBotonMercadoPago]);
  
  // Verificar si estamos regresando de un pago en Mercado Pago
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const paymentId = params.get('payment_id');
    const externalReference = params.get('external_reference');
    
    if (status) {
      // Si estamos regresando con un estado
      let reservaId;
      
      // Extraer ID de reserva
      if (externalReference && externalReference.startsWith('RESERVA-')) {
        reservaId = parseInt(externalReference.replace('RESERVA-', ''));
      } else {
        reservaId = datosReserva.reservaId || datosReserva.instanciaId;
      }
      
      // Datos comunes para cualquier estado
      const datosBase = {
        reservaId: reservaId,
        paymentId: paymentId,
        metodoPago: 'mercadopago',
        fechaPago: new Date().toISOString(),
        tourNombre: datosReserva.tourNombre,
        total: total,
        fecha: datosReserva.fecha,
        horario: datosReserva.horario,
        totalPasajeros: datosReserva.totalPasajeros
      };
      
      switch (status) {
        case 'approved':
        case 'success':
          // Pago exitoso
          navigate('/reserva-exitosa', {
            state: {
              ...datosBase,
              estado: 'CONFIRMADA',
              mensaje: 'Tu pago ha sido procesado exitosamente'
            }
          });
          break;
        case 'pending':
          // Pago pendiente
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
          // Pago fallido
          navigate('/pago-fallido', {
            state: {
              ...datosBase,
              estado: 'RECHAZADO',
              mensaje: 'El pago no pudo ser procesado'
            }
          });
          break;
      }
    }
  }, [location.search, navigate, datosReserva, total]);
  
  // Formatear fecha para mostrar
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
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-white via-blue-50 to-cyan-50 min-h-screen">
      {/* El resto del JSX no cambia */}
      {/* ... */}
    </div>
  );
};

export default PaginaProcesoPago;