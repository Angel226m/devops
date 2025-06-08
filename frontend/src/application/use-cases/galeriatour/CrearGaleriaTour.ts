import { GaleriaTourRequest } from "../../../domain/entities/GaleriaTour";
import { GaleriaTourRepository } from "../../ports/out/GaleriaTourRepository";

export class CrearGaleriaTour {
  constructor(private galeriaTourRepository: GaleriaTourRepository) {}

  async execute(galeria: GaleriaTourRequest): Promise<number> {
    return await this.galeriaTourRepository.create(galeria);
  }
}