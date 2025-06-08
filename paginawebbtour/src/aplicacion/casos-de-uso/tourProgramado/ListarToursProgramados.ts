 
import { TourProgramado } from "../../../dominio/entidades/TourProgramado";
import { RepositorioTourProgramado } from "../../puertos/salida/RepositorioTourProgramado";

export class ListarToursProgramados {
  constructor(private repositorioTourProgramado: RepositorioTourProgramado) {}

  async ejecutar(): Promise<TourProgramado[]> {
    return await this.repositorioTourProgramado.listar();
  }
}