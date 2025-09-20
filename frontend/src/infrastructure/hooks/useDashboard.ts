import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback } from 'react';
import { RootState } from '../store';
import { 
  fetchMetricasCompletas,
  fetchResumenGeneral,
  fetchVentasPorMes,
  fetchEstadisticasSedes,
  clearErrors,
  resetDashboard
} from '../store/slices/dashboardSlice';
import { useAppDispatch } from '../store';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  
  const {
    metricas,
    resumenGeneral,
    ventasPorMes,
    estadisticasSedes,
    loading,
    loadingResumen,
    loadingVentas,
    loadingSedes,
    error,
    success
  } = useSelector((state: RootState) => state.dashboard);

  // Cargar métricas completas
  const cargarMetricasCompletas = useCallback(() => {
    dispatch(fetchMetricasCompletas());
  }, [dispatch]);

  // Cargar resumen general
  const cargarResumenGeneral = useCallback(() => {
    dispatch(fetchResumenGeneral());
  }, [dispatch]);

  // Cargar ventas por mes
  const cargarVentasPorMes = useCallback(() => {
    dispatch(fetchVentasPorMes());
  }, [dispatch]);

  // Cargar estadísticas de sedes (solo admin)
  const cargarEstadisticasSedes = useCallback(() => {
    dispatch(fetchEstadisticasSedes());
  }, [dispatch]);

  // Limpiar errores
  const limpiarErrores = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Reset dashboard
  const resetearDashboard = useCallback(() => {
    dispatch(resetDashboard());
  }, [dispatch]);

  // Auto-refresh cada 5 minutos para métricas críticas
  useEffect(() => {
    const interval = setInterval(() => {
      if (resumenGeneral) {
        cargarResumenGeneral();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [resumenGeneral, cargarResumenGeneral]);

  return {
    // Estado
    metricas,
    resumenGeneral,
    ventasPorMes,
    estadisticasSedes,
    loading,
    loadingResumen,
    loadingVentas,
    loadingSedes,
    error,
    success,

    // Acciones
    cargarMetricasCompletas,
    cargarResumenGeneral,
    cargarVentasPorMes,
    cargarEstadisticasSedes,
    limpiarErrores,
    resetearDashboard
  };
};