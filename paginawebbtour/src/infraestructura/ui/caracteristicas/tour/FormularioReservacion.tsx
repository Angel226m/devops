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
  <div className="flex justify-center items-center py-8">
    <motion.div
      className="relative w-16 h-16"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    >
      <div className="w-full h-full rounded-full border-4 border-teal-100"></div>
      <div className="w-full h-full rounded-full border-4 border-t-transparent border-teal-500 absolute top-0"></div>
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
      className={`p-5 bg-gradient-to-br from-teal-50 to-white border rounded-xl shadow-md transition-all duration-300 ${
        cantidad > 0 ? 'border-teal-400 shadow-lg' : 'border-cyan-200 hover:border-teal-300 hover:shadow-md'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-teal-800 text-lg">{paquete.nombre}</h4>
          <span className="inline-block mt-1 bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium">
            {paquete.cantidad_total} {t('tour.pasajeros')}
          </span>
        </div>
        <div className="font-bold text-teal-600 text-xl">S/ {paquete.precio_total.toFixed(2)}</div>
      </div>
      {paquete.descripcion && (
        <p className="text-sm text-gray-600 mt-2">{paquete.descripcion}</p>
      )}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm font-medium text-teal-700">{t('tour.cantidad')}:</span>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setCantidad(Math.max(0, cantidad - 1))}
            className="w-9 h-9 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-l-md border border-teal-300 transition-colors"
            aria-label={t('tour.reducirCantidad')}
          >
            -
          </button>
          <span className="w-12 text-center py-2 bg-white border-t border-b border-teal-300 text-teal-800 font-medium">
            {cantidad}
          </span>
          <button
            type="button"
            onClick={() => setCantidad(Math.min(10, cantidad + 1))}
            className="w-9 h-9 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-r-md border border-teal-300 transition-colors"
            aria-label={t('tour.aumentarCantidad')}
          >
            +
          </button>
        </div>
      </div>
      {cantidad > 0 && (
        <motion.div
          className="mt-3 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="bg-teal-100 text-teal-800 font-medium px-3 py-1 rounded-full">
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
      className={`mb-6 p-4 rounded-lg shadow-md ${
        tipo === 'error'
          ? 'bg-red-50 text-red-800 border-l-4 border-red-500'
          : tipo === 'warning'
          ? 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500'
          : tipo === 'success'
          ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
          : 'bg-teal-50 text-teal-800 border-l-4 border-teal-500'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {tipo === 'error' && <FaExclamationTriangle className="h-5 w-5 mr-2 text-red-500" />}
          {tipo === 'warning' && <FaExclamationTriangle className="h-5 w-5 mr-2 text-yellow-500" />}
          {tipo === 'success' && <FaCheckCircle className="h-5 w-5 mr-2 text-green-500" />}
          {tipo === 'info' && <FaInfoCircle className="h-5 w-5 mr-2 text-teal-500" />}
          <span>{mensaje}</span>
        </div>
        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            className="text-gray-500 hover:text-gray-700"
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
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-teal-200 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-6 text-white">
          <h3 className="text-2xl font-bold">{t('tour.cargandoReserva')}</h3>
        </div>
        <div className="p-8">
          <div className="flex flex-col items-center justify-center h-64">
            <Cargador />
            <p className="mt-4 text-teal-600 text-lg">{t('general.cargando')}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-teal-200 overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Encabezado *//*}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-6 text-white">
        <h3 className="text-2xl font-bold flex items-center">
          <FaUsers className="h-6 w-6 mr-2" />
          {t('tour.reservarAhora')} - {tour.nombre}
        </h3>
        {tiposPasajeDelTour.length > 0 && (
          <div className="flex items-center mt-2">
            <span className="text-3xl font-bold">S/ {tiposPasajeDelTour[0].costo.toFixed(2)}</span>
            <span className="text-sm opacity-90 ml-2">{t('tour.porPersona')}</span>
          </div>
        )}
      </div>

      {/* Pasos *//*}
      <div className="bg-gradient-to-b from-teal-50 to-cyan-50 border-b border-teal-200 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <motion.div
            className={`flex flex-col items-center ${pasoActual >= 1 ? 'text-teal-600' : 'text-gray-400'}`}
            animate={{ scale: pasoActual === 1 ? 1.1 : 1 }}
          >
            <div
              className={`rounded-full h-10 w-10 flex items-center justify-center mb-1 ${
                pasoActual >= 1 ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 'bg-gray-200 text-gray-500'
              }`}
            >
              <FaCalendarAlt className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">{t('tour.fechaYHora')}</span>
          </motion.div>
          <div className={`flex-1 h-1 mx-2 ${pasoActual >= 2 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
          <motion.div
            className={`flex flex-col items-center ${pasoActual >= 2 ? 'text-teal-600' : 'text-gray-400'}`}
            animate={{ scale: pasoActual === 2 ? 1.1 : 1 }}
          >
            <div
              className={`rounded-full h-10 w-10 flex items-center justify-center mb-1 ${
                pasoActual >= 2 ? 'bg-teal-100 text-teal-600 border-2 border-teal-500' : 'bg-gray-200 text-gray-500'
              }`}
            >
              <FaUsers className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">{t('tour.pasajeros')}</span>
          </motion.div>
        </div>
      </div>

      {/* Cuerpo *//*}
      <div className="p-6 bg-gradient-to-b from-white to-teal-50">
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
          className="mb-6 bg-teal-50 border-l-4 border-teal-500 rounded-lg p-4 text-teal-800 text-sm flex items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaInfoCircle className="h-5 w-5 mr-2 text-teal-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-medium">{t('general.importante')}:</span> {t('tour.reserva24Horas')} {t('tour.pagoCompleto')}
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* PASO 1: Fecha y Hora *//*}
          {pasoActual === 1 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-xl font-semibold text-teal-800 border-b border-teal-200 pb-2">{t('tour.seleccionaFechaHorario')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tour.fecha')} <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={fecha ? new Date(fecha) : null}
                    onChange={handleFechaChange}
                    minDate={fechaMinima}
                    maxDate={fechaMaxima}
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-4 py-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 bg-white shadow-sm transition-colors"
                    placeholderText={t('tour.seleccionarFecha')}
                    required
                    aria-required="true"
                  />
                  {cargandoInstancias ? (
                    <p className="text-xs text-teal-500 mt-2">{t('tour.cargandoFechas')}</p>
                  ) : fechasDisponibles.length > 0 ? (
                    <p className="text-xs text-teal-500 mt-2">
                      {t('tour.hayFechasDisponibles')}: {fechasDisponibles.slice(0, 3).join(', ')}
                      {fechasDisponibles.length > 3 ? ` ${t('tour.yMas', { count: fechasDisponibles.length - 3 })}` : ''}
                    </p>
                  ) : (
                    <p className="text-xs text-amber-500 mt-2">{t('tour.sinFechasDisponibles')}</p>
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
                        className="w-full px-4 py-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 bg-white shadow-sm transition-colors"
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
                      <div className="bg-amber-50 p-4 rounded-lg text-amber-800 text-sm border border-amber-200">
                        {t('tour.sinHorariosDisponiblesParaFecha')}
                      </div>
                    )
                  ) : (
                    <select
                      id="horario"
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm"
                    >
                      <option value="">{t('tour.seleccionePrimeroFecha')}</option>
                    </select>
                  )}
                </div>
              </div>
              {fecha && horario && (
                <div className="mt-6 flex justify-end">
                  <motion.button
                    type="button"
                    onClick={() => setPasoActual(2)}
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center"
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
                  className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h5 className="font-semibold text-teal-800 mb-2">{t('tour.seleccionActual')}:</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-teal-600">{t('tour.fecha')}:</span>
                      <span className="ml-2 text-teal-800">{formatearFecha(fecha)}</span>
                    </div>
                    <div>
                      <span className="text-teal-600">{t('tour.horario')}:</span>
                      <span className="ml-2 text-teal-800">{horario}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PASO 2: Pasajeros *//*}
          {pasoActual === 2 && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-xl font-semibold text-teal-800 border-b border-teal-200 pb-2">{t('tour.seleccionaPasajes')}</h4>
              {paquetesPasajesDelTour.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full flex items-center justify-center mr-2 shadow-md">
                      <FaUsers className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-semibold text-teal-800">{t('tour.paquetesPromocion')}</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paquetesPasajesDelTour.map((paquete) => (
                      <SelectorPaquete
                        key={paquete.id_paquete}
                        paquete={paquete}
                        cantidad={seleccionPaquetes[paquete.id_paquete] || 0}
                        setCantidad={(cantidad) => handleCantidadPaqueteChange(paquete.id_paquete, cantidad)}
                      />
                    ))}
                  </div>
                  <div className="text-center text-sm text-teal-600 my-4">
                    <span className="inline-block px-4 py-1 bg-teal-50 rounded-full border border-teal-200">
                      {t('tour.combinar')}
                    </span>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full flex items-center justify-center mr-2 shadow-md">
                    <FaUsers className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-teal-800">{t('tour.pasajesIndividuales')}</h4>
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
                        colorScheme="teal"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-teal-50 p-4 rounded-lg text-center text-teal-700 border border-teal-200">
                    {t('tour.noHayTiposPasajeDisponibles')}
                  </div>
                )}
              </div>
              <motion.div
                className="p-4 bg-teal-50 rounded-lg border border-teal-200 mt-4 shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between text-sm font-medium">
                  <span>{t('tour.totalPasajeros')}:</span>
                  <span className="text-teal-700">{calcularTotalPasajeros()}</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-teal-200">
                  <span>{t('tour.totalPagar')}:</span>
                  <span className="text-teal-600">S/ {calcularTotal().toFixed(2)}</span>
                </div>
              </motion.div>
              <div className="flex justify-between mt-6">
                <motion.button
                  type="button"
                  onClick={() => setPasoActual(1)}
                  className="px-5 py-3 border border-teal-300 text-teal-700 font-semibold rounded-lg transition-colors hover:bg-teal-50 flex items-center"
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
                  className={`px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center ${
                    !haySeleccion || cargando ? 'opacity-70 cursor-not-allowed' : ''
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
                className="mt-6 pt-4 border-t border-teal-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <FaCreditCard className="h-6 w-6 text-teal-600 mr-2" />
                  <h5 className="font-semibold text-teal-700">{t('tour.pagoSeguro')}</h5>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <p className="text-sm text-gray-600 mb-3">{t('tour.metodosPago')}:</p>
                  <div className="flex flex-wrap items-center gap-4">
                    {[
                      { src: 'https://woocommerce.com/wp-content/uploads/2021/05/tw-mercado-pago-v2@2x.png', alt: 'Mercado Pago', height: 'h-8' },
                      { src: 'https://images.freeimages.com/vme/images/7/1/715862/visa_logo_preview.jpg?h=350', alt: 'Visa', height: 'h-7' },
                      { src: 'https://images.freeimages.com/vme/images/9/9/99813/mastercard_logo_preview.jpg?h=350', alt: 'Mastercard', height: 'h-7' },
                      { src: 'https://logosenvector.com/logo/img/yape-bcp-4390.jpg', alt: 'Yape', height: 'h-7' },
                      { src: 'https://images.seeklogo.com/logo-png/38/1/plin-logo-png_seeklogo-386806.png', alt: 'Plin', height: 'h-7' },
                    ].map((img) => (
                      <motion.div
                        key={img.alt}
                        className="bg-white rounded-lg p-2 shadow-sm border border-gray-200"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img src={img.src} alt={img.alt} className={img.height} />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xs text-teal-700 mt-3 italic text-center">{t('tour.pagoCifrado')}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        <motion.div
          className="mt-6 text-xs text-gray-500 space-y-2 bg-white/70 p-4 rounded-lg border border-teal-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p>{t('tour.notaPagoCompleto')}</p>
          <p>{t('tour.nota24Horas')}</p>
          <p>{t('tour.notaPrecios')}</p>
          <p>{t('tour.notaConfirmacion')}</p>
        </motion.div>
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 border-t border-teal-200 text-xs text-gray-600 flex flex-wrap justify-between">
        <div>
          <span className="font-medium text-teal-700">{t('general.atencion')}:</span> +51 987 654 321
        </div>
        <div>
          <span className="font-medium text-teal-700">{t('general.email')}:</span> reservas@tours-peru.com
        </div>
        <div>
          <span className="font-medium text-teal-700">{t('general.horario')}:</span> {t('general.horarioDetalles')}
        </div>
      </div>
    </motion.div>
  );
};

export default FormularioReservacion;
 */
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
      {/* Encabezado */}
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

      {/* Pasos */}
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

      {/* Cuerpo */}
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

        {/* Aviso de 24 horas */}
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
          {/* PASO 1: Fecha y Hora */}
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

          {/* PASO 2: Pasajeros */}
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

export default FormularioReservacion;