import { GaleriaTourUpdateRequest } from "../../../domain/entities/GaleriaTour";
import { GaleriaTourRepository } from "../../ports/out/GaleriaTourRepository";

export class ActualizarGaleriaTour {
  constructor(private galeriaTourRepository: GaleriaTourRepository) {}

  async execute(id: number, galeria: GaleriaTourUpdateRequest): Promise<void> {
    await this.galeriaTourRepository.update(id, galeria);
  }
}