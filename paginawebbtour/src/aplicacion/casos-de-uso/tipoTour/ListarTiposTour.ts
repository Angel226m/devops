 
import { TipoTour } from "../../../dominio/entidades/TipoTour";
import { RepositorioTipoTour } from "../../puertos/salida/RepositorioTipoTour";

export class ListarTiposTour {
  constructor(private repositorioTipoTour: RepositorioTipoTour) {}

  async ejecutar(): Promise<TipoTour[]> {
    return await this.repositorioTipoTour.listar();
  }
}