 
import { TourProgramado, FiltrosTourProgramado } from "../../../dominio/entidades/TourProgramado";
import { ListarToursProgramados } from "../../casos-de-uso/tourProgramado/ListarToursProgramados";
import { ObtenerTourProgramadoPorId } from "../../casos-de-uso/tourProgramado/ObtenerTourProgramadoPorId";
import { ListarToursDisponiblesSinDuplicados } from "../../casos-de-uso/tourProgramado/ListarToursDisponiblesSinDuplicados";
import { ListarToursProgramadosPorFiltros } from "../../casos-de-uso/tourProgramado/ListarToursProgramadosPorFiltros";

export class ControladorTourProgramado {
  constructor(
    private listarToursProgramados: ListarToursProgramados,
    private obtenerTourProgramadoPorId: ObtenerTourProgramadoPorId,
    private listarToursDisponiblesSinDuplicados: ListarToursDisponiblesSinDuplicados,
    private listarToursProgramadosPorFiltros: ListarToursProgramadosPorFiltros
  ) {}

  async listar(): Promise<TourProgramado[]> {
    return await this.listarToursProgramados.ejecutar();
  }

  async obtenerPorId(id: number): Promise<TourProgramado | null> {
    return await this.obtenerTourProgramadoPorId.ejecutar(id);
  }

  async listarDisponiblesSinDuplicados(): Promise<TourProgramado[]> {
    return await this.listarToursDisponiblesSinDuplicados.ejecutar();
  }

  async listarPorFiltros(filtros: FiltrosTourProgramado): Promise<TourProgramado[]> {
    return await this.listarToursProgramadosPorFiltros.ejecutar(filtros);
  }
}