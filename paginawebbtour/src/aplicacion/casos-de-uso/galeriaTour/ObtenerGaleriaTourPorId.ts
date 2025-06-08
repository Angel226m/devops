import { GaleriaTour } from "../../../dominio/entidades/GaleriaTour";
import { RepositorioGaleriaTour } from "../../puertos/salida/RepositorioGaleriaTour";

export class ObtenerGaleriaTourPorId {
  constructor(private repositorioGaleriaTour: RepositorioGaleriaTour) {}

  async ejecutar(id: number): Promise<GaleriaTour | null> {
    return await this.repositorioGaleriaTour.obtenerPorId(id);
  }
}