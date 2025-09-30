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
import { Download, Printer, ArrowLeft, Users, MapPin, Clock, CreditCard, FileText, Calendar, Building, Package, Copy, Check } from 'lucide-react';
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
    if (!fechaStr) return 'N/A';
    
    try {
      let fecha: Date;
      
      if (fechaStr.includes('/')) {
        const [day, month, year] = fechaStr.split('/');
        if (year && month && day) {
          fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          return 'Fecha inválida';
        }
      } else if (fechaStr.includes('-')) {
        const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
        if (year && month && day && !isNaN(year) && !isNaN(month) && !isNaN(day)) {
          fecha = new Date(year, month - 1, day);
        } else {
          return 'Fecha inválida';
        }
      } else {
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
    if (!horaStr) return 'N/A';
    return horaStr.includes(':') ? horaStr.split(':').slice(0, 2).join(':') : horaStr;
  };

  const getEstadoClase = (estado: EstadoReserva): string => ({
    CONFIRMADA: 'bg-teal-50 text-teal-700 border-teal-200',
    CANCELADA: 'bg-red-50 text-red-700 border-red-200',
    PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
    PROCESADO: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    ANULADO: 'bg-gray-50 text-gray-600 border-gray-200',
    RESERVADO: 'bg-blue-50 text-blue-700 border-blue-200',
  })[estado] || 'bg-gray-50 text-gray-600 border-gray-200';

  const getEstadoTexto = (estado: EstadoReserva): string => ({
    CONFIRMADA: 'Confirmada',
    CANCELADA: 'Cancelada',
    PENDIENTE: 'Pendiente',
    PROCESADO: 'Procesado',
    ANULADO: 'Anulado',
    RESERVADO: 'Reservado',
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

    // Encabezado con estilo oceánico
    doc.setFillColor(14, 116, 144); // Teal
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Comprobante de Reserva', 20, y);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Reserva #${reserva.id}`, 20, y + 8);
    doc.text(`${getEstadoTexto(reserva.estado)}`, 20, y + 14);
    
    y = 45;
    doc.setTextColor(0, 0, 0);

    // Información principal
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 116, 144);
    doc.text('📅 Detalles del Tour', 20, y);
    y += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Tour: ${reserva.nombre_tour || 'N/A'}`, 20, y);
    y += 6;
    doc.text(`Fecha: ${formatearFecha(reserva.fecha_tour, 'completo')}`, 20, y);
    y += 6;
    doc.text(`Horario: ${formatearHora(reserva.hora_inicio_tour)} - ${formatearHora(reserva.hora_fin_tour)}`, 20, y);
    y += 10;

    // Resumen financiero
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 116, 144);
    doc.text('💰 Resumen Financiero', 20, y);
    y += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Pasajeros: ${calcularTotalPasajeros}`, 20, y);
    y += 6;
    doc.text(`Método de Pago: ${reserva.metodo_pago || 'N/A'}`, 20, y);
    y += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(5, 150, 105);
    doc.text(`TOTAL: S/ ${reserva.total_pagar.toFixed(2)}`, 20, y);
    y += 12;

    // Pasajes
    if (reserva.cantidad_pasajes?.length) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(14, 116, 144);
      doc.text('🎫 Pasajes Individuales', 20, y);
      y += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      reserva.cantidad_pasajes.forEach(p => {
        doc.text(`• ${p.nombre_tipo || 'Pasajero'}: ${p.cantidad} × S/ ${p.precio_unitario?.toFixed(2) || '0.00'} = S/ ${p.subtotal?.toFixed(2) || '0.00'}`, 25, y);
        y += 6;
      });
      y += 4;
    }

    // Paquetes
    if (reserva.paquetes?.length) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(14, 116, 144);
      doc.text('📦 Paquetes', 20, y);
      y += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      reserva.paquetes.forEach(p => {
        const totalPas = p.cantidad_total || p.desglose_pasajes?.reduce((s, d) => s + (d.cantidad || 0), 0) || 0;
        doc.text(`• ${p.nombre_paquete || 'Paquete'}: ${p.cantidad} × ${totalPas} personas = S/ ${p.subtotal.toFixed(2)}`, 25, y);
        y += 6;
        if (p.desglose_pasajes?.length) {
          p.desglose_pasajes.forEach(d => {
            doc.text(`  - ${d.tipo}: ${d.cantidad}`, 30, y);
            y += 5;
          });
        }
      });
      y += 4;
    }

    // Cliente
    if (reserva.cliente) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(14, 116, 144);
      doc.text('👤 Cliente', 20, y);
      y += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`${reserva.nombre_cliente || `${reserva.cliente.nombres} ${reserva.cliente.apellidos}`}`, 20, y);
      y += 6;
      if (reserva.cliente.email) {
        doc.text(`Email: ${reserva.cliente.email}`, 20, y);
        y += 6;
      }
      if (reserva.cliente.telefono) {
        doc.text(`Teléfono: ${reserva.cliente.telefono}`, 20, y);
        y += 6;
      }
      y += 4;
    }

    // Notas
    if (reserva.notas) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(14, 116, 144);
      doc.text('📝 Notas', 20, y);
      y += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const lines = doc.splitTextToSize(reserva.notas, 170);
      lines.forEach((line: string) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += 5;
      });
    }

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')} • No válido como recibo fiscal`, 20, 285);
    
    doc.save(`Reserva_${reserva.id}_${reserva.nombre_tour?.replace(/\s/g, '_') || 'Tour'}.pdf`);
  };

  if (!autenticado) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="text-center bg-white p-8 rounded-2xl shadow-md max-w-md border border-cyan-100">
          <div className="bg-gradient-to-br from-cyan-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Inicia sesión</h2>
          <p className="text-gray-600 text-sm mb-6">Accede para ver los detalles de tu reserva</p>
          <Link
            to={`/ingresar?redirect=/mis-reservas/${id}`}
            className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
          >
            Iniciar Sesión
          </Link>
        </div>
      </motion.div>
    );
  }

  if (cargando) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 text-center">
            <Cargador tamanio="lg" color="text-cyan-600" />
            <p className="mt-4 text-gray-600">Cargando detalles de tu reserva...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !reserva) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
            <Alerta mensaje={error || 'No se pudo cargar la reserva'} tipo="error" />
            <div className="text-center mt-6">
              <Link
                to="/mis-reservas"
                className="inline-flex items-center px-5 py-2.5 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-all shadow-md"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
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
      className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-white to-teal-50/30 py-8"
    >
      <style>{`
        @media print { 
          .no-print { display: none !important; } 
          body { background: white; } 
          .print-full { box-shadow: none !important; border: none !important; }
          .bg-gradient-to-br { background: white !important; }
        }
      `}</style>
      
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header compacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl shadow-lg p-6 mb-6 text-white print-full"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{reserva.nombre_tour || 'Tour'}</h1>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">#{reserva.id}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-cyan-50">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatearFecha(reserva.fecha_tour, 'corto')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatearHora(reserva.hora_inicio_tour)} - {formatearHora(reserva.hora_fin_tour)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold">S/ {reserva.total_pagar.toFixed(2)}</div>
                  <div className="text-xs text-cyan-100">{calcularTotalPasajeros} pasajeros</div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getEstadoClase(reserva.estado)} bg-white`}>
                  {getEstadoTexto(reserva.estado)}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-5">
              {/* Desglose de pasajeros - compacto */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 print-full"
              >
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="h-4 w-4 text-cyan-600 mr-2" />
                  Desglose de Pasajeros
                </h3>
                {Object.keys(getDesglosePasajeros).length === 0 ? (
                  <p className="text-sm text-gray-500">No hay pasajeros registrados</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(getDesglosePasajeros).map(([tipo, datos]) => (
                      <div key={tipo} className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg p-3 border border-cyan-100">
                        <div className="text-2xl font-bold text-cyan-700">{datos.total}</div>
                        <div className="text-xs font-medium text-gray-700">{tipo}</div>
                        {datos.individuales > 0 && <div className="text-xs text-gray-500">Indiv: {datos.individuales}</div>}
                        {datos.paquetes > 0 && <div className="text-xs text-gray-500">Paq: {datos.paquetes}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Pasajes individuales - compacto */}
              {reserva.cantidad_pasajes?.length ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 print-full"
                >
                  <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="h-4 w-4 text-cyan-600 mr-2" />
                    Pasajes Individuales
                  </h4>
                  <div className="space-y-2">
                    {reserva.cantidad_pasajes.map((pasaje, index) => (
                      <div key={index} className="flex justify-between items-center bg-cyan-50 rounded-lg p-3 border border-cyan-100">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{pasaje.nombre_tipo || 'Pasajero'}</div>
                          <div className="text-xs text-gray-500">Cantidad: {pasaje.cantidad}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-cyan-700">
                            S/ {pasaje.subtotal?.toFixed(2) || '0.00'}
                          </div>
                          {pasaje.precio_unitario && (
                            <div className="text-xs text-gray-500">
                              {pasaje.cantidad} × S/ {pasaje.precio_unitario.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              {/* Paquetes - compacto */}
              {reserva.paquetes?.length ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 print-full"
                >
                  <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="h-4 w-4 text-teal-600 mr-2" />
                    Paquetes Adquiridos
                  </h4>
                  <div className="space-y-2">
                    {reserva.paquetes.map((paquete, index) => {
                      const totalPas = paquete.cantidad_total || paquete.desglose_pasajes?.reduce((s, d) => s + (d.cantidad || 0), 0) || 0;
                      return (
                        <div key={index} className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{paquete.nombre_paquete || 'Paquete'}</div>
                              <div className="text-xs text-gray-500">
                                {paquete.cantidad} paquete{paquete.cantidad > 1 ? 's' : ''} × {totalPas} personas
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-teal-700">S/ {paquete.subtotal.toFixed(2)}</div>
                              <div className="text-xs text-gray-500">Unit: S/ {paquete.precio_unitario.toFixed(2)}</div>
                            </div>
                          </div>
                          {paquete.desglose_pasajes?.length ? (
                            <details className="mt-2 group">
                              <summary className="text-xs font-medium text-teal-700 cursor-pointer flex items-center hover:text-teal-800">
                                Ver desglose
                                <svg className="h-3 w-3 ml-1 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </summary>
                              <div className="mt-2 space-y-1 text-xs text-gray-600 pl-3 border-l-2 border-teal-200">
                                {paquete.desglose_pasajes.map((d, i) => (
                                  <div key={i}>• {d.tipo}: {d.cantidad}</div>
                                ))}
                              </div>
                            </details>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}

              {/* Información adicional - compacto */}
              {(reserva.notas || reserva.metodo_pago) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 print-full"
                >
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="h-4 w-4 text-cyan-600 mr-2" />
                    Información Adicional
                  </h3>
                  <div className="space-y-3">
                    {reserva.metodo_pago && (
                      <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="h-3.5 w-3.5 text-teal-600" />
                          <span className="text-xs font-medium text-gray-700">Método de Pago</span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">{reserva.metodo_pago}</p>
                      </div>
                    )}
                    {reserva.notas && (
                      <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-3.5 w-3.5 text-cyan-600" />
                          <span className="text-xs font-medium text-gray-700">Notas</span>
                        </div>
                        <p className="text-sm text-gray-700">{reserva.notas}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Columna lateral - compacta */}
            <div className="space-y-4">
              {/* Cliente */}
              {reserva.cliente && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 print-full"
                >
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Users className="h-3.5 w-3.5 text-cyan-600 mr-2" />
                    Cliente
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <div className="text-xs text-gray-500">Nombre</div>
                      <div className="font-medium text-gray-900">
                        {reserva.nombre_cliente || `${reserva.cliente.nombres} ${reserva.cliente.apellidos}`}
                      </div>
                    </div>
                    {reserva.cliente.email && (
                      <div>
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="text-gray-700 text-xs">{reserva.cliente.email}</div>
                      </div>
                    )}
                    {reserva.cliente.telefono && (
                      <div>
                        <div className="text-xs text-gray-500">Teléfono</div>
                        <div className="text-gray-700">{reserva.cliente.telefono}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Sede */}
              {reserva.sede && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 print-full"
                >
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Building className="h-3.5 w-3.5 text-cyan-600 mr-2" />
                    Sede
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="font-medium text-gray-900">{reserva.sede.nombre}</div>
                    {reserva.sede.direccion && (
                      <div className="text-xs text-gray-600">{reserva.sede.direccion}</div>
                    )}
                    {reserva.sede.telefono && (
                      <div className="text-xs text-gray-600">{reserva.sede.telefono}</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Fechas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 print-full"
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-3.5 w-3.5 text-cyan-600 mr-2" />
                  Fechas
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-gray-500">Reserva creada</div>
                    <div className="text-gray-900 font-medium">{formatearFecha(reserva.fecha_reserva, 'corto')}</div>
                  </div>
                  {reserva.fecha_actualizacion && reserva.fecha_actualizacion !== reserva.fecha_reserva && (
                    <div>
                      <div className="text-gray-500">Última actualización</div>
                      <div className="text-gray-900">{formatearFecha(reserva.fecha_actualizacion, 'corto')}</div>
                    </div>
                  )}
                  {reserva.fecha_expiracion && (
                    <div>
                      <div className="text-gray-500">Expira el</div>
                      <div className="text-amber-600 font-medium">{formatearFecha(reserva.fecha_expiracion, 'corto')}</div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Acciones - compactas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 no-print"
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Acciones</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 rounded-lg text-sm font-medium transition-all border border-cyan-200"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Imprimir
                  </button>
                  <button
                    onClick={generarPDF}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-sm font-medium transition-all border border-teal-200"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Descargar PDF
                  </button>
                  <button
                    onClick={copiarDetalles}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-all border border-blue-200"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copiar
                  </button>
                  <Link
                    to="/mis-reservas"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-all border border-gray-200"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Mis Reservas
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Notificación de copiado */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">¡Detalles copiados!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaginaDetalleReserva;