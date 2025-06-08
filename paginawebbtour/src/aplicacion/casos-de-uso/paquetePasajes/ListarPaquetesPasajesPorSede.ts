 
import { PaquetePasajes } from "../../../dominio/entidades/PaquetePasajes";
import { RepositorioPaquetePasajes } from "../../puertos/salida/RepositorioPaquetePasajes";

export class ListarPaquetesPasajesPorSede {
  constructor(private repositorioPaquetePasajes: RepositorioPaquetePasajes) {}

  async ejecutar(idSede: number): Promise<PaquetePasajes[]> {
    return await this.repositorioPaquetePasajes.listarPorSede(idSede);
  }
}