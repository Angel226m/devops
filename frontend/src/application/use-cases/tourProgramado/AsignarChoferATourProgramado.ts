import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class AsignarChoferATourProgramado {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(id: number, idChofer: number): Promise<void> {
    return this.tourProgramadoRepository.asignarChofer(id, idChofer);
  }
}