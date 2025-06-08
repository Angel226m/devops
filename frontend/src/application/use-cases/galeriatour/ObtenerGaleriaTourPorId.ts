import { GaleriaTour } from "../../../domain/entities/GaleriaTour";
import { GaleriaTourRepository } from "../../ports/out/GaleriaTourRepository";

export class ObtenerGaleriaTourPorId {
  constructor(private galeriaTourRepository: GaleriaTourRepository) {}

  async execute(id: number): Promise<GaleriaTour> {
    return await this.galeriaTourRepository.getById(id);
  }
}