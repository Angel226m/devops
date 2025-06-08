 
import { PaquetePasajes } from "../../../dominio/entidades/PaquetePasajes";
import { RepositorioPaquetePasajes } from "../../puertos/salida/RepositorioPaquetePasajes";

export class ObtenerPaquetePasajesPorId {
  constructor(private repositorioPaquetePasajes: RepositorioPaquetePasajes) {}

  async ejecutar(id: number): Promise<PaquetePasajes | null> {
    return await this.repositorioPaquetePasajes.obtenerPorId(id);
  }
}