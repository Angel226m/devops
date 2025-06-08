import { GaleriaTour } from "../../../dominio/entidades/GaleriaTour";

export interface RepositorioGaleriaTour {
  listar(): Promise<GaleriaTour[]>;
  obtenerPorId(id: number): Promise<GaleriaTour | null>;
  listarPorTipoTour(idTipoTour: number): Promise<GaleriaTour[]>;
}