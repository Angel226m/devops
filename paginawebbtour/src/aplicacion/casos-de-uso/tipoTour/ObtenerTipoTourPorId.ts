 
import { TipoTour } from "../../../dominio/entidades/TipoTour";
import { RepositorioTipoTour } from "../../puertos/salida/RepositorioTipoTour";

export class ObtenerTipoTourPorId {
  constructor(private repositorioTipoTour: RepositorioTipoTour) {}

  async ejecutar(id: number): Promise<TipoTour | null> {
    return await this.repositorioTipoTour.obtenerPorId(id);
  }
}