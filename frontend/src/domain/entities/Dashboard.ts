// Interfaces para el Dashboard
export interface DashboardMetricas {
  resumen_general: ResumenGeneral;
  ventas_por_mes: VentasMensuales[];
  reservas_por_estado: ReservasPorEstado[];
  tours_mas_vendidos: TourMasVendido[];
  ingresos_hoy: IngresosDiarios;
  proximos_tours: ProximoTour[];
  estadisticas_sedes?: EstadisticasSede[]; // Solo para admin
}

export interface ResumenGeneral {
  total_reservas: number;
  reservas_hoy: number;
  ingresos_total: number;
  ingresos_hoy: number;
  clientes_activos: number;
  tours_disponibles: number;
  total_embarcaciones: number;
  vendedores_activos: number;
}

export interface VentasMensuales {
  mes: string;
  ingresos: number;
  reservas: number;
  año: number;
}

export interface ReservasPorEstado {
  estado: string;
  cantidad: number;
}

export interface TourMasVendido {
  nombre_tour: string;
  cantidad: number;
  ingresos: number;
}

export interface IngresosDiarios {
  fecha: string;
  ingresos: number;
  meta: number;
}

export interface ProximoTour {
  id: number;
  nombre_tour: string;
  fecha: Date;
  hora_inicio: string;
  hora_fin: string;
  cupo: number;
  reservados: number;
  nombre_chofer: string;
  embarcacion: string;
  nombre_sede: string;
}

export interface EstadisticasSede {
  id_sede: number;
  nombre_sede: string;
  total_reservas: number;
  ingresos_total: number;
  tours_activos: number;
  vendedores: number;
  embarcaciones: number;
}

// Tipos de respuesta de la API
export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardMetricas;
}

export interface ResumenGeneralApiResponse {
  success: boolean;
  message: string;
  data: ResumenGeneral;
}

export interface VentasMensualesApiResponse {
  success: boolean;
  message: string;
  data: VentasMensuales[];
}

export interface EstadisticasSedesApiResponse {
  success: boolean;
  message: string;
  data: EstadisticasSede[];
}