 
import { TourProgramado } from "../../../dominio/entidades/TourProgramado";
import { RepositorioTourProgramado } from "../../puertos/salida/RepositorioTourProgramado";

export class ObtenerTourProgramadoPorId {
  constructor(private repositorioTourProgramado: RepositorioTourProgramado) {}

  async ejecutar(id: number): Promise<TourProgramado | null> {
    return await this.repositorioTourProgramado.obtenerPorId(id);
  }
}