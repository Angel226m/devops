 /*
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { listarTiposPasajePorTipoTour } from '../../../store/slices/sliceTipoPasaje';
import { listarPaquetesPasajesPorTipoTour } from '../../../store/slices/slicePaquetePasajes';
import SelectorPasaje from './SelectorPasaje';
import Cargador from '../../componentes/comunes/Cargador';

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
  const [fecha, setFecha] = useState('');
  const [horario, setHorario] = useState('');
  const [seleccionPasajes, setSeleccionPasajes] = useState<{ [key: number]: number }>({});
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  
  // Obtener tipos de pasajes y paquetes desde Redux
  const { tiposPasaje, cargando: cargandoTiposPasaje } = useSelector(
    (state: RootState) => state.tipoPasaje
  );
  
  const { paquetesPasajes, cargando: cargandoPaquetes } = useSelector(
    (state: RootState) => state.paquetePasajes
  );
  
  // Verificar si tiposPasaje y paquetesPasajes son arrays
  const tiposPasajeArray = Array.isArray(tiposPasaje) ? tiposPasaje : [];
  const paquetesPasajesArray = Array.isArray(paquetesPasajes) ? paquetesPasajes : [];
  
  // Cargar tipos de pasajes y paquetes al montar el componente
  useEffect(() => {
    if (tour.id) {
      console.log("Cargando tipos de pasaje y paquetes para el tour:", tour.id);
      dispatch(listarTiposPasajePorTipoTour(tour.id));
      dispatch(listarPaquetesPasajesPorTipoTour(tour.id));
    }
  }, [dispatch, tour.id]);
  
  // Inicializar selección de pasajes cuando se cargan los tipos
  useEffect(() => {
    if (tiposPasajeArray.length > 0) {
      console.log("Inicializando selección de pasajes con:", tiposPasajeArray);
      // Inicializar con 1 para el primer tipo (adulto generalmente) y 0 para el resto
      const seleccionInicial = tiposPasajeArray.reduce((acc, tipo, index) => {
        acc[tipo.id_tipo_pasaje] = index === 0 ? 1 : 0;
        return acc;
      }, {} as { [key: number]: number });
      
      setSeleccionPasajes(seleccionInicial);
    }
  }, [tiposPasajeArray]);
  
  // Manejar cambio en la cantidad de un tipo de pasaje
  const handleCantidadPasajeChange = (idTipoPasaje: number, cantidad: number) => {
    // Si se está usando un paquete, resetear selección de paquete
    if (paqueteSeleccionado !== null) {
      setPaqueteSeleccionado(null);
    }
    
    setSeleccionPasajes(prev => ({
      ...prev,
      [idTipoPasaje]: cantidad
    }));
  };
  
  // Manejar selección de paquete
  const handleSeleccionPaquete = (idPaquete: number) => {
    if (paqueteSeleccionado === idPaquete) {
      // Deseleccionar el paquete actual
      setPaqueteSeleccionado(null);
    } else {
      // Seleccionar nuevo paquete y actualizar cantidades según el paquete
      setPaqueteSeleccionado(idPaquete);
      
      // Aquí deberíamos actualizar las cantidades según el paquete seleccionado
      // Como no tenemos detalle de qué pasajes incluye cada paquete, lo dejamos simple
      const paquete = paquetesPasajesArray.find(p => p.id_paquete === idPaquete);
      if (paquete) {
        // Distribuir la cantidad total entre los tipos de pasaje disponibles
        // En un caso real, esto vendría de una relación entre paquete y tipos de pasaje
        const cantidadPorTipo = Math.floor(paquete.cantidad_total / tiposPasajeArray.length);
        const nuevaSeleccion = tiposPasajeArray.reduce((acc, tipo) => {
          acc[tipo.id_tipo_pasaje] = cantidadPorTipo;
          return acc;
        }, {} as { [key: number]: number });
        
        // Añadir el restante al primer tipo de pasaje
        const restante = paquete.cantidad_total - (cantidadPorTipo * tiposPasajeArray.length);
        if (restante > 0 && tiposPasajeArray.length > 0) {
          nuevaSeleccion[tiposPasajeArray[0].id_tipo_pasaje] += restante;
        }
        
        setSeleccionPasajes(nuevaSeleccion);
      }
    }
  };
  
  // Calcular total basado en pasajes seleccionados o paquete
  const calcularTotal = () => {
    if (paqueteSeleccionado !== null) {
      const paquete = paquetesPasajesArray.find(p => p.id_paquete === paqueteSeleccionado);
      return paquete ? paquete.precio_total : 0;
    } else {
      return Object.entries(seleccionPasajes).reduce((total, [idTipoPasaje, cantidad]) => {
        const tipoPasaje = tiposPasajeArray.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
        return total + (tipoPasaje ? tipoPasaje.costo * cantidad : 0);
      }, 0);
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    // Simular envío (en producción aquí iría la llamada a la API)
    setTimeout(() => {
      setCargando(false);
      alert(t('tour.reservaExitosa'));
    }, 1500);
  };
  
  // Fecha mínima (hoy)
  const fechaHoy = new Date().toISOString().split('T')[0];
  
  // Fecha máxima (3 meses adelante)
  const fechaMaxima = new Date();
  fechaMaxima.setMonth(fechaMaxima.getMonth() + 3);
  const fechaMax = fechaMaxima.toISOString().split('T')[0];

  // Verificar si se puede habilitar el botón de reserva
  const puedeReservar = fecha && horario && 
    (paqueteSeleccionado !== null || Object.values(seleccionPasajes).some(cantidad => cantidad > 0));
  
  // Mostrar cargador mientras se cargan los datos
  if (cargandoTiposPasaje || cargandoPaquetes) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-sky-200">
        <div className="flex flex-col items-center justify-center h-64">
          <Cargador />
          <p className="mt-4 text-blue-600">{t('general.cargando')}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-sky-200"
    >
      <h3 className="text-xl font-bold text-blue-800 mb-4">
        {t('tour.reservarAhora')}
      </h3>
      
      {tiposPasajeArray.length > 0 && (
        <div className="flex items-center text-2xl font-bold text-blue-800 mb-6">
          ${tiposPasajeArray[0].costo.toFixed(2)}
          <span className="text-sm font-normal text-blue-500 ml-1">
            / {t('tour.porPersona')}
          </span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-blue-700 mb-1">
            {t('tour.fecha')}
          </label>
          <input
            type="date"
            id="fecha"
            min={fechaHoy}
            max={fechaMax}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 bg-sky-50/50"
          />
        </div>
        
        <div>
          <label htmlFor="horario" className="block text-sm font-medium text-blue-700 mb-1">
            {t('tour.horario')}
          </label>
          <select
            id="horario"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            required
            className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 bg-sky-50/50"
          >
            <option value="">{t('tour.seleccionarHorario')}</option>
            {tour.horarios.map((hora, index) => (
              <option key={index} value={hora}>
                {hora}
              </option>
            ))}
          </select>
        </div>
        
        {/* Paquetes de pasajes *//*}
        {paquetesPasajesArray.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-blue-700">
              {t('tour.paquetesDisponibles')}
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {paquetesPasajesArray.map((paquete) => (
                <button
                  type="button"
                  key={paquete.id_paquete}
                  onClick={() => handleSeleccionPaquete(paquete.id_paquete)}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    paqueteSeleccionado === paquete.id_paquete
                      ? 'bg-teal-100 border-teal-500 text-teal-800'
                      : 'bg-sky-50 border-sky-200 text-blue-700 hover:bg-sky-100'
                  }`}
                >
                  <div className="font-medium">{paquete.nombre}</div>
                  <div className="text-sm mt-1">{paquete.cantidad_total} {t('tour.pasajeros')}</div>
                  <div className="font-bold mt-1">${paquete.precio_total.toFixed(2)}</div>
                  {paquete.descripcion && (
                    <div className="text-xs mt-1 text-blue-600">{paquete.descripcion}</div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-center text-sm text-blue-600 mt-2">
              {t('tour.o')}
            </div>
          </div>
        )}
        
        {/* Selector de pasajes individuales *//*}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-blue-700">
            {t('tour.pasajesIndividuales')}
          </label>
          
          {tiposPasajeArray.length > 0 ? (
            tiposPasajeArray.map((tipoPasaje) => (
              <SelectorPasaje
                key={tipoPasaje.id_tipo_pasaje}
                tipo={tipoPasaje.nombre}
                precio={tipoPasaje.costo}
                cantidad={seleccionPasajes[tipoPasaje.id_tipo_pasaje] || 0}
                setCantidad={(cantidad) => handleCantidadPasajeChange(tipoPasaje.id_tipo_pasaje, cantidad)}
                min={0}
                max={10}
                edad={tipoPasaje.edad || undefined}
                colorScheme="blue"
              />
            ))
          ) : (
            <div className="bg-sky-50 p-4 rounded-lg text-center text-blue-700">
              {t('tour.noHayTiposPasajeDisponibles')}
            </div>
          )}
        </div>
        
        {/* Resumen *//*}
        <div className="border-t border-sky-200 pt-4 mt-4">
          {paqueteSeleccionado !== null ? (
            <div className="flex justify-between mb-2">
              <span className="text-blue-700">
                {paquetesPasajesArray.find(p => p.id_paquete === paqueteSeleccionado)?.nombre || ''}
              </span>
              <span className="text-blue-800 font-medium">
                ${paquetesPasajesArray.find(p => p.id_paquete === paqueteSeleccionado)?.precio_total.toFixed(2) || '0.00'}
              </span>
            </div>
          ) : (
            <>
              {Object.entries(seleccionPasajes).map(([idTipoPasaje, cantidad]) => {
                if (cantidad <= 0) return null;
                const tipoPasaje = tiposPasajeArray.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
                if (!tipoPasaje) return null;
                
                return (
                  <div key={idTipoPasaje} className="flex justify-between mb-2">
                    <span className="text-blue-700">
                      {cantidad} {tipoPasaje.nombre}
                    </span>
                    <span className="text-blue-800 font-medium">
                      ${(tipoPasaje.costo * cantidad).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </>
          )}
          
          <div className="flex justify-between font-bold border-t border-sky-200 pt-2 mt-2">
            <span className="text-blue-800">
              {t('tour.total')}
            </span>
            <span className="text-teal-600">
              ${calcularTotal().toFixed(2)}
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={cargando || !puedeReservar}
          className={`w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-300 ${
            (cargando || !puedeReservar) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {cargando ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('general.procesando')}
            </span>
          ) : t('tour.reservarAhora')}
        </button>
      </form>
      
      <p className="text-xs text-blue-500 mt-4 text-center">
        {t('tour.avisoReserva')}
      </p>
    </motion.div>
  );
};

export default FormularioReservacion;*/ 
 
/*
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { listarTiposPasajePorTipoTour } from '../../../store/slices/sliceTipoPasaje';
import { listarPaquetesPasajesPorTipoTour } from '../../../store/slices/slicePaquetePasajes';
import { listarInstanciasTourPorFecha, listarInstanciasTourDisponibles } from '../../../store/slices/sliceInstanciaTour';
import SelectorPasaje from './SelectorPasaje';
import Cargador from '../../componentes/comunes/Cargador';

// Tipo para selección de pasajes
type SeleccionPasajes = Record<number, number>;

interface FormularioReservacionProps {
  tour: {
    id: number;
    nombre: string;
    precio?: number;
    duracion: number;
    horarios: string[];
  };
}

// Función auxiliar para formatear la hora
const formatearHora = (horaString: string): string => {
  try {
    // Extraer horas y minutos de la hora en formato ISO
    const fecha = new Date(horaString);
    const horas = fecha.getUTCHours();
    const minutos = fecha.getUTCMinutes();
    
    // Formatear a 12 horas
    const horasFormato12 = horas % 12 || 12;
    const periodo = horas >= 12 ? 'PM' : 'AM';
    
    // Asegurar que los minutos tengan dos dígitos
    const minutosFormateados = minutos.toString().padStart(2, '0');
    
    return `${horasFormato12}:${minutosFormateados} ${periodo}`;
  } catch (error) {
    console.error('Error al formatear hora:', error);
    return '';
  }
};

const FormularioReservacion = ({ tour }: FormularioReservacionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [fecha, setFecha] = useState('');
  const [horario, setHorario] = useState('');
  const [seleccionPasajes, setSeleccionPasajes] = useState<SeleccionPasajes>({});
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const [instanciaSeleccionada, setInstanciaSeleccionada] = useState<number | null>(null);
  
  // Referencias para rastrear el estado
  const seleccionInicializada = useRef(false);
  const tourAnteriorId = useRef<number | null>(null);
  const datosYaSolicitados = useRef(false);
  const instanciasDisponiblesCargadas = useRef(false);
  
  // Obtener datos de Redux
  const { tiposPasaje, cargando: cargandoTiposPasaje } = useSelector(
    (state: RootState) => state.tipoPasaje
  );
  
  const { paquetesPasajes, cargando: cargandoPaquetes } = useSelector(
    (state: RootState) => state.paquetePasajes
  );
  
  const { instanciasTour, cargando: cargandoInstancias } = useSelector(
    (state: RootState) => state.instanciaTour
  );
  
  // Verificar que tiposPasaje y paquetesPasajes sean arrays
  const tiposPasajeArray = Array.isArray(tiposPasaje) ? tiposPasaje : [];
  const paquetesPasajesArray = Array.isArray(paquetesPasajes) ? paquetesPasajes : [];
  const instanciasTourArray = Array.isArray(instanciasTour) ? instanciasTour : [];
  
  // Filtrar solo los elementos que corresponden al tour actual
  const tiposPasajeDelTour = tiposPasajeArray.filter(tp => tp.id_tipo_tour === tour.id);
  const paquetesPasajesDelTour = paquetesPasajesArray.filter(pp => pp.id_tipo_tour === tour.id);
  
  // Filtrar las instancias que corresponden al tour actual
  const instanciasDelTour = instanciasTourArray.filter(inst => 
    // Aquí deberías tener un campo que relacione la instancia con el tipo de tour
    // Como no está claro en la entidad, supondré que hay que buscar el nombre del tour
    inst.nombre_tour && inst.nombre_tour.includes(tour.nombre)
  );
  
  // Cargar datos cuando el componente se monta o cuando cambia el ID del tour
  useEffect(() => {
    // Cargar solo una vez o cuando cambie el ID del tour
    if (tour.id && (!datosYaSolicitados.current || tourAnteriorId.current !== tour.id)) {
      console.log("Cargando tipos de pasaje y paquetes para el tour:", tour.id, "(primera vez)");
      
      // Cargar tipos de pasaje para este tour
      dispatch(listarTiposPasajePorTipoTour(tour.id));
      
      // Cargar paquetes de pasajes para este tour
      dispatch(listarPaquetesPasajesPorTipoTour(tour.id));
      
      // Marcar como ya solicitado y actualizar el ID del tour
      datosYaSolicitados.current = true;
      tourAnteriorId.current = tour.id;
      
      // Reiniciar la selección si cambia el tour
      if (seleccionInicializada.current) {
        seleccionInicializada.current = false;
        setSeleccionPasajes({});
        setPaqueteSeleccionado(null);
        setFecha('');
        setHorario('');
        setInstanciaSeleccionada(null);
      }
    }
  }, [dispatch, tour.id]);
  
  // Cargar instancias disponibles al montar el componente
  useEffect(() => {
    if (!instanciasDisponiblesCargadas.current) {
      dispatch(listarInstanciasTourDisponibles());
      instanciasDisponiblesCargadas.current = true;
    }
  }, [dispatch]);
  
  // Inicializar la selección de pasajes cuando los datos estén disponibles
  useEffect(() => {
    // Solo inicializar si tenemos tipos de pasaje y no se ha inicializado aún
    if (tiposPasajeDelTour.length > 0 && !seleccionInicializada.current) {
      console.log("Inicializando selección de pasajes con:", tiposPasajeDelTour.length, "tipos");
      
      // Inicializar con 1 para el primer tipo (adulto generalmente) y 0 para el resto
      const seleccionInicial: SeleccionPasajes = {};
      tiposPasajeDelTour.forEach((tipo, index) => {
        seleccionInicial[tipo.id_tipo_pasaje] = index === 0 ? 1 : 0;
      });
      
      setSeleccionPasajes(seleccionInicial);
      seleccionInicializada.current = true;
    }
  }, [tiposPasajeDelTour]);
  
  // Cargar instancias por fecha cuando cambia la fecha seleccionada
  useEffect(() => {
    if (fecha) {
      dispatch(listarInstanciasTourPorFecha(fecha));
    }
  }, [dispatch, fecha]);
  
  // Manejar cambio de fecha
  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = e.target.value;
    setFecha(nuevaFecha);
    setHorario(''); // Resetear el horario cuando cambia la fecha
    setInstanciaSeleccionada(null);
  };
  
  // Manejar cambio de horario
  const handleHorarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoHorario = e.target.value;
    setHorario(nuevoHorario);
    
    // Encontrar la instancia correspondiente al horario seleccionado
    const idInstancia = e.target.options[e.target.selectedIndex].getAttribute('data-instancia-id');
    setInstanciaSeleccionada(idInstancia ? parseInt(idInstancia) : null);
  };
  
  // Manejar cambio en la cantidad de un tipo de pasaje
  const handleCantidadPasajeChange = (idTipoPasaje: number, cantidad: number) => {
    // Si se está usando un paquete, resetear selección de paquete
    if (paqueteSeleccionado !== null) {
      setPaqueteSeleccionado(null);
    }
    
    setSeleccionPasajes(prev => ({
      ...prev,
      [idTipoPasaje]: cantidad
    }));
  };
  
  // Manejar selección de paquete
  const handleSeleccionPaquete = (idPaquete: number) => {
    if (paqueteSeleccionado === idPaquete) {
      // Deseleccionar el paquete actual
      setPaqueteSeleccionado(null);
    } else {
      // Seleccionar nuevo paquete y actualizar cantidades según el paquete
      setPaqueteSeleccionado(idPaquete);
      
      // Aquí deberíamos actualizar las cantidades según el paquete seleccionado
      const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === idPaquete);
      
      if (paquete && tiposPasajeDelTour.length > 0) {
        // Distribuir la cantidad total entre los tipos de pasaje disponibles
        const cantidadPorTipo = Math.floor(paquete.cantidad_total / tiposPasajeDelTour.length);
        const nuevaSeleccion: SeleccionPasajes = {};
        
        tiposPasajeDelTour.forEach(tipo => {
          nuevaSeleccion[tipo.id_tipo_pasaje] = cantidadPorTipo;
        });
        
        // Añadir el restante al primer tipo de pasaje
        const restante = paquete.cantidad_total - (cantidadPorTipo * tiposPasajeDelTour.length);
        if (restante > 0) {
          nuevaSeleccion[tiposPasajeDelTour[0].id_tipo_pasaje] += restante;
        }
        
        setSeleccionPasajes(nuevaSeleccion);
      }
    }
  };
  
  // Calcular total basado en pasajes seleccionados o paquete
  const calcularTotal = () => {
    if (paqueteSeleccionado !== null) {
      const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === paqueteSeleccionado);
      return paquete ? paquete.precio_total : 0;
    } else {
      return Object.entries(seleccionPasajes).reduce((total, [idTipoPasaje, cantidad]) => {
        const tipoPasaje = tiposPasajeDelTour.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
        return total + (tipoPasaje ? tipoPasaje.costo * cantidad : 0);
      }, 0);
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    // Obtener datos para el resumen
    const instanciaSeleccionadaObj = instanciasDelTour.find(inst => inst.id_instancia === instanciaSeleccionada);
    const horaInicio = instanciaSeleccionadaObj ? formatearHora(instanciaSeleccionadaObj.hora_inicio) : '';
    const horaFin = instanciaSeleccionadaObj ? formatearHora(instanciaSeleccionadaObj.hora_fin) : '';
    
    // Mostrar resumen de la reserva
    let resumenPasajes = '';
    
    if (paqueteSeleccionado !== null) {
      const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === paqueteSeleccionado);
      if (paquete) {
        resumenPasajes = `Paquete: ${paquete.nombre}`;
      }
    } else {
      resumenPasajes = Object.entries(seleccionPasajes)
        .filter(([_, cantidad]) => cantidad > 0)
        .map(([idTipoPasaje, cantidad]) => {
          const tipoPasaje = tiposPasajeDelTour.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
          return tipoPasaje ? `${cantidad} ${tipoPasaje.nombre}` : '';
        })
        .filter(texto => texto !== '')
        .join(', ');
    }
    
    // Simular envío (en producción aquí iría la llamada a la API)
    setTimeout(() => {
      setCargando(false);
      alert(`${t('tour.reservaExitosa')}\n\nFecha: ${fecha}\nHorario: ${horaInicio} - ${horaFin}\nPasajes: ${resumenPasajes}\nTotal: $${calcularTotal().toFixed(2)}`);
    }, 1500);
  };
  
  // Fecha mínima (hoy)
  const fechaHoy = new Date().toISOString().split('T')[0];
  
  // Fecha máxima (3 meses adelante)
  const fechaMaxima = new Date();
  fechaMaxima.setMonth(fechaMaxima.getMonth() + 3);
  const fechaMax = fechaMaxima.toISOString().split('T')[0];
  
  // Determinar fechas disponibles (fechas con instancias programadas)
  const fechasDisponibles = [...new Set(instanciasDelTour.map(inst => inst.fecha_especifica))];
  
  // Determinar si una fecha está disponible
  const esFechaDisponible = (fechaStr: string): boolean => {
    return fechasDisponibles.includes(fechaStr);
  };
  
  // Obtener las instancias para la fecha seleccionada
  const instanciasPorFechaSeleccionada = instanciasDelTour.filter(
    inst => inst.fecha_especifica === fecha
  );
  
  // Preparar opciones de horario para la fecha seleccionada
  const opcionesHorario = instanciasPorFechaSeleccionada.map(inst => ({
    id: inst.id_instancia,
    horaInicio: formatearHora(inst.hora_inicio),
    horaFin: formatearHora(inst.hora_fin),
    texto: `${formatearHora(inst.hora_inicio)} - ${formatearHora(inst.hora_fin)}`,
    cupoDisponible: inst.cupo_disponible
  }));
  
  // Verificar si se puede habilitar el botón de reserva
  const puedeReservar = fecha && horario && instanciaSeleccionada !== null &&
    (paqueteSeleccionado !== null || Object.values(seleccionPasajes).some(cantidad => cantidad > 0));
  
  // Mostrar cargador mientras se cargan los datos
  if ((cargandoTiposPasaje || cargandoPaquetes) && !seleccionInicializada.current) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-sky-200">
        <div className="flex flex-col items-center justify-center h-64">
          <Cargador />
          <p className="mt-4 text-blue-600">{t('general.cargando')}</p>
        </div>
      </div>
    );
  }

  // Si no hay datos de tipos de pasaje después de cargar, usar datos de ejemplo
  if (tiposPasajeDelTour.length === 0 && !cargandoTiposPasaje && !seleccionInicializada.current) {
    console.log("Usando datos de ejemplo para el tour:", tour.id);
    
    // Definir tipos de pasaje de ejemplo
    const tiposPasajeEjemplo = [
      {
        id_tipo_pasaje: 1,
        id_sede: 1,
        id_tipo_tour: tour.id,
        nombre: "Adulto",
        costo: 120.00,
        edad: "Mayor de 12 años",
        eliminado: false
      },
      {
        id_tipo_pasaje: 2,
        id_sede: 1,
        id_tipo_tour: tour.id,
        nombre: "Niño",
        costo: 60.00,
        edad: "De 3 a 12 años",
        eliminado: false
      },
      {
        id_tipo_pasaje: 3,
        id_sede: 1,
        id_tipo_tour: tour.id,
        nombre: "Infante",
        costo: 0.00,
        edad: "Menor de 3 años",
        eliminado: false
      }
    ];
    
    // Inicializar selección con datos de ejemplo
    if (Object.keys(seleccionPasajes).length === 0) {
      const seleccionInicial: SeleccionPasajes = {};
      tiposPasajeEjemplo.forEach((tipo, index) => {
        seleccionInicial[tipo.id_tipo_pasaje] = index === 0 ? 1 : 0;
      });
      
      // Usar los datos de ejemplo para la UI
      setSeleccionPasajes(seleccionInicial);
      seleccionInicializada.current = true;
    }
  }

  // Contenido principal del formulario
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-sky-200"
    >
      <h3 className="text-xl font-bold text-blue-800 mb-4">
        {t('tour.reservarAhora')}
      </h3>
      
      {tiposPasajeDelTour.length > 0 && (
        <div className="flex items-center text-2xl font-bold text-blue-800 mb-6">
          ${tiposPasajeDelTour[0].costo.toFixed(2)}
          <span className="text-sm font-normal text-blue-500 ml-1">
            / {t('tour.porPersona')}
          </span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-blue-700 mb-1">
            {t('tour.fecha')}
          </label>
          <input
            type="date"
            id="fecha"
            min={fechaHoy}
            max={fechaMax}
            value={fecha}
            onChange={handleFechaChange}
            required
            className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 bg-sky-50/50"
          />
          
          {/* Mensaje de ayuda para fechas disponibles *//*}
          {cargandoInstancias ? (
            <p className="text-xs text-blue-500 mt-1">
              {t('tour.cargandoFechas')}
            </p>
          ) : fechasDisponibles.length > 0 ? (
            <p className="text-xs text-blue-500 mt-1">
              {t('tour.hayFechasDisponibles')}
            </p>
          ) : (
            <p className="text-xs text-amber-500 mt-1">
              {t('tour.sinFechasDisponibles')}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="horario" className="block text-sm font-medium text-blue-700 mb-1">
            {t('tour.horario')}
          </label>
          
          {fecha ? (
            opcionesHorario.length > 0 ? (
              <select
                id="horario"
                value={horario}
                onChange={handleHorarioChange}
                required
                className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 bg-sky-50/50"
              >
                <option value="">{t('tour.seleccionarHorario')}</option>
                {opcionesHorario.map((opcion) => (
                  <option
                    key={opcion.id}
                    value={opcion.texto}
                    data-instancia-id={opcion.id}
                    disabled={opcion.cupoDisponible <= 0}
                  >
                    {opcion.texto} {opcion.cupoDisponible <= 0 ? `(${t('tour.sinCupo')})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-amber-50 p-3 rounded-lg text-amber-800 text-sm">
                {t('tour.sinHorariosDisponiblesParaFecha')}
              </div>
            )
          ) : (
            <select
              id="horario"
              disabled
              className="w-full px-4 py-2 border border-sky-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            >
              <option value="">{t('tour.seleccionePrimeroFecha')}</option>
            </select>
          )}
        </div>
        
        {/* Paquetes de pasajes *//*}
        {paquetesPasajesDelTour.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-blue-700">
              {t('tour.paquetesDisponibles')}
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {paquetesPasajesDelTour.map((paquete) => (
                <button
                  type="button"
                  key={paquete.id_paquete}
                  onClick={() => handleSeleccionPaquete(paquete.id_paquete)}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    paqueteSeleccionado === paquete.id_paquete
                      ? 'bg-teal-100 border-teal-500 text-teal-800'
                      : 'bg-sky-50 border-sky-200 text-blue-700 hover:bg-sky-100'
                  }`}
                >
                  <div className="font-medium">{paquete.nombre}</div>
                  <div className="text-sm mt-1">{paquete.cantidad_total} {t('tour.pasajeros')}</div>
                  <div className="font-bold mt-1">${paquete.precio_total.toFixed(2)}</div>
                  {paquete.descripcion && (
                    <div className="text-xs mt-1 text-blue-600">{paquete.descripcion}</div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-center text-sm text-blue-600 mt-2">
              {t('tour.o')}
            </div>
          </div>
        )}
        
        {/* Selector de pasajes individuales *//*}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-blue-700">
            {t('tour.pasajesIndividuales')}
          </label>
          
          {tiposPasajeDelTour.length > 0 ? (
            tiposPasajeDelTour.map((tipoPasaje) => (
              <SelectorPasaje
                key={tipoPasaje.id_tipo_pasaje}
                tipo={tipoPasaje.nombre}
                precio={tipoPasaje.costo}
                cantidad={seleccionPasajes[tipoPasaje.id_tipo_pasaje] || 0}
                setCantidad={(cantidad) => handleCantidadPasajeChange(tipoPasaje.id_tipo_pasaje, cantidad)}
                min={0}
                max={10}
                edad={tipoPasaje.edad || undefined}
                colorScheme="blue"
              />
            ))
          ) : (
            <div className="bg-sky-50 p-4 rounded-lg text-center text-blue-700">
              {t('tour.noHayTiposPasajeDisponibles')}
            </div>
          )}
        </div>
        
        {/* Resumen *//*}
        <div className="border-t border-sky-200 pt-4 mt-4">
          {paqueteSeleccionado !== null ? (
            <div className="flex justify-between mb-2">
              <span className="text-blue-700">
                {paquetesPasajesDelTour.find(p => p.id_paquete === paqueteSeleccionado)?.nombre || ''}
              </span>
              <span className="text-blue-800 font-medium">
                ${paquetesPasajesDelTour.find(p => p.id_paquete === paqueteSeleccionado)?.precio_total.toFixed(2) || '0.00'}
              </span>
            </div>
          ) : (
            <>
              {Object.entries(seleccionPasajes).map(([idTipoPasaje, cantidad]) => {
                if (cantidad <= 0) return null;
                const tipoPasaje = tiposPasajeDelTour.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
                if (!tipoPasaje) return null;
                
                return (
                  <div key={idTipoPasaje} className="flex justify-between mb-2">
                    <span className="text-blue-700">
                      {cantidad} {tipoPasaje.nombre}
                    </span>
                    <span className="text-blue-800 font-medium">
                      ${(tipoPasaje.costo * cantidad).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </>
          )}
          
          <div className="flex justify-between font-bold border-t border-sky-200 pt-2 mt-2">
            <span className="text-blue-800">
              {t('tour.total')}
            </span>
            <span className="text-teal-600">
              ${calcularTotal().toFixed(2)}
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={cargando || !puedeReservar}
          className={`w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-300 ${
            (cargando || !puedeReservar) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {cargando ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('general.procesando')}
            </span>
          ) : t('tour.reservarAhora')}
        </button>
      </form>
      
      <p className="text-xs text-blue-500 mt-4 text-center">
        {t('tour.avisoReserva')}
      </p>
    </motion.div>
  );
};

export default FormularioReservacion;*/

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { listarTiposPasajePorTipoTour } from '../../../store/slices/sliceTipoPasaje';
import { listarPaquetesPasajesPorTipoTour } from '../../../store/slices/slicePaquetePasajes';
import { listarInstanciasTourDisponibles, listarInstanciasTourPorFecha } from '../../../store/slices/sliceInstanciaTour';
import SelectorPasaje from './SelectorPasaje';
import Cargador from '../../componentes/comunes/Cargador';

// Tipo para selección de pasajes
type SeleccionPasajes = Record<number, number>;

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
  const [fecha, setFecha] = useState('');
  const [horario, setHorario] = useState('');
  const [seleccionPasajes, setSeleccionPasajes] = useState<SeleccionPasajes>({});
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const [instanciaSeleccionada, setInstanciaSeleccionada] = useState<number | null>(null);
  
  // Referencias para rastrear el estado
  const seleccionInicializada = useRef(false);
  const tourAnteriorId = useRef<number | null>(null);
  const datosYaSolicitados = useRef(false);
  const instanciasDisponiblesCargadas = useRef(false);
  
  // Obtener datos de Redux
  const { tiposPasaje, cargando: cargandoTiposPasaje } = useSelector(
    (state: RootState) => state.tipoPasaje
  );
  
  const { paquetesPasajes, cargando: cargandoPaquetes } = useSelector(
    (state: RootState) => state.paquetePasajes
  );
  
  const { instanciasTour, cargando: cargandoInstancias } = useSelector(
    (state: RootState) => state.instanciaTour
  );
  
  // Verificar que tiposPasaje y paquetesPasajes sean arrays
  const tiposPasajeArray = Array.isArray(tiposPasaje) ? tiposPasaje : [];
  const paquetesPasajesArray = Array.isArray(paquetesPasajes) ? paquetesPasajes : [];
  const instanciasTourArray = Array.isArray(instanciasTour) ? instanciasTour : [];
  
  // Filtrar solo los elementos que corresponden al tour actual
  const tiposPasajeDelTour = tiposPasajeArray.filter(tp => tp.id_tipo_tour === tour.id);
  const paquetesPasajesDelTour = paquetesPasajesArray.filter(pp => pp.id_tipo_tour === tour.id);
  
  // Filtrar instancias que corresponden al tour actual
  const instanciasDelTour = useMemo(() => {
    return instanciasTourArray.filter(inst => {
      // Para el tour con ID 43 (Avistamiento de Ballenas Jorobadas)
      if (tour.id === 43) {
        return inst.nombre_tipo_tour && inst.nombre_tipo_tour.includes("Ballenas");
      } 
      // Para otros tours
      else if (inst.nombre_tipo_tour) {
        return !inst.nombre_tipo_tour.includes("Ballenas");
      }
      return false;
    });
  }, [instanciasTourArray, tour.id]);
  
  // Cargar datos cuando el componente se monta o cuando cambia el ID del tour
  useEffect(() => {
    // Cargar solo una vez o cuando cambie el ID del tour
    if (tour.id && (!datosYaSolicitados.current || tourAnteriorId.current !== tour.id)) {
      console.log("Cargando tipos de pasaje y paquetes para el tour:", tour.id, "(primera vez)");
      
      // Cargar tipos de pasaje para este tour
      dispatch(listarTiposPasajePorTipoTour(tour.id));
      
      // Cargar paquetes de pasajes para este tour
      dispatch(listarPaquetesPasajesPorTipoTour(tour.id));
      
      // Marcar como ya solicitado y actualizar el ID del tour
      datosYaSolicitados.current = true;
      tourAnteriorId.current = tour.id;
      
      // Reiniciar la selección si cambia el tour
      if (seleccionInicializada.current) {
        seleccionInicializada.current = false;
        setSeleccionPasajes({});
        setPaqueteSeleccionado(null);
        setFecha('');
        setHorario('');
        setInstanciaSeleccionada(null);
      }
    }
  }, [dispatch, tour.id]);
  
  // Cargar instancias disponibles al montar el componente
  useEffect(() => {
    if (!instanciasDisponiblesCargadas.current) {
      dispatch(listarInstanciasTourDisponibles());
      instanciasDisponiblesCargadas.current = true;
    }
  }, [dispatch]);
  
  // Inicializar la selección de pasajes cuando los datos estén disponibles
  useEffect(() => {
    // Solo inicializar si tenemos tipos de pasaje y no se ha inicializado aún
    if (tiposPasajeDelTour.length > 0 && !seleccionInicializada.current) {
      console.log("Inicializando selección de pasajes con:", tiposPasajeDelTour.length, "tipos");
      
      // Inicializar con 1 para el primer tipo (adulto generalmente) y 0 para el resto
      const seleccionInicial: SeleccionPasajes = {};
      tiposPasajeDelTour.forEach((tipo, index) => {
        seleccionInicial[tipo.id_tipo_pasaje] = index === 0 ? 1 : 0;
      });
      
      setSeleccionPasajes(seleccionInicial);
      seleccionInicializada.current = true;
    }
  }, [tiposPasajeDelTour]);
  
  // Cargar instancias por fecha cuando cambia la fecha seleccionada
  useEffect(() => {
    if (fecha) {
      dispatch(listarInstanciasTourPorFecha(fecha));
    }
  }, [dispatch, fecha]);
  
  // Filtrar por fecha cuando se selecciona una fecha
  const instanciasPorFechaSeleccionada = useMemo(() => {
    if (!fecha) return [];
    
    return instanciasDelTour.filter(inst => {
      // Convertir ambas fechas a formato YYYY-MM-DD para comparar
      const fechaInstancia = inst.fecha_especifica.split('T')[0];
      const fechaSeleccionada = fecha.split('T')[0]; // Ya está en formato YYYY-MM-DD
      
      return fechaInstancia === fechaSeleccionada;
    });
  }, [instanciasDelTour, fecha]);
  
  // Determinar fechas disponibles (fechas con instancias programadas)
  const fechasDisponibles = useMemo(() => {
    return [...new Set(instanciasDelTour.map(inst => inst.fecha_especifica.split('T')[0]))];
  }, [instanciasDelTour]);
  
  // Determinar si una fecha está disponible
  const esFechaDisponible = useCallback((fechaStr: string): boolean => {
    return fechasDisponibles.includes(fechaStr);
  }, [fechasDisponibles]);
  
  // Preparar opciones de horario para la fecha seleccionada
  const opcionesHorario = useMemo(() => {
    return instanciasPorFechaSeleccionada.map(inst => ({
      id: inst.id_instancia,
      horaInicio: inst.hora_inicio_str || "",
      horaFin: inst.hora_fin_str || "",
      texto: `${inst.hora_inicio_str || ""} - ${inst.hora_fin_str || ""}`,
      cupoDisponible: inst.cupo_disponible
    }));
  }, [instanciasPorFechaSeleccionada]);
  
  // Manejar cambio de fecha
  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = e.target.value;
    setFecha(nuevaFecha);
    setHorario(''); // Resetear el horario cuando cambia la fecha
    setInstanciaSeleccionada(null);
  };
  
  // Manejar cambio de horario
  const handleHorarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoHorario = e.target.value;
    setHorario(nuevoHorario);
    
    // Encontrar la instancia correspondiente al horario seleccionado
    const idInstancia = e.target.options[e.target.selectedIndex].getAttribute('data-instancia-id');
    setInstanciaSeleccionada(idInstancia ? parseInt(idInstancia) : null);
  };
  
  // Manejar cambio en la cantidad de un tipo de pasaje
  const handleCantidadPasajeChange = (idTipoPasaje: number, cantidad: number) => {
    // Si se está usando un paquete, resetear selección de paquete
    if (paqueteSeleccionado !== null) {
      setPaqueteSeleccionado(null);
    }
    
    setSeleccionPasajes(prev => ({
      ...prev,
      [idTipoPasaje]: cantidad
    }));
  };
  
  // Manejar selección de paquete
  const handleSeleccionPaquete = (idPaquete: number) => {
    if (paqueteSeleccionado === idPaquete) {
      // Deseleccionar el paquete actual
      setPaqueteSeleccionado(null);
    } else {
      // Seleccionar nuevo paquete y actualizar cantidades según el paquete
      setPaqueteSeleccionado(idPaquete);
      
      // Aquí deberíamos actualizar las cantidades según el paquete seleccionado
      const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === idPaquete);
      
      if (paquete && tiposPasajeDelTour.length > 0) {
        // Distribuir la cantidad total entre los tipos de pasaje disponibles
        const cantidadPorTipo = Math.floor(paquete.cantidad_total / tiposPasajeDelTour.length);
        const nuevaSeleccion: SeleccionPasajes = {};
        
        tiposPasajeDelTour.forEach(tipo => {
          nuevaSeleccion[tipo.id_tipo_pasaje] = cantidadPorTipo;
        });
        
        // Añadir el restante al primer tipo de pasaje
        const restante = paquete.cantidad_total - (cantidadPorTipo * tiposPasajeDelTour.length);
        if (restante > 0) {
          nuevaSeleccion[tiposPasajeDelTour[0].id_tipo_pasaje] += restante;
        }
        
        setSeleccionPasajes(nuevaSeleccion);
      }
    }
  };
  
  // Calcular total basado en pasajes seleccionados o paquete
  const calcularTotal = () => {
    if (paqueteSeleccionado !== null) {
      const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === paqueteSeleccionado);
      return paquete ? paquete.precio_total : 0;
    } else {
      return Object.entries(seleccionPasajes).reduce((total, [idTipoPasaje, cantidad]) => {
        const tipoPasaje = tiposPasajeDelTour.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
        return total + (tipoPasaje ? tipoPasaje.costo * cantidad : 0);
      }, 0);
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    // Obtener datos para el resumen
    const instanciaSeleccionadaObj = instanciasPorFechaSeleccionada.find(inst => inst.id_instancia === instanciaSeleccionada);
    const horaInicio = instanciaSeleccionadaObj ? instanciaSeleccionadaObj.hora_inicio_str || "" : "";
    const horaFin = instanciaSeleccionadaObj ? instanciaSeleccionadaObj.hora_fin_str || "" : "";
    
    // Mostrar resumen de la reserva
    let resumenPasajes = '';
    
    if (paqueteSeleccionado !== null) {
      const paquete = paquetesPasajesDelTour.find(p => p.id_paquete === paqueteSeleccionado);
      if (paquete) {
        resumenPasajes = `Paquete: ${paquete.nombre}`;
      }
    } else {
      resumenPasajes = Object.entries(seleccionPasajes)
        .filter(([_, cantidad]) => cantidad > 0)
        .map(([idTipoPasaje, cantidad]) => {
          const tipoPasaje = tiposPasajeDelTour.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
          return tipoPasaje ? `${cantidad} ${tipoPasaje.nombre}` : '';
        })
        .filter(texto => texto !== '')
        .join(', ');
    }
    
    // Simular envío (en producción aquí iría la llamada a la API)
    setTimeout(() => {
      setCargando(false);
      alert(`${t('tour.reservaExitosa')}\n\nFecha: ${fecha}\nHorario: ${horaInicio} - ${horaFin}\nPasajes: ${resumenPasajes}\nTotal: $${calcularTotal().toFixed(2)}`);
    }, 1500);
  };
  
  // Fecha mínima (hoy)
  const fechaHoy = new Date().toISOString().split('T')[0];
  
  // Fecha máxima (3 meses adelante)
  const fechaMaxima = new Date();
  fechaMaxima.setMonth(fechaMaxima.getMonth() + 3);
  const fechaMax = fechaMaxima.toISOString().split('T')[0];

  // Verificar si se puede habilitar el botón de reserva
  const puedeReservar = fecha && horario && instanciaSeleccionada !== null &&
    (paqueteSeleccionado !== null || Object.values(seleccionPasajes).some(cantidad => cantidad > 0));
  
  // Mostrar cargador mientras se cargan los datos
  if ((cargandoTiposPasaje || cargandoPaquetes) && !seleccionInicializada.current) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-sky-200">
        <div className="flex flex-col items-center justify-center h-64">
          <Cargador />
          <p className="mt-4 text-blue-600">{t('general.cargando')}</p>
        </div>
      </div>
    );
  }

  // Contenido principal del formulario
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-sky-200"
    >
      <h3 className="text-xl font-bold text-blue-800 mb-4">
        {t('tour.reservarAhora')}
      </h3>
      
      {tiposPasajeDelTour.length > 0 && (
        <div className="flex items-center text-2xl font-bold text-blue-800 mb-6">
          ${tiposPasajeDelTour[0].costo.toFixed(2)}
          <span className="text-sm font-normal text-blue-500 ml-1">
            / {t('tour.porPersona')}
          </span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-blue-700 mb-1">
            {t('tour.fecha')}
          </label>
          <input
            type="date"
            id="fecha"
            min={fechaHoy}
            max={fechaMax}
            value={fecha}
            onChange={handleFechaChange}
            required
            className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 bg-sky-50/50"
          />
          
          {/* Mensaje de ayuda para fechas disponibles */}
          {cargandoInstancias ? (
            <p className="text-xs text-blue-500 mt-1">
              {t('tour.cargandoFechas')}
            </p>
          ) : fechasDisponibles.length > 0 ? (
            <p className="text-xs text-blue-500 mt-1">
              {t('tour.hayFechasDisponibles')}: {fechasDisponibles.slice(0, 3).join(', ')}
              {fechasDisponibles.length > 3 ? ` y ${fechasDisponibles.length - 3} más` : ''}
            </p>
          ) : (
            <p className="text-xs text-amber-500 mt-1">
              {t('tour.sinFechasDisponibles')}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="horario" className="block text-sm font-medium text-blue-700 mb-1">
            {t('tour.horario')}
          </label>
          
          {fecha ? (
            opcionesHorario.length > 0 ? (
              <select
                id="horario"
                value={horario}
                onChange={handleHorarioChange}
                required
                className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 bg-sky-50/50"
              >
                <option value="">{t('tour.seleccionarHorario')}</option>
                {opcionesHorario.map((opcion) => (
                  <option
                    key={opcion.id}
                    value={opcion.texto}
                    data-instancia-id={opcion.id}
                    disabled={opcion.cupoDisponible <= 0}
                  >
                    {opcion.texto} {opcion.cupoDisponible <= 0 ? `(${t('tour.sinCupo')})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-amber-50 p-3 rounded-lg text-amber-800 text-sm">
                {t('tour.sinHorariosDisponiblesParaFecha')}
              </div>
            )
          ) : (
            <select
              id="horario"
              disabled
              className="w-full px-4 py-2 border border-sky-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            >
              <option value="">{t('tour.seleccionePrimeroFecha')}</option>
            </select>
          )}
        </div>
        
        {/* Paquetes de pasajes */}
        {paquetesPasajesDelTour.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-blue-700">
              {t('tour.paquetesDisponibles')}
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {paquetesPasajesDelTour.map((paquete) => (
                <button
                  type="button"
                  key={paquete.id_paquete}
                  onClick={() => handleSeleccionPaquete(paquete.id_paquete)}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    paqueteSeleccionado === paquete.id_paquete
                      ? 'bg-teal-100 border-teal-500 text-teal-800'
                      : 'bg-sky-50 border-sky-200 text-blue-700 hover:bg-sky-100'
                  }`}
                >
                  <div className="font-medium">{paquete.nombre}</div>
                  <div className="text-sm mt-1">{paquete.cantidad_total} {t('tour.pasajeros')}</div>
                  <div className="font-bold mt-1">${paquete.precio_total.toFixed(2)}</div>
                  {paquete.descripcion && (
                    <div className="text-xs mt-1 text-blue-600">{paquete.descripcion}</div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-center text-sm text-blue-600 mt-2">
              {t('tour.o')}
            </div>
          </div>
        )}
        
        {/* Selector de pasajes individuales */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-blue-700">
            {t('tour.pasajesIndividuales')}
          </label>
          
          {tiposPasajeDelTour.length > 0 ? (
            tiposPasajeDelTour.map((tipoPasaje) => (
              <SelectorPasaje
                key={tipoPasaje.id_tipo_pasaje}
                tipo={tipoPasaje.nombre}
                precio={tipoPasaje.costo}
                cantidad={seleccionPasajes[tipoPasaje.id_tipo_pasaje] || 0}
                setCantidad={(cantidad) => handleCantidadPasajeChange(tipoPasaje.id_tipo_pasaje, cantidad)}
                min={0}
                max={10}
                edad={tipoPasaje.edad || undefined}
                colorScheme="blue"
              />
            ))
          ) : (
            <div className="bg-sky-50 p-4 rounded-lg text-center text-blue-700">
              {t('tour.noHayTiposPasajeDisponibles')}
            </div>
          )}
        </div>
        
        {/* Resumen */}
        <div className="border-t border-sky-200 pt-4 mt-4">
          {paqueteSeleccionado !== null ? (
            <div className="flex justify-between mb-2">
              <span className="text-blue-700">
                {paquetesPasajesDelTour.find(p => p.id_paquete === paqueteSeleccionado)?.nombre || ''}
              </span>
              <span className="text-blue-800 font-medium">
                ${paquetesPasajesDelTour.find(p => p.id_paquete === paqueteSeleccionado)?.precio_total.toFixed(2) || '0.00'}
              </span>
            </div>
          ) : (
            <>
              {Object.entries(seleccionPasajes).map(([idTipoPasaje, cantidad]) => {
                if (cantidad <= 0) return null;
                const tipoPasaje = tiposPasajeDelTour.find(t => t.id_tipo_pasaje === Number(idTipoPasaje));
                if (!tipoPasaje) return null;
                
                return (
                  <div key={idTipoPasaje} className="flex justify-between mb-2">
                    <span className="text-blue-700">
                      {cantidad} {tipoPasaje.nombre}
                    </span>
                    <span className="text-blue-800 font-medium">
                      ${(tipoPasaje.costo * cantidad).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </>
          )}
          
          <div className="flex justify-between font-bold border-t border-sky-200 pt-2 mt-2">
            <span className="text-blue-800">
              {t('tour.total')}
            </span>
            <span className="text-teal-600">
              ${calcularTotal().toFixed(2)}
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={cargando || !puedeReservar}
          className={`w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-300 ${
            (cargando || !puedeReservar) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {cargando ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('general.procesando')}
            </span>
          ) : t('tour.reservarAhora')}
        </button>
      </form>
      
      <p className="text-xs text-blue-500 mt-4 text-center">
        {t('tour.avisoReserva')}
      </p>
    </motion.div>
  );
};

export default FormularioReservacion;