import { GaleriaTour } from "../../../dominio/entidades/GaleriaTour";
import { RepositorioGaleriaTour } from "../../puertos/salida/RepositorioGaleriaTour";

export class ListarGaleriaTour {
  constructor(private repositorioGaleriaTour: RepositorioGaleriaTour) {}

  async ejecutar(): Promise<GaleriaTour[]> {
    return await this.repositorioGaleriaTour.listar();
  }
}