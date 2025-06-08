import { TipoPasaje } from "../../../dominio/entidades/TipoPasaje";
import { RepositorioTipoPasaje } from "../../puertos/salida/RepositorioTipoPasaje";

export class ListarTiposPasajePorTipoTour {
  constructor(private repositorioTipoPasaje: RepositorioTipoPasaje) {}

  async ejecutar(idTipoTour: number): Promise<TipoPasaje[]> {
    return await this.repositorioTipoPasaje.listarPorTipoTour(idTipoTour);
  }
}