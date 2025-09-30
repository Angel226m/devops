 /*
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

  // ✅ FUNCIÓN PROFESIONAL PARA FORMATEAR FECHAS - CORREGIDA
  const formatearFecha = (fechaStr?: string, formato: 'completo' | 'corto' | 'relativo' = 'completo'): string => {
    if (!fechaStr) return t('reservas.fechaNoDisponible', 'N/A');
    
    try {
      let fecha: Date;
      
      // Si la fecha viene en formato DD/MM/YYYY
      if (fechaStr.includes('/')) {
        const [day, month, year] = fechaStr.split('/');
        if (year && month && day) {
          // Crear fecha específica sin problemas de zona horaria
          fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          return t('reservas.fechaInvalida', 'Fecha inválida');
        }
      } 
      // Si la fecha viene en formato ISO (YYYY-MM-DD) o similar
      else if (fechaStr.includes('-')) {
        const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
        if (year && month && day && !isNaN(year) && !isNaN(month) && !isNaN(day)) {
          // Crear fecha específica evitando problemas de zona horaria
          fecha = new Date(year, month - 1, day);
        } else {
          return t('reservas.fechaInvalida', 'Fecha inválida');
        }
      } 
      // Fallback para otros formatos
      else {
        fecha = new Date(fechaStr);
      }
      
      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        console.warn('📅 Fecha inválida:', fechaStr);
        return t('reservas.fechaInvalida', 'Fecha inválida');
      }
      
      // Formatear según el tipo solicitado
      switch (formato) {
        case 'relativo':
          return formatDistanceToNow(fecha, { addSuffix: true, locale: es });
        case 'completo':
          return format(fecha, 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es });
        case 'corto':
          return format(fecha, 'd MMM yyyy', { locale: es });
        default:
          return format(fecha, 'd MMMM yyyy', { locale: es });
      }
      
    } catch (error) {
      console.error('📅 Error al formatear fecha:', fechaStr, error);
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
          {/* Summary Card *//*}
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
                <span className={`px-4 py-1 rounded-full text-sm font-medium border ${getEstadoClase(reserva.estado)}`}>{getEstadoTexto(reserva.estado)}</span>
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
              {/* Tour Details *//*}
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

              {/* Passenger Breakdown *//*}
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

              {/* Additional Information *//*}
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

            {/* Sidebar *//*}
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
                className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg z-50"
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

export default PaginaDetalleReserva;*/



import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Printer, ArrowLeft, Users, MapPin, Clock, CreditCard, FileText, Calendar, Building, Package, Copy, Star, CheckCircle } from 'lucide-react';
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
  fecha_actualizacion?: string;
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

  // ✅ FUNCIÓN MEJORADA PARA FORMATEAR FECHAS
  const formatearFecha = (fechaStr?: string, formato: 'completo' | 'corto' | 'relativo' = 'completo'): string => {
    if (!fechaStr) return 'Fecha no disponible';
    
    try {
      let fecha: Date;
      
      // Si la fecha viene en formato DD/MM/YYYY
      if (fechaStr.includes('/')) {
        const [day, month, year] = fechaStr.split('/');
        if (year && month && day) {
          fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          return 'Fecha inválida';
        }
      } 
      // Si la fecha viene en formato ISO
      else if (fechaStr.includes('-')) {
        const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
        if (year && month && day && !isNaN(year) && !isNaN(month) && !isNaN(day)) {
          fecha = new Date(year, month - 1, day);
        } else {
          return 'Fecha inválida';
        }
      } 
      else {
        fecha = new Date(fechaStr);
      }
      
      if (isNaN(fecha.getTime())) {
        console.warn('📅 Fecha inválida:', fechaStr);
        return 'Fecha inválida';
      }
      
      switch (formato) {
        case 'relativo':
          return formatDistanceToNow(fecha, { addSuffix: true, locale: es });
        case 'completo':
          return format(fecha, 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es });
        case 'corto':
          return format(fecha, 'd MMM yyyy', { locale: es });
        default:
          return format(fecha, 'd MMMM yyyy', { locale: es });
      }
      
    } catch (error) {
      console.error('📅 Error al formatear fecha:', fechaStr, error);
      return 'Fecha inválida';
    }
  };

  const formatearHora = (horaStr?: string): string => {
    if (!horaStr) return 'No disponible';
    return horaStr.includes(':') ? horaStr.split(':').slice(0, 2).join(':') : horaStr;
  };

  const getEstadoClase = (estado: EstadoReserva): string => ({
    CONFIRMADA: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    CANCELADA: 'bg-red-100 text-red-800 border-red-300',
    PENDIENTE: 'bg-amber-100 text-amber-800 border-amber-300',
    PROCESADO: 'bg-blue-100 text-blue-800 border-blue-300',
    ANULADO: 'bg-gray-100 text-gray-800 border-gray-300',
    RESERVADO: 'bg-purple-100 text-purple-800 border-purple-300',
  })[estado] || 'bg-gray-100 text-gray-800 border-gray-300';

  const getEstadoTexto = (estado: EstadoReserva): string => ({
    CONFIRMADA: '✅ Confirmada',
    CANCELADA: '❌ Cancelada',
    PENDIENTE: '⏳ Pendiente',
    PROCESADO: '🔄 Procesado',
    ANULADO: '🚫 Anulado',
    RESERVADO: '📋 Reservado',
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

  const copiarDetalles = async () => {
    if (!reserva) return;
    
    const texto = `
🎫 RESERVA #${reserva.id}
━━━━━━━━━━━━━━━━━━━━━━━━
🏖️ Tour: ${reserva.nombre_tour || 'No disponible'}
📅 Fecha: ${formatearFecha(reserva.fecha_tour, 'completo')}
⏰ Horario: ${formatearHora(reserva.hora_inicio_tour)} - ${formatearHora(reserva.hora_fin_tour)}
👥 Total Pasajeros: ${calcularTotalPasajeros}
💰 Total a Pagar: S/ ${reserva.total_pagar.toFixed(2)}
📊 Estado: ${getEstadoTexto(reserva.estado)}
💳 Método de Pago: ${reserva.metodo_pago || 'No especificado'}
👤 Cliente: ${reserva.nombre_cliente || `${reserva.cliente?.nombres} ${reserva.cliente?.apellidos}`}
🏢 Sede: ${reserva.sede?.nombre || 'No especificado'}
📝 Creado: ${formatearFecha(reserva.fecha_reserva, 'corto')}
    `.trim();
    
    try {
      await navigator.clipboard.writeText(texto);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  // ✅ FUNCIÓN PDF COMPLETAMENTE REDISEÑADA Y MEJORADA
  const generarPDF = () => {
    if (!reserva) return;
    
    const doc = new jsPDF();
    let y = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // ✅ ENCABEZADO PROFESIONAL CON ESTILO
    doc.setFillColor(59, 130, 246); // Azul
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPROBANTE DE RESERVA', margin, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Reserva #${reserva.id} - ${getEstadoTexto(reserva.estado)}`, margin, 30);
    
    // Fecha de generación
    const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generado: ${fechaGeneracion}`, pageWidth - margin - 60, 30);
    
    y = 50;
    doc.setTextColor(0, 0, 0);
    
    // ✅ INFORMACIÓN PRINCIPAL EN TABLA ESTILIZADA
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 60, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, y, contentWidth, 60);
    
    y += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('📋 RESUMEN DE LA RESERVA', margin + 5, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const resumenData = [
      [`🎫 Tour:`, reserva.nombre_tour || 'No especificado'],
      [`📅 Fecha:`, formatearFecha(reserva.fecha_tour, 'completo')],
      [`⏰ Horario:`, `${formatearHora(reserva.hora_inicio_tour)} - ${formatearHora(reserva.hora_fin_tour)}`],
      [`👥 Pasajeros:`, `${calcularTotalPasajeros} personas`],
      [`💰 Total:`, `S/ ${reserva.total_pagar.toFixed(2)}`],
      [`💳 Pago:`, reserva.metodo_pago || 'No especificado']
    ];
    
    resumenData.forEach((item, index) => {
      const xPos = margin + 5 + (index % 2) * (contentWidth / 2);
      const yPos = y + Math.floor(index / 2) * 8;
      
      doc.setFont('helvetica', 'bold');
      doc.text(item[0], xPos, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(item[1], xPos + 25, yPos);
    });
    
    y += 35;
    
    // ✅ DETALLES DEL TOUR
    if (reserva.nombre_tour) {
      y += 10;
      doc.setFillColor(34, 197, 94);
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('🏖️ DETALLES DEL TOUR', margin + 5, y + 6);
      
      y += 15;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      if (reserva.descripcion_tour) {
        const descripcionLines = doc.splitTextToSize(reserva.descripcion_tour, contentWidth - 10);
        descripcionLines.forEach((line: string) => {
          doc.text(line, margin + 5, y);
          y += 6;
        });
        y += 5;
      }
    }
    
    // ✅ DESGLOSE DE PASAJEROS MEJORADO
    if (reserva.cantidad_pasajes?.length || reserva.paquetes?.length) {
      y += 5;
      doc.setFillColor(168, 85, 247);
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('👥 DESGLOSE DE PASAJEROS', margin + 5, y + 6);
      
      y += 15;
      doc.setTextColor(0, 0, 0);
      
      // Pasajes individuales
      if (reserva.cantidad_pasajes?.length) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('• Pasajes Individuales:', margin + 5, y);
        y += 8;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        reserva.cantidad_pasajes.forEach(p => {
          const precioTexto = p.precio_unitario ? `S/ ${p.precio_unitario.toFixed(2)}` : 'Precio no disponible';
          const subtotalTexto = p.subtotal ? `S/ ${p.subtotal.toFixed(2)}` : 'N/A';
          
          doc.text(`  - ${p.nombre_tipo || 'Pasajero'}: ${p.cantidad} x ${precioTexto} = ${subtotalTexto}`, margin + 10, y);
          y += 6;
        });
        y += 5;
      }
      
      // Paquetes
      if (reserva.paquetes?.length) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('• Paquetes:', margin + 5, y);
        y += 8;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        reserva.paquetes.forEach(p => {
          const totalPas = p.cantidad_total || p.desglose_pasajes?.reduce((s, d) => s + (d.cantidad || 0), 0) || 0;
          doc.text(`  - ${p.nombre_paquete || 'Paquete'}: ${p.cantidad} unidad(es) x ${totalPas} persona(s) = S/ ${p.subtotal.toFixed(2)}`, margin + 10, y);
          y += 6;
          
          if (p.desglose_pasajes?.length) {
            p.desglose_pasajes.forEach(d => {
              doc.text(`    • ${d.tipo}: ${d.cantidad} persona(s)`, margin + 15, y);
              y += 5;
            });
          }
          y += 3;
        });
      }
    }
    
    // ✅ INFORMACIÓN DEL CLIENTE
    if (reserva.cliente || reserva.nombre_cliente) {
      y += 10;
      doc.setFillColor(59, 130, 246);
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('👤 INFORMACIÓN DEL CLIENTE', margin + 5, y + 6);
      
      y += 15;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const nombreCompleto = reserva.nombre_cliente || `${reserva.cliente?.nombres} ${reserva.cliente?.apellidos}`;
      doc.text(`Nombre: ${nombreCompleto}`, margin + 5, y);
      y += 6;
      
      if (reserva.cliente?.email) {
        doc.text(`Email: ${reserva.cliente.email}`, margin + 5, y);
        y += 6;
      }
      
      if (reserva.cliente?.telefono) {
        doc.text(`Teléfono: ${reserva.cliente.telefono}`, margin + 5, y);
        y += 6;
      }
    }
    
    // ✅ TOTAL DESTACADO
    y += 15;
    doc.setFillColor(34, 197, 94);
    doc.rect(margin, y, contentWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL A PAGAR: S/ ${reserva.total_pagar.toFixed(2)}`, margin + 5, y + 10);
    
    // ✅ NOTAS SI EXISTEN
    if (reserva.notas) {
      y += 25;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('📝 Notas adicionales:', margin + 5, y);
      y += 8;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const notasLines = doc.splitTextToSize(reserva.notas, contentWidth - 10);
      notasLines.forEach((line: string) => {
        doc.text(line, margin + 5, y);
        y += 6;
      });
    }
    
    // ✅ PIE DE PÁGINA PROFESIONAL
    const footerY = doc.internal.pageSize.height - 20;
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Documento generado el ${fechaGeneracion}`, margin, footerY);
    doc.text('Este documento no constituye un recibo fiscal oficial', margin, footerY + 5);
    doc.text(`Reserva ID: ${reserva.id}`, pageWidth - margin - 40, footerY);
    
    // Guardar con nombre mejorado
    const nombreArchivo = `Reserva_${reserva.id}_${reserva.nombre_tour?.replace(/[^a-zA-Z0-9]/g, '_') || 'Tour'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nombreArchivo);
  };

  if (!autenticado) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="text-center bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-blue-200">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Acceso Requerido</h2>
            <p className="text-gray-600 mb-6">Necesitas iniciar sesión para ver los detalles de tu reserva</p>
          </div>
          <Link
            to={`/ingresar?redirect=/mis-reservas/${id}`}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
          >
            <Users className="h-5 w-5 mr-2" />
            Iniciar Sesión
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
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center border border-blue-200">
            <Cargador tamanio="lg" color="text-blue-600" />
            <p className="mt-6 text-gray-600 text-lg font-medium">Cargando detalles de tu reserva...</p>
            <p className="mt-2 text-gray-500 text-sm">Por favor espera un momento</p>
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
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-red-200">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <Alerta mensaje={error || 'No se pudo cargar la información de la reserva'} tipo="error" />
            <div className="text-center mt-8">
              <Link
                to="/mis-reservas"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver a Mis Reservas
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
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 py-8"
    >
      <style>{`
        @media print { 
          .no-print { display: none !important; } 
          body { background: white !important; } 
          .bg-gradient-to-br { background: white !important; }
          .shadow-2xl { box-shadow: none !important; } 
          .border { border: 1px solid #e5e7eb !important; }
        }
      `}</style>
      
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-6 mb-8 border border-blue-200 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-600/10 to-transparent rounded-bl-full"></div>
            <div className="relative">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        {reserva.nombre_tour || 'Tour Reservado'}
                      </h1>
                      <p className="text-blue-600 font-medium">Reserva #{reserva.id}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg">
                    📅 {formatearFecha(reserva.fecha_tour, 'completo')} 
                    <span className="mx-2">•</span>
                    ⏰ {formatearHora(reserva.hora_inicio_tour)} - {formatearHora(reserva.hora_fin_tour)}
                  </p>
                </div>
                <div className="flex flex-col lg:items-end gap-4">
                  <div className="text-center lg:text-right">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">
                      S/ {reserva.total_pagar.toFixed(2)}
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getEstadoClase(reserva.estado)}`}>
                      {getEstadoTexto(reserva.estado)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats mejorados */}
              <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Users, label: 'Total Pasajeros', value: calcularTotalPasajeros, color: 'purple' },
                  { icon: Calendar, label: 'Fecha Reserva', value: formatearFecha(reserva.fecha_reserva, 'corto'), color: 'blue' },
                  { icon: CreditCard, label: 'Método Pago', value: reserva.metodo_pago || 'No especificado', color: 'emerald' },
                  { icon: MapPin, label: 'Sede', value: reserva.sede?.nombre || 'No especificado', color: 'orange' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600 mx-auto mb-2`} />
                    <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                    <div className={`font-bold text-${stat.color}-700`}>{stat.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              {/* Detalles del Tour mejorados */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl shadow-2xl p-8 border border-blue-200"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  Detalles del Tour
                </h2>
                
                {reserva.descripcion_tour && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                    <p className="text-gray-700 leading-relaxed">{reserva.descripcion_tour}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center p-4 bg-blue-50 rounded-2xl border border-blue-200">
                    <Calendar className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <div className="text-sm text-blue-600 font-medium">Fecha del Tour</div>
                      <div className="font-bold text-gray-900">{formatearFecha(reserva.fecha_tour, 'completo')}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <Clock className="h-8 w-8 text-emerald-600 mr-4" />
                    <div>
                      <div className="text-sm text-emerald-600 font-medium">Horario</div>
                      <div className="font-bold text-gray-900">
                        {formatearHora(reserva.hora_inicio_tour)} - {formatearHora(reserva.hora_fin_tour)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Desglose de Pasajeros mejorado */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-2xl p-8 border border-purple-200"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  Desglose de Pasajeros
                </h3>

                {Object.keys(getDesglosePasajeros).length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No hay pasajeros registrados</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {Object.entries(getDesglosePasajeros).map(([tipo, datos], index) => (
                      <motion.div
                        key={tipo}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-2xl font-bold text-purple-700">{datos.total}</div>
                            <div className="text-lg font-semibold text-purple-600">{tipo}</div>
                            <div className="text-sm text-gray-600 mt-2">
                              {datos.individuales > 0 && <div>• Individuales: {datos.individuales}</div>}
                              {datos.paquetes > 0 && <div>• En paquetes: {datos.paquetes}</div>}
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pasajes Individuales */}
                {reserva.cantidad_pasajes?.length ? (
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="h-6 w-6 text-blue-600 mr-2" />
                      Pasajes Individuales
                    </h4>
                    <div className="space-y-4">
                      {reserva.cantidad_pasajes.map((pasaje, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-lg font-bold text-gray-900">{pasaje.nombre_tipo || 'Pasajero'}</div>
                              <div className="text-blue-600 font-medium">Cantidad: {pasaje.cantidad}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">
                                S/ {pasaje.subtotal?.toFixed(2) || 'N/A'}
                              </div>
                              {pasaje.precio_unitario && (
                                <div className="text-sm text-gray-600">
                                  {pasaje.cantidad} × S/ {pasaje.precio_unitario.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Paquetes */}
                {reserva.paquetes?.length ? (
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Package className="h-6 w-6 text-emerald-600 mr-2" />
                      Paquetes Adquiridos
                    </h4>
                    <div className="space-y-4">
                      {reserva.paquetes.map((paquete, index) => {
                        const totalPas = paquete.cantidad_total || paquete.desglose_pasajes?.reduce((s, d) => s + (d.cantidad || 0), 0) || 0;
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="text-lg font-bold text-gray-900">{paquete.nombre_paquete || 'Paquete'}</div>
                                <div className="text-emerald-600 font-medium">
                                  {paquete.cantidad} paquete(s) × {totalPas} personas
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-emerald-600">S/ {paquete.subtotal.toFixed(2)}</div>
                                <div className="text-sm text-gray-600">Unitario: S/ {paquete.precio_unitario.toFixed(2)}</div>
                              </div>
                            </div>
                            
                            {paquete.desglose_pasajes?.length ? (
                              <details className="group">
                                <summary className="text-sm font-semibold text-emerald-700 cursor-pointer flex items-center hover:text-emerald-800 transition-colors">
                                  <Star className="h-4 w-4 mr-2" />
                                  Ver desglose detallado
                                  <svg className="h-4 w-4 ml-2 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </summary>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                  {paquete.desglose_pasajes.map((d, i) => (
                                    <div key={i} className="bg-white rounded-lg p-3 border border-emerald-200">
                                      <div className="font-medium text-gray-900">{d.tipo}</div>
                                      <div className="text-emerald-600">{d.cantidad} persona(s)</div>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            ) : paquete.cantidad_total ? (
                              <div className="text-sm text-gray-600 bg-white rounded-lg p-3 border border-emerald-200">
                                <strong>Total de personas por paquete:</strong> {paquete.cantidad_total}
                              </div>
                            ) : null}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </motion.div>

              {/* Información adicional mejorada */}
              {(reserva.notas || reserva.metodo_pago) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-3xl shadow-2xl p-8 border border-emerald-200"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    Información Adicional
                  </h3>
                  
                  <div className="space-y-6">
                    {reserva.notas && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-5 w-5 text-emerald-600 mr-2" />
                          Notas de la Reserva
                        </h4>
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
                          <p className="text-gray-700 leading-relaxed">{reserva.notas}</p>
                        </div>
                      </div>
                    )}
                    
                    {reserva.metodo_pago && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                          <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                          Método de Pago
                        </h4>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
                          <p className="text-gray-700 font-semibold text-lg">{reserva.metodo_pago}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar mejorado */}
            <div className="space-y-6">
              {/* Información del cliente */}
              {reserva.cliente && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-3xl shadow-2xl p-6 border border-blue-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    Cliente
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                      <div className="text-sm text-blue-600 font-medium">Nombre Completo</div>
                      <div className="font-bold text-gray-900">
                        {reserva.nombre_cliente || `${reserva.cliente.nombres} ${reserva.cliente.apellidos}`}
                      </div>
                    </div>
                    {reserva.cliente.email && (
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="text-sm text-gray-600 font-medium">Email</div>
                        <div className="text-gray-900 break-all">{reserva.cliente.email}</div>
                      </div>
                    )}
                    {reserva.cliente.telefono && (
                      <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
                        <div className="text-sm text-green-600 font-medium">Teléfono</div>
                        <div className="text-gray-900">{reserva.cliente.telefono}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Información de la sede */}
              {reserva.sede && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-3xl shadow-2xl p-6 border border-orange-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mr-3">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    Sede
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
                      <div className="text-sm text-orange-600 font-medium">Nombre</div>
                      <div className="font-bold text-gray-900">{reserva.sede.nombre}</div>
                    </div>
                    {reserva.sede.direccion && (
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="text-sm text-gray-600 font-medium">Dirección</div>
                        <div className="text-gray-900">{reserva.sede.direccion}</div>
                      </div>
                    )}
                    {reserva.sede.telefono && (
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                        <div className="text-sm text-blue-600 font-medium">Teléfono</div>
                        <div className="text-gray-900">{reserva.sede.telefono}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Fechas importantes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-3xl shadow-2xl p-6 border border-purple-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  Fechas Importantes
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                    <div className="text-sm text-purple-600 font-medium">Reserva Creada</div>
                    <div className="font-bold text-gray-900">{formatearFecha(reserva.fecha_reserva, 'corto')}</div>
                  </div>
                  {reserva.fecha_actualizacion && (
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                      <div className="text-sm text-blue-600 font-medium">Última Actualización</div>
                      <div className="text-gray-900">{formatearFecha(reserva.fecha_actualizacion, 'corto')}</div>
                    </div>
                  )}
                  {reserva.fecha_expiracion && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                      <div className="text-sm text-amber-600 font-medium">Fecha de Expiración</div>
                      <div className="text-amber-700 font-semibold">{formatearFecha(reserva.fecha_expiracion, 'corto')}</div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Acciones mejoradas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-3xl shadow-2xl p-6 border border-emerald-200 no-print"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mr-3">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  Acciones
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      onClick: () => window.print(),
                      icon: Printer,
                      text: 'Imprimir Reserva',
                      color: 'blue',
                      gradient: 'from-blue-500 to-blue-600'
                    },
                    {
                      onClick: generarPDF,
                      icon: Download,
                      text: 'Descargar PDF',
                      color: 'emerald',
                      gradient: 'from-emerald-500 to-emerald-600'
                    },
                    {
                      onClick: copiarDetalles,
                      icon: Copy,
                      text: 'Copiar Detalles',
                      color: 'purple',
                      gradient: 'from-purple-500 to-purple-600'
                    }
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={`w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r ${action.gradient} text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105 hover:-translate-y-1`}
                    >
                      <action.icon className="h-5 w-5 mr-3" />
                      {action.text}
                    </button>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    {[
                      {
                        to: '/mis-reservas',
                        icon: FileText,
                        text: 'Ver Todas las Reservas',
                        color: 'gray-600'
                      },
                      {
                        to: '/tours',
                        icon: MapPin,
                        text: 'Explorar Más Tours',
                        color: 'emerald-600'
                      }
                    ].map((link, index) => (
                      <Link
                        key={index}
                        to={link.to}
                        className={`w-full flex items-center justify-center px-6 py-3 bg-white border-2 border-${link.color}/20 text-${link.color} rounded-2xl hover:bg-${link.color}/5 transition-all duration-300 font-medium transform hover:scale-105`}
                      >
                        <link.icon className="h-5 w-5 mr-3" />
                        {link.text}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Notificación de copiado mejorada */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 border border-emerald-500"
              >
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-semibold">¡Detalles copiados al portapapeles!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PaginaDetalleReserva;