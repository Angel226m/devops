 
import { TipoTour } from "../../../dominio/entidades/TipoTour";
import { ListarTiposTour } from "../../casos-de-uso/tipoTour/ListarTiposTour";
import { ObtenerTipoTourPorId } from "../../casos-de-uso/tipoTour/ObtenerTipoTourPorId";
import { ListarTourPorSede } from "../../casos-de-uso/tipoTour/ListarTourPorSede";

export class ControladorTipoTour {
  constructor(
    private listarTiposTour: ListarTiposTour,
    private obtenerTipoTourPorId: ObtenerTipoTourPorId,
    private listarTourPorSede: ListarTourPorSede
  ) {}

  async listar(): Promise<TipoTour[]> {
    return await this.listarTiposTour.ejecutar();
  }

  async obtenerPorId(id: number): Promise<TipoTour | null> {
    return await this.obtenerTipoTourPorId.ejecutar(id);
  }

  async listarPorSede(idSede: number): Promise<TipoTour[]> {
    return await this.listarTourPorSede.ejecutar(idSede);
  }
}