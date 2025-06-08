import { GaleriaTour } from "../../../domain/entities/GaleriaTour";
import { GaleriaTourRepository } from "../../ports/out/GaleriaTourRepository";

export class ListarGaleriaTourPorTipoTour {
  constructor(private galeriaTourRepository: GaleriaTourRepository) {}

  async execute(idTipoTour: number): Promise<GaleriaTour[]> {
    return await this.galeriaTourRepository.listByTipoTour(idTipoTour);
  }
}