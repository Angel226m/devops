import { GaleriaTour } from "../../../dominio/entidades/GaleriaTour";
import { RepositorioGaleriaTour } from "../../puertos/salida/RepositorioGaleriaTour";

export class ListarGaleriaTourPorTipoTour {
  constructor(private repositorioGaleriaTour: RepositorioGaleriaTour) {}

  async ejecutar(idTipoTour: number): Promise<GaleriaTour[]> {
    return await this.repositorioGaleriaTour.listarPorTipoTour(idTipoTour);
  }
}