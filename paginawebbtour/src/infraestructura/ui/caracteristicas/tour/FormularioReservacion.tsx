 /*
import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RootState, AppDispatch } from '../../../store';
import { listarTiposPasajePorTipoTour } from '../../../store/slices/sliceTipoPasaje';
import { listarPaquetesPasajesPorTipoTour } from '../../../store/slices/slicePaquetePasajes';
import { listarInstanciasTourDisponibles, listarInstanciasTourPorFecha } from '../../../store/slices/sliceInstanciaTour';
import { FaCalendarAlt, FaUsers, FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaCalculator, FaUserFriends, FaBoxOpen } from 'react-icons/fa';
import SelectorPasaje from './SelectorPasaje';

// Interfaces
interface DesgloseItem {
  tipo: string;
  cantidad: number;
  id_tipo_pasaje?: number;
}

interface PaquetePasajesExtendido {
  id_paquete: number;
  nombre: string;
  precio_total: number;
  cantidad_total: number;
  descripcion?: string;
  desglose_pasajes?: DesgloseItem[];
  id_tipo_tour: number;
}

interface FormularioReservacionProps {
  tour: {
    id: number;
    nombre: string;
    precio?: number;
    duracion: number;
    horarios: string[];
  };
}

// Componente Cargador
const Cargador = () => (
  <div className="flex justify-center items-center py-8">
    <motion.div
      className="relative w-16 h-16"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    >
      <div className="w-full h-full rounded-full border-4 border-teal-100 opacity-20"></div>
      <div className="w-full h-full rounded-full border-4 border-t-teal-500 border-transparent absolute top-0"></div>
    </motion.div>
  </div>
);

// 🔧 SELECTOR PAQUETE CORREGIDO CON DEBUG
const SelectorPaquete = ({
  paquete,
  cantidad,
  setCantidad,
  tiposPasajeDelTour,
}: {
  paquete: PaquetePasajesExtendido;
  cantidad: number;
  setCantidad: (cantidad: number) => void;
  tiposPasajeDelTour: any[];
}) => {
  const { t } = useTranslation();

  // 🔧 DEBUG: Verificar que el componente recibe los props correctos
  console.log(`🔍 SelectorPaquete - Paquete ${paquete.id_paquete}: cantidad=${cantidad}`, { paquete, setCantidad });

  const handleIncrement = () => {
    const nuevaCantidad = Math.min(5, cantidad + 1);
    console.log(`➕ Incrementando paquete ${paquete.id_paquete}: ${cantidad} -> ${nuevaCantidad}`);
    setCantidad(nuevaCantidad);
  };

  const handleDecrement = () => {
    const nuevaCantidad = Math.max(0, cantidad - 1);
    console.log(`➖ Decrementando paquete ${paquete.id_paquete}: ${cantidad} -> ${nuevaCantidad}`);
    setCantidad(nuevaCantidad);
  };

  return (
    <motion.div
      className={`relative p-4 bg-white border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${
        cantidad > 0 
          ? 'border-emerald-400 bg-emerald-50' 
          : 'border-teal-200 hover:border-teal-300'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Badge seleccionado *//*}
      {cantidad > 0 && (
        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {cantidad} ✓
        </div>
      )}

      {/* Contenido principal *//*}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-teal-900 text-lg mb-1 flex items-center">
            <FaUsers className="w-4 h-4 mr-2 text-emerald-600" />
            {paquete.nombre}
          </h4>
          
          {/* Solo info esencial *//*}
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
              {paquete.cantidad_total} pasajeros
            </span>
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
              🔥 ¡Oferta especial!
            </span>
          </div>
        </div>
        
        {/* Precios compactos *//*}
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600">
            S/ {paquete.precio_total.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 line-through">
            S/ {(paquete.precio_total * 1.15).toFixed(2)}
          </div>
          <div className="text-xs text-emerald-600 font-medium">
            Ahorro: S/ {(paquete.precio_total * 0.15).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Descripción compacta *//*}
      {paquete.descripcion && (
        <div className="bg-gray-50 rounded p-2 mb-3 text-xs text-gray-600 italic">
          {paquete.descripcion}
        </div>
      )}

      {/* 🔧 SELECTOR CANTIDAD CON DEBUG *//*}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-teal-800">Cantidad de paquetes:</span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleDecrement}
            className="w-8 h-8 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded font-bold transition-colors"
            disabled={cantidad <= 0}
          >
            -
          </button>
          <span className="w-12 text-center py-1 bg-teal-50 border text-teal-900 font-bold rounded">
            {cantidad}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            className="w-8 h-8 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded font-bold transition-colors"
            disabled={cantidad >= 5}
          >
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente Alerta (compacta)
const Alerta = ({ tipo, mensaje, onCerrar }: { tipo: string; mensaje: string; onCerrar?: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`mb-4 p-3 rounded-lg shadow border-l-4 text-sm ${
        tipo === 'error'
          ? 'bg-red-50 text-red-900 border-red-500'
          : tipo === 'warning'
          ? 'bg-yellow-50 text-yellow-900 border-yellow-500'
          : tipo === 'success'
          ? 'bg-green-50 text-green-900 border-green-500'
          : 'bg-teal-50 text-teal-900 border-teal-500'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {tipo === 'error' && <FaExclamationTriangle className="h-4 w-4 mr-2 text-red-500" />}
          {tipo === 'warning' && <FaExclamationTriangle className="h-4 w-4 mr-2 text-yellow-500" />}
          {tipo === 'success' && <FaCheckCircle className="h-4 w-4 mr-2 text-green-500" />}
          {tipo === 'info' && <FaInfoCircle className="h-4 w-4 mr-2 text-teal-500" />}
          <span className="font-medium">{mensaje}</span>
        </div>
        {onCerrar && (
          <button onClick={onCerrar} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const FormularioReservacion = ({ tour }: FormularioReservacionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [fecha, setFecha] = useState<Date | null>(null);
  const [horario, setHorario] = useState('');
  const [seleccionPasajes, setSeleccionPasajes] = useState<Record<number, number>>({});
  const [seleccionPaquetes, setSeleccionPaquetes] = useState<Record<number, number>>({});
  const [cargando, setCargando] = useState(false);
  const [instanciaSeleccionada, setInstanciaSeleccionada] = useState<number | null>(null);
  const [alerta, setAlerta] = useState<{ mostrar: boolean; mensaje: string; tipo: string }>({
    mostrar: false,
    mensaje: '',
    tipo: 'info',
  });
  const [pasoActual, setPasoActual] = useState(1);
  const seleccionInicializada = useRef(false);
  const tourAnteriorId = useRef<number | null>(null);
  const datosYaSolicitados = useRef(false);
  const instanciasDisponiblesCargadas = useRef(false);

  const { tiposPasaje, cargando: cargandoTiposPasaje } = useSelector((state: RootState) => state.tipoPasaje);
  const { paquetesPasajes, cargando: cargandoPaquetes } = useSelector((state: RootState) => state.paquetePasajes);
  const { instanciasTour, cargando: cargandoInstancias } = useSelector((state: RootState) => state.instanciaTour);

  const tiposPasajeDelTour = useMemo(() => (Array.isArray(tiposPasaje) ? tiposPasaje.filter((tp) => tp.id_tipo_tour === tour.id) : []), [tiposPasaje, tour.id]);
  const paquetesPasajesDelTour = useMemo(
    () => (Array.isArray(paquetesPasajes) ? (paquetesPasajes as PaquetePasajesExtendido[]).filter((pp) => pp.id_tipo_tour === tour.id) : []),
    [paquetesPasajes, tour.id]
  );
  const instanciasTourArray = useMemo(() => (Array.isArray(instanciasTour) ? instanciasTour : []), [instanciasTour]);

  const instanciasDelTour = useMemo(() => {
    return instanciasTourArray.filter((inst) => {
      if (tour.id === 43) return inst.nombre_tipo_tour?.includes('Ballenas');
      return !inst.nombre_tipo_tour?.includes('Ballenas');
    });
  }, [instanciasTourArray, tour.id]);

  const mostrarAlertaTemp = (mensaje: string, tipo: string = 'info') => {
    setAlerta({ mostrar: true, mensaje, tipo });
    setTimeout(() => setAlerta((prev) => ({ ...prev, mostrar: false })), 4000);
  };

  // useEffects (mantener iguales)
  useEffect(() => {
    if (tour.id && (!datosYaSolicitados.current || tourAnteriorId.current !== tour.id)) {
      dispatch(listarTiposPasajePorTipoTour(tour.id));
      dispatch(listarPaquetesPasajesPorTipoTour(tour.id));
      datosYaSolicitados.current = true;
      tourAnteriorId.current = tour.id;
      if (seleccionInicializada.current) {
        seleccionInicializada.current = false;
        setSeleccionPasajes({});
        setSeleccionPaquetes({});
        setFecha(null);
        setHorario('');
        setInstanciaSeleccionada(null);
        setPasoActual(1);
      }
    }
  }, [dispatch, tour.id]);

  useEffect(() => {
    if (!instanciasDisponiblesCargadas.current) {
      dispatch(listarInstanciasTourDisponibles());
      instanciasDisponiblesCargadas.current = true;
    }
  }, [dispatch]);

  // 🔧 INICIALIZACIÓN DE ESTADOS CORREGIDA
  useEffect(() => {
    if (tiposPasajeDelTour.length > 0 && !seleccionInicializada.current) {
      console.log('🎯 Inicializando estados de selección...');
      console.log('📋 Tipos de pasaje del tour:', tiposPasajeDelTour);
      console.log('📦 Paquetes del tour:', paquetesPasajesDelTour);
      
      // Inicializar pasajes individuales (primer tipo con 1, resto con 0)
      const seleccionInicial: Record<number, number> = {};
      tiposPasajeDelTour.forEach((tipo, index) => {
        seleccionInicial[tipo.id_tipo_pasaje] = index === 0 ? 1 : 0;
      });
      setSeleccionPasajes(seleccionInicial);
      console.log('✅ Estados de pasajes inicializados:', seleccionInicial);
      
      // Inicializar paquetes (todos en 0)
      const paquetesIniciales: Record<number, number> = {};
      paquetesPasajesDelTour.forEach((paquete) => {
        paquetesIniciales[paquete.id_paquete] = 0;
      });
      setSeleccionPaquetes(paquetesIniciales);
      console.log('✅ Estados de paquetes inicializados:', paquetesIniciales);
      
      seleccionInicializada.current = true;
    }
  }, [tiposPasajeDelTour, paquetesPasajesDelTour]);

  useEffect(() => {
    if (fecha) {
      dispatch(listarInstanciasTourPorFecha(fecha.toISOString().split('T')[0]));
    }
  }, [dispatch, fecha]);

  const instanciasPorFechaSeleccionada = useMemo(() => {
    if (!fecha) return [];
    return instanciasDelTour.filter((inst) => {
      const fechaInstancia = inst.fecha_especifica.split('T')[0];
      return fechaInstancia === fecha.toISOString().split('T')[0];
    });
  }, [instanciasDelTour, fecha]);

  const fechasDisponibles = useMemo(() => [...new Set(instanciasDelTour.map((inst) => inst.fecha_especifica.split('T')[0]))], [instanciasDelTour]);
  const opcionesHorario = useMemo(() => {
    return instanciasPorFechaSeleccionada.map((inst) => ({
      id: inst.id_instancia,
      horaInicio: inst.hora_inicio_str || '',
      horaFin: inst.hora_fin_str || '',
      texto: `${inst.hora_inicio_str || ''} - ${inst.hora_fin_str || ''}`,
      cupoDisponible: inst.cupo_disponible,
    }));
  }, [instanciasPorFechaSeleccionada]);

  const fechaMinima = useMemo(() => {
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);
    return new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
  }, []);

  const fechaMaxima = useMemo(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 3);
    return fecha;
  }, []);

  // 🔧 HANDLERS CORREGIDOS CON DEBUG
  const handleFechaChange = (date: Date | null) => {
    if (!date) return;
    const ahora = new Date();
    const diferenciaDias = Math.floor((date.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
    if (diferenciaDias < 1) {
      mostrarAlertaTemp(t('tour.reserva24Horas'), 'warning');
      return;
    }
    setFecha(date);
    setHorario('');
    setInstanciaSeleccionada(null);
  };

  const handleHorarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoHorario = e.target.value;
    setHorario(nuevoHorario);
    const idInstancia = e.target.options[e.target.selectedIndex].getAttribute('data-instancia-id');
    setInstanciaSeleccionada(idInstancia ? parseInt(idInstancia) : null);
    if (nuevoHorario && idInstancia) setPasoActual(2);
  };

  const handleCantidadPasajeChange = (idTipoPasaje: number, cantidad: number) => {
    console.log(`🔄 Actualizando pasaje ${idTipoPasaje}: cantidad = ${cantidad}`);
    setSeleccionPasajes((prev) => {
      const nuevo = { ...prev, [idTipoPasaje]: cantidad };
      console.log('👤 Estado pasajes actualizado:', nuevo);
      return nuevo;
    });
  };

  const handleCantidadPaqueteChange = (idPaquete: number, cantidad: number) => {
    console.log(`🔄 Actualizando paquete ${idPaquete}: cantidad = ${cantidad}`);
    console.log('📦 Estado anterior de paquetes:', seleccionPaquetes);
    
    setSeleccionPaquetes((prev) => {
      const nuevo = { ...prev, [idPaquete]: cantidad };
      console.log('📦 Estado nuevo de paquetes:', nuevo);
      return nuevo;
    });
  };

  // Resto de funciones igual...
  const desglosarPaquetesEnPasajes = (): Record<number, number> => {
    const pasajesDesglosados: Record<number, number> = {};
    
    console.log('🔍 PROCESANDO PAQUETES PARA DESGLOSE:');
    
    Object.entries(seleccionPaquetes).forEach(([idPaquete, cantidadPaquetes]) => {
      if (cantidadPaquetes > 0) {
        const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(idPaquete));
        console.log(`📦 Paquete ${idPaquete}: ${cantidadPaquetes} unidades, Info:`, paquete);
        
        if (!paquete) return;
        
        if (paquete.desglose_pasajes && Array.isArray(paquete.desglose_pasajes)) {
          paquete.desglose_pasajes.forEach((desglose: DesgloseItem) => {
            let idTipoPasajeEncontrado = desglose.id_tipo_pasaje;
            
            if (!idTipoPasajeEncontrado) {
              const tipoPasajeEncontrado = tiposPasajeDelTour.find(
                (tp) =>
                  tp.nombre?.toLowerCase().includes(desglose.tipo?.toLowerCase()) ||
                  desglose.tipo?.toLowerCase().includes(tp.nombre?.toLowerCase())
              );
              idTipoPasajeEncontrado = tipoPasajeEncontrado?.id_tipo_pasaje || (tiposPasajeDelTour[0]?.id_tipo_pasaje || undefined);
            }
            
            if (idTipoPasajeEncontrado) {
              const cantidadTotalPasajeros = desglose.cantidad * cantidadPaquetes;
              pasajesDesglosados[idTipoPasajeEncontrado] = (pasajesDesglosados[idTipoPasajeEncontrado] || 0) + cantidadTotalPasajeros;
              
              console.log(`  ✅ ${desglose.tipo}: ${desglose.cantidad} × ${cantidadPaquetes} = ${cantidadTotalPasajeros} (ID: ${idTipoPasajeEncontrado})`);
            }
          });
        } else if (paquete.cantidad_total && tiposPasajeDelTour.length > 0) {
          const idTipoPasajePorDefecto = tiposPasajeDelTour[0].id_tipo_pasaje;
          const cantidadTotal = paquete.cantidad_total * cantidadPaquetes;
          pasajesDesglosados[idTipoPasajePorDefecto] = (pasajesDesglosados[idTipoPasajePorDefecto] || 0) + cantidadTotal;
          
          console.log(`  ⚠️ Sin desglose específico, usando por defecto: ${cantidadTotal} (ID: ${idTipoPasajePorDefecto})`);
        }
      }
    });
    
    console.log('📊 RESULTADO FINAL DESGLOSE PAQUETES:', pasajesDesglosados);
    return pasajesDesglosados;
  };

  const calcularTotalPasajeros = () => {
    const pasajerosIndividuales = Object.values(seleccionPasajes).reduce((total, cant) => total + cant, 0);
    const pasajerosPaquetes = Object.entries(seleccionPaquetes).reduce((total, [id, cant]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(id));
      return total + (paquete ? paquete.cantidad_total * cant : 0);
    }, 0);
    return pasajerosIndividuales + pasajerosPaquetes;
  };

  const calcularTotal = () => {
    const totalPasajesIndividuales = Object.entries(seleccionPasajes).reduce((total, [id, cant]) => {
      const tipoPasaje = tiposPasajeDelTour.find((t) => t.id_tipo_pasaje === Number(id));
      return total + (tipoPasaje ? tipoPasaje.costo * cant : 0);
    }, 0);
    const totalPaquetes = Object.entries(seleccionPaquetes).reduce((total, [id, cant]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(id));
      return total + (paquete ? paquete.precio_total * cant : 0);
    }, 0);
    return totalPasajesIndividuales + totalPaquetes;
  };

  const verificarCupoDisponible = () => {
    const totalPasajeros = calcularTotalPasajeros();
    const instancia = instanciasPorFechaSeleccionada.find((inst) => inst.id_instancia === instanciaSeleccionada);
    if (instancia && totalPasajeros > instancia.cupo_disponible) {
      mostrarAlertaTemp(`❌ No hay suficiente cupo. Disponible: ${instancia.cupo_disponible}, Solicitado: ${totalPasajeros}`, 'error');
      return false;
    }
    return true;
  };

  const haySeleccion = Object.values(seleccionPasajes).some((cant) => cant > 0) || Object.values(seleccionPaquetes).some((cant) => cant > 0);

  // 🚨 FUNCIÓN irAPago() - VERSIÓN FINAL CORREGIDA
  const irAPago = () => {
    console.log('🎯 INICIANDO PROCESO DE PAGO - VERSIÓN FINAL:');
    console.log('👤 Selección Pasajes Individuales:', seleccionPasajes);
    console.log('📦 Selección Paquetes:', seleccionPaquetes);
    
    if (!haySeleccion) {
      mostrarAlertaTemp('Por favor selecciona al menos un pasaje o paquete', 'warning');
      return;
    }
    if (!verificarCupoDisponible()) return;

    // ✅ PASO 1: PROCESAR SOLO PASAJES INDIVIDUALES
    const cantidadesPasajesIndividuales: {
      idTipoPasaje: number;
      cantidad: number;
      precioUnitario: number;
      nombreTipo: string;
    }[] = [];

    Object.entries(seleccionPasajes).forEach(([id, cant]) => {
      if (cant > 0) {
        const tipoPasaje = tiposPasajeDelTour.find((t) => t.id_tipo_pasaje === Number(id));
        if (tipoPasaje) {
          cantidadesPasajesIndividuales.push({
            idTipoPasaje: Number(id),
            cantidad: cant,
            precioUnitario: tipoPasaje.costo,
            nombreTipo: tipoPasaje.nombre
          });
          console.log(`✅ INDIVIDUAL: ${tipoPasaje.nombre} = ${cant} pasajeros`);
        }
      }
    });

    // ✅ PASO 2: PROCESAR SOLO PAQUETES
    const paquetesSeleccionados: {
      idPaquetePasajes: number;
      nombrePaquete: string;
      cantidadPaquetes: number;
      precioUnitario: number;
      subtotal: number;
      desglosePasajes: {
        tipo: string;
        cantidad: number;
        idTipoPasaje?: number;
      }[];
    }[] = [];

    Object.entries(seleccionPaquetes).forEach(([id, cant]) => {
      if (cant > 0) {
        const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(id));
        if (paquete) {
          const desgloseProcesado = (paquete.desglose_pasajes || []).map(desglose => {
            let idTipoPasajeEncontrado = desglose.id_tipo_pasaje;
            
            if (!idTipoPasajeEncontrado) {
              const tipoPasajeEncontrado = tiposPasajeDelTour.find(
                (tp) =>
                  tp.nombre?.toLowerCase().includes(desglose.tipo?.toLowerCase()) ||
                  desglose.tipo?.toLowerCase().includes(tp.nombre?.toLowerCase())
              );
              idTipoPasajeEncontrado = tipoPasajeEncontrado?.id_tipo_pasaje;
            }

            return {
              tipo: desglose.tipo,
              cantidad: desglose.cantidad,
              idTipoPasaje: idTipoPasajeEncontrado
            };
          });

          paquetesSeleccionados.push({
            idPaquetePasajes: Number(id),
            nombrePaquete: paquete.nombre,
            cantidadPaquetes: cant,
            precioUnitario: paquete.precio_total,
            subtotal: paquete.precio_total * cant,
            desglosePasajes: desgloseProcesado
          });

          console.log(`✅ PAQUETE: ${paquete.nombre} = ${cant} paquetes`);
          console.log(`   Desglose:`, desgloseProcesado);
        }
      }
    });

    const totalPasajeros = calcularTotalPasajeros();
    const totalPrecio = calcularTotal();

    const datosReserva = {
      tourId: tour.id,
      tourNombre: tour.nombre,
      fecha: fecha?.toISOString().split('T')[0] || '',
      horario,
      instanciaId: instanciaSeleccionada,
      
      cantidadesPasajes: cantidadesPasajesIndividuales.map((p) => ({
        idTipoPasaje: p.idTipoPasaje,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario,
        nombreTipo: p.nombreTipo
      })),
      
      paquetes: paquetesSeleccionados.map((p) => ({
        idPaquetePasajes: p.idPaquetePasajes,
        nombrePaquete: p.nombrePaquete,
        cantidadPaquetes: p.cantidadPaquetes,
        precioUnitario: p.precioUnitario,
        subtotal: p.subtotal,
        desglosePasajes: p.desglosePasajes
      })),
      
      totalPasajeros,
      total: totalPrecio,
      timestamp: new Date().toISOString(),
      
      debug: {
        separacionCorrecta: true,
        cantidadPasajesIndividualesEnviados: cantidadesPasajesIndividuales.length,
        cantidadPaquetesEnviados: paquetesSeleccionados.length,
        totalPasajerosCalculado: totalPasajeros,
        totalPrecioCalculado: totalPrecio,
        estadoSeleccionPasajes: seleccionPasajes,
        estadoSeleccionPaquetes: seleccionPaquetes
      }
    };

    console.log('🎯 DATOS FINALES PARA BACKEND:');
    console.log('📊 Resumen:');
    console.log(`   - Pasajes individuales: ${cantidadesPasajesIndividuales.length} tipos`);
    console.log(`   - Paquetes: ${paquetesSeleccionados.length} paquetes`);
    console.log(`   - Total pasajeros: ${totalPasajeros}`);
    console.log(`   - Total precio: S/ ${totalPrecio.toFixed(2)}`);
    console.log('📋 Estructura completa:', datosReserva);

    sessionStorage.setItem('datosReservaPendiente', JSON.stringify(datosReserva));
    navigate('/proceso-pago', { state: datosReserva });
  };

  // Resumen detallado
  const ResumenDetallado = () => {
    const pasajerosIndividuales = Object.values(seleccionPasajes).reduce((total, cant) => total + cant, 0);
    const pasajerosPaquetes = Object.entries(seleccionPaquetes).reduce((total, [id, cant]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(id));
      return total + (paquete ? paquete.cantidad_total * cant : 0);
    }, 0);
    const precioIndividuales = Object.entries(seleccionPasajes).reduce((total, [id, cant]) => {
      const tipoPasaje = tiposPasajeDelTour.find((t) => t.id_tipo_pasaje === Number(id));
      return total + (tipoPasaje ? tipoPasaje.costo * cant : 0);
    }, 0);
    const precioPaquetes = Object.entries(seleccionPaquetes).reduce((total, [id, cant]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(id));
      return total + (paquete ? paquete.precio_total * cant : 0);
    }, 0);

    return (
      <motion.div
        className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200 mt-4 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="font-bold text-teal-900 mb-3 flex items-center text-base">
          <FaCalculator className="w-4 h-4 mr-2" />
          📊 Resumen de reserva
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-3 rounded-lg border border-teal-100">
            <div className="font-medium text-teal-800 mb-2 text-sm flex items-center">
              <FaUsers className="w-3 h-3 mr-1" />
              👥 Pasajeros
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Individuales:</span>
                <span className="text-teal-800 font-medium">{pasajerosIndividuales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">En paquetes:</span>
                <span className="text-teal-800 font-medium">{pasajerosPaquetes}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-teal-100">
                <span className="font-semibold text-teal-800">Total:</span>
                <span className="font-bold text-teal-900 text-sm">{calcularTotalPasajeros()}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-teal-100">
            <div className="font-medium text-teal-800 mb-2 text-sm flex items-center">
              <FaCreditCard className="w-3 h-3 mr-1" />
              💰 Total
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Individuales:</span>
                <span className="text-teal-800 font-medium">S/ {precioIndividuales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paquetes:</span>
                <span className="text-teal-800 font-medium">S/ {precioPaquetes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-teal-100">
                <span className="font-semibold text-teal-800">Total:</span>
                <span className="font-bold text-teal-900 text-sm">S/ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if ((cargandoTiposPasaje || cargandoPaquetes) && !seleccionInicializada.current) {
    return (
      <motion.div
        className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
          <h3 className="text-2xl font-bold">Cargando sistema de reservas...</h3>
        </div>
        <div className="p-8">
          <div className="flex flex-col items-center justify-center h-48">
            <Cargador />
            <p className="mt-4 text-teal-700 text-base font-medium">Preparando opciones de reserva</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* HEADER *//*}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
        <h3 className="text-2xl font-bold flex items-center">
          <FaUsers className="h-6 w-6 mr-3" />
          {t('tour.reservarAhora')} - {tour.nombre}
        </h3>
        {tiposPasajeDelTour.length > 0 && (
          <div className="flex items-center mt-2">
            <span className="text-3xl font-bold">S/ {tiposPasajeDelTour[0].costo.toFixed(2)}</span>
            <span className="text-sm opacity-80 ml-3">{t('tour.porPersona')}</span>
          </div>
        )}
      </div>

      {/* PASOS *//*}
      <div className="bg-gradient-to-b from-teal-50 to-cyan-50 border-b border-teal-200 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <motion.div
            className={`flex flex-col items-center ${pasoActual >= 1 ? 'text-teal-700' : 'text-gray-400'}`}
            animate={{ scale: pasoActual === 1 ? 1.1 : 1 }}
          >
            <div className={`rounded-full h-10 w-10 flex items-center justify-center mb-1 ${pasoActual >= 1 ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 'bg-gray-200 text-gray-500'}`}>
              <FaCalendarAlt className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold">{t('tour.fechaYHora')}</span>
          </motion.div>
          <div className={`flex-1 h-1 mx-3 ${pasoActual >= 2 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
          <motion.div
            className={`flex flex-col items-center ${pasoActual >= 2 ? 'text-teal-700' : 'text-gray-400'}`}
            animate={{ scale: pasoActual === 2 ? 1.1 : 1 }}
          >
            <div className={`rounded-full h-10 w-10 flex items-center justify-center mb-1 ${pasoActual >= 2 ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 'bg-gray-200 text-gray-500'}`}>
              <FaUsers className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold">{t('tour.pasajeros')}</span>
          </motion.div>
        </div>
      </div>

      {/* CUERPO *//*}
      <div className="p-6 bg-gradient-to-b from-white to-teal-50">
        <AnimatePresence>
          {alerta.mostrar && (
            <Alerta tipo={alerta.tipo} mensaje={alerta.mensaje} onCerrar={() => setAlerta((prev) => ({ ...prev, mostrar: false }))} />
          )}
        </AnimatePresence>

        {/* AVISO *//*}
        <motion.div
          className="mb-6 bg-teal-50 border-l-4 border-teal-500 rounded-lg p-4 text-teal-900 text-sm flex items-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaInfoCircle className="h-5 w-5 mr-3 text-teal-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{t('general.importante')}:</span> {t('tour.reserva24Horas')} {t('tour.pagoCompleto')}
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* PASO 1: FECHA Y HORA *//*}
          {pasoActual === 1 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-xl font-bold text-teal-900 border-b border-teal-200 pb-2">{t('tour.seleccionaFechaHorario')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tour.fecha')} <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={fecha}
                    onChange={handleFechaChange}
                    minDate={fechaMinima}
                    maxDate={fechaMaxima}
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-4 py-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 bg-white shadow-sm"
                    placeholderText={t('tour.seleccionarFecha')}
                    required
                  />
                  {cargandoInstancias ? (
                    <p className="text-xs text-teal-600 mt-2">{t('tour.cargandoFechas')}</p>
                  ) : fechasDisponibles.length > 0 ? (
                    <p className="text-xs text-teal-600 mt-2">
                      {t('tour.hayFechasDisponibles')}: {fechasDisponibles.slice(0, 3).join(', ')}
                      {fechasDisponibles.length > 3 ? ` y ${fechasDisponibles.length - 3} más` : ''}
                    </p>
                  ) : (
                    <p className="text-xs text-amber-600 mt-2">{t('tour.sinFechasDisponibles')}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="horario" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tour.horario')} <span className="text-red-500">*</span>
                  </label>
                  {fecha ? (
                    opcionesHorario.length > 0 ? (
                      <select
                        id="horario"
                        value={horario}
                        onChange={handleHorarioChange}
                        required
                        className="w-full px-4 py-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 bg-white shadow-sm"
                      >
                        <option value="">{t('tour.seleccionarHorario')}</option>
                        {opcionesHorario.map((opcion) => (
                          <option
                            key={opcion.id}
                            value={opcion.texto}
                            data-instancia-id={opcion.id}
                            disabled={opcion.cupoDisponible <= 0}
                          >
                            {opcion.texto}{' '}
                            {opcion.cupoDisponible <= 0 ? `(${t('tour.sinCupo')})` : `(${t('tour.disponible')}: ${opcion.cupoDisponible})`}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="bg-amber-50 p-3 rounded-lg text-amber-900 text-sm border border-amber-200">
                        {t('tour.sinHorariosDisponiblesParaFecha')}
                      </div>
                    )
                  ) : (
                    <select
                      id="horario"
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    >
                      <option value="">{t('tour.seleccionePrimeroFecha')}</option>
                    </select>
                  )}
                </div>
              </div>
              {fecha && horario && (
                <>
                  <div className="flex justify-end">
                    <motion.button
                      type="button"
                      onClick={() => setPasoActual(2)}
                      className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('general.continuar')}
                      <FaCheckCircle className="h-4 w-4 ml-2" />
                    </motion.button>
                  </div>
                  <motion.div
                    className="p-4 bg-teal-50 rounded-lg border border-teal-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="font-bold text-teal-900 mb-2">{t('tour.seleccionActual')}:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-teal-700 font-medium">{t('tour.fecha')}:</span>
                        <span className="ml-2 text-teal-900">{formatearFecha(fecha.toISOString())}</span>
                      </div>
                      <div>
                        <span className="text-teal-700 font-medium">{t('tour.horario')}:</span>
                        <span className="ml-2 text-teal-900">{horario}</span>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}

          {/* PASO 2: PASAJEROS *//*}
          {pasoActual === 2 && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-xl font-bold text-teal-900 border-b border-teal-200 pb-2">
                🎯 {t('tour.seleccionaPasajes')}
              </h4>
              
              {/* PAQUETES *//*}
              {paquetesPasajesDelTour.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center mr-3">
                        <FaUsers className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-teal-900">🎁 {t('tour.paquetesPromocion')}</h4>
                        <p className="text-xs text-emerald-600">💰 ¡Ahorra comprando paquetes!</p>
                      </div>
                    </div>
                    <div className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-bold">
                      {paquetesPasajesDelTour.length} disponibles
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {paquetesPasajesDelTour.map((paquete) => (
                      <SelectorPaquete
                        key={paquete.id_paquete}
                        paquete={paquete}
                        cantidad={seleccionPaquetes[paquete.id_paquete] || 0}
                        setCantidad={(cant) => handleCantidadPaqueteChange(paquete.id_paquete, cant)}
                        tiposPasajeDelTour={tiposPasajeDelTour}
                      />
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <span className="px-4 py-1 bg-teal-50 text-teal-700 rounded-full border text-xs font-medium">
                      ➕ También combina con pasajes individuales
                    </span>
                  </div>
                </div>
              )}
              
              {/* PASAJES INDIVIDUALES *//*}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center mr-3">
                      <FaUserFriends className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-teal-900">👤 {t('tour.pasajesIndividuales')}</h4>
                      <p className="text-xs text-blue-600">🎯 Personaliza por tipo</p>
                    </div>
                  </div>
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold">
                    {tiposPasajeDelTour.length} tipos
                  </div>
                </div>
                
                {tiposPasajeDelTour.length > 0 ? (
                  <div className="space-y-3">
                    {tiposPasajeDelTour.map((tipoPasaje) => (
                      <SelectorPasaje
                        key={tipoPasaje.id_tipo_pasaje}
                        tipo={tipoPasaje.nombre}
                        precio={tipoPasaje.costo}
                        cantidad={seleccionPasajes[tipoPasaje.id_tipo_pasaje] || 0}
                        setCantidad={(cant) => handleCantidadPasajeChange(tipoPasaje.id_tipo_pasaje, cant)}
                        min={0}
                        max={20}
                        edad={tipoPasaje.edad || undefined}
                        colorScheme="teal"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-teal-50 p-4 rounded-lg text-center text-teal-800 border border-teal-200">
                    <FaExclamationTriangle className="h-6 w-6 mx-auto mb-2 text-teal-600" />
                    <p className="font-medium">{t('tour.noHayTiposPasajeDisponibles')}</p>
                  </div>
                )}
              </div>
              
              {/* RESUMEN *//*}
              <ResumenDetallado />
              
              {/* BOTONES *//*}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <motion.button
                  type="button"
                  onClick={() => setPasoActual(1)}
                  className="w-full sm:w-auto px-4 py-2 border-2 border-teal-300 text-teal-700 font-bold rounded-lg hover:bg-teal-50 flex items-center justify-center"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <FaTimes className="h-4 w-4 mr-2" />
                  {t('general.volver')}
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={irAPago}
                  disabled={!haySeleccion || cargando}
                  className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg flex items-center justify-center ${
                    !haySeleccion || cargando ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: !haySeleccion || cargando ? 1 : 1.02 }}
                  whileTap={{ scale: !haySeleccion || cargando ? 1 : 0.98 }}
                >
                  {cargando ? (
                    <>
                      <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('general.procesando')}
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="h-4 w-4 mr-2" />
                      {t('tour.continuarPago')} S/ {calcularTotal().toFixed(2)}
                      <span className="ml-2 text-xs opacity-90">
                        ({calcularTotalPasajeros()} {calcularTotalPasajeros() === 1 ? 'pax' : 'pax'})
                      </span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* TÉRMINOS *//*}
        <motion.div
          className="mt-8 text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start">
            <FaInfoCircle className="h-4 w-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-700 mb-2">📋 Términos importantes:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>• <strong>Pago completo</strong> requerido al reservar</div>
                <div>• <strong>Reserva</strong> mínimo 24 horas antes</div>
                <div>• <strong>Precios</strong> incluyen impuestos</div>
                <div>• <strong>Confirmación</strong> por email</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      
     {/* FOOTER SÚPER COMPACTO *//*}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 border-t border-teal-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700 mb-3">
          <div className="flex items-center justify-center sm:justify-start">
            <div className="bg-teal-100 p-2 rounded-full mr-2">
              <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <span className="font-medium text-teal-700">📞 +51 987 654 321</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center sm:justify-start">
            <div className="bg-teal-100 p-2 rounded-full mr-2">
              <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="font-medium text-teal-700">📧 reservas@tours-peru.com</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center sm:justify-start">
            <div className="bg-teal-100 p-2 rounded-full mr-2">
              <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="font-medium text-teal-700">⏰ Lun-Dom 8am-8pm</span>
            </div>
          </div>
        </div>
        
        {/* CERTIFICACIONES PEQUEÑAS *//*}
        <div className="flex flex-wrap justify-center gap-2 pt-3 border-t border-teal-200">
          {[
            { label: '🔒 SSL', bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' },
            { label: '✅ MercadoPago', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
            { label: '🛡️ PCI DSS', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
            { label: '🏆 Autorizado', bgColor: 'bg-orange-100', textColor: 'text-orange-800' }
          ].map((cert, index) => (
            <motion.div
              key={index}
              className={`${cert.bgColor} ${cert.textColor} px-2 py-1 rounded text-xs font-medium`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {cert.label}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FormularioReservacion;*/

import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RootState, AppDispatch } from '../../../store';
import { listarTiposPasajePorTipoTour } from '../../../store/slices/sliceTipoPasaje';
import { listarPaquetesPasajesPorTipoTour } from '../../../store/slices/slicePaquetePasajes';
import { listarInstanciasTourDisponibles, listarInstanciasTourPorFecha } from '../../../store/slices/sliceInstanciaTour';
import { FaCalendarAlt, FaUsers, FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaCalculator, FaUserFriends, FaBoxOpen } from 'react-icons/fa';
import SelectorPasaje from './SelectorPasaje';

// Interfaces
interface DesgloseItem {
  tipo: string;
  cantidad: number;
  id_tipo_pasaje?: number;
}

interface PaquetePasajesExtendido {
  id_paquete: number;
  nombre: string;
  precio_total: number;
  cantidad_total: number;
  descripcion?: string;
  desglose_pasajes?: DesgloseItem[];
  id_tipo_tour: number;
}

interface FormularioReservacionProps {
  tour: {
    id: number;
    nombre: string;
    precio?: number;
    duracion: number;
    horarios: string[];
  };
}

// Función para formatear la fecha en la zona horaria local (Perú, UTC-5)
const formatearFechaLocal = (date: Date | null): string => {
  if (!date) return '';
  // Forzar la fecha a la zona horaria local de Perú (UTC-5)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Función para mostrar la fecha en formato legible
const formatearFechaDisplay = (fechaStr: string) => {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Componente Cargador
const Cargador = () => (
  <div className="flex justify-center items-center py-8">
    <motion.div
      className="relative w-16 h-16"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    >
      <div className="w-full h-full rounded-full border-4 border-teal-100 opacity-20"></div>
      <div className="w-full h-full rounded-full border-4 border-t-teal-500 border-transparent absolute top-0"></div>
    </motion.div>
  </div>
);

// SelectorPaquete (sin cambios, mantenido por consistencia)
const SelectorPaquete = ({
  paquete,
  cantidad,
  setCantidad,
  tiposPasajeDelTour,
}: {
  paquete: PaquetePasajesExtendido;
  cantidad: number;
  setCantidad: (cantidad: number) => void;
  tiposPasajeDelTour: any[];
}) => {
  const { t } = useTranslation();

  console.log(`🔍 SelectorPaquete - Paquete ${paquete.id_paquete}: cantidad=${cantidad}`, { paquete, setCantidad });

  const handleIncrement = () => {
    const nuevaCantidad = Math.min(5, cantidad + 1);
    console.log(`➕ Incrementando paquete ${paquete.id_paquete}: ${cantidad} -> ${nuevaCantidad}`);
    setCantidad(nuevaCantidad);
  };

  const handleDecrement = () => {
    const nuevaCantidad = Math.max(0, cantidad - 1);
    console.log(`➖ Decrementando paquete ${paquete.id_paquete}: ${cantidad} -> ${nuevaCantidad}`);
    setCantidad(nuevaCantidad);
  };

  return (
    <motion.div
      className={`relative p-4 bg-white border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${
        cantidad > 0 
          ? 'border-emerald-400 bg-emerald-50' 
          : 'border-teal-200 hover:border-teal-300'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {cantidad > 0 && (
        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {cantidad} ✓
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-teal-900 text-lg mb-1 flex items-center">
            <FaUsers className="w-4 h-4 mr-2 text-emerald-600" />
            {paquete.nombre}
          </h4>
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
              {paquete.cantidad_total} pasajeros
            </span>
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
              🔥 ¡Oferta especial!
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600">
            S/ {paquete.precio_total.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 line-through">
            S/ {(paquete.precio_total * 1.15).toFixed(2)}
          </div>
          <div className="text-xs text-emerald-600 font-medium">
            Ahorro: S/ {(paquete.precio_total * 0.15).toFixed(2)}
          </div>
        </div>
      </div>
      {paquete.descripcion && (
        <div className="bg-gray-50 rounded p-2 mb-3 text-xs text-gray-600 italic">
          {paquete.descripcion}
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-teal-800">Cantidad de paquetes:</span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleDecrement}
            className="w-8 h-8 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded font-bold transition-colors"
            disabled={cantidad <= 0}
          >
            -
          </button>
          <span className="w-12 text-center py-1 bg-teal-50 border text-teal-900 font-bold rounded">
            {cantidad}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            className="w-8 h-8 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded font-bold transition-colors"
            disabled={cantidad >= 5}
          >
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Alerta (sin cambios, mantenido por consistencia)
const Alerta = ({ tipo, mensaje, onCerrar }: { tipo: string; mensaje: string; onCerrar?: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`mb-4 p-3 rounded-lg shadow border-l-4 text-sm ${
        tipo === 'error'
          ? 'bg-red-50 text-red-900 border-red-500'
          : tipo === 'warning'
          ? 'bg-yellow-50 text-yellow-900 border-yellow-500'
          : tipo === 'success'
          ? 'bg-green-50 text-green-900 border-green-500'
          : 'bg-teal-50 text-teal-900 border-teal-500'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {tipo === 'error' && <FaExclamationTriangle className="h-4 w-4 mr-2 text-red-500" />}
          {tipo === 'warning' && <FaExclamationTriangle className="h-4 w-4 mr-2 text-yellow-500" />}
          {tipo === 'success' && <FaCheckCircle className="h-4 w-4 mr-2 text-green-500" />}
          {tipo === 'info' && <FaInfoCircle className="h-4 w-4 mr-2 text-teal-500" />}
          <span className="font-medium">{mensaje}</span>
        </div>
        {onCerrar && (
          <button onClick={onCerrar} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const FormularioReservacion = ({ tour }: FormularioReservacionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [fecha, setFecha] = useState<Date | null>(null);
  const [horario, setHorario] = useState('');
  const [seleccionPasajes, setSeleccionPasajes] = useState<Record<number, number>>({});
  const [seleccionPaquetes, setSeleccionPaquetes] = useState<Record<number, number>>({});
  const [cargando, setCargando] = useState(false);
  const [instanciaSeleccionada, setInstanciaSeleccionada] = useState<number | null>(null);
  const [alerta, setAlerta] = useState<{ mostrar: boolean; mensaje: string; tipo: string }>({
    mostrar: false,
    mensaje: '',
    tipo: 'info',
  });
  const [pasoActual, setPasoActual] = useState(1);
  const seleccionInicializada = useRef(false);
  const tourAnteriorId = useRef<number | null>(null);
  const datosYaSolicitados = useRef(false);
  const instanciasDisponiblesCargadas = useRef(false);

  const { tiposPasaje, cargando: cargandoTiposPasaje } = useSelector((state: RootState) => state.tipoPasaje);
  const { paquetesPasajes, cargando: cargandoPaquetes } = useSelector((state: RootState) => state.paquetePasajes);
  const { instanciasTour, cargando: cargandoInstancias } = useSelector((state: RootState) => state.instanciaTour);

  const tiposPasajeDelTour = useMemo(() => (Array.isArray(tiposPasaje) ? tiposPasaje.filter((tp) => tp.id_tipo_tour === tour.id) : []), [tiposPasaje, tour.id]);
  const paquetesPasajesDelTour = useMemo(
    () => (Array.isArray(paquetesPasajes) ? (paquetesPasajes as PaquetePasajesExtendido[]).filter((pp) => pp.id_tipo_tour === tour.id) : []),
    [paquetesPasajes, tour.id]
  );
  const instanciasTourArray = useMemo(() => (Array.isArray(instanciasTour) ? instanciasTour : []), [instanciasTour]);

  const instanciasDelTour = useMemo(() => {
    return instanciasTourArray.filter((inst) => {
      if (tour.id === 43) return inst.nombre_tipo_tour?.includes('Ballenas');
      return !inst.nombre_tipo_tour?.includes('Ballenas');
    });
  }, [instanciasTourArray, tour.id]);

  const mostrarAlertaTemp = (mensaje: string, tipo: string = 'info') => {
    setAlerta({ mostrar: true, mensaje, tipo });
    setTimeout(() => setAlerta((prev) => ({ ...prev, mostrar: false })), 4000);
  };

  // useEffects
  useEffect(() => {
    if (tour.id && (!datosYaSolicitados.current || tourAnteriorId.current !== tour.id)) {
      dispatch(listarTiposPasajePorTipoTour(tour.id));
      dispatch(listarPaquetesPasajesPorTipoTour(tour.id));
      datosYaSolicitados.current = true;
      tourAnteriorId.current = tour.id;
      if (seleccionInicializada.current) {
        seleccionInicializada.current = false;
        setSeleccionPasajes({});
        setSeleccionPaquetes({});
        setFecha(null);
        setHorario('');
        setInstanciaSeleccionada(null);
        setPasoActual(1);
      }
    }
  }, [dispatch, tour.id]);

  useEffect(() => {
    if (!instanciasDisponiblesCargadas.current) {
      dispatch(listarInstanciasTourDisponibles());
      instanciasDisponiblesCargadas.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (tiposPasajeDelTour.length > 0 && !seleccionInicializada.current) {
      console.log('🎯 Inicializando estados de selección...');
      console.log('📋 Tipos de pasaje del tour:', tiposPasajeDelTour);
      console.log('📦 Paquetes del tour:', paquetesPasajesDelTour);
      
      const seleccionInicial: Record<number, number> = {};
      tiposPasajeDelTour.forEach((tipo, index) => {
        seleccionInicial[tipo.id_tipo_pasaje] = index === 0 ? 1 : 0;
      });
      setSeleccionPasajes(seleccionInicial);
      console.log('✅ Estados de pasajes inicializados:', seleccionInicial);
      
      const paquetesIniciales: Record<number, number> = {};
      paquetesPasajesDelTour.forEach((paquete) => {
        paquetesIniciales[paquete.id_paquete] = 0;
      });
      setSeleccionPaquetes(paquetesIniciales);
      console.log('✅ Estados de paquetes inicializados:', paquetesIniciales);
      
      seleccionInicializada.current = true;
    }
  }, [tiposPasajeDelTour, paquetesPasajesDelTour]);

  useEffect(() => {
    if (fecha) {
      const fechaFormateada = formatearFechaLocal(fecha);
      console.log(`🔍 Solicitando instancias para fecha: ${fechaFormateada}`);
      dispatch(listarInstanciasTourPorFecha(fechaFormateada));
    }
  }, [dispatch, fecha]);

  const instanciasPorFechaSeleccionada = useMemo(() => {
    if (!fecha) return [];
    const fechaFormateada = formatearFechaLocal(fecha);
    return instanciasDelTour.filter((inst) => {
      const fechaInstancia = inst.fecha_especifica.split('T')[0];
      return fechaInstancia === fechaFormateada;
    });
  }, [instanciasDelTour, fecha]);

  const fechasDisponibles = useMemo(() => [...new Set(instanciasDelTour.map((inst) => inst.fecha_especifica.split('T')[0]))], [instanciasDelTour]);
  const opcionesHorario = useMemo(() => {
    return instanciasPorFechaSeleccionada.map((inst) => ({
      id: inst.id_instancia,
      horaInicio: inst.hora_inicio_str || '',
      horaFin: inst.hora_fin_str || '',
      texto: `${inst.hora_inicio_str || ''} - ${inst.hora_fin_str || ''}`,
      cupoDisponible: inst.cupo_disponible,
    }));
  }, [instanciasPorFechaSeleccionada]);

  const fechaMinima = useMemo(() => {
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);
    return new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
  }, []);

  const fechaMaxima = useMemo(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 3);
    return fecha;
  }, []);

  const handleFechaChange = (date: Date | null) => {
    if (!date) return;
    const ahora = new Date();
    const diferenciaDias = Math.floor((date.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
    if (diferenciaDias < 1) {
      mostrarAlertaTemp(t('tour.reserva24Horas'), 'warning');
      return;
    }
    console.log(`📅 Fecha seleccionada: ${date.toLocaleDateString('es-PE')} (${formatearFechaLocal(date)})`);
    setFecha(date);
    setHorario('');
    setInstanciaSeleccionada(null);
  };

  const handleHorarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoHorario = e.target.value;
    setHorario(nuevoHorario);
    const idInstancia = e.target.options[e.target.selectedIndex].getAttribute('data-instancia-id');
    setInstanciaSeleccionada(idInstancia ? parseInt(idInstancia) : null);
    if (nuevoHorario && idInstancia) setPasoActual(2);
  };

  const handleCantidadPasajeChange = (idTipoPasaje: number, cantidad: number) => {
    console.log(`🔄 Actualizando pasaje ${idTipoPasaje}: cantidad = ${cantidad}`);
    setSeleccionPasajes((prev) => {
      const nuevo = { ...prev, [idTipoPasaje]: cantidad };
      console.log('👤 Estado pasajes actualizado:', nuevo);
      return nuevo;
    });
  };

  const handleCantidadPaqueteChange = (idPaquete: number, cantidad: number) => {
    console.log(`🔄 Actualizando paquete ${idPaquete}: cantidad = ${cantidad}`);
    setSeleccionPaquetes((prev) => {
      const nuevo = { ...prev, [idPaquete]: cantidad };
      console.log('📦 Estado nuevo de paquetes:', nuevo);
      return nuevo;
    });
  };

  const desglosarPaquetesEnPasajes = (): Record<number, number> => {
    const pasajesDesglosados: Record<number, number> = {};
    
    console.log('🔍 PROCESANDO PAQUETES PARA DESGLOSE:');
    
    Object.entries(seleccionPaquetes).forEach(([idPaquete, cantidadPaquetes]) => {
      if (cantidadPaquetes > 0) {
        const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(idPaquete));
        console.log(`📦 Paquete ${idPaquete}: ${cantidadPaquetes} unidades, Info:`, paquete);
        
        if (!paquete) return;
        
        if (paquete.desglose_pasajes && Array.isArray(paquete.desglose_pasajes)) {
          paquete.desglose_pasajes.forEach((desglose: DesgloseItem) => {
            let idTipoPasajeEncontrado = desglose.id_tipo_pasaje;
            
            if (!idTipoPasajeEncontrado) {
              const tipoPasajeEncontrado = tiposPasajeDelTour.find(
                (tp) =>
                  tp.nombre?.toLowerCase().includes(desglose.tipo?.toLowerCase()) ||
                  desglose.tipo?.toLowerCase().includes(tp.nombre?.toLowerCase())
              );
              idTipoPasajeEncontrado = tipoPasajeEncontrado?.id_tipo_pasaje || (tiposPasajeDelTour[0]?.id_tipo_pasaje || undefined);
            }
            
            if (idTipoPasajeEncontrado) {
              const cantidadTotalPasajeros = desglose.cantidad * cantidadPaquetes;
              pasajesDesglosados[idTipoPasajeEncontrado] = (pasajesDesglosados[idTipoPasajeEncontrado] || 0) + cantidadTotalPasajeros;
              
              console.log(`  ✅ ${desglose.tipo}: ${desglose.cantidad} × ${cantidadPaquetes} = ${cantidadTotalPasajeros} (ID: ${idTipoPasajeEncontrado})`);
            }
          });
        } else if (paquete.cantidad_total && tiposPasajeDelTour.length > 0) {
          const idTipoPasajePorDefecto = tiposPasajeDelTour[0].id_tipo_pasaje;
          const cantidadTotal = paquete.cantidad_total * cantidadPaquetes;
          pasajesDesglosados[idTipoPasajePorDefecto] = (pasajesDesglosados[idTipoPasajePorDefecto] || 0) + cantidadTotal;
          
          console.log(`  ⚠️ Sin desglose específico, usando por defecto: ${cantidadTotal} (ID: ${idTipoPasajePorDefecto})`);
        }
      }
    });
    
    console.log('📊 RESULTADO FINAL DESGLOSE PAQUETES:', pasajesDesglosados);
    return pasajesDesglosados;
  };

  const calcularTotalPasajeros = () => {
    const pasajerosIndividuales = Object.values(seleccionPasajes).reduce((total, cant) => total + cant, 0);
    const pasajerosPaquetes = Object.entries(seleccionPaquetes).reduce((total, [id, cant]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(id));
      return total + (paquete ? paquete.cantidad_total * cant : 0);
    }, 0);
    return pasajerosIndividuales + pasajerosPaquetes;
  };

  const calcularTotal = () => {
    const totalPasajesIndividuales = Object.entries(seleccionPasajes).reduce((total, [id, cant]) => {
      const tipoPasaje = tiposPasajeDelTour.find((t) => t.id_tipo_pasaje === Number(id));
      return total + (tipoPasaje ? tipoPasaje.costo * cant : 0);
    }, 0);
    const totalPaquetes = Object.entries(seleccionPaquetes).reduce((total, [id, cant]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(id));
      return total + (paquete ? paquete.precio_total * cant : 0);
    }, 0);
    return totalPasajesIndividuales + totalPaquetes;
  };

  const verificarCupoDisponible = () => {
    const totalPasajeros = calcularTotalPasajeros();
    const instancia = instanciasPorFechaSeleccionada.find((inst) => inst.id_instancia === instanciaSeleccionada);
    if (instancia && totalPasajeros > instancia.cupo_disponible) {
      mostrarAlertaTemp(`❌ No hay suficiente cupo. Disponible: ${instancia.cupo_disponible}, Solicitado: ${totalPasajeros}`, 'error');
      return false;
    }
    return true;
  };

  const haySeleccion = Object.values(seleccionPasajes).some((cant) => cant > 0) || Object.values(seleccionPaquetes).some((cant) => cant > 0);

  const irAPago = () => {
    console.log('🎯 INICIANDO PROCESO DE PAGO - VERSIÓN FINAL:');
    console.log('👤 Selección Pasajes Individuales:', seleccionPasajes);
    console.log('📦 Selección Paquetes:', seleccionPaquetes);
    console.log('📅 Fecha seleccionada:', fecha ? formatearFechaLocal(fecha) : 'No seleccionada');
    
    if (!haySeleccion) {
      mostrarAlertaTemp('Por favor selecciona al menos un pasaje o paquete', 'warning');
      return;
    }
    if (!verificarCupoDisponible()) return;

    const cantidadesPasajesIndividuales: {
      idTipoPasaje: number;
      cantidad: number;
      precioUnitario: number;
      nombreTipo: string;
    }[] = [];

    Object.entries(seleccionPasajes).forEach(([id, cant]) => {
      if (cant > 0) {
        const tipoPasaje = tiposPasajeDelTour.find((t) => t.id_tipo_pasaje === Number(id));
        if (tipoPasaje) {
          cantidadesPasajesIndividuales.push({
            idTipoPasaje: Number(id),
            cantidad: cant,
            precioUnitario: tipoPasaje.costo,
            nombreTipo: tipoPasaje.nombre
          });
          console.log(`✅ INDIVIDUAL: ${tipoPasaje.nombre} = ${cant} pasajeros`);
        }
      }
    });

    const paquetesSeleccionados: {
      idPaquetePasajes: number;
      nombrePaquete: string;
      cantidadPaquetes: number;
      precioUnitario: number;
      subtotal: number;
      desglosePasajes: {
        tipo: string;
        cantidad: number;
        idTipoPasaje?: number;
      }[];
    }[] = [];

    Object.entries(seleccionPaquetes).forEach(([id, cant]) => {
      if (cant > 0) {
        const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(id));
        if (paquete) {
          const desgloseProcesado = (paquete.desglose_pasajes || []).map(desglose => {
            let idTipoPasajeEncontrado = desglose.id_tipo_pasaje;
            
            if (!idTipoPasajeEncontrado) {
              const tipoPasajeEncontrado = tiposPasajeDelTour.find(
                (tp) =>
                  tp.nombre?.toLowerCase().includes(desglose.tipo?.toLowerCase()) ||
                  desglose.tipo?.toLowerCase().includes(tp.nombre?.toLowerCase())
              );
              idTipoPasajeEncontrado = tipoPasajeEncontrado?.id_tipo_pasaje;
            }

            return {
              tipo: desglose.tipo,
              cantidad: desglose.cantidad,
              idTipoPasaje: idTipoPasajeEncontrado
            };
          });

          paquetesSeleccionados.push({
            idPaquetePasajes: Number(id),
            nombrePaquete: paquete.nombre,
            cantidadPaquetes: cant,
            precioUnitario: paquete.precio_total,
            subtotal: paquete.precio_total * cant,
            desglosePasajes: desgloseProcesado
          });

          console.log(`✅ PAQUETE: ${paquete.nombre} = ${cant} paquetes`);
          console.log(`   Desglose:`, desgloseProcesado);
        }
      }
    });

    const totalPasajeros = calcularTotalPasajeros();
    const totalPrecio = calcularTotal();

    const datosReserva = {
      tourId: tour.id,
      tourNombre: tour.nombre,
      fecha: fecha ? formatearFechaLocal(fecha) : '',
      horario,
      instanciaId: instanciaSeleccionada,
      cantidadesPasajes: cantidadesPasajesIndividuales.map((p) => ({
        idTipoPasaje: p.idTipoPasaje,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario,
        nombreTipo: p.nombreTipo
      })),
      paquetes: paquetesSeleccionados.map((p) => ({
        idPaquetePasajes: p.idPaquetePasajes,
        nombrePaquete: p.nombrePaquete,
        cantidadPaquetes: p.cantidadPaquetes,
        precioUnitario: p.precioUnitario,
        subtotal: p.subtotal,
        desglosePasajes: p.desglosePasajes
      })),
      totalPasajeros,
      total: totalPrecio,
      timestamp: new Date().toISOString(),
      debug: {
        separacionCorrecta: true,
        cantidadPasajesIndividualesEnviados: cantidadesPasajesIndividuales.length,
        cantidadPaquetesEnviados: paquetesSeleccionados.length,
        totalPasajerosCalculado: totalPasajeros,
        totalPrecioCalculado: totalPrecio,
        estadoSeleccionPasajes: seleccionPasajes,
        estadoSeleccionPaquetes: seleccionPaquetes
      }
    };

    console.log('🎯 DATOS FINALES PARA BACKEND:');
    console.log('📊 Resumen:');
    console.log(`   - Fecha enviada: ${datosReserva.fecha}`);
    console.log(`   - Pasajes individuales: ${cantidadesPasajesIndividuales.length} tipos`);
    console.log(`   - Paquetes: ${paquetesSeleccionados.length} paquetes`);
    console.log(`   - Total pasajeros: ${totalPasajeros}`);
    console.log(`   - Total precio: S/ ${totalPrecio.toFixed(2)}`);
    console.log('📋 Estructura completa:', datosReserva);

    sessionStorage.setItem('datosReservaPendiente', JSON.stringify(datosReserva));
    navigate('/proceso-pago', { state: datosReserva });
  };

  // ResumenDetallado (sin cambios, mantenido por consistencia)
  const ResumenDetallado = () => {
    const pasajerosIndividuales = Object.values(seleccionPasajes).reduce((total, cant) => total + cant, 0);
    const pasajerosPaquetes = Object.entries(seleccionPaquetes).reduce((total, [id, cant]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(id));
      return total + (paquete ? paquete.cantidad_total * cant : 0);
    }, 0);
    const precioIndividuales = Object.entries(seleccionPasajes).reduce((total, [id, cant]) => {
      const tipoPasaje = tiposPasajeDelTour.find((t) => t.id_tipo_pasaje === Number(id));
      return total + (tipoPasaje ? tipoPasaje.costo * cant : 0);
    }, 0);
    const precioPaquetes = Object.entries(seleccionPaquetes).reduce((total, [id, cant]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(id));
      return total + (paquete ? paquete.precio_total * cant : 0);
    }, 0);

    return (
      <motion.div
        className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200 mt-4 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="font-bold text-teal-900 mb-3 flex items-center text-base">
          <FaCalculator className="w-4 h-4 mr-2" />
          📊 Resumen de reserva
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-3 rounded-lg border border-teal-100">
            <div className="font-medium text-teal-800 mb-2 text-sm flex items-center">
              <FaUsers className="w-3 h-3 mr-1" />
              👥 Pasajeros
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Individuales:</span>
                <span className="text-teal-800 font-medium">{pasajerosIndividuales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">En paquetes:</span>
                <span className="text-teal-800 font-medium">{pasajerosPaquetes}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-teal-100">
                <span className="font-semibold text-teal-800">Total:</span>
                <span className="font-bold text-teal-900 text-sm">{calcularTotalPasajeros()}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-teal-100">
            <div className="font-medium text-teal-800 mb-2 text-sm flex items-center">
              <FaCreditCard className="w-3 h-3 mr-1" />
              💰 Total
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Individuales:</span>
                <span className="text-teal-800 font-medium">S/ {precioIndividuales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paquetes:</span>
                <span className="text-teal-800 font-medium">S/ {precioPaquetes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-teal-100">
                <span className="font-semibold text-teal-800">Total:</span>
                <span className="font-bold text-teal-900 text-sm">S/ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if ((cargandoTiposPasaje || cargandoPaquetes) && !seleccionInicializada.current) {
    return (
      <motion.div
        className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
          <h3 className="text-2xl font-bold">Cargando sistema de reservas...</h3>
        </div>
        <div className="p-8">
          <div className="flex flex-col items-center justify-center h-48">
            <Cargador />
            <p className="mt-4 text-teal-700 text-base font-medium">Preparando opciones de reserva</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
        <h3 className="text-2xl font-bold flex items-center">
          <FaUsers className="h-6 w-6 mr-3" />
          {t('tour.reservarAhora')} - {tour.nombre}
        </h3>
        {tiposPasajeDelTour.length > 0 && (
          <div className="flex items-center mt-2">
            <span className="text-3xl font-bold">S/ {tiposPasajeDelTour[0].costo.toFixed(2)}</span>
            <span className="text-sm opacity-80 ml-3">{t('tour.porPersona')}</span>
          </div>
        )}
      </div>
      <div className="bg-gradient-to-b from-teal-50 to-cyan-50 border-b border-teal-200 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <motion.div
            className={`flex flex-col items-center ${pasoActual >= 1 ? 'text-teal-700' : 'text-gray-400'}`}
            animate={{ scale: pasoActual === 1 ? 1.1 : 1 }}
          >
            <div className={`rounded-full h-10 w-10 flex items-center justify-center mb-1 ${pasoActual >= 1 ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 'bg-gray-200 text-gray-500'}`}>
              <FaCalendarAlt className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold">{t('tour.fechaYHora')}</span>
          </motion.div>
          <div className={`flex-1 h-1 mx-3 ${pasoActual >= 2 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
          <motion.div
            className={`flex flex-col items-center ${pasoActual >= 2 ? 'text-teal-700' : 'text-gray-400'}`}
            animate={{ scale: pasoActual === 2 ? 1.1 : 1 }}
          >
            <div className={`rounded-full h-10 w-10 flex items-center justify-center mb-1 ${pasoActual >= 2 ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 'bg-gray-200 text-gray-500'}`}>
              <FaUsers className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold">{t('tour.pasajeros')}</span>
          </motion.div>
        </div>
      </div>
      <div className="p-6 bg-gradient-to-b from-white to-teal-50">
        <AnimatePresence>
          {alerta.mostrar && (
            <Alerta tipo={alerta.tipo} mensaje={alerta.mensaje} onCerrar={() => setAlerta((prev) => ({ ...prev, mostrar: false }))} />
          )}
        </AnimatePresence>
        <motion.div
          className="mb-6 bg-teal-50 border-l-4 border-teal-500 rounded-lg p-4 text-teal-900 text-sm flex items-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaInfoCircle className="h-5 w-5 mr-3 text-teal-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{t('general.importante')}:</span> {t('tour.reserva24Horas')} {t('tour.pagoCompleto')}
          </div>
        </motion.div>
        <div className="space-y-8">
          {pasoActual === 1 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-xl font-bold text-teal-900 border-b border-teal-200 pb-2">{t('tour.seleccionaFechaHorario')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tour.fecha')} <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={fecha}
                    onChange={handleFechaChange}
                    minDate={fechaMinima}
                    maxDate={fechaMaxima}
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-4 py-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 bg-white shadow-sm"
                    placeholderText={t('tour.seleccionarFecha')}
                    required
                  />
                  {cargandoInstancias ? (
                    <p className="text-xs text-teal-600 mt-2">{t('tour.cargandoFechas')}</p>
                  ) : fechasDisponibles.length > 0 ? (
                    <p className="text-xs text-teal-600 mt-2">
                      {t('tour.hayFechasDisponibles')}: {fechasDisponibles.slice(0, 3).join(', ')}
                      {fechasDisponibles.length > 3 ? ` y ${fechasDisponibles.length - 3} más` : ''}
                    </p>
                  ) : (
                    <p className="text-xs text-amber-600 mt-2">{t('tour.sinFechasDisponibles')}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="horario" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tour.horario')} <span className="text-red-500">*</span>
                  </label>
                  {fecha ? (
                    opcionesHorario.length > 0 ? (
                      <select
                        id="horario"
                        value={horario}
                        onChange={handleHorarioChange}
                        required
                        className="w-full px-4 py-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 bg-white shadow-sm"
                      >
                        <option value="">{t('tour.seleccionarHorario')}</option>
                        {opcionesHorario.map((opcion) => (
                          <option
                            key={opcion.id}
                            value={opcion.texto}
                            data-instancia-id={opcion.id}
                            disabled={opcion.cupoDisponible <= 0}
                          >
                            {opcion.texto}{' '}
                            {opcion.cupoDisponible <= 0 ? `(${t('tour.sinCupo')})` : `(${t('tour.disponible')}: ${opcion.cupoDisponible})`}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="bg-amber-50 p-3 rounded-lg text-amber-900 text-sm border border-amber-200">
                        {t('tour.sinHorariosDisponiblesParaFecha')}
                      </div>
                    )
                  ) : (
                    <select
                      id="horario"
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    >
                      <option value="">{t('tour.seleccionePrimeroFecha')}</option>
                    </select>
                  )}
                </div>
              </div>
              {fecha && horario && (
                <>
                  <div className="flex justify-end">
                    <motion.button
                      type="button"
                      onClick={() => setPasoActual(2)}
                      className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('general.continuar')}
                      <FaCheckCircle className="h-4 w-4 ml-2" />
                    </motion.button>
                  </div>
                  <motion.div
                    className="p-4 bg-teal-50 rounded-lg border border-teal-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="font-bold text-teal-900 mb-2">{t('tour.seleccionActual')}:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-teal-700 font-medium">{t('tour.fecha')}:</span>
                        <span className="ml-2 text-teal-900">{fecha ? formatearFechaDisplay(formatearFechaLocal(fecha)) : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-teal-700 font-medium">{t('tour.horario')}:</span>
                        <span className="ml-2 text-teal-900">{horario}</span>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
          {pasoActual === 2 && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-xl font-bold text-teal-900 border-b border-teal-200 pb-2">
                🎯 {t('tour.seleccionaPasajes')}
              </h4>
              {paquetesPasajesDelTour.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center mr-3">
                        <FaUsers className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-teal-900">🎁 {t('tour.paquetesPromocion')}</h4>
                        <p className="text-xs text-emerald-600">💰 ¡Ahorra comprando paquetes!</p>
                      </div>
                    </div>
                    <div className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-bold">
                      {paquetesPasajesDelTour.length} disponibles
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {paquetesPasajesDelTour.map((paquete) => (
                      <SelectorPaquete
                        key={paquete.id_paquete}
                        paquete={paquete}
                        cantidad={seleccionPaquetes[paquete.id_paquete] || 0}
                        setCantidad={(cant) => handleCantidadPaqueteChange(paquete.id_paquete, cant)}
                        tiposPasajeDelTour={tiposPasajeDelTour}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <span className="px-4 py-1 bg-teal-50 text-teal-700 rounded-full border text-xs font-medium">
                      ➕ También combina con pasajes individuales
                    </span>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center mr-3">
                      <FaUserFriends className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-teal-900">👤 {t('tour.pasajesIndividuales')}</h4>
                      <p className="text-xs text-blue-600">🎯 Personaliza por tipo</p>
                    </div>
                  </div>
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold">
                    {tiposPasajeDelTour.length} tipos
                  </div>
                </div>
                {tiposPasajeDelTour.length > 0 ? (
                  <div className="space-y-3">
                    {tiposPasajeDelTour.map((tipoPasaje) => (
                      <SelectorPasaje
                        key={tipoPasaje.id_tipo_pasaje}
                        tipo={tipoPasaje.nombre}
                        precio={tipoPasaje.costo}
                        cantidad={seleccionPasajes[tipoPasaje.id_tipo_pasaje] || 0}
                        setCantidad={(cant) => handleCantidadPasajeChange(tipoPasaje.id_tipo_pasaje, cant)}
                        min={0}
                        max={20}
                        edad={tipoPasaje.edad || undefined}
                        colorScheme="teal"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-teal-50 p-4 rounded-lg text-center text-teal-800 border border-teal-200">
                    <FaExclamationTriangle className="h-6 w-6 mx-auto mb-2 text-teal-600" />
                    <p className="font-medium">{t('tour.noHayTiposPasajeDisponibles')}</p>
                  </div>
                )}
              </div>
              <ResumenDetallado />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <motion.button
                  type="button"
                  onClick={() => setPasoActual(1)}
                  className="w-full sm:w-auto px-4 py-2 border-2 border-teal-300 text-teal-700 font-bold rounded-lg hover:bg-teal-50 flex items-center justify-center"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <FaTimes className="h-4 w-4 mr-2" />
                  {t('general.volver')}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={irAPago}
                  disabled={!haySeleccion || cargando}
                  className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg flex items-center justify-center ${
                    !haySeleccion || cargando ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: !haySeleccion || cargando ? 1 : 1.02 }}
                  whileTap={{ scale: !haySeleccion || cargando ? 1 : 0.98 }}
                >
                  {cargando ? (
                    <>
                      <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('general.procesando')}
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="h-4 w-4 mr-2" />
                      {t('tour.continuarPago')} S/ {calcularTotal().toFixed(2)}
                      <span className="ml-2 text-xs opacity-90">
                        ({calcularTotalPasajeros()} {calcularTotalPasajeros() === 1 ? 'pax' : 'pax'})
                      </span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
        <motion.div
          className="mt-8 text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start">
            <FaInfoCircle className="h-4 w-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-700 mb-2">📋 Términos importantes:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>• <strong>Pago completo</strong> requerido al reservar</div>
                <div>• <strong>Reserva</strong> mínimo 24 horas antes</div>
                <div>• <strong>Precios</strong> incluyen impuestos</div>
                <div>• <strong>Confirmación</strong> por email</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 border-t border-teal-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700 mb-3">
          <div className="flex items-center justify-center sm:justify-start">
            <div className="bg-teal-100 p-2 rounded-full mr-2">
              <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <span className="font-medium text-teal-700">📞 +51 987 654 321</span>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start">
            <div className="bg-teal-100 p-2 rounded-full mr-2">
              <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="font-medium text-teal-700">📧 reservas@tours-peru.com</span>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start">
            <div className="bg-teal-100 p-2 rounded-full mr-2">
              <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="font-medium text-teal-700">⏰ Lun-Dom 8am-8pm</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 pt-3 border-t border-teal-200">
          {[
            { label: '🔒 SSL', bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' },
            { label: '✅ MercadoPago', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
            { label: '🛡️ PCI DSS', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
            { label: '🏆 Autorizado', bgColor: 'bg-orange-100', textColor: 'text-orange-800' }
          ].map((cert, index) => (
            <motion.div
              key={index}
              className={`${cert.bgColor} ${cert.textColor} px-2 py-1 rounded text-xs font-medium`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {cert.label}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FormularioReservacion;