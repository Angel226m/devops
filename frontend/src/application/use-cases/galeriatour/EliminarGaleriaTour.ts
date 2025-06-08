import { GaleriaTourRepository } from "../../ports/out/GaleriaTourRepository";

export class EliminarGaleriaTour {
  constructor(private galeriaTourRepository: GaleriaTourRepository) {}

  async execute(id: number): Promise<void> {
    await this.galeriaTourRepository.delete(id);
  }
}