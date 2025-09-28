 /*  import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Download, Printer, ArrowLeft, Users, MapPin, Clock, CreditCard, FileText, Calendar, Building, Package } from 'lucide-react';
import jsPDF from 'jspdf';
import { RootState, AppDispatch } from '../../../store';
import { obtenerDetalleReservaPorId, limpiarReservaDetalle } from '../../../store/slices/sliceReserva';
import Cargador from '../../componentes/comunes/Cargador';
import Alerta from '../../componentes/comunes/Alerta';

interface CantidadPasaje {
  id_tipo_pasaje?: number;
  nombre_tipo?: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
}

interface PaqueteReserva {
  id_paquete: number;
  nombre_paquete?: string; // Cambiado de "nombre" a "nombre_paquete" para coincidir con backend
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  cantidad_total?: number; // Añadido para coincidir con backend
  desglose_pasajes?: { tipo: string; cantidad: number }[]; // Opcional
}

interface ReservaDetallada {
  id: number; // Cambiado de id_reserva para coincidir con backend
  id_vendedor?: number | null;
  id_cliente: number;
  id_instancia?: number;
  id_sede?: number;
  total_pagar: number;
  cantidad_pasajes?: CantidadPasaje[];
  paquetes?: PaqueteReserva[];
  notas?: string;
  fecha_reserva: string; // Cambiado de fecha_creacion
  fecha_actualizacion: string;
  fecha_expiracion?: string;
  metodo_pago?: string;
  estado: EstadoReserva;
  fecha_cancelacion?: string;
  nombre_cliente?: string;
  nombre_vendedor?: string;
  nombre_tour?: string;
  descripcion_tour?: string;
  fecha_tour?: string;
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  duracion_tour?: number;
  cliente?: {
    nombres: string;
    apellidos: string;
    email: string;
    telefono?: string;
    tipo_documento?: string;
    numero_documento?: string;
  };
  sede?: {
    nombre: string;
    direccion?: string;
    telefono?: string;
  };
}

type EstadoReserva = 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE' | 'PROCESADO' | 'ANULADO' | 'RESERVADO';

const PaginaDetalleReserva = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { reservaDetalle, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  const reserva = reservaDetalle as ReservaDetallada | null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id && !isNaN(parseInt(id)) && autenticado) {
      dispatch(obtenerDetalleReservaPorId(parseInt(id)));
    } else if (!autenticado) {
      navigate(`/ingresar?redirect=/mis-reservas/${id}`);
    } else {
      navigate('/mis-reservas');
    }
    return () => {
      dispatch(limpiarReservaDetalle());
    };
  }, [id, dispatch, autenticado, navigate]);

  const formatearFecha = (fechaStr?: string, formato: 'completo' | 'corto' | 'relativo' = 'completo'): string => {
    if (!fechaStr) return t('reservas.fechaNoDisponible');
    try {
      let fecha: Date;
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaStr)) {
        const [dia, mes, anio] = fechaStr.split('/').map(Number);
        fecha = new Date(anio, mes - 1, dia);
      } else {
        fecha = new Date(fechaStr);
      }
      if (isNaN(fecha.getTime())) return t('reservas.fechaInvalida');
      if (formato === 'relativo') return formatDistanceToNow(fecha, { addSuffix: true, locale: es });
      return format(fecha, formato === 'completo' ? 'EEEE, d MMMM yyyy' : 'd MMM yyyy', { locale: es });
    } catch {
      return t('reservas.fechaInvalida');
    }
  };

  const formatearHora = (horaStr?: string): string => {
    if (!horaStr) return '';
    return horaStr.includes(':') ? horaStr.split(':').slice(0, 2).join(':') : horaStr;
  };

  const getEstadoClase = (estado: EstadoReserva): string => {
    const clases = {
      CONFIRMADA: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      CANCELADA: 'bg-rose-100 text-rose-800 border-rose-200',
      PENDIENTE: 'bg-amber-100 text-amber-800 border-amber-200',
      PROCESADO: 'bg-blue-100 text-blue-800 border-blue-200',
      ANULADO: 'bg-gray-100 text-gray-800 border-gray-200',
      RESERVADO: 'bg-sky-100 text-sky-800 border-sky-200',
    };
    return clases[estado] || clases.RESERVADO;
  };

  const getEstadoTexto = (estado: EstadoReserva): string => {
    const traducciones = {
      CONFIRMADA: t('reservas.estado.confirmada'),
      CANCELADA: t('reservas.estado.cancelada'),
      PENDIENTE: t('reservas.estado.pendiente'),
      PROCESADO: t('reservas.estado.procesado'),
      ANULADO: t('reservas.estado.anulado'),
      RESERVADO: t('reservas.estado.reservado'),
    };
    return traducciones[estado] || estado;
  };

  const calcularTotalPasajeros = (): number => {
    if (!reserva) return 0;
    const totalIndividuales = reserva.cantidad_pasajes?.reduce((sum, p) => sum + (p.cantidad || 0), 0) || 0;
    const totalPaquetes = reserva.paquetes?.reduce((sum, paquete) => {
      return sum + (paquete.cantidad_total || paquete.desglose_pasajes?.reduce((s, d) => s + (d.cantidad || 0), 0) || 0) * (paquete.cantidad || 0);
    }, 0) || 0;
    return totalIndividuales + totalPaquetes;
  };

  const getDesglosePasajeros = () => {
    if (!reserva) return {};
    const desglose: Record<string, { individuales: number; paquetes: number; total: number }> = {};
    const inicializar = (tipo: string) => {
      if (!desglose[tipo]) desglose[tipo] = { individuales: 0, paquetes: 0, total: 0 };
    };
    reserva.cantidad_pasajes?.forEach(p => {
      const tipo = p.nombre_tipo || 'Pasajero';
      inicializar(tipo);
      desglose[tipo].individuales += p.cantidad || 0;
      desglose[tipo].total += p.cantidad || 0;
    });
    reserva.paquetes?.forEach(paquete => {
      if (paquete.desglose_pasajes?.length) {
        paquete.desglose_pasajes.forEach(d => {
          const tipo = d.tipo || 'Pasajero';
          inicializar(tipo);
          const total = (d.cantidad || 0) * (paquete.cantidad || 0);
          desglose[tipo].paquetes += total;
          desglose[tipo].total += total;
        });
      } else if (paquete.cantidad_total) {
        const tipo = 'Pasajero'; // Fallback si no hay desglose
        inicializar(tipo);
        desglose[tipo].paquetes += paquete.cantidad_total * (paquete.cantidad || 0);
        desglose[tipo].total += paquete.cantidad_total * (paquete.cantidad || 0);
      }
    });
    return desglose;
  };

  const generarPDF = () => {
    if (!reserva) return;
    const doc = new jsPDF();
    let y = 20;
    const hoy = new Date().toLocaleDateString('es-ES');

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Comprobante de Reserva', 20, y);
    doc.setFontSize(12);
    doc.text(`#${reserva.id} - ${getEstadoTexto(reserva.estado)}`, 20, y + 10);
    y += 20;
    doc.setFontSize(10);
    doc.text(`Fecha de creación: ${formatearFecha(reserva.fecha_reserva)}`, 20, y);
    y += 7;
    doc.text(`Total a pagar: S/ ${reserva.total_pagar.toFixed(2)}`, 20, y);
    y += 7;
    doc.text(`Total pasajeros: ${calcularTotalPasajeros()}`, 20, y);
    y += 7;
    if (reserva.nombre_vendedor) doc.text(`Vendedor: ${reserva.nombre_vendedor}`, 20, y);
    y += 10;

    if (reserva.nombre_tour) {
      doc.text('Detalles del Tour:', 20, y);
      y += 7;
      doc.text(`${reserva.nombre_tour}`, 20, y);
      y += 7;
      if (reserva.descripcion_tour) {
        doc.text(reserva.descripcion_tour, 20, y, { maxWidth: 170 });
        y += 10;
      }
      doc.text(`Fecha: ${formatearFecha(reserva.fecha_tour)}`, 20, y);
      y += 7;
      doc.text(`Horario: ${formatearHora(reserva.hora_inicio_tour)} - ${formatearHora(reserva.hora_fin_tour)}`, 20, y);
      y += 10;
    }

    if (reserva.cantidad_pasajes?.length) {
      doc.text('Pasajes Individuales:', 20, y);
      y += 7;
      reserva.cantidad_pasajes.forEach(p => {
        doc.text(`${p.nombre_tipo || 'Pasajero'}: ${p.cantidad} x S/ ${p.precio_unitario?.toFixed(2) || 'N/A'} = S/ ${p.subtotal?.toFixed(2) || 'N/A'}`, 25, y);
        y += 7;
      });
      y += 5;
    }

    if (reserva.paquetes?.length) {
      doc.text('Paquetes:', 20, y);
      y += 7;
      reserva.paquetes.forEach(p => {
        const totalPas = p.cantidad_total || p.desglose_pasajes?.reduce((s, d) => s + d.cantidad, 0) || 0;
        doc.text(`${p.nombre_paquete || 'Paquete'}: ${p.cantidad} x ${totalPas} personas = S/ ${p.subtotal.toFixed(2)}`, 25, y);
        y += 7;
        if (p.desglose_pasajes?.length) {
          p.desglose_pasajes.forEach(d => {
            doc.text(`- ${d.tipo}: ${d.cantidad}`, 30, y);
            y += 7;
          });
        }
      });
      y += 5;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: S/ ${reserva.total_pagar.toFixed(2)}`, 20, y);
    y += 10;

    if (reserva.metodo_pago) {
      doc.text(`Método de pago: ${reserva.metodo_pago}`, 20, y);
      y += 7;
    }
    if (reserva.notas) {
      doc.text('Notas:', 20, y);
      y += 7;
      doc.text(reserva.notas, 20, y, { maxWidth: 170 });
      y += 10;
    }

    doc.setFontSize(8);
    doc.text(`Generado el ${hoy} - No válido como recibo fiscal`, 20, 280);
    doc.save(`reserva_${reserva.id}.pdf`);
  };

  if (!autenticado) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('auth.necesitaIniciarSesion')}</h2>
          <p className="text-gray-600 mb-6">{t('auth.iniciarParaVerReservas')}</p>
          <Link to={`/ingresar?redirect=/mis-reservas/${id}`} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
            <Users className="h-5 w-5 mr-2" />
            {t('auth.iniciarSesion')}
          </Link>
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center border border-blue-100">
            <Cargador tamanio="lg" color="text-blue-600" />
            <p className="mt-4 text-gray-600 text-lg">{t('reservas.cargandoDetalles')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <Alerta mensaje={error || t('reservas.noCargada')} tipo="error" />
            <div className="text-center mt-6">
              <Link to="/mis-reservas" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('reservas.volverMisReservas')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const desglosePasajeros = getDesglosePasajeros();
  const totalPasajeros = calcularTotalPasajeros();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
      <style>{`@media print { .no-print { display: none; } body { background: none; } .bg-white { box-shadow: none; border: none; } }`}</style>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Encabezado *//*}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-blue-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center">
                <button onClick={() => navigate('/mis-reservas')} className="p-3 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 mr-4 transition-all no-print">
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{t('reservas.reserva')} #{reserva.id}</h1>
                  <p className="text-gray-600 mt-2 text-lg">{t('reservas.creadaEl')} {formatearFecha(reserva.fecha_reserva, 'completo')}</p>
                </div>
              </div>
              <span className={`px-6 py-2 inline-flex items-center text-base font-semibold rounded-full ${getEstadoClase(reserva.estado)} border shadow-sm`}>
                <Users className="h-5 w-5 text-emerald-600" />
                <span className="ml-2">{getEstadoTexto(reserva.estado)}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Detalles Tour *//*}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{reserva.nombre_tour || t('reservas.tour')}</h2>
                    {reserva.descripcion_tour && <p className="text-gray-600 mb-6">{reserva.descripcion_tour}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                            <Calendar className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">{t('reservas.fechaTour')}</div>
                            <div className="text-lg font-semibold text-gray-900">{formatearFecha(reserva.fecha_tour, 'completo')}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mr-4">
                            <Clock className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">{t('reservas.horario')}</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {formatearHora(reserva.hora_inicio_tour)} - {formatearHora(reserva.hora_fin_tour)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mr-4">
                            <Users className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">{t('reservas.totalPasajeros')}</div>
                            <div className="text-2xl font-bold text-purple-600">{totalPasajeros}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mr-4">
                            <CreditCard className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">{t('reservas.totalPagado')}</div>
                            <div className="text-2xl font-bold text-emerald-600">S/ {reserva.total_pagar.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desglose Pasajeros *//*}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  {t('reservas.desglosePasajeros')}
                </h3>
                {Object.entries(desglosePasajeros).map(([tipo, datos]) => (
                  <div key={tipo} className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-3xl font-bold text-blue-700 mb-1">{datos.total}</div>
                        <div className="text-sm font-medium text-blue-600 mb-3">{tipo}</div>
                        {datos.individuales > 0 && <div className="text-xs">Individuales: {datos.individuales}</div>}
                        {datos.paquetes > 0 && <div className="text-xs">En paquetes: {datos.paquetes}</div>}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                ))}
                {reserva.cantidad_pasajes?.length && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('reservas.pasajesIndividuales')}</h4>
                    {reserva.cantidad_pasajes.map((pasaje, index) => (
                      <div key={index} className="bg-blue-50 rounded-xl p-5 border border-blue-100 mb-4">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{pasaje.nombre_tipo || 'Pasajero'}</div>
                            <div className="text-sm text-gray-600">Cantidad: {pasaje.cantidad}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">S/ {pasaje.subtotal?.toFixed(2) || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {reserva.paquetes?.length && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="h-5 w-5 text-emerald-600 mr-2" />
                      {t('reservas.paquetesAdquiridos')}
                    </h4>
                    {reserva.paquetes.map((paquete, index) => {
                      const totalPas = paquete.cantidad_total || paquete.desglose_pasajes?.reduce((s, d) => s + d.cantidad, 0) || 0;
                      return (
                        <div key={index} className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 mb-4">
                          <div className="flex justify-between mb-4">
                            <div>
                              <div className="font-bold text-gray-900 text-lg">{paquete.nombre_paquete || 'Paquete'}</div>
                              <div className="text-sm text-gray-600">{paquete.cantidad} paquetes x {totalPas} personas</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-emerald-600">S/ {paquete.subtotal.toFixed(2)}</div>
                            </div>
                          </div>
                          {paquete.desglose_pasajes?.length ? (
                            <details>
                              <summary className="text-sm font-medium text-emerald-700 cursor-pointer">Desglose</summary>
                              <div className="mt-4 space-y-2 text-sm">
                                {paquete.desglose_pasajes.map((d, i) => (
                                  <div key={i}>{d.tipo}: {d.cantidad}</div>
                                ))}
                              </div>
                            </details>
                          ) : paquete.cantidad_total ? (
                            <div className="text-sm text-gray-600">Total personas: {paquete.cantidad_total}</div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Información Adicional *//*}
              {(reserva.notas || reserva.metodo_pago) && (
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FileText className="h-6 w-6 text-blue-600 mr-3" />
                    {t('reservas.informacionAdicional')}
                  </h3>
                  <div className="space-y-6">
                    {reserva.notas && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-2" />
                          {t('reservas.notasReserva')}
                        </h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-gray-700">{reserva.notas}</p>
                        </div>
                      </div>
                    )}
                    {reserva.metodo_pago && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <CreditCard className="h-5 w-5 text-emerald-500 mr-2" />
                          {t('reservas.metodoPago')}
                        </h4>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                          <p className="text-gray-700">{reserva.metodo_pago}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar *//*}
            <div className="space-y-6">
              {reserva.cliente && (
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    {t('reservas.cliente')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">{t('reservas.nombreCompleto')}</div>
                      <div className="font-semibold text-gray-900">{reserva.nombre_cliente || `${reserva.cliente.nombres} ${reserva.cliente.apellidos}`}</div>
                    </div>
                    {reserva.cliente.email && <div><div className="text-sm text-gray-500">{t('reservas.email')}</div><div className="text-gray-900">{reserva.cliente.email}</div></div>}
                    {reserva.cliente.telefono && <div><div className="text-sm text-gray-500">{t('reservas.telefono')}</div><div className="text-gray-900">{reserva.cliente.telefono}</div></div>}
                  </div>
                </div>
              )}
              {reserva.sede && (
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 text-blue-600 mr-2" />
                    {t('reservas.sede')}
                  </h3>
                  <div className="space-y-4">
                    <div><div className="text-sm text-gray-500">{t('reservas.nombre')}</div><div className="font-semibold text-gray-900">{reserva.sede.nombre}</div></div>
                    {reserva.sede.direccion && <div><div className="text-sm text-gray-500">{t('reservas.direccion')}</div><div className="text-gray-900">{reserva.sede.direccion}</div></div>}
                    {reserva.sede.telefono && <div><div className="text-sm text-gray-500">{t('reservas.telefono')}</div><div className="text-gray-900">{reserva.sede.telefono}</div></div>}
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  {t('reservas.fechasImportantes')}
                </h3>
                <div className="space-y-4">
                  <div><div className="text-sm text-gray-500">{t('reservas.reservaCreada')}</div><div className="text-gray-900">{formatearFecha(reserva.fecha_reserva, 'corto')}</div></div>
                  <div><div className="text-sm text-gray-500">{t('reservas.ultimaActualizacion')}</div><div className="text-gray-900">{formatearFecha(reserva.fecha_actualizacion, 'corto')}</div></div>
                  {reserva.fecha_expiracion && <div><div className="text-sm text-gray-500">{t('reservas.fechaExpiracion')}</div><div className="text-amber-600">{formatearFecha(reserva.fecha_expiracion, 'corto')}</div></div>}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100 no-print">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('reservas.acciones')}</h3>
                <div className="space-y-4">
                  <button onClick={() => window.print()} className="w-full flex items-center justify-center px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 transition-all font-medium">
                    <Printer className="h-5 w-5 mr-2" />
                    {t('reservas.imprimirReserva')}
                  </button>
                  <button onClick={generarPDF} className="w-full flex items-center justify-center px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition-all font-medium">
                    <Download className="h-5 w-5 mr-2" />
                    {t('reservas.descargarPDF')}
                  </button>
                  <Link to="/mis-reservas" className="w-full flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 transition-all font-medium">
                    <FileText className="h-5 w-5 mr-2" />
                    {t('reservas.verTodasReservas')}
                  </Link>
                  <Link to="/tours" className="w-full flex items-center justify-center px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition-all font-medium">
                    <MapPin className="h-5 w-5 mr-2" />
                    {t('reservas.explorarTours')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaDetalleReserva;*/


import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Download, Printer, ArrowLeft, Users, MapPin, Clock, CreditCard, FileText, Calendar, Building, Package } from 'lucide-react';
import jsPDF from 'jspdf';
import { RootState, AppDispatch } from '../../../store';
import { obtenerDetalleReservaPorId, limpiarReservaDetalle } from '../../../store/slices/sliceReserva';
import Cargador from '../../componentes/comunes/Cargador';
import Alerta from '../../componentes/comunes/Alerta';

interface CantidadPasaje {
  id_tipo_pasaje?: number;
  nombre_tipo?: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
}

interface PaqueteReserva {
  id_paquete: number;
  nombre_paquete?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  cantidad_total?: number;
  desglose_pasajes?: { tipo: string; cantidad: number }[];
}

interface ReservaDetallada {
  id: number;
  id_vendedor?: number | null;
  id_cliente: number;
  id_instancia?: number;
  id_sede?: number;
  total_pagar: number;
  cantidad_pasajes?: CantidadPasaje[];
  paquetes?: PaqueteReserva[];
  notas?: string;
  fecha_reserva: string;
  fecha_actualizacion: string;
  fecha_expiracion?: string;
  metodo_pago?: string;
  estado: EstadoReserva;
  fecha_cancelacion?: string;
  nombre_cliente?: string;
  nombre_vendedor?: string;
  nombre_tour?: string;
  descripcion_tour?: string;
  fecha_tour?: string;
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  duracion_tour?: number;
  cliente?: {
    nombres: string;
    apellidos: string;
    email: string;
    telefono?: string;
    tipo_documento?: string;
    numero_documento?: string;
  };
  sede?: {
    nombre: string;
    direccion?: string;
    telefono?: string;
  };
}

type EstadoReserva = 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE' | 'PROCESADO' | 'ANULADO' | 'RESERVADO';

const PaginaDetalleReserva = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { reservaDetalle, cargando, error } = useSelector((state: RootState) => state.reserva);
  const { autenticado } = useSelector((state: RootState) => state.autenticacion);
  const reserva = reservaDetalle as ReservaDetallada | null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id && !isNaN(parseInt(id)) && autenticado) {
      dispatch(obtenerDetalleReservaPorId(parseInt(id)));
    } else if (!autenticado) {
      navigate(`/ingresar?redirect=/mis-reservas/${id}`);
    } else {
      navigate('/mis-reservas');
    }
    return () => {
      dispatch(limpiarReservaDetalle());
    };
  }, [id, dispatch, autenticado, navigate]);

  const formatearFecha = (fechaStr?: string, formato: 'completo' | 'corto' | 'relativo' = 'completo'): string => {
    if (!fechaStr) return t('reservas.fechaNoDisponible');
    try {
      let fecha: Date;
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaStr)) {
        const [dia, mes, anio] = fechaStr.split('/').map(Number);
        fecha = new Date(anio, mes - 1, dia);
      } else {
        fecha = new Date(fechaStr);
      }
      if (isNaN(fecha.getTime())) return t('reservas.fechaInvalida');
      if (formato === 'relativo') return formatDistanceToNow(fecha, { addSuffix: true, locale: es });
      return format(fecha, formato === 'completo' ? 'EEEE, d MMMM yyyy' : 'd MMM yyyy', { locale: es });
    } catch {
      return t('reservas.fechaInvalida');
    }
  };

  const formatearHora = (horaStr?: string): string => {
    if (!horaStr) return '';
    return horaStr.includes(':') ? horaStr.split(':').slice(0, 2).join(':') : horaStr;
  };

  const getEstadoClase = (estado: EstadoReserva): string => {
    const clases = {
      CONFIRMADA: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      CANCELADA: 'bg-rose-100 text-rose-800 border-rose-200',
      PENDIENTE: 'bg-amber-100 text-amber-800 border-amber-200',
      PROCESADO: 'bg-blue-100 text-blue-800 border-blue-200',
      ANULADO: 'bg-gray-100 text-gray-800 border-gray-200',
      RESERVADO: 'bg-sky-100 text-sky-800 border-sky-200',
    };
    return clases[estado] || clases.RESERVADO;
  };

  const getEstadoTexto = (estado: EstadoReserva): string => {
    const traducciones = {
      CONFIRMADA: t('reservas.estado.confirmada'),
      CANCELADA: t('reservas.estado.cancelada'),
      PENDIENTE: t('reservas.estado.pendiente'),
      PROCESADO: t('reservas.estado.procesado'),
      ANULADO: t('reservas.estado.anulado'),
      RESERVADO: t('reservas.estado.reservado'),
    };
    return traducciones[estado] || estado;
  };

  const calcularTotalPasajeros = (): number => {
    if (!reserva) return 0;
    const totalIndividuales = reserva.cantidad_pasajes?.reduce((sum, p) => sum + (p.cantidad || 0), 0) || 0;
    const totalPaquetes = reserva.paquetes?.reduce((sum, paquete) => {
      return sum + (paquete.cantidad_total || paquete.desglose_pasajes?.reduce((s, d) => s + (d.cantidad || 0), 0) || 0) * (paquete.cantidad || 0);
    }, 0) || 0;
    return totalIndividuales + totalPaquetes;
  };

  const getDesglosePasajeros = () => {
    if (!reserva) return {};
    const desglose: Record<string, { individuales: number; paquetes: number; total: number }> = {};
    const inicializar = (tipo: string) => {
      if (!desglose[tipo]) desglose[tipo] = { individuales: 0, paquetes: 0, total: 0 };
    };
    reserva.cantidad_pasajes?.forEach(p => {
      const tipo = p.nombre_tipo || 'Pasajero';
      inicializar(tipo);
      desglose[tipo].individuales += p.cantidad || 0;
      desglose[tipo].total += p.cantidad || 0;
    });
    reserva.paquetes?.forEach(paquete => {
      if (paquete.desglose_pasajes?.length) {
        paquete.desglose_pasajes.forEach(d => {
          const tipo = d.tipo || 'Pasajero';
          inicializar(tipo);
          const total = (d.cantidad || 0) * (paquete.cantidad || 0);
          desglose[tipo].paquetes += total;
          desglose[tipo].total += total;
        });
      } else if (paquete.cantidad_total) {
        const tipo = 'Pasajero';
        inicializar(tipo);
        desglose[tipo].paquetes += paquete.cantidad_total * (paquete.cantidad || 0);
        desglose[tipo].total += paquete.cantidad_total * (paquete.cantidad || 0);
      }
    });
    return desglose;
  };

  const generarPDF = () => {
    if (!reserva) return;
    const doc = new jsPDF();
    let y = 20;
    const hoy = new Date().toLocaleDateString('es-ES');

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Comprobante de Reserva', 20, y);
    doc.setFontSize(12);
    doc.text(`#${reserva.id} - ${getEstadoTexto(reserva.estado)}`, 20, y + 10);
    y += 20;
    doc.setFontSize(10);
    doc.text(`Fecha de creación: ${formatearFecha(reserva.fecha_reserva)}`, 20, y);
    y += 7;
    doc.text(`Total a pagar: S/ ${reserva.total_pagar.toFixed(2)}`, 20, y);
    y += 7;
    doc.text(`Total pasajeros: ${calcularTotalPasajeros()}`, 20, y);
    y += 7;
    if (reserva.nombre_vendedor) doc.text(`Vendedor: ${reserva.nombre_vendedor}`, 20, y);
    y += 10;

    if (reserva.nombre_tour) {
      doc.setFont('helvetica', 'bold');
      doc.text('Detalles del Tour:', 20, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.text(`${reserva.nombre_tour}`, 20, y);
      y += 7;
      if (reserva.descripcion_tour) {
        doc.text(reserva.descripcion_tour, 20, y, { maxWidth: 170 });
        y += 10;
      }
      doc.text(`Fecha: ${formatearFecha(reserva.fecha_tour)}`, 20, y);
      y += 7;
      doc.text(`Horario: ${formatearHora(reserva.hora_inicio_tour)} - ${formatearHora(reserva.hora_fin_tour)}`, 20, y);
      y += 10;
    }

    if (reserva.cantidad_pasajes?.length) {
      doc.setFont('helvetica', 'bold');
      doc.text('Pasajes Individuales:', 20, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      reserva.cantidad_pasajes.forEach(p => {
        doc.text(`${p.nombre_tipo || 'Pasajero'}: ${p.cantidad} x S/ ${p.precio_unitario?.toFixed(2) || 'N/A'} = S/ ${p.subtotal?.toFixed(2) || 'N/A'}`, 25, y);
        y += 7;
      });
      y += 5;
    }

    if (reserva.paquetes?.length) {
      doc.setFont('helvetica', 'bold');
      doc.text('Paquetes:', 20, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      reserva.paquetes.forEach(p => {
        const totalPas = p.cantidad_total || p.desglose_pasajes?.reduce((s, d) => s + d.cantidad, 0) || 0;
        doc.text(`${p.nombre_paquete || 'Paquete'}: ${p.cantidad} x ${totalPas} personas = S/ ${p.subtotal.toFixed(2)}`, 25, y);
        y += 7;
        if (p.desglose_pasajes?.length) {
          p.desglose_pasajes.forEach(d => {
            doc.text(`- ${d.tipo}: ${d.cantidad}`, 30, y);
            y += 7;
          });
        }
      });
      y += 5;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: S/ ${reserva.total_pagar.toFixed(2)}`, 20, y);
    y += 10;

    if (reserva.metodo_pago) {
      doc.text(`Método de pago: ${reserva.metodo_pago}`, 20, y);
      y += 7;
    }
    if (reserva.notas) {
      doc.text('Notas:', 20, y);
      y += 7;
      doc.text(reserva.notas, 20, y, { maxWidth: 170 });
      y += 10;
    }

    doc.setFontSize(8);
    doc.text(`Generado el ${hoy} - No válido como recibo fiscal`, 20, 280);
    doc.save(`reserva_${reserva.id}.pdf`);
  };

  if (!autenticado) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('auth.necesitaIniciarSesion')}</h2>
          <p className="text-gray-600 mb-6">{t('auth.iniciarParaVerReservas')}</p>
          <Link
            to={`/ingresar?redirect=/mis-reservas/${id}`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            aria-label={t('auth.iniciarSesion')}
          >
            <Users className="h-5 w-5 mr-2" />
            {t('auth.iniciarSesion')}
          </Link>
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center border border-blue-100">
            <Cargador tamanio="lg" color="text-blue-600" />
            <p className="mt-4 text-gray-600 text-lg">{t('reservas.cargandoDetalles')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <Alerta mensaje={error || t('reservas.noCargada')} tipo="error" />
            <div className="text-center mt-6">
              <Link
                to="/mis-reservas"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                aria-label={t('reservas.volverMisReservas')}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('reservas.volverMisReservas')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const desglosePasajeros = getDesglosePasajeros();
  const totalPasajeros = calcularTotalPasajeros();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
      <style>{`@media print { .no-print { display: none; } body { background: none; } .bg-white { box-shadow: none; border: none; } }`}</style>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6 border border-blue-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{reserva.nombre_tour || t('reservas.tour')} #{reserva.id}</h1>
                <p className="text-gray-600">{formatearFecha(reserva.fecha_tour, 'completo')} | {formatearHora(reserva.hora_inicio_tour)} - {formatearHora(reserva.hora_fin_tour)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-emerald-600">S/ {reserva.total_pagar.toFixed(2)}</span>
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${getEstadoClase(reserva.estado)}`}>{getEstadoTexto(reserva.estado)}</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <Users className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <div className="text-sm text-gray-500">{t('reservas.totalPasajeros')}</div>
                <div className="font-bold text-purple-600">{totalPasajeros}</div>
              </div>
              <div className="text-center">
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <div className="text-sm text-gray-500">{t('reservas.fechaReserva')}</div>
                <div className="font-bold text-gray-900">{formatearFecha(reserva.fecha_reserva, 'corto')}</div>
              </div>
              <div className="text-center">
                <CreditCard className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <div className="text-sm text-gray-500">{t('reservas.metodoPago')}</div>
                <div className="font-bold text-gray-900">{reserva.metodo_pago || 'N/A'}</div>
              </div>
              <div className="text-center">
                <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <div className="text-sm text-gray-500">{t('reservas.sede')}</div>
                <div className="font-bold text-gray-900">{reserva.sede?.nombre || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Tour Details */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                  {t('reservas.detallesTour')}
                </h2>
                {reserva.descripcion_tour && <p className="text-gray-600 mb-6">{reserva.descripcion_tour}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">{t('reservas.fechaTour')}</div>
                      <div className="font-semibold text-gray-900">{formatearFecha(reserva.fecha_tour, 'completo')}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">{t('reservas.horario')}</div>
                      <div className="font-semibold text-gray-900">
                        {formatearHora(reserva.hora_inicio_tour)} - {formatearHora(reserva.hora_fin_tour)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Breakdown */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  {t('reservas.desglosePasajeros')}
                </h3>
                {Object.keys(desglosePasajeros).length === 0 ? (
                  <p className="text-gray-600">{t('reservas.noPasajeros')}</p>
                ) : (
                  Object.entries(desglosePasajeros).map(([tipo, datos]) => (
                    <div key={tipo} className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-4 transition-all hover:shadow-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-700">{datos.total}</div>
                          <div className="text-sm font-medium text-blue-600">{tipo}</div>
                          {datos.individuales > 0 && <div className="text-xs text-gray-600">{t('reservas.individuales')}: {datos.individuales}</div>}
                          {datos.paquetes > 0 && <div className="text-xs text-gray-600">{t('reservas.enPaquetes')}: {datos.paquetes}</div>}
                        </div>
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  ))
                )}

                {reserva.cantidad_pasajes?.length ? (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="h-5 w-5 text-blue-600 mr-2" />
                      {t('reservas.pasajesIndividuales')}
                    </h4>
                    {reserva.cantidad_pasajes.map((pasaje, index) => (
                      <div key={index} className="bg-blue-50 rounded-xl p-5 border border-blue-100 mb-4 transition-all hover:shadow-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-900">{pasaje.nombre_tipo || 'Pasajero'}</div>
                            <div className="text-sm text-gray-600">{t('reservas.cantidad')}: {pasaje.cantidad}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">S/ {pasaje.subtotal?.toFixed(2) || 'N/A'}</div>
                            <div className="text-xs text-gray-600">
                              {pasaje.precio_unitario ? `${pasaje.cantidad} x S/ ${pasaje.precio_unitario.toFixed(2)}` : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {reserva.paquetes?.length ? (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="h-5 w-5 text-emerald-600 mr-2" />
                      {t('reservas.paquetesAdquiridos')}
                    </h4>
                    {reserva.paquetes.map((paquete, index) => {
                      const totalPas = paquete.cantidad_total || paquete.desglose_pasajes?.reduce((s, d) => s + d.cantidad, 0) || 0;
                      return (
                        <div key={index} className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 mb-4 transition-all hover:shadow-md">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <div className="font-bold text-gray-900 text-lg">{paquete.nombre_paquete || 'Paquete'}</div>
                              <div className="text-sm text-gray-600">{paquete.cantidad} x {totalPas} {t('reservas.personas')}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-emerald-600">S/ {paquete.subtotal.toFixed(2)}</div>
                              <div className="text-xs text-gray-600">{t('reservas.unitario')}: S/ {paquete.precio_unitario.toFixed(2)}</div>
                            </div>
                          </div>
                          {paquete.desglose_pasajes?.length ? (
                            <details className="group">
                              <summary className="text-sm font-medium text-emerald-700 cursor-pointer flex items-center">
                                {t('reservas.verDesglose')}
                                <svg className="h-4 w-4 ml-2 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </summary>
                              <div className="mt-4 space-y-2 text-sm text-gray-600">
                                {paquete.desglose_pasajes.map((d, i) => (
                                  <div key={i}>{d.tipo}: {d.cantidad}</div>
                                ))}
                              </div>
                            </details>
                          ) : paquete.cantidad_total ? (
                            <div className="text-sm text-gray-600">{t('reservas.totalPersonas')}: {paquete.cantidad_total}</div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {/* Additional Information */}
              {(reserva.notas || reserva.metodo_pago) && (
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FileText className="h-6 w-6 text-blue-600 mr-3" />
                    {t('reservas.informacionAdicional')}
                  </h3>
                  <div className="space-y-6">
                    {reserva.notas && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-2" />
                          {t('reservas.notasReserva')}
                        </h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-gray-700">{reserva.notas}</p>
                        </div>
                      </div>
                    )}
                    {reserva.metodo_pago && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <CreditCard className="h-5 w-5 text-emerald-500 mr-2" />
                          {t('reservas.metodoPago')}
                        </h4>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                          <p className="text-gray-700">{reserva.metodo_pago}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {reserva.cliente && (
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    {t('reservas.cliente')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">{t('reservas.nombreCompleto')}</div>
                      <div className="font-semibold text-gray-900">{reserva.nombre_cliente || `${reserva.cliente.nombres} ${reserva.cliente.apellidos}`}</div>
                    </div>
                    {reserva.cliente.email && (
                      <div>
                        <div className="text-sm text-gray-500">{t('reservas.email')}</div>
                        <div className="text-gray-900">{reserva.cliente.email}</div>
                      </div>
                    )}
                    {reserva.cliente.telefono && (
                      <div>
                        <div className="text-sm text-gray-500">{t('reservas.telefono')}</div>
                        <div className="text-gray-900">{reserva.cliente.telefono}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {reserva.sede && (
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 text-blue-600 mr-2" />
                    {t('reservas.sede')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">{t('reservas.nombre')}</div>
                      <div className="font-semibold text-gray-900">{reserva.sede.nombre}</div>
                    </div>
                    {reserva.sede.direccion && (
                      <div>
                        <div className="text-sm text-gray-500">{t('reservas.direccion')}</div>
                        <div className="text-gray-900">{reserva.sede.direccion}</div>
                      </div>
                    )}
                    {reserva.sede.telefono && (
                      <div>
                        <div className="text-sm text-gray-500">{t('reservas.telefono')}</div>
                        <div className="text-gray-900">{reserva.sede.telefono}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  {t('reservas.fechasImportantes')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">{t('reservas.reservaCreada')}</div>
                    <div className="text-gray-900">{formatearFecha(reserva.fecha_reserva, 'corto')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{t('reservas.ultimaActualizacion')}</div>
                    <div className="text-gray-900">{formatearFecha(reserva.fecha_actualizacion, 'corto')}</div>
                  </div>
                  {reserva.fecha_expiracion && (
                    <div>
                      <div className="text-sm text-gray-500">{t('reservas.fechaExpiracion')}</div>
                      <div className="text-amber-600">{formatearFecha(reserva.fecha_expiracion, 'corto')}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100 no-print">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('reservas.acciones')}</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 transition-all font-medium"
                    aria-label={t('reservas.imprimirReserva')}
                  >
                    <Printer className="h-5 w-5 mr-2" />
                    {t('reservas.imprimirReserva')}
                  </button>
                  <button
                    onClick={generarPDF}
                    className="w-full flex items-center justify-center px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition-all font-medium"
                    aria-label={t('reservas.descargarPDF')}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    {t('reservas.descargarPDF')}
                  </button>
                  <Link
                    to="/mis-reservas"
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 transition-all font-medium"
                    aria-label={t('reservas.verTodasReservas')}
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    {t('reservas.verTodasReservas')}
                  </Link>
                  <Link
                    to="/tours"
                    className="w-full flex items-center justify-center px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition-all font-medium"
                    aria-label={t('reservas.explorarTours')}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    {t('reservas.explorarTours')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaDetalleReserva;