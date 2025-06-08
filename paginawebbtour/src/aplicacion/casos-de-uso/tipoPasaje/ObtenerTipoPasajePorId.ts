import { TipoPasaje } from "../../../dominio/entidades/TipoPasaje";
import { RepositorioTipoPasaje } from "../../puertos/salida/RepositorioTipoPasaje";

export class ObtenerTipoPasajePorId {
  constructor(private repositorioTipoPasaje: RepositorioTipoPasaje) {}

  async ejecutar(id: number): Promise<TipoPasaje | null> {
    return await this.repositorioTipoPasaje.obtenerPorId(id);
  }
}