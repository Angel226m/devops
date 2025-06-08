import { TipoPasaje } from "../../../dominio/entidades/TipoPasaje";
import { RepositorioTipoPasaje } from "../../puertos/salida/RepositorioTipoPasaje";

export class ListarTiposPasaje {
  constructor(private repositorioTipoPasaje: RepositorioTipoPasaje) {}

  async ejecutar(): Promise<TipoPasaje[]> {
    return await this.repositorioTipoPasaje.listar();
  }
}