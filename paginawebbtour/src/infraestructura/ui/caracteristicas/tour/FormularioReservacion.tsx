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
import { FaCalendarAlt, FaClock, FaUsers, FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import SelectorPasaje from './SelectorPasaje';

// Componente Cargador
const Cargador = () => (
  <div className="flex justify-center items-center py-12">
    <motion.div
      className="relative w-20 h-20"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    >
      <div className="w-full h-full rounded-full border-4 border-teal-100 opacity-20"></div>
      <div className="w-full h-full rounded-full border-4 border-t-teal-500 border-transparent absolute top-0"></div>
    </motion.div>
  </div>
);

// Componente SelectorPaquete
const SelectorPaquete = ({
  paquete,
  cantidad,
  setCantidad,
}: {
  paquete: any;
  cantidad: number;
  setCantidad: (cantidad: number) => void;
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      className={`p-6 bg-white border border-teal-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
        cantidad > 0 ? 'border-teal-400 shadow-teal-100' : 'hover:border-teal-300'
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-teal-900 text-xl">{paquete.nombre}</h4>
          <span className="inline-block mt-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
            {paquete.cantidad_total} {t('tour.pasajeros')}
          </span>
        </div>
        <div className="font-bold text-teal-600 text-2xl">S/ {paquete.precio_total.toFixed(2)}</div>
      </div>
      {paquete.descripcion && (
        <p className="text-sm text-gray-600 mt-3 italic">{paquete.descripcion}</p>
      )}
      <div className="flex items-center justify-between mt-5">
        <span className="text-sm font-semibold text-teal-800">{t('tour.cantidad')}:</span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setCantidad(Math.max(0, cantidad - 1))}
            className="w-10 h-10 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-md border border-teal-300 transition-colors font-bold"
            aria-label={t('tour.reducirCantidad')}
          >
            -
          </button>
          <span className="w-14 text-center py-2 bg-teal-50 border border-teal-300 text-teal-900 font-semibold rounded-md">
            {cantidad}
          </span>
          <button
            type="button"
            onClick={() => setCantidad(Math.min(10, cantidad + 1))}
            className="w-10 h-10 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-md border border-teal-300 transition-colors font-bold"
            aria-label={t('tour.aumentarCantidad')}
          >
            +
          </button>
        </div>
      </div>
      {cantidad > 0 && (
        <motion.div
          className="mt-4 text-right"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="bg-teal-100 text-teal-800 font-semibold px-4 py-1.5 rounded-full">
            {t('tour.subtotal')}: S/ {(paquete.precio_total * cantidad).toFixed(2)}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

// Componente Alerta
const Alerta = ({ tipo, mensaje, onCerrar }: { tipo: string; mensaje: string; onCerrar?: () => void }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-8 p-5 rounded-2xl shadow-lg border-l-4 ${
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
          {tipo === 'error' && <FaExclamationTriangle className="h-6 w-6 mr-3 text-red-500" />}
          {tipo === 'warning' && <FaExclamationTriangle className="h-6 w-6 mr-3 text-yellow-500" />}
          {tipo === 'success' && <FaCheckCircle className="h-6 w-6 mr-3 text-green-500" />}
          {tipo === 'info' && <FaInfoCircle className="h-6 w-6 mr-3 text-teal-500" />}
          <span className="font-medium">{mensaje}</span>
        </div>
        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={t('general.cerrar')}
          >
            <FaTimes className="h-5 w-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Tipos
type SeleccionPasajes = Record<number, number>;
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

  const tiposPasajeArray = Array.isArray(tiposPasaje) ? tiposPasaje : [];
  const paquetesPasajesArray = Array.isArray(paquetesPasajes) ? paquetesPasajes : [];
  const instanciasTourArray = Array.isArray(instanciasTour) ? instanciasTour : [];

  const tiposPasajeDelTour = tiposPasajeArray.filter((tp) => tp.id_tipo_tour === tour.id);
  const paquetesPasajesDelTour = paquetesPasajesArray.filter((pp) => pp.id_tipo_tour === tour.id);

  const mostrarAlertaTemp = (mensaje: string, tipo: string = 'info') => {
    setAlerta({ mostrar: true, mensaje, tipo });
    setTimeout(() => setAlerta((prev) => ({ ...prev, mostrar: false })), 5000);
  };

  const instanciasDelTour = useMemo(() => {
    return instanciasTourArray.filter((inst) => {
      if (tour.id === 43) {
        return inst.nombre_tipo_tour?.includes('Ballenas');
      } else if (inst.nombre_tipo_tour) {
        return !inst.nombre_tipo_tour.includes('Ballenas');
      }
      return false;
    });
  }, [instanciasTourArray, tour.id]);

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
        setFecha('');
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
      const seleccionInicial: SeleccionPasajes = {};
      tiposPasajeDelTour.forEach((tipo, index) => {
        seleccionInicial[tipo.id_tipo_pasaje] = index === 0 ? 1 : 0;
      });
      setSeleccionPasajes(seleccionInicial);
      const paquetesIniciales: SeleccionPaquetes = {};
      paquetesPasajesDelTour.forEach((paquete) => {
        paquetesIniciales[paquete.id_paquete] = 0;
      });
      setSeleccionPaquetes(paquetesIniciales);
      seleccionInicializada.current = true;
    }
  }, [tiposPasajeDelTour, paquetesPasajesDelTour]);

  useEffect(() => {
    if (fecha) {
      dispatch(listarInstanciasTourPorFecha(fecha));
    }
  }, [dispatch, fecha]);

  const instanciasPorFechaSeleccionada = useMemo(() => {
    if (!fecha) return [];
    return instanciasDelTour.filter((inst) => {
      const fechaInstancia = inst.fecha_especifica.split('T')[0];
      return fechaInstancia === fecha;
    });
  }, [instanciasDelTour, fecha]);

  const fechasDisponibles = useMemo(() => {
    return [...new Set(instanciasDelTour.map((inst) => inst.fecha_especifica.split('T')[0]))];
  }, [instanciasDelTour]);

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
    const manana = new Date(ahora);
    manana.setDate(ahora.getDate() + 1);
    return manana;
  }, []);

  const fechaMaxima = useMemo(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 3);
    return fecha;
  }, []);

  const handleFechaChange = (date: Date | null) => {
    if (!date) return;
    const nuevaFecha = date.toISOString().split('T')[0];
    const ahora = new Date();
    const diferenciaDias = Math.floor((date.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
    if (diferenciaDias < 1) {
      mostrarAlertaTemp(t('tour.reserva24Horas'), 'warning');
      return;
    }
    setFecha(nuevaFecha);
    setHorario('');
    setInstanciaSeleccionada(null);
  };

  const handleHorarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoHorario = e.target.value;
    setHorario(nuevoHorario);
    const idInstancia = e.target.options[e.target.selectedIndex].getAttribute('data-instancia-id');
    setInstanciaSeleccionada(idInstancia ? parseInt(idInstancia) : null);
    if (nuevoHorario && idInstancia) {
      setPasoActual(2);
    }
  };

  const handleCantidadPasajeChange = (idTipoPasaje: number, cantidad: number) => {
    setSeleccionPasajes((prev) => ({ ...prev, [idTipoPasaje]: cantidad }));
  };

  const handleCantidadPaqueteChange = (idPaquete: number, cantidad: number) => {
    setSeleccionPaquetes((prev) => ({ ...prev, [idPaquete]: cantidad }));
  };

  const calcularTotalPasajeros = () => {
    const pasajerosIndividuales = Object.values(seleccionPasajes).reduce((total, cantidad) => total + cantidad, 0);
    const pasajerosPaquetes = Object.entries(seleccionPaquetes).reduce((total, [idPaquete, cantidad]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(idPaquete));
      return total + (paquete ? paquete.cantidad_total * cantidad : 0);
    }, 0);
    return pasajerosIndividuales + pasajerosPaquetes;
  };

  const calcularTotal = () => {
    const totalPasajesIndividuales = Object.entries(seleccionPasajes).reduce((total, [idTipoPasaje, cantidad]) => {
      const tipoPasaje = tiposPasajeDelTour.find((t) => t.id_tipo_pasaje === Number(idTipoPasaje));
      return total + (tipoPasaje ? tipoPasaje.costo * cantidad : 0);
    }, 0);
    const totalPaquetes = Object.entries(seleccionPaquetes).reduce((total, [idPaquete, cantidad]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(idPaquete));
      return total + (paquete ? paquete.precio_total * cantidad : 0);
    }, 0);
    return totalPasajesIndividuales + totalPaquetes;
  };

  const verificarCupoDisponible = () => {
    const totalPasajeros = calcularTotalPasajeros();
    const instancia = instanciasPorFechaSeleccionada.find((inst) => inst.id_instancia === instanciaSeleccionada);
    if (instancia && totalPasajeros > instancia.cupo_disponible) {
      mostrarAlertaTemp(
        `${t('tour.noCupoDisponible')} ${instancia.cupo_disponible}, ${t('tour.solicitado')}: ${totalPasajeros}`,
        'error'
      );
      return false;
    }
    return true;
  };

  const haySeleccion =
    Object.values(seleccionPasajes).some((cantidad) => cantidad > 0) ||
    Object.values(seleccionPaquetes).some((cantidad) => cantidad > 0);

  const irAPago = () => {
    if (!haySeleccion) {
      mostrarAlertaTemp(t('tour.seleccionePasajeOPaquete'), 'warning');
      return;
    }
    if (!verificarCupoDisponible()) {
      return;
    }
    const datosReserva = {
      tourId: tour.id,
      tourNombre: tour.nombre,
      fecha,
      horario,
      instanciaId: instanciaSeleccionada,
      seleccionPasajes,
      seleccionPaquetes,
      totalPasajeros: calcularTotalPasajeros(),
      total: calcularTotal(),
    };
    // Log the data to the console
    console.log('Datos de reserva enviados:', datosReserva);
    sessionStorage.setItem('datosReservaPendiente', JSON.stringify(datosReserva));
    navigate('/proceso-pago', { state: datosReserva });
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
        className="bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-8 text-white">
          <h3 className="text-3xl font-extrabold tracking-tight">{t('tour.cargandoReserva')}</h3>
        </div>
        <div className="p-10">
          <div className="flex flex-col items-center justify-center h-72">
            <Cargador />
            <p className="mt-6 text-teal-700 text-lg font-medium">{t('general.cargando')}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Encabezado *//*}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-8 text-white">
        <h3 className="text-3xl font-extrabold tracking-tight flex items-center">
          <FaUsers className="h-7 w-7 mr-3" />
          {t('tour.reservarAhora')} - {tour.nombre}
        </h3>
        {tiposPasajeDelTour.length > 0 && (
          <div className="flex items-center mt-3">
            <span className="text-4xl font-bold">S/ {tiposPasajeDelTour[0].costo.toFixed(2)}</span>
            <span className="text-sm opacity-80 ml-3">{t('tour.porPersona')}</span>
          </div>
        )}
      </div>

      {/* Pasos *//*}
      <div className="bg-gradient-to-b from-teal-50 to-cyan-50 border-b border-teal-200 p-6">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <motion.div
            className={`flex flex-col items-center ${pasoActual >= 1 ? 'text-teal-700' : 'text-gray-400'}`}
            animate={{ scale: pasoActual === 1 ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div
              className={`rounded-full h-12 w-12 flex items-center justify-center mb-2 ${
                pasoActual >= 1 ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 'bg-gray-200 text-gray-500'
              }`}
            >
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold">{t('tour.fechaYHora')}</span>
          </motion.div>
          <div className={`flex-1 h-1.5 mx-4 ${pasoActual >= 2 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
          <motion.div
            className={`flex flex-col items-center ${pasoActual >= 2 ? 'text-teal-700' : 'text-gray-400'}`}
            animate={{ scale: pasoActual === 2 ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div
              className={`rounded-full h-12 w-12 flex items-center justify-center mb-2 ${
                pasoActual >= 2 ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 'bg-gray-200 text-gray-500'
              }`}
            >
              <FaUsers className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold">{t('tour.pasajeros')}</span>
          </motion.div>
        </div>
      </div>

      {/* Cuerpo *//*}
      <div className="p-8 bg-gradient-to-b from-white to-teal-50">
        <AnimatePresence>
          {alerta.mostrar && (
            <Alerta
              tipo={alerta.tipo}
              mensaje={alerta.mensaje}
              onCerrar={() => setAlerta((prev) => ({ ...prev, mostrar: false }))}
            />
          )}
        </AnimatePresence>

        {/* Aviso de 24 horas *//*}
        <motion.div
          className="mb-8 bg-teal-50 border-l-4 border-teal-500 rounded-2xl p-5 text-teal-900 text-sm flex items-start shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FaInfoCircle className="h-6 w-6 mr-3 text-teal-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{t('general.importante')}:</span> {t('tour.reserva24Horas')} {t('tour.pagoCompleto')}
          </div>
        </motion.div>

        <div className="space-y-10">
          {/* PASO 1: Fecha y Hora *//*}
          {pasoActual === 1 && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-2xl font-bold text-teal-900 border-b border-teal-200 pb-3">{t('tour.seleccionaFechaHorario')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="fecha" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('tour.fecha')} <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={fecha ? new Date(fecha) : null}
                    onChange={handleFechaChange}
                    minDate={fechaMinima}
                    maxDate={fechaMaxima}
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-4 py-3 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 bg-white shadow-md transition-all duration-300"
                    placeholderText={t('tour.seleccionarFecha')}
                    required
                    aria-required="true"
                  />
                  {cargandoInstancias ? (
                    <p className="text-xs text-teal-600 mt-2 font-medium">{t('tour.cargandoFechas')}</p>
                  ) : fechasDisponibles.length > 0 ? (
                    <p className="text-xs text-teal-600 mt-2 font-medium">
                      {t('tour.hayFechasDisponibles')}: {fechasDisponibles.slice(0, 3).join(', ')}
                      {fechasDisponibles.length > 3 ? ` ${t('tour.yMas', { count: fechasDisponibles.length - 3 })}` : ''}
                    </p>
                  ) : (
                    <p className="text-xs text-amber-600 mt-2 font-medium">{t('tour.sinFechasDisponibles')}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="horario" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('tour.horario')} <span className="text-red-500">*</span>
                  </label>
                  {fecha ? (
                    opcionesHorario.length > 0 ? (
                      <select
                        id="horario"
                        value={horario}
                        onChange={handleHorarioChange}
                        required
                        className="w-full px-4 py-3 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 bg-white shadow-md transition-all duration-300"
                        aria-required="true"
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
                            {opcion.cupoDisponible <= 0
                              ? `(${t('tour.sinCupo')})`
                              : `(${t('tour.disponible')}: ${opcion.cupoDisponible})`}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="bg-amber-50 p-4 rounded-xl text-amber-900 text-sm border border-amber-200 shadow-sm">
                        {t('tour.sinHorariosDisponiblesParaFecha')}
                      </div>
                    )
                  ) : (
                    <select
                      id="horario"
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm"
                    >
                      <option value="">{t('tour.seleccionePrimeroFecha')}</option>
                    </select>
                  )}
                </div>
              </div>
              {fecha && horario && (
                <div className="mt-8 flex justify-end">
                  <motion.button
                    type="button"
                    onClick={() => setPasoActual(2)}
                    className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('general.continuar')}
                    <FaCheckCircle className="h-5 w-5 ml-2" />
                  </motion.button>
                </div>
              )}
              {fecha && horario && (
                <motion.div
                  className="mt-6 p-5 bg-teal-50 rounded-2xl border border-teal-200 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h5 className="font-bold text-teal-900 mb-3">{t('tour.seleccionActual')}:</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-teal-700 font-semibold">{t('tour.fecha')}:</span>
                      <span className="ml-2 text-teal-900">{formatearFecha(fecha)}</span>
                    </div>
                    <div>
                      <span className="text-teal-700 font-semibold">{t('tour.horario')}:</span>
                      <span className="ml-2 text-teal-900">{horario}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PASO 2: Pasajeros *//*}
          {pasoActual === 2 && (
            <motion.div
              className="space-y-10"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-2xl font-bold text-teal-900 border-b border-teal-200 pb-3">{t('tour.seleccionaPasajes')}</h4>
              {paquetesPasajesDelTour.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-5">
                    <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <FaUsers className="h-7 w-7" />
                    </div>
                    <h4 className="text-xl font-bold text-teal-900">{t('tour.paquetesPromocion')}</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paquetesPasajesDelTour.map((paquete) => (
                      <SelectorPaquete
                        key={paquete.id_paquete}
                        paquete={paquete}
                        cantidad={seleccionPaquetes[paquete.id_paquete] || 0}
                        setCantidad={(cantidad) => handleCantidadPaqueteChange(paquete.id_paquete, cantidad)}
                      />
                    ))}
                  </div>
                  <div className="text-center text-sm text-teal-700 my-6">
                    <span className="inline-block px-5 py-2 bg-teal-50 rounded-full border border-teal-200 shadow-sm font-semibold">
                      {t('tour.combinar')}
                    </span>
                  </div>
                </div>
              )}
              <div className="space-y-6">
                <div className="flex items-center mb-5">
                  <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <FaUsers className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-bold text-teal-900">{t('tour.pasajesIndividuales')}</h4>
                </div>
                {tiposPasajeDelTour.length > 0 ? (
                  <div className="space-y-4">
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
                        colorScheme="teal"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-teal-50 p-5 rounded-2xl text-center text-teal-800 border border-teal-200 shadow-sm">
                    {t('tour.noHayTiposPasajeDisponibles')}
                  </div>
                )}
              </div>
              <motion.div
                className="p-5 bg-teal-50 rounded-2xl border border-teal-200 mt-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex justify-between text-sm font-semibold">
                  <span>{t('tour.totalPasajeros')}:</span>
                  <span className="text-teal-800">{calcularTotalPasajeros()}</span>
                </div>
                <div className="flex justify-between font-bold mt-3 pt-3 border-t border-teal-200">
                  <span>{t('tour.totalPagar')}:</span>
                  <span className="text-teal-600 text-lg">S/ {calcularTotal().toFixed(2)}</span>
                </div>
              </motion.div>
              <div className="flex justify-between mt-8">
                <motion.button
                  type="button"
                  onClick={() => setPasoActual(1)}
                  className="px-6 py-3 border border-teal-300 text-teal-700 font-bold rounded-xl transition-all hover:bg-teal-50 shadow-md flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes className="h-5 w-5 mr-2" />
                  {t('general.volver')}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={irAPago}
                  disabled={!haySeleccion || cargando}
                  className={`px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center ${
                    !haySeleccion || cargando ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: !haySeleccion || cargando ? 1 : 1.05 }}
                  whileTap={{ scale: !haySeleccion || cargando ? 1 : 0.95 }}
                >
                  {cargando ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t('general.procesando')}
                    </>
                  ) : (
                    <>
                      {t('tour.continuarPago')}
                      <FaCreditCard className="h-5 w-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </div>
              <motion.div
                className="mt-8 pt-5 border-t border-teal-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center mb-5">
                  <FaCreditCard className="h-7 w-7 text-teal-600 mr-3" />
                  <h5 className="font-bold text-teal-800 text-lg">{t('tour.pagoSeguro')}</h5>
                </div>
                <div className="bg-teal-50 p-5 rounded-2xl border border-teal-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-4 font-medium">{t('tour.metodosPago')}:</p>
                  <div className="flex flex-wrap items-center gap-5">
                    {[
                      { src: 'https://woocommerce.com/wp-content/uploads/2021/05/tw-mercado-pago-v2@2x.png', alt: 'Mercado Pago', height: 'h-9' },
                      { src: 'https://images.freeimages.com/vme/images/7/1/715862/visa_logo_preview.jpg?h=350', alt: 'Visa', height: 'h-8' },
                      { src: 'https://images.freeimages.com/vme/images/9/9/99813/mastercard_logo_preview.jpg?h=350', alt: 'Mastercard', height: 'h-8' },
                      { src: 'https://logosenvector.com/logo/img/yape-bcp-4390.jpg', alt: 'Yape', height: 'h-8' },
                      { src: 'https://images.seeklogo.com/logo-png/38/1/plin-logo-png_seeklogo-386806.png', alt: 'Plin', height: 'h-8' },
                    ].map((img) => (
                      <motion.div
                        key={img.alt}
                        className="bg-white rounded-xl p-2.5 shadow-md border border-gray-100"
                        whileHover={{ scale: 1.06 }}
                      >
                        <img src={img.src} alt={img.alt} className={img.height} />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xs text-teal-700 mt-4 italic text-center font-medium">{t('tour.pagoCifrado')}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        <motion.div
          className="mt-8 text-sm text-gray-500 space-y-3 bg-white/80 p-5 rounded-2xl border border-teal-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p>{t('tour.notaPagoCompleto')}</p>
          <p>{t('tour.nota24Horas')}</p>
          <p>{t('tour.notaPrecios')}</p>
          <p>{t('tour.notaConfirmacion')}</p>
        </motion.div>
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-5 border-t border-teal-200 text-sm text-gray-600 flex flex-wrap justify-between gap-4">
        <div>
          <span className="font-semibold text-teal-700">{t('general.atencion')}:</span> +51 987 654 321
        </div>
        <div>
          <span className="font-semibold text-teal-700">{t('general.email')}:</span> reservas@tours-peru.com
        </div>
        <div>
          <span className="font-semibold text-teal-700">{t('general.horario')}:</span> {t('general.horarioDetalles')}
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
import { FaCalendarAlt, FaClock, FaUsers, FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaCalculator, FaUserFriends } from 'react-icons/fa';
import SelectorPasaje from './SelectorPasaje';

// Componente Cargador (mantener igual)
const Cargador = () => (
  <div className="flex justify-center items-center py-12">
    <motion.div
      className="relative w-20 h-20"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    >
      <div className="w-full h-full rounded-full border-4 border-teal-100 opacity-20"></div>
      <div className="w-full h-full rounded-full border-4 border-t-teal-500 border-transparent absolute top-0"></div>
    </motion.div>
  </div>
);

// 🔧 COMPONENTE SELECTOR PAQUETE MEJORADO CON DESGLOSE DETALLADO
const SelectorPaquete = ({
  paquete,
  cantidad,
  setCantidad,
}: {
  paquete: any;
  cantidad: number;
  setCantidad: (cantidad: number) => void;
}) => {
  const { t } = useTranslation();
  
  // 🆕 MOSTRAR DESGLOSE DE PASAJES EN EL PAQUETE
  const mostrarDesglosePasajes = () => {
    if (!paquete.desglose_pasajes) return null;
    
    return (
      <div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-200">
        <h5 className="text-xs font-semibold text-teal-800 mb-2">
          📋 Incluye por paquete:
        </h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {paquete.desglose_pasajes.map((item: any, index: number) => (
            <div key={index} className="flex justify-between">
              <span className="text-teal-700">{item.tipo}:</span>
              <span className="text-teal-800 font-medium">{item.cantidad}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <motion.div
      className={`p-6 bg-white border border-teal-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
        cantidad > 0 ? 'border-teal-400 shadow-teal-100 ring-2 ring-teal-200' : 'hover:border-teal-300'
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* 🆕 BADGE DE SELECCIONADO */}
      {cantidad > 0 && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center">
            <FaCheckCircle className="w-3 h-3 mr-1" />
            Seleccionado
          </div>
        </div>
      )}
      
      <div className="relative">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-bold text-teal-900 text-xl mb-2">{paquete.nombre}</h4>
            
            {/* 🆕 INFORMACIÓN DETALLADA DEL PAQUETE */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                <FaUsers className="w-3 h-3 mr-1" />
                {paquete.cantidad_total} {t('tour.pasajeros')}
              </span>
              <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                <FaCalculator className="w-3 h-3 mr-1" />
                ¡Oferta especial!
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              S/ {paquete.precio_total.toFixed(2)}
            </div>
            {/* 🆕 PRECIO COMPARATIVO */}
            <div className="text-xs text-gray-500 line-through">
              S/ {(paquete.precio_total * 1.15).toFixed(2)}
            </div>
            <div className="text-xs text-emerald-600 font-medium">
              Ahorro: S/ {(paquete.precio_total * 0.15).toFixed(2)}
            </div>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        {paquete.descripcion && (
          <div className="bg-gray-50 rounded-lg p-3 mt-3 border border-gray-200">
            <p className="text-sm text-gray-700 italic">{paquete.descripcion}</p>
          </div>
        )}
        
        {/* 🆕 DESGLOSE DE PASAJES */}
        {mostrarDesglosePasajes()}

        {/* SELECTOR DE CANTIDAD */}
        <div className="flex items-center justify-between mt-5">
          <span className="text-sm font-semibold text-teal-800 flex items-center">
            <FaUserFriends className="w-4 h-4 mr-2" />
            {t('tour.cantidad')} de paquetes:
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setCantidad(Math.max(0, cantidad - 1))}
              className="w-10 h-10 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-md border border-teal-300 transition-colors font-bold"
              aria-label={t('tour.reducirCantidad')}
            >
              -
            </button>
            <span className="w-14 text-center py-2 bg-teal-50 border border-teal-300 text-teal-900 font-bold rounded-md">
              {cantidad}
            </span>
            <button
              type="button"
              onClick={() => setCantidad(Math.min(5, cantidad + 1))} // Máximo 5 paquetes
              className="w-10 h-10 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-md border border-teal-300 transition-colors font-bold"
              aria-label={t('tour.aumentarCantidad')}
            >
              +
            </button>
          </div>
        </div>

        {/* SUBTOTAL ANIMADO CON DESGLOSE */}
        {cantidad > 0 && (
          <motion.div
            className="mt-4 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-white shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Subtotal del paquete:</span>
              <span className="text-xl font-bold">S/ {(paquete.precio_total * cantidad).toFixed(2)}</span>
            </div>
            <div className="text-sm opacity-90 border-t border-white/20 pt-2">
              <div className="flex justify-between">
                <span>Total de pasajeros:</span>
                <span className="font-medium">{paquete.cantidad_total * cantidad}</span>
              </div>
              <div className="flex justify-between">
                <span>Precio por persona:</span>
                <span className="font-medium">S/ {(paquete.precio_total / paquete.cantidad_total).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Componente Alerta (mantener igual)
const Alerta = ({ tipo, mensaje, onCerrar }: { tipo: string; mensaje: string; onCerrar?: () => void }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-8 p-5 rounded-2xl shadow-lg border-l-4 ${
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
          {tipo === 'error' && <FaExclamationTriangle className="h-6 w-6 mr-3 text-red-500" />}
          {tipo === 'warning' && <FaExclamationTriangle className="h-6 w-6 mr-3 text-yellow-500" />}
          {tipo === 'success' && <FaCheckCircle className="h-6 w-6 mr-3 text-green-500" />}
          {tipo === 'info' && <FaInfoCircle className="h-6 w-6 mr-3 text-teal-500" />}
          <span className="font-medium">{mensaje}</span>
        </div>
        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={t('general.cerrar')}
          >
            <FaTimes className="h-5 w-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Tipos
type SeleccionPasajes = Record<number, number>;
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

  const tiposPasajeArray = Array.isArray(tiposPasaje) ? tiposPasaje : [];
  const paquetesPasajesArray = Array.isArray(paquetesPasajes) ? paquetesPasajes : [];
  const instanciasTourArray = Array.isArray(instanciasTour) ? instanciasTour : [];

  const tiposPasajeDelTour = tiposPasajeArray.filter((tp) => tp.id_tipo_tour === tour.id);
  const paquetesPasajesDelTour = paquetesPasajesArray.filter((pp) => pp.id_tipo_tour === tour.id);

  const mostrarAlertaTemp = (mensaje: string, tipo: string = 'info') => {
    setAlerta({ mostrar: true, mensaje, tipo });
    setTimeout(() => setAlerta((prev) => ({ ...prev, mostrar: false })), 5000);
  };

  const instanciasDelTour = useMemo(() => {
    return instanciasTourArray.filter((inst) => {
      if (tour.id === 43) {
        return inst.nombre_tipo_tour?.includes('Ballenas');
      } else if (inst.nombre_tipo_tour) {
        return !inst.nombre_tipo_tour.includes('Ballenas');
      }
      return false;
    });
  }, [instanciasTourArray, tour.id]);

  // useEffects (mantener todos los existentes)
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
        setFecha('');
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
      const seleccionInicial: SeleccionPasajes = {};
      tiposPasajeDelTour.forEach((tipo, index) => {
        seleccionInicial[tipo.id_tipo_pasaje] = index === 0 ? 1 : 0;
      });
      setSeleccionPasajes(seleccionInicial);
      const paquetesIniciales: SeleccionPaquetes = {};
      paquetesPasajesDelTour.forEach((paquete) => {
        paquetesIniciales[paquete.id_paquete] = 0;
      });
      setSeleccionPaquetes(paquetesIniciales);
      seleccionInicializada.current = true;
    }
  }, [tiposPasajeDelTour, paquetesPasajesDelTour]);

  useEffect(() => {
    if (fecha) {
      dispatch(listarInstanciasTourPorFecha(fecha));
    }
  }, [dispatch, fecha]);

  const instanciasPorFechaSeleccionada = useMemo(() => {
    if (!fecha) return [];
    return instanciasDelTour.filter((inst) => {
      const fechaInstancia = inst.fecha_especifica.split('T')[0];
      return fechaInstancia === fecha;
    });
  }, [instanciasDelTour, fecha]);

  const fechasDisponibles = useMemo(() => {
    return [...new Set(instanciasDelTour.map((inst) => inst.fecha_especifica.split('T')[0]))];
  }, [instanciasDelTour]);

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
    const manana = new Date(ahora);
    manana.setDate(ahora.getDate() + 1);
    return manana;
  }, []);

  const fechaMaxima = useMemo(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 3);
    return fecha;
  }, []);

  // Handlers (mantener como están pero agregar logging mejorado)
  const handleFechaChange = (date: Date | null) => {
    if (!date) return;
    const nuevaFecha = date.toISOString().split('T')[0];
    const ahora = new Date();
    const diferenciaDias = Math.floor((date.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
    if (diferenciaDias < 1) {
      mostrarAlertaTemp(t('tour.reserva24Horas'), 'warning');
      return;
    }
    setFecha(nuevaFecha);
    setHorario('');
    setInstanciaSeleccionada(null);
  };

  const handleHorarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoHorario = e.target.value;
    setHorario(nuevoHorario);
    const idInstancia = e.target.options[e.target.selectedIndex].getAttribute('data-instancia-id');
    setInstanciaSeleccionada(idInstancia ? parseInt(idInstancia) : null);
    if (nuevoHorario && idInstancia) {
      setPasoActual(2);
    }
  };

  const handleCantidadPasajeChange = (idTipoPasaje: number, cantidad: number) => {
    console.log(`🔄 Cambiando pasaje individual ${idTipoPasaje} a cantidad: ${cantidad}`);
    setSeleccionPasajes((prev) => ({ ...prev, [idTipoPasaje]: cantidad }));
  };

  const handleCantidadPaqueteChange = (idPaquete: number, cantidad: number) => {
    console.log(`🔄 Cambiando paquete ${idPaquete} a cantidad: ${cantidad}`);
    const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === idPaquete);
    if (paquete) {
      console.log(`📦 Paquete "${paquete.nombre}" contiene ${paquete.cantidad_total} pasajeros por paquete`);
    }
    setSeleccionPaquetes((prev) => ({ ...prev, [idPaquete]: cantidad }));
  };

  // 🔧 FUNCIONES DE CÁLCULO CORREGIDAS
  const calcularTotalPasajeros = () => {
    // Pasajeros de pasajes individuales
    const pasajerosIndividuales = Object.values(seleccionPasajes).reduce((total, cantidad) => total + cantidad, 0);
    
    // Pasajeros de paquetes
    const pasajerosPaquetes = Object.entries(seleccionPaquetes).reduce((total, [idPaquete, cantidad]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(idPaquete));
      const pasajerosPorPaquete = paquete ? paquete.cantidad_total * cantidad : 0;
      
      console.log(`📊 Paquete ID ${idPaquete}: ${cantidad} paquetes × ${paquete?.cantidad_total || 0} pasajeros = ${pasajerosPorPaquete}`);
      
      return total + pasajerosPorPaquete;
    }, 0);
    
    const totalFinal = pasajerosIndividuales + pasajerosPaquetes;
    
    console.log(`🧮 CÁLCULO TOTAL DE PASAJEROS:`);
    console.log(`   - Pasajeros individuales: ${pasajerosIndividuales}`);
    console.log(`   - Pasajeros en paquetes: ${pasajerosPaquetes}`);
    console.log(`   - TOTAL FINAL: ${totalFinal}`);
    
    return totalFinal;
  };

  const calcularTotal = () => {
    // Total de pasajes individuales
    const totalPasajesIndividuales = Object.entries(seleccionPasajes).reduce((total, [idTipoPasaje, cantidad]) => {
      const tipoPasaje = tiposPasajeDelTour.find((t) => t.id_tipo_pasaje === Number(idTipoPasaje));
      const subtotal = tipoPasaje ? tipoPasaje.costo * cantidad : 0;
      
      console.log(`💰 Pasaje individual ${tipoPasaje?.nombre || idTipoPasaje}: ${cantidad} × S/${tipoPasaje?.costo || 0} = S/${subtotal}`);
      
      return total + subtotal;
    }, 0);

    // Total de paquetes
    const totalPaquetes = Object.entries(seleccionPaquetes).reduce((total, [idPaquete, cantidad]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(idPaquete));
      const subtotal = paquete ? paquete.precio_total * cantidad : 0;
      
      console.log(`💰 Paquete ${paquete?.nombre || idPaquete}: ${cantidad} × S/${paquete?.precio_total || 0} = S/${subtotal}`);
      
      return total + subtotal;
    }, 0);

    const totalFinal = totalPasajesIndividuales + totalPaquetes;
    
    console.log(`🧮 CÁLCULO TOTAL DE PRECIO:`);
    console.log(`   - Total pasajes individuales: S/${totalPasajesIndividuales.toFixed(2)}`);
    console.log(`   - Total paquetes: S/${totalPaquetes.toFixed(2)}`);
    console.log(`   - TOTAL FINAL: S/${totalFinal.toFixed(2)}`);
    
    return totalFinal;
  };

  // 🔧 FUNCIÓN DE VERIFICACIÓN DE CUPO MEJORADA
  const verificarCupoDisponible = () => {
    const totalPasajeros = calcularTotalPasajeros();
    const instancia = instanciasPorFechaSeleccionada.find((inst) => inst.id_instancia === instanciaSeleccionada);
    
    console.log(`🔍 VERIFICANDO CUPO:`);
    console.log(`   - Total pasajeros calculado: ${totalPasajeros}`);
    console.log(`   - Cupo disponible: ${instancia?.cupo_disponible || 'N/A'}`);
    
    if (instancia && totalPasajeros > instancia.cupo_disponible) {
      mostrarAlertaTemp(
        `❌ No hay suficiente cupo disponible. Disponible: ${instancia.cupo_disponible}, Solicitado: ${totalPasajeros}`,
        'error'
      );
      return false;
    }
    
    console.log(`✅ Verificación de cupo: APROBADA`);
    return true;
  };

  const haySeleccion =
    Object.values(seleccionPasajes).some((cantidad) => cantidad > 0) ||
    Object.values(seleccionPaquetes).some((cantidad) => cantidad > 0);

  // 🔧 FUNCIÓN IR A PAGO COMPLETAMENTE CORREGIDA
  const irAPago = () => {
    console.log(`🚀 INICIANDO PROCESO DE PAGO`);
    
    // Verificación de selección
    if (!haySeleccion) {
      console.log(`❌ No hay selección de pasajes ni paquetes`);
      mostrarAlertaTemp('Por favor selecciona al menos un pasaje o paquete', 'warning');
      return;
    }

    // Verificación de cupo
    if (!verificarCupoDisponible()) {
      console.log(`❌ Verificación de cupo falló`);
      return;
    }

    // 🔧 PREPARAR DATOS DETALLADOS DE PASAJES INDIVIDUALES
    const pasajesDetallados = Object.entries(seleccionPasajes)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([idTipoPasaje, cantidad]) => {
        const tipoPasaje = tiposPasajeDelTour.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
        return {
          idTipoPasaje: Number(idTipoPasaje),
          nombreTipo: tipoPasaje?.nombre || 'Desconocido',
          cantidad: cantidad,
          precioUnitario: tipoPasaje?.costo || 0,
          subtotal: (tipoPasaje?.costo || 0) * cantidad
        };
      });

    // 🔧 PREPARAR DATOS DETALLADOS DE PAQUETES
    const paquetesDetallados = Object.entries(seleccionPaquetes)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([idPaquete, cantidad]) => {
        const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === Number(idPaquete));
        return {
          idPaquetePasajes: Number(idPaquete),
          nombrePaquete: paquete?.nombre || 'Desconocido',
          cantidadPaquetes: cantidad,
          pasajerosPorPaquete: paquete?.cantidad_total || 0,
          totalPasajerosPaquete: (paquete?.cantidad_total || 0) * cantidad,
          precioUnitario: paquete?.precio_total || 0,
          subtotal: (paquete?.precio_total || 0) * cantidad,
          seleccionado: true
        };
      });

    // 🔧 CALCULAR TOTALES FINALES
    const totalPasajeros = calcularTotalPasajeros();
    const totalPrecio = calcularTotal();

    const datosReserva = {
      // Datos básicos del tour
      tourId: tour.id,
      tourNombre: tour.nombre,
      fecha,
      horario,
      instanciaId: instanciaSeleccionada,
      
      // 🔧 DATOS ORIGINALES PARA COMPATIBILIDAD
      seleccionPasajes,
      seleccionPaquetes,
      
      // 🔧 DATOS DETALLADOS PARA EL BACKEND
      pasajesDetallados,
      paquetesDetallados,
      
      // 🔧 DATOS ADICIONALES PARA COMPATIBILIDAD CON BACKEND
      cantidadesPasajes: pasajesDetallados.map(p => ({
        idTipoPasaje: p.idTipoPasaje,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario
      })),
      
      paquetes: paquetesDetallados.map(p => ({
        idPaquetePasajes: p.idPaquetePasajes,
        precio: p.precioUnitario,
        seleccionado: true
      })),
      
      // Totales calculados
      totalPasajeros,
      total: totalPrecio,
      
      // Timestamp para auditoría
      timestamp: new Date().toISOString(),
      
      // Información adicional para debugging
      debug: {
        pasajerosIndividuales: Object.values(seleccionPasajes).reduce((sum, cant) => sum + cant, 0),
        pasajerosPaquetes: paquetesDetallados.reduce((sum, p) => sum + p.totalPasajerosPaquete, 0),
        precioIndividuales: pasajesDetallados.reduce((sum, p) => sum + p.subtotal, 0),
        precioPaquetes: paquetesDetallados.reduce((sum, p) => sum + p.subtotal, 0)
      }
    };

    // 🔧 LOGGING DETALLADO
    console.log(`📊 DATOS DE RESERVA PREPARADOS:`);
    console.log(`📋 Datos básicos:`, {
      tourId: datosReserva.tourId,
      tourNombre: datosReserva.tourNombre,
      fecha: datosReserva.fecha,
      horario: datosReserva.horario,
      instanciaId: datosReserva.instanciaId
    });
    
    console.log(`👥 Pasajes individuales (${pasajesDetallados.length}):`, pasajesDetallados);
    console.log(`📦 Paquetes (${paquetesDetallados.length}):`, paquetesDetallados);
    
    console.log(`🧮 Totales calculados:`);
    console.log(`   - Total pasajeros: ${datosReserva.totalPasajeros}`);
    console.log(`   - Total precio: S/${datosReserva.total.toFixed(2)}`);
    
    console.log(`🔧 Debug info:`, datosReserva.debug);
    
    console.log(`📤 DATOS COMPLETOS ENVIADOS AL PAGO:`, datosReserva);

    // Guardar en sessionStorage y navegar
    sessionStorage.setItem('datosReservaPendiente', JSON.stringify(datosReserva));
    navigate('/proceso-pago', { state: datosReserva });
  };

  // 🆕 COMPONENTE DE RESUMEN DETALLADO
  const ResumenDetallado = () => {
    const pasajerosIndividuales = Object.values(seleccionPasajes).reduce((total, cantidad) => total + cantidad, 0);
    const pasajerosPaquetes = Object.entries(seleccionPaquetes).reduce((total, [idPaquete, cantidad]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(idPaquete));
      return total + (paquete ? paquete.cantidad_total * cantidad : 0);
    }, 0);
    
    const precioIndividuales = Object.entries(seleccionPasajes).reduce((total, [idTipoPasaje, cantidad]) => {
      const tipoPasaje = tiposPasajeDelTour.find((t) => t.id_tipo_pasaje === Number(idTipoPasaje));
      return total + (tipoPasaje ? tipoPasaje.costo * cantidad : 0);
    }, 0);
    
    const precioPaquetes = Object.entries(seleccionPaquetes).reduce((total, [idPaquete, cantidad]) => {
      const paquete = paquetesPasajesDelTour.find((p) => p.id_paquete === Number(idPaquete));
      return total + (paquete ? paquete.precio_total * cantidad : 0);
    }, 0);

    return (
      <motion.div
        className="p-5 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl border border-teal-200 mt-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h5 className="font-bold text-teal-900 mb-4 flex items-center">
          <FaCalculator className="w-5 h-5 mr-2" />
          Resumen detallado de la reserva
        </h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* PASAJEROS */}
          <div className="bg-white p-3 rounded-lg border border-teal-100">
            <h6 className="font-semibold text-teal-800 mb-2 text-sm">👥 Pasajeros</h6>
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
                <span className="font-bold text-teal-900">{calcularTotalPasajeros()}</span>
              </div>
            </div>
          </div>
          
          {/* PRECIOS */}
          <div className="bg-white p-3 rounded-lg border border-teal-100">
            <h6 className="font-semibold text-teal-800 mb-2 text-sm">💰 Precios</h6>
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
                <span className="font-bold text-teal-900">S/ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* DESGLOSE DETALLADO */}
        <div className="bg-white p-3 rounded-lg border border-teal-100">
          <h6 className="font-semibold text-teal-800 mb-2 text-sm">📋 Desglose</h6>
          <div className="space-y-1 text-xs">
            {/* Pasajes individuales */}
            {Object.entries(seleccionPasajes).filter(([_, cantidad]) => cantidad > 0).map(([idTipoPasaje, cantidad]) => {
              const tipoPasaje = tiposPasajeDelTour.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
              return (
                <div key={idTipoPasaje} className="flex justify-between">
                  <span className="text-gray-600">{tipoPasaje?.nombre} ({cantidad}):</span>
                  <span className="text-teal-800">S/ {((tipoPasaje?.costo || 0) * cantidad).toFixed(2)}</span>
                </div>
              );
            })}
            
            {/* Paquetes */}
            {Object.entries(seleccionPaquetes).filter(([_, cantidad]) => cantidad > 0).map(([idPaquete, cantidad]) => {
              const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === Number(idPaquete));
              return (
                <div key={idPaquete} className="flex justify-between">
                  <span className="text-gray-600">{paquete?.nombre} ({cantidad}):</span>
                  <span className="text-teal-800">S/ {((paquete?.precio_total || 0) * cantidad).toFixed(2)}</span>
                </div>
              );
            })}
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
        className="bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-8 text-white">
          <h3 className="text-3xl font-extrabold tracking-tight">{t('tour.cargandoReserva')}</h3>
        </div>
        <div className="p-10">
          <div className="flex flex-col items-center justify-center h-72">
            <Cargador />
            <p className="mt-6 text-teal-700 text-lg font-medium">{t('general.cargando')}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* HEADER - mantener igual */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-8 text-white">
        <h3 className="text-3xl font-extrabold tracking-tight flex items-center">
          <FaUsers className="h-7 w-7 mr-3" />
          {t('tour.reservarAhora')} - {tour.nombre}
        </h3>
        {tiposPasajeDelTour.length > 0 && (
          <div className="flex items-center mt-3">
            <span className="text-4xl font-bold">S/ {tiposPasajeDelTour[0].costo.toFixed(2)}</span>
            <span className="text-sm opacity-80 ml-3">{t('tour.porPersona')}</span>
          </div>
        )}
      </div>

      {/* PASOS - mantener igual */}
      <div className="bg-gradient-to-b from-teal-50 to-cyan-50 border-b border-teal-200 p-6">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <motion.div
            className={`flex flex-col items-center ${pasoActual >= 1 ? 'text-teal-700' : 'text-gray-400'}`}
            animate={{ scale: pasoActual === 1 ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div
              className={`rounded-full h-12 w-12 flex items-center justify-center mb-2 ${
                pasoActual >= 1 ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 'bg-gray-200 text-gray-500'
              }`}
            >
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold">{t('tour.fechaYHora')}</span>
          </motion.div>
          <div className={`flex-1 h-1.5 mx-4 ${pasoActual >= 2 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
          <motion.div
            className={`flex flex-col items-center ${pasoActual >= 2 ? 'text-teal-700' : 'text-gray-400'}`}
            animate={{ scale: pasoActual === 2 ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div
              className={`rounded-full h-12 w-12 flex items-center justify-center mb-2 ${
                pasoActual >= 2 ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 'bg-gray-200 text-gray-500'
              }`}
            >
              <FaUsers className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold">{t('tour.pasajeros')}</span>
          </motion.div>
        </div>
      </div>

      {/* CUERPO */}
      <div className="p-8 bg-gradient-to-b from-white to-teal-50">
        <AnimatePresence>
          {alerta.mostrar && (
            <Alerta
              tipo={alerta.tipo}
              mensaje={alerta.mensaje}
              onCerrar={() => setAlerta((prev) => ({ ...prev, mostrar: false }))}
            />
          )}
        </AnimatePresence>

        {/* AVISO 24 HORAS */}
        <motion.div
          className="mb-8 bg-teal-50 border-l-4 border-teal-500 rounded-2xl p-5 text-teal-900 text-sm flex items-start shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FaInfoCircle className="h-6 w-6 mr-3 text-teal-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{t('general.importante')}:</span> {t('tour.reserva24Horas')} {t('tour.pagoCompleto')}
          </div>
        </motion.div>

        <div className="space-y-10">
          {/* PASO 1: FECHA Y HORA - mantener igual */}
          {pasoActual === 1 && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-2xl font-bold text-teal-900 border-b border-teal-200 pb-3">{t('tour.seleccionaFechaHorario')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="fecha" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('tour.fecha')} <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={fecha ? new Date(fecha) : null}
                    onChange={handleFechaChange}
                    minDate={fechaMinima}
                    maxDate={fechaMaxima}
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-4 py-3 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 bg-white shadow-md transition-all duration-300"
                    placeholderText={t('tour.seleccionarFecha')}
                    required
                    aria-required="true"
                  />
                  {cargandoInstancias ? (
                    <p className="text-xs text-teal-600 mt-2 font-medium">{t('tour.cargandoFechas')}</p>
                  ) : fechasDisponibles.length > 0 ? (
                    <p className="text-xs text-teal-600 mt-2 font-medium">
                      {t('tour.hayFechasDisponibles')}: {fechasDisponibles.slice(0, 3).join(', ')}
                      {fechasDisponibles.length > 3 ? ` ${t('tour.yMas', { count: fechasDisponibles.length - 3 })}` : ''}
                    </p>
                  ) : (
                    <p className="text-xs text-amber-600 mt-2 font-medium">{t('tour.sinFechasDisponibles')}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="horario" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('tour.horario')} <span className="text-red-500">*</span>
                  </label>
                  {fecha ? (
                    opcionesHorario.length > 0 ? (
                      <select
                        id="horario"
                        value={horario}
                        onChange={handleHorarioChange}
                        required
                        className="w-full px-4 py-3 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 bg-white shadow-md transition-all duration-300"
                        aria-required="true"
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
                            {opcion.cupoDisponible <= 0
                              ? `(${t('tour.sinCupo')})`
                              : `(${t('tour.disponible')}: ${opcion.cupoDisponible})`}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="bg-amber-50 p-4 rounded-xl text-amber-900 text-sm border border-amber-200 shadow-sm">
                        {t('tour.sinHorariosDisponiblesParaFecha')}
                      </div>
                    )
                  ) : (
                    <select
                      id="horario"
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm"
                    >
                      <option value="">{t('tour.seleccionePrimeroFecha')}</option>
                    </select>
                  )}
                </div>
              </div>
              {fecha && horario && (
                <div className="mt-8 flex justify-end">
                  <motion.button
                    type="button"
                    onClick={() => setPasoActual(2)}
                    className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('general.continuar')}
                    <FaCheckCircle className="h-5 w-5 ml-2" />
                  </motion.button>
                </div>
              )}
              {fecha && horario && (
                <motion.div
                  className="mt-6 p-5 bg-teal-50 rounded-2xl border border-teal-200 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h5 className="font-bold text-teal-900 mb-3">{t('tour.seleccionActual')}:</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-teal-700 font-semibold">{t('tour.fecha')}:</span>
                      <span className="ml-2 text-teal-900">{formatearFecha(fecha)}</span>
                    </div>
                    <div>
                      <span className="text-teal-700 font-semibold">{t('tour.horario')}:</span>
                      <span className="ml-2 text-teal-900">{horario}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PASO 2: PASAJEROS MEJORADO */}
          {pasoActual === 2 && (
            <motion.div
              className="space-y-10"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-2xl font-bold text-teal-900 border-b border-teal-200 pb-3">{t('tour.seleccionaPasajes')}</h4>
              
              {/* PAQUETES */}
              {paquetesPasajesDelTour.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-5">
                    <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <FaUsers className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-teal-900">{t('tour.paquetesPromocion')}</h4>
                      <p className="text-sm text-teal-600">💰 ¡Ahorra comprando paquetes completos!</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paquetesPasajesDelTour.map((paquete) => (
                      <SelectorPaquete
                        key={paquete.id_paquete}
                        paquete={paquete}
                        cantidad={seleccionPaquetes[paquete.id_paquete] || 0}
                        setCantidad={(cantidad) => handleCantidadPaqueteChange(paquete.id_paquete, cantidad)}
                      />
                    ))}
                  </div>
                  <div className="text-center text-sm text-teal-700 my-6">
                    <span className="inline-block px-5 py-2 bg-teal-50 rounded-full border border-teal-200 shadow-sm font-semibold">
                      ➕ {t('tour.combinar')}
                    </span>
                  </div>
                </div>
              )}
              
              {/* PASAJES INDIVIDUALES */}
              <div className="space-y-6">
                <div className="flex items-center mb-5">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <FaUserFriends className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-teal-900">{t('tour.pasajesIndividuales')}</h4>
                    <p className="text-sm text-teal-600">👤 Personaliza tu selección por tipo de pasajero</p>
                  </div>
                </div>
                {tiposPasajeDelTour.length > 0 ? (
                  <div className="space-y-4">
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
                        colorScheme="teal"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-teal-50 p-5 rounded-2xl text-center text-teal-800 border border-teal-200 shadow-sm">
                    {t('tour.noHayTiposPasajeDisponibles')}
                  </div>
                )}
              </div>
              
              {/* RESUMEN DETALLADO */}
              <ResumenDetallado />
              
              {/* BOTONES */}
              <div className="flex justify-between mt-8">
                <motion.button
                  type="button"
                  onClick={() => setPasoActual(1)}
                  className="px-6 py-3 border border-teal-300 text-teal-700 font-bold rounded-xl transition-all hover:bg-teal-50 shadow-md flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes className="h-5 w-5 mr-2" />
                  {t('general.volver')}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={irAPago}
                  disabled={!haySeleccion || cargando}
                  className={`px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center ${
                    !haySeleccion || cargando ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: !haySeleccion || cargando ? 1 : 1.05 }}
                  whileTap={{ scale: !haySeleccion || cargando ? 1 : 0.95 }}
                >
                  {cargando ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t('general.procesando')}
                    </>
                  ) : (
                    <>
                      {t('tour.continuarPago')}
                      <FaCreditCard className="h-5 w-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </div>
              
              {/* MÉTODOS DE PAGO - mantener igual pero mejorado */}
              <motion.div
                className="mt-8 pt-5 border-t border-teal-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center mb-5">
                  <FaCreditCard className="h-7 w-7 text-teal-600 mr-3" />
                  <h5 className="font-bold text-teal-800 text-lg">{t('tour.pagoSeguro')}</h5>
                </div>
                <div className="bg-teal-50 p-5 rounded-2xl border border-teal-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-4 font-medium">{t('tour.metodosPago')}:</p>
                  <div className="flex flex-wrap items-center gap-5">
                    {[
                      { 
                        src: 'https://woocommerce.com/wp-content/uploads/2021/05/tw-mercado-pago-v2@2x.png', 
                        alt: 'Mercado Pago', 
                        height: 'h-9',
                        badge: '🔒 Seguro'
                      },
                      { 
                        src: 'https://images.freeimages.com/vme/images/7/1/715862/visa_logo_preview.jpg?h=350', 
                        alt: 'Visa', 
                        height: 'h-8',
                        badge: '💳 Aceptado'
                      },
                      { 
                        src: 'https://images.freeimages.com/vme/images/9/9/99813/mastercard_logo_preview.jpg?h=350', 
                        alt: 'Mastercard', 
                        height: 'h-8',
                        badge: '💳 Aceptado'
                      },
                      { 
                        src: 'https://logosenvector.com/logo/img/yape-bcp-4390.jpg', 
                        alt: 'Yape', 
                        height: 'h-8',
                        badge: '📱 Móvil'
                      },
                      { 
                        src: 'https://images.seeklogo.com/logo-png/38/1/plin-logo-png_seeklogo-386806.png', 
                        alt: 'Plin', 
                        height: 'h-8',
                        badge: '📱 Móvil'
                      },
                    ].map((img, index) => (
                      <motion.div
                        key={img.alt}
                        className="relative bg-white rounded-xl p-3 shadow-md border border-gray-100 group hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.06, y: -2 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <img src={img.src} alt={img.alt} className={`${img.height} object-contain`} />
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                            {img.badge}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* 🆕 CARACTERÍSTICAS DE SEGURIDAD */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { icon: '🔐', text: 'Encriptación SSL 256-bit' },
                      { icon: '🛡️', text: 'Protección antifraude' },
                      { icon: '⚡', text: 'Procesamiento inmediato' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                        <span className="text-lg mr-2">{feature.icon}</span>
                        <span className="text-xs text-gray-600 font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-teal-700 mt-4 italic text-center font-medium">
                    🔒 {t('tour.pagoCifrado')} | ✅ Certificado PCI DSS
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* 🆕 NOTAS LEGALES MEJORADAS */}
        <motion.div
          className="mt-8 text-sm text-gray-500 space-y-3 bg-gradient-to-r from-white via-gray-50 to-white p-6 rounded-2xl border border-teal-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start mb-4">
            <FaInfoCircle className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h6 className="font-semibold text-gray-700 mb-3">📋 Términos y condiciones importantes:</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    <span>{t('tour.notaPagoCompleto')}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    <span>{t('tour.nota24Horas')}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    <span>{t('tour.notaPrecios')}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    <span>{t('tour.notaConfirmacion')}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 🆕 FOOTER MEJORADO CON INFORMACIÓN DE CONTACTO */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 border-t border-teal-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="flex items-center justify-center sm:justify-start">
            <div className="bg-teal-100 p-2 rounded-full mr-3">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-teal-700">{t('general.atencion')}:</span>
              <br />
              <span className="text-teal-800 font-medium">+51 987 654 321</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center sm:justify-start">
            <div className="bg-teal-100 p-2 rounded-full mr-3">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-teal-700">{t('general.email')}:</span>
              <br />
              <span className="text-teal-800 font-medium">reservas@tours-peru.com</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center sm:justify-start">
            <div className="bg-teal-100 p-2 rounded-full mr-3">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-teal-700">{t('general.horario')}:</span>
              <br />
              <span className="text-teal-800 font-medium">Lun-Vie 9am-6pm</span>
            </div>
          </div>
        </div>
        
        {/* 🆕 CERTIFICACIONES DE SEGURIDAD */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-6 pt-4 border-t border-teal-200">
          <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
            SSL Seguro
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
            MercadoPago Certificado
          </div>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
            PCI DSS Compliant
          </div>
          <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
            Turismo Autorizado
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FormularioReservacion;