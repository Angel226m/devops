import { TipoPasaje } from "../../../dominio/entidades/TipoPasaje";
import { RepositorioTipoPasaje } from "../../puertos/salida/RepositorioTipoPasaje";

export class ListarTiposPasajePorSede {
  constructor(private repositorioTipoPasaje: RepositorioTipoPasaje) {}

  async ejecutar(idSede: number): Promise<TipoPasaje[]> {
    return await this.repositorioTipoPasaje.listarPorSede(idSede);
  }
}