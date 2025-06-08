import { 
  TourProgramado, 
  NuevoTourProgramadoRequest, 
  ActualizarTourProgramadoRequest,
  FiltrosTourProgramado,
  DisponibilidadHorario
} from '../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../application/ports/out/TourProgramadoRepository';
import axiosClient from '../api/axiosClient';
import { endpoints } from '../api/endpoints';

export class TourProgramadoRepoHttp implements TourProgramadoRepository {
  constructor(private readonly httpClient = axiosClient) {}

  async crear(tourProgramado: NuevoTourProgramadoRequest): Promise<number> {
    const response = await this.httpClient.post(endpoints.tourProgramado.create, tourProgramado);
    return response.data.data;
  }

  async obtenerPorId(id: number): Promise<TourProgramado> {
    const response = await this.httpClient.get(endpoints.tourProgramado.getById(id));
    return response.data.data;
  }

  async actualizar(id: number, tourProgramado: ActualizarTourProgramadoRequest): Promise<void> {
    await this.httpClient.put(endpoints.tourProgramado.update(id), tourProgramado);
  }

  async eliminar(id: number): Promise<void> {
    await this.httpClient.delete(endpoints.tourProgramado.delete(id));
  }

  async listar(filtros: FiltrosTourProgramado): Promise<TourProgramado[]> {
    // Convertir los filtros a query params
    const params = new URLSearchParams();
    
    if (filtros.id_sede) {
      params.append('id_sede', filtros.id_sede.toString());
    }
    
    if (filtros.id_tipo_tour) {
      params.append('id_tipo_tour', filtros.id_tipo_tour.toString());
    }
    
    if (filtros.id_chofer) {
      params.append('id_chofer', filtros.id_chofer.toString());
    }
    
    if (filtros.id_embarcacion) {
      params.append('id_embarcacion', filtros.id_embarcacion.toString());
    }
    
    if (filtros.estado) {
      params.append('estado', filtros.estado);
    }
    
    if (filtros.fecha_inicio) {
      params.append('fecha_inicio', filtros.fecha_inicio);
    }
    
    if (filtros.fecha_fin) {
      params.append('fecha_fin', filtros.fecha_fin);
    }
    
    if (filtros.vigencia_desde_ini) {
      params.append('vigencia_desde_ini', filtros.vigencia_desde_ini);
    }
    
    if (filtros.vigencia_desde_fin) {
      params.append('vigencia_desde_fin', filtros.vigencia_desde_fin);
    }
    
    if (filtros.vigencia_hasta_ini) {
      params.append('vigencia_hasta_ini', filtros.vigencia_hasta_ini);
    }
    
    if (filtros.vigencia_hasta_fin) {
      params.append('vigencia_hasta_fin', filtros.vigencia_hasta_fin);
    }
    
    const queryString = params.toString();
    const url = queryString ? `${endpoints.tourProgramado.list}?${queryString}` : endpoints.tourProgramado.list;
    
    const response = await this.httpClient.get(url);
    return response.data.data;
  }

  async asignarChofer(id: number, idChofer: number): Promise<void> {
    await this.httpClient.post(endpoints.tourProgramado.asignarChofer(id), { id_chofer: idChofer });
  }

  async cambiarEstado(id: number, estado: string): Promise<void> {
    await this.httpClient.post(`${endpoints.tourProgramado.cambiarEstado(id)}?estado=${estado}`);
  }

  async obtenerProgramacionSemanal(fechaInicio: string, idSede?: number): Promise<TourProgramado[]> {
    const params = new URLSearchParams();
    params.append('fecha_inicio', fechaInicio);
    
    if (idSede) {
      params.append('id_sede', idSede.toString());
    }
    
    const response = await this.httpClient.get(`${endpoints.tourProgramado.programacionSemanal}?${params.toString()}`);
    return response.data.data;
  }

  async obtenerToursDisponiblesEnFecha(fecha: string, idSede?: number): Promise<TourProgramado[]> {
    const params = new URLSearchParams();
    
    if (idSede) {
      params.append('id_sede', idSede.toString());
    }
    
    const url = params.toString() 
      ? `${endpoints.tourProgramado.disponiblesEnFecha(fecha)}?${params.toString()}` 
      : endpoints.tourProgramado.disponiblesEnFecha(fecha);
      
    const response = await this.httpClient.get(url);
    return response.data.data;
  }

  async obtenerToursDisponiblesEnRangoFechas(fechaInicio: string, fechaFin: string, idSede?: number): Promise<TourProgramado[]> {
    const params = new URLSearchParams();
    params.append('fecha_inicio', fechaInicio);
    params.append('fecha_fin', fechaFin);
    
    if (idSede) {
      params.append('id_sede', idSede.toString());
    }
    
    const response = await this.httpClient.get(`${endpoints.tourProgramado.disponiblesEnRango}?${params.toString()}`);
    return response.data.data;
  }

  async verificarDisponibilidadHorario(idHorario: number, fecha: string): Promise<DisponibilidadHorario> {
    const params = new URLSearchParams();
    params.append('id_horario', idHorario.toString());
    params.append('fecha', fecha);
    
    const response = await this.httpClient.get(`${endpoints.tourProgramado.verificarDisponibilidad}?${params.toString()}`);
    return response.data.data;
  }

  async programarTourSemanal(fechaInicio: string, tourBase: NuevoTourProgramadoRequest, cantidadDias: number): Promise<number[]> {
    const params = new URLSearchParams();
    params.append('fecha_inicio', fechaInicio);
    params.append('cantidad_dias', cantidadDias.toString());
    
    const response = await this.httpClient.post(`${endpoints.tourProgramado.programarSemanal}?${params.toString()}`, tourBase);
    return response.data.data.ids;
  }
}