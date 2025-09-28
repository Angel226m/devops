 /*

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
          {/* Summary Card *//*}
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
              {/* Tour Details *//*}
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

              {/* Passenger Breakdown *//*}
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

              {/* Additional Information *//*}
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

export default PaginaDetalleReserva;*/
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Printer, ArrowLeft, Users, MapPin, Clock, CreditCard, FileText, Calendar, Building, Package, Copy } from 'lucide-react';
import jsPDF from 'jspdf';
import { RootState, AppDispatch } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
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
  const [copied, setCopied] = useState(false);

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
    if (!fechaStr) return t('reservas.fechaNoDisponible', 'N/A');
    try {
      const fecha = new Date(fechaStr.includes('/') ? fechaStr.split('/').reverse().join('-') : fechaStr);
      if (isNaN(fecha.getTime())) return t('reservas.fechaInvalida', 'Fecha inválida');
      return formato === 'relativo'
        ? formatDistanceToNow(fecha, { addSuffix: true, locale: es })
        : format(fecha, formato === 'completo' ? 'd MMMM yyyy' : 'd MMM yyyy', { locale: es });
    } catch {
      return t('reservas.fechaInvalida', 'Fecha inválida');
    }
  };

  const formatearHora = (horaStr?: string): string => {
    if (!horaStr) return 'N/A';
    return horaStr.includes(':') ? horaStr.split(':').slice(0, 2).join(':') : horaStr;
  };

  const getEstadoClase = (estado: EstadoReserva): string => ({
    CONFIRMADA: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    CANCELADA: 'bg-rose-100 text-rose-700 border-rose-200',
    PENDIENTE: 'bg-amber-100 text-amber-700 border-amber-200',
    PROCESADO: 'bg-blue-100 text-blue-700 border-blue-200',
    ANULADO: 'bg-gray-100 text-gray-700 border-gray-200',
    RESERVADO: 'bg-purple-100 text-purple-700 border-purple-200',
  })[estado] || 'bg-gray-100 text-gray-700 border-gray-200';

  const getEstadoTexto = (estado: EstadoReserva): string => ({
    CONFIRMADA: t('reservas.estado.confirmada', 'Confirmada'),
    CANCELADA: t('reservas.estado.cancelada', 'Cancelada'),
    PENDIENTE: t('reservas.estado.pendiente', 'Pendiente'),
    PROCESADO: t('reservas.estado.procesado', 'Procesado'),
    ANULADO: t('reservas.estado.anulado', 'Anulado'),
    RESERVADO: t('reservas.estado.reservado', 'Reservado'),
  })[estado] || estado;

  const calcularTotalPasajeros = useMemo(() => {
    if (!reserva) return 0;
    const totalIndividuales = (reserva.cantidad_pasajes || []).reduce((sum, p) => sum + (p.cantidad || 0), 0);
    const totalPaquetes = (reserva.paquetes || []).reduce((sum, paquete) => {
      return sum + ((paquete.cantidad_total || (paquete.desglose_pasajes?.reduce((s, d) => s + (d.cantidad || 0), 0) || 0)) * (paquete.cantidad || 0));
    }, 0);
    return totalIndividuales + totalPaquetes;
  }, [reserva]);

  const getDesglosePasajeros = useMemo(() => {
    if (!reserva) return {};
    const desglose: Record<string, { individuales: number; paquetes: number; total: number }> = {};
    (reserva.cantidad_pasajes || []).forEach(p => {
      const tipo = p.nombre_tipo || 'Pasajero';
      desglose[tipo] = desglose[tipo] || { individuales: 0, paquetes: 0, total: 0 };
      desglose[tipo].individuales += p.cantidad || 0;
      desglose[tipo].total += p.cantidad || 0;
    });
    (reserva.paquetes || []).forEach(paquete => {
      if (paquete.desglose_pasajes?.length) {
        paquete.desglose_pasajes.forEach(d => {
          const tipo = d.tipo || 'Pasajero';
          desglose[tipo] = desglose[tipo] || { individuales: 0, paquetes: 0, total: 0 };
          const total = (d.cantidad || 0) * (paquete.cantidad || 0);
          desglose[tipo].paquetes += total;
          desglose[tipo].total += total;
        });
      } else if (paquete.cantidad_total) {
        const tipo = 'Pasajero';
        desglose[tipo] = desglose[tipo] || { individuales: 0, paquetes: 0, total: 0 };
        desglose[tipo].paquetes += paquete.cantidad_total * (paquete.cantidad || 0);
        desglose[tipo].total += paquete.cantidad_total * (paquete.cantidad || 0);
      }
    });
    return desglose;
  }, [reserva]);

  const copiarDetalles = () => {
    if (!reserva) return;
    const texto = `
Reserva #${reserva.id}
Tour: ${reserva.nombre_tour || 'N/A'}
Fecha: ${formatearFecha(reserva.fecha_tour, 'completo')}
Horario: ${formatearHora(reserva.hora_inicio_tour)} - ${formatearHora(reserva.hora_fin_tour)}
Total Pasajeros: ${calcularTotalPasajeros}
Total a Pagar: S/ ${reserva.total_pagar.toFixed(2)}
Estado: ${getEstadoTexto(reserva.estado)}
Método de Pago: ${reserva.metodo_pago || 'N/A'}
Cliente: ${reserva.nombre_cliente || `${reserva.cliente?.nombres} ${reserva.cliente?.apellidos}`}
Sede: ${reserva.sede?.nombre || 'N/A'}
    `.trim();
    navigator.clipboard.writeText(texto).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const generarPDF = () => {
    if (!reserva) return;
    const doc = new jsPDF();
    let y = 20;
    const hoy = new Date().toLocaleDateString('es-ES');

    // Encabezado
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Comprobante de Reserva', 20, y);
    doc.setFontSize(12);
    doc.text(`Reserva #${reserva.id} - ${getEstadoTexto(reserva.estado)}`, 20, y + 8);
    y += 16;

    // Línea divisoria
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 102, 204);
    doc.line(20, y, 190, y);
    y += 10;

    // Resumen
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen:', 20, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de creación: ${formatearFecha(reserva.fecha_reserva, 'corto')}`, 20, y);
    y += 6;
    doc.text(`Total a pagar: S/ ${reserva.total_pagar.toFixed(2)}`, 20, y);
    y += 6;
    doc.text(`Total pasajeros: ${calcularTotalPasajeros}`, 20, y);
    y += 6;
    if (reserva.nombre_vendedor) doc.text(`Vendedor: ${reserva.nombre_vendedor}`, 20, y);
    y += 10;

    // Detalles del Tour
    if (reserva.nombre_tour) {
      doc.setFont('helvetica', 'bold');
      doc.text('Detalles del Tour:', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.text(reserva.nombre_tour, 20, y);
      y += 6;
      if (reserva.descripcion_tour) {
        const lines = doc.splitTextToSize(reserva.descripcion_tour, 160);
        lines.forEach((line: string) => {
          doc.text(line, 20, y);
          y += 6;
        });
        y += 4;
      }
      doc.text(`Fecha: ${formatearFecha(reserva.fecha_tour, 'corto')}`, 20, y);
      y += 6;
      doc.text(`Horario: ${formatearHora(reserva.hora_inicio_tour)} - ${formatearHora(reserva.hora_fin_tour)}`, 20, y);
      y += 10;
    }

    // Pasajes Individuales
    if (reserva.cantidad_pasajes?.length) {
      doc.setFont('helvetica', 'bold');
      doc.text('Pasajes Individuales:', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      reserva.cantidad_pasajes.forEach(p => {
        doc.text(`${p.nombre_tipo || 'Pasajero'}: ${p.cantidad} x S/ ${p.precio_unitario?.toFixed(2) || 'N/A'} = S/ ${p.subtotal?.toFixed(2) || 'N/A'}`, 25, y);
        y += 6;
      });
      y += 6;
    }

    // Paquetes
    if (reserva.paquetes?.length) {
      doc.setFont('helvetica', 'bold');
      doc.text('Paquetes:', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      reserva.paquetes.forEach(p => {
        const totalPas = p.cantidad_total || p.desglose_pasajes?.reduce((s, d) => s + (d.cantidad || 0), 0) || 0;
        doc.text(`${p.nombre_paquete || 'Paquete'}: ${p.cantidad} x ${totalPas} personas = S/ ${p.subtotal.toFixed(2)}`, 25, y);
        y += 6;
        if (p.desglose_pasajes?.length) {
          p.desglose_pasajes.forEach(d => {
            doc.text(`- ${d.tipo}: ${d.cantidad}`, 30, y);
            y += 6;
          });
        }
      });
      y += 6;
    }

    // Total
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: S/ ${reserva.total_pagar.toFixed(2)}`, 20, y);
    y += 10;

    // Método de Pago y Notas
    if (reserva.metodo_pago) {
      doc.setFont('helvetica', 'bold');
      doc.text('Método de Pago:', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.text(reserva.metodo_pago, 20, y);
      y += 8;
    }
    if (reserva.notas) {
      doc.setFont('helvetica', 'bold');
      doc.text('Notas:', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(reserva.notas, 160);
      lines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += 6;
      });
      y += 4;
    }

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Generado el ${hoy} - No válido como recibo fiscal`, 20, 280);
    doc.save(`reserva_${reserva.id}_${Date.now()}.pdf`);
  };

  if (!autenticado) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex items-center justify-center min-h-[60vh] bg-transparent"
      >
        <div className="text-center bg-white p-6 rounded-3xl shadow-lg max-w-md w-full border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('auth.necesitaIniciarSesion', 'Inicia sesión')}</h2>
          <p className="text-gray-500 mb-6">{t('auth.iniciarParaVerReservas', 'Inicia sesión para ver tus reservas')}</p>
          <Link
            to={`/ingresar?redirect=/mis-reservas/${id}`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            aria-label={t('auth.iniciarSesion', 'Iniciar Sesión')}
          >
            <Users className="h-5 w-5 mr-2" />
            {t('auth.iniciarSesion', 'Iniciar Sesión')}
          </Link>
        </div>
      </motion.div>
    );
  }

  if (cargando) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-transparent py-12"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 text-center border border-blue-100">
            <Cargador tamanio="lg" color="text-blue-600" />
            <p className="mt-4 text-gray-500 text-lg">{t('reservas.cargandoDetalles', 'Cargando detalles...')}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !reserva) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-transparent py-12"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
            <Alerta mensaje={error || t('reservas.noCargada', 'No se pudo cargar la reserva')} tipo="error" />
            <div className="text-center mt-6">
              <Link
                to="/mis-reservas"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                aria-label={t('reservas.volverMisReservas', 'Volver a Mis Reservas')}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('reservas.volverMisReservas', 'Volver a Mis Reservas')}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-transparent py-12"
    >
      <style>{`@media print { .no-print { display: none; } body { background: none; } .bg-white { box-shadow: none; border: none; } .bg-blue-50, .bg-emerald-50, .bg-purple-50 { background: none; } }`}</style>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-blue-100"
            role="region"
            aria-label="Resumen de la reserva"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">{reserva.nombre_tour || t('reservas.tour', 'Tour')} #{reserva.id}</h1>
                <p className="text-gray-500 mt-1">{formatearFecha(reserva.fecha_tour, 'completo')} | {formatearHora(reserva.hora_inicio_tour)} - {formatearHora(reserva.hora_fin_tour)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-emerald-600">S/ {reserva.total_pagar.toFixed(2)}</span>
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${getEstadoClase(reserva.estado)}`}>{getEstadoTexto(reserva.estado)}</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <Users className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                <div className="text-sm text-gray-500">{t('reservas.totalPasajeros', 'Total Pasajeros')}</div>
                <div className="font-semibold text-purple-600">{calcularTotalPasajeros}</div>
              </div>
              <div className="text-center">
                <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <div className="text-sm text-gray-500">{t('reservas.fechaReserva', 'Fecha Reserva')}</div>
                <div className="font-semibold text-gray-900">{formatearFecha(reserva.fecha_reserva, 'corto')}</div>
              </div>
              <div className="text-center">
                <CreditCard className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-sm text-gray-500">{t('reservas.metodoPago', 'Método Pago')}</div>
                <div className="font-semibold text-gray-900">{reserva.metodo_pago || 'N/A'}</div>
              </div>
              <div className="text-center">
                <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <div className="text-sm text-gray-500">{t('reservas.sede', 'Sede')}</div>
                <div className="font-semibold text-gray-900">{reserva.sede?.nombre || 'N/A'}</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Tour Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100"
                role="region"
                aria-label="Detalles del tour"
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  {t('reservas.detallesTour', 'Detalles del Tour')}
                </h2>
                {reserva.descripcion_tour && <p className="text-gray-500 mb-6">{reserva.descripcion_tour}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">{t('reservas.fechaTour', 'Fecha del Tour')}</div>
                      <div className="font-semibold text-gray-900">{formatearFecha(reserva.fecha_tour, 'completo')}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-emerald-600 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">{t('reservas.horario', 'Horario')}</div>
                      <div className="font-semibold text-gray-900">
                        {formatearHora(reserva.hora_inicio_tour)} - {formatearHora(reserva.hora_fin_tour)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Passenger Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100"
                role="region"
                aria-label="Desglose de pasajeros"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  {t('reservas.desglosePasajeros', 'Desglose de Pasajeros')}
                </h3>
                {Object.keys(getDesglosePasajeros).length === 0 ? (
                  <p className="text-gray-500">{t('reservas.noPasajeros', 'No hay pasajeros registrados')}</p>
                ) : (
                  Object.entries(getDesglosePasajeros).map(([tipo, datos], index) => (
                    <motion.div
                      key={tipo}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-4 transition-all hover:shadow-md hover:scale-102"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-semibold text-blue-700">{datos.total}</div>
                          <div className="text-sm font-medium text-blue-600">{tipo}</div>
                          {datos.individuales > 0 && <div className="text-xs text-gray-500">{t('reservas.individuales', 'Individuales')}: {datos.individuales}</div>}
                          {datos.paquetes > 0 && <div className="text-xs text-gray-500">{t('reservas.enPaquetes', 'En paquetes')}: {datos.paquetes}</div>}
                        </div>
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </motion.div>
                  ))
                )}

                {reserva.cantidad_pasajes?.length ? (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="h-5 w-5 text-blue-600 mr-2" />
                      {t('reservas.pasajesIndividuales', 'Pasajes Individuales')}
                    </h4>
                    {reserva.cantidad_pasajes.map((pasaje, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-4 transition-all hover:shadow-md hover:scale-102"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-900">{pasaje.nombre_tipo || 'Pasajero'}</div>
                            <div className="text-sm text-gray-500">{t('reservas.cantidad', 'Cantidad')}: {pasaje.cantidad}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-blue-600">S/ {pasaje.subtotal?.toFixed(2) || 'N/A'}</div>
                            <div className="text-xs text-gray-500">
                              {pasaje.precio_unitario ? `${pasaje.cantidad} x S/ ${pasaje.precio_unitario.toFixed(2)}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : null}

                {reserva.paquetes?.length ? (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="h-5 w-5 text-emerald-600 mr-2" />
                      {t('reservas.paquetesAdquiridos', 'Paquetes Adquiridos')}
                    </h4>
                    {reserva.paquetes.map((paquete, index) => {
                      const totalPas = paquete.cantidad_total || paquete.desglose_pasajes?.reduce((s, d) => s + (d.cantidad || 0), 0) || 0;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 mb-4 transition-all hover:shadow-md hover:scale-102"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <div className="font-semibold text-gray-900">{paquete.nombre_paquete || 'Paquete'}</div>
                              <div className="text-sm text-gray-500">{paquete.cantidad} x {totalPas} {t('reservas.personas', 'personas')}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-emerald-600">S/ {paquete.subtotal.toFixed(2)}</div>
                              <div className="text-xs text-gray-500">{t('reservas.unitario', 'Unitario')}: S/ ${paquete.precio_unitario.toFixed(2)}</div>
                            </div>
                          </div>
                          {paquete.desglose_pasajes?.length ? (
                            <details className="group">
                              <summary className="text-sm font-medium text-emerald-700 cursor-pointer flex items-center">
                                {t('reservas.verDesglose', 'Ver desglose')}
                                <svg className="h-4 w-4 ml-2 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </summary>
                              <div className="mt-2 space-y-1 text-sm text-gray-500">
                                {paquete.desglose_pasajes.map((d, i) => (
                                  <div key={i}>{d.tipo}: {d.cantidad}</div>
                                ))}
                              </div>
                            </details>
                          ) : paquete.cantidad_total ? (
                            <div className="text-sm text-gray-500">{t('reservas.totalPersonas', 'Total personas')}: {paquete.cantidad_total}</div>
                          ) : null}
                        </motion.div>
                      );
                    })}
                  </div>
                ) : null}
              </motion.div>

              {/* Additional Information */}
              {(reserva.notas || reserva.metodo_pago) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100"
                  role="region"
                  aria-label="Información adicional"
                >
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    {t('reservas.informacionAdicional', 'Información Adicional')}
                  </h3>
                  <div className="space-y-4">
                    {reserva.notas && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                          <FileText className="h-5 w-5 text-blue-600 mr-2" />
                          {t('reservas.notasReserva', 'Notas de la Reserva')}
                        </h4>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <p className="text-gray-700">{reserva.notas}</p>
                        </div>
                      </div>
                    )}
                    {reserva.metodo_pago && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                          <CreditCard className="h-5 w-5 text-emerald-600 mr-2" />
                          {t('reservas.metodoPago', 'Método de Pago')}
                        </h4>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                          <p className="text-gray-700">{reserva.metodo_pago}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {reserva.cliente && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100"
                  role="region"
                  aria-label="Información del cliente"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    {t('reservas.cliente', 'Cliente')}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">{t('reservas.nombreCompleto', 'Nombre Completo')}</div>
                      <div className="font-semibold text-gray-900">{reserva.nombre_cliente || `${reserva.cliente.nombres} ${reserva.cliente.apellidos}`}</div>
                    </div>
                    {reserva.cliente.email && (
                      <div>
                        <div className="text-sm text-gray-500">{t('reservas.email', 'Email')}</div>
                        <div className="text-gray-900">{reserva.cliente.email}</div>
                      </div>
                    )}
                    {reserva.cliente.telefono && (
                      <div>
                        <div className="text-sm text-gray-500">{t('reservas.telefono', 'Teléfono')}</div>
                        <div className="text-gray-900">{reserva.cliente.telefono}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              {reserva.sede && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100"
                  role="region"
                  aria-label="Información de la sede"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 text-blue-600 mr-2" />
                    {t('reservas.sede', 'Sede')}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">{t('reservas.nombre', 'Nombre')}</div>
                      <div className="font-semibold text-gray-900">{reserva.sede.nombre}</div>
                    </div>
                    {reserva.sede.direccion && (
                      <div>
                        <div className="text-sm text-gray-500">{t('reservas.direccion', 'Dirección')}</div>
                        <div className="text-gray-900">{reserva.sede.direccion}</div>
                      </div>
                    )}
                    {reserva.sede.telefono && (
                      <div>
                        <div className="text-sm text-gray-500">{t('reservas.telefono', 'Teléfono')}</div>
                        <div className="text-gray-900">{reserva.sede.telefono}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100"
                role="region"
                aria-label="Fechas importantes"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  {t('reservas.fechasImportantes', 'Fechas Importantes')}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">{t('reservas.reservaCreada', 'Reserva Creada')}</div>
                    <div className="text-gray-900">{formatearFecha(reserva.fecha_reserva, 'corto')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{t('reservas.ultimaActualizacion', 'Última Actualización')}</div>
                    <div className="text-gray-900">{formatearFecha(reserva.fecha_actualizacion, 'corto')}</div>
                  </div>
                  {reserva.fecha_expiracion && (
                    <div>
                      <div className="text-sm text-gray-500">{t('reservas.fechaExpiracion', 'Fecha de Expiración')}</div>
                      <div className="text-amber-600">{formatearFecha(reserva.fecha_expiracion, 'corto')}</div>
                    </div>
                  )}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100 no-print"
                role="region"
                aria-label="Acciones"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('reservas.acciones', 'Acciones')}</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full border border-blue-200 transition-all duration-300 font-medium transform hover:scale-105"
                    aria-label={t('reservas.imprimirReserva', 'Imprimir Reserva')}
                  >
                    <Printer className="h-5 w-5 mr-2" />
                    {t('reservas.imprimirReserva', 'Imprimir Reserva')}
                  </button>
                  <button
                    onClick={generarPDF}
                    className="w-full flex items-center justify-center px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 transition-all duration-300 font-medium transform hover:scale-105"
                    aria-label={t('reservas.descargarPDF', 'Descargar PDF')}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    {t('reservas.descargarPDF', 'Descargar PDF')}
                  </button>
                  <button
                    onClick={copiarDetalles}
                    className="w-full flex items-center justify-center px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full border border-purple-200 transition-all duration-300 font-medium transform hover:scale-105"
                    aria-label={t('reservas.copiarDetalles', 'Copiar Detalles')}
                  >
                    <Copy className="h-5 w-5 mr-2" />
                    {t('reservas.copiarDetalles', 'Copiar Detalles')}
                  </button>
                  <Link
                    to="/mis-reservas"
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full border border-gray-200 transition-all duration-300 font-medium transform hover:scale-105"
                    aria-label={t('reservas.verTodasReservas', 'Ver Todas las Reservas')}
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    {t('reservas.verTodasReservas', 'Ver Todas las Reservas')}
                  </Link>
                  <Link
                    to="/tours"
                    className="w-full flex items-center justify-center px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 transition-all duration-300 font-medium transform hover:scale-105"
                    aria-label={t('reservas.explorarTours', 'Explorar Tours')}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    {t('reservas.explorarTours', 'Explorar Tours')}
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg"
              >
                {t('reservas.copiado', '¡Detalles copiados al portapapeles!')}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PaginaDetalleReserva;