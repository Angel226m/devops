 
import { PaquetePasajes } from "../../../dominio/entidades/PaquetePasajes";
import { RepositorioPaquetePasajes } from "../../puertos/salida/RepositorioPaquetePasajes";

export class ListarPaquetesPasajesPorTipoTour {
  constructor(private repositorioPaquetePasajes: RepositorioPaquetePasajes) {}

  async ejecutar(idTipoTour: number): Promise<PaquetePasajes[]> {
    return await this.repositorioPaquetePasajes.listarPorTipoTour(idTipoTour);
  }
}