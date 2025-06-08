 
import { TipoTour } from "../../../dominio/entidades/TipoTour";
import { RepositorioTipoTour } from "../../puertos/salida/RepositorioTipoTour";

export class ListarTourPorSede {
  constructor(private repositorioTipoTour: RepositorioTipoTour) {}

  async ejecutar(idSede: number): Promise<TipoTour[]> {
    return await this.repositorioTipoTour.listarPorSede(idSede);
  }
}