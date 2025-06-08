 
import { PaquetePasajes } from "../../../dominio/entidades/PaquetePasajes";
import { RepositorioPaquetePasajes } from "../../puertos/salida/RepositorioPaquetePasajes";

export class ListarPaquetesPasajes {
  constructor(private repositorioPaquetePasajes: RepositorioPaquetePasajes) {}

  async ejecutar(): Promise<PaquetePasajes[]> {
    return await this.repositorioPaquetePasajes.listar();
  }
}