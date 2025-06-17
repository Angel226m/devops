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

// Constantes de configuración
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_SANDBOX = !IS_PRODUCTION;

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

  // Crear preferencia real usando el backend
// Crear preferencia real usando el backend
const crearPreferenciaReal = useCallback(async () => {
  try {
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
            return seleccionadoValue === true || seleccionadoValue === 1 || seleccionadoValue === '1';
          })
          .map(([paqueteId, _]) => ({
            // Usar id_paquete en lugar de id_paquete_pasajes
            id_paquete: parseInt(paqueteId),
            precio: preciosPaquetes[paqueteId] || 200 // Precio por defecto
          }));
      }
      
      console.log("Paquetes formateados:", JSON.stringify(paquetes, null, 2));
      
      // Datos para enviar al backend
      const datosParaEnviar = {
        id_tour_programado: Number(datosReserva.instanciaId), // Cambiado de id_instancia a id_tour_programado
        id_cliente: usuario?.id_cliente ? Number(usuario.id_cliente) : 0, 
        pasajes: pasajes,
        paquetes: paquetes,
        monto: parseFloat((datosReserva.total || total).toFixed(2)),
        total_pagar: parseFloat((datosReserva.total || total).toFixed(2)), // Campo requerido
        tour_nombre: datosReserva.tourNombre || "Tour",
        email: usuario?.correo || datosUsuario.correo || "",
        nombre: usuario?.nombres || datosUsuario.nombres || "",
        apellido: usuario?.apellidos || datosUsuario.apellidos || "",
        telefono: usuario?.numero_celular || datosUsuario.numero_celular || "",
        documento: usuario?.numero_documento || datosUsuario.numero_documento || ""
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
      
      try {
        console.log("Iniciando solicitud POST...");
        const response = await clienteAxios.post(endpoints.mercadoPago.reservar, datosParaEnviar);
        console.log("Respuesta del servidor:", JSON.stringify(response.data, null, 2));
        
        if (response.data && response.data.data) {
          // Si se creó una reserva, guardar su ID
          if (response.data.data.id_reserva) {
            console.log("ID de reserva creada:", response.data.data.id_reserva);
            sessionStorage.setItem('reservaEnProceso', JSON.stringify({
              id: response.data.data.id_reserva,
              tour: datosReserva.tourNombre,
              fecha: datosReserva.fecha
            }));
          }
          return response.data.data;
        } else {
          console.error("Respuesta sin datos de preferencia:", response.data);
          throw new Error("La respuesta del servidor no contiene datos de preferencia");
        }
      } catch (error: any) {
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
}, [datosReserva, datosUsuario, usuario, total]);

  // Resto del código permanece igual...
  
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
              
              {/* Tarjetas de prueba (solo en desarrollo) */}
              {process.env.NODE_ENV === 'development' && usarModoSimulado && (
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